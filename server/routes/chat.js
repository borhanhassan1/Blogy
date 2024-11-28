const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai");
const Post = require("../models/Post");

const authMiddleware = require("../middlewares/authMiddleware");
const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const chatHistories = {};

async function getResponse(prompts) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: prompts,
    });

    // Log or return the response
    console.log(response.choices[0].message.content);
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error connecting to OpenAI API:", error);
  }
}
const restrict = `"You are a specialized assistant with exclusive
         access to the content from a blog post.'
          Your responses should be strictly based on the information in this
           blog post, and you should not bring in outside knowledge.
            Only answer questions with details found within the text,
             and if something isn’t covered, respond with:
              'The blog does not cover this topic. '
              i will give u the blog in next prompt
`;
router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const postId = req.body.id;
    const userContent = req.body.content;

    // Initialize chat history for this post if it doesn't exist
    if (!chatHistories[postId]) {
      chatHistories[postId] = [
        {
          role: "system",
          content: restrict,
        },
      ];
    }

    const post = await Post.findOne({ _id: postId });
    if (post) {
      // Push blog content to messages only once per blog
      if (chatHistories[postId].length === 1) {
        chatHistories[postId].push({
          role: "system",
          content: "this is the blog" + post.body,
        });
      }

      // Push user's message
      chatHistories[postId].push({
        role: "user",
        content:
          "just answer from the blog say the blog not cover this if u can't answer " +
          userContent,
      });

      // Get the response from OpenAI
      const msg = await getResponse(chatHistories[postId]);

      // Push the assistant's response to history

      return res.json({ msg });
    } else {
      return res.status(404).json({ error: "Blog not found" });
    }
  } catch (err) {
    console.error("Error handling chat:", err);
    return res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
