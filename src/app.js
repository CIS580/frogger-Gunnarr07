"use strict;"

/* Classes */
const Game = require('./game.js');
const EntityManager = require('./entity-manager');
const Player = require('./player.js');
const Road = require('./road.js');
const TruckUp = require('./truck-up.js');
const MiniCar = require('./minicar.js');
const RaceCar = require('./race-car.js');
const River = require('./river.js');
const Log = require('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var entities = new EntityManager(canvas.width, canvas.height, 64);
//var entities = new EntityManager(canvas.width, canvas.height, 128);
var idRestart = document.getElementById('id_restart');
var score = 0;
var lives = 3;
var level = 1;
var onlog = false;
var smashed = false;

// The player as a frog
var player = new Player({ x: 0, y: 240 })
entities.addEntity(player);

// create game objects
var road1 = new Road({ x: 100, y: 0 });
//var road1 = new Road({ x: 128, y: 0 });

var truckup = new TruckUp({ x: 100, y: canvas.height });
entities.addEntity(truckup);
/*
var minicar = new MiniCar({ x: 100, y: canvas.height });
//var minicar = new MiniCar({ x: 135, y: canvas.height });
entities.addEntity(minicar);
*/
var road2 = new Road({ x: 450, y: 0 });
var racecar = new RaceCar({ x: 450, y: canvas.height });
entities.addEntity(racecar);

/*
var rivers1 = [];
for (var i = 0; i < 5; i++){
    var river = new River({
        x: 300,
        y: i * 64,
    });
    rivers1.push(river);
    entities.addEntity(river);
}
*/





var river1 = new River({ x: 300, y: 0 });

var log1 = new Log({ x: 300, y: 264 });
entities.addEntity(log1);

var river2 = new River({ x: 640, y: 0 });
entities.addEntity(river2);
//var log2 = new Log({ x: 300, y: canvas.height })
//entities.addEntity(log2);

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

    truckup.update(elapsedTime);
    entities.updateEntity(truckup);

    racecar.update(elapsedTime);
    entities.updateEntity(racecar);

    //river1.update(elapsedTime);
    //entities.updateEntity(river1);

    log1.update(elapsedTime);
    //entities.updateEntity(log1);
    //log2.update(elapsedTime);
    //entities.updateEntity(log2);
    /*
    rivers1.forEach(function (river) {
        river.update(elapsedTime);
        //entities.updateEntity(river);
    });
    */

    // TODO: Update the game objects

    if (player.x >= canvas.width) {
        score += 100;
        level++;
        game.idStats.innerHTML = "Lives: " + lives + " Score: " + score + " Level: " + level; player.x = 0;
        player.y = 240;
        truckup.speed++;
        racecar.speed++;
        //log1.speed++;
        //log2.speed++;

    }
    /*
    if (player.x + 64 >= river1.x) {
        player.x = 0;
        player.y = 240;
        lives--;
        game.idStats.innerHTML = "Lives: " + lives + " Score: " + score + " Level: " + level;
        if (lives == 0) {
            game.paused = true;
            idRestart.style.display = "block";
            document.getElementById('id_button').onclick = function () {
                location.reload();
            }
        }
    }
    */




    smashed = false;
    onlog = false;
    entities.collide(function (entity1, entity2) {
        if ((entity1 instanceof Player && entity2 instanceof TruckUp || entity1 instanceof TruckUp && entity2 instanceof Player) ||
            (entity1 instanceof Player && entity2 instanceof RaceCar || entity1 instanceof RaceCar && entity2 instanceof Player)) {

            entity1.color = '#ff0000';
            entity2.color = '#00ff00';
            console.log("collision car and player");
            smashed = true;
            onlog = false;

        }
        else if (entity1 instanceof Player && entity2 instanceof Log || entity1 instanceof Log && entity2 instanceof Player) {
            smashed = false;
            onlog = true;
        }
        /*
        if (player.x >= river1.x || player.x <= (river1.x + 64)) {
            if (entity1 instanceof Player && entity2 instanceof Log || entity1 instanceof Log && entity2 instanceof Player) {
                //game.onlog = true;
                onlog = true;
            }
            if (!(onlog)) {
                player.x = 0;
                player.y = 240;
                lives--;
                game.idStats.innerHTML = "Lives: " + lives + " Score: " + score + " Level: " + level;
                if (lives == 0) {
                    game.paused = true;
                    idRestart.style.display = "block";
                    game.restart();
                    //document.getElementById('id_button').onclick = function () {
                    //    location.reload();
                    //}
                }
            }
        }
         */   
        //else if ((player.x >= river1.x && player.x <= (river1.x + 64) && entity1 instanceof Player && entity2 instanceof Log) ||
        //    (player.x >= river1.x && player.x <= (river1.x + 64) && entity1 instanceof Log && entity2 instanceof Player)) {

        //    /*
        //    player.x = 0;
        //    player.y = 240;
        //    lives--;
        //    game.idStats.innerHTML = "Lives: " + lives + " Score: " + score + " Level: " + level;
        //    if (lives == 0) {
        //        game.paused = true;
        //        idRestart.style.display = "block";
        //        document.getElementById('id_button').onclick = function () {
        //            location.reload();
        //        }
        //    }
        //    */
        ////    if (entity1 instanceof Player && entity2 instanceof Log || entity1 instanceof Log && entity2 instanceof Player) {
        ////        entity1.color = '#ff0000';
        ////        entity2.color = '#00ff00';
        ////        console.log("collision log and player");
        ////        //game.paused = true;
        ////        /*
        ////        player.x = log.x + 65;
        ////        player.y = log.y + 65;
        ////        */
        ////        //console.log(entity1);
        ////        //console.log(entity2);
        ////        //game.paused = true;
        ////        //player.update(elapsedTime, "ridingLog");
        ////    }
        ////    else {
        ////        player.x = 0;
        ////        player.y = 240;
        ////        lives--;
        ////        game.idStats.innerHTML = "Lives: " + lives + " Score: " + score + " Level: " + level;
        ////        if (lives == 0) {
        ////            game.paused = true;
        ////            idRestart.style.display = "block";
        ////            document.getElementById('id_button').onclick = function () {
        ////                location.reload();
        ////            }
        ////        }
        ////    }
        //}

    });
    if (smashed) {
        if (lives == 0) {
            game.paused = true;
            idRestart.style.display = "block";
            game.restart();
        }
        player.x = 0;
        player.y = 240;
        lives--;
        game.idStats.innerHTML = "Lives: " + lives + " Score: " + score + " Level: " + level;
    }
    if ((player.x >= river1.x || player.x <= (river1.x + 64)) && !onlog) {
        if (lives == 0) {
            game.paused = true;
            idRestart.style.display = "block";
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
    /*
    rivers1.forEach(function (river) {
        river.render(elapsedTime, ctx);
    });
    */
    river2.render(elapsedTime, ctx);
    entities.renderCells(ctx);
    log1.render(elapsedTime, ctx);
    //log2.render(elapsedTime, ctx);
    player.render(elapsedTime, ctx);
    truckup.render(elapsedTime, ctx);
    racecar.render(elapsedTime, ctx);
}
