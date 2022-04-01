import { MapCreator } from "./map_creator";
import { MapDrawer, MapSymbols } from "./map_drawer";
import { FireEscaper, NextPosition, DirectionOrder } from "./fire_escaper";

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
  // let directionOrder: Direction[] = [Direction.Down, Direction.Right, Direction.Up, Direction.Right]

  let escaper = new FireEscaper(entrance, drawer, directionOrder);

  escaper.recursionSolver(
    entrance,
    new NextPosition(entrance.row, entrance.col, MapSymbols.Cursor)
  );
}

main();
