import { MapSymbols } from "./map_creator";

export interface Position {
  row: number;
  col: number;
}

export class Room {
  map: MapSymbols[][];
  mapStart: Position;
  mapEnd: Position;

  constructor(private height: number, private width: number) {
    this.map = new Array(this.height)
      .fill(null)
      .map(() => new Array(this.width).fill(null));
  }

  setMapStart(pos: Position) {
    this.mapStart = pos;
    this.setSymbolInMap(pos, MapSymbols.Start);
  }

  setMapEnd(pos: Position) {
    this.mapEnd = pos;
    this.setSymbolInMap(pos, MapSymbols.End);
  }

  setSymbolInMap(pos: Position, symbol: MapSymbols) {
    this.map[pos.row][pos.col] = symbol;
  }

  isPositionInRoomLimits(pos: Position) {
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

  getNeighborsOf(pos: Position) {
    const possibleNeighbors: Position[] = [];
    const validNeighbors: Position[] = [];

    possibleNeighbors.push({ row: pos.row, col: pos.col - 1 });
    possibleNeighbors.push({ row: pos.row, col: pos.col + 1 });
    possibleNeighbors.push({ row: pos.row - 1, col: pos.col });
    possibleNeighbors.push({ row: pos.row + 1, col: pos.col });

    for (const pos of possibleNeighbors) {
      if (this.isPositionInRoomLimits(pos)) {
        validNeighbors.push(pos);
      }
    }

    return validNeighbors;
  }
}

// export function isPositionInRoomLimits(pos: Position, room: RoomMap) {
//   const height: number = room.length;
//   const width: number = room[0].length;

//   if (pos.row >= 0 && pos.row < height && pos.col >= 0 && pos.col < width) {
//     return true;
//   }
//   return false;
// }
