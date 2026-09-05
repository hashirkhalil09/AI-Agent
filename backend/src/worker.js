require("dotenv").config();
const cron = require("node-cron");
const prisma = require("./config/db");
const { generateContent } = require("./services/aiContent");
const { publishPost } = require("./services/publisher");

console.log("🕒 Scheduler worker start ho raha hai...");

// Har minute check karta hai: kaunsi schedules is minute pe due hain.
// (node-cron ek hi process mein multiple dynamic cron expressions handle
// karne ke liye — har schedule row ke liye khud ek cron job register karta hai)

const registeredJobs = new Map(); // scheduleId -> cron task

async function syncSchedules() {
  const schedules = await prisma.schedule.findMany({
    where: { active: true },
    include: { account: true },
  });

  const activeIds = new Set(schedules.map((s) => s.id));

  // Purani/deleted schedules ke jobs hata do
  for (const [id, task] of registeredJobs.entries()) {
    if (!activeIds.has(id)) {
      task.stop();
      registeredJobs.delete(id);
    }
  }

  // Nayi ya updated schedules register karo
  for (const schedule of schedules) {
    if (registeredJobs.has(schedule.id)) continue; // already registered

    if (!cron.validate(schedule.cronExpression)) {
      console.warn(`⚠️  Invalid cron expression, skip: ${schedule.cronExpression}`);
      continue;
    }

    const task = cron.schedule(schedule.cronExpression, () => runSchedule(schedule.id), {
      timezone: schedule.account.timezone || "Asia/Karachi",
    });

    registeredJobs.set(schedule.id, task);
    console.log(`✅ Schedule registered: ${schedule.contentTopic} (${schedule.cronExpression})`);
  }
}

async function runSchedule(scheduleId) {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: { account: true },
  });
  if (!schedule || !schedule.active || !schedule.account.active) return;

  console.log(`⚙️  Running schedule: ${schedule.contentTopic} → ${schedule.account.displayName}`);

  try {
    const generated = await generateContent({
      platform: schedule.account.platform,
      topic: schedule.contentTopic,
      contentType: schedule.contentType,
    });

    const post = await prisma.post.create({
      data: {
        accountId: schedule.accountId,
        caption: generated.caption,
        imageUrl: generated.imageUrl,
        status: "scheduled",
        scheduledAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "post_generated",
        detail: `Auto-generated for ${schedule.account.displayName}: "${schedule.contentTopic}"`,
      },
    });

    // Phase 1: auto-publish turant (jaisa decide hua tha)
    await publishPost(post.id);
  } catch (err) {
    console.error(`❌ Schedule run failed (${schedule.id}):`, err.message);
    await prisma.activityLog.create({
      data: { action: "post_failed", detail: `Schedule ${scheduleId} failed: ${err.message}` },
    });
  }
}

// Har 60 second pe naye/hataye gaye schedules ke liye dobara sync karo
syncSchedules();
setInterval(syncSchedules, 60 * 1000);
