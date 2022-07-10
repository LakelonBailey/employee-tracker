const mysql = require('mysql2');


// Creates connection with SQL database using mysql2
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employee_tracker'
});


module.exports = db;
