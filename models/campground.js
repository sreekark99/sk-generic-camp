var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	comments: [
		{
		type: mongoose.Schema.Types.ObjectID,
		ref: "Comment"
		}],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectID,
			ref: "User"
		},
			username: String
	
	}
});



module.exports =  mongoose.model("Campground", campgroundSchema);
