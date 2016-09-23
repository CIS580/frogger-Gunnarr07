"use strict;"

/* Classes */
const Game = require('./game.js');
const EntityManager = require('./entity-manager');
const Player = require('./player.js');
const Road = require('./road.js');
const TruckUp = require('./truck-up.js');
const TruckDown = require('./truck-down.js');
const MiniCar = require('./minicar.js');
const RaceCar = require('./race-car.js');
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

// Create second road and truck
var road2 = new Road({ x: 512, y: 0 });
var truckDown = new TruckDown({ x: 512, y: -133 });
entities.addEntity(truckDown);
/*
var racecar = new RaceCar({ x: 512, y: canvas.height });
entities.addEntity(racecar);
 */

// Create first river and logs for it
var river1 = new River({ x: 300, y: 0 });
var log1 = new Log({ x: 300, y: 264 });
entities.addEntity(log1);
var log2 = new Log({ x: 300, y: canvas.height })
entities.addEntity(log2);

// Create second river and logs for it
var river2 = new River({ x: 640, y: 0 });
entities.addEntity(river2);


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

    truckDown.update(elapsedTime);
    entities.updateEntity(truckDown);
    /*
    racecar.update(elapsedTime);
    entities.updateEntity(racecar);
    */

    log1.update(elapsedTime);
    entities.updateEntity(log1);

    log2.update(elapsedTime);
    entities.updateEntity(log2);

    if (player.x >= canvas.width) {
        score += 100;
        level++;
        game.idStats.innerHTML = "Lives: " + lives + " Score: " + score + " Level: " + level; player.x = 0;
        player.y = 240;
        truckup.speed++;
        truckDown.speed++;
    }

    smashed = false;
    onlog = false;

    entities.collide(function (entity1, entity2) {
        if ((entity1 instanceof Player && entity2 instanceof TruckUp || entity1 instanceof TruckUp && entity2 instanceof Player) ||
            (entity1 instanceof Player && entity2 instanceof TruckDown || entity1 instanceof TruckDown && entity2 instanceof Player)) {

            entity1.color = '#ff0000';
            entity2.color = '#00ff00';
            console.log("collision car and player");
            smashed = true;
            onlog = false;

        }
        else if (entity1 instanceof Player && entity2 instanceof Log || entity1 instanceof Log && entity2 instanceof Player) {
            console.log("collision with log");
            smashed = false;
            onlog = true;
        }
    });

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
    player.render(elapsedTime, ctx);
    truckup.render(elapsedTime, ctx);
    truckDown.render(elapsedTime, ctx);
    //racecar.render(elapsedTime, ctx);
}
