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
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;
}

var self = this;

window.onkeydown = function (event) {
    switch (event.keyCode) {
        // UP
        case 38:
        case 87:
            //input.up = true;
            //y -= 1;
            break;
        // LEFT
        case 37:
        case 65:
            //input.left = true;
            //x -= 1;
            self.state = "hopping";
            break;
        // RIGHT    
        case 39:
        case 68:
            //input.right = true;
            //x += 1;
            break;
        //DOWN
        case 40:
        case 83:
            //input.down = true;
            //y += 1;
            break;

    }
}

window.onkeyup = function (event) {
    switch (event.keyCode) {
        // UP
        case 38:
        case 87:
            //input.up = true;
            //y -= 1;
            break;
            // LEFT
        case 37:
        case 65:
            //input.left = true;
            //x -= 1;
            //self.state = "idle";
            break;
            // RIGHT    
        case 39:
        case 68:
            //input.right = true;
            //x += 1;
            break;
            //DOWN
        case 40:
        case 83:
            //input.down = true;
            //y += 1;
            break;

    }
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
      case "hopping":
          this.timer += time;
          self.x += 13;
          if(timer > MS_PER_FRAME){
              this.timer = 0;
              //self.state = "idle";
          }

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
      case "hopping":
          ctx.drawImage(
              //image
              this.spritesheet,
              // source rectangle
              this.frame * 64, 64, this.width, this.height,
              // destination rectangle
              this.x, this.y, this.width, this.height
          );
          break;
    // TODO: Implement your player's redering according to state
  }
}
