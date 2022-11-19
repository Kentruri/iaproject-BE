"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstarMethod = exports.greedyMethod = exports.dfsMethod = exports.ucsMethod = exports.bfsMethod = void 0;
const perf_hooks_1 = require("perf_hooks");
const helper_1 = require("../helpers/helper");
const bfsMethod = (req, res) => {
    const root = req.rootNode;
    const goal = req.goal;
    const queue = [root];
    const expandedNodes = [];
    var start = perf_hooks_1.performance.now();
    while (queue.length > 0) {
        const node = (0, helper_1.removeFromQueue)(queue);
        expandedNodes.push(node);
        if ((0, helper_1.isSolution)(node, goal)) {
            var end = perf_hooks_1.performance.now();
            return res.status(200).json({
                path: node.actions,
                depth: node.level,
                expandedNodes: expandedNodes.length,
                executionTime: end - start
            });
        }
        else {
            let children = (0, helper_1.getChildren)(node);
            if (req.body.avoidCicle)
                children = (0, helper_1.filterNoExploredNodes)(node, children);
            queue.push(...children);
        }
    }
};
exports.bfsMethod = bfsMethod;
const ucsMethod = (req, res) => {
    const root = req.rootNode;
    const goal = req.goal;
    const queue = [root];
    const expandedNodes = [];
    var start = perf_hooks_1.performance.now();
    while (queue.length > 0) {
        const node = (0, helper_1.removeFromQueue)(queue);
        expandedNodes.push(node);
        if ((0, helper_1.isSolution)(node, goal)) {
            var end = perf_hooks_1.performance.now();
            return res.status(200).json({
                path: node.actions,
                depth: node.level,
                expandedNodes: expandedNodes.length,
                executionTime: end - start
            });
        }
        else {
            let children = (0, helper_1.getChildren)(node);
            if (req.body.avoidCicle)
                children = (0, helper_1.filterNoExploredNodes)(node, children);
            (0, helper_1.pushOrderByCost)(children, queue);
        }
    }
};
exports.ucsMethod = ucsMethod;
const dfsMethod = (req, res) => {
    const root = req.rootNode;
    const goal = req.goal;
    const stack = [root];
    const expandedNodes = [];
    var start = perf_hooks_1.performance.now();
    while (stack.length > 0) {
        const node = (0, helper_1.removeFromStack)(stack);
        expandedNodes.push(node);
        if ((0, helper_1.isSolution)(node, goal)) {
            var end = perf_hooks_1.performance.now();
            return res.status(200).json({
                path: node.actions,
                depth: node.level,
                expandedNodes: expandedNodes.length,
                executionTime: end - start
            });
        }
        else {
            let children = (0, helper_1.getChildren)(node);
            children = (0, helper_1.filterNoExploredNodes)(node, children);
            stack.push(...children);
        }
    }
};
exports.dfsMethod = dfsMethod;
const greedyMethod = (req, res) => {
    const root = req.rootNode;
    const goal = req.goal;
    const queue = [root];
    const expandedNodes = [];
    var start = perf_hooks_1.performance.now();
    while (queue.length > 0) {
        let node = (0, helper_1.removeFromQueue)(queue);
        expandedNodes.push(node);
        if ((0, helper_1.isSolution)(node, goal)) {
            var end = perf_hooks_1.performance.now();
            return res.status(200).json({
                path: node.actions,
                depth: node.level,
                expandedNodes: expandedNodes.length,
                executionTime: end - start
            });
        }
        else {
            let children = (0, helper_1.getChildren)(node, true, goal);
            if (req.body.avoidCicle)
                children = (0, helper_1.filterNoExploredNodes)(node, children);
            (0, helper_1.pushOrderByHeuristic)(children, queue);
        }
    }
};
exports.greedyMethod = greedyMethod;
const AstarMethod = (req, res) => {
    const root = req.rootNode;
    const goal = req.goal;
    const queue = [root];
    const expandedNodes = [];
    var start = perf_hooks_1.performance.now();
    while (queue.length > 0) {
        let node = (0, helper_1.removeFromQueue)(queue);
        expandedNodes.push(node);
        if ((0, helper_1.isSolution)(node, goal)) {
            var end = perf_hooks_1.performance.now();
            return res.status(200).json({
                path: node.actions,
                depth: node.level,
                expandedNodes: expandedNodes.length,
                executionTime: end - start
            });
        }
        else {
            let children = (0, helper_1.getChildren)(node, true, goal);
            if (req.body.avoidCicle)
                children = (0, helper_1.filterNoExploredNodes)(node, children);
            (0, helper_1.pushOrderByCostHeuristic)(children, queue);
        }
    }
};
exports.AstarMethod = AstarMethod;
//# sourceMappingURL=algorithms.js.map