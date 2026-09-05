const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/accounts");
const scheduleRoutes = require("./routes/schedules");
const postRoutes = require("./routes/posts");

const app = express();

// Render (aur zyada tar hosting platforms) HTTPS ko proxy ke peeche terminate
// karte hain — iske bina Express req.protocol ko "http" samajh leta hai,
// jisse /tiktok/auth wala redirect_uri galat (http://...) ban jata hai aur
// TikTok "redirect_uri" mismatch error deta hai.
app.set("trust proxy", 1);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "ai-social-agent-api" });
});

// TikTok URL prefix ownership verification file — required once for
// developers.tiktok.com "URL properties" verification. Safe to leave in
// permanently, TikTok may re-check it later.
app.get("/tiktokQKH7eMNhvU7jxUYQxLKGsBNZglTP6tzQ.txt", (req, res) => {
  res
    .type("text/plain")
    .send("tiktok-developers-site-verification=QKH7eMNhvU7jxUYQxLKGsBNZglTP6tzQ");
});

// --- TikTok OAuth (Login Kit redirect URI) ---
// /tiktok/auth  -> kholo browser mein, apne TikTok account se login/consent do
// /tiktok/callback -> TikTok yahan wapas bhejta hai, ye code ko access_token
//                     mein exchange karke screen pe dikha deta hai (copy karke
//                     .env mein TIKTOK_ACCESS_TOKEN/REFRESH_TOKEN/OPEN_ID daalo)
const axios = require("axios");

app.get("/tiktok/auth", (req, res) => {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = `${req.protocol}://${req.get("host")}/tiktok/callback`;
  if (!clientKey) {
    return res.status(500).send("TIKTOK_CLIENT_KEY .env mein set nahi hai.");
  }
  const url =
    `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}` +
    `&scope=video.publish,user.info.basic` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=primeflux`;
  res.redirect(url);
});

app.get("/tiktok/callback", async (req, res) => {
  const { code, error, error_description } = req.query;
  if (error) {
    return res.status(400).send(`TikTok error: ${error} — ${error_description || ""}`);
  }
  if (!code) {
    return res.status(400).send("Koi authorization code nahi mila.");
  }

  const redirectUri = `${req.protocol}://${req.get("host")}/tiktok/callback`;

  try {
    const tokenRes = await axios.post(
      "https://open.tiktokapis.com/v2/oauth/token/",
      new URLSearchParams({
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, open_id, expires_in } = tokenRes.data;

    res.type("html").send(`
      <html><body style="font-family:sans-serif;max-width:700px;margin:40px auto;">
        <h2>✅ TikTok authorized</h2>
        <p>Ye values copy karke Render/​.env mein daalo, phir is page ko band kar do:</p>
        <pre style="background:#eee;padding:16px;white-space:pre-wrap;">
TIKTOK_ACCESS_TOKEN=${access_token}
TIKTOK_REFRESH_TOKEN=${refresh_token}
TIKTOK_OPEN_ID=${open_id}
        </pre>
        <p>Access token expires_in: ${expires_in} seconds — expire hone par refresh_token se renew karna hoga.</p>
      </body></html>
    `);
  } catch (err) {
    res
      .status(500)
      .send(`Token exchange fail hua: ${err.response ? JSON.stringify(err.response.data) : err.message}`);
  }
});

app.get("/terms", (req, res) => {
  res.type("html").send(`
    <html><head><title>PrimeFlux — Terms of Service</title></head>
    <body style="font-family:sans-serif;max-width:700px;margin:40px auto;line-height:1.6;">
      <h1>Terms of Service — PrimeFlux</h1>
      <p>Last updated: ${new Date().toISOString().slice(0, 10)}</p>
      <p>PrimeFlux is a personal content automation tool used to generate and
      schedule social media posts for accounts owned and administered by its
      operator. It is not offered as a public service to third parties.</p>
      <p>By connecting an account to PrimeFlux, the account owner authorizes
      PrimeFlux to generate content and publish posts on their behalf using
      the permissions explicitly granted through each platform's official
      API and OAuth consent screen.</p>
      <p>PrimeFlux does not sell, share, or use connected account data for
      any purpose other than operating the scheduling and publishing
      features described above.</p>
      <p>The operator may suspend or disconnect any account at any time.
      Use of connected platforms remains subject to that platform's own
      Terms of Service and Community Guidelines.</p>
    </body></html>
  `);
});

app.get("/privacy", (req, res) => {
  res.type("html").send(`
    <html><head><title>PrimeFlux — Privacy Policy</title></head>
    <body style="font-family:sans-serif;max-width:700px;margin:40px auto;line-height:1.6;">
      <h1>Privacy Policy — PrimeFlux</h1>
      <p>Last updated: ${new Date().toISOString().slice(0, 10)}</p>
      <p>PrimeFlux stores only the data required to operate the service:
      account identifiers, OAuth tokens issued by connected platforms,
      generated post content, and scheduling/activity logs.</p>
      <p>This data is stored in a private database and is not shared with
      any third party, except as required to call the connected platform's
      official publishing API (e.g. sending a post to TikTok/Meta on the
      account owner's behalf).</p>
      <p>Tokens and data can be deleted at any time by disconnecting the
      relevant account from PrimeFlux.</p>
      <p>Questions about this policy can be directed to the operator of
      this application.</p>
    </body></html>
  `);
});

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/posts", postRoutes);

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error", detail: err.message });
});

module.exports = app;
