"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("underscore"));
const assert = require("assert");
const inputReader = require("wait-console-input");
class Position {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    toString() {
        return `(${this.row}, ${this.col})`;
    }
}
class NextPosition extends Position {
    constructor(row, col, symbol) {
        super(row, col);
        this.symbol = symbol;
    }
}
class MapCreator {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.mapEdges = {
            topLeft: new Position(0, 0),
            topRight: new Position(0, this.width - 1),
            bottomLeft: new Position(this.height - 1, 0),
            bottomRight: new Position(this.height - 1, this.width - 1),
        };
        this.setStartPosition();
        this.setEndPosition();
    }
    ;
    isValidPosition(pos) {
        if (pos.row < 0 || pos.row >= this.height) {
            return false;
        }
        if (pos.col < 0 || pos.col >= this.width) {
            return false;
        }
        return true;
    }
    ;
    isValidStartingPosition(pos) {
        if (!this.isValidPosition(pos)) {
            return false;
        }
        if (pos === this.mapEdges["topLeft"] || pos === this.mapEdges["bottomLeft"]) {
            return false;
        }
        if (pos.col != 0 && (pos.row > 0 && pos.row < this.height - 1)) {
            return false;
        }
        return true;
    }
    ;
    isValidEndPosition(pos) {
        if (!this.isValidPosition(pos)) {
            return false;
        }
        if (pos === this.mapEdges["topRight"] || pos === this.mapEdges["bottomRight"]) {
            return false;
        }
        if (pos.col != this.width - 1 && (pos.row > 0 && pos.row < this.height - 1)) {
            return false;
        }
        return true;
    }
    ;
    setRandomStartPosition() {
        const maxColumn = Math.floor(this.width / 2);
        const column = Math.floor(Math.random() * maxColumn);
        let row;
        if (column === 0) {
            // row must be in [1, height - 2]
            row = Math.floor(Math.random() * (this.height - 2)) + 1;
        }
        else {
            // row must be either 0 or height -1
            row = _.sample([0, this.height - 1]);
        }
        this.startingPos = new Position(row, column);
        assert(this.isValidStartingPosition(this.startingPos), `Position ${this.startingPos.toString()} is not a valid starting point.`);
        return this.startingPos;
    }
    setRandomEndPosition() {
        const minColumn = Math.ceil(this.width / 2);
        const column = _.sample(_.range(minColumn, this.width));
        let row;
        if (column === this.height - 1) {
            // row must be in [1, height - 2]
            row = Math.floor(Math.random() * (this.height - 2)) + 1;
        }
        else {
            // row must be either 0 or height -1
            row = _.sample([0, this.height - 1]);
        }
        this.endingPos = new Position(row, column);
        assert(this.isValidEndPosition(this.endingPos), `Position ${this.endingPos.toString()} is not a valid ending point.`);
        return this.endingPos;
    }
    setStartPosition() {
        this.startingPos = new Position(0, 1);
        return this.startingPos;
    }
    setEndPosition() {
        this.endingPos = new Position(this.height - 1, this.width - 2);
        return this.endingPos;
    }
    createValidPath() {
        let path = [this.startingPos];
        // going down
        for (const row of _.range(1, this.height - 1)) {
            path.push(new Position(row, 1));
        }
        // going right
        for (const col of _.range(2, this.width - 1)) {
            path.push(new Position(this.height - 2, col));
        }
        path.push(this.endingPos);
        return path;
    }
}
var MapSymbols;
(function (MapSymbols) {
    MapSymbols["Wall"] = "-";
    MapSymbols["Fire"] = "x";
    MapSymbols["Start"] = "S";
    MapSymbols["End"] = "E";
    MapSymbols["Empty"] = " ";
    MapSymbols["UpArrow"] = "\uF431";
    MapSymbols["RightArrow"] = "\uF432";
    MapSymbols["DownArrow"] = "\uF433";
    MapSymbols["LeftArrow"] = "\uF434";
    MapSymbols["Cursor"] = "o";
    MapSymbols["Visited"] = "*";
})(MapSymbols || (MapSymbols = {}));
class MapDrawer {
    constructor(height, width, possiblePath) {
        this.width = width;
        this.height = height;
        this.possiblePath = possiblePath;
        this.mapObjects = new Array(this.height).fill(null).map(() => new Array(this.width).fill(null));
        this.setEntranceAndExit();
        this.setPossiblePath();
        this.setRandomWallAndFireAndEmpty();
    }
    setEntranceAndExit() {
        const entrance = this.possiblePath[0];
        this.mapObjects[entrance.row][entrance.col] = MapSymbols.Start;
        const exit = this.possiblePath[this.possiblePath.length - 1];
        this.mapObjects[exit.row][exit.col] = MapSymbols.End;
    }
    setPossiblePath() {
        for (const path of this.possiblePath.slice(1, this.possiblePath.length - 1)) {
            this.mapObjects[path.row][path.col] = MapSymbols.Empty;
        }
    }
    setWall() {
        this.mapObjects[0].fill(MapSymbols.Wall);
        this.mapObjects[this.height - 1].fill(MapSymbols.Wall);
        // TODO: find a way to fill column values
    }
    setWallAndFireAndEmpty() {
        let fire = true;
        for (const row of _.range(this.height)) {
            for (const col of _.range(this.width)) {
                if (this.mapObjects[row][col]) {
                    continue;
                }
                if (row === 0 || col === 0 || row === this.height - 1 || col === this.width - 1) {
                    this.mapObjects[row][col] = MapSymbols.Wall;
                }
                else if (fire) {
                    this.mapObjects[row][col] = MapSymbols.Fire;
                    fire = !fire;
                }
                else {
                    this.mapObjects[row][col] = MapSymbols.Empty;
                    fire = !fire;
                }
            }
        }
    }
    setRandomWallAndFireAndEmpty() {
        for (const row of _.range(this.height)) {
            for (const col of _.range(this.width)) {
                if (this.mapObjects[row][col]) {
                    continue;
                }
                if (row === 0 || col === 0 || row === this.height - 1 || col === this.width - 1) {
                    this.mapObjects[row][col] = MapSymbols.Wall;
                }
                else if (Math.random() < 0.5) {
                    this.mapObjects[row][col] = MapSymbols.Fire;
                }
                else {
                    this.mapObjects[row][col] = MapSymbols.Empty;
                }
            }
        }
    }
    displayRawMap() {
        for (const row of this.mapObjects) {
            console.log(row.join(" "));
        }
    }
    displayMap(curr_pos, symbol) {
        let mapCopy = this.mapObjects.map(function (arr) {
            return arr.slice();
        });
        mapCopy[curr_pos.row][curr_pos.col] = symbol;
        for (const row of mapCopy) {
            console.log(row.join(" "));
        }
    }
}
function escapeTheFire(drawer, entrance) {
    let roomMap = drawer.mapObjects;
    let visited = new Array(roomMap.length).fill(false).map(() => new Array(roomMap[0].length).fill(false));
    // seen[entrance.row][entrance.col] = true;
    let maxRowIdx = roomMap.length - 1;
    let maxColIdx = roomMap[0].length - 1;
    function recursionSolver(curr_pos, pos_candidate) {
        // console.log(pos.toString())
        let row = pos_candidate.row;
        let col = pos_candidate.col;
        console.clear();
        drawer.displayMap(curr_pos, pos_candidate.symbol);
        inputReader.wait('Press a button to continue');
        if (row < 0 || row > maxRowIdx || col < 0 || col > maxColIdx) {
            return false;
        }
        let objectInPosition = roomMap[row][col];
        if (objectInPosition === MapSymbols.Wall) {
            return false;
        }
        if (objectInPosition === MapSymbols.Fire) {
            return false;
        }
        if (visited[row][col]) {
            return false;
        }
        if (objectInPosition === MapSymbols.End) {
            return true;
        }
        visited[row][col] = true;
        roomMap[row][col] = MapSymbols.Visited;
        let next_pos = new Position(row, col);
        console.clear();
        drawer.displayMap(next_pos, MapSymbols.Cursor);
        inputReader.wait('Press a button to continue');
        let leftPos = new NextPosition(row, col - 1, MapSymbols.LeftArrow);
        let upperPos = new NextPosition(row - 1, col, MapSymbols.UpArrow);
        let rightPos = new NextPosition(row, col + 1, MapSymbols.RightArrow);
        let lowerPos = new NextPosition(row + 1, col, MapSymbols.DownArrow);
        return (recursionSolver(next_pos, leftPos) || recursionSolver(next_pos, upperPos) ||
            recursionSolver(next_pos, rightPos) || recursionSolver(next_pos, lowerPos));
        // return (recursionSolver(lowerPos) || recursionSolver(rightPos) ||
        //     recursionSolver(upperPos) || recursionSolver(leftPos))
    }
    return recursionSolver(entrance, new NextPosition(entrance.row, entrance.col, MapSymbols.Cursor));
}
function main() {
    let width = 7;
    let height = width;
    const creator = new MapCreator(height, width);
    const possiblePath = creator.createValidPath();
    console.log(possiblePath);
    const drawer = new MapDrawer(height, width, possiblePath);
    console.clear();
    drawer.displayRawMap();
    inputReader.wait('Press a button to continue');
    escapeTheFire(drawer, possiblePath[0]);
}
;
main();
