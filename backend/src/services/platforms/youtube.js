// YouTube connector — YouTube Data API v3 (Google Cloud project + OAuth required).
// Phase 1 mein sirf "Community Post" ya video-caption type text posting scope
// rakha hai; video upload phase 2 mein (AI video generation ke saath) add hoga.
// Phase 2 setup: console.cloud.google.com pe project banao, OAuth client id/secret
// lo, ek baar refresh token generate karo, .env mein daalo.

async function publish(account, post) {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
  if (!clientId || !refreshToken || !account.externalId) {
    throw new Error(
      "YouTube connect nahi hua — YOUTUBE_CLIENT_ID/REFRESH_TOKEN aur channel externalId set karo."
    );
  }

  // Phase 2: googleapis package se authenticated client banao aur
  // youtube.videos.insert ya community post endpoint call karo.
  throw new Error("YouTube publish logic Phase 2 mein complete hoga (video pipeline ke saath).");
}

module.exports = { publish };
