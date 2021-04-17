const express = require("express");
const connection = require("../../config/db.config.js");

module.exports = {
    getDeliveryList : function (deliId) {
        return new Promise(function (resolve, reject) {
            connection.query(
                "select a.order_no, a.order_status, a.est_pick_up_time, a.pick_up_time, a.est_deliveried_time, a.deliveried_time, b.street AS cust_street, b.city AS cust_city, b.state AS cust_state, c.store_phone, c.street AS store_street, c.city AS store_city, c.state AS store_state, d.phone from `order` a left join customer_address b on a.address_id = b.address_id left join store c on a.store_id = c.store_id left join customer d on a.cust_id = d.cust_id where a.deli_id = ?;",
                [deliId],
                function (error, results) {
                  if (error) reject(error);
                  console.log(results);
                  resolve(results);
                }
            );
        })
    },
    orderStatusList: ["Pickup Waiting", "Delivering", "Completed"]
};