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
  // console.log("Connected as id: " + connection.threadId);
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

function buyItem() {
  connection.query("SELECT * FROM products", function(err, rows) {
    if (err) throw err;
    for (let i = 0; i < rows.length; i++) {
      console.log("\n" + "-".repeat(20) + "\n");
      for (field in rows[i]) {
        if (field !== "item_id") {
          let fieldDispArr = field.split("_");
          fieldDispArr.forEach((element, index) => {
            fieldDispArr[index] = element[0].toUpperCase() + element.slice(1);
          });
          let value;
          if (field === "price") {
            value = "$" + rows[i][field];
          } else {
            value = rows[i][field];
          }
          console.log(fieldDispArr.join(" ") + ": " + value);
        }
      }
    }
    console.log("\n" + "-".repeat(20) + "\n");
    inquirer
      .prompt({
        name: "choice",
        type: "list",
        choices: function(value) {
          let choiceArr = [];
          for (let i = 0; i < rows.length; i++) {
            choiceArr.push((i + 1) + ". " + rows[i].product_name);
          }
          return choiceArr;
        },
        message: "Which item would you like to buy?"
      })
      .then(function(itemAns) {
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
              [itemAns.choice.slice(0, itemAns.choice.indexOf("."))],
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
                      itemAns.choice.slice(0, itemAns.choice.indexOf("."))
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
