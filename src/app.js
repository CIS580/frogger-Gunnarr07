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
