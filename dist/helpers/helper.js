"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromStack = exports.removeFromQueue = exports.hashIndex = exports.excError = exports.errorTicher = exports.findIndexCostHeu = exports.pushOrderByCostHeuristic = exports.findIndexHeu = exports.pushOrderByHeuristic = exports.findIndexCost = exports.pushOrderByCost = exports.heuristics = exports.checkCell = exports.getMovement = exports.getChildren = exports.isSolution = exports.copyWorld = exports.myCoordinates = exports.readWorld = exports.POWERUP_TYPE = exports.CELL_TYPE = void 0;
var CELL_TYPE;
(function (CELL_TYPE) {
    CELL_TYPE[CELL_TYPE["FREE"] = 0] = "FREE";
    CELL_TYPE[CELL_TYPE["WALL"] = 1] = "WALL";
    CELL_TYPE[CELL_TYPE["INITIAL"] = 2] = "INITIAL";
    CELL_TYPE[CELL_TYPE["STAR"] = 3] = "STAR";
    CELL_TYPE[CELL_TYPE["FLOWER"] = 4] = "FLOWER";
    CELL_TYPE[CELL_TYPE["KOOPA"] = 5] = "KOOPA";
    CELL_TYPE[CELL_TYPE["PRINCESS"] = 6] = "PRINCESS";
})(CELL_TYPE = exports.CELL_TYPE || (exports.CELL_TYPE = {}));
var POWERUP_TYPE;
(function (POWERUP_TYPE) {
    POWERUP_TYPE["STAR"] = "STAR";
    POWERUP_TYPE["FLOWER"] = "FLOWER";
    POWERUP_TYPE["EMPTY"] = "EMPTY";
})(POWERUP_TYPE = exports.POWERUP_TYPE || (exports.POWERUP_TYPE = {}));
/**
 * Convierte un archivo en una matriz para el laberinto del problema.
 * @param file Archivo que recibe el servicio desde el front
 * @returns Matriz que corresponde al laberinto del problema
 */
function readWorld(file) {
    const Buffer = file.data.toString("utf8");
    const columns = Buffer.split("\r\n");
    const world = [];
    columns.forEach(column => {
        let columnToNum = column.split(" ").map(Number);
        world.push(columnToNum);
    });
    return world;
}
exports.readWorld = readWorld;
;
/**
/**
 * Encuentra la posición (x,y) en el laberinto para un número dado.
 * @param world Laberinto
 * @param searchTo Número a buscar
 * @returns Interfaz con los valores
 */
const myCoordinates = (world, searchTo) => {
    let coordinates = { x: 0, y: 0 };
    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[0].length; j++) {
            if (world[i][j] == searchTo) {
                coordinates = { x: j, y: i, };
            }
        }
    }
    return coordinates;
};
exports.myCoordinates = myCoordinates;
/**
 * Hace una copia profunda del laberinto para llevar el estado en cada nodo
 * @param world Laberinto
 * @returns Copia exacta del laberinto pero en diferente posición de memoria
 */
function copyWorld(world) {
    const worldString = JSON.stringify(world);
    return JSON.parse(worldString);
}
exports.copyWorld = copyWorld;
;
/**
 * Verifica si Mario ya llegó donde la princesa
 * @param node Posición actual de Mario
 * @param solution Posición de la princesa
 * @returns True si están en la misma posición, False si no
 */
const isSolution = (node, solution) => {
    return node.coordinates.x == solution.x && node.coordinates.y == solution.y;
};
exports.isSolution = isSolution;
/**
 * Obtiene los hijos de un nodo
 * @param node Nodo padre
 * @param informed Indica si la búsqueda es informada o no
 * @param goal Meta
 * @returns Nodos hijo
 */
function getChildren(node, informed = false, goal = { x: 0, y: 0 }) {
    // Lista de hijos
    let children = [];
    // Obtención de los posibles movimientos
    const left = node.coordinates.x - 1 >= 0 ? node.status[node.coordinates.y][node.coordinates.x - 1] : -1;
    const up = node.coordinates.y - 1 >= 0 ? node.status[node.coordinates.y - 1][node.coordinates.x] : -1;
    const right = node.coordinates.x + 1 <= node.status[0].length ? node.status[node.coordinates.y][node.coordinates.x + 1] : -1;
    const down = node.coordinates.y + 1 <= node.status.length ? node.status[node.coordinates.y + 1][node.coordinates.x] : -1;
    // Verificación y ejecución de cada movimiento
    if (fields.includes(up)) {
        const childNode = getMovement(node, up);
        childNode.coordinates = { x: node.coordinates.x, y: node.coordinates.y - 1 },
            childNode.actions = node.actions + ACTIONS.UP,
            childNode.heuristic = informed ? heuristics(childNode.coordinates, goal) : undefined,
            children.push(childNode);
    }
    if (fields.includes(down)) {
        const childNode = getMovement(node, down);
        childNode.coordinates = { x: node.coordinates.x, y: node.coordinates.y + 1 },
            childNode.actions = node.actions + ACTIONS.DOWN,
            childNode.heuristic = informed ? heuristics(childNode.coordinates, goal) : undefined,
            children.push(childNode);
    }
    if (fields.includes(left)) {
        const childNode = getMovement(node, left);
        childNode.coordinates = { x: node.coordinates.x - 1, y: node.coordinates.y };
        childNode.actions = node.actions + ACTIONS.LEFT;
        childNode.heuristic = informed ? heuristics(childNode.coordinates, goal) : undefined;
        children.push(childNode);
    }
    if (fields.includes(right)) {
        const childNode = getMovement(node, right);
        childNode.coordinates = { x: node.coordinates.x + 1, y: node.coordinates.y },
            childNode.actions = node.actions + ACTIONS.RIGHT,
            childNode.heuristic = informed ? heuristics(childNode.coordinates, goal) : undefined,
            children.push(childNode);
    }
    return children;
}
exports.getChildren = getChildren;
;
/**
 * Ejecución de un movimiento en específico
 * @param node Nodo actual
 * @param field Movimiento
 * @returns Nodo resultante del movimiento
 */
function getMovement(node, field) {
    const costs = [1, 0.5, 6];
    let childNode = Object.assign({}, node);
    childNode.level++;
    switch (field) {
        case CELL_TYPE.STAR:
            //tengo estrella, y llego a otra
            if (node.powerUp.type == CELL_TYPE.STAR) {
                childNode.cost = node.cost + costs[1];
                childNode.powerUp = {
                    type: CELL_TYPE.STAR,
                    remainingUses: node.powerUp.remainingUses + 6 - 1
                };
            }
            //no tengo nada
            if (node.powerUp.type == CELL_TYPE.FREE) {
                childNode.cost = node.cost + costs[0];
                childNode.powerUp = {
                    type: CELL_TYPE.STAR,
                    remainingUses: node.powerUp.remainingUses + 6
                };
            }
            //tengo flor, y caigo en una estrella, no pasa nada
            if (node.powerUp.type == CELL_TYPE.FLOWER) {
                childNode.cost = node.cost + costs[0];
                childNode.powerUp = {
                    type: CELL_TYPE.FLOWER,
                    remainingUses: node.powerUp.remainingUses,
                };
            }
            checkCell(childNode);
            childNode.type = CELL_TYPE.STAR;
            break;
        case CELL_TYPE.FLOWER:
            //tengo flor, y llego a otra
            if (node.powerUp.type == CELL_TYPE.FLOWER) {
                childNode.cost = node.cost + costs[0];
                childNode.powerUp = {
                    type: CELL_TYPE.FLOWER,
                    remainingUses: node.powerUp.remainingUses + 1,
                };
            }
            //no tengo nada
            if (node.powerUp.type == CELL_TYPE.FREE) {
                childNode.cost = node.cost + costs[0];
                childNode.powerUp = {
                    type: CELL_TYPE.FLOWER,
                    remainingUses: 1,
                };
            }
            //tengo estrella, y caigo en una flor, no pasa nada, a menos que sea ultimo tiro
            if (node.powerUp.type == CELL_TYPE.STAR) {
                childNode.cost = node.cost + costs[1];
                childNode.powerUp = {
                    type: node.powerUp.remainingUses - 1 > 0
                        ? CELL_TYPE.STAR
                        : CELL_TYPE.FLOWER,
                    remainingUses: node.powerUp.remainingUses - 1 > 0
                        ? node.powerUp.remainingUses - 1
                        : 1,
                };
            }
            checkCell(childNode);
            childNode.type = CELL_TYPE.FLOWER;
            break;
        case CELL_TYPE.KOOPA:
            //tengo flor
            if (node.powerUp.type == CELL_TYPE.FLOWER) {
                childNode.cost = node.cost + costs[0];
                childNode.powerUp = {
                    type: node.powerUp.remainingUses - 1 > 0
                        ? CELL_TYPE.FLOWER
                        : CELL_TYPE.FREE,
                    remainingUses: node.powerUp.remainingUses - 1,
                };
            }
            //no tengo nada
            if (node.powerUp.type == CELL_TYPE.FREE) {
                childNode.cost = node.cost + costs[2];
            }
            ///tengo estrella
            if (node.powerUp.type == CELL_TYPE.STAR) {
                childNode.cost = node.cost + costs[1];
                childNode.powerUp = {
                    type: node.powerUp.remainingUses - 1 > 0
                        ? CELL_TYPE.STAR
                        : CELL_TYPE.FREE,
                    remainingUses: node.powerUp.remainingUses - 1,
                };
            }
            checkCell(childNode);
            childNode.type = CELL_TYPE.KOOPA;
            break;
        default:
            if (node.powerUp.type == CELL_TYPE.STAR) {
                childNode.cost = node.cost + costs[1];
                childNode.powerUp = {
                    type: node.powerUp.remainingUses - 1 > 0
                        ? CELL_TYPE.STAR
                        : CELL_TYPE.FREE,
                    remainingUses: node.powerUp.remainingUses - 1,
                };
            }
            else {
                childNode.cost = node.cost + costs[0];
            }
            checkCell(childNode);
            childNode.type = field == 0 ? CELL_TYPE.FREE : CELL_TYPE.PRINCESS;
            break;
    }
    return childNode;
}
exports.getMovement = getMovement;
;
/**
 * Verifica si la casilla tenía algún poder y en caso de haberlo tomado, deja la casilla en 0
 * Verifica también si había un koopa en la casilla y en caso de tener una flor, lo elimina
 * @param node Nodo para hacer la verificación
 */
function checkCell(node) {
    if ((node.type == CELL_TYPE.INITIAL) ||
        (node.type == CELL_TYPE.FLOWER && node.powerUp.type == node.type) ||
        (node.type == CELL_TYPE.STAR && node.powerUp.type == node.type) ||
        (node.type == CELL_TYPE.FLOWER && node.powerUp.type == CELL_TYPE.FREE) ||
        (node.type == CELL_TYPE.STAR && node.powerUp.type == CELL_TYPE.FREE) ||
        (node.type == CELL_TYPE.KOOPA && node.powerUp.type == CELL_TYPE.FLOWER && node.powerUp.remainingUses > 0)) {
        node.status[node.coordinates.y][node.coordinates.x] = 0;
    }
}
exports.checkCell = checkCell;
;
/**
 * Calcula la heurtística para llegar de un nodo a otro
 * @param node Punto de salid
 * @param objective Punto de llegada
 * @returns Valor de la heurística
 */
function heuristics(node, objective) {
    const diference = {
        x: Math.abs(objective.x - node.x),
        y: Math.abs(objective.y - node.y),
    };
    return Math.sqrt(Math.pow(diference.x, 2) + Math.pow(diference.y, 2)) / 2;
}
exports.heuristics = heuristics;
;
/**
 * Inserta un nuevo nodo en una fila que esté ordeanada por costo manteniendo ese mismo orden
 * @param children Lista de nodos para insertar
 * @param queue Fila que debería estar ya ordenada
 */
function pushOrderByCost(children, queue) {
    children.forEach(node => {
        let index = findIndexCost(queue, node);
        queue.splice(index, 0, node);
    });
}
exports.pushOrderByCost = pushOrderByCost;
/**
 * Encuentra la posición en la que debe agregarse un objeto dentro de un arreglo ordenado por costo y que no dañe el orden
 * @param queue Lista ordeanda
 * @param node Nodo a insertar
 * @param realIndex Al estar particionando la cola, con este parámetro se persiste el índice realmente necesario
 * @returns Ubicación que debe tener el nodo
 */
function findIndexCost(queue, node, realIndex = 0) {
    let index = Math.round(queue.length / 2);
    if (!queue.length || queue[0].cost >= node.cost) {
        return realIndex;
    }
    else if (queue[queue.length - 1].cost <= node.cost) {
        return queue.length + realIndex;
    }
    else if (queue[index].cost == node.cost) {
        return index + realIndex;
    }
    else if (queue[index].cost > node.cost) {
        return findIndexCost(queue.slice(0, index), node, realIndex);
    }
    else {
        realIndex += index;
        return findIndexCost(queue.slice(index, queue.length), node, realIndex);
    }
}
exports.findIndexCost = findIndexCost;
/**
 * Inserta un nuevo nodo en una fila que esté ordeanada por heurística manteniendo ese mismo orden
 * @param children Lista de nodos para insertar
 * @param queue Fila que debería estar ya ordenada
 */
function pushOrderByHeuristic(children, queue) {
    children.forEach(node => {
        let index = findIndexHeu(queue, node);
        queue.splice(index, 0, node);
    });
}
exports.pushOrderByHeuristic = pushOrderByHeuristic;
/**
 * Encuentra la posición en la que debe agregarse un objeto dentro de un arreglo ordenado por heurística y que no dañe el orden
 * @param queue Lista ordeanda
 * @param node Nodo a insertar
 * @param realIndex Al estar particionando la cola, con este parámetro se persiste el índice realmente necesario
 * @returns Ubicación que debe tener el nodo
 */
function findIndexHeu(queue, node, realIndex = 0) {
    let index = Math.round(queue.length / 2);
    if (!queue.length || queue[0].heuristic >= node.heuristic) {
        return realIndex;
    }
    else if (queue[queue.length - 1].heuristic <= node.heuristic) {
        return queue.length + realIndex;
    }
    else if (queue[index].heuristic == node.heuristic) {
        return index + realIndex;
    }
    else if (queue[index].heuristic > node.heuristic) {
        return findIndexHeu(queue.slice(0, index), node, realIndex);
    }
    else {
        realIndex += index;
        return findIndexHeu(queue.slice(index, queue.length), node, realIndex);
    }
}
exports.findIndexHeu = findIndexHeu;
/**
 * Inserta un nuevo nodo en una fila que esté ordeanada por costo & heurística manteniendo ese mismo orden
 * @param children Lista de nodos para insertar
 * @param queue Fila que debería estar ya ordenada
 */
function pushOrderByCostHeuristic(children, queue) {
    children.forEach(node => {
        let index = findIndexCostHeu(queue, node);
        queue.splice(index, 0, node);
    });
}
exports.pushOrderByCostHeuristic = pushOrderByCostHeuristic;
/**
 * Encuentra la posición en la que debe agregarse un objeto dentro de un arreglo ordenado por costo & heurística y que no dañe el orden
 * @param queue Lista ordeanda
 * @param node Nodo a insertar
 * @param realIndex Al estar particionando la cola, con este parámetro se persiste el índice realmente necesario
 * @returns Ubicación que debe tener el nodo
 */
function findIndexCostHeu(queue, node, realIndex = 0) {
    let index = Math.round(queue.length / 2);
    if (!queue.length || queue[0].cost + queue[0].heuristic >= node.cost + node.heuristic) {
        return realIndex;
    }
    else if (queue[queue.length - 1].cost + queue[queue.length - 1].heuristic <= node.cost + node.heuristic) {
        return queue.length + realIndex;
    }
    else if (queue[index].cost + queue[index].heuristic == node.cost + node.heuristic) {
        return index + realIndex;
    }
    else if (queue[index].cost + queue[index].heuristic > node.cost + node.heuristic) {
        return findIndexCostHeu(queue.slice(0, index), node, realIndex);
    }
    else {
        realIndex += index;
        return findIndexCostHeu(queue.slice(index, queue.length), node, realIndex);
    }
}
exports.findIndexCostHeu = findIndexCostHeu;
//typos
var ACTIONS;
(function (ACTIONS) {
    ACTIONS["LEFT"] = "L";
    ACTIONS["UP"] = "U";
    ACTIONS["RIGHT"] = "R";
    ACTIONS["DOWN"] = "D";
})(ACTIONS || (ACTIONS = {}));
//CONSTANTS
const fields = [0, 2, 3, 4, 5, 6];
exports.errorTicher = "profe no hay solucion :'v";
exports.excError = { message: "?? mande eso bien profe :'v" };
//Methods
const hashIndex = (node) => {
    return node.coordinates.y * 10 + node.coordinates.x + 10;
};
exports.hashIndex = hashIndex;
//Data structures, here I put the methods from queue's,heaps,etc
/**
 * Devuelve el nodo que será expandido a la vez de que lo quita de la cola
 * @param queue Nodos en espera
 * @returns Nodo que será procesado
 */
function removeFromQueue(queue) {
    const nodeSacado = queue.shift();
    if (nodeSacado !== undefined)
        return nodeSacado;
    throw exports.errorTicher;
}
exports.removeFromQueue = removeFromQueue;
;
/**
 * Devuelve el nodo que será expandido a la vez de que lo quita de la pila
 * @param queue Nodos en espera
 * @returns Nodo que será procesado
 */
const removeFromStack = (stock) => {
    const nodeSacado = stock.pop();
    if (nodeSacado !== undefined)
        return nodeSacado;
    throw exports.errorTicher;
};
exports.removeFromStack = removeFromStack;
//# sourceMappingURL=helper.js.map