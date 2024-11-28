const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const jwtSecret = process.env.jwtSecret;

const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", async (req, res) => {
  const locals = {
    title: "Blogs",
    desc: "simple Blog Project",
  };

  try {
    let perPage = 4;
    let page = req.query.page || 1;
    if (page != 1 && !req.cookies.token) {
      return res.redirect("/login");
    } else {
      const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

      const count = await Post.countDocuments({});
      const nextPage = parseInt(page) + 1;
      const hasNextPage = nextPage <= Math.ceil(count / perPage);
      const prevPage = page > 1 ? page - 1 : null;

      res.render("index", {
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        prevPage,
        d: 1,
      });
    }
  } catch (err) {
    console.error(err);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    if (!req.cookies.token) {
      return res.redirect("/login");
    }
    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("post", {
      locals,
      data,
      currentRoute: `/post/${slug}`,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.post("/search", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      data,
      locals,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", async (req, res) => {
  if (req.cookies.token) {
    res.redirect("/");
  }
  try {
    const locals = {
      title: "Login",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("login", { locals });
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const role = user.role;
    const token = jwt.sign({ userId: user._id, role }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    if (role == "user") res.redirect("/");
    else res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});
router.get("/api/auth/status", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    const decoded = jwt.verify(token, jwtSecret);
    const role = decoded.role;
    res.json({ loggedIn: true, role });
  } else {
    res.json({ loggedIn: false });
  }
});

router.get("/register", async (req, res) => {
  try {
    const locals = {
      title: "Reister",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    };

    res.render("register", { locals });
  } catch (error) {
    console.log(error);
  }
});
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      const token = jwt.sign({ userId: user._id }, jwtSecret);
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/");
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
