"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_creator_1 = require("./map_creator");
const map_drawer_1 = require("./map_drawer");
const fire_escaper_1 = require("./fire_escaper");
function main() {
    let width = 6;
    let height = width;
    const creator = new map_creator_1.MapCreator(height, width);
    creator.createMap();
    const drawer = new map_drawer_1.MapDisplayer(creator.roomMap);
    // non-efficient ordering
    let directionOrder = ["left", "up", "down", "right"];
    // efficient ordering
    // let directionOrder: DirectionOrder = ["down", "right", "up", "left"];
    const entrance = creator.startPos;
    let escaper = new fire_escaper_1.FireEscaper(drawer, directionOrder);
    escaper.escapeTheRoom(entrance);
}
main();
