import { Coordinates } from './Coordinates';
import { PowerUp } from './PowerUp';

export interface TreeNode {
  // Coordenadas (x,y)
  coordinates: Coordinates;

  // Estado del laberinto
  status: number[][];

  // Acciones ejecutadas
  actions: string;

  // Profundidad
  level: number;

  // Tipo de celda, distingue si está en un powerup, celda vacía, koopa, etc...
  type: number;

  // Si posee un powerUp, indica cuál es
  powerUp: PowerUp;

  // Heurística
  heuristic?: number;

  // Costo acumulado
  cost: number;

  // Tabla hash para llevar el rastro de los recorrido
  hashTable: { [key: number]: number }
}