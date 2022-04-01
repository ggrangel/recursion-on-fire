"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_creator_1 = require("./map_creator");
const map_drawer_1 = require("./map_drawer");
const fire_escaper_1 = require("./fire_escaper");
function main() {
    let width = 6;
    let height = width;
    const creator = new map_creator_1.MapCreator(height, width);
    const possiblePath = creator.createValidPath();
    const drawer = new map_drawer_1.MapDrawer(height, width, possiblePath);
    let entrance = possiblePath[0];
    // non-efficient ordering
    let directionOrder = [fire_escaper_1.Direction.Left, fire_escaper_1.Direction.Up, fire_escaper_1.Direction.Down, fire_escaper_1.Direction.Right];
    // efficient ordering
    // let directionOrder: Direction[] = [Direction.Down, Direction.Right, Direction.Up, Direction.Right]  
    let escaper = new fire_escaper_1.FireEscaper(entrance, drawer, directionOrder);
    escaper.recursionSolver(entrance, new fire_escaper_1.NextPosition(entrance.row, entrance.col, map_drawer_1.MapSymbols.Cursor));
}
main();
