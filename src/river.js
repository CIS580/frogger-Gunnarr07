"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = River;

function River(position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 64;
    this.height = 480;
    //this.height = 64;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/river.png');
    this.speed = 1;

}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
River.prototype.update = function (time) {

    this.y -= this.speed;
    if (this.y < -this.height) this.y = 480;

    /*
    switch (this.state) {
        case "moving":
            this.timer += time;
            this.y -= this.speed;
            if (this.y < -this.height) this.y = 480;
            
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) this.frame = 0;
            }
            
            break;
    }
    */
}

River.prototype.render = function (time, ctx) {

    ctx.drawImage(
        //image
        this.spritesheet,
        // source rectangle
        //this.frame * 64, 64, this.width, this.height,
        //this.width, this.height
        // destination rectangle
        this.x, this.y, this.width, this.height
    );
}
