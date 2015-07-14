var knapsack = {items: [], maxWeight: 17, currentWeight: 0}; // NP-hard
var items = [ // allowed multiple of each
  {name:'apple',    weight:3, value:20},
  {name:'blanket',  weight:4, value:40},
  {name:'lantern',  weight:5, value:10},
  {name:'radio',    weight:6, value:30}
];

var MAX_TRIES = 100;

function generateRandomSolution(){
  var solution = [];
  var totalWeight = 0;

  while (true) {
    // maybe enough already
    if (Math.random() < 0.1) break;

    // try to choose an item that fits
    for (var t = 0; t < MAX_TRIES; t++) {
      var index = randomIndex(items);
      if (totalWeight + items[index].weight <= knapsack.maxWeight) {
        totalWeight += items[index].weight;
        solution.push(items[index]);
        break;
      }
    }
  }

  return solution; // array of items, must be <= maxWeight
};

function generateNeighboringSolution(oldSolution){
  var chooseStep = Math.floor(Math.random() * 2);

  var solution = [];
  for (var i in oldSolution) solution.push(oldSolution[i]);

  if (chooseStep == 0) {
    var totalWeight = 0;
    for (var i in oldSolution) totalWeight += oldSolution[i].weight;

    // try to choose an item that fits
    for (var t = 0; t < MAX_TRIES; t++) {
      var index = randomIndex(items);
      if (totalWeight + items[index].weight <= knapsack.maxWeight) {
        solution.push(items[index]);
        return solution;
      }
    }
  }

  // either chooseStep == 1, or we failed to add
  var indexToRemove = randomIndex(oldSolution);
  solution = solution.splice(indexToRemove, 1);
  return solution; // array of items, must be <= maxWeight
}

function calculateCost(solution){
  var sum = 0;
  for (var i in solution) sum += solution[i].value;
  return sum; // sum of values of items
}

function acceptance_probability(old_cost, new_cost, temperature){
  return Math.pow(Math.E, (new_cost - old_cost)/temperature); // probability to jump
}

function simulateAnnealing() {
  function anneal(solution) {
    var oldCost = calculateCost(solution);
    var t = 1.0;
    var minT = 0.00001;
    var alpha = 0.9;

    while (t > minT) {
      for (var i = 1; i <= 100; i++) {
        var newSolution = generateNeighboringSolution(solution);
        var newCost = calculateCost(newSolution);
        var ap = acceptance_probability(oldCost, newCost, t);
        if (Math.random() < ap) {
          solution = newSolution;
          oldCost = newCost;
        }
      }
      t *= alpha;
    }
    return solution;
  }
  return anneal(generateRandomSolution()); // array of items, must be <= maxWeight
};

///////////////////////////////////
// HELPER FUNCTIONS              //
// don't modify, but you can use //
///////////////////////////////////

function randomIndex(list){
  return Math.floor(Math.random()*list.length);
}

function weigh(solution){
  return solution.reduce(function(total, item){ return total + item.weight}, 0);
}
