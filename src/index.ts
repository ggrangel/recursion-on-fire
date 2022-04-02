import { MapCreator } from "./map_creator";
import { MapDrawer } from "./map_drawer";
import { FireEscaper, DirectionOrder } from "./fire_escaper";

function main() {
  let width: number = 6;
  let height: number = width;

  const creator: MapCreator = new MapCreator(height, width);

  const possiblePath = creator.createValidPath();

  const drawer = new MapDrawer(height, width, possiblePath);

  let entrance = possiblePath[0];

  // non-efficient ordering
  let directionOrder: DirectionOrder = ["left", "up", "down", "right"];
  // efficient ordering
  // let directionOrder: DirectionOrder = ["down", "right", "up", "left"];

  let escaper = new FireEscaper(entrance, drawer, directionOrder);

  escaper.escapeTheRoom(entrance);
}

main();
