// Functions and objects that mutate State (CHANGE MODEL)
import { GameConstants } from "./constants";
import { State, Action, Block, TetrisPiece, BlockMatrix } from "./types"
import { generatePiece, generateRandomPiece, shiftPieceDown, shiftPieceLeft, shiftPieceRight } from "./utils/bodyUtils";
import { getBottomMost, overlay, overlayConflict, pieceToMatrix, hasBlock, rotate, getLeftMost, getRightMost, isFullRow, initialize2DArray } from "./utils/matrixUtils";
import { RNG } from "./utils/randomUtils";
export { ShiftBlockLeft, ShiftBlockRight, RotateBlock, Restart, reduceState, Tick }

const
    /**
     * state transducer
     * @param s input State
     * @param action type of action to apply to the State
     * @returns a new State 
     */
    reduceState = (s: State, action: Action) => action.apply(s);


// Action types that trigger game state transitions
class ShiftBlockLeft implements Action {
    constructor() { }
    /**
     * Shifts block to the left
     * @param s previous state
     * @returns rotated state
     */
    apply = (s: State): State => {

        if (s.gameEnd) {
            return s
        }

        const pieceLeft: TetrisPiece = shiftPieceLeft(s.currentTetrisPiece);
        return !(overlayConflict(s.stationaryBlocks)(pieceToMatrix(pieceLeft)) || pieceLeft.x + getLeftMost(pieceLeft.matrix) < 0) ?
            ({
                ...s,
                currentTetrisPiece: pieceLeft
            }) : s;
    }

    static canMoveLeft = (s: State): boolean => {
        return true
    }
}

class ShiftBlockRight implements Action {
    constructor() { }
    /**
     * Shifts block to the right
     * @param s previous state
     * @returns rotated state
     */
    apply = (s: State): State => {

        if (s.gameEnd) {
            return s
        }

        const pieceRight: TetrisPiece = shiftPieceRight(s.currentTetrisPiece);

        return !(overlayConflict(s.stationaryBlocks)(pieceToMatrix(pieceRight)) || pieceRight.x + getRightMost(pieceRight.matrix) > GameConstants.GRID_WIDTH - 1) ? ({
            ...s,
            currentTetrisPiece: shiftPieceRight(s.currentTetrisPiece)
        }) : s;
    }

    static canMoveRight = (s: State): boolean => {
        return true;
    }
}

class RotateBlock implements Action {
    constructor() { }
    /**
     * Rotates a block
     * @param s previous state
     * @returns rotated state
     */
    apply = (s: State) => {

        if (s.gameEnd) {
            return s
        }

        const rotatedPiece: TetrisPiece = {
            ...s.currentTetrisPiece,
            matrix: rotate(s.currentTetrisPiece.matrix)
        }

        return {
            ...s,
            currentTetrisPiece: rotatedPiece
        }

    }
}

class Tick implements Action {
    constructor(public readonly elapsed: number) { }
    /** 
     * interval tick: bodies move, collisions happen
     * @params old State
     * @returns new State
     */


    apply(s: State): State {

        if (s.gameEnd) {
            return s
        }

        const newState: State = {
            ...s,
            upComingTetrisPiece: Tick.tetrisPieceBlocked(s) ? generateRandomPiece(s.seed) : s.upComingTetrisPiece,
            currentTetrisPiece: Tick.tetrisPieceBlocked(s) ? s.upComingTetrisPiece : shiftPieceDown(s.currentTetrisPiece),
            stationaryBlocks: Tick.tetrisPieceBlocked(s) ? overlay(s.stationaryBlocks)(pieceToMatrix(s.currentTetrisPiece)) : s.stationaryBlocks,
            seed: RNG.hash(s.seed)
        }

        const numFullRows: number = newState.stationaryBlocks.filter(row => isFullRow(row)).length;
        const newTopRows: BlockMatrix = Array.from({ length: numFullRows }, () => Array.from({ length: GameConstants.GRID_WIDTH }, () => null))
        const removeFullRows: State = {
            ...newState,
            score: newState.score + numFullRows,
            highscore: Math.max(newState.highscore, newState.score + numFullRows),
            stationaryBlocks: numFullRows > 0 ? [...newTopRows, ...newState.stationaryBlocks.filter(row => !(isFullRow(row)))] : newState.stationaryBlocks
        }

        const gameOverState: State = {
            ...removeFullRows,
            gameEnd: hasBlock(removeFullRows.stationaryBlocks[0])
        }

        return gameOverState;
    }

    static tetrisPieceBlocked = (s: State): boolean => {
        return (s.currentTetrisPiece.y + getBottomMost(s.currentTetrisPiece.matrix) == GameConstants.GRID_HEIGHT - 1) || (overlayConflict(s.stationaryBlocks)(pieceToMatrix(shiftPieceDown(s.currentTetrisPiece))));
    }

    static isGameOver(s: State): boolean {
        return s.stationaryBlocks[0].reduce((acc, curr) => acc || curr ? true : false, false) //TODO change all accumulating functions to use reduce instead of filter
    }

}

class Restart implements Action {
    constructor() { }
    /**
     * Shifts block to the left
     * @param s previous state
     * @returns rotated state
     */
    apply = (s: State): State => {
        return {
            ...s,
            currentTetrisPiece: generateRandomPiece(s.seed),
            upComingTetrisPiece: generateRandomPiece(s.seed + 1),
            stationaryBlocks: initialize2DArray(GameConstants.GRID_HEIGHT, GameConstants.GRID_WIDTH),
            level: 1,
            gameEnd: false
        }
    }
}