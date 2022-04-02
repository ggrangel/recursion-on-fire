const inputReader = require("wait-console-input");
import { Position } from "./position";
import { MapDrawer, MapSymbols, RoomMap } from "./map_drawer";

export class NextPosition extends Position {
  symbol: MapSymbols;

  constructor(row: number, col: number, symbol: MapSymbols) {
    super(row, col);
    this.symbol = symbol;
  }
}

export type Direction = "left" | "right" | "up" | "down";

export type NextPositionFunc = (pos: Position) => NextPosition;

export type DirectionOrder = [Direction, Direction, Direction, Direction];

function nextPositionLeft(pos: Position): NextPosition {
  return new NextPosition(pos.row, pos.col - 1, MapSymbols.LeftArrow);
}

function nextPositionUp(pos: Position): NextPosition {
  return new NextPosition(pos.row - 1, pos.col, MapSymbols.UpArrow);
}

function nextPositionDown(pos: Position): NextPosition {
  return new NextPosition(pos.row + 1, pos.col, MapSymbols.DownArrow);
}

function nextPositionRight(pos: Position): NextPosition {
  return new NextPosition(pos.row, pos.col + 1, MapSymbols.RightArrow);
}

const directionsFunctionMap = {
  left: nextPositionLeft,
  up: nextPositionUp,
  right: nextPositionRight,
  down: nextPositionDown,
};

export class FireEscaper {
  entrance: Position;
  drawer: MapDrawer;
  roomMap: RoomMap;
  maxHeight: number;
  maxWidth: number;
  directions: DirectionOrder;

  constructor(
    entrance: Position,
    drawer: MapDrawer,
    directions: DirectionOrder
  ) {
    this.entrance = entrance;
    this.drawer = drawer;
    this.roomMap = drawer.mapObjects;

    this.maxHeight = this.roomMap.length;
    this.maxWidth = this.roomMap[0].length;

    this.directions = directions;
  }

  consoleInteraction(pos: Position, symbol: MapSymbols) {
    console.clear();
    this.drawer.updateAndDisplayMap(pos, symbol);
    inputReader.wait("Press a button to continue");
  }

  getNextPositions(pos: Position): NextPosition[] {
    let nextPositions: NextPosition[] = [];

    for (const dir of this.directions) {
      let nextPositionFunc: NextPositionFunc = directionsFunctionMap[dir];
      nextPositions.push(nextPositionFunc(pos));
    }

    return nextPositions;
  }

  escapeTheRoom(entrance: Position): void {
    console.clear();
    this.drawer.displayMap();
    inputReader.wait("Press a button to continue");

    let nextPositions = this.getNextPositions(entrance);

    if (
      this.recursionSolver(entrance, nextPositions[0]) ||
      this.recursionSolver(entrance, nextPositions[1]) ||
      this.recursionSolver(entrance, nextPositions[2]) ||
      this.recursionSolver(entrance, nextPositions[3])
    ) {
      console.log("You escaped the room.");
    } else {
      console.log("You died.");
    }
  }

  recursionSolver(curr_pos: Position, pos_candidate: NextPosition): boolean {
    let row: number = pos_candidate.row;
    let col: number = pos_candidate.col;

    this.consoleInteraction(curr_pos, pos_candidate.symbol);

    // checks if position is inside room
    if (!this.drawer.isPositionInRoomLimits(pos_candidate)) {
      return false;
    }

    let objectInPosition: MapSymbols = this.roomMap[row][col];

    if (
      objectInPosition === MapSymbols.Wall ||
      objectInPosition === MapSymbols.Fire ||
      objectInPosition === MapSymbols.Visited ||
      objectInPosition === MapSymbols.Start
    ) {
      return false;
    }
    if (objectInPosition === MapSymbols.End) {
      return true;
    }

    this.drawer.markSpotAsVisited(row, col);

    let valid_pos = pos_candidate;

    this.consoleInteraction(valid_pos, MapSymbols.Cursor);

    let nextPositions = this.getNextPositions(valid_pos);

    return (
      this.recursionSolver(valid_pos, nextPositions[0]) ||
      this.recursionSolver(valid_pos, nextPositions[1]) ||
      this.recursionSolver(valid_pos, nextPositions[2]) ||
      this.recursionSolver(valid_pos, nextPositions[3])
    );
  }
}
