const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true }, // Reference to the parent comment
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who replied
  text: { type: String, required: true }, // Reply content
  taggedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Tagged user in the reply
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Reply = mongoose.model("Reply", ReplySchema);
module.exports = Reply;
