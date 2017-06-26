var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: { type: String, default: '/images/default-avatar.jpg' }

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
