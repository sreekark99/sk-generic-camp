//middleware
var campground = require("../models/campground");
var comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.campground_authorization = function(req, res, next){
	if(req.isAuthenticated()){
		campground.findById(req.params.id, function(err, campground_edit){
		if (err){
			console.log(err);
			req.flash("error", "Campground not found");
			res.redirect("back");
		}
		else{
			if (!campground_edit) {
                    req.flash("error", "Campground not found.");
                    return res.redirect("back");
                }
			if (campground_edit.author.id.equals(req.user._id)){
				next();
			}
			else{
				req.flash("error", "Access Denied");
				res.redirect("back");
			}
		}
		});
	}
	else{
		req.flash("error", "You need to be logged in to perform this operation");
		res.redirect("/login");
	}
};


middlewareObj.comment_authorization = function(req, res, next){
	if(req.isAuthenticated()){
		comment.findById(req.params.comment_id, function(err, found_comment){
		if (err){
			console.log(err);
			req.flash("error", "Comment not found");
			res.redirect("back");
		}
		else{
			if (found_comment.author.id.equals(req.user._id)){
				next();
			}
			else{
				req.flash("error", "Access Denied");
				res.redirect("back");
			}
		}
		});
	}
	else{
		req.flash("error", "You need to be logged in to perform this operation");
		res.redirect("back");
	}
};

middlewareObj.isLoggedin = function(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	else{
		req.flash("error", "You need to be logged in to perform this operation");
		res.redirect("/login");
	}
};

module.exports = middlewareObj;