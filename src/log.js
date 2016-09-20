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
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/log.png');
    this.timer = 0;
    this.frame = 0;
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Log.prototype.update = function (time) {
    switch (this.state) {
        case "moving":
            this.timer += time;
            this.y -= 1;
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
