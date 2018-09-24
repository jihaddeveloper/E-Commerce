const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const dbConfig = require('./config/database');

const app = express();

// Load routes controller
const ideasController = require("./routes/ideasController");
const usersController = require("./routes/usersController");
const productsController = require("./routes/productsController");

// Passport config
require("./config/passport")(passport);

// Map global promise
mongoose.Promise = global.Promise;

//DB Connection
mongoose.connect(dbConfig.mongoURI, (err) =>{
  if(!err)
      console.log('MongoDB connection Established, '+dbConfig.mongoURI);
  else
      console.log('Error in DB connection :' + JSON.stringify(err, undefined, 2));
});


// Handlebars middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method overriding middleware
app.use(methodOverride("_method"));

// Express session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Gloabl variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//Port For the Application
const port = 3000 || process.env.port;

app.listen(port, () => {
  console.log('The server is live on http://127.0.0.1:3000/');
});


//All Routes
// Index route
app.get("/", (req, res) => {
  const title = "Welcome To ECL E-Commerce";
  res.render("index", {
    title: title
  });
});

// About route
app.get("/about", (req, res) => {
  res.render("about");
});

// Use routes
app.use("/ideas", ideasController);
app.use("/users", usersController);
app.use("/products", productsController);

