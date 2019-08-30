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
  var sizeStrings = ["Personal", "Small", "Medium", "Large", "X-Large"]

  return sizeStrings[this.size];
}

////////////////// Customer Object ////////////////////////
function Customer(firstName, lastName, orders) {
  this.firstName = firstName,
  this.lastName = lastName,
  this.orders = orders,
  this.costOfOrders = 0;
}



/////////////////// UI ////////////////////
$(function() {
  $("#new-order").submit(function(event) {
    event.preventDefault();
    var newSize = $("#size").val();
    var cheeseRadio = $("input:radio[name=topping]:checked").val();
    var toppingCheckbox = $("input:checkbox[name=topping]:checked");
    var newToppings = [];
    var pizza;

    newToppings.push(cheeseRadio);
    toppingCheckbox.each(function(){
      newToppings.push($(this).val());
    });

    pizza = new Pizza(newSize, newToppings);

    $("#orders-list").append("<li>" + pizza.sizeAsString() + " pizza with: " + newToppings + "</li>");
    $("#new-order").trigger("reset");
  });
});
