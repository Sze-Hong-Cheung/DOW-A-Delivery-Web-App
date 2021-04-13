const e = require("express");
const connection = require("./../../config/db.config.js");

module.exports = {
    getStoreList : function (searchWord='', storeType='', city='') {
        console.log("ss");
        return new Promise(function (resolve, reject) {
            connection.query(
                "select store_id, store_name, store_type, city from store where (store_name like '%" + searchWord + "%') and (store_type=? or ?='') and (city=? or ?='')",
                [storeType, storeType, city, city],
                function (error, results) {
                    if (error) throw error;
                    resolve(results);
                })
        })
    },
    getStoreById : function (storeId) {
        return new Promise(function (resolve, reject) {
            connection.query(
                "select store_name, store_type from store where store_id=?",
                [storeId],
                function (error, result) {
                    if (error) throw error;
                    resolve(result);
                })
        })
    },
    getCommodityList : function (searchWord='', storeId='') {
        return new Promise(function (resolve, reject) {
            connection.query(
                "select comm_no, comm_name, comm_price, comm_discount from commodity where comm_name like '%" + searchWord + "%' and store_id=?",
                [storeId],
                function (error, results) {
                    if (error) throw error;
                    resolve(results);
                })
        })
    },
    storeTypeList: ["Pizza", "Salad", "Drinks", "Snacks", "Breakfast", "Chinese", "Mexican", "Indian"]
};
