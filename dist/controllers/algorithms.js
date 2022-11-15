"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.greedyMethod = exports.AstarMethod = exports.ucsMethod = exports.dfsMethod = exports.bfsMethod = void 0;
const helper_1 = require("../helpers/helper");
const bfsMethod = (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = (0, helper_1.readWorld)(file);
        const location = (0, helper_1.myCoordinates)(world, 2) || { x: 0, y: 0 };
        const objetive = (0, helper_1.myCoordinates)(world, 6);
        let root = {
            value: location,
            actions: "",
            level: 0,
            costs: 0,
            powerUp: {
                type: helper_1.POWERUPTYPE.EMPTY,
                remainingUses: 0,
            },
        };
        let hashTable = {};
        let queue = [];
        queue.push(root);
        while (true) {
            if (queue.length == 0) {
                return helper_1.error;
            }
            else {
                let node = (0, helper_1.removeFromQueue)(queue);
                if ((0, helper_1.isSolution)(node, objetive)) {
                    return res.status(200).json({
                        path: node === null || node === void 0 ? void 0 : node.actions,
                        depth: node === null || node === void 0 ? void 0 : node.level,
                        cost: node === null || node === void 0 ? void 0 : node.costs,
                    });
                }
                else {
                    let children = (0, helper_1.getChildren)(node, world, hashTable);
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
                    (0, helper_1.addToQueue)(queue, children);
                }
            }
        }
    }
    catch (e) {
        res.status(400).json({ message: e.message });
    }
};
exports.bfsMethod = bfsMethod;
const dfsMethod = (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = (0, helper_1.readWorld)(file);
        const location = (0, helper_1.myCoordinates)(world, 2) || { x: 0, y: 0 };
        const objetive = (0, helper_1.myCoordinates)(world, 6);
        let stock = [];
        let hashTable = {};
        let root = {
            value: location,
            actions: "",
            level: 0,
            costs: 0,
            powerUp: {
                type: helper_1.POWERUPTYPE.EMPTY,
                remainingUses: 0,
            },
        };
        stock.push(root);
        while (true) {
            if (stock.length == 0) {
                return helper_1.error;
            }
            else {
                let node = (0, helper_1.removeFromStock)(stock);
                if ((0, helper_1.isSolution)(node, objetive)) {
                    return res.status(200).json({
                        path: node === null || node === void 0 ? void 0 : node.actions,
                        depth: node === null || node === void 0 ? void 0 : node.level,
                        cost: node === null || node === void 0 ? void 0 : node.costs,
                    });
                }
                else {
                    let children = (0, helper_1.getChildren)(node, world);
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
                    (0, helper_1.addToStock)(stock, children);
                }
            }
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.dfsMethod = dfsMethod;
const ucsMethod = (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = (0, helper_1.readWorld)(file);
        const location = (0, helper_1.myCoordinates)(world, 2) || { x: 0, y: 0 };
        const objetive = (0, helper_1.myCoordinates)(world, 6);
        let hashTable = {};
        let list = [];
        let root = {
            value: location,
            actions: "",
            level: 0,
            costs: 0,
            powerUp: {
                type: helper_1.POWERUPTYPE.EMPTY,
                remainingUses: 0,
            },
        };
        list.push(root);
        while (true) {
            if (list.length == 0) {
                return helper_1.error;
            }
            else {
                if (list.length > 1) {
                    list = (0, helper_1.sortCosts)(list);
                }
                let node = list.shift();
                if ((0, helper_1.isSolution)(node, objetive)) {
                    return res.status(200).json({
                        path: node === null || node === void 0 ? void 0 : node.actions,
                        depth: node === null || node === void 0 ? void 0 : node.level,
                        cost: node === null || node === void 0 ? void 0 : node.costs,
                    });
                }
                else {
                    let children = (0, helper_1.getChildren)(node, world);
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
                    (0, helper_1.addToList)(list, children);
                }
            }
        }
    }
    catch (error) {
        res.status(400).json(helper_1.excError);
    }
};
exports.ucsMethod = ucsMethod;
const AstarMethod = (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = (0, helper_1.readWorld)(file);
    }
    catch (error) {
        res.status(400).json(helper_1.excError);
    }
};
exports.AstarMethod = AstarMethod;
const greedyMethod = (req, res) => {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = (0, helper_1.readWorld)(file);
    }
    catch (error) {
        res.status(400).json(helper_1.excError);
    }
};
exports.greedyMethod = greedyMethod;
// getMovement(
//   {
//     value: { x: 5, y: 4 },
//     actions: "L",
//     level: 4,
//     costs: 1,
//     powerUp: {
//       type: POWERUPTYPE.EMPTY,
//       remainingUses: 1,
//     },
//   },
//   5
// )
//# sourceMappingURL=algorithms.js.map