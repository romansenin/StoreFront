// npm packages
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
  console.log(" \n--- Welcome to BAmazon! ---\n ");
  next();
});

function next() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: ["Buy an item", "Quit"]
    })
    .then(function(answer) {
      if (answer.choice === "Quit") {
        connection.end();
      } else {
        buyItem();
      }
    });
}

function displayProducts() {
  connection.query("SELECT * FROM products", function(err, rows) {
    for (let i = 0; i < rows.length; i++) {
      console.log("\n" + "-".repeat(10) + "\n");
      for (field in rows[i]) {
        console.log(field + ": " + rows[i][field]);
      }
    }
    console.log("\n" + "-".repeat(10) + "\n");
  });
}

function buyItem() {
  displayProducts();
  connection.query("SELECT COUNT(*) AS count FROM PRODUCTS", function(
    err,
    rows
  ) {
    if (err) throw err;
    let itemCount = rows[0].count;
    inquirer
      .prompt([
        {
          name: "id",
          type: "input",
          message: "Enter the id of the item you wish to buy:",
          validate: function validateId(id) {
            return id <= itemCount && id >= 1;
          }
        }
      ])
      .then(function(idAns) {
        inquirer
          .prompt([
            {
              name: "amount",
              type: "input",
              message:
                "Enter the amount of the product you'd like to purchase:",
              validate: function validateAmount(amount) {
                return parseInt(amount) > -1;
              }
            }
          ])
          .then(function(amountAns) {
            connection.query(
              "SELECT price, stock_quantity FROM products WHERE item_id = ?",
              [idAns.id],
              function(err, rows) {
                if (err) throw err;
                if (rows[0].stock_quantity < parseInt(amountAns.amount)) {
                  console.log("Insufficient quantity!");
                  next();
                } else {
                  connection.query(
                    "UPDATE products SET stock_quantity = ? WHERE item_id = ?",
                    [
                      rows[0].stock_quantity - parseInt(amountAns.amount),
                      idAns.id
                    ],
                    function(err) {
                      if (err) throw err;
                      console.log(
                        "The total cost of your purchase is $" +
                          rows[0].price * parseInt(amountAns.amount)
                      );
                      next();
                    }
                  );
                }
              }
            );
          });
      });
  });
}
