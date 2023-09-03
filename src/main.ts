import "./style.css";

import { GameConstants } from "./constants";
import { State, Key, Action } from "./types";
import {
    ShiftBlockLeft,
    ShiftBlockRight,
    RotateBlock,
    Tick,
    reduceState,
    Restart,
} from "./state";
import { updateView } from "./view";

import { fromEvent, interval, merge, Subscription, Observable } from "rxjs";
import { map, filter, scan } from "rxjs/operators";
import { generateRandomPiece, initialize2DArray } from "./utils";

// Define initial state of game
const initialState: State = {
    upComingTetrisPiece: generateRandomPiece(1),
    currentTetrisPiece: generateRandomPiece(2),
    stationaryBlocks: initialize2DArray(
        GameConstants.GRID_HEIGHT,
        GameConstants.GRID_WIDTH,
        null
    ),
    level: 1,
    score: 0,
    highscore: 0,
    gameEnd: false,
    seed: 3,
} as const;

/**
 * Main game loop called on window load. See bottom of file.
 */
export function main() {
    // General Keypress stream
    const key$ = fromEvent<KeyboardEvent>(document, "keypress");

    /**
     * Function to filter stream by keycode
     * @param keyCode Key Code
     * @returns Stream of keypress by key code
     */
    const fromKey = (keyCode: Key) =>
        key$.pipe(
            filter(({ code }) => code === keyCode),
            filter(({ repeat }) => !repeat)
        );

    // Key A          Left
    const shiftBlockLeft$ = fromKey("KeyA").pipe(
        map((_) => new ShiftBlockLeft())
    );
    // Key D          Right
    const shiftBlockRight$ = fromKey("KeyD").pipe(
        map((_) => new ShiftBlockRight())
    );
    // Key S          Rotate
    const dropBlock$ = fromKey("KeyS").pipe(map((_) => new RotateBlock()));

    // Tick Rate      Tick
    const tick$ = interval(GameConstants.TICK_RATE_MS).pipe(
        map((elapsed) => new Tick())
    );

    const resetButton = document.getElementById(
        "restart-button"
    ) as HTMLElement;
    // Button Click   Reset
    const resetButton$ = fromEvent(resetButton, "click").pipe(
        map((_) => new Restart())
    );

    // Merge observables to action stream
    const action$: Observable<Action> = merge(
        tick$,
        shiftBlockLeft$,
        shiftBlockRight$,
        dropBlock$,
        resetButton$
    );

    // Accumulate actions to state
    const state$: Observable<State> = action$.pipe(
        scan(reduceState, initialState)
    );

    // Render state using subscription
    const subscription: Subscription = state$.subscribe(updateView());
}

// APPLICATION ENTRYPOINT
if (typeof window !== "undefined") {
    window.onload = () => {
        main();
    };
}
