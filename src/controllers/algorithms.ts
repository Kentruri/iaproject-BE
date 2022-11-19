import { Coordinates } from './../interfaces/Coordinates';
import { Request, Response } from "express";
import { TreeNode } from "interfaces/TreeNode";
import { performance } from 'perf_hooks';
import {
  getChildren,
  isSolution,
  pushOrderByCost,
  removeFromQueue,
  removeFromStack,
  pushOrderByHeuristic,
  pushOrderByCostHeuristic,
  filterNoExploredNodes,
} from "../helpers/helper";

export const bfsMethod = (req: Request, res: Response) => {
  const root: TreeNode = req.rootNode!;
  const goal: Coordinates = req.goal!;
  const queue: TreeNode[] = [root];
  const expandedNodes: TreeNode[] = [];
  var start = performance.now();

  while (queue.length > 0) {
    const node: TreeNode = removeFromQueue(queue);
    expandedNodes.push(node);
    if (isSolution(node, goal)) {
      var end = performance.now();
      return res.status(200).json({
        path: node.actions,
        depth: node.level,
        expandedNodes: expandedNodes.length,
        executionTime: end - start
      });
    } else {
      let children: TreeNode[] = getChildren(node!);
      if (req.body.avoidCicle) children = filterNoExploredNodes(node, children);
      queue.push(...children);
    }
  }
}

export const ucsMethod = (req: Request, res: Response) => {
  const root: TreeNode = req.rootNode!;
  const goal: Coordinates = req.goal!;
  const queue: TreeNode[] = [root];
  const expandedNodes: TreeNode[] = [];
  var start = performance.now();

  while (queue.length > 0) {
    const node = removeFromQueue(queue);
    expandedNodes.push(node);
    if (isSolution(node, goal)) {
      var end = performance.now();
      return res.status(200).json({
        path: node.actions,
        depth: node.level,
        expandedNodes: expandedNodes.length,
        executionTime: end - start
      });
    } else {
      let children: TreeNode[] = getChildren(node);
      if (req.body.avoidCicle) children = filterNoExploredNodes(node, children);
      pushOrderByCost(children, queue);
    }
  }
}

export const dfsMethod = (req: Request, res: Response) => {
  const root: TreeNode = req.rootNode!;
  const goal: Coordinates = req.goal!;
  const stack: TreeNode[] = [root];
  const expandedNodes: TreeNode[] = [];
  var start = performance.now();

  while (stack.length > 0) {
    const node = removeFromStack(stack);
    expandedNodes.push(node);
    if (isSolution(node, goal)) {
      var end = performance.now();
      return res.status(200).json({
        path: node.actions,
        depth: node.level,
        expandedNodes: expandedNodes.length,
        executionTime: end - start
      });
    } else {
      let children: TreeNode[] = getChildren(node);
      children = filterNoExploredNodes(node, children);
      stack.push(...children);
    }
  }
}

export const greedyMethod = (req: Request, res: Response) => {
  const root: TreeNode = req.rootNode!;
  const goal: Coordinates = req.goal!;
  const queue: TreeNode[] = [root];
  const expandedNodes: TreeNode[] = [];
  var start = performance.now();

  while (queue.length > 0) {
    let node = removeFromQueue(queue);
    expandedNodes.push(node);
    if (isSolution(node, goal)) {
      var end = performance.now();
      return res.status(200).json({
        path: node.actions,
        depth: node.level,
        expandedNodes: expandedNodes.length,
        executionTime: end - start
      });
    } else {
      let children = getChildren(node, true, goal);
      if (req.body.avoidCicle) children = filterNoExploredNodes(node, children);
      pushOrderByHeuristic(children, queue);
    }
  }
}

export const AstarMethod = (req: Request, res: Response) => {
  const root: TreeNode = req.rootNode!;
  const goal: Coordinates = req.goal!;
  const queue: TreeNode[] = [root];
  const expandedNodes: TreeNode[] = [];
  var start = performance.now();

  while (queue.length > 0) {
    let node = removeFromQueue(queue);
    expandedNodes.push(node);
    if (isSolution(node, goal)) {
      var end = performance.now();
      return res.status(200).json({
        path: node.actions,
        depth: node.level,
        expandedNodes: expandedNodes.length,
        executionTime: end - start
      });
    } else {
      let children = getChildren(node, true, goal);
      if (req.body.avoidCicle) children = filterNoExploredNodes(node, children);
      pushOrderByCostHeuristic(children, queue);
    }
  }
};
