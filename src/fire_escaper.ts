const inputReader = require("wait-console-input");
import Position from "./position";
import MapDisplayer from "./map_drawer";
import { MapSymbols, RoomMap } from "./map_creator";

export class NextPosition extends Position {
  symbol: MapSymbols;

  constructor(row: number, col: number, symbol: MapSymbols) {
    super(row, col);
    this.symbol = symbol;
  }
}

export type Direction = "left" | "right" | "up" | "down";

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

type NextPositionFunc = typeof nextPositionUp;

const directionsFunctionMap = {
  left: nextPositionLeft,
  up: nextPositionUp,
  right: nextPositionRight,
  down: nextPositionDown,
};

export class FireEscaper {
  constructor(
    private drawer: MapDisplayer,
    private roomMap: RoomMap,
    private directions: DirectionOrder
  ) {}

  consoleInteraction(pos: Position, symbol: MapSymbols) {
    console.clear();
    this.drawer.updateAndDisplayMap(pos, symbol);
    inputReader.wait("Press a button to continue");
  }

  get4Neighbors(pos: Position): NextPosition[] {
    const nextPositions: NextPosition[] = [];

    for (const dir of this.directions) {
      const nextPositionFunc: NextPositionFunc = directionsFunctionMap[dir];
      nextPositions.push(nextPositionFunc(pos));
    }

    return nextPositions;
  }

  escapeTheRoom(entrance: Position): void {
    console.clear();
    this.drawer.displayMap();
    inputReader.wait("Press a button to continue");

    const nextPositions = this.get4Neighbors(entrance);

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
    this.consoleInteraction(curr_pos, pos_candidate.symbol);

    if (!pos_candidate.isPositionInRoomLimits(this.roomMap)) {
      return false;
    }

    const { row, col } = pos_candidate;

    const objectInPosition: MapSymbols = this.roomMap[row][col];

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

    const valid_pos = pos_candidate;

    this.consoleInteraction(valid_pos, MapSymbols.Cursor);

    const nextPositions = this.get4Neighbors(valid_pos);

    return (
      this.recursionSolver(valid_pos, nextPositions[0]) ||
      this.recursionSolver(valid_pos, nextPositions[1]) ||
      this.recursionSolver(valid_pos, nextPositions[2]) ||
      this.recursionSolver(valid_pos, nextPositions[3])
    );
  }
}
