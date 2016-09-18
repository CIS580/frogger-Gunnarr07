"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = Road;

function Road(position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 100;
    this.height = 500;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/road.png');
}

Road.prototype.render = function (time, ctx) {

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
