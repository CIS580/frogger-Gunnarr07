/* Player class
 * Author: Nathan Bean
 * Modified by: Jeremy Taylor
 * player.js
*/

"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite0.png');
  this.timer = 0;
  this.frame = 0;
  this.speed = 2;
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function (time) {
    switch (this.state) {
        case "idle":
            this.timer += time;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) this.frame = 0;
            }
            break;
        case "hopping-up":
            this.timer += time;
            if (this.y >= 0) {
                this.y -= this.speed;
            }
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
        case "hopping-left":
            this.timer += time;
            if(this.x >= 0){
                this.x -= this.speed;
            }
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
        case "hopping-right":
            this.timer += time;
            this.x += this.speed;
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
        case "hopping-down":
            this.timer += time;
            if (this.y + 64 <= 480) {
                this.y += this.speed;
            }
            if (this.timer > MS_PER_FRAME) {
                this.timer = 0;
                this.frame += 1;
                if (this.frame > 3) {
                    this.frame = 0;
                    this.state = "idle";
                }
            }
            break;
    // TODO: Implement your player's update by state
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
        ctx.drawImage(
          // image
          this.spritesheet,
          // source rectangle
          this.frame * 64, 64, this.width, this.height,
          // destination rectangle
          this.x, this.y, this.width, this.height
      );
        break;
      case "hopping-up":
          ctx.drawImage(
             //image
             this.spritesheet,
             // source rectangle
             this.frame * 64, 64, this.width, this.height-128,
             // destination rectangle
             this.x, this.y, this.width, this.height
         );
          break;
      case "hopping-right":
          ctx.drawImage(
              //image
              this.spritesheet,
              // source rectangle
              this.frame * 64, 64, this.width, this.height-128,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
          break;
      case "hopping-left":
          ctx.drawImage(
             //image
             this.spritesheet,
             // source rectangle
             this.frame * 64, 64, this.width, this.height-128,
             // destination rectangle
             this.x, this.y, this.width, this.height
         );
          break;
      case "hopping-down":
          ctx.drawImage(
             //image
             this.spritesheet,
             // source rectangle
             this.frame * 64, 64, this.width, this.height-128,
             // destination rectangle
             this.x, this.y, this.width, this.height
         );
          break;
          // TODO: Implement your player's redering according to state
  }
}
