// LinkedIn connector — LinkedIn Marketing API (Company Pages only; personal
// profile automation LinkedIn ToS ke against hai, isliye ye sirf Company Page
// posting ke liye banaya gaya hai). Phase 2 setup: developer.linkedin.com pe
// app banao, Company Page admin access se access token lo.

const axios = require("axios");

async function publish(account, post) {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token || !account.externalId) {
    throw new Error(
      "LinkedIn connect nahi hua — LINKEDIN_ACCESS_TOKEN aur Company Page externalId set karo."
    );
  }

  const res = await axios.post(
    "https://api.linkedin.com/v2/ugcPosts",
    {
      author: `urn:li:organization:${account.externalId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: post.caption },
          shareMediaCategory: post.imageUrl ? "IMAGE" : "NONE",
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    },
    { headers: { Authorization: `Bearer ${token}`, "X-Restli-Protocol-Version": "2.0.0" } }
  );

  return res.data;
}

module.exports = { publish };
