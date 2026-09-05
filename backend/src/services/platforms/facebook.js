// Facebook Pages connector — Meta Graph API
// Phase 2 setup: https://developers.facebook.com/ pe app banao, Page Access
// Token lo, META_APP_ID / META_APP_SECRET / META_PAGE_ACCESS_TOKEN .env mein daalo.
// Docs: POST /{page-id}/feed  (text)  ya  /{page-id}/photos  (image + caption)

const axios = require("axios");

async function publish(account, post) {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  if (!token || !account.externalId) {
    throw new Error(
      "Facebook connect nahi hua — META_PAGE_ACCESS_TOKEN aur account.externalId (Page ID) set karo."
    );
  }

  const endpoint = post.imageUrl
    ? `https://graph.facebook.com/v19.0/${account.externalId}/photos`
    : `https://graph.facebook.com/v19.0/${account.externalId}/feed`;

  const payload = post.imageUrl
    ? { url: post.imageUrl, caption: post.caption, access_token: token }
    : { message: post.caption, access_token: token };

  const res = await axios.post(endpoint, payload);
  return res.data;
}

module.exports = { publish };
