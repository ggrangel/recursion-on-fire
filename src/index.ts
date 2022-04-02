import { MapCreator } from "./map_creator";
import { MapDisplayer } from "./map_drawer";
import { FireEscaper, DirectionOrder } from "./fire_escaper";

function main() {
  let width: number = 6;
  let height: number = width;

  const creator: MapCreator = new MapCreator(height, width);

  creator.createMap();

  const drawer = new MapDisplayer(creator.roomMap);

  // non-efficient ordering
  let directionOrder: DirectionOrder = ["left", "up", "down", "right"];
  // efficient ordering
  // let directionOrder: DirectionOrder = ["down", "right", "up", "left"];

  const entrance = creator.startPos;

  let escaper = new FireEscaper(drawer, directionOrder);

  escaper.escapeTheRoom(entrance);
}

main();
