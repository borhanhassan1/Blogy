const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  blogId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
