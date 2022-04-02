"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_creator_1 = require("./map_creator");
const map_drawer_1 = require("./map_drawer");
const fire_escaper_1 = require("./fire_escaper");
function main() {
    const width = 6;
    const height = width;
    let isSolvable;
    if (Math.random() < 0.5) {
        isSolvable = "solvable";
    }
    else {
        isSolvable = "impossible";
    }
    const creator = new map_creator_1.MapCreator(height, width);
    creator.createMap(isSolvable);
    const drawer = new map_drawer_1.MapDisplayer(creator.roomMap);
    // non-efficient ordering
    let directionOrder = ["left", "up", "down", "right"];
    // efficient ordering
    // let directionOrder: DirectionOrder = ["down", "right", "up", "left"];
    let escaper = new fire_escaper_1.FireEscaper(drawer, creator.roomMap, directionOrder);
    escaper.escapeTheRoom(creator.startPos);
}
main();
