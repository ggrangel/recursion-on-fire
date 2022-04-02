import { RoomMap } from "./map_creator";

export class Position {
  row: number;
  col: number;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }

  toString() {
    return `(${this.row}, ${this.col})`;
  }
}

export function isPositionInRoomLimits(pos: Position, room: RoomMap) {
  const height: number = room.length;
  const width: number = room[0].length;

  if (pos.row >= 0 && pos.row < height && pos.col >= 0 && pos.col < width) {
    return true;
  }
  return false;
}
