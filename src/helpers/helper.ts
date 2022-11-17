import { UploadedFile } from "express-fileupload";

//typos

export enum POWERUPTYPE {
  STAR = "STAR",
  FLOWER = "FLOWER",
  EMPTY = "EMPTY",
}

enum ACTIONS {
  LEFT = "L",
  UP = "U",
  RIGHT = "R",
  DOWN = "D",
}

interface POWERUP {
  type: POWERUPTYPE;
  remainingUses: number;
}

export interface node {
  value: {
    x: number;
    y: number;
  };
  actions: string;
  level: number;
  costs: number;
  powerUp: POWERUP;
  removeField: boolean;
  heuristic?: number;
}

interface coordinates {
  x: number;
  y: number;
}

export const heuristics = (
  node: node["value"],
  objective: node["value"]
): number => {
  const diference = {
    x: Math.abs(objective.x - node.x),
    y: Math.abs(objective.y - node.y),
  };

  const distance =
    Math.sqrt(Math.pow(diference.x, 2) + Math.pow(diference.y, 2)) / 2;
  return distance;
};

//CONSTANTS
const costs = [1, 0.5, 6];
const fields = [0, 2, 3, 4, 5, 6];
export const errorTicher = "profe no hay solucion :'v";
export const excError = { message: "?? mande eso bien profe :'v" };

//TO DO
//Take powerup and costs from enemies

export const getMovement = (
  node: node,
  field: number
): { finalCost: number; finalPowerUp: POWERUP; removeField: boolean } => {
  var finalCost = 0;
  var finalPowerUp = { type: POWERUPTYPE.EMPTY, remainingUses: 0 };
  var removeField = false;
  if (field == 3) {
    //tengo estrella, y llego a otra
    if (node.powerUp.type == POWERUPTYPE.STAR) {
      finalCost = costs[1];
      finalPowerUp = {
        type: POWERUPTYPE.STAR,
        remainingUses: node.powerUp.remainingUses + 6 - 1,
      };
      removeField = true;
    }
    //no tengo nada
    if (node.powerUp.type == POWERUPTYPE.EMPTY) {
      finalCost = costs[0];
      finalPowerUp = {
        type: POWERUPTYPE.STAR,
        remainingUses: 6,
      };
      removeField = true;
    }
    //tengo flor, y caigo en una estrella, no pasa nada
    if (node.powerUp.type == POWERUPTYPE.FLOWER) {
      finalCost = costs[0];
      finalPowerUp = {
        type: node.powerUp.type,
        remainingUses: node.powerUp.remainingUses,
      };
    }
  } else if (field == 4) {
    //tengo flor, y llego a otra
    if (node.powerUp.type == POWERUPTYPE.FLOWER) {
      finalCost = costs[0];
      finalPowerUp = {
        type: POWERUPTYPE.FLOWER,
        remainingUses: node.powerUp.remainingUses + 1,
      };
      removeField = true;
    }
    //no tengo nada
    if (node.powerUp.type == POWERUPTYPE.EMPTY) {
      finalCost = costs[0];
      finalPowerUp = {
        type: POWERUPTYPE.FLOWER,
        remainingUses: 1,
      };
      removeField = true;
    }
    //tengo estrella, y caigo en una flor, no pasa nada, al menos que sea ultimo tiro
    if (node.powerUp.type == POWERUPTYPE.STAR) {
      finalCost = costs[1];
      finalPowerUp = {
        type:
          node.powerUp.remainingUses - 1 > 0
            ? POWERUPTYPE.STAR
            : POWERUPTYPE.FLOWER,
        remainingUses:
          node.powerUp.remainingUses - 1 > 0
            ? node.powerUp.remainingUses - 1
            : 1,
      };
    }
  } else if (field == 5) {
    //tengo flor
    if (node.powerUp.type == POWERUPTYPE.FLOWER) {
      finalCost = costs[0];
      finalPowerUp = {
        type:
          node.powerUp.remainingUses - 1 > 0
            ? POWERUPTYPE.FLOWER
            : POWERUPTYPE.EMPTY,
        remainingUses: node.powerUp.remainingUses - 1,
      };
      removeField = true;
    }

    //no tengo nada

    if (node.powerUp.type == POWERUPTYPE.EMPTY) {
      finalCost = costs[2];
      finalPowerUp = {
        type: POWERUPTYPE.EMPTY,
        remainingUses: node.powerUp.remainingUses,
      };
    }

    ///tengo estrella

    if (node.powerUp.type == POWERUPTYPE.STAR) {
      finalCost = costs[1];
      finalPowerUp = {
        type:
          node.powerUp.remainingUses - 1 > 0
            ? POWERUPTYPE.STAR
            : POWERUPTYPE.EMPTY,
        remainingUses: node.powerUp.remainingUses - 1,
      };
      removeField = true;
    }
  } else if (node.powerUp.type == POWERUPTYPE.STAR) {
    finalCost = costs[1];
    finalPowerUp = {
      type:
        node.powerUp.remainingUses - 1 > 0
          ? POWERUPTYPE.STAR
          : POWERUPTYPE.EMPTY,
      remainingUses: node.powerUp.remainingUses - 1,
    };
  } else {
    finalCost = costs[0];
    finalPowerUp = {
      type: node.powerUp.type,
      remainingUses: node.powerUp.remainingUses,
    };
  }

  return {
    finalCost,
    finalPowerUp,
    removeField,
  };
};

export const getChildren = (
  node: node,
  world: Array<Array<number>>,
  informed = false,
  goal = { x: 0, y: 0 }
) => {
  let children = [];

  const left =
    node.value.x - 1 >= 0 ? world[node.value.y][node.value.x - 1] : -1;
  const up = node.value.y - 1 >= 0 ? world[node.value.y - 1][node.value.x] : -1;
  const right =
    node.value.x + 1 <= world[0].length
      ? world[node.value.y][node.value.x + 1]
      : -1;
  const down =
    node.value.y + 1 <= world.length
      ? world[node.value.y + 1][node.value.x]
      : -1;

  //left
  if (fields.includes(left)) {
    const { finalCost, finalPowerUp, removeField } = getMovement(node, left);
    children.push({
      value: { x: node.value.x - 1, y: node.value.y },
      actions: node.actions + ACTIONS.LEFT,
      level: node.level + 1,
      costs: node.costs + finalCost,
      powerUp: finalPowerUp,
      heuristics: informed ? heuristics(node.value, goal!) : undefined,
      removeField,
    });
  }
  // Up
  if (fields.includes(up)) {
    const { finalCost, finalPowerUp, removeField } = getMovement(node, up);
    children.push({
      value: { x: node.value.x, y: node.value.y - 1 },
      actions: node.actions + ACTIONS.UP,
      level: node.level + 1,
      costs: node.costs + finalCost,
      powerUp: finalPowerUp,
      heuristics: informed ? heuristics(node.value, goal!) : undefined,
      removeField,
    });
  }
  // Right
  if (fields.includes(right)) {
    const { finalCost, finalPowerUp, removeField } = getMovement(node, right);
    children.push({
      value: { x: node.value.x + 1, y: node.value.y },
      actions: node.actions + ACTIONS.RIGHT,
      level: node.level + 1,
      costs: node.costs + finalCost,
      powerUp: finalPowerUp,
      heuristics: informed ? heuristics(node.value, goal!) : undefined,
      removeField,
    });
  }
  // Down
  if (fields.includes(down)) {
    const { finalCost, finalPowerUp, removeField } = getMovement(node, down);
    children.push({
      value: { x: node.value.x, y: node.value.y + 1 },
      actions: node.actions + ACTIONS.DOWN,
      level: node.level + 1,
      costs: node.costs + finalCost,
      powerUp: finalPowerUp,
      heuristics: informed ? heuristics(node.value, goal!) : undefined,
      removeField,
    });
  }
  return children;
};

//Methods

export const readWorld = (file: UploadedFile) => {
  const Buffer = file.data.toString("utf8");
  const columns = Buffer.split("\r\n");
  const world: Array<Array<number>> = [];
  columns.forEach((column: string) => {
    let columnToNum: Array<number> = column.split(" ").map(Number);
    world.push(columnToNum);
  });

  return world;
};

export const isSolution = (node: node, solution: node["value"]): boolean => {
  return node.value.x == solution.x && node.value.y == solution.y;
};

export const hashIndex = (node: node) => {
  return node.value.y * 10 + node.value.x + 10 ;
};

export const myCoordinates = (
  world: Array<Array<number>>,
  searchTo: number
): coordinates | null => {
  for (let i = 0; i < world.length; i++) {
    for (let j = 0; j < world[0].length; j++) {
      if (world[i][j] == searchTo) {
        return {
          x: j,
          y: i,
        };
      } else {
      }
    }
  }
  return null;
};

//Data structures, here I put the methods from queue's,heaps,etc

export const addToQueue = (queue: Array<node>, nodes: node[]) => {
  queue.push(...nodes);
  return queue;
};

export const removeFromQueue = (queue: Array<node>) => {
  return queue.shift();
};

export const addToStock = (Stock: Array<node>, nodes: node[]) => {
  Stock.push(...nodes);
  return Stock;
};

export const removeFromStock = (Stock: Array<node>) => {
  return Stock.pop();
};

export const addToList = (list: any, nodes: node[]) => {
  list.push(...nodes);
  return list;
};

export const sortCosts = (list: Array<node>) => {
  return list.sort((a, b) => {
    return a.costs - b.costs;
  });
};

export const sortHeuristic = (list: Array<node>) => {
  return list.sort((a, b) => {
    return a.heuristic! - b.heuristic!;
  });
};

export const sortCostsHeuristic = (list: Array<node>) => {
  return list.sort((a, b) => {
    return a.heuristic! + a.costs - b.heuristic! + b.costs;
  });
};

//HEURISTICS

// export const heuristics = (
//   node: node["value"],
//   objective: node["value"],
//   distance: number
// ): number => {
//   const xIsEqual: boolean = node.x == objective.x;
//   const yIsEqual: boolean = node.y == objective.y;
//   if (xIsEqual && yIsEqual) {
//     return Math.floor(distance / 2) + 0.5;
//   }

//   if (!xIsEqual && !yIsEqual) {
//     return heuristics(
//       {
//         x: node.x < objective.x ? node.x + 1 : node.x - 1,
//         y: node.y < objective.y ? node.y + 1 : node.y - 1,
//       },
//       objective,
//       distance + 1
//     );
//   } else if (xIsEqual) {
//     return heuristics(
//       {
//         x: node.x,
//         y: node.y < objective.y ? node.y + 1 : node.y - 1,
//       },
//       objective,
//       distance + 1
//     );
//   } else {
//     return heuristics(
//       {
//         x: node.x < objective.x ? node.x + 1 : node.x - 1,
//         y: node.y,
//       },
//       objective,
//       distance + 1
//     );
//   }
// };
