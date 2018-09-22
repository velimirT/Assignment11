var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",
  port: 3308,
  user: "root",
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

var products = [];


function getProducts(){
	connection.query("SELECT * FROM products ORDER BY id DESC", function(err, result) {
	    // We then begin building out HTML elements for the page.
	    console.log("Products");
	    // Here we begin an unordered list.
	    // We then use the retrieved records from the database to populate our HTML file.
	    for (var i = 0; i < result.length; i++) {
	    	products[result[i].id] = result[i];
	    	console.log(`
	    		ID: ${result[i].id}
	    		Name: ${result[i].product_name}
	    		Price: ${result[i].price}
	    		Stock Quantity: ${result[i].stock_quantity}
	    	`);  
	    }
	});

	inquirer
  .prompt([
    // Here we create a basic text prompt.
	    {
	      type: "input",
	      message: "Product ID:",
	      name: "product_id"
	    },
	    {
	      type: "input",
	      message: "Quantity:",
	      name: "quantity"
	    },
	]).then(function(answers){	
		if(checkIfAvailable(answers.product_id, answers.quantity)){
			console.log("You can proceed writting the DB update!");
			connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [answers.quantity, answers.product_id], function(err, result) {
			    // We then begin building out HTML elements for the page.			    
			    console.log("You succesfully bought ", products[answers.product_id].product_name);
			});	
			getProducts();
		}else{
			console.log("Insufficient quantity!");
			getProducts();
		}
	});

}

getProducts();

function checkIfAvailable(id, quantity){
	var available = ((products[id].stock_quantity - quantity) >= 0)
	return available;
}