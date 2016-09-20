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
var entities = new EntityManager(canvas.width, canvas.height, 128);

// The player as a frog
var player = new Player({ x: 0, y: 240 })
entities.addEntity(player);

// create game objects
var road1 = new Road({ x: 100, y: 0 });
var road2 = new Road({ x: 450, y: 0 });
//var minicar = new MiniCar({ x: 100, y: 500 });
var minicar = new MiniCar({ x: 100, y: canvas.height });
entities.addEntity(minicar);

var river1 = new River({ x: 300, y: 0 });
var river2 = new River({ x: 640, y: 0 });
var log = new Log({x: 300, y: 500})

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
    log.update(elapsedTime);
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
  road1.render(elapsedTime, ctx);
  road2.render(elapsedTime, ctx);
  river1.render(elapsedTime, ctx);
  river2.render(elapsedTime, ctx);
  log.render(elapsedTime, ctx);
  player.render(elapsedTime, ctx);
  minicar.render(elapsedTime, ctx);
}
