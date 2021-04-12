const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mysql = require("mysql");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const Store = require("express-session").Store;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");
const { render } = require("ejs");
const connection = require("./config/db.config.js");
const customerModel = require("./src/models/customer.model");
const { customerLogin } = require("./src/models/customer.model");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.static("public"));
app.use(
    session({
      secret: "session secret ",
      //store: store,
      saveUninitialized: true,
      resave: true,
    })
  );
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

let salt = "7fa73b47df808d36c5fe328546ddef8b9011b2c6";

console.log("App started.");

//router
app.get("/", (req, res) => {
    res.render("customer_login");
});

app.get("/signup", (req, res) => {
    res.render("customer_signup");
});

app.get("/list", (req, res) => {
    res.render("restaurant_list");
});

//login function
customerModel.customerLogin("abc@gmail.com", "123")
    .then(() => {console.log("Success login.")})
    .catch(msg => {console.log(msg)});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});