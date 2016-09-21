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
