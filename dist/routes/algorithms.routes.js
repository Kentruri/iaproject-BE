"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithms_1 = require("controllers/algorithms");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/informed/bfs", algorithms_1.bfsMethod);
router.post("/informed/ccs", algorithms_1.ccsMethod);
router.post("/informed/dfs", algorithms_1.dfsMethod);
router.post("/uninformed/Astar", algorithms_1.AstarMethod);
router.post("/uninformed/greedy", algorithms_1.greedyMethod);
router.get("/", (req, res) => { });
exports.default = router;
//# sourceMappingURL=algorithms.routes.js.map