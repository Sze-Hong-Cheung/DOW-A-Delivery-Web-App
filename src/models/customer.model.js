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
    customerSignup : function (email, password, lastName) {
        const passwordEncryted = crypto
                                .createHash("sha1")
                                .update(salt + password)
                                .digest("hex");
        return new Promise(function (resolve, reject) {
            connection.query(
                "insert into customer (cust_id, email, password, cust_name, tbl_last_date) values (?,?,?,?,now())",
                [4, email, passwordEncryted, lastName],
                function (error, results) {
                    if (error) throw error;
                    console.log("ss");
                    resolve();
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