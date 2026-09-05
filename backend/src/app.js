const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/accounts");
const scheduleRoutes = require("./routes/schedules");
const postRoutes = require("./routes/posts");

const app = express();

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
