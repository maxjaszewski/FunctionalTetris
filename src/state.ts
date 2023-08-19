// Functions and objects that mutate State (CHANGE MODEL)
import { State, Action } from "./types"

export { ShiftLeft, ShiftRight, Down, reduceState, Tick }

const
    /**
     * state transducer
     * @param s input State
     * @param action type of action to apply to the State
     * @returns a new State 
     */
    reduceState = (s: State, action: Action) => action.apply(s);


// Action types that trigger game state transitions
class ShiftLeft implements Action {
    constructor() { }
    /**
     * add to the ships torque in the required direction
     * @param s previous state
     * @returns rotated state
     */
    apply = (s: State) => ({
        ...s
    })
}

class ShiftRight implements Action {
    constructor() { }
    /**
     * add to the ships torque in the required direction
     * @param s previous state
     * @returns rotated state
     */
    apply = (s: State) => ({
        ...s
    })
}

class Down implements Action {
    constructor() { }
    /**
     * add to the ships torque in the required direction
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
     * interval tick: bodies move, collisions happen, bullets expire
     * @param s old State
     * @returns new State
     */
    apply(s: State): State {
        return {
            ...s
        }
    }
}