import { RoomMap } from "./map_creator";

class Position {
  constructor(public row: number, public col: number) {}

  toString() {
    return `(${this.row}, ${this.col})`;
  }

  isPositionInRoomLimits(room: RoomMap) {
  const height: number = room.length;
  const width: number = room[0].length;

  if (this.row >= 0 && this.row < height && this.col >= 0 && this.col < width) {
    return true;
  }
  return false;

  }
}

export default Position;
