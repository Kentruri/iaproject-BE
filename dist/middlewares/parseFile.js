"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("../helpers/helper");
/**
 * Este middleware parsea la información recibida desde el archivo para extraer lo necesario del nodo raíz y la ubicación de la meta
 * @param req Request
 * @param res Response
 * @param next Next
 */
function parseFile(req, res, next) {
    var _a, _b;
    try {
        //@ts-ignore-next-line
        const file = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.textfile) !== null && _b !== void 0 ? _b : "./empty.txt";
        const world = readWorld(file);
        const location = myCoordinates(world, 2);
        const goal = myCoordinates(world, 6);
        let root = {
            actions: "",
            coordinates: location,
            cost: 0,
            hashTable: {},
            heuristic: 0,
            level: 0,
            status: world,
            type: helper_1.CELL_TYPE.INITIAL,
            powerUp: {
                type: helper_1.CELL_TYPE.FREE,
                remainingUses: 0
            }
        };
        req.goal = goal;
        req.rootNode = root;
        next();
    }
    catch (error) {
        res.status(401).json({
            message: "?? mande eso bien profe :'v",
            error
        });
    }
}
exports.default = parseFile;
/**
 * Convierte un archivo en una matriz para el laberinto del problema.
 * @param file Archivo que recibe el servicio desde el front
 * @returns Matriz que corresponde al laberinto del problema
 */
function readWorld(file) {
    const Buffer = file.data.toString("utf8");
    const columns = Buffer.split("\r\n");
    const world = [];
    columns.forEach(column => {
        let columnToNum = column.split(" ").map(Number);
        world.push(columnToNum);
    });
    return world;
}
;
/**
/**
 * Encuentra la posición (x,y) en el laberinto para un número dado.
 * @param world Laberinto
 * @param searchTo Número a buscar
 * @returns Interfaz con los valores
 */
function myCoordinates(world, searchTo) {
    let coordinates = { x: 0, y: 0 };
    for (let i = 0; i < world.length; i++) {
        for (let j = 0; j < world[0].length; j++) {
            if (world[i][j] == searchTo) {
                coordinates = { x: j, y: i, };
            }
        }
    }
    return coordinates;
}
;
//# sourceMappingURL=parseFile.js.map