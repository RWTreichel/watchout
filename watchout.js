//Global variables and functions
var game = {
  width: 500,
  height: 400,
  numEnemies: 15,
  time: 2000
};
var piece = {
  radius: 20
};
var score = {
  high: 0,
  current: 0,
  collide: 0
}

var rx = function(){ return Math.max(0, Math.floor( Math.random() * ( game.width - piece.radius * 2 ))) + "px"; };
var ry = function(){ return Math.max(0, Math.floor( Math.random() * ( game.height - piece.radius * 2 ))) + "px"; };

var gameBoard = d3.select('.gamespace')
                  .style({
                    width: game.width + "px",
                    height: game.height + "px",
                  });

var drag = d3.behavior.drag()
               .on('drag', function(){
                if (d3.event.y > 0 && d3.event.x > 0 && d3.event.y < game.height - piece.radius*2 && d3.event.x < game.width - piece.radius*2) {

                  player.style({
                    top: d3.event.y + "px",
                    left: d3.event.x + "px"
                  });
                }
               });

var player = d3.select('.gamespace')
               .append('div')
               .attr('class', 'player')
               .style({
                 top: game.height/2 + "px",
                 left: game.width/2 + "px",
                 width: piece.radius*2 + "px",
                 height: piece.radius*2 + "px",
                 'border-radius': piece.radius*2 + "px"
               })
               .call(drag);

var createEnemies = function(){
  return _.range(0, game.numEnemies).map(function(i) {
     return {
      id: i
    };
  });
};


// Rendering
var render = function(enemy_data){
  var enemies = gameBoard.selectAll('.enemy')
                         .data(enemy_data, function(d){
                           return d.id;
                         });

  enemies.enter()
         .append('div')
         .attr('class', 'enemy')
         .style({
            top: ry,
            left: rx,
            width: piece.radius * 2 + 'px',
            height: piece.radius * 2 + 'px'
         });

  enemies.exit()
    .remove();

  enemies
    .transition()
      .duration(2000)
      .each(function(){
        d3.select(this).transition()
          .style({
            top: ry,
            left: rx
          });
      });

  return;
};

render(createEnemies());

setInterval(function() {
  render(createEnemies());
}, game.time);


// Collision detection
var prevCollision = false;

var detectCollisions = function() {
  var player = d3.select('.player');
  var enemies = d3.selectAll('.enemy');
  var radiusSum = piece.radius * 2;

  var playerPosition = {
    x: player.node().offsetLeft + piece.radius,
    y: player.node().offsetTop + piece.radius
  };

  var collision = false;

  enemies.each(function() {
    var xDiff = (this.offsetLeft + piece.radius) - playerPosition.x;
    var yDiff = (this.offsetTop + piece.radius) - playerPosition.y;

    var distance = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

    if (distance < radiusSum) {
      collision = true;

      if (prevCollision != collision) {
        score.collide++;
        d3.select('#collisions').html(score.collide);
        score.current = 0;
      }
    }

    prevCollision = collision;
  });
};

d3.timer(detectCollisions);


// Scoring
var scoring = function(){
  score.current++;
  score.high = Math.max(score.current, score.high);
  d3.select('#currentScore').html(score.current);
  d3.select('#highScore').html(score.high);
}
setInterval(scoring, 10);