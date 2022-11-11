"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortCosts = exports.addToList = exports.removeFromStock = exports.addToStock = exports.removeFromQueue = exports.addToQueue = exports.myCoordinates = exports.hashIndex = exports.isSolution = exports.readWorld = exports.getChildren = exports.excError = exports.error = exports.heuristics = void 0;
//typos
var POWERUP;
(function (POWERUP) {
    POWERUP["STAR"] = "STAR";
    POWERUP["FLOWER"] = "FLOWER";
})(POWERUP || (POWERUP = {}));
var ACTIONS;
(function (ACTIONS) {
    ACTIONS["LEFT"] = "L";
    ACTIONS["UP"] = "U";
    ACTIONS["RIGHT"] = "R";
    ACTIONS["DOWN"] = "D";
})(ACTIONS || (ACTIONS = {}));
//HEURISTICS
const heuristics = (node, objective, distance) => {
    const xIsEqual = node.x == objective.x;
    const yIsEqual = node.y == objective.y;
    if (xIsEqual && yIsEqual) {
        return Math.floor(distance / 2) + 0.5;
    }
    if (!xIsEqual && !yIsEqual) {
        return (0, exports.heuristics)({
            x: node.x < objective.x ? node.x + 1 : node.x - 1,
            y: node.y < objective.y ? node.y + 1 : node.y - 1,
        }, objective, distance + 1);
    }
    else if (xIsEqual) {
        return (0, exports.heuristics)({
            x: node.x,
            y: node.y < objective.y ? node.y + 1 : node.y - 1,
        }, objective, distance + 1);
    }
    else {
        return (0, exports.heuristics)({
            x: node.x < objective.x ? node.x + 1 : node.x - 1,
            y: node.y,
        }, objective, distance + 1);
    }
};
exports.heuristics = heuristics;
//CONSTANTS
const actions = ["L", "U", "R", "D"];
const costs = [1, 0.5, 6];
const fields = [2, 3, 4, 5, 6];
exports.error = "profe no hay solucion :'v";
exports.excError = { message: "?? mande eso bien profe :'v" };
//TO DO
//Take powerup and costs from enemies
const getChildren = (node, world) => {
    let children = [];
    const left = world[node.value.y][node.value.x - 1];
    const up = world[node.value.y - 1][node.value.x];
    const right = world[node.value.y][node.value.x + 1];
    const down = world[node.value.y + 1][node.value.x];
    // Left
    if (node.value.x >= 1 && fields.includes(left)) {
        children.push({
            value: { x: node.value.x - 1, y: node.value.y },
            actions: node.actions + ACTIONS.LEFT,
            level: node.level + 1,
            costs: node.costs + costs[0],
            powerUp: undefined,
        });
    }
    // Up
    if (node.value.y >= 1 && fields.includes(up)) {
        children.push({
            value: { x: node.value.x, y: node.value.y - 1 },
            actions: node.actions + ACTIONS.UP,
            level: node.level + 1,
            costs: node.costs + costs[1],
            powerUp: undefined,
        });
    }
    // Right
    if (node.value.x < world[0].length - 1 && fields.includes(right)) {
        children.push({
            value: { x: node.value.x + 1, y: node.value.y },
            actions: node.actions + ACTIONS.RIGHT,
            level: node.level + 1,
            costs: node.costs + costs[2],
            powerUp: undefined,
        });
    }
    // Down
    if (node.value.y < world.length - 1 && fields.includes(down)) {
        children.push({
            value: { x: node.value.x, y: node.value.y + 1 },
            actions: node.actions + ACTIONS.DOWN,
            level: node.level + 1,
            costs: node.costs + costs[3],
            powerUp: undefined,
        });
    }
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
    return Math.floor((node.value.y * 100 + node.value.x * 3) / 5);
};
exports.hashIndex = hashIndex;
const myCoordinates = (world, searchTo) => {
    for (let i = 0; i < world.length - 1; i++) {
        for (let j = 0; j < world[0].length - 1; j++) {
            if (world[i][j] == searchTo) {
                return {
                    x: i,
                    y: j,
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