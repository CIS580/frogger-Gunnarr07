"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the CarDown class
 */
module.exports = exports = CarDown;

/**
 * @constructor CarDown
 * Creates a new car object
 * @param {Postition} position object specifying an x and y
 */
function CarDown(position) {
    this.state = "driving";
    this.x = position.x;
    this.y = position.y;
    this.width = 56;
    this.height = 126;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/car2.png');
    this.frame = 0;
    this.speed = 1;
}



/**
 * @function updates the car object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
CarDown.prototype.update = function (time) {
    switch (this.state) {
        case "driving":
            this.timer += time;
            this.y += this.speed;
            if (this.y > 480) this.y = -this.height;
            break;
    }
}

/**
 * @function renders the car into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
CarDown.prototype.render = function (time, ctx) {
    switch (this.state) {
        case "driving":
            ctx.drawImage(
              // image
              this.spritesheet,
              // source rectangle
              0, 0, 112, 265,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
            break;
    }
}
