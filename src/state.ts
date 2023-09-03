// Functions and objects that mutate State (CHANGE MODEL)
import { GameConstants } from "./constants";
import { State, Action, TetrisPiece, Matrix, Block } from "./types";
import {
    RNG,
    generateRandomPiece,
    shiftPieceDown,
    shiftPieceLeft,
    shiftPieceRight,
    getBottomMost,
    overlay,
    overlayConflict,
    pieceToMatrix,
    hasBlock,
    rotate,
    getLeftMost,
    getRightMost,
    isFullRow,
    initialize2DArray,
    blockConflict,
    blockCombine,
} from "./utils";
export {
    ShiftBlockLeft,
    ShiftBlockRight,
    RotateBlock,
    Restart,
    reduceState,
    Tick,
};

const /**
     * state transducer
     * @param s input State
     * @param action type of action to apply to the State
     * @returns a new State
     */
    reduceState = (s: State, action: Action) => action.apply(s);

/**
 * Shift Piece Left
 * @class
 */
class ShiftBlockLeft implements Action {
    constructor() {}
    /**
     * 1. Checks if action possible
     * 2. Shifts tetris piece left
     * @param s previous state
     * @returns shifted state
     */
    apply = (s: State): State => {
        // Skip if game has ended
        if (s.gameEnd) {
            return s;
        }

        // Shift Piece Left
        const pieceLeft: TetrisPiece = shiftPieceLeft(s.currentTetrisPiece);

        // Check if overlay conflict or out of bounds
        return !(
            overlayConflict(s.stationaryBlocks)(pieceToMatrix(pieceLeft))(
                blockConflict
            ) || pieceLeft.x + getLeftMost(pieceLeft.matrix)(hasBlock) < 0
        )
            ? {
                  ...s,
                  currentTetrisPiece: pieceLeft,
              }
            : s;
    };
}

/**
 * Shift Piece Right
 * @class
 */
class ShiftBlockRight implements Action {
    constructor() {}
    /**
     * Shifts block to the right
     * @param s previous state
     * @returns shifted state
     */
    apply = (s: State): State => {
        //Skip if game has ended
        if (s.gameEnd) {
            return s;
        }

        // Shift piece right
        const pieceRight: TetrisPiece = shiftPieceRight(s.currentTetrisPiece);

        // Check if overlay conflict or out of bounds
        return !(
            overlayConflict(s.stationaryBlocks)(pieceToMatrix(pieceRight))(
                blockConflict
            ) ||
            pieceRight.x + getRightMost(pieceRight.matrix)(hasBlock) >
                GameConstants.GRID_WIDTH - 1
        )
            ? {
                  ...s,
                  currentTetrisPiece: shiftPieceRight(s.currentTetrisPiece),
              }
            : s;
    };

    static canMoveRight = (s: State): boolean => {
        return true;
    };
}

/**
 * Rotate Piece
 * @class
 */
class RotateBlock implements Action {
    constructor() {}
    /**
     * Rotates a block
     * @param s previous state
     * @returns rotated state
     */
    apply = (s: State) => {
        // Skip if game has ended
        if (s.gameEnd) {
            return s;
        }

        // Rotate piece matrix
        const rotatedPiece: TetrisPiece = {
            ...s.currentTetrisPiece,
            matrix: rotate(s.currentTetrisPiece.matrix),
        };

        // Check if overlay conflict or out of bounds
        return !(
            rotatedPiece.x + getRightMost(rotatedPiece.matrix)(hasBlock) >
                GameConstants.GRID_WIDTH - 1 ||
            rotatedPiece.x + getLeftMost(rotatedPiece.matrix)(hasBlock) < 0 ||
            overlayConflict(s.stationaryBlocks)(pieceToMatrix(rotatedPiece))(
                blockConflict
            )
        )
            ? {
                  ...s,
                  currentTetrisPiece: rotatedPiece,
              }
            : s;
    };
}

/**
 * Game tick
 * @class
 */
class Tick implements Action {
    constructor() {}

    /**
     * interval tick: bodies move, collisions happen
     * @params old State
     * @returns new State
     */
    apply(s: State): State {
        // Skip if game has ended
        if (s.gameEnd) {
            return s;
        }

        /**
         * Check if tetris piece blocked
         * if yes
         *  1. Merge current piece to stationary blocks
         *  2. Replace current piece with upcoming piece
         *  3. Generate new upcoming piece
         * if no
         *  1. shift piece down
         */
        const newState: State = {
            ...s,
            upComingTetrisPiece: Tick.tetrisPieceBlocked(s)
                ? generateRandomPiece(s.seed)
                : s.upComingTetrisPiece,
            currentTetrisPiece: Tick.tetrisPieceBlocked(s)
                ? s.upComingTetrisPiece
                : shiftPieceDown(s.currentTetrisPiece),
            stationaryBlocks: Tick.tetrisPieceBlocked(s)
                ? overlay(s.stationaryBlocks)(
                      pieceToMatrix(s.currentTetrisPiece)
                  )(blockCombine)
                : s.stationaryBlocks,
            seed: RNG.hash(s.seed),
        };

        // Count number of full rows
        const numFullRows: number = newState.stationaryBlocks.filter((row) =>
            isFullRow(row)((block) => block != null)
        ).length;
        // Generate blank full rows to top fill stationary blocks
        const newTopRows: Matrix<Block> = initialize2DArray(
            numFullRows,
            GameConstants.GRID_WIDTH,
            null
        );
        // If rows being removed, filter out and top fill with blank rows
        const removeFullRows: State = {
            ...newState,
            score: newState.score + numFullRows,
            highscore: Math.max(
                newState.highscore,
                newState.score + numFullRows
            ),
            stationaryBlocks:
                numFullRows > 0
                    ? [
                          ...newTopRows,
                          ...newState.stationaryBlocks.filter(
                              (row) => !isFullRow(row)((block) => block != null)
                          ),
                      ]
                    : newState.stationaryBlocks,
        };

        // Set gameover flag if top row has blocks
        const gameOverState: State = {
            ...removeFullRows,
            gameEnd: hasBlock(removeFullRows.stationaryBlocks[0]),
        };

        // Return final state
        return gameOverState;
    }

    /**
     * Checks if a piece is blocked by ground or other pieces
     * @param s current state
     * @returns Is Piece blocked by ground or other pieces? T / F
     */
    static tetrisPieceBlocked = (s: State): boolean => {
        return (
            s.currentTetrisPiece.y +
                getBottomMost(s.currentTetrisPiece.matrix)(hasBlock) ==
                GameConstants.GRID_HEIGHT - 1 ||
            overlayConflict(s.stationaryBlocks)(
                pieceToMatrix(shiftPieceDown(s.currentTetrisPiece))
            )(blockConflict)
        );
    };
}

/**
 * Restart
 * @class
 */
class Restart implements Action {
    constructor() {}
    /**
     * Restarts gameplay
     * @param s previous state
     * @returns restarted state
     */
    apply = (s: State): State => {
        // Generate new upcoming and starting pieces
        // Clear out stationary blocks
        // Reset level to 1
        // Set game end flag to false
        return {
            ...s,
            currentTetrisPiece: generateRandomPiece(s.seed),
            upComingTetrisPiece: generateRandomPiece(s.seed + 1),
            stationaryBlocks: initialize2DArray(
                GameConstants.GRID_HEIGHT,
                GameConstants.GRID_WIDTH,
                null
            ),
            level: 1,
            score: 0,
            gameEnd: false,
        };
    };
}
