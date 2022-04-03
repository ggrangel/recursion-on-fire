import * as _ from "underscore";
import { Room, Position } from "./position";

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
  room: Room;

  constructor(private height: number, private width: number) {
    this.room = new Room(height, width);
  }

  setStartPosition(): void {
    const startPosition: Position = { row: 0, col: 1 };
    this.room.setMapStart(startPosition);
  }

  setEndPosition(): void {
    const endPosisition: Position = {
      row: Math.floor(this.height / 2),
      col: this.width - 1,
    };
    this.room.setMapEnd(endPosisition);
  }

  setSolvablePath(): void {
    // going down
    for (const row of _.range(1, this.height - 1)) {
      this.room.setSymbolInMap({ row: row, col: 1 }, MapSymbols.Empty);
    }

    // going right
    for (const col of _.range(2, this.width - 1)) {
      this.room.setSymbolInMap(
        { row: this.height - 2, col: col },
        MapSymbols.Empty
      );
    }

    // going up
    for (const row of _.range(this.height - 3, this.room.mapEnd.row - 1, -1)) {
      this.room.setSymbolInMap(
        { row: row, col: this.width - 2 },
        MapSymbols.Empty
      );
    }
  }

  setUnsolvablePath(): void {
    const exitNeighbors: Position[] = this.room.getNeighborsOf(this.room.mapEnd)

    for (pos: Position in exit)

      if (!this.map[pos.row][pos.col]) {
        this.map[pos.row][pos.col] = MapSymbols.Fire;
      }
    }
  }

  setWall(): void {
    // Function not used
    this.map[0].fill(MapSymbols.Wall);
    this.map[this.height - 1].fill(MapSymbols.Wall);
    // TODO: find a way to fill column values
  }

  setRandomWallAndFireAndEmpty(): void {
    for (const row of _.range(this.height)) {
      for (const col of _.range(this.width)) {
        if (this.map[row][col]) {
          continue;
        }
        if (
          row === 0 ||
          col === 0 ||
          row === this.height - 1 ||
          col === this.width - 1
        ) {
          this.map[row][col] = MapSymbols.Wall;
        } else if (Math.random() < 0.5) {
          this.map[row][col] = MapSymbols.Fire;
        } else {
          this.map[row][col] = MapSymbols.Empty;
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
