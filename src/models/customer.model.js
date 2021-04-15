const e = require("express");
const connection = require("./../../config/db.config.js");
const crypto = require("crypto");

const salt = "7fa73b47df808d36c5fe328546ddef8b9011b2c6";

module.exports = {
    customerLogin : function (email, password) {
        return new Promise(function (resolve, reject) {
            connection.query(
                "select password from customer where email=?",
                [email],
                function (error, results) {
                    if (error) throw error;
                    const customer = results[0];
                    if (!customer) {
                        console.log("Email doesn't exist.");
                        reject("Email doesn't exist.");
                    } else {
                        const passwordEncryted = crypto
                        .createHash("sha1")
                        .update(salt + password)
                        .digest("hex");
                        if (customer.password == passwordEncryted) {
                            console.log("Correct emial and password.");
                            resolve();
                        } else {
                            console.log("Wrong password.");
                            reject("Wrong password.");
                        }
                    }
                })
            }
        )
    },
    customerSignup : function (email, password, lastName, phone) {
        const passwordEncryted = crypto
                                .createHash("sha1")
                                .update(salt + password)
                                .digest("hex");
        return new Promise(function (resolve, reject) {
            connection.query(
                "insert into customer (email, password, cust_name, phone) values (?,?,?,?)",
                [email, passwordEncryted, lastName, phone],
                function (error, results) {
                    if (error) throw error;
                    console.log("Signing up.");
                    resolve(results.insertId);
                })
            }
        )
    },
    getCustomerInfoAtPayment : function (cust_id) {
        return new Promise(function (resolve, reject) {
            connection.query(
                "select a.cust_id, a.cust_name, a.phone, b.street, b.city, b.state, b.address_id, c.card_no from customer a join customer_address b on a.cust_id = b.cust_id join credit_card c on a.cust_id = c.cust_id where a.cust_id = ? and c.chosen_status=1;",
                [cust_id],
                function (error, results) {
                    if (error) throw error;
                    if (results.length == 0) reject("Can't find customer info at payment page.");
                    resolve(results[0]);
                })
            }
        ) 
    },
    getCustomer : function () {
        return new Promise(function (resolve, reject) {
            connection.query(
                "select * from customer",
                [],
                function (error, results, fields) {
                  if (error) reject(error);
                  resolve(results[0].cust_id);
                }
            );
        })
    }
};