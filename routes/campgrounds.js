var express = require("express");
var router = express.Router();
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware");

//index
router.get("/", function(req, res){
	
	campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});


//create
router.post("/", middleware.isLoggedin, function(req, res){
	//res.send("Post route");
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newobj = {name: name, image: image, description: description, author: author, price: price};
	//campgrounds.push(newobj);
	campground.create(newobj, function(err, newcmp){
		if(err){
			console.log(err);
		}
		else{
			console.log("New camp added");
			req.flash("success", "Campground added.");
			res.redirect("/campgrounds")
		}
	})
	
})


//new
router.get("/new", middleware.isLoggedin, function(req, res){
	res.render("campgrounds/new");
})


//show
router.get("/:id", function(req, res){
	campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/show", {campgrounds: foundCamp});
			console.log(foundCamp);
		}
	});	
});


//EDIT

router.get("/:id/edit", middleware.campground_authorization, function(req, res){
	campground.findById(req.params.id, function(err, campground_edit){
		res.render("campgrounds/edit", {campground: campground_edit});
	});
});



router.put("/:id", middleware.campground_authorization, function(req, res){
	var data = {
		name: req.body.name,
		image: req.body.image,
		description: req.body.description
	};
	campground.findByIdAndUpdate(req.params.id, data, function(err, updated_camp){
		if (err){
			console.log(err);
		}
		else{
			req.flash("success", "Campground data updated successfully.");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


router.delete("/:id", middleware.campground_authorization, function(req, res){
	//res.send("DELETE");
	campground.findById(req.params.id, function(err, found_camp){
		//console.log("found camp");
		//console.log(found_camp.comments);
		var comments_array = found_camp.comments;		
		comments_array.forEach(function(array_obj){
			comment.findByIdAndRemove(array_obj, function(err, del_succ){
				if (err){
					console.log(err);
				}
				else{
					console.log("commented deleted");
				}
				
			});
			//console.log(array_obj);
		});
	});
	campground.findByIdAndRemove(req.params.id, function(err, delete_response){
			if (err){
				console.log(err);
			}
			else{
				console.log("camp deleted");
				req.flash("success", "Campground deleted.");
				res.redirect("/campgrounds");
			}
		});
});




module.exports = router;
