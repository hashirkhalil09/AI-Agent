const express = require("express");
const prisma = require("../config/db");
const requireAuth = require("../middleware/auth");
const { generateContent } = require("../services/aiContent");
const { publishPost } = require("../services/publisher");

const router = express.Router();
router.use(requireAuth);

// GET post history / activity feed
router.get("/", async (req, res) => {
  const { accountId, status } = req.query;
  const where = {};
  if (accountId) where.accountId = accountId;
  if (status) where.status = status;

  const posts = await prisma.post.findMany({
    where,
    include: { account: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json(posts);
});

// POST manually trigger AI to generate a post right now (bypass schedule)
router.post("/generate", async (req, res) => {
  const { accountId, topic, contentType, publishNow } = req.body;
  if (!accountId || !topic) {
    return res.status(400).json({ error: "accountId aur topic required hai" });
  }

  const account = await prisma.socialAccount.findUnique({ where: { id: accountId } });
  if (!account) return res.status(404).json({ error: "Account nahi mila" });

  const generated = await generateContent({
    platform: account.platform,
    topic,
    contentType: contentType || "text_image",
  });

  const post = await prisma.post.create({
    data: {
      accountId,
      caption: generated.caption,
      imageUrl: generated.imageUrl,
      status: publishNow ? "scheduled" : "draft",
    },
  });

  await prisma.activityLog.create({
    data: { action: "post_generated", detail: `Post generated for ${account.displayName}` },
  });

  if (publishNow) {
    const result = await publishPost(post.id);
    return res.json(result);
  }

  res.status(201).json(post);
});

// POST publish an existing draft post
router.post("/:id/publish", async (req, res) => {
  const result = await publishPost(req.params.id);
  res.json(result);
});

module.exports = router;
