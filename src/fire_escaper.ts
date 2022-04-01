import inputReader = require('wait-console-input')
import {Position} from "./position"
import {MapDrawer, MapSymbols} from  "./map_drawer"

export class NextPosition extends Position {
    symbol: MapSymbols;

    constructor(row: number, col: number, symbol: MapSymbols) {
        super(row, col);
        this.symbol = symbol;
    }
}

export enum Direction {
    Left = "Left",
    Right = "Right",
    Up = "Up",
    Down = "Down",
}

export type NextPositionFunc = (row: number, col: number) => NextPosition

export class FireEscaper {
    entrance: Position;
    drawer: MapDrawer;
    roomMap: MapSymbols[][];
    maxRowIdx: number;
    maxColIdx: number;
    visited: boolean[][];
    directions: Direction[];
    directionsFunctionsMap;

    constructor(entrance: Position, drawer: MapDrawer, directions: Direction[]) {
        this.entrance = entrance;
        this.drawer = drawer;
        this.roomMap = drawer.mapObjects;
    
        this.maxRowIdx = this.roomMap.length - 1;
        this.maxColIdx = this.roomMap[0].length - 1;

        this.directions = directions;

        this.directionsFunctionsMap = {
            [Direction.Left]: this.nextPositionLeft,
            [Direction.Right]: this.nextPositionRight,
            [Direction.Up]: this.nextPositionUp,
            [Direction.Down]: this.nextPositionDown,
        }

        this.visited = new Array(this.roomMap.length).fill(false).map(() => new Array(this.roomMap[0].length).fill(false))
    }

    consoleInteraction(pos: Position, symbol: MapSymbols) {
        console.clear()
        this.drawer.displayMap(pos, symbol)
        inputReader.wait('Press a button to continue')
    }

    nextPositionLeft(row: number, col: number) {
        return new NextPosition(row, col - 1, MapSymbols.LeftArrow)
    }

    nextPositionUp(row: number, col: number) {
        return new NextPosition(row - 1, col, MapSymbols.UpArrow)
    }

    nextPositionRight(row: number, col: number) {
        return new NextPosition(row, col + 1, MapSymbols.RightArrow)
    }

    nextPositionDown(row: number, col: number) {
        return new NextPosition(row + 1, col, MapSymbols.DownArrow)
    }

    getNextPositions(row: number, col: number): NextPosition[] {
        let nextPositions: NextPosition[] = [];
        
        for (const dir of this.directions) {
            let nextPositionFunc: NextPositionFunc = this.directionsFunctionsMap[dir];
            nextPositions.push(nextPositionFunc(row, col))
        }

        return nextPositions;
    }

    recursionSolver(curr_pos: Position, pos_candidate: NextPosition): boolean {
        let row: number = pos_candidate.row;
        let col: number = pos_candidate.col;

        this.consoleInteraction(curr_pos, pos_candidate.symbol)

        if (row < 0 || row > this.maxRowIdx || col < 0 || col > this.maxColIdx) {
            return false
        }

        let objectInPosition: MapSymbols = this.roomMap[row][col]

        if (objectInPosition === MapSymbols.Wall) {
            return false
        }
        if (objectInPosition === MapSymbols.Fire) {
            return false
        }
        if (this.visited[row][col]) {
            return false
        }
        if (objectInPosition === MapSymbols.End) {
            return true
        }

        this.visited[row][col] = true;
        this.roomMap[row][col] = MapSymbols.Visited;
        let next_pos = new Position(row, col)

        this.consoleInteraction(next_pos, MapSymbols.Cursor)

        let nextPositions = this.getNextPositions(row, col)

        return (this.recursionSolver(next_pos, nextPositions[0]) || this.recursionSolver(next_pos, nextPositions[1]) ||
                this.recursionSolver(next_pos, nextPositions[2]) || this.recursionSolver(next_pos, nextPositions[3]))
    }
}
