const mysql = require("mysql");

const connection = mysql.createConnection({
    host     : "database-1.cuuvomelrves.us-east-2.rds.amazonaws.com",
    user     : "admin",
    password : "Harshavippala",
    port     : 3306,
    database: "new_schema" 
  });
  
connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      throw err;
    }
  
    console.log('Connected to database.');
});

module.exports = connection;