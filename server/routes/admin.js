const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

const adminLayout = "../views/layouts/admin";

const authMiddleware = require("../middlewares/authMiddleware");

function verifyAdminRole(req, res, next) {
  if (req.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
}

router.get("/dashboard", authMiddleware, verifyAdminRole, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    const data = await Post.find();
    res.render("admin/dashboard", {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/add-post", authMiddleware, verifyAdminRole, async (req, res) => {
  try {
    const locals = {
      title: "Add Post",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add-post", authMiddleware, verifyAdminRole, async (req, res) => {
  try {
    try {
      const newPost = new Post({
        title: req.body.title,
        body: req.body.body,
      });

      await Post.create(newPost);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get(
  "/edit-post/:id",
  authMiddleware,
  verifyAdminRole,
  async (req, res) => {
    try {
      const locals = {
        title: "Edit Post",
        description: "Free NodeJs User Management System",
      };

      const data = await Post.findOne({ _id: req.params.id });

      res.render("admin/edit-post", {
        locals,
        data,
        layout: adminLayout,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.put(
  "/edit-post/:id",
  authMiddleware,
  verifyAdminRole,
  async (req, res) => {
    try {
      console.log(req.body.body);
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now(),
      });
      res.redirect(`/edit-post/${req.params.id}`);
    } catch (error) {
      console.log(error);
    }
  }
);

router.delete(
  "/delete-post/:id",
  authMiddleware,
  verifyAdminRole,
  async (req, res) => {
    try {
      await Post.deleteOne({ _id: req.params.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
