const express = require("express");
const prisma = require("../config/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET all schedules (optionally filter by accountId)
router.get("/", async (req, res) => {
  try {
    const { accountId } = req.query;
    const where = accountId ? { accountId } : {};
    const schedules = await prisma.schedule.findMany({
      where,
      include: { account: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(schedules);
  } catch (err) {
    console.error("GET /api/schedules failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST create a schedule — apni marzi ka time/frequency + topic
// cronExpression example: "0 9,18 * * *" = daily 9am and 6pm
router.post("/", async (req, res) => {
  try {
    const { accountId, cronExpression, contentTopic, contentType } = req.body;
    if (!accountId || !cronExpression || !contentTopic) {
      return res.status(400).json({
        error: "accountId, cronExpression aur contentTopic required hai",
      });
    }
    const schedule = await prisma.schedule.create({
      data: {
        accountId,
        cronExpression,
        contentTopic,
        contentType: contentType || "text_image",
      },
    });
    res.status(201).json(schedule);
  } catch (err) {
    console.error("POST /api/schedules failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH update / pause a schedule
router.patch("/:id", async (req, res) => {
  try {
    const { cronExpression, contentTopic, active } = req.body;
    const schedule = await prisma.schedule.update({
      where: { id: req.params.id },
      data: { cronExpression, contentTopic, active },
    });
    res.json(schedule);
  } catch (err) {
    console.error("PATCH /api/schedules/:id failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove a schedule
router.delete("/:id", async (req, res) => {
  try {
    await prisma.schedule.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/schedules/:id failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
