// TikTok connector — TikTok for Developers, Content Posting API (Business
// accounts only, app review required by TikTok before it works in production).
// Phase 2 setup: developers.tiktok.com pe app banao, review submit karo,
// TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET .env mein daalo.

async function publish(account, post) {
  const key = process.env.TIKTOK_CLIENT_KEY;
  if (!key || !account.externalId) {
    throw new Error("TikTok connect nahi hua — TIKTOK_CLIENT_KEY aur account access set karo.");
  }

  throw new Error("TikTok publish logic Phase 2 mein complete hoga (video pipeline + app review ke baad).");
}

module.exports = { publish };
