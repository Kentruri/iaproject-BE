"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortCosts = exports.addToList = exports.removeFromStock = exports.addToStock = exports.removeFromQueue = exports.addToQueue = exports.myCoordinates = exports.hashIndex = exports.isSolution = exports.readWorld = exports.getChildren = exports.getMovement = exports.excError = exports.errorTicher = exports.heuristics = exports.POWERUPTYPE = void 0;
//typos
var POWERUPTYPE;
(function (POWERUPTYPE) {
    POWERUPTYPE["STAR"] = "STAR";
    POWERUPTYPE["FLOWER"] = "FLOWER";
    POWERUPTYPE["EMPTY"] = "EMPTY";
})(POWERUPTYPE = exports.POWERUPTYPE || (exports.POWERUPTYPE = {}));
var ACTIONS;
(function (ACTIONS) {
    ACTIONS["LEFT"] = "L";
    ACTIONS["UP"] = "U";
    ACTIONS["RIGHT"] = "R";
    ACTIONS["DOWN"] = "D";
})(ACTIONS || (ACTIONS = {}));
//HEURISTICS
// export const heuristics = (
//   node: node["value"],
//   objective: node["value"],
//   distance: number
// ): number => {
//   const xIsEqual: boolean = node.x == objective.x;
//   const yIsEqual: boolean = node.y == objective.y;
//   if (xIsEqual && yIsEqual) {
//     return Math.floor(distance / 2) + 0.5;
//   }
//   if (!xIsEqual && !yIsEqual) {
//     return heuristics(
//       {
//         x: node.x < objective.x ? node.x + 1 : node.x - 1,
//         y: node.y < objective.y ? node.y + 1 : node.y - 1,
//       },
//       objective,
//       distance + 1
//     );
//   } else if (xIsEqual) {
//     return heuristics(
//       {
//         x: node.x,
//         y: node.y < objective.y ? node.y + 1 : node.y - 1,
//       },
//       objective,
//       distance + 1
//     );
//   } else {
//     return heuristics(
//       {
//         x: node.x < objective.x ? node.x + 1 : node.x - 1,
//         y: node.y,
//       },
//       objective,
//       distance + 1
//     );
//   }
// };
const heuristics = (node, objective) => {
    const diference = {
        x: Math.abs(objective.x - node.x),
        y: Math.abs(objective.y - node.y),
    };
    const distance = Math.sqrt(Math.pow(diference.x, 2) + Math.pow(diference.y, 2)) / 2;
    return distance;
};
exports.heuristics = heuristics;
//CONSTANTS
const costs = [1, 0.5, 6];
const fields = [0, 2, 3, 4, 5, 6];
exports.errorTicher = "profe no hay solucion :'v";
exports.excError = { message: "?? mande eso bien profe :'v" };
//TO DO
//Take powerup and costs from enemies
const getMovement = (node, field) => {
    var finalCost = 0;
    var finalPowerUp = { type: POWERUPTYPE.EMPTY, remainingUses: 0 };
    if (field == 3) {
        //tengo estrella, y llego a otra
        if (node.powerUp.type == POWERUPTYPE.STAR) {
            finalCost = costs[1];
            finalPowerUp = {
                type: POWERUPTYPE.STAR,
                remainingUses: node.powerUp.remainingUses + 6 - 1,
            };
        }
        //no tengo nada
        if (node.powerUp.type == POWERUPTYPE.EMPTY) {
            finalCost = costs[0];
            finalPowerUp = {
                type: POWERUPTYPE.STAR,
                remainingUses: 6,
            };
        }
        //tengo flor, y caigo en una estrella, no pasa nada
        if (node.powerUp.type == POWERUPTYPE.FLOWER) {
            finalCost = costs[0];
            finalPowerUp = {
                type: node.powerUp.type,
                remainingUses: node.powerUp.remainingUses,
            };
        }
    }
    else if (field == 4) {
        //tengo flor, y llego a otra
        if (node.powerUp.type == POWERUPTYPE.FLOWER) {
            finalCost = costs[0];
            finalPowerUp = {
                type: POWERUPTYPE.FLOWER,
                remainingUses: node.powerUp.remainingUses + 1,
            };
        }
        //no tengo nada
        if (node.powerUp.type == POWERUPTYPE.EMPTY) {
            finalCost = costs[0];
            finalPowerUp = {
                type: POWERUPTYPE.FLOWER,
                remainingUses: 1,
            };
        }
        //tengo estrella, y caigo en una flor, no pasa nada, al menos que sea ultimo tiro
        if (node.powerUp.type == POWERUPTYPE.STAR) {
            finalCost = costs[1];
            finalPowerUp = {
                type: node.powerUp.remainingUses - 1 > 0
                    ? POWERUPTYPE.STAR
                    : POWERUPTYPE.FLOWER,
                remainingUses: node.powerUp.remainingUses - 1 > 0
                    ? node.powerUp.remainingUses - 1
                    : 1,
            };
        }
    }
    else if (field == 5) {
        //tengo flor
        if (node.powerUp.type == POWERUPTYPE.FLOWER) {
            finalCost = costs[0];
            finalPowerUp = {
                type: node.powerUp.remainingUses - 1 > 0
                    ? POWERUPTYPE.FLOWER
                    : POWERUPTYPE.EMPTY,
                remainingUses: node.powerUp.remainingUses - 1,
            };
        }
        //no tengo nada
        if (node.powerUp.type == POWERUPTYPE.EMPTY) {
            finalCost = costs[2];
            finalPowerUp = {
                type: POWERUPTYPE.EMPTY,
                remainingUses: node.powerUp.remainingUses,
            };
        }
        ///tengo estrella
        if (node.powerUp.type == POWERUPTYPE.STAR) {
            finalCost = costs[1];
            finalPowerUp = {
                type: node.powerUp.remainingUses - 1 > 0
                    ? POWERUPTYPE.STAR
                    : POWERUPTYPE.EMPTY,
                remainingUses: node.powerUp.remainingUses - 1,
            };
        }
    }
    else {
        finalCost = costs[0];
        finalPowerUp = {
            type: node.powerUp.type,
            remainingUses: node.powerUp.remainingUses,
        };
    }
    return {
        finalCost,
        finalPowerUp,
    };
};
exports.getMovement = getMovement;
const getChildren = (node, globalReference) => {
    let children = [];
    const left = node.value.x - 1 >= 0
        ? globalReference.world[node.value.y][node.value.x - 1]
        : -1;
    const up = node.value.y - 1 >= 0
        ? globalReference.world[node.value.y - 1][node.value.x]
        : -1;
    const right = node.value.x + 1 <= globalReference.world[0].length
        ? globalReference.world[node.value.y][node.value.x + 1]
        : -1;
    const down = node.value.y + 1 <= globalReference.world.length
        ? globalReference.world[node.value.y + 1][node.value.x]
        : -1;
    if (fields.includes(left)) {
        const { finalCost, finalPowerUp } = (0, exports.getMovement)(node, left, globalReference);
        children.push({
            value: { x: node.value.x - 1, y: node.value.y },
            actions: node.actions + ACTIONS.LEFT,
            level: node.level + 1,
            costs: node.costs + finalCost,
            powerUp: finalPowerUp,
        });
    }
    // Up
    if (fields.includes(up)) {
        const { finalCost, finalPowerUp } = (0, exports.getMovement)(node, up);
        children.push({
            value: { x: node.value.x, y: node.value.y - 1 },
            actions: node.actions + ACTIONS.UP,
            level: node.level + 1,
            costs: node.costs + finalCost,
            powerUp: finalPowerUp,
        });
    }
    // Right
    if (fields.includes(right)) {
        const { finalCost, finalPowerUp } = (0, exports.getMovement)(node, right);
        children.push({
            value: { x: node.value.x + 1, y: node.value.y },
            actions: node.actions + ACTIONS.RIGHT,
            level: node.level + 1,
            costs: node.costs + finalCost,
            powerUp: finalPowerUp,
        });
    }
    // Down
    if (fields.includes(down)) {
        const { finalCost, finalPowerUp } = (0, exports.getMovement)(node, down);
        children.push({
            value: { x: node.value.x, y: node.value.y + 1 },
            actions: node.actions + ACTIONS.DOWN,
            level: node.level + 1,
            costs: node.costs + finalCost,
            powerUp: finalPowerUp,
        });
    }
    // console.log(children, "hey");
    return children;
};
exports.getChildren = getChildren;
//Methods
const readWorld = (file) => {
    const Buffer = file.data.toString("utf8");
    const columns = Buffer.split("\r\n");
    const world = [];
    columns.forEach((column) => {
        let columnToNum = column.split(" ").map(Number);
        world.push(columnToNum);
    });
    return world;
};
exports.readWorld = readWorld;
const isSolution = (node, solution) => {
    return node.value.x == solution.x && node.value.y == solution.y;
};
exports.isSolution = isSolution;
const hashIndex = (node) => {
    return node.value.y * 30 + node.value.x + 10;
};
exports.hashIndex = hashIndex;
const myCoordinates = (world, searchTo) => {
    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[0].length; j++) {
            if (world[i][j] == searchTo) {
                return {
                    x: j,
                    y: i,
                };
            }
            else {
            }
        }
    }
    return null;
};
exports.myCoordinates = myCoordinates;
//Data structures, here I put the methods from queue's,heaps,etc
const addToQueue = (queue, nodes) => {
    queue.push(...nodes);
    return queue;
};
exports.addToQueue = addToQueue;
const removeFromQueue = (queue) => {
    return queue.shift();
};
exports.removeFromQueue = removeFromQueue;
const addToStock = (Stock, nodes) => {
    Stock.push(...nodes);
    return Stock;
};
exports.addToStock = addToStock;
const removeFromStock = (Stock) => {
    return Stock.pop();
};
exports.removeFromStock = removeFromStock;
const addToList = (list, nodes) => {
    list.push(...nodes);
    return list;
};
exports.addToList = addToList;
const sortCosts = (list) => {
    return list.sort((a, b) => {
        return a.costs - b.costs;
    });
};
exports.sortCosts = sortCosts;
//# sourceMappingURL=helper.js.map