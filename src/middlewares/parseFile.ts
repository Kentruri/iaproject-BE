import { Request, Response, NextFunction } from 'express';
import { UploadedFile } from 'express-fileupload';
import { TreeNode } from '../interfaces/TreeNode';
import { Coordinates } from '../interfaces/Coordinates';
import { CELL_TYPE } from '../helpers/helper';

declare module "express-serve-static-core" {
  interface Request {
    rootNode?: TreeNode;
    goal?: Coordinates;
  }
}

/**
 * Este middleware parsea la información recibida desde el archivo para extraer lo necesario del nodo raíz y la ubicación de la meta
 * @param req Request 
 * @param res Response
 * @param next Next
 */
export default function parseFile(req: Request, res: Response, next: NextFunction) {
  try {
    //@ts-ignore-next-line
    const file: UploadedFile = req.files?.textfile ?? "./empty.txt";
    const world: number[][] = readWorld(file);
    const location: Coordinates = myCoordinates(world, 2);
    const goal: Coordinates = myCoordinates(world, 6);
    let root: TreeNode = {
      actions: "",
      coordinates: location,
      cost: 0,
      hashTable: {},
      heuristic: 0,
      level: 0,
      status: world,
      type: CELL_TYPE.INITIAL,
      powerUp: {
        type: CELL_TYPE.FREE,
        remainingUses: 0
      }
    };
    req.goal = goal;
    req.rootNode = root;
    next()
    } catch (error) {
      res.status(401).json({
        message: "?? mande eso bien profe :'v",
        error
      });
    }
}

/**
 * Convierte un archivo en una matriz para el laberinto del problema.
 * @param file Archivo que recibe el servicio desde el front
 * @returns Matriz que corresponde al laberinto del problema
 */
 function readWorld(file: UploadedFile): number[][] {
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
 function myCoordinates(world: number[][], searchTo: number): Coordinates {
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