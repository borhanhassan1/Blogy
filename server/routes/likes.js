const express = require("express");
const router = express.Router();
const Likes = require("../models/UserLikes");
const Post = require("../models/Post");
const authMiddleware = require("../middlewares/authMiddleware");
router.post("/likes/like/:blogId", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;
    await Likes.create({ userId, blogId });
    await Post.updateOne({ _id: blogId }, { $inc: { likes: 1 } });
    res.status(201).json({ message: "Like added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/likes/dislike/:blogId", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;
    await Likes.create({ userId, blogId });
    await Post.updateOne({ _id: blogId }, { $inc: { likes: -1 } });
    res.status(201).json({ message: "Like added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/likes/check/:blogId", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const blogId = req.params.blogId;
    const liked = await Likes.findOne({ userId, blogId });
    if (liked) res.json({ liked: true });
    else res.json({ liked: false });
  } catch (err) {
    res.status(500).json({ message: "Interal server error" });
  }
});
module.exports = router;
