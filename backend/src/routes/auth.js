const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const router = express.Router();

// POST /api/auth/login — sirf owner login kar sakta hai
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email aur password required hai" });
  }

  const owner = await prisma.owner.findUnique({ where: { email } });
  if (!owner) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, owner.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: owner.id, email: owner.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  await prisma.activityLog.create({
    data: { action: "login", detail: `Owner logged in: ${email}` },
  });

  res.json({ token, email: owner.email });
});

module.exports = router;
