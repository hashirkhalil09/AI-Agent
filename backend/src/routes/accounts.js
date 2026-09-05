const express = require("express");
const prisma = require("../config/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET all connected accounts
router.get("/", async (req, res) => {
  try {
    const accounts = await prisma.socialAccount.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(accounts);
  } catch (err) {
    console.error("GET /api/accounts failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST add a new account (platform connection details added later in Phase 2)
router.post("/", async (req, res) => {
  try {
    const { platform, displayName, timezone } = req.body;
    if (!platform || !displayName) {
      return res.status(400).json({ error: "platform aur displayName required hai" });
    }
    const account = await prisma.socialAccount.create({
      data: { platform, displayName, timezone: timezone || "Asia/Karachi" },
    });
    res.status(201).json(account);
  } catch (err) {
    console.error("POST /api/accounts failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// PATCH toggle active/inactive
router.patch("/:id", async (req, res) => {
  try {
    const { active, displayName } = req.body;
    const account = await prisma.socialAccount.update({
      where: { id: req.params.id },
      data: { active, displayName },
    });
    res.json(account);
  } catch (err) {
    console.error("PATCH /api/accounts/:id failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE remove an account
router.delete("/:id", async (req, res) => {
  try {
    await prisma.socialAccount.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/accounts/:id failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
