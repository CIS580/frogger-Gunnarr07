(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const EntityManager = require('./entity-manager');
const Player = require('./player.js');
const Road = require('./road.js');
const MiniCar = require('./minicar.js');
const River = require('./river.js');
const Log = require('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var entities = new EntityManager(canvas.width, canvas.height, 64);
var idRestart = document.getElementById('id_restart');
var score = 0;
var lives = 3;
//var idScore = document.getElementById('id_scroe');

// The player as a frog
var player = new Player({ x: 0, y: 240 })
entities.addEntity(player);

// create game objects
var road1 = new Road({ x: 100, y: 0 });
//var road1 = new Road({ x: 128, y: 0 });

var road2 = new Road({ x: 450, y: 0 });
var minicar = new MiniCar({ x: 100, y: canvas.height });
//var minicar = new MiniCar({ x: 135, y: canvas.height });
entities.addEntity(minicar);

/*
var rivers1 = [];
for (var i = 0; i < 8; i++){
    var river = new River({
        x: 300,
        y: i * 64,
    });
    rivers1.push(river);
    entities.addEntity(river);
}
*/

//var river1 = new River({ x: 300, y: 0 });
//entities.addEntity(river1);
var river2 = new River({ x: 640, y: 0 });
entities.addEntity(river2);
var log = new Log({ x: 300, y: canvas.height })
entities.addEntity(log);

/*
window.onkeydown = function (event) {
    switch (event.keyCode) {
        case 27:
            if (paused) {
                paused = false;
            }
            else {
                paused = true;
            }
            break;
    }
}
*/

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
    player.update(elapsedTime);
    entities.updateEntity(player);
    minicar.update(elapsedTime);
    entities.updateEntity(minicar);
    log.update(elapsedTime);
    entities.updateEntity(log);
    //entities.updateEntity(river1);
    // TODO: Update the game objects
    /*
    entities.collide(function (entity1, entity2) {
        entity1.color = '#ff0000';
        entity2.color = '#00ff00';
    });
    */

    if (player.x >= canvas.width) {
        score += 100;
        game.idScore.innerHTML = "Score: " + score;
        player.x = 0;
        player.y = 240;
        minicar.speed++;
        log.speed++;
    }

    entities.collide(function (entity1, entity2) {
        if (entity1 instanceof Player && entity2 instanceof MiniCar || entity1 instanceof MiniCar && entity2 instanceof Player) {
            entity1.color = '#ff0000';
            entity2.color = '#00ff00';
            console.log("collision car and player");
            console.log(entity1);
            console.log(entity2);
            player.x = 0;
            player.y = 240;
            lives--;
            game.idLives.innerHTML = "Lives: " + lives;
            if (lives == 0) {
                game.paused = true;
                idRestart.style.display = "block";
                document.getElementById('id_button').onclick = function () {
                    location.reload();
                }
            }
        }
        else if (entity1 instanceof River && entity2 instanceof Log || entity1 instanceof Log && entity2 instanceof River) {
                
            entity1.color = '#ff0000';
            entity2.color = '#00ff00';
            console.log("collision river and log");
            /*
            console.log(entity1);
            console.log(entity2);
            */
            //player.update(elapsedTime, "ridingLog");
        }
        else if (entity1 instanceof Player && entity2 instanceof Log || entity1 instanceof Log && entity2 instanceof Player) {
            entity1.color = '#ff0000';
            entity2.color = '#00ff00';
            console.log("collision log and player");
            console.log(entity1);
            console.log(entity2);
            //player.update(elapsedTime, "ridingLog");
        }
        else if ((entity1 instanceof Player && entity2 instanceof River || entity1 instanceof River && entity2 instanceof Player)) {
            entity1.color = '#ff0000';
            entity2.color = '#00ff00';
            console.log("collision river and player");
            console.log(entity1);
            console.log(entity2);
            //idRestart.style.display = "block";
            //document.getElementById('id_button').onclick = function () {
            //    location.reload();
            // }
        }
    });

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  road1.render(elapsedTime, ctx);
  road2.render(elapsedTime, ctx);
    //river1.render(elapsedTime, ctx);
    /*
  rivers1.forEach(function (river) {
      river.render(elapsedTime, ctx);
  });
  */
  river2.render(elapsedTime, ctx);
  entities.renderCells(ctx);
  log.render(elapsedTime, ctx);
  player.render(elapsedTime, ctx);
  minicar.render(elapsedTime, ctx);
}

},{"./entity-manager":2,"./game.js":3,"./log.js":4,"./minicar.js":5,"./player.js":6,"./river.js":7,"./road.js":8}],2:[function(require,module,exports){
module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
    this.cellSize = cellSize;
    this.widthInCells = Math.ceil(width / cellSize);
    this.heightInCells = Math.ceil(height / cellSize);
    this.cells = [];
    this.numberOfCells = this.widthInCells * this.heightInCells;
    for (var i = 0; i < this.numberOfCells; i++) {
        this.cells[i] = [];
    }
    this.cells[-1] = [];
}

function getIndex(x, y) {
    var x = Math.floor(x / this.cellSize);
    var y = Math.floor(y / this.cellSize);
    if (x < 0 ||
       x >= this.widthInCells ||
       y < 0 ||
       y >= this.heightInCells
    ) return -1;
    return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function (entity) {
    var index = getIndex.call(this, entity.x, entity.y);
    this.cells[index].push(entity);
    entity._cell = index;
}

EntityManager.prototype.updateEntity = function (entity) {
    var index = getIndex.call(this, entity.x, entity.y);
    // If we moved to a new cell, remove from old and add to new
    if (index != entity._cell) {
        var cellIndex = this.cells[entity._cell].indexOf(entity);
        if (cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
        this.cells[index].push(entity);
        entity._cell = index;
    }
}

EntityManager.prototype.removeEntity = function (entity) {
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if (cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
    entity._cell = undefined;
}

EntityManager.prototype.collide = function (callback) {
    var self = this;
    this.cells.forEach(function (cell, i) {
        // test for collisions
        cell.forEach(function (entity1) {
            // check for collisions with cellmates
            cell.forEach(function (entity2) {
                if (entity1 != entity2) checkForCollision(entity1, entity2, callback);

                // check for collisions in cell to the right
                if (i % (self.widthInCells - 1) != 0) {
                    self.cells[i + 1].forEach(function (entity2) {
                        checkForCollision(entity1, entity2, callback);
                    });
                }

                // check for collisions in cell below
                if (i < self.numberOfCells - self.widthInCells) {
                    self.cells[i + self.widthInCells].forEach(function (entity2) {
                        checkForCollision(entity1, entity2, callback);
                    });
                }

                // check for collisions diagionally below and right
                if (i < self.numberOfCells - self.withInCells && i % (self.widthInCells - 1) != 0) {
                    self.cells[i + self.widthInCells + 1].forEach(function (entity2) {
                        checkForCollision(entity1, entity2, callback);
                    });
                }
            });
        });
    });
}

function checkForCollision(entity1, entity2, callback) {
    var collides = !(entity1.x + entity1.width < entity2.x ||
                     entity1.x > entity2.x + entity2.width ||
                     entity1.y + entity1.height < entity2.y ||
                     entity1.y > entity2.y + entity2.height);
    if (collides) {
        callback(entity1, entity2);
    }
}

EntityManager.prototype.renderCells = function (ctx) {
    for (var x = 0; x < this.widthInCells; x++) {
        for (var y = 0; y < this.heightInCells; y++) {
            ctx.strokeStyle = '#333333';
            ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        }
    }
}
},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
  this.idScore = document.getElementById('id_score');
  this.idLives = document.getElementById('id_lives');
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the Player class
 */
module.exports = exports = Log;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Log(position) {
    this.state = "moving";
    this.x = position.x;
    this.y = position.y;
    this.width = 64;
    this.height = 128;
    //this.height = 64;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/log.png');
    this.timer = 0;
    this.frame = 0;
    this.speed = 1;
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Log.prototype.update = function (time) {
    switch (this.state) {
        case "moving":
            this.timer += time;
            this.y -= this.speed;
            if (this.y < -this.height) this.y = 480;
            /*
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) this.frame = 0;
            }
            */
            break;
    }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Log.prototype.render = function (time, ctx) {
    switch (this.state) {
        case "moving":
            ctx.drawImage(
              // image
              this.spritesheet,
              // source rectangle
              this.frame * 64, 64, this.width, this.height,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
            break;
    }
}

},{}],5:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the Player class
 */
module.exports = exports = MiniCar;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function MiniCar(position) {
    this.state = "driving";
    this.x = position.x;
    this.y = position.y;
    this.width = 200;
    this.height = 270;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/cars_mini.svg');
    this.timer = 0;
    this.frame = 0;
    this.speed = 1;
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
MiniCar.prototype.update = function (time) {
    switch (this.state) {
        case "driving":
            this.timer += time;
            this.y -= this.speed;
            if (this.y < -this.height) this.y = 480;
            /*
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) this.frame = 0;
            }
            */
            break;
    }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
MiniCar.prototype.render = function (time, ctx) {
    switch (this.state) {
        case "driving":
            ctx.drawImage(
              // image
              this.spritesheet,
              // source rectangle
              this.frame * 64, 64, this.width, this.height,
              // destination rectangle
              this.x, this.y, this.width/2, this.height/2
          );
            ctx.strokeStyle = this.color;
            ctx.strokeRect(this.x, this.y, this.width/2, this.height/2);
            break;
    }
}

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;

  var self = this;

  window.onkeydown = function (event) {
      // stop default scrolling with arrows
      event.preventDefault();

      switch (event.keyCode) {
          // UP
          case 38:
          case 87:
              self.state = "up";
              break;
          // LEFT
          case 37:
          case 65:

              break;
          // RIGHT    
          case 39:
          case 68:
              self.state = "hopping";
              break;
          //DOWN
          case 40:
          case 83:
              self.state = "down"
              break;

      }
  }
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function (time, state) {
    if (state == "ridingLog") this.state = state;

    switch (this.state) {
        case "idle":
            this.timer += time;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) this.frame = 0;
            }
            break;
        case "hopping":
            console.log("hopping case");
            this.timer += time;
            this.x += 2;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
        case "up":
            this.timer += time;
            this.y -= 2;

            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
        case "down":
            this.timer += time;
            this.y += 5;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
            /*
        case "ridingLog":
            this.timer += time;
            this.y -= 1;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) this.frame = 0;
            }
            break;
            */
    // TODO: Implement your player's update by state
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
        ctx.drawImage(
          // image
          this.spritesheet,
          // source rectangle
          this.frame * 64, 64, this.width, this.height,
          // destination rectangle
          this.x, this.y, this.width, this.height
      );
      break;
      case "hopping":
          ctx.drawImage(
              //image
              this.spritesheet,
              // source rectangle
              this.frame * 64, 64, this.width, this.height-128,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
          break;
      case "up":
          ctx.drawImage(
             //image
             this.spritesheet,
             // source rectangle
             this.frame * 64, 64, this.width, this.height,
             // destination rectangle
             this.x, this.y, this.width, this.height
         );
          //console.log("hopping x: " + this.x);
          break;
      case "down":
          ctx.drawImage(
             //image
             this.spritesheet,
             // source rectangle
             this.frame * 64, 64, this.width, this.height,
             // destination rectangle
             this.x, this.y, this.width, this.height
         );
          //console.log("hopping x: " + this.x);
          break;
      case "ridingLog":
          ctx.drawImage(
             //image
             this.spritesheet,
             // source rectangle
             this.frame * 64, 64, this.width, this.height,
             // destination rectangle
             this.x, this.y, this.width, this.height
         );
          //console.log("hopping x: " + this.x);
          break;
          // TODO: Implement your player's redering according to state
  }
  ctx.strokeStyle = this.color;
  ctx.strokeRect(this.x, this.y, this.width, this.height);
}

},{}],7:[function(require,module,exports){
"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = River;

function River(position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 64;
    this.height = 480;
    //this.height = 64;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/river.png');
}

River.prototype.render = function (time, ctx) {

    ctx.drawImage(
        //image
        this.spritesheet,
        // source rectangle
        //this.frame * 64, 64, this.width, this.height,
        //this.width, this.height
        // destination rectangle
        this.x, this.y, this.width, this.height
    );
}

},{}],8:[function(require,module,exports){
"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = Road;

function Road(position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 100
    this.height = 480;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/road.png');
}

Road.prototype.render = function (time, ctx) {

    ctx.drawImage(
        //image
        this.spritesheet,
        // source rectangle
        //this.frame * 64, 64, this.width, this.height,
        //this.width, this.height
        // destination rectangle
        this.x, this.y, this.width, this.height
    );
}

},{}]},{},[1]);
