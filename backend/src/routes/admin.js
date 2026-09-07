const express = require("express");
const prisma = require("../config/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// Whitelist of tables the dashboard is allowed to clear. "Owner" is included
// here but the frontend shows a strong warning for it — clearing it logs
// everyone out and blocks logins until the server restarts and recreates a
// default owner from OWNER_EMAIL/OWNER_PASSWORD.
// "_prisma_migrations" is intentionally NOT included — clearing it breaks
// the app permanently.
const ALLOWED_TABLES = ["Post", "Schedule", "SocialAccount", "ActivityLog", "Owner"];

// GET /api/admin/db-info — current database size, for display in the dashboard
router.get("/db-info", async (req, res) => {
  try {
    const result = await prisma.$queryRawUnsafe(
      "SELECT pg_size_pretty(pg_database_size(current_database())) AS size;"
    );
    res.json({ size: result[0].size });
  } catch (err) {
    console.error("GET /api/admin/db-info failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/clear-database
// body: { tables: string[] }  — must be a subset of ALLOWED_TABLES
router.post("/clear-database", async (req, res) => {
  const requested = Array.isArray(req.body?.tables) ? req.body.tables : [];

  // Only allow known table names through — never trust the raw request body
  // directly in a SQL string.
  const tables = requested.filter((t) => ALLOWED_TABLES.includes(t));

  if (tables.length === 0) {
    return res.status(400).json({ error: "No valid tables selected." });
  }

  const clearingOwner = tables.includes("Owner");

  try {
    const quoted = tables.map((t) => `"${t}"`).join(", ");

    // TRUNCATE ... CASCADE clears the selected tables (and anything
    // referencing them) and RESTART IDENTITY resets sequence counters.
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE;`
    );

    // Reclaim the freed disk space immediately instead of waiting for
    // Postgres's normal autovacuum cycle.
    await prisma.$executeRawUnsafe("VACUUM FULL;");

    // Only log the action if ActivityLog itself still exists with data
    // flowing into it (skip if Owner was cleared — req.owner may still be
    // valid for this request, but logging isn't essential in that case).
    if (!clearingOwner) {
      await prisma.activityLog.create({
        data: {
          action: "db_cleared",
          detail: `Cleared tables [${tables.join(", ")}] from dashboard by ${req.owner.email}`,
        },
      });
    }

    const sizeResult = await prisma.$queryRawUnsafe(
      "SELECT pg_size_pretty(pg_database_size(current_database())) AS size;"
    );

    res.json({
      success: true,
      clearedTables: tables,
      newSize: sizeResult[0].size,
    });
  } catch (err) {
    console.error("POST /api/admin/clear-database failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
