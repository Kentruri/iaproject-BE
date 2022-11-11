import { UploadedFile } from "express-fileupload";

//typos

enum POWERUP {
  STAR = "STAR",
  FLOWER = "FLOWER",
}

enum ACTIONS {
  LEFT = "L",
  UP = "U",
  RIGHT = "R",
  DOWN = "D",
}

export interface node {
  value: {
    x: number;
    y: number;
  };
  actions: string;
  level: number;
  costs: number;
  powerUp: POWERUP | undefined | null;
}

interface coordinates {
  x: number;
  y: number;
}

//HEURISTICS

export const heuristics = (
  node: node["value"],
  objective: node["value"],
  distance: number
): number => {
  const xIsEqual: boolean = node.x == objective.x;
  const yIsEqual: boolean = node.y == objective.y;
  if (xIsEqual && yIsEqual) {
    return Math.floor(distance / 2) + 0.5;
  }

  if (!xIsEqual && !yIsEqual) {
    return heuristics(
      {
        x: node.x < objective.x ? node.x + 1 : node.x - 1,
        y: node.y < objective.y ? node.y + 1 : node.y - 1,
      },
      objective,
      distance + 1
    );
  } else if (xIsEqual) {
    return heuristics(
      {
        x: node.x,
        y: node.y < objective.y ? node.y + 1 : node.y - 1,
      },
      objective,
      distance + 1
    );
  } else {
    return heuristics(
      {
        x: node.x < objective.x ? node.x + 1 : node.x - 1,
        y: node.y,
      },
      objective,
      distance + 1
    );
  }
};

//CONSTANTS

const actions = ["L", "U", "R", "D"];
const costs = [1, 0.5, 6];
const fields = [2, 3, 4, 5, 6];
export const error = "profe no hay solucion :'v";
export const excError = { message: "?? mande eso bien profe :'v" };

//TO DO
//Take powerup and costs from enemies

export const getChildren = (node: node, world: Array<Array<number>>) => {
  let children = [];
  const left = world[node.value.y][node.value.x - 1];
  const up = world[node.value.y - 1][node.value.x];
  const right = world[node.value.y][node.value.x + 1];
  const down = world[node.value.y + 1][node.value.x];
  // Left
  if (node.value.x >= 1 && fields.includes(left)) {
    children.push({
      value: { x: node.value.x - 1, y: node.value.y },
      actions: node.actions + ACTIONS.LEFT,
      level: node.level + 1,
      costs: node.costs + costs[0],
      powerUp: undefined,
    });
  }
  // Up
  if (node.value.y >= 1 && fields.includes(up)) {
    children.push({
      value: { x: node.value.x, y: node.value.y - 1 },
      actions: node.actions + ACTIONS.UP,
      level: node.level + 1,
      costs: node.costs + costs[1],
      powerUp: undefined,
    });
  }
  // Right
  if (node.value.x < world[0].length - 1 && fields.includes(right)) {
    children.push({
      value: { x: node.value.x + 1, y: node.value.y },
      actions: node.actions + ACTIONS.RIGHT,
      level: node.level + 1,
      costs: node.costs + costs[2],
      powerUp: undefined,
    });
  }
  // Down
  if (node.value.y < world.length - 1 && fields.includes(down)) {
    children.push({
      value: { x: node.value.x, y: node.value.y + 1 },
      actions: node.actions + ACTIONS.DOWN,
      level: node.level + 1,
      costs: node.costs + costs[3],
      powerUp: undefined,
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
  return Math.floor((node.value.y * 100 + node.value.x * 3) / 5);
};

export const myCoordinates = (
  world: Array<Array<number>>,
  searchTo: number
): coordinates | null => {
  for (let i = 0; i < world.length - 1; i++) {
    for (let j = 0; j < world[0].length - 1; j++) {
      if (world[i][j] == searchTo) {
        return {
          x: i,
          y: j,
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
