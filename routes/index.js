var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");

//root
router.get("/", function(req, res){
	res.render("landing");
});


//signup
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	//res.send("POST");
	user.register(new user({username: req.body.username}), req.body.password, function(err, created_user){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			res.redirect("register");
		}
		else{
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Hello There! " + created_user.username);
				res.redirect("/campgrounds");
			});
		}
	})
});


//login
router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", {successRedirect: "/campgrounds", failureRedirect: "/login"}), function(req, res){});

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You have succesfully logged out");
	res.redirect("/");
});


//middleware
// function isLoggedin(req, res, next){
// 	if (req.isAuthenticated()){
// 		return next();
// 	}
// 	else{
// 		res.redirect("/login");
// 	}
// };

module.exports = router;


