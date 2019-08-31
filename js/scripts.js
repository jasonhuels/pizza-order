////////////////// Business Logic ////////////////////////
////////////////// Pizza Object ////////////////////////
function Pizza(size, toppings) {
  this.size = size,
  this.sizeIndex = this.getSizeIndex(),
  this.toppings = toppings,
  this.price = this.getPrice(size, toppings);
}

Pizza.prototype.getPrice = function() {
  // basePrice based on size: [Personal, Small, Medium, Large, X-Large]
  var basePrice = [10, 15, 18, 24, 30];
  var totalPrice = basePrice[this.sizeIndex];

  for(let i=0; i<this.toppings.length; i++) {
    if(this.toppings[i] !== "No Cheese" && this.toppings[i] !== "Regular Cheese") {
      totalPrice += (this.sizeIndex+1)*0.5;
    }
  }

  return totalPrice;
}

Pizza.prototype.getSizeIndex = function() {
  var sizeStrings = ["Personal 8\"", "Small 12\"", "Medium 15\"", "Large 18\"", "X-Large 22\""]

  return sizeStrings.indexOf(this.size);
}

////////////////// Customer Object ////////////////////////
function Customer(firstName, lastName, orders) {
  this.firstName = firstName,
  this.lastName = lastName,
  this.orders = orders,
  this.costOfOrders = 0,
  this.orderNumber = 0;
}

Customer.prototype.orderString = function() {
  var output = "";
  for(let i=0; i<this.orders.length; i++) {
    if(this.orders[i]) {
      output += "1 - " + this.orders[i].size + " pizza with " + this.orders[i].toppings  +  ":  $" + this.orders[i].price.toFixed(2) + "<br>";
    }
  }

  return output;
}

////////////////// Pizzeria Object ////////////////////////
function Pizzeria() {
  this.orderItems = [],
  this.itemNumber = 0,
  this.orderTotal = this.calculateTotal(),
  this.orderNumber = 1,
  this.orders = [""]; // fill 0 element with dummy so index matches orderNumber
}

Pizzeria.prototype.addItemToOrder = function(itemToAdd) {
  itemToAdd.id = this.itemNumber;
  this.itemNumber++;
  this.orderItems.push(itemToAdd);
}

Pizzeria.prototype.removeItemFromOrder = function(itemToRemove) {
  this.orderItems.splice(itemToRemove, 1, "");
}

Pizzeria.prototype.calculateTotal = function() {
  var output = 0;
  for(let i=0; i<this.orderItems.length; i++) {
    if(this.orderItems[i]) {
      output += this.orderItems[i].price;
    }
  }
  return output;
}

Pizzeria.prototype.newOrder = function() {
  this.orders.push(this.orderItems);
  this.orderItems = [];
  this.orderNumber++;
}

/////////////////// UI ////////////////////
$(function() {
  var pizzeria = new Pizzeria();

  $("#new-order").submit(function(event) {
    event.preventDefault();
    var newSize = $("#size").val();
    var cheeseRadio = $("input:radio[name=topping]:checked").val();
    var toppingCheckbox = $("input:checkbox[name=topping]:checked");
    var newToppings = [];
    var pizza;
    var orderNumber = pizzeria.orderNumber;
    var trashIcon = '<img src="img/trash.png" alt="trashcan"  class="remove">';
    var orderTable = "";

    $("#thanks").slideUp();

    newToppings.push(cheeseRadio);
    toppingCheckbox.each(function(){
      newToppings.push($(this).val());
    });

    pizza = new Pizza(newSize, newToppings);
    pizzeria.addItemToOrder(pizza);

    orderTable = "<tr id=" + pizza.id + " class=" + orderNumber + "> <td>" + pizza.size + "</td> <td>" + newToppings + "</td><td>$" + pizza.price.toFixed(2) + trashIcon +"</td></tr>"

    $("#orders").slideDown();
    $("#orders-list").append(orderTable);

    $("#table-total").text('$' + pizzeria.calculateTotal().toFixed(2));
    $("#new-order").trigger("reset");
  });

  $("#customer-info").submit(function(event) {
    event.preventDefault();
    var firstName = $("#first-name").val() || "Loyal";
    var lastName = $("#last-name").val() || "Customer";
    var customer = new Customer(firstName, lastName, pizzeria.orderItems);
    var orderString = "";

    for(let i=0; i<customer.orders.length; i++) {
      orderString += "1 " + customer.orders[i].size + " pizza with " + customer.orders[i].toppings + "<br>";
    }

    customer.costOfOrders = pizzeria.calculateTotal().toFixed(2);
    customer.orderNumber = pizzeria.orderNumber;
    pizzeria.newOrder();

    $("#table-total").html("");
    $("#orders-list tr."+customer.orderNumber).remove();
    $("#orders").slideUp();
    $("#thank-customer").text(customer.firstName + " " + customer.lastName);
    $("#order-number").text(customer.orderNumber);
    $("#review-order").html(customer.orderString());
    $("#final-price").text(customer.costOfOrders);
    $("#thanks").slideDown();

    $("#customer-info").trigger("reset");
  });

  $(document).on("click", "img.remove",function() {
    var idToRemove = this.parentNode.parentNode.id;
    var confirmation =   removeRow(idToRemove);
    if(confirmation) {
      pizzeria.removeItemFromOrder(idToRemove);
      $("#table-total").text('$' + pizzeria.calculateTotal().toFixed(2));

    }
  });
});

function removeRow(rowToRemove) {
  var confirmation = confirm("Remove from order?");
  if(confirmation) {
    $("#orders-list tr#" + rowToRemove).remove();
  }

  return confirmation;
}
