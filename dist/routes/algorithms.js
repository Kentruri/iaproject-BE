"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const algorithms_1 = require("../controllers/algorithms");
const express_1 = require("express");
const parseFile_1 = tslib_1.__importDefault(require("../middlewares/parseFile"));
const router = (0, express_1.Router)();
router.post("/informed/bfs", parseFile_1.default, algorithms_1.bfsMethod);
router.post("/informed/ucs", parseFile_1.default, algorithms_1.ucsMethod);
router.post("/informed/dfs", parseFile_1.default, algorithms_1.dfsMethod);
router.post("/uninformed/Astar", parseFile_1.default, algorithms_1.AstarMethod);
router.post("/uninformed/greedy", parseFile_1.default, algorithms_1.greedyMethod);
exports.default = router;
//# sourceMappingURL=algorithms.js.map