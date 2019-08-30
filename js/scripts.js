////////////////// Business Logic ////////////////////////
////////////////// Pizza Object ////////////////////////
function Pizza(size, toppings) {
  this.size = size,
  this.toppings = toppings,
  this.price = this.getPrice(size, toppings);
}

Pizza.prototype.getPrice = function() {
  // basePrice based on size: [Personal, Small, Medium, Large, X-Large]
  var basePrice = [10, 15, 18, 24, 30];
  var totalPrice = basePrice[this.size];

  for(let i=0; i<this.toppings.length; i++) {
    if(this.toppings[i] !== "No Cheese" && this.toppings[i] !== "Regular Cheese") {
      totalPrice += 1;
    }
  }

  return totalPrice;
}

Pizza.prototype.sizeAsString = function() {
  var sizeStrings = ["Personal 8\"", "Small 12\"", "Medium 15\"", "Large 18\"", "X-Large 22\""]

  return sizeStrings[this.size];
}

////////////////// Customer Object ////////////////////////
function Customer(firstName, lastName, orders) {
  this.firstName = firstName,
  this.lastName = lastName,
  this.orders = orders,
  this.costOfOrders = 0,
  this.orderNumber = 0;
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
  console.log(this.orderItems);
  this.orderItems.splice(itemToRemove, 1);
  console.log(this.orderItems);
}

Pizzeria.prototype.calculateTotal = function() {
  var output = 0;
  for(let i=0; i<this.orderItems.length; i++) {
    output += this.orderItems[i].price;
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

    $("#thanks").hide();

    newToppings.push(cheeseRadio);
    toppingCheckbox.each(function(){
      newToppings.push($(this).val());
    });

    pizza = new Pizza(newSize, newToppings);
    pizzeria.addItemToOrder(pizza);
    console.log(pizza.id);

    $("#orders").show();
    $("#orders-list").append("<tr id=" + pizza.id + " class=" + orderNumber + "> <td>" + pizza.sizeAsString() + "</td> <td>" + newToppings + "</td><td>" + pizza.price + trashIcon +"</td></tr>");

    $("#table-total").text('$' + pizzeria.calculateTotal());
    $("#new-order").trigger("reset");
  });

  $("#customer-info").submit(function(event) {
    event.preventDefault();
    var firstName = $("#first-name").val() || "Loyal";
    var lastName = $("#last-name").val() || "Customer";
    var customer = new Customer(firstName, lastName, pizzeria.orderItems);

    customer.costOfOrders = pizzeria.calculateTotal();
    customer.orderNumber = pizzeria.orderNumber;
    pizzeria.newOrder();

    $("#table-total").html("");
    $("#orders-list tr."+customer.orderNumber).remove();
    $("#orders").hide();
    $("#thank-customer").text(customer.firstName + " " + customer.lastName);
    $("#order-number").text(customer.orderNumber);
    $("#thanks").show();

    $("#customer-info").trigger("reset");
  });

  $(document).on("click", "img.remove",function() {
    var idToRemove = this.parentNode.parentNode.id;
    removeRow(idToRemove);
    pizzeria.removeItemFromOrder(idToRemove);
    $("#table-total").text('$' + pizzeria.calculateTotal());
  });

});

function removeRow(rowToRemove) {
  if(confirm("Remove from order?")) {
    $("#orders-list tr#" + rowToRemove).remove();
  }
}
