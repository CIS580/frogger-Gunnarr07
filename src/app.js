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
var paused = false;
var idRestart = document.getElementById('id_restart');

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

var river1 = new River({ x: 300, y: 0 });
entities.addEntity(river1);
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
    if (!paused) {
        player.update(elapsedTime);
        entities.updateEntity(player);
        minicar.update(elapsedTime);
        entities.updateEntity(minicar);
        log.update(elapsedTime);
        entities.updateEntity(log);
        entities.updateEntity(river1);
        // TODO: Update the game objects
        /*
        entities.collide(function (entity1, entity2) {
            entity1.color = '#ff0000';
            entity2.color = '#00ff00';
        });
        */
        entities.collide(function (entity1, entity2) {
            if (entity1 instanceof Player && entity2 instanceof MiniCar || entity1 instanceof MiniCar && entity2 instanceof Player) {
                entity1.color = '#ff0000';
                entity2.color = '#00ff00';
                console.log("collision car and player");
                console.log(entity1);
                console.log(entity2);
                paused = true;
                idRestart.style.display = "block";
                document.getElementById('id_button').onclick = function () {
                    location.reload();
                }
            }
            if (entity1 instanceof Player && entity2 instanceof River || entity1 instanceof River && entity2 instanceof Player) {
                entity1.color = '#ff0000';
                entity2.color = '#00ff00';
                console.log("collision river and player");
                console.log(entity1);
                console.log(entity2);
                paused = true;
                idRestart.style.display = "block";
                document.getElementById('id_button').onclick = function () {
                    location.reload();
                }
            }
            if (entity1 instanceof Player && entity2 instanceof Log || entity1 instanceof Log && entity2 instanceof Player) {
                entity1.color = '#ff0000';
                entity2.color = '#00ff00';
                console.log("collision log and player");
                console.log(entity1);
                console.log(entity2);
                //player.update(elapsedTime, "ridingLog");
            }
        });
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
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  road1.render(elapsedTime, ctx);
  road2.render(elapsedTime, ctx);
  river1.render(elapsedTime, ctx);
  river2.render(elapsedTime, ctx);
  entities.renderCells(ctx);
  log.render(elapsedTime, ctx);
  player.render(elapsedTime, ctx);
  minicar.render(elapsedTime, ctx);
}
