require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const path = require("path");

const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const session = require("express-session");
const connectDB = require("./server/config/db");
const methodOverride = require("method-override");
const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    //cookie: { maxAge: new Date ( Date.now() + (3600000) ) }
  })
);
app.use(flash());

app.use(expressLayout);
app.set("views", path.join(__dirname, "views"));
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");
app.use("/", require("./server/routes/Upload"));
app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));
app.use("/", require("./server/routes/likes"));
app.use("/", require("./server/routes/chat"));
app.use("/", require("./server/routes/comment"));
app.listen(PORT, () => {
  console.log("app listening ....");
});
