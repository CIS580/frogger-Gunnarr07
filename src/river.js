/* River class
 * Author: Jeremy Taylor
 * river.js
*/

"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = River;

/**
 * @constructor River
 * Creates a new river object
 * @param {Postition} position object specifying an x and y
 */
function River(position) {
    this.x = position.x;
    this.y = position.y;
    this.width = 64;
    this.height = 480;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/river.png');
}

/**
 * @function renders the river into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
River.prototype.render = function (time, ctx) {
    ctx.drawImage(
        //image
        this.spritesheet,
        // source rectangle
        0, 0, 1152, 648,
        // destination rectangle
        this.x, this.y, this.width, this.height
    );
}
