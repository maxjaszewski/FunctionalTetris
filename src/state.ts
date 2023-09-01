// Functions and objects that mutate State (CHANGE MODEL)
import { GameConstants } from "./constants";
import { State, Action, Block, SortedBlocks } from "./types"
import { generateNewRandomPiece, shiftPieceDown, shiftPieceLeft, shiftPieceRight } from "./utils/bodyUtils";
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
        return ShiftBlockLeft.canMoveLeft(s) ? 
         ({
            ...s,
            currentTetrisPiece: shiftPieceLeft(s.currentTetrisPiece)
        }) : s;
    }

    static canMoveLeft = (s: State): boolean => {
        const blockedByBoundary: boolean = s.currentTetrisPiece.blocks.filter((block) => block.x == 0).length > 0;
        const allPieceAndStationaryBlocks = s.currentTetrisPiece.blocks.flatMap(b => s.stationaryBlocks.map<[Block, Block]>(r => ([b, r])));
        const blockedbyStationaryBlock: boolean = allPieceAndStationaryBlocks.filter(blockPair => blockPair[0].x == blockPair[1].x+1 && blockPair[0].y == blockPair[1].y).length > 0;
        return !blockedByBoundary && !blockedbyStationaryBlock;
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
        return ShiftBlockRight.canMoveRight(s) ? ({
        ...s,
        currentTetrisPiece: shiftPieceRight(s.currentTetrisPiece)
        }) : s;
    }

    static canMoveRight = (s: State): boolean => {
        const blockedByBoundary: boolean = s.currentTetrisPiece.blocks.filter((block) => block.x == GameConstants.GRID_WIDTH-1).length > 0;
        const allPieceAndStationaryBlocks = s.currentTetrisPiece.blocks.flatMap(b => s.stationaryBlocks.map<[Block, Block]>(r => ([b, r])));
        const blockedbyStationaryBlock: boolean = allPieceAndStationaryBlocks.filter(blockPair => blockPair[0].x == blockPair[1].x-1 && blockPair[0].y == blockPair[1].y).length > 0;
        return !blockedByBoundary && !blockedbyStationaryBlock;
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

        // If Piece is halted, add blocks to stationary blocks and generate a new block
        const newStateHalted: State = Tick.tetrisPieceAtBottom(s) || Tick.tetrisPieceBlocked(s) ? Tick.moveTetrisPieceToStationaryAndGenerateNewPiece(s): {
            ...s,
            currentTetrisPiece: shiftPieceDown(s.currentTetrisPiece)
        };

        // If row is full, remove all blocks in the row and increment score
        const newStateClearRows = Tick.checkFullRows(newStateHalted);

        // Game over if block height for any column in new state is greater than grid height

        return Tick.isGameOver(newStateClearRows) ? {...newStateClearRows, gameEnd: true} : newStateClearRows;
    }

    static tetrisPieceAtBottom = (s: State): boolean => {
        return s.currentTetrisPiece.blocks.filter(block => block.y == GameConstants.GRID_HEIGHT - 1).length > 0
    }

    static tetrisPieceBlocked = (s: State): boolean => {
        const allPieceAndStationaryBlocks = s.currentTetrisPiece.blocks.flatMap(b => s.stationaryBlocks.map<[Block, Block]>(r => ([b, r])));
        const touchingBlocks = allPieceAndStationaryBlocks.filter(blockPair => blockPair[1].x == blockPair[0].x && blockPair[1].y - blockPair[0].y == 1);
        return touchingBlocks.length > 0;
    }

    static moveTetrisPieceToStationaryAndGenerateNewPiece(s: State): State {
        return {
            ...s,
            stationaryBlocks: [...s.stationaryBlocks, ...s.currentTetrisPiece.blocks],
            currentTetrisPiece: generateNewRandomPiece(s),
            blockCount: s.blockCount+4
        }
    }

    static isGameOver(s: State): boolean { 
        return s.stationaryBlocks.reduce((acc, curr) => curr.y == 0 || acc, false); //TODO change all accumulating functions to use reduce instead of filter
    }

    static checkFullRows(s: State): State {
        const blocksSortedIntoRows = Object.values(s.stationaryBlocks.reduce((acc, curr) => {
            const index: number = curr.y;
            let newAcc = {...acc};
            !newAcc[index] ? newAcc[index] = [] : newAcc;
            newAcc[index] = [...newAcc[index], curr];
            return newAcc as SortedBlocks;
          }, {} as SortedBlocks));
        const unfilledRows = blocksSortedIntoRows.filter(row => row.length < GameConstants.GRID_WIDTH);
        const filledRows = blocksSortedIntoRows.filter(row => row.length == GameConstants.GRID_WIDTH);
        const newScore = filledRows.length > 0 ? s.score + 1: s.score;
        return {
            ...s,
            score: newScore, //TODO check tetris score method
            highscore: newScore > s.highscore ? newScore : s.highscore,
            stationaryBlocks: unfilledRows.flat(),
            removeBlocks: filledRows.flat()
        } as State

    }   

}