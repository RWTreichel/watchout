
var width = 500;
var height = 400;
var gameBoard = d3.select('body').append('svg:svg')
                .attr('width', 500)
                .attr('height', 400)
                .style('background-color', "black");  

var numEnemies = 10;

var createEnemies = function(){
  return _.range(0, numEnemies).map(function(i) {
     return {
      id: i,
      x: Math.random() * width,
      y: Math.random() * height
    };
  });
};



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

  enemies
    .transition()
      .duration(2000)
      .each(function(){
        d3.select(this).transition()
          .attr('cx', Math.random() * width)
          .attr('cy', Math.random() * height);
      });

  return;
}


render(createEnemies);

var play = function(){
  var gameTurn = function(){
    newEnemyPositions = createEnemies();
    render(newEnemyPositions);
  }
  gameTurn();
  setInterval(gameTurn, 2000);
}

play();
