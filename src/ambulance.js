/* Ambulance class
 * Author: Jeremy Taylor
 * ambulance.js
*/

"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the Ambulance class
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
