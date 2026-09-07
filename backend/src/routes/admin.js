const express = require("express");
const prisma = require("../config/db");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// Tables that hold app data (safe to wipe without breaking login).
// "Owner" (login accounts) is intentionally excluded by default — clearing it
// would log everyone out and block logins until the server restarts and
// recreates a default owner from OWNER_EMAIL/OWNER_PASSWORD.
const DATA_TABLES = ["Post", "Schedule", "SocialAccount", "ActivityLog"];

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
// body: { includeOwners: boolean }  (default false)
router.post("/clear-database", async (req, res) => {
  const includeOwners = req.body && req.body.includeOwners === true;

  try {
    const tables = includeOwners ? [...DATA_TABLES, "Owner"] : DATA_TABLES;
    const quoted = tables.map((t) => `"${t}"`).join(", ");

    // TRUNCATE ... CASCADE clears the tables (and anything referencing them)
    // and RESTART IDENTITY resets auto-increment/sequence counters.
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${quoted} RESTART IDENTITY CASCADE;`
    );

    // Reclaim the freed disk space immediately instead of waiting for
    // Postgres's normal autovacuum cycle.
    await prisma.$executeRawUnsafe("VACUUM FULL;");

    if (!includeOwners) {
      await prisma.activityLog.create({
        data: {
          action: "db_cleared",
          detail: `Database cleared from dashboard by ${req.owner.email}`,
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
