// Functions and objects that mutate State (CHANGE MODEL)
import { GameConstants } from "./constants";
import { State, Action, Block } from "./types"
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
    apply = (s: State): State => ({
        ...s,
        currentTetrisPiece: shiftPieceLeft(s.currentTetrisPiece)
    })
}

class ShiftBlockRight implements Action {
    constructor() { }
    /**
     * Shifts block to the right
     * @param s previous state
     * @returns rotated state
     */
    apply = (s: State): State => ({
        ...s,
        currentTetrisPiece: shiftPieceRight(s.currentTetrisPiece)
    })
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
        const newState: State = Tick.tetrisPieceBlocked(s) ? Tick.moveTetrisPieceToStationaryAndGenerateNewPiece(s): {
            ...s,
            currentTetrisPiece: shiftPieceDown(s.currentTetrisPiece)
        };
        return newState
    }

    static tetrisPieceBlocked(s: State): boolean {

        const tetrisPieceAtBottom = (): boolean => {
            return s.currentTetrisPiece.blocks.filter(block => block.y == GameConstants.GRID_HEIGHT - 1).length > 0
        }

        const tetrisPieceBlocked = (): boolean => {
            const allPieceAndStationaryBlocks = s.currentTetrisPiece.blocks.flatMap(b => s.stationaryBlocks.map<[Block, Block]>(r => ([b, r])));
            console.log(allPieceAndStationaryBlocks);
            const touchingBlocks = allPieceAndStationaryBlocks.filter(blockPair => blockPair[1].x == blockPair[0].x && blockPair[1].y - blockPair[0].y == 1);
            return touchingBlocks.length > 0;
        }
        return tetrisPieceAtBottom() || tetrisPieceBlocked();
    }

    static moveTetrisPieceToStationaryAndGenerateNewPiece(s: State): State {
        return {
            ...s,
            stationaryBlocks: [...s.stationaryBlocks, ...s.currentTetrisPiece.blocks],
            currentTetrisPiece: generateNewRandomPiece(s),
            blockCount: s.blockCount+4
        }
    }
}