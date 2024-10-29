const mongoose = require("mongoose");
const Comment = new mongoose.Schema({
    rental: { type: mongoose.Schema.Types.ObjectId, ref: "RentalItem", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
    taggedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, default: null },
});


const comment = mongoose.model("Comment", Comment);
module.exports = comment