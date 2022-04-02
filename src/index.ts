import { MapCreator, MapSolvable } from "./map_creator";
import { MapDisplayer } from "./map_drawer";
import { FireEscaper, DirectionOrder } from "./fire_escaper";

function main() {
  const width: number = 6;
  const height: number = width;
  let isSolvable: MapSolvable;

  if (Math.random() < 0.5) {
    isSolvable = "solvable";
  } else {
    isSolvable = "impossible";
  }

  const creator: MapCreator = new MapCreator(height, width);

  creator.createMap(isSolvable);

  const drawer = new MapDisplayer(creator.roomMap);

  // non-efficient ordering
  let directionOrder: DirectionOrder = ["left", "up", "down", "right"];
  // efficient ordering
  // let directionOrder: DirectionOrder = ["down", "right", "up", "left"];

  let escaper = new FireEscaper(drawer, creator.roomMap, directionOrder);

  escaper.escapeTheRoom(creator.startPos);
}

main();
