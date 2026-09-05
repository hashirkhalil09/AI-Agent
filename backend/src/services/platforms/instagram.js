// Instagram connector — Meta Graph API (Instagram Business/Creator account required,
// linked to a Facebook Page). Phase 2: same Meta Developer App as Facebook.
// Flow: 1) POST /{ig-user-id}/media (create container)  2) POST /{ig-user-id}/media_publish

const axios = require("axios");

async function publish(account, post) {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token || !account.externalId) {
    throw new Error(
      "Instagram connect nahi hua — META_PAGE_ACCESS_TOKEN aur account.externalId (IG Business User ID) set karo."
    );
  }
  if (!post.imageUrl) {
    throw new Error("Instagram ke liye image zaroori hai (text-only post allowed nahi hai).");
  }

  const createRes = await axios.post(
    `https://graph.facebook.com/v19.0/${account.externalId}/media`,
    { image_url: post.imageUrl, caption: post.caption, access_token: token }
  );
  const creationId = createRes.data.id;

  const publishRes = await axios.post(
    `https://graph.facebook.com/v19.0/${account.externalId}/media_publish`,
    { creation_id: creationId, access_token: token }
  );

  return publishRes.data;
}

module.exports = { publish };
