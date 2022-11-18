"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstarMethod = exports.greedyMethod = exports.dfsMethod = exports.ucsMethod = exports.bfsMethod = void 0;
const helper_1 = require("../helpers/helper");
const bfsMethod = (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = (0, helper_1.readWorld)(file);
        const location = (0, helper_1.myCoordinates)(world, 2);
        const goal = (0, helper_1.myCoordinates)(world, 6);
        const expandedNodes = [];
        let hashTable = {};
        let root = {
            actions: "",
            coordinates: location,
            cost: 0,
            level: 0,
            status: (0, helper_1.copyWorld)(world),
            type: helper_1.CELL_TYPE.INITIAL,
            powerUp: {
                type: helper_1.CELL_TYPE.FREE,
                remainingUses: 0
            }
        };
        let queue = [];
        queue.push(root);
        var start = Date.now();
        while (true) {
            if (queue.length == 0) {
                return helper_1.errorTicher;
            }
            else {
                let node = (0, helper_1.removeFromQueue)(queue);
                expandedNodes.push(node);
                if ((0, helper_1.isSolution)(node, goal)) {
                    var end = Date.now();
                    return res.status(200).json({
                        path: node.actions,
                        depth: node.level,
                        expandedNodes: expandedNodes.length,
                        executionTime: end - start
                    });
                }
                else {
                    let children = (0, helper_1.getChildren)(node);
                    if (req.body.avoidCicle) {
                        children = children.filter(node => {
                            let key = (0, helper_1.hashIndex)(node);
                            //@ts-ignore
                            if (!hashTable[key]) {
                                //@ts-ignore
                                hashTable[key] = 1;
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                    }
                    queue.push(...children);
                }
            }
        }
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.bfsMethod = bfsMethod;
const ucsMethod = (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = (0, helper_1.readWorld)(file);
        const location = (0, helper_1.myCoordinates)(world, 2);
        const goal = (0, helper_1.myCoordinates)(world, 6);
        const expandedNodes = [];
        let hashTable = {};
        let root = {
            actions: "",
            coordinates: location,
            cost: 0,
            level: 0,
            status: (0, helper_1.copyWorld)(world),
            type: helper_1.CELL_TYPE.INITIAL,
            powerUp: {
                type: helper_1.CELL_TYPE.FREE,
                remainingUses: 0
            }
        };
        let queue = [];
        queue.push(root);
        var start = Date.now();
        while (true) {
            if (queue.length == 0) {
                return helper_1.errorTicher;
            }
            else {
                let node = (0, helper_1.removeFromQueue)(queue);
                expandedNodes.push(node);
                if ((0, helper_1.isSolution)(node, goal)) {
                    var end = Date.now();
                    return res.status(200).json({
                        path: node.actions,
                        depth: node.level,
                        expandedNodes: expandedNodes.length,
                        executionTime: end - start
                    });
                }
                else {
                    let children = (0, helper_1.getChildren)(node);
                    if (req.body.avoidCicle) {
                        children = children.filter((node) => {
                            let key = (0, helper_1.hashIndex)(node);
                            //@ts-ignore
                            if (!hashTable[key]) {
                                //@ts-ignore
                                hashTable[key] = 1;
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                    }
                    (0, helper_1.pushOrderByCost)(children, queue);
                }
            }
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.ucsMethod = ucsMethod;
const dfsMethod = (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = (0, helper_1.readWorld)(file);
        const location = (0, helper_1.myCoordinates)(world, 2);
        const goal = (0, helper_1.myCoordinates)(world, 6);
        const expandedNodes = [];
        let hashTable = {};
        let root = {
            actions: "",
            coordinates: location,
            cost: 0,
            level: 0,
            status: (0, helper_1.copyWorld)(world),
            type: helper_1.CELL_TYPE.INITIAL,
            powerUp: {
                type: helper_1.CELL_TYPE.FREE,
                remainingUses: 0
            }
        };
        let stack = [];
        stack.push(root);
        var start = Date.now();
        while (true) {
            if (stack.length == 0) {
                return helper_1.errorTicher;
            }
            else {
                let node = (0, helper_1.removeFromStack)(stack);
                expandedNodes.push(node);
                if ((0, helper_1.isSolution)(node, goal)) {
                    var end = Date.now();
                    return res.status(200).json({
                        path: node.actions,
                        depth: node.level,
                        expandedNodes: expandedNodes.length,
                        executionTime: end - start
                    });
                }
                else {
                    let children = (0, helper_1.getChildren)(node);
                    children = children.filter(node => {
                        let key = (0, helper_1.hashIndex)(node);
                        //@ts-ignore
                        if (!hashTable[key]) {
                            //@ts-ignore
                            hashTable[key] = 1;
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    stack.push(...children);
                }
            }
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.dfsMethod = dfsMethod;
const greedyMethod = (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = (0, helper_1.readWorld)(file);
        const location = (0, helper_1.myCoordinates)(world, 2);
        const goal = (0, helper_1.myCoordinates)(world, 6);
        const expandedNodes = [];
        let hashTable = {};
        let root = {
            actions: "",
            coordinates: location,
            cost: 0,
            level: 0,
            status: (0, helper_1.copyWorld)(world),
            type: helper_1.CELL_TYPE.INITIAL,
            powerUp: {
                type: helper_1.CELL_TYPE.FREE,
                remainingUses: 0
            },
            heuristic: 0
        };
        let queue = [];
        queue.push(root);
        var start = Date.now();
        while (true) {
            if (queue.length == 0) {
                return helper_1.errorTicher;
            }
            else {
                let node = (0, helper_1.removeFromQueue)(queue);
                expandedNodes.push(node);
                if ((0, helper_1.isSolution)(node, goal)) {
                    var end = Date.now();
                    return res.status(200).json({
                        path: node.actions,
                        depth: node.level,
                        expandedNodes: expandedNodes.length,
                        executionTime: end - start
                    });
                }
                else {
                    let children = (0, helper_1.getChildren)(node, true, goal);
                    children = children.filter((node) => {
                        let key = (0, helper_1.hashIndex)(node);
                        //@ts-ignore
                        if (!hashTable[key]) {
                            //@ts-ignore
                            hashTable[key] = 1;
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    (0, helper_1.pushOrderByHeuristic)(children, queue);
                }
            }
        }
    }
    catch (error) {
        res.status(400).json(helper_1.excError);
    }
};
exports.greedyMethod = greedyMethod;
const AstarMethod = (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = (0, helper_1.readWorld)(file);
        const location = (0, helper_1.myCoordinates)(world, 2);
        const goal = (0, helper_1.myCoordinates)(world, 6);
        const expandedNodes = [];
        let hashTable = {};
        let root = {
            actions: "",
            coordinates: location,
            cost: 0,
            level: 0,
            status: (0, helper_1.copyWorld)(world),
            type: helper_1.CELL_TYPE.INITIAL,
            powerUp: {
                type: helper_1.CELL_TYPE.FREE,
                remainingUses: 0
            },
            heuristic: 0
        };
        let queue = [];
        queue.push(root);
        var start = Date.now();
        while (true) {
            if (queue.length == 0) {
                return helper_1.errorTicher;
            }
            else {
                let node = (0, helper_1.removeFromQueue)(queue);
                expandedNodes.push(node);
                if ((0, helper_1.isSolution)(node, goal)) {
                    var end = Date.now();
                    return res.status(200).json({
                        path: node.actions,
                        depth: node.level,
                        expandedNodes: expandedNodes.length,
                        executionTime: end - start
                    });
                }
                else {
                    let children = (0, helper_1.getChildren)(node, true, goal);
                    children = children.filter((node) => {
                        let key = (0, helper_1.hashIndex)(node);
                        //@ts-ignore
                        if (!hashTable[key]) {
                            //@ts-ignore
                            hashTable[key] = 1;
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    (0, helper_1.pushOrderByCostHeuristic)(children, queue);
                }
            }
        }
    }
    catch (error) {
        res.status(400).json(helper_1.excError);
    }
};
exports.AstarMethod = AstarMethod;
//# sourceMappingURL=algorithms.js.map