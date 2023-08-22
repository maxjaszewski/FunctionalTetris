// Functions and objects that mutate State (CHANGE MODEL)
import { GameConstants } from "./constants";
import { State, Action, Block } from "./types"
import { shiftPieceDown } from "./utils/bodyUtils";
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
    apply = (s: State) => ({
        ...s
    })
}

class ShiftBlockRight implements Action {
    constructor() { }
    /**
     * Shifts block to the right
     * @param s previous state
     * @returns rotated state
     */
    apply = (s: State) => ({
        ...s
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
        if (Tick.tetrisPieceBlocked(s)){
            return s;
        }
        return {
            ...s,
            currentTetrisPiece: shiftPieceDown(s.currentTetrisPiece)
        }
    }

    static tetrisPieceBlocked(s: State): boolean {
        
        const tetrisPieceAtBottom = (): boolean => {
            return s.currentTetrisPiece.blocks.filter(block => block.y == GameConstants.GRID_HEIGHT - 1).length > 0
        }

        const tetrisPieceBlocked = (): boolean => {
            const allPieceAndStationaryBlocks = s.currentTetrisPiece.blocks.flatMap(b => s.stationaryBlocks.map<[Block, Block]>(r => ([b, r])))
            const touchingBlocks = allPieceAndStationaryBlocks.filter(blockPair => blockPair[0].y - blockPair[1].y == 1)
            return touchingBlocks.length > 0;
        }
        return tetrisPieceAtBottom() || tetrisPieceBlocked();
    }
}