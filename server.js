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
const populateData = require("./populate_data.js");
const customerModel = require("./src/models/customer.model");
const storeModel = require("./src/models/store.model");
const orderModel = require("./src/models/order.model");
const deliverymanModel = require("./src/models/deliveryman.model");

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

const salt = "7fa73b47df808d36c5fe328546ddef8b9011b2c6";

console.log("App started.");

passport.serializeUser(function (user, done) {
  console.log("serializeUser:");
  console.log(user);
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

//router
app.get("/", (req, res) => {
  req.login(4, function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/list");
});

app.get("/login", (req, res) => {
    if (req.isAuthenticated() && req.user.userType == "customer") {
      res.redirect("/list");
    }
    console.log(req.flash('message'))
    res.render("customer_login");
});

app.post("/login", 
  passport.authenticate("local-user", {
    successRedirect: "/list",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {/*
    const email = req.body.email;
    const password = req.body.password;

    //login function
    customerModel.customerLogin(email, password)
    .then(() => {console.log("Success login.")})
    .catch(msg => {console.log(msg)});*/
});

app.get("/signup", (req, res) => {
    res.render("customer_signup");
});

app.post("/signup", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const lastName = req.body.lastName;
    const phone = req.body.phone;

    //signup function
    customerModel.customerSignup(email, password, lastName, phone)
    .then(custId => {
      req.login(custId, function (err) {if (err) return next(err);});
      res.redirect("/list");
    })
    .catch( reason => console.log(reason));
});

app.get("/list", (req, res) => {
    if (!req.isAuthenticated() || req.user.userType != "customer") {
      res.redirect("/login");
    }
    console.log(String(req.user.id) + " has logged in.")
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
  if (!req.isAuthenticated() || req.user.userType != "customer") {
    res.redirect("/login");
  }
  
  const searchWord = req.query.search;
  const city = req.query.city;
  const storeId = req.params.store_id;
  let commodityListData = {};

  async function getCommodityListPage() {
    commodityListData.commodityList  = await storeModel.getCommodityList(searchWord, storeId);
    commodityListData.storeInfo = await storeModel.getStoreById(storeId);
    console.log(commodityListData);
    res.render("commodity_list", {
      commodityListData: commodityListData,
      searchWord: searchWord,
      storeId: storeId
    });
  }

  getCommodityListPage();
  
});

app.post("/payment", (req, res) => {
  console.log(req.user);
  console.log(req.body.totalItems);
  const totalItems = JSON.parse(req.body.totalItems);
  const totalFee = req.body.totalFee;
  const storeId = req.body.storeId;
  const customerID = req.user.id;
  async function getCommodityListPage() {
    const customerInfoAtPayment = await customerModel.getCustomerInfoAtPayment(customerID);
    const commoditiesAtPayment = await storeModel.getCommoditiesById(totalItems);
    console.log(customerInfoAtPayment);
    console.log(commoditiesAtPayment);
    commoditiesAtPayment.forEach(el => {el.amount=totalItems[String(el.comm_no)]});
    res.render("payment", {
      customerInfo: customerInfoAtPayment,
      items: commoditiesAtPayment,
      totalFee: totalFee,
      storeId: storeId
    });
  }
  getCommodityListPage();
});

app.post("/order-process", (req, res) => {
  const custId = req.user.id;
  const storeId = req.body.storeId;
  const addressId = req.body.addressId;
  const items = JSON.parse(req.body.totalItems);
  const finalFee = req.body.finalFee;
  const cardNo = req.body.cardNo;
  orderModel.placeOrder(custId, storeId, addressId, items, finalFee, cardNo)
  .then(() => {
    console.log("Order Placed");
    res.redirect("/order-success")
  });
});

app.get("/order-success", (req, res) => {
  res.render("order_success");
});

app.get("/delivery", (req, res) => {
  res.render("delivery_login");
});

app.post("/delivery", 
  passport.authenticate("local-delivery", {
    successRedirect: "/delivery-list",
    failureRedirect: "/delivery",
    failureFlash: true,
  }),
  (req, res) => {/*
    const email = req.body.email;
    const password = req.body.password;

    //login function
    customerModel.customerLogin(email, password)
    .then(() => {console.log("Success login.")})
    .catch(msg => {console.log(msg)});*/
});

app.get("/delivery-list", (req, res) => {
  if (!req.isAuthenticated() || req.user.userType != "deliveryman") {
    res.redirect("/delivery");
  }

  const deliId = req.user.id;
  
  deliverymanModel.getDeliveryList(deliId)
  .then(data => {
    res.render("delivery_list", {
      deliveryList: data,
      orderStatusList: deliverymanModel.orderStatusList});
  });
  
});

app.post("/delivery-list", (req, res) => {
  const orderNo = req.body.orderNo;
  
  orderModel.updateOrderStatus(orderNo)
  .then(() => {
    res.redirect("/delivery-list");
  })
});

app.get("/admin/customer", (req, res) => {
  res.render("admin_customer_list");
});


passport.use(
  "local-user",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, //passback entire req to call back
    },
    function (req, email, password, done) {
      if (!email || !password) {
        return done(null, false,
          req.flash("message", "All fields are required.")
        );
      }
      console.log("checking");
      connection.query(
        "select cust_id, password from customer where email=?",
        [email],
        function (err, results) {
          if (err) return done(req.flash("message", err));
          const customer = results[0]; 
          if (!customer) {
            console.log("Email doesn't exist.");
            return done(null, false, req.flash("message", "Email doesn't exist."));
          } else {
            const encPassword = crypto
                                .createHash("sha1")
                                .update(salt + "" + password)
                                .digest("hex");
            const dbPassword = customer.password;
            if (dbPassword != encPassword) {
              console.log("Wrong password.");
              return done(null, false,
                req.flash("message", "Wrong password.")
              );
            }
          }
          return done(null, {userType: "customer", id: customer.cust_id});
        }
      );
    }
  )
);

passport.use(
  "local-delivery",
  new LocalStrategy(
    {
      usernameField: "deliId",
      passwordField: "password",
      passReqToCallback: true, //passback entire req to call back
    },
    function (req, deliId, password, done) {
      if (!deliId || !password) {
        return done(null, false,
          req.flash("message", "All fields are required.")
        );
      }
      console.log("checking");
      connection.query(
        "select deli_id, password from deliveryman where deli_id=?",
        [deliId],
        function (err, results) {
          if (err) return done(req.flash("message", err));
          const deliveryman = results[0]; 
          if (!deliveryman) {
            console.log("Delivery ID doesn't exist.");
            return done(null, false, req.flash("message", "Delivery ID doesn't exist."));
          } else {
            const encPassword = crypto
                                .createHash("sha1")
                                .update(salt + "" + password)
                                .digest("hex");
            const dbPassword = deliveryman.password;
            if (dbPassword != encPassword) {
              console.log("Wrong password.");
              return done(null, false,
                req.flash("message", "Wrong password.")
              );
            }
          }
          return done(null, {userType: "deliveryman", id: deliveryman.deli_id});
        }
      );
    }
  )
);

app.listen(3000, () => {
    console.log("Server started on port 3000");
});