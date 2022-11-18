import { Coordinates } from './../interfaces/Coordinates';
import { Request, Response } from "express";
import { TreeNode } from "interfaces/TreeNode";
import { performance } from 'perf_hooks';
import {
  CELL_TYPE,
  copyWorld,
  errorTicher,
  excError,
  getChildren,
  hashIndex,
  isSolution,
  myCoordinates,
  pushOrderByCost,
  readWorld,
  removeFromQueue,
  removeFromStack,
  pushOrderByHeuristic,
  pushOrderByCostHeuristic,
} from "../helpers/helper";

export const bfsMethod = (req: Request, res: Response) => {
  try {
    //@ts-ignore-next-line
    const file: UploadedFile = req.files?.textfile ?? "./empty.txt";
    const world: number[][] = readWorld(file);
    const location: Coordinates = myCoordinates(world, 2);
    const goal: Coordinates = myCoordinates(world, 6);
    const expandedNodes: TreeNode[] = [];
    let hashTable = {};
    let root: TreeNode = {
      actions: "",
      coordinates: location,
      cost: 0,
      level: 0,
      status: copyWorld(world),
      type: CELL_TYPE.INITIAL,
      powerUp: {
        type: CELL_TYPE.FREE,
        remainingUses: 0
      }
    };

    let queue: TreeNode[] = [];
    queue.push(root);

    var start = performance.now();
    while (true) {
      if (queue.length == 0) {
        return errorTicher;
      } else {
        let node: TreeNode = removeFromQueue(queue);
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
          if (req.body.avoidCicle) {
            children = children.filter(node => {
              let key = hashIndex(node!);
              //@ts-ignore
              if (!hashTable[key]) {
                //@ts-ignore
                hashTable[key] = 1;
                return true;
              } else {
                return false;
              }
            });
          }
          queue.push(...children);
        }
      }
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const ucsMethod = (req: Request, res: Response) => {
  try {
    //@ts-ignore-next-line
    const file: UploadedFile = req.files?.textfile ?? "./empty.txt";
    const world: number[][] = readWorld(file);
    const location: Coordinates = myCoordinates(world, 2);
    const goal: Coordinates = myCoordinates(world, 6);
    const expandedNodes: TreeNode[] = [];
    let hashTable = {};
    let root: TreeNode = {
      actions: "",
      coordinates: location,
      cost: 0,
      level: 0,
      status: copyWorld(world),
      type: CELL_TYPE.INITIAL,
      powerUp: {
        type: CELL_TYPE.FREE,
        remainingUses: 0
      }
    };
    
    let queue: TreeNode[] = [];
    queue.push(root);

    var start = performance.now();
    while (true) {
      if (queue.length == 0) {
        return errorTicher;
      } else {
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
          let children: TreeNode[] = getChildren(node);
          if (req.body.avoidCicle) {
            children = children.filter((node) => {
              let key = hashIndex(node);
              //@ts-ignore
              if (!hashTable[key]) {
                //@ts-ignore
                hashTable[key] = 1;
                return true;
              } else {
                return false;
              }
            });
          }
          pushOrderByCost(children, queue);
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const dfsMethod = (req: Request, res: Response) => {
  try {
    //@ts-ignore-next-line
    const file: UploadedFile = req.files?.textfile ?? "./empty.txt";
    const world: number[][] = readWorld(file);
    const location: Coordinates = myCoordinates(world, 2);
    const goal: Coordinates = myCoordinates(world, 6);
    const expandedNodes: TreeNode[] = [];
    let hashTable = {};
    let root: TreeNode = {
      actions: "",
      coordinates: location,
      cost: 0,
      level: 0,
      status: copyWorld(world),
      type: CELL_TYPE.INITIAL,
      powerUp: {
        type: CELL_TYPE.FREE,
        remainingUses: 0
      }
    };
    
    let stack: TreeNode[] = [];
    stack.push(root);

    var start = performance.now();
    while (true) {
      if (stack.length == 0) {
        return errorTicher;
      } else {
        let node = removeFromStack(stack);
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
          children = children.filter(node => {
            let key = hashIndex(node);
            //@ts-ignore
            if (!hashTable[key]) {
              //@ts-ignore
              hashTable[key] = 1;
              return true;
            } else {
              return false;
            }
          });
          stack.push(...children);
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const greedyMethod = (req: Request, res: Response) => {
  try {
    //@ts-ignore-next-line
    const file: UploadedFile = req.files?.textfile ?? "./empty.txt";
    const world: number[][] = readWorld(file);
    const location: Coordinates = myCoordinates(world, 2);
    const goal: Coordinates = myCoordinates(world, 6);
    const expandedNodes: TreeNode[] = [];
    let hashTable = {};
    let root: TreeNode = {
      actions: "",
      coordinates: location,
      cost: 0,
      level: 0,
      status: copyWorld(world),
      type: CELL_TYPE.INITIAL,
      powerUp: {
        type: CELL_TYPE.FREE,
        remainingUses: 0
      },
      heuristic: 0
    };

    let queue: TreeNode[] = [];
    queue.push(root);

    var start = performance.now();
    while (true) {
      if (queue.length == 0) {
        return errorTicher;
      } else {
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
          children = children.filter((node) => {
            let key = hashIndex(node);
            //@ts-ignore
            if (!hashTable[key]) {
              //@ts-ignore
              hashTable[key] = 1;
              return true;
            } else {
              return false;
            }
          });
          pushOrderByHeuristic(children, queue);
        }
      }
    }
  } catch (error) {
    res.status(400).json(excError);
  }
};

export const AstarMethod = (req: Request, res: Response) => {
  try {
    //@ts-ignore-next-line
    const file: UploadedFile = req.files?.textfile ?? "./empty.txt";
    const world: number[][] = readWorld(file);
    const location: Coordinates = myCoordinates(world, 2);
    const goal: Coordinates = myCoordinates(world, 6);
    const expandedNodes: TreeNode[] = [];
    let hashTable = {};
    let root: TreeNode = {
      actions: "",
      coordinates: location,
      cost: 0,
      level: 0,
      status: copyWorld(world),
      type: CELL_TYPE.INITIAL,
      powerUp: {
        type: CELL_TYPE.FREE,
        remainingUses: 0
      },
      heuristic: 0
    };

    let queue: TreeNode[] = [];
    queue.push(root);

    var start = performance.now();
    while (true) {
      if (queue.length == 0) {
        return errorTicher;
      } else {
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
          children = children.filter((node) => {
            let key = hashIndex(node);
            //@ts-ignore
            if (!hashTable[key]) {
              //@ts-ignore
              hashTable[key] = 1;
              return true;
            } else {
              return false;
            }
          });
          pushOrderByCostHeuristic(children, queue);
        }
      }
    }
  } catch (error) {
    res.status(400).json(excError);
  }
};
