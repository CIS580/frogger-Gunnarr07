"use strict";

const MS_PER_FRAME = 1000 / 8;

/**
 * @module exports the TruckUp class
 */
module.exports = exports = TruckDown;

/**
 * @constructor TruckDown
 * Creates a new truck down object
 * @param {Postition} position object specifying an x and y
 */
function TruckDown(position) {
    this.state = "driving";
    this.x = position.x;
    this.y = position.y;
    this.width = 57;
    this.height = 126;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/truck_down.png');
    this.frame = 0;
    this.speed = 1;
}



/**
 * @function updates the truck down object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
TruckDown.prototype.update = function (time) {
    switch (this.state) {
        case "driving":
            this.timer += time;
            this.y += this.speed;
            if (this.y > 480) this.y = -this.height;
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
 * @function renders the truck down into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
TruckDown.prototype.render = function (time, ctx) {
    switch (this.state) {
        case "driving":
            ctx.drawImage(
              // image
              this.spritesheet,
              // source rectangle
              0, 0, 113, 266,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
            break;
    }
}
