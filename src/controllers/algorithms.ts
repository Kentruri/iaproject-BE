import { Request, Response } from "express";
import {
  addToList,
  addToQueue,
  addToStock,
  error,
  excError,
  getChildren,
  hashIndex,
  heuristics,
  isSolution,
  myCoordinates,
  node,
  POWERUPTYPE,
  readWorld,
  removeFromQueue,
  removeFromStock,
  sortCosts,
} from "../helpers/helper";

export const bfsMethod = (req: Request, res: Response) => {
  try {
    //@ts-ignore-next-line
    const file: UploadedFile = req.files?.textfile ?? "./empty.txt";
    const world = readWorld(file);
    const location = myCoordinates(world, 2) || { x: 0, y: 0 };
    const objetive = myCoordinates(world, 6);

    let root: node = {
      value: location,
      actions: "",
      level: 0,
      costs: 0,
      powerUp: {
        type: POWERUPTYPE.EMPTY,
        remainingUses: 0,
      },
    };

    let hashTable = {};
    let queue: Array<node> = [];

    queue.push(root);

    while (true) {
      if (queue.length == 0) {
        return error;
      } else {
        let node = removeFromQueue(queue);
        if (isSolution(node!, objetive!)) {
          return res.status(200).json({
            path: node?.actions,
            depth: node?.level,
            cost: node?.costs,
          });
        } else {
          let children = getChildren(node!, world!, hashTable);
          children = children.filter((node: node) => {
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
          addToQueue(queue, children);
        }
      }
    }
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

export const dfsMethod = (req: Request, res: Response) => {
  try {
    //@ts-ignore-next-line
    const file: UploadedFile = req.files?.textfile ?? "./empty.txt";
    const world = readWorld(file);
    const location = myCoordinates(world, 2) || { x: 0, y: 0 };
    const objetive = myCoordinates(world, 6);
    let stock = [];
    let hashTable = {};
    let root: node = {
      value: location,
      actions: "",
      level: 0,
      costs: 0,
      powerUp: {
        type: POWERUPTYPE.EMPTY,
        remainingUses: 0,
      },
    };

    stock.push(root);

    while (true) {
      if (stock.length == 0) {
        return error;
      } else {
        let node = removeFromStock(stock);
        if (isSolution(node!, objetive!)) {
          return res.status(200).json({
            path: node?.actions,
            depth: node?.level,
            cost: node?.costs,
          });
        } else {
          let children = getChildren(node!, world);

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
          addToStock(stock, children);
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const ucsMethod = (req: Request, res: Response) => {
  try {
    //@ts-ignore-next-line
    const file: UploadedFile = req.files?.textfile ?? "./empty.txt";
    const world = readWorld(file);
    const location = myCoordinates(world, 2) || { x: 0, y: 0 };
    const objetive = myCoordinates(world, 6);
    let hashTable = {};
    let list = [];
    let root: node = {
      value: location,
      actions: "",
      level: 0,
      costs: 0,
      powerUp: {
        type: POWERUPTYPE.EMPTY,
        remainingUses: 0,
      },
    };
    list.push(root);
    while (true) {
      if (list.length == 0) {
        return error;
      } else {
        if (list.length > 1) {
          list = sortCosts(list);
        }
        let node = list.shift();

        if (isSolution(node!, objetive!)) {
          return res.status(200).json({
            path: node?.actions,
            depth: node?.level,
            cost: node?.costs,
          });
        } else {
          let children = getChildren(node!, world!);

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
          addToList(list, children);
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
    const world = readWorld(file);
  } catch (error) {
    res.status(400).json(excError);
  }
};

export const greedyMethod = (req: Request, res: Response) => {
  try {
    //@ts-ignore-next-line
    const file: UploadedFile = req.files?.textfile ?? "./empty.txt";
    const world = readWorld(file);
  } catch (error) {
    res.status(400).json(excError);
  }
};

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
