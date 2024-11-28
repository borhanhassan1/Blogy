const moongose = require("mongoose");
const Schema = moongose.Schema;

const UserLikesSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  blogId: {
    type: String,
    required: true,
  },
});

module.exports = moongose.model("UserLikes", UserLikesSchema);
