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
const storeModel = require("./src/models/store.model");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.static('public'));
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

storeModel.getStoreList('' ,'', 'Brooklyn');
//router
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.render("customer_login");
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //login function
    customerModel.customerLogin(email, password)
    .then(() => {console.log("Success login.")})
    .catch(msg => {console.log(msg)});
});

app.get("/signup", (req, res) => {
    res.render("customer_signup");
});

app.post("/signup", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const lastName = req.body.lastName;
    
    //signup function
    customerModel.customerSignup(email, password, lastName)
    .then(() => console.log("Sign Up success."))
    .catch( reason => console.log(reason));
});

app.get("/list", (req, res) => {
    const searchWord = req.query.search;
    const storeType = req.query.type;
    const city = req.query.city;
    storeModel.getStoreList(searchWord, storeType, city)
    .then((data) => {res.render("restaurant_list", {
      storeList: data,
      storeTypeList: storeModel.storeTypeList,
      city: (city == undefined ? '' : city),
      searchWord: searchWord
    });
    console.log(data);});
});

app.get("/store/:store_id", (req, res) => {
  const searchWord = req.query.search;
  const Storetype = req.query.type;
  const city = req.query.city;
  const storeId = req.params.store_id;
  let commodityListData = {};

  async function getCommodityListPage() {
    commodityListData.commodityList  = await storeModel.getCommodityList(searchWord, storeId);
    commodityListData.storeInfo = await storeModel.getStoreById(storeId);
    console.log(commodityListData);
    res.render("commodity_list", {
      commodityListData: commodityListData,
      searchWord: searchWord
    });
  }

  getCommodityListPage();
  
});

app.post("/payment", (req, res) => {
  const totalItems = JSON.parse(req.body.totalItems);
  const totalFee = req.body.totalFee;

  storeModel.getCommoditiesById(totalItems)
  .then((data) => {
    data.forEach(el => {el.amount=totalItems[String(el.comm_no)]});
    console.log(data);
    res.render("payment", {
      items: data,
      totalFee: totalFee
    });
  })
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});