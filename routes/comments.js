var express = require("express");
var router = express.Router({mergeParams: true});
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware");



//comment new
router.get("/new", middleware.isLoggedin, function(req, res){
	campground.findById(req.params.id, function(err, found_camp){
		if (err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground: found_camp});
		}
	})
	
});


//comment create
router.post("/",  middleware.isLoggedin, function(req, res){
	campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
		}
		else{
			//console.log(req.body.comment);
			comment.create(req.body.comment, function(err, comment){
				if (err){
					req.flash("error", "Something went wrong, try again later");
					console.log(err);
				}
				else{
					//console.log(req.user.username);
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save(); 
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment added successfully");
					res.redirect(/campgrounds/ + campground._id);
				}
			})
		}
	});		
});


//edit
router.get("/:comment_id/edit", middleware.comment_authorization, function(req, res){
	comment.findById(req.params.comment_id, function(err, found_comment){
		if (err){
			console.log(err);
			req.flash("error", "Comment not found");
			res.redirect("back");
		}
		else{
			campground.findById(req.params.id, function(err, campground){
				if(err){
					console.log(err);
					req.flash("error", "Campground not found");
					res.redirect("back");
				}
				else{
					res.render("comments/edit", {campground: campground, comment: found_comment});
				}
			})
			
		}
	})
	
});

//update
router.put("/:comment_id", middleware.comment_authorization, function(req, res){
	comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated_comment){
		if (err){
			console.log(err);
			req.flash("error", "Comment not found");
			res.redirect("back");
		}
		else{
			req.flash("success", "Updated comment successfully");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});


//destroy

router.delete("/:comment_id", middleware.comment_authorization, function(req, res){
	//res.send("delete");
	comment.findByIdAndRemove(req.params.comment_id, function(err, deleted_comment){
		if (err){
			console.log(err);
			req.flash("error", "Comment not found");
			res.redirect("back");
		}
		else{
			req.flash("success", "Deleted comment successfully");
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});



module.exports = router;

