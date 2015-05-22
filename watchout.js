// start slingin' some d3 here.

          

// Pseudo-pseudocode

// Initialization
// 1. Game Board
  // Establish game board parameters
var width = 500;
var height = 400;
var gameBoard = d3.select('body').append('svg:svg')
                .attr('width', 500)
                .attr('height', 400)
                .style('background-color', "black");  

var numEnemies = 10;

  // Create HTML element representing game board
  // "D3"-ify the game board with board parameters / other shared functionality
// 2. Game Pieces
  // For each kind of game piece...
    // Establish piece parameters
var createEnemies = _.range(0, numEnemies).map(function(i) {
  return {
    id: i,
    x: Math.random() * width,
    y: Math.random() * height
  };
});

var render = function(enemy_data){
  var enemies = gameBoard.selectAll('circle.enemy')
                         .data(enemy_data, function(d){
                          return d.id;
                         });
  enemies.enter()
    .append('svg:circle')
    .style('fill', 'red')
    .attr('class', 'enemy')
    .attr('cx', function(enemy){
      return enemy.x;
    })
    .attr('cy', function(enemy){
      return enemy.y;
    })
    .attr('r', 10);

  enemies.exit()
    .remove();

  return;
}

render(createEnemies);

    // "D3"-ify again
    // Insert starting pieces into game board element
// 3. Score Tracking


// Oh snap, didn't know you were still here. Awesome. lel

