const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Comment = require("../models/Comment");
const User = require("../models/User");
router.post("/comment", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const blogId = req.body.blogId;
    const content = req.body.content;
    const user = await User.findById(userId, { username: 1 });
    console.log(user.username);
    console.log(blogId);
    console.log(content);
    await Comment.create({ userName: user.username, blogId, content });
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});
router.get("/comment/:blogId", authMiddleware, async (req, res) => {
  try {
    const blogId = req.params.blogId;
    const comments = await Comment.find({ blogId });
    res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});
module.exports = router;
