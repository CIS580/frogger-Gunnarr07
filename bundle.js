(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Road = require('./road.js');
const MiniCar = require('./minicar.js');
const River = require('./river.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({ x: 0, y: 240 })
var road = new Road({ x: 100, y: 0 });
var minicar = new MiniCar({ x: 100, y: 500 });
var river = new River({ x: 300, y: 0 });

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
    minicar.update(elapsedTime);
  // TODO: Update the game objects
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
  road.render(elapsedTime, ctx);
  river.render(elapsedTime, ctx);
  player.render(elapsedTime, ctx);
  minicar.render(elapsedTime, ctx);
}

},{"./game.js":2,"./minicar.js":3,"./player.js":4,"./river.js":5,"./road.js":6}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
MiniCar.prototype.update = function (time) {
    switch (this.state) {
        case "driving":
            this.timer += time;
            this.y -= 2;
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
            break;
    }
}

},{}],4:[function(require,module,exports){
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
            this.y += 2;
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
      console.log("idle x: " + this.x);
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
          console.log("hopping x: " + this.x);
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
    // TODO: Implement your player's redering according to state
  }
}

},{}],5:[function(require,module,exports){
"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = River;

function River(position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 64;
    this.height = 500;
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

},{}],6:[function(require,module,exports){
"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = Road;

function Road(position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 100;
    this.height = 500;
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
