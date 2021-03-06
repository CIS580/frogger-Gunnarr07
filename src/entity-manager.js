/* Entity-manager code from CIS580
 * Author: Nathan Bean
 * Used by: Jeremy Taylor
 * entity-manager.js
*/

module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
    this.cellSize = cellSize;
    this.widthInCells = Math.ceil(width / cellSize);
    this.heightInCells = Math.ceil(height / cellSize);
    this.cells = [];
    this.numberOfCells = this.widthInCells * this.heightInCells;
    for (var i = 0; i < this.numberOfCells; i++) {
        this.cells[i] = [];
    }
    this.cells[-1] = [];
}

function getIndex(x, y) {
    var x = Math.floor(x / this.cellSize);
    var y = Math.floor(y / this.cellSize);
    if (x < 0 ||
       x >= this.widthInCells ||
       y < 0 ||
       y >= this.heightInCells
    ) return -1;
    return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function (entity) {
    var index = getIndex.call(this, entity.x, entity.y);
    this.cells[index].push(entity);
    entity._cell = index;
}

EntityManager.prototype.updateEntity = function (entity) {
    var index = getIndex.call(this, entity.x, entity.y);
    // If we moved to a new cell, remove from old and add to new
    if (index != entity._cell) {
        var cellIndex = this.cells[entity._cell].indexOf(entity);
        if (cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
        this.cells[index].push(entity);
        entity._cell = index;
    }
}

EntityManager.prototype.removeEntity = function (entity) {
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if (cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
    entity._cell = undefined;
}

EntityManager.prototype.collide = function (callback) {
    var self = this;
    this.cells.forEach(function (cell, i) {
        // test for collisions
        cell.forEach(function (entity1) {
            // check for collisions with cellmates
            cell.forEach(function (entity2) {
                if (entity1 != entity2) checkForCollision(entity1, entity2, callback);

                // check for collisions in cell to the right
                if (i % (self.widthInCells - 1) != 0) {
                    self.cells[i + 1].forEach(function (entity2) {
                        checkForCollision(entity1, entity2, callback);
                    });
                }

                // check for collisions in cell below
                if (i < self.numberOfCells - self.widthInCells) {
                    self.cells[i + self.widthInCells].forEach(function (entity2) {
                        checkForCollision(entity1, entity2, callback);
                    });
                }

                // check for collisions diagionally below and right
                if (i < self.numberOfCells - self.withInCells && i % (self.widthInCells - 1) != 0) {
                    self.cells[i + self.widthInCells + 1].forEach(function (entity2) {
                        checkForCollision(entity1, entity2, callback);
                    });
                }
            });
        });
    });
}

function checkForCollision(entity1, entity2, callback) {
    var collides = !(entity1.x + entity1.width < entity2.x ||
                     entity1.x > entity2.x + entity2.width ||
                     entity1.y + entity1.height < entity2.y ||
                     entity1.y > entity2.y + entity2.height);
    if (collides) {
        callback(entity1, entity2);
    }
}

EntityManager.prototype.renderCells = function (ctx) {
    for (var x = 0; x < this.widthInCells; x++) {
        for (var y = 0; y < this.heightInCells; y++) {
            //ctx.strokeStyle = '#333333';
            //ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        }
    }
}