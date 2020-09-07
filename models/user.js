var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");


userSchema = new mongoose.Schema({
	username: String,
	password: String
});

userSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User", userSchema);