import { MapCreator } from "./map_creator";
import  MapDisplayer  from "./map_drawer";
import { FireEscaper, DirectionOrder } from "./fire_escaper";

function main() {
  const width: number = 6;
  const height: number = width;

  const creator: MapCreator = new MapCreator(height, width);

  if (Math.random() < 0.5) {
    creator.createSolvableMap();
  } else {
    creator.createUnSolvableMap();
  }

  const drawer = new MapDisplayer(creator.roomMap);

  // non-efficient ordering
  let directionOrder: DirectionOrder = ["left", "up", "down", "right"];
  // efficient ordering
  // let directionOrder: DirectionOrder = ["down", "right", "up", "left"];

  let escaper = new FireEscaper(drawer, creator.roomMap, directionOrder);

  escaper.escapeTheRoom(creator.startPos);
}

main();
