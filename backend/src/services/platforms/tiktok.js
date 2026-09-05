// TikTok connector — TikTok Content Posting API (photo posts, Direct Post).
// Uses a single-account owner token from .env (TIKTOK_ACCESS_TOKEN /
// TIKTOK_OPEN_ID), obtained once via the /tiktok/auth OAuth flow in app.js.
//
// Sandbox note: unaudited apps are restricted to SELF_ONLY (private) posts
// — that's expected and fine for testing. Access token expires every 24h;
// when it does, redo the /tiktok/auth flow and update the env vars.

const axios = require("axios");

const API_BASE = "https://open.tiktokapis.com/v2";

async function publish(account, post) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const baseUrl = process.env.PUBLIC_BASE_URL; // e.g. https://ai-agent-ehwt.onrender.com

  if (!accessToken) {
    throw new Error(
      "TikTok connect nahi hua — pehle /tiktok/auth se authorize karo aur TIKTOK_ACCESS_TOKEN .env mein daalo."
    );
  }
  if (!post.imageUrl) {
    throw new Error("TikTok photo post ke liye image zaroori hai.");
  }
  if (!baseUrl) {
    throw new Error(
      "PUBLIC_BASE_URL .env mein set nahi hai (e.g. https://ai-agent-ehwt.onrender.com) — TikTok ko image dikhane ke liye zaroori hai."
    );
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json; charset=UTF-8",
  };

  // 1) Query creator info — required before Direct Post, also tells us
  //    which privacy_level values this account/app combo is allowed to use.
  let creatorRes;
  try {
    creatorRes = await axios.post(`${API_BASE}/post/publish/creator_info/query/`, {}, { headers });
  } catch (err) {
    // DIAGNOSTIC: surface TikTok's actual error body instead of a generic
    // "Request failed with status code XXX" so the real cause is visible
    // in errorMsg / Activity Log.
    throw new Error(
      `creator_info/query failed (HTTP ${err.response?.status}): ${JSON.stringify(err.response?.data || err.message)}`
    );
  }

  const privacyOptions = creatorRes.data?.data?.privacy_level_options || [];
  const privacyLevel = privacyOptions.includes("SELF_ONLY")
    ? "SELF_ONLY"
    : privacyOptions[0];

  if (!privacyLevel) {
    throw new Error("TikTok creator_info se koi privacy_level_options nahi mila — account setup check karo.");
  }

  // 2) Our own domain proxies the AI-generated image, since PULL_FROM_URL
  //    only accepts URLs under a domain this app has verified ownership of.
  const photoUrl = `${baseUrl.replace(/\/$/, "")}/media/${post.id}`;

  // 3) Initialize the direct post.
  let initRes;
  try {
    initRes = await axios.post(
      `${API_BASE}/post/publish/content/init/`,
      {
        post_info: {
          title: post.caption.slice(0, 90),
          description: post.caption.slice(0, 4000),
          privacy_level: privacyLevel,
          disable_comment: false,
        },
        source_info: {
          source: "PULL_FROM_URL",
          photo_cover_index: 0,
          photo_images: [photoUrl],
        },
        post_mode: "DIRECT_POST",
        media_type: "PHOTO",
      },
      { headers }
    );
  } catch (err) {
    // DIAGNOSTIC: same as above — surface the real TikTok error body.
    throw new Error(
      `content/init failed (HTTP ${err.response?.status}): ${JSON.stringify(err.response?.data || err.message)}`
    );
  }

  if (initRes.data?.error?.code && initRes.data.error.code !== "ok") {
    throw new Error(`TikTok init error: ${initRes.data.error.code} — ${initRes.data.error.message}`);
  }

  return initRes.data;
}

module.exports = { publish };
