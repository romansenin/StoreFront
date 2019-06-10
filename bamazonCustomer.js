let mysql = require("mysql");
let inquirer = require("inquirer");

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
});

connection.query("SELECT * FROM products ORDER BY department_name", function(err, rows) {
  if (err) throw err;
  // console.log(rows);
  displayResults(rows);
});

function displayResults(results) {
  for(let i = 0; i < results.length; i++) {
    console.log("-".repeat(10));
    for (field in results[i]) {
      console.log(field + ": " + results[i][field]);
    }
  }
  console.log("-".repeat(10));
}