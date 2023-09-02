// Functions and objects that mutate State (CHANGE MODEL)
import { GameConstants } from "./constants";
import { State, Action, Block, TetrisPiece } from "./types"
import { generateNewPiece, shiftPieceDown, shiftPieceLeft, shiftPieceRight } from "./utils/bodyUtils";
import { getBottomMost, overlay, overlayConflict, pieceToMatrix, hasBlock, rotate } from "./utils/matrixUtils";
export { ShiftBlockLeft, ShiftBlockRight, RotateBlock, reduceState, Tick }

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
        const pieceLeft: TetrisPiece = shiftPieceLeft(s.currentTetrisPiece);
        return ! overlayConflict(s.stationaryBlocks)(pieceToMatrix(pieceLeft)) ? 
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
        const pieceRight: TetrisPiece = shiftPieceRight(s.currentTetrisPiece);

        return ! overlayConflict(s.stationaryBlocks)(pieceToMatrix(pieceRight)) ? ({
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
    apply = (s: State) => ({
        ...s
    })
}

class Tick implements Action {
    constructor(public readonly elapsed: number) { }
    /** 
     * interval tick: bodies move, collisions happen
     * @params old State
     * @returns new State
     */


    apply(s: State): State {

        const newState: State = {
            ...s,
            currentTetrisPiece: Tick.tetrisPieceBlocked(s) ? generateNewPiece() : shiftPieceDown(s.currentTetrisPiece),
            stationaryBlocks: Tick.tetrisPieceBlocked(s) ? overlay(s.stationaryBlocks)(pieceToMatrix(s.currentTetrisPiece)) : s.stationaryBlocks
        }

        const gameOverState: State = {
            ...newState,
            gameEnd: hasBlock(newState.stationaryBlocks[0])   
        }

        return gameOverState;
    }

    static tetrisPieceBlocked = (s: State): boolean => {
        return ( s.currentTetrisPiece.y + getBottomMost(s.currentTetrisPiece.matrix) == GameConstants.GRID_HEIGHT - 1 ) || ( overlayConflict(s.stationaryBlocks)(pieceToMatrix(shiftPieceDown(s.currentTetrisPiece))) );
    }

    static isGameOver(s: State): boolean { 
        return s.stationaryBlocks[0].reduce((acc, curr) => acc || curr ? true : false, false) //TODO change all accumulating functions to use reduce instead of filter
    }

}