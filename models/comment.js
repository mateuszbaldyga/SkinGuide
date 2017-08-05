var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      username: String,
      avatar: String
    },
    date: { type: Date, default: Date.now },
    rating: Number,
});

module.exports = mongoose.model("Comment", commentSchema);
