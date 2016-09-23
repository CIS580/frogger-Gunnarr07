(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the TruckUp class
 */
module.exports = exports = Ambulance;

/**
 * @constructor Ambulance
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Ambulance(position) {
    this.state = "driving";
    this.x = position.x;
    this.y = position.y;
    this.width = 57;
    this.height = 128;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/car6.png');
    this.timer = 0;
    this.frame = 0;
    this.speed = 1;
}



/**
 * @function updates the Ambulance object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Ambulance.prototype.update = function (time) {
    switch (this.state) {
        case "driving":
            this.timer += time;
            this.y -= this.speed;
            if (this.y < -this.height) this.y = 480;
            break;
    }
}

/**
 * @function renders the Ambulance into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Ambulance.prototype.render = function (time, ctx) {
    switch (this.state) {
        case "driving":
            ctx.drawImage(
              // image
              this.spritesheet,
              // source rectangle
              0, 0, 112, 266,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
            break;
    }
}

},{}],2:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const EntityManager = require('./entity-manager');
const Player = require('./player.js');
const Road = require('./road.js');
const TruckUp = require('./truck-up.js');
const TruckDown = require('./truck-down.js');
const Ambulance = require('./ambulance.js');
const CarDown = require('./car.js');
const River = require('./river.js');
const Log = require('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var entities = new EntityManager(canvas.width, canvas.height, 128);
var score = 0;
var lives = 3;
var level = 1;
var onlog = false;
var smashed = false;

// The player as a frog
var player = new Player({ x: 0, y: 240 })
entities.addEntity(player);

// Create first road and truck 
var road1 = new Road({ x: 128, y: 0 });
var truckup = new TruckUp({ x: 150, y: canvas.height });
entities.addEntity(truckup);
var ambulance = new Ambulance({ x: 150, y: 150 });
entities.addEntity(ambulance);

// Create second road and truck
var road2 = new Road({ x: 512, y: 0 });
var truckDown = new TruckDown({ x: 534, y: -133 });
entities.addEntity(truckDown);
var carDown = new CarDown({ x: 534, y: 150 });
entities.addEntity(carDown);

// Create first river and logs for it
var river1 = new River({ x: 320, y: 0 });
var log1 = new Log({ x: 320, y: 0 });
entities.addEntity(log1);
var log2 = new Log({ x: 320, y: 300 })
entities.addEntity(log2);

// Create second river and logs for it
var river2 = new River({ x: 640, y: 0 });
entities.addEntity(river2);
var log3 = new Log({ x: 640, y: 150 });
entities.addEntity(log3);


// Check for key input for player movement and game pausing
window.onkeydown = function (event) {
    event.preventDefault();
    switch (event.keyCode) {
        // UP
        case 38:
        case 87:
            player.state = "hopping-up";
            break;
            // LEFT
        case 37:
        case 65:
            player.state = "hopping-left"
            break;
            // RIGHT    
        case 39:
        case 68:
            player.state = "hopping-right";
            break;
            //DOWN
        case 40:
        case 83:
            player.state = "hopping-down"
            break;
        case 27:
            if (game.paused) {
                game.idPaused.style.display = "none";
                game.paused = false;
            }
            else {
                game.paused = true;
                game.idPaused.style.display = "block";
            }
            break;
    }
}

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
    // TODO: Update the game objects

    player.update(elapsedTime);
    entities.updateEntity(player);

    truckup.update(elapsedTime);
    entities.updateEntity(truckup);

    ambulance.update(elapsedTime);
    entities.updateEntity(ambulance);

    truckDown.update(elapsedTime);
    entities.updateEntity(truckDown);
    
    carDown.update(elapsedTime);
    entities.updateEntity(carDown);

    log1.update(elapsedTime);
    entities.updateEntity(log1);

    log2.update(elapsedTime);
    entities.updateEntity(log2);

    log3.update(elapsedTime);
    entities.updateEntity(log3);

    // Check if player made it across safely
    if (player.x >= canvas.width) {
        score += 100;
        level++;
        game.idStats.innerHTML = "Lives: " + lives + " Score: " + score + " Level: " + level; player.x = 0;
        player.y = 240;
        truckup.speed++;
        ambulance.speed++;
        truckDown.speed++;
        carDown.speed++;
        if (level == 2) {
            player.speed++;
        }
    }

    smashed = false;
    onlog = false;

    // Check for collisions
    entities.collide(function (entity1, entity2) {
        if ((entity1 instanceof Player && entity2 instanceof TruckUp || entity1 instanceof TruckUp && entity2 instanceof Player) || 
            (entity1 instanceof Player && entity2 instanceof TruckDown || entity1 instanceof TruckDown && entity2 instanceof Player) || 
            (entity1 instanceof Player && entity2 instanceof Ambulance || entity1 instanceof Ambulance && entity2 instanceof Player) || 
            (entity1 instanceof Player && entity2 instanceof CarDown || entity1 instanceof CarDown && entity2 instanceof Player)) {

            smashed = true;
            onlog = false;

        }
        else if (entity1 instanceof Player && entity2 instanceof Log || entity1 instanceof Log && entity2 instanceof Player) {
            smashed = false;
            onlog = true;
        }
    });

    // Take care of collision actions
    if (smashed || ((player.x >= river1.x && !onlog) && (player.x <= (river1.x + 64) && !onlog))) {
        if (lives == 0) {
            game.paused = true;
            game.restart();
        }
        player.x = 0;
        player.y = 240;
        lives--;
        game.idStats.innerHTML = "Lives: " + lives + " Score: " + score + " Level: " + level;
    }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
    ctx.fillStyle = '#005C09';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    road1.render(elapsedTime, ctx);
    road2.render(elapsedTime, ctx);
    river1.render(elapsedTime, ctx);
    river2.render(elapsedTime, ctx);
    entities.renderCells(ctx);
    log1.render(elapsedTime, ctx);
    log2.render(elapsedTime, ctx);
    log3.render(elapsedTime, ctx);
    player.render(elapsedTime, ctx);
    truckup.render(elapsedTime, ctx);
    ambulance.render(elapsedTime, ctx);
    truckDown.render(elapsedTime, ctx);
    carDown.render(elapsedTime, ctx);
}

},{"./ambulance.js":1,"./car.js":3,"./entity-manager":4,"./game.js":5,"./log.js":6,"./player.js":7,"./river.js":8,"./road.js":9,"./truck-down.js":10,"./truck-up.js":11}],3:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the CarDown class
 */
module.exports = exports = CarDown;

/**
 * @constructor CarDown
 * Creates a new car object
 * @param {Postition} position object specifying an x and y
 */
function CarDown(position) {
    this.state = "driving";
    this.x = position.x;
    this.y = position.y;
    this.width = 56;
    this.height = 126;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/car2.png');
    this.frame = 0;
    this.speed = 1;
}



/**
 * @function updates the car object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
CarDown.prototype.update = function (time) {
    switch (this.state) {
        case "driving":
            this.timer += time;
            this.y += this.speed;
            if (this.y > 480) this.y = -this.height;
            break;
    }
}

/**
 * @function renders the car into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
CarDown.prototype.render = function (time, ctx) {
    switch (this.state) {
        case "driving":
            ctx.drawImage(
              // image
              this.spritesheet,
              // source rectangle
              0, 0, 112, 265,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
            break;
    }
}

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
  this.idStats = document.getElementById('id_stats');
  this.idRestart = document.getElementById('id_restart');
  this.idPaused = document.getElementById('id_paused');
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
 * @function restart
 * Allow the player restart the game if they lost
 */
Game.prototype.restart = function () {
    this.idRestart.style.display = "block";
    document.getElementById('id_button').onclick = function () {
        location.reload();
    }
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

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the Log class
 */
module.exports = exports = Log;

/**
 * @constructor Log
 * Creates a new log object
 * @param {Postition} position object specifying an x and y
 */
function Log(position) {
    this.state = "moving";
    this.x = position.x;
    this.y = position.y;
    this.width = 64;
    this.height = 128;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/log.png');
    this.timer = 0;
    this.frame = 0;
    this.speed = 1;
}



/**
 * @function updates the log object
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
 * @function renders the log into the provided context
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
              0, 0, this.width, this.height,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
            break;
    }
}

},{}],7:[function(require,module,exports){
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
  this.speed = 2;
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function (time) {
    switch (this.state) {
        case "idle":
            this.timer += time;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) this.frame = 0;
            }
            break;
        case "hopping-up":
            this.timer += time;
            this.y -= this.speed;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
        case "hopping-left":
            this.timer += time;
            this.x -= this.speed;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
        case "hopping-right":
            this.timer += time;
            this.x += this.speed;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
        case "hopping-down":
            this.timer += time;
            this.y += this.speed;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
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
      case "hopping-up":
          ctx.drawImage(
             //image
             this.spritesheet,
             // source rectangle
             this.frame * 64, 64, this.width, this.height-128,
             // destination rectangle
             this.x, this.y, this.width, this.height
         );
          break;
      case "hopping-right":
          ctx.drawImage(
              //image
              this.spritesheet,
              // source rectangle
              this.frame * 64, 64, this.width, this.height-128,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
          break;
      case "hopping-left":
          ctx.drawImage(
             //image
             this.spritesheet,
             // source rectangle
             this.frame * 64, 64, this.width, this.height-128,
             // destination rectangle
             this.x, this.y, this.width, this.height
         );
          break;
      case "hopping-down":
          ctx.drawImage(
             //image
             this.spritesheet,
             // source rectangle
             this.frame * 64, 64, this.width, this.height-128,
             // destination rectangle
             this.x, this.y, this.width, this.height
         );
          break;
          // TODO: Implement your player's redering according to state
  }
}

},{}],8:[function(require,module,exports){
"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = River;

/**
 * @constructor River
 * Creates a new river object
 * @param {Postition} position object specifying an x and y
 */
function River(position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 64;
    this.height = 480;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/river.png');
}

/**
 * @function renders the river into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
River.prototype.render = function (time, ctx) {
    ctx.drawImage(
        //image
        this.spritesheet,
        // source rectangle
        0, 0, 1152, 648,
        // destination rectangle
        this.x, this.y, this.width, this.height
    );
}

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the TruckUp class
 */
module.exports = exports = TruckDown;

/**
 * @constructor TruckDown
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function TruckDown(position) {
    this.state = "driving";
    this.x = position.x;
    this.y = position.y;
    this.width = 57;
    this.height = 126;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/truck_down.png');
    this.frame = 0;
    this.speed = 1;
}



/**
 * @function updates the truck object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
TruckDown.prototype.update = function (time) {
    switch (this.state) {
        case "driving":
            this.timer += time;
            this.y += this.speed;
            if (this.y > 480) this.y = -this.height;
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
 * @function renders the truck into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
TruckDown.prototype.render = function (time, ctx) {
    switch (this.state) {
        case "driving":
            ctx.drawImage(
              // image
              this.spritesheet,
              // source rectangle
              0, 0, 113, 266,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
            break;
    }
}

},{}],11:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the TruckUp class
 */
module.exports = exports = TruckUp;

/**
 * @constructor TruckUp
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function TruckUp(position) {
    this.state = "driving";
    this.x = position.x;
    this.y = position.y;
    this.width = 57;
    this.height = 126;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/truck_up.png');
    this.timer = 0;
    this.frame = 0;
    this.speed = 1;
}



/**
 * @function updates the truck object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
TruckUp.prototype.update = function (time) {
    switch (this.state) {
        case "driving":
            this.timer += time;
            this.y -= this.speed;
            if (this.y < -this.height) this.y = 480;
            break;
    }
}

/**
 * @function renders the truck into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
TruckUp.prototype.render = function (time, ctx) {
    switch (this.state) {
        case "driving":
            ctx.drawImage(
              // image
              this.spritesheet,
              // source rectangle
              0, 0, 113, 266,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
            break;
    }
}

},{}]},{},[2]);
