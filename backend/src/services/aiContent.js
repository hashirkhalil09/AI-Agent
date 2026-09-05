const axios = require("axios");

/**
 * Generates caption text via Claude API, and an image via the configured
 * image AI provider. If API keys are not set yet (Phase 1 testing without
 * keys), it returns clearly-marked placeholder content so the rest of the
 * pipeline (scheduling, publishing, dashboard) can still be tested end to end.
 */
async function generateContent({ platform, topic, contentType }) {
  const caption = await generateCaption({ platform, topic });

  let imageUrl = null;
  if (contentType === "text_image") {
    imageUrl = await generateImage(topic);
  }

  return { caption, imageUrl };
}

async function generateCaption({ platform, topic }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return `[PLACEHOLDER] ${platform} post about: ${topic} — ANTHROPIC_API_KEY set karo asli caption ke liye.`;
  }

  const prompt = `Likho ek engaging, natural ${platform} post caption is topic par: "${topic}".
Platform ke tone ke mutabiq likho (${platform === "linkedin" ? "professional" : "casual, engaging"}).
Sirf caption text do, koi extra explanation nahi. Hashtags zaroori ho to 2-3 se zyada mat lagao.`;

  const response = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
    }
  );

  const textBlock = response.data.content.find((b) => b.type === "text");
  return textBlock ? textBlock.text.trim() : `Post about ${topic}`;
}

async function generateImage(topic) {
  const apiKey = process.env.IMAGE_AI_API_KEY;
  if (!apiKey) {
    // Placeholder image so the pipeline is fully testable without a key.
    return `https://placehold.co/1080x1080?text=${encodeURIComponent(topic).slice(0, 40)}`;
  }

  // Phase 2: yahan apna chosen image API (Ideogram / Flux / DALL-E) ka
  // real call daalna hai. Structure ready rakha hai taake sirf ye function
  // replace karni pade, baaki system untouched rahe.
  throw new Error("Image AI provider abhi connect nahi hua — services/aiContent.js mein generateImage() complete karo.");
}

module.exports = { generateContent };
