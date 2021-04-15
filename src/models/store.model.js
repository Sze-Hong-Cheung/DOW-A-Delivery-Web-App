const e = require("express");
const connection = require("../../config/db.config.js");

module.exports = {
    getStoreList : function (searchWord='', storeType='', city='') {
        console.log("Function: getStoreList");
        return new Promise(function (resolve, reject) {
            connection.query(
                "select store_id, store_name, store_type, city from store where (store_name like '%" + searchWord + "%') and (store_type=? or ?='') and (city=? or ?='')",
                [storeType, storeType, city, city],
                function (error, results) {
                    if (error) throw error;
                    resolve(results);
                }
            )
        });
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
    getCommoditiesById : function (ids) {
        return new Promise(function (resolve, reject) {
            let sql = "select comm_no, comm_name, comm_price, comm_discount from commodity where 1=2 ";
            for(let key in ids){
                sql += ' or comm_no=' + key;
            }
            connection.query(
                sql,
                function (error, results) {
                    if (error) throw error;
                    console.log(results);
                    resolve(results);
                })
        })
    },
    storeTypeList: ["Pizza", "Salad", "Drinks", "Snacks", "Breakfast", "Chinese", "Mexican", "Indian"]
};
