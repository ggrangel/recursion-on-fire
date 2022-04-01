import * as _ from 'underscore'
import {Position} from "./position"

export class MapCreator {
    height: number;
    width: number;
    startingPos: Position;
    endingPos: Position;

    constructor(height: number, width: number) {
        this.height = height;
        this.width = width;

        this.startingPos = this.setStartPosition();
        this.endingPos = this.setEndPosition();
    };

    setStartPosition(): Position {
        return new Position(0, 1)
    }

    setEndPosition(): Position {
        return new Position(Math.floor(this.height / 2), this.width - 1)
    }

    createValidPath() {
        let path: Position[] = [this.startingPos];

        // going down
        for (const row of _.range(1, this.height - 1)) {
            path.push(new Position(row, 1))
        }

        // going right
        for (const col of _.range(2, this.width - 1)) {
            path.push(new Position(this.height - 2, col))
        }

        // going up 
        for (const row of _.range(this.height - 3, this.endingPos.row - 1, -1)) {
            path.push(new Position(row, this.width - 2))
        }

        path.push(this.endingPos)

        return path
    }
}
