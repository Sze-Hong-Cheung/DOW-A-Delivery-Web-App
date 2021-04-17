const express = require("express");
const connection = require("../../config/db.config.js");

module.exports = {
    placeOrder : function (custId, storeId, addressId, items, finalFee, cardNo) {
        return new Promise(function (resolve, reject) {
            /*connection.beginTransaction(function (err) {
                if (err) console.log(err);*/
                connection.query("insert into `order` (order_status, est_pick_up_time, cust_id, store_id, address_id) values (?, DATE_ADD(NOW(), INTERVAL 15 MINUTE), ?, ?, ?)",
                [0, custId, storeId, addressId],
                function (error, results) {
                    if (error) {
                        return connection.rollback(function () {
                        console.log(`Order insert failed.`);
                          console.log(error);
                        });
                    }

                    const orderId = results.insertId;
                    console.log(`New Order (order_no: ${orderId}) inserted. `);
                    //console.log(items);

                    const itemList = []
                    items.forEach(el => {
                        let item = [];
                        item.push(el.comm_no);
                        item.push(orderId);
                        item.push(el.amount);
                        itemList.push(item);
                    });

                    console.log("Data to insert into order_comm_transaction:");
                    console.log(itemList);

                    itemList.map(el => new Promise(function (resolve, reject) {
                        console.log(el);
                        connection.query("insert into order_comm_transaction (comm_no, order_no, amount) values (?,?,?);",
                        el,
                        function (error, results) {
                            if (error) {
                                console.log(`Order_comm_transaction insert failed.`);
                                reject(err);
                            }
                            resolve();
                        })
                    }));
                    
                    Promise.all(itemList)
                    .then(() => {
                        connection.query("insert into invoice (order_no, invoice_amount) values (?, ?)",
                        [orderId, finalFee],
                        function (error, results) {
                            if (error) {
                                console.log(`Invoice insert failed.`);
                                return connection.rollback(() => console.log(error));
                            }
                                const invoiceNo = results.insertId;
                                console.log(`New invoice (invoice_no: ${invoiceNo}) inserted. `);

                                connection.query("insert into payment (invoice_no, card_no, payment_amount) values (?,?,?)",
                                [invoiceNo, cardNo, finalFee],
                                function (error, results) {
                                if (error) {
                                    console.log(`Payment insert failed.`);
                                    return connection.rollback(() => console.log(error));
                                }
                                console.log(`New payment (payment_no: ${results.insertId}) inserted. `);
                                resolve();
                        });
                    });
                    });
                })
            })
        }/*);
    }*/,
    updateOrderStatus : function (orderNo) {
        return new Promise(function (resolve, reject) {
            connection.query("update `order` set order_status = order_status + 1 where order_no = ?",
            [orderNo], 
            function (error, results) {
                if (error) throw errorl
                resolve();
            });
        });
    },
    orderStatusList: ["Order Placed", "Delivering", "Completed"]
};
