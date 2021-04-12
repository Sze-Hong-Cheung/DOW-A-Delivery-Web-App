const e = require("express");
const connection = require("./../../config/db.config.js");

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
                    } else if (customer.password != password) {
                        console.log("Wrong password.");
                        reject("Wrong password.");
                    } else if (customer.password == password){
                        console.log("Correct emial and password.");
                        resolve();
                    }
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