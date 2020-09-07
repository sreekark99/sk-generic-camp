var express = require("express")
var app = express();
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport = require("passport");
var flash = require('connect-flash-plus');
var localstrategy = require("passport-local");
var methodoverride = require("method-override");
// mongoose.connect('mongodb://localhost/yelp_camp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to DB!'))
// .catch(error => console.log(error.message));

mongoose.connect('mongodb+srv://sreekar:Sreekar5799@sk-generic-camp.yx4jt.mongodb.net/SK-generic-camp?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));


app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.use(flash());



var campground = require("./models/campground");
var comment = require("./models/comment");
var user = require("./models/user");


var seedDB = require("./seed");
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

//seedDB();





app.use(require("express-session")({
	secret: "This is key for encryption",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});


app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);




var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Connected to SK server");
});