const express = require("express");
const prisma = require("../config/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET all connected accounts
router.get("/", async (req, res) => {
  const accounts = await prisma.socialAccount.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(accounts);
});

// POST add a new account (platform connection details added later in Phase 2)
router.post("/", async (req, res) => {
  const { platform, displayName, timezone } = req.body;
  if (!platform || !displayName) {
    return res.status(400).json({ error: "platform aur displayName required hai" });
  }
  const account = await prisma.socialAccount.create({
    data: { platform, displayName, timezone: timezone || "Asia/Karachi" },
  });
  res.status(201).json(account);
});

// PATCH toggle active/inactive
router.patch("/:id", async (req, res) => {
  const { active, displayName } = req.body;
  const account = await prisma.socialAccount.update({
    where: { id: req.params.id },
    data: { active, displayName },
  });
  res.json(account);
});

// DELETE remove an account
router.delete("/:id", async (req, res) => {
  await prisma.socialAccount.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

module.exports = router;
