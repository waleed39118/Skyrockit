const dotenv = require("dotenv"); // to read the data from env file 
dotenv.config(); // to use express
const express = require("express");
const app = express();

// Middlewares
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // used for updating and deleting
const morgan = require("morgan"); // used for logs 
const session = require("express-session"); // used for authentication
const passUserToView = require('./middleware/pass-user-to-view');
const isSignedIn = require('./middleware/is-signed-in');

// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";
mongoose.connect(process.env.MONGODB_URI); // DB connection 
mongoose.connection.on("connected", () => { // if it is connected then it will say connect with the connection name
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false })); // parse the data sa a form data

// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));

// Morgan for logging HTTP requests
app.use(morgan('dev'));

// Session Configurations
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);

// GET
app.get("/", async(req, res) => {
  res.render("index.ejs");
});

// Require Controller
const authController = require("./controllers/auth");
const applicationController = require("./controllers/applications");
app.use("/auth", authController);
app.use(isSignedIn);
app.use('/users/:userId/applications', applicationController);

// Route - Just for testing purpose
// VIP-lounge
app.get("/vip-lounge", isSignedIn, (req, res) => {
  res.send(`Welcome to the party`);
});
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});