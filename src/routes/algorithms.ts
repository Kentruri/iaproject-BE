import {
  AstarMethod,
  bfsMethod,
  ucsMethod,
  dfsMethod,
  greedyMethod,
} from "../controllers/algorithms";
import { Router } from "express";
import parseFile from "../middlewares/parseFile";

const router = Router();

router.post("/informed/bfs", parseFile, bfsMethod);
router.post("/informed/ucs", parseFile, ucsMethod);
router.post("/informed/dfs", parseFile, dfsMethod);
router.post("/uninformed/Astar", parseFile, AstarMethod);
router.post("/uninformed/greedy", parseFile, greedyMethod);

export default router;
