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

////////////////// Pizzaria Object ////////////////////////
function Pizzaria() {
  this.orderItems = [],
  this.orderTotal = this.calculateTotal(),
  this.orderNumber = 1,
  this.orders = [""]; // fill 0 element with dummy so index matches orderNumber
}

Pizzaria.prototype.addCustomer = function(orderToAdd) {
  this.orders.push(orderToAdd);
}

Pizzaria.prototype.calculateTotal = function() {
  var output = 0;
  for(let i=0; i<this.orderItems.length; i++) {
    output += this.orderItems[i].price;
  }
  return output;
}

/////////////////// UI ////////////////////
$(function() {
  var pizzaria = new Pizzaria();

  $("#new-order").submit(function(event) {
    event.preventDefault();
    var newSize = $("#size").val();
    var cheeseRadio = $("input:radio[name=topping]:checked").val();
    var toppingCheckbox = $("input:checkbox[name=topping]:checked");
    var newToppings = [];
    var pizza;
    var orderTotal = 0;

    newToppings.push(cheeseRadio);
    toppingCheckbox.each(function(){
      newToppings.push($(this).val());
    });

    pizza = new Pizza(newSize, newToppings);
    pizzaria.orderItems.push(pizza);
    orderTotal = pizzaria.calculateTotal();
    console.log(pizzaria.calculateTotal());

    $("#orders").show();
    $("#orders-list").append("<tr> <td>" + pizza.sizeAsString() + "</td> <td>" + newToppings + "</td><td>" + pizza.price + "</td></tr>");

    $("#table-total").text('$' + orderTotal.toFixed().toString())
    $("#new-order").trigger("reset");
  });

  $("#customer-info").submit(function(event) {
    event.preventDefault();
    var firstName = $("#first-name").val() || "Loyal";
    var lastName = $("#last-name").val() || "Customer";
    var customer = new Customer(firstName, lastName, pizzaria.orderItems);

    customer.orderTotal = pizzaria.calculateTotal();
    customer.orderNumber = pizzaria.orderNumber;
    pizzaria.orderNumber++;
  });
});
