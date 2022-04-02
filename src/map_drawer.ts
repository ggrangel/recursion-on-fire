import { MapSymbols, RoomMap } from "./map_creator";
import { Position } from "./position";

export class MapDisplayer {
  roomMap: RoomMap;

  constructor(roomMap: RoomMap) {
    this.roomMap = roomMap;
  }

  markSpotAsVisited(row: number, col: number) {
    this.roomMap[row][col] = MapSymbols.Visited;
  }

  displayMap(map: RoomMap | undefined = undefined) {
    if (map === undefined) {
      map = this.roomMap;
    }
    for (const row of map) {
      console.log(row.join(" "));
    }
  }

  updateAndDisplayMap(curr_pos: Position, symbol: MapSymbols): void {
    // deep copy of the map
    let mapCopy = this.roomMap.map(function (arr) {
      return arr.slice();
    });

    mapCopy[curr_pos.row][curr_pos.col] = symbol;

    this.displayMap(mapCopy);
  }
}
