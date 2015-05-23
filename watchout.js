
var width = 500;
var height = 400;
var numEnemies = 10;

var gameBoard = d3.select('body')
                  .append('svg:svg')
                  .attr('width', width)
                  .attr('height', height)
                  .style('background-color', "black");  

var Player = function(){
  var drag = d3.behavior.drag()
               .on('drag', function(){
                player.attr('cx', d3.event.x)
                      .attr('cy', d3.event.y);
               });

  var player = gameBoard.selectAll('.player')
                        .data([{x: (width/2), y: (height/2), r: 10}])
                        .enter()
                        .append('svg:circle')
                        .attr('class', 'player')
                        .attr('cx', function(d) {return d.x})
                        .attr('cy', function(d) {return d.y})
                        .attr('r', function(d) {return d.r})
                        .call(drag)
                        .style('fill', 'blue');
  return Player;
};

Player();

var createEnemies = function(){
  return _.range(0, numEnemies).map(function(i) {
     return {
      id: i,
      x: Math.random() * width,
      y: Math.random() * height
    };
  });
};

var checkCollision = function(enemy, collidedCb) {
  var player = d3.select('.player');
  var radiusSum = parseFloat(enemy.attr('r')) + parseFloat(player.attr('r'));
  var xDiff = parseFloat(enemy.attr('cx')) - parseFloat(player.attr('cx'));
  var yDiff = parseFloat(enemy.attr('cy')) - parseFloat(player.attr('cy'));
  
  var distance = Math.sqrt( Math.pow(xDiff, 2) + Math.pow(yDiff, 2) );

  if (distance < radiusSum) {
    collidedCb(player, enemy);
  }
};

var tweenCollision = function(endData) {
  var enemy = d3.select(this);

  var startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
  };

  var endPos = {
    x: endData.x,
    y: endData.y
  };


  return function(t) {
    checkCollision(enemy, function() {
      console.log('collision detected');
      //TODO: this
    });

    var enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };

    enemy.attr('cx', enemyNextPos.x)
         .attr('cy', enemyNextPos.y);
  };
};

var render = function(enemy_data){
  var enemies = gameBoard.selectAll('circle.enemy')
    .data(enemy_data, function(d){
      return d.id;
    });

  enemies.enter()
         .append('svg:circle')
         .style('fill', "red")
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
          .attr('cy', Math.random() * height)
          .tween('custom', tweenCollision);
      });

  return;
};


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
