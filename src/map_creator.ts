import * as _ from "underscore";
import Position from "./position";

export type RoomMap = MapSymbols[][];

export enum MapSymbols {
  Wall = "-",
  Fire = "x",
  Start = "S",
  End = "E",
  Empty = " ",
  UpArrow = "",
  RightArrow = "",
  DownArrow = "",
  LeftArrow = "",
  Cursor = "o",
  Visited = "*",
}

export class MapCreator {
  height: number;
  width: number;
  roomMap: RoomMap;
  startPos: Position;
  endPos: Position;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;

    this.roomMap = new Array(this.height)
      .fill(null)
      .map(() => new Array(this.width).fill(null));

    this.startPos = this.setStartPosition();
    this.endPos = this.setEndPosition();
  }

  setStartPosition(): Position {
    const startPosition: Position = new Position(0, 1);
    this.roomMap[startPosition.row][startPosition.col] = MapSymbols.Start;
    return startPosition;
  }

  setEndPosition(): Position {
    const endPos: Position = new Position(
      Math.floor(this.height / 2),
      this.width - 1
    );
    this.roomMap[endPos.row][endPos.col] = MapSymbols.End;
    return endPos;
  }

  setSolvablePath(): void {
    // going down
    for (const row of _.range(1, this.height - 1)) {
      this.roomMap[row][1] = MapSymbols.Empty;
    }

    // going right
    for (const col of _.range(2, this.width - 1)) {
      this.roomMap[this.height - 2][col] = MapSymbols.Empty;
    }

    // going up
    for (const row of _.range(this.height - 3, this.endPos.row - 1, -1)) {
      this.roomMap[row][this.width - 2] = MapSymbols.Empty;
    }
  }

  setUnsolvablePath(): void {
    const exitNeighbors: Position[] = [];

    exitNeighbors.push(new Position(this.endPos.row, this.endPos.col - 1));
    exitNeighbors.push(new Position(this.endPos.row, this.endPos.col + 1));
    exitNeighbors.push(new Position(this.endPos.row - 1, this.endPos.col));
    exitNeighbors.push(new Position(this.endPos.row + 1, this.endPos.col));

    for (const pos of exitNeighbors) {
      if (!pos.isPositionInRoomLimits(this.roomMap)) {
        continue;
      }
      if (!this.roomMap[pos.row][pos.col]) {
        this.roomMap[pos.row][pos.col] = MapSymbols.Fire;
      }
    }
  }

  setWall(): void {
    // Function not used
    this.roomMap[0].fill(MapSymbols.Wall);
    this.roomMap[this.height - 1].fill(MapSymbols.Wall);
    // TODO: find a way to fill column values
  }

  setRandomWallAndFireAndEmpty(): void {
    for (const row of _.range(this.height)) {
      for (const col of _.range(this.width)) {
        if (this.roomMap[row][col]) {
          continue;
        }
        if (
          row === 0 ||
          col === 0 ||
          row === this.height - 1 ||
          col === this.width - 1
        ) {
          this.roomMap[row][col] = MapSymbols.Wall;
        } else if (Math.random() < 0.5) {
          this.roomMap[row][col] = MapSymbols.Fire;
        } else {
          this.roomMap[row][col] = MapSymbols.Empty;
        }
      }
    }
  }

  createSolvableMap() {
    this.setSolvablePath();
    this.setRandomWallAndFireAndEmpty();
  }
  createUnSolvableMap() {
    this.setUnsolvablePath();
    this.setRandomWallAndFireAndEmpty();
  }
}
