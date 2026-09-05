const prisma = require("../config/db");
const facebook = require("./platforms/facebook");
const instagram = require("./platforms/instagram");
const youtube = require("./platforms/youtube");
const twitter = require("./platforms/twitter");
const linkedin = require("./platforms/linkedin");
const tiktok = require("./platforms/tiktok");

const CONNECTORS = { facebook, instagram, youtube, twitter, linkedin, tiktok };

/**
 * Publishes a post to its account's platform. Each connector file in
 * ./platforms/ implements a publish(account, post) function. Phase 1
 * connectors are stubs that log the action — Phase 2 replaces them with
 * real API calls once developer apps + tokens exist.
 */
async function publishPost(postId) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { account: true },
  });
  if (!post) return { error: "Post nahi mila" };

  const connector = CONNECTORS[post.account.platform];
  if (!connector) {
    return { error: `Koi connector nahi mila platform ke liye: ${post.account.platform}` };
  }

  try {
    const result = await connector.publish(post.account, post);

    await prisma.post.update({
      where: { id: post.id },
      data: { status: "published", publishedAt: new Date() },
    });
    await prisma.activityLog.create({
      data: {
        action: "post_published",
        detail: `Published to ${post.account.displayName} (${post.account.platform})`,
      },
    });

    return { success: true, result };
  } catch (err) {
    await prisma.post.update({
      where: { id: post.id },
      data: { status: "failed", errorMsg: err.message },
    });
    await prisma.activityLog.create({
      data: {
        action: "post_failed",
        detail: `Failed for ${post.account.displayName}: ${err.message}`,
      },
    });
    return { success: false, error: err.message };
  }
}

module.exports = { publishPost };
