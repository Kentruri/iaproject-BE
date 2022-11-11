import {
  AstarMethod,
  bfsMethod,
  ucsMethod,
  dfsMethod,
  greedyMethod,
} from "../controllers/algorithms";
import { Router } from "express";

const router = Router();

router.post("/informed/bfs", bfsMethod);
router.post("/informed/ucs", ucsMethod);
router.post("/informed/dfs", dfsMethod);
router.post("/uninformed/Astar", AstarMethod);
router.post("/uninformed/greedy", greedyMethod);

export default router;
