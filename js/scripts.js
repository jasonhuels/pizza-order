////////////////// Business Logic ////////////////////////
////////////////// Pizza Object ////////////////////////
function Pizza(size, toppings) {
  this.size = size,
  this.toppings = toppings,
  this.price = 0;
}

Pizza.prototype.getPrice = function() {
  // basePrice based on size: [Personal, Small, Medium, Large, X-Large]
  var basePrice = [10, 15, 20, 25, 30];
  var totalPrice = basePrice[this.size];

  for(let i=0; i<this.toppings.length; i++) {
    if(this.toppings[i] !== "No Cheese") {
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
  
});
