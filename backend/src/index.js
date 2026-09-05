require("dotenv").config();
const bcrypt = require("bcryptjs");
const app = require("./app");
const prisma = require("./config/db");

const PORT = process.env.PORT || 5000;

async function ensureOwnerExists() {
  const count = await prisma.owner.count();
  if (count > 0) return;

  const email = process.env.OWNER_EMAIL;
  const password = process.env.OWNER_PASSWORD;
  if (!email || !password) {
    console.warn(
      "⚠️  Koi owner account nahi hai aur OWNER_EMAIL/OWNER_PASSWORD .env mein set nahi — login nahi ho sakega."
    );
    return;
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.owner.create({ data: { email, password: hashed } });
  console.log(`✅ Owner account bana: ${email}`);
}

async function start() {
  await ensureOwnerExists();
  app.listen(PORT, () => {
    console.log(`🚀 API server chal raha hai: http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Server start nahi ho saka:", err);
  process.exit(1);
});
