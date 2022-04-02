import * as _ from "underscore";
import { Position } from "./position";

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

export class MapDrawer {
  width: number;
  height: number;
  possiblePath: Position[];
  mapObjects: RoomMap;

  constructor(height: number, width: number, possiblePath: Position[]) {
    this.width = width;
    this.height = height;
    this.possiblePath = possiblePath;

    this.mapObjects = new Array(this.height)
      .fill(null)
      .map(() => new Array(this.width).fill(null));

    this.setEntranceAndExit();
    // this.setPossiblePath();
    this.setImpossiblePath();
    this.setRandomWallAndFireAndEmpty();
  }

  isPositionInRoomLimits(pos: Position): boolean {
    if (
      pos.row >= 0 &&
      pos.row < this.height &&
      pos.col >= 0 &&
      pos.col < this.width
    ) {
      return true;
    }
    return false;
  }

  setEntranceAndExit(): void {
    const entrance = this.possiblePath[0];
    this.mapObjects[entrance.row][entrance.col] = MapSymbols.Start;

    const exit = this.possiblePath[this.possiblePath.length - 1];
    this.mapObjects[exit.row][exit.col] = MapSymbols.End;
  }

  setPossiblePath(): void {
    for (const path of this.possiblePath.slice(
      1,
      this.possiblePath.length - 1
    )) {
      this.mapObjects[path.row][path.col] = MapSymbols.Empty;
    }
  }

  setImpossiblePath(): void {
    const exit: Position = this.possiblePath[this.possiblePath.length - 1];

    let exitNeighbors: Position[] = [];

    exitNeighbors.push(new Position(exit.row, exit.col - 1));
    exitNeighbors.push(new Position(exit.row, exit.col + 1));
    exitNeighbors.push(new Position(exit.row - 1, exit.col));
    exitNeighbors.push(new Position(exit.row + 1, exit.col));

    for (const pos of exitNeighbors) {
      if (!this.isPositionInRoomLimits(pos)) {
        continue;
      }
      if (!this.mapObjects[pos.row][pos.col]) {
        this.mapObjects[pos.row][pos.col] = MapSymbols.Fire;
      }
    }
  }

  setWall(): void {
    // Function not used
    this.mapObjects[0].fill(MapSymbols.Wall);
    this.mapObjects[this.height - 1].fill(MapSymbols.Wall);
    // TODO: find a way to fill column values
  }

  setWallAndFireAndEmpty(): void {
    // Math.random() has no way to set seed. Thus, I created this function to always draw the same map
    let fire = true;
    for (const row of _.range(this.height)) {
      for (const col of _.range(this.width)) {
        if (this.mapObjects[row][col]) {
          continue;
        }
        if (
          row === 0 ||
          col === 0 ||
          row === this.height - 1 ||
          col === this.width - 1
        ) {
          this.mapObjects[row][col] = MapSymbols.Wall;
        } else if (fire) {
          this.mapObjects[row][col] = MapSymbols.Fire;
          fire = !fire;
        } else {
          this.mapObjects[row][col] = MapSymbols.Empty;
          fire = !fire;
        }
      }
    }
  }

  setRandomWallAndFireAndEmpty(): void {
    for (const row of _.range(this.height)) {
      for (const col of _.range(this.width)) {
        if (this.mapObjects[row][col]) {
          continue;
        }
        if (
          row === 0 ||
          col === 0 ||
          row === this.height - 1 ||
          col === this.width - 1
        ) {
          this.mapObjects[row][col] = MapSymbols.Wall;
        } else if (Math.random() < 0.5) {
          this.mapObjects[row][col] = MapSymbols.Fire;
        } else {
          this.mapObjects[row][col] = MapSymbols.Empty;
        }
      }
    }
  }

  markSpotAsVisited(row: number, col: number) {
    this.mapObjects[row][col] = MapSymbols.Visited;
  }

  displayMap(map: RoomMap | undefined = undefined) {
    if (map === undefined) {
      map = this.mapObjects;
    }
    for (const row of map) {
      console.log(row.join(" "));
    }
  }

  updateAndDisplayMap(curr_pos: Position, symbol: MapSymbols): void {
    // deep copy of the map
    let mapCopy = this.mapObjects.map(function (arr) {
      return arr.slice();
    });

    mapCopy[curr_pos.row][curr_pos.col] = symbol;

    this.displayMap(mapCopy);
  }
}
