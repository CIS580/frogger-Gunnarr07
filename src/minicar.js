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
            ctx.strokeStyle = this.color;
            ctx.strokeRect(this.x, this.y, this.width/2, this.height/2);
            break;
    }
}
