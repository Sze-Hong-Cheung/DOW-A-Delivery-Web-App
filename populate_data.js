const connection = require("./config/db.config.js");

const populateData = {
    populateCustomer: function (n) {
        const customerData = [];
        for (let i = 0; i < n; i++) {
            const customer = [];
            customer[0] = `${getRandomLowercase(5)}@${getRandomLowercase(5)}.com`;
            customer[1] = '84161755168f596800dd9e9d19b8537818dfe119';
            customer[2] = getRandomUppercase(1) + getRandomLowercase(4);
            customer[3] = '+' + getRandomNumber(11);
            customerData.push(customer);
        }
        customerData.map(data => new Promise(function (resolve, reject) {
            console.log(data);
            connection.query("insert into customer (email, password, cust_name, phone) values (?,?,?,?);",
            data,
            function (error, results) {
                if (error) reject(err);
                resolve();
            })
        }))
        Promise.all(customerData);
    },
    populateDelivery: function (n) {
        const deliveryData = [];
        for (let i = 0; i < n; i++) {
            const delivery = [];
            const deliveryType = ["employee_deliveryman", "outsourcing_deliveryman", "store_deliveryman"];
            const city = ["New York", "Huston", "San Jose"];
            delivery[0] = deliveryType[Math.floor(Math.random()*3)]; 
            delivery[1] = '+' + getRandomNumber(11);
            delivery[2] = getRandomUppercase(1) + getRandomLowercase(4);
            delivery[3] = '84161755168f596800dd9e9d19b8537818dfe119';
            delivery[4] = city[Math.floor(Math.random()*3)];
            deliveryData.push(delivery);
        }
        deliveryData.map(data => new Promise(function (resolve, reject) {
            console.log(data);
            connection.query("insert into deliveryman (deli_type, deli_phone, deli_name, password, city) values (?,?,?,?,?);",
            data,
            function (error, results) {
                if (error) reject(err);
                resolve();
            })
        }))
        Promise.all(deliveryData);
    }    
    
}


function getRandomString(length) {
    let result           = [];
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

function getRandomLowercase(length) {
    let result           = [];
    let characters       = 'abcdefghijklmnopqrstuvwxyz';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

function getRandomUppercase(length) {
    let result           = [];
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
}

function getRandomNumber(length) {
    let result           = [];
    let characters       = '1234567890';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return Number(result.join(''));
}

module.exports = populateData;