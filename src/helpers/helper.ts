import { Coordinates } from './../interfaces/Coordinates';
import { UploadedFile } from "express-fileupload";
import { TreeNode } from 'interfaces/TreeNode';

export enum CELL_TYPE {
  FREE = 0,
  WALL = 1,
  INITIAL = 2,
  STAR = 3,
  FLOWER = 4,
  KOOPA = 5,
  PRINCESS = 6
}

/**
 * Convierte un archivo en una matriz para el laberinto del problema.
 * @param file Archivo que recibe el servicio desde el front
 * @returns Matriz que corresponde al laberinto del problema
 */
 export function readWorld(file: UploadedFile): number[][] {
  const Buffer = file.data.toString("utf8");
  const columns = Buffer.split("\r\n");
  const world: number[][] = [];
  columns.forEach(column => {
    let columnToNum: number[] = column.split(" ").map(Number);
    world.push(columnToNum);
  });
  return world;
};

/**
/** 
 * Encuentra la posición (x,y) en el laberinto para un número dado.
 * @param world Laberinto
 * @param searchTo Número a buscar
 * @returns Interfaz con los valores
 */
export const myCoordinates = (world: number[][], searchTo: number): Coordinates => {
  let coordinates: Coordinates = {x: 0, y: 0};
  for (let i = 0; i < world.length; i++) {
    for (let j = 0; j < world[0].length; j++) {
      if (world[i][j] == searchTo) {
        coordinates = { x: j, y: i,};
      }
    }
  }
  return coordinates;
};

/**
 * Hace una copia profunda del laberinto para llevar el estado en cada nodo
 * @param world Laberinto
 * @returns Copia exacta del laberinto pero en diferente posición de memoria
 */
 export function copyWorld(world: number[][]): number[][] {
  const worldString: string = JSON.stringify(world);
  return JSON.parse(worldString);
};

/**
 * Verifica si Mario ya llegó donde la princesa
 * @param node Posición actual de Mario
 * @param solution Posición de la princesa
 * @returns True si están en la misma posición, False si no
 */
 export const isSolution = (node: TreeNode, solution: Coordinates): boolean => {
  return node.coordinates.x == solution.x && node.coordinates.y == solution.y;
};

/**
 * Obtiene los hijos de un nodo
 * @param node Nodo padre
 * @param informed Indica si la búsqueda es informada o no
 * @param goal Meta
 * @returns Nodos hijo
 */
export function getChildren(node: TreeNode, informed = false, goal = { x: 0, y: 0 }): TreeNode[] {
  // Lista de hijos
  let children: TreeNode[] = [];
  // Obtención de los posibles movimientos
  const left: number = node.coordinates.x - 1 >= 0 ? node.status[node.coordinates.y][node.coordinates.x - 1] : -1;
  const up: number = node.coordinates.y - 1 >= 0 ? node.status[node.coordinates.y - 1][node.coordinates.x] : -1;
  const right: number = node.coordinates.x + 1 <= node.status[0].length ? node.status[node.coordinates.y][node.coordinates.x + 1] : -1;
  const down: number = node.coordinates.y + 1 <= node.status.length ? node.status[node.coordinates.y + 1][node.coordinates.x] : -1;
  // Verificación y ejecución de cada movimiento
  if (fields.includes(up)) {
    const childNode: TreeNode = getMovement(node, up);
    childNode.coordinates = { x: node.coordinates.x, y: node.coordinates.y - 1 },
    childNode.actions = node.actions + ACTIONS.UP,
    childNode.heuristic = informed ? heuristics(childNode.coordinates, goal) : undefined,
    children.push(childNode);
  }
  if (fields.includes(down)) {
    const childNode: TreeNode = getMovement(node, down);
    childNode.coordinates = { x: node.coordinates.x, y: node.coordinates.y + 1 },
    childNode.actions = node.actions + ACTIONS.DOWN,
    childNode.heuristic = informed ? heuristics(childNode.coordinates, goal) : undefined,
    children.push(childNode);
  }
  if (fields.includes(left)) {
    const childNode: TreeNode = getMovement(node, left);
    childNode.coordinates = { x: node.coordinates.x - 1, y: node.coordinates.y };
    childNode.actions = node.actions + ACTIONS.LEFT;
    childNode.heuristic = informed ? heuristics(childNode.coordinates, goal) : undefined;
    children.push(childNode);
  }
  if (fields.includes(right)) {
    const childNode: TreeNode = getMovement(node, right);
    childNode.coordinates = { x: node.coordinates.x + 1, y: node.coordinates.y },
    childNode.actions = node.actions + ACTIONS.RIGHT,
    childNode.heuristic = informed ? heuristics(childNode.coordinates, goal) : undefined,
    children.push(childNode);
  } 
  return children;
};

/**
 * Ejecución de un movimiento en específico
 * @param node Nodo actual
 * @param field Movimiento
 * @returns Nodo resultante del movimiento
 */
export function getMovement(node: TreeNode, field: number): TreeNode {
  const costs = [1, 0.5, 6];
  let childNode: TreeNode = Object.assign({}, node);
  childNode.level++;
  switch (field) {
    case CELL_TYPE.STAR:
      //tengo estrella, y llego a otra
      if (node.powerUp.type == CELL_TYPE.STAR) {
        childNode.cost = node.cost! + costs[1];
        childNode.powerUp = {
          type: CELL_TYPE.STAR,
          remainingUses: node.powerUp!.remainingUses + 6 - 1
        }
      }
      //no tengo nada
      if (node.powerUp.type == CELL_TYPE.FREE) {
        childNode.cost = node.cost! + costs[0];
        childNode.powerUp = {
          type: CELL_TYPE.STAR,
          remainingUses: node.powerUp!.remainingUses + 6
        }
      }
      //tengo flor, y caigo en una estrella, no pasa nada
      if (node.powerUp.type == CELL_TYPE.FLOWER) {
        childNode.cost = node.cost! + costs[0];
        childNode.powerUp = {
          type: CELL_TYPE.FLOWER,
          remainingUses: node.powerUp!.remainingUses,
        };
      }
      checkCell(childNode);
      childNode.type = CELL_TYPE.STAR;
      break;
    case CELL_TYPE.FLOWER:
      //tengo flor, y llego a otra
      if (node.powerUp.type == CELL_TYPE.FLOWER) {
        childNode.cost = node.cost! + costs[0];
        childNode.powerUp = {
          type: CELL_TYPE.FLOWER,
          remainingUses: node.powerUp!.remainingUses + 1,
        };
      }
      //no tengo nada
      if (node.powerUp.type == CELL_TYPE.FREE) {
        childNode.cost = node.cost! + costs[0];
        childNode.powerUp = {
          type: CELL_TYPE.FLOWER,
          remainingUses: 1,
        };
      }
      //tengo estrella, y caigo en una flor, no pasa nada, a menos que sea ultimo tiro
      if (node.powerUp.type == CELL_TYPE.STAR) {
        childNode.cost = node.cost! + costs[1];
        childNode.powerUp = {
          type:
            node.powerUp!.remainingUses - 1 > 0
              ? CELL_TYPE.STAR
              : CELL_TYPE.FLOWER,
          remainingUses:
            node.powerUp!.remainingUses - 1 > 0
              ? node.powerUp!.remainingUses - 1
              : 1,
        };
      }
      checkCell(childNode);
      childNode.type = CELL_TYPE.FLOWER;
      break;
    case CELL_TYPE.KOOPA:
      //tengo flor
      if (node.powerUp.type == CELL_TYPE.FLOWER) {
        childNode.cost = node.cost! + costs[0];
        childNode.powerUp = {
          type:
            node.powerUp!.remainingUses - 1 > 0
              ? CELL_TYPE.FLOWER
              : CELL_TYPE.FREE,
          remainingUses: node.powerUp!.remainingUses - 1,
        };
      }
      //no tengo nada
      if (node.powerUp.type == CELL_TYPE.FREE) {
        childNode.cost = node.cost! + costs[2];
      }
      ///tengo estrella
      if (node.powerUp.type == CELL_TYPE.STAR) {
        childNode.cost = node.cost! + costs[1];
        childNode.powerUp = {
          type:
            node.powerUp!.remainingUses - 1 > 0
              ? CELL_TYPE.STAR
              : CELL_TYPE.FREE,
          remainingUses: node.powerUp!.remainingUses - 1,
        };
      }
      checkCell(childNode);
      childNode.type = CELL_TYPE.KOOPA;
      break;
    default:
      if (node.powerUp.type == CELL_TYPE.STAR) {
        childNode.cost = node.cost! + costs[1];
        childNode.powerUp = {
          type:
            node.powerUp!.remainingUses - 1 > 0
              ? CELL_TYPE.STAR
              : CELL_TYPE.FREE,
          remainingUses: node.powerUp!.remainingUses - 1,
        };
      } else {
        childNode.cost = node.cost! + costs[0];
      }
      checkCell(childNode);
      childNode.type = field == 0 ? CELL_TYPE.FREE : CELL_TYPE.PRINCESS;
      break;
  }
  return childNode;
};

/**
 * Verifica si la casilla tenía algún poder y en caso de haberlo tomado, deja la casilla en 0
 * Verifica también si había un koopa en la casilla y en caso de tener una flor, lo elimina
 * @param node Nodo para hacer la verificación
 */
 export function checkCell(node: TreeNode): void {
  if ((node.type == CELL_TYPE.INITIAL) ||
    (node.type == CELL_TYPE.FLOWER && node.powerUp.type == node.type) || 
    (node.type == CELL_TYPE.STAR && node.powerUp.type == node.type) || 
    (node.type == CELL_TYPE.FLOWER && node.powerUp.type == CELL_TYPE.FREE) || 
    (node.type == CELL_TYPE.STAR && node.powerUp.type == CELL_TYPE.FREE) || 
    (node.type == CELL_TYPE.KOOPA && node.powerUp!.type == CELL_TYPE.FLOWER && node.powerUp!.remainingUses > 0)) {
      node.status[node.coordinates.y][node.coordinates.x] = 0;
    }
};

/**
 * Calcula la heurtística para llegar de un nodo a otro
 * @param node Punto de salid
 * @param objective Punto de llegada
 * @returns Valor de la heurística
 */
export function heuristics(node: TreeNode["coordinates"], objective: TreeNode["coordinates"]): number {
  const diference = {
    x: Math.abs(objective.x - node.x),
    y: Math.abs(objective.y - node.y),
  };
  return Math.sqrt(Math.pow(diference.x, 2) + Math.pow(diference.y, 2)) / 2;
};

/**
 * Encuentra la posición en la que debe agregarse un objeto dentro de un arreglo ordenado por costo & heurística y que no dañe el orden
 * @param queue Lista ordeanda
 * @param node Nodo a insertar
 * @param realIndex Al estar particionando la cola, con este parámetro se persiste el índice realmente necesario
 * @returns Ubicación que debe tener el nodo
 */
 export function findIndexCostHeu(queue: TreeNode[], node: TreeNode, realIndex: number = 0): number {
  let index = Math.round(queue.length / 2);
  if (!queue.length || queue[0].cost + queue[0].heuristic! >=  node.cost + node.heuristic!) {
    return realIndex;
  } else if (queue[queue.length - 1].cost + queue[queue.length - 1].heuristic! <= node.cost + node.heuristic!) {
    return queue.length + realIndex;
  } else if (queue[index].cost + queue[index].heuristic! == node.cost + node.heuristic!) {
    return index + realIndex;
  } else if (queue[index].cost + queue[index].heuristic! > node.cost + node.heuristic!) {
    return findIndexCostHeu(queue.slice(0, index), node, realIndex);
  } else {
    realIndex += index;
    return findIndexCostHeu(queue.slice(index, queue.length), node, realIndex);
  }
}

//typos
enum ACTIONS {
  LEFT = "L",
  UP = "U",
  RIGHT = "R",
  DOWN = "D",
}

//CONSTANTS
const fields = [0, 2, 3, 4, 5, 6];
export const errorTicher = "profe no hay solucion :'v";
export const excError = { message: "?? mande eso bien profe :'v" };

//Methods
export const hashIndex = (node: TreeNode): number => {
  return node.coordinates.y * 10 + node.coordinates.x + 10 ;
};

//Data structures, here I put the methods from queue's,heaps,etc
/**
 * Devuelve el nodo que será expandido a la vez de que lo quita de la cola
 * Como ya será expandido deja el rastro en la tabla hash para no tener la posibilidad de que regrese a ese punto
 * @param queue Nodos en espera
 * @returns Nodo que será procesado
 */
export function removeFromQueue (queue: TreeNode[]): TreeNode {
  const nodeSacado: TreeNode | undefined =  queue.shift();
  if (nodeSacado !== undefined) {
    let key: number = hashIndex(nodeSacado);
    nodeSacado.hashTable[key] = 1;
    return nodeSacado;
  } else {
    throw errorTicher;
  }
};

/**
 * Devuelve el nodo que será expandido a la vez de que lo quita de la pila
 * Como ya será expandido deja el rastro en la tabla hash para no tener la posibilidad de que regrese a ese punto
 * @param queue Nodos en espera
 * @returns Nodo que será procesado
 */
export const removeFromStack = (stock: TreeNode[]) => {
  const nodeSacado: TreeNode | undefined = stock.pop();
  if (nodeSacado !== undefined) {
    let key: number = hashIndex(nodeSacado);
    nodeSacado.hashTable[key] = 1;
    return nodeSacado;
  } else {
    throw errorTicher;
  }
};



/**
 * Inserta un nuevo nodo en una fila que esté ordeanada por costo manteniendo ese mismo orden
 * @param children Lista de nodos para insertar
 * @param queue Fila que debería estar ya ordenada
 */
 export function pushOrderByCost(children: TreeNode[], queue: TreeNode[]): void {
  children.forEach(node => {
    let index = findIndexCost(queue, node);
    queue.splice(index, 0, node);
  });
}

/**
 * Encuentra la posición en la que debe agregarse un objeto dentro de un arreglo ordenado por costo y que no dañe el orden
 * @param queue Lista ordeanda
 * @param node Nodo a insertar
 * @param realIndex Al estar particionando la cola, con este parámetro se persiste el índice realmente necesario
 * @returns Ubicación que debe tener el nodo
 */
export function findIndexCost(queue: TreeNode[], node: TreeNode, realIndex: number = 0): number {
  let index = Math.round(queue.length / 2);
  if (!queue.length || queue[0].cost >=  node.cost) {
    return realIndex;
  } else if (queue[queue.length - 1].cost <= node.cost) {
    return queue.length + realIndex;
  } else if (queue[index].cost == node.cost) {
    return index + realIndex;
  } else if (queue[index].cost > node.cost) {
    return findIndexCost(queue.slice(0, index), node, realIndex);
  } else {
    realIndex += index;
    return findIndexCost(queue.slice(index, queue.length), node, realIndex);
  }
}

/**
 * Inserta un nuevo nodo en una fila que esté ordeanada por heurística manteniendo ese mismo orden
 * @param children Lista de nodos para insertar
 * @param queue Fila que debería estar ya ordenada
 */
 export function pushOrderByHeuristic(children: TreeNode[], queue: TreeNode[]): void {
  children.forEach(node => {
    let index = findIndexHeu(queue, node);
    queue.splice(index, 0, node);
  });
}

/**
 * Encuentra la posición en la que debe agregarse un objeto dentro de un arreglo ordenado por heurística y que no dañe el orden
 * @param queue Lista ordeanda
 * @param node Nodo a insertar
 * @param realIndex Al estar particionando la cola, con este parámetro se persiste el índice realmente necesario
 * @returns Ubicación que debe tener el nodo
 */
 export function findIndexHeu(queue: TreeNode[], node: TreeNode, realIndex: number = 0): number {
  let index = Math.round(queue.length / 2);
  if (!queue.length || queue[0].heuristic! >=  node.heuristic!) {
    return realIndex;
  } else if (queue[queue.length - 1].heuristic! <= node.heuristic!) {
    return queue.length + realIndex;
  } else if (queue[index].heuristic! == node.heuristic!) {
    return index + realIndex;
  } else if (queue[index].heuristic! > node.heuristic!) {
    return findIndexHeu(queue.slice(0, index), node, realIndex);
  } else {
    realIndex += index;
    return findIndexHeu(queue.slice(index, queue.length), node, realIndex);
  }
}

/**
 * Inserta un nuevo nodo en una fila que esté ordeanada por costo & heurística manteniendo ese mismo orden
 * @param children Lista de nodos para insertar
 * @param queue Fila que debería estar ya ordenada
 */
 export function pushOrderByCostHeuristic(children: TreeNode[], queue: TreeNode[]): void {
  children.forEach(node => {
    let index = findIndexCostHeu(queue, node);
    queue.splice(index, 0, node);
  });
}

export function filterNoExploredNodes(actualNode: TreeNode, children: TreeNode[]): TreeNode[] {
  return children.filter(node => !actualNode.hashTable[hashIndex(node)]);
}