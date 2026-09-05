// X (Twitter) connector — X API v2 (developer.x.com pe app + paid tier chahiye
// posting ke liye). Phase 2 setup: X_API_KEY / X_API_SECRET / X_ACCESS_TOKEN /
// X_ACCESS_SECRET .env mein daalo.

const axios = require("axios");

async function publish(account, post) {
  const apiKey = process.env.X_API_KEY;
  if (!apiKey) {
    throw new Error("X (Twitter) connect nahi hua — X_API_KEY waghera .env mein set karo.");
  }

  // Phase 2: OAuth 1.0a signing (npm package "oauth-1.0a" ya "twitter-api-v2")
  // se POST /2/tweets call karo. Image ho to pehle media upload endpoint use karo.
  throw new Error("X publish logic Phase 2 mein complete hoga (OAuth signing chahiye).");
}

module.exports = { publish };
