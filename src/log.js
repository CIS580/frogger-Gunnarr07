/* Log class
 * Author: Jeremy Taylor
 * log.js
*/

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
              64, 64, this.width, this.height,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
            break;
    }
}
