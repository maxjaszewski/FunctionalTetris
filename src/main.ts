/**
 * Inside this file you will use the classes and functions from rx.js
 * to add visuals to the svg element in index.html, animate them, and make them interactive.
 *
 * Study and complete the tasks in observable exercises first to get ideas.
 *
 * Course Notes showing Asteroids in FRP: https://tgdwyer.github.io/asteroids/
 *
 * You will be marked on your functional programming style
 * as well as the functionality that you implement.
 *
 * Document your code!
 */

import "./style.css";

import { GameConstants, Viewport, BlockConstants, OPiece } from "./constants";
import { State, Key, Event, Action, Block, TetrisPiece } from "./types";
import { ShiftBlockLeft, ShiftBlockRight, RotateBlock, Tick, reduceState } from "./state"
import { updateView } from "./view";

import { fromEvent, interval, merge, Subscription, Observable } from "rxjs";
import { map, filter, scan } from "rxjs/operators";
import { initialize2DArray } from "./utils/matrixUtils";
import { generateRandomPiece } from "./utils/bodyUtils";

// Define initial state of game
const initialState: State = {
  upComingTetrisPiece: generateRandomPiece(1),
  currentTetrisPiece: generateRandomPiece(2),
  stationaryBlocks: initialize2DArray(GameConstants.GRID_HEIGHT, GameConstants.GRID_WIDTH),
  level: 1,
  score: 0,
  highscore: 0,
  gameEnd: false,
  seed: 3
} as const;

/**
 * Main game loop called on window load. See bottom of file.
 */
export function main() {

  // General Keypress stream
  const key$ = fromEvent<KeyboardEvent>(document, "keypress");

  // Function to filter keypress stream by key
  const fromKey = (keyCode: Key) =>
    key$.pipe(filter(({ code }) => code === keyCode));

  // Keypress stream per key, output actions
  const shiftBlockLeft$ = fromKey("KeyA").pipe(map(_ => new ShiftBlockLeft()));
  const shiftBlockRight$ = fromKey("KeyD").pipe(map(_ => new ShiftBlockRight()));
  const dropBlock$ = fromKey("KeyS").pipe(map(_ => new RotateBlock()));
  const tick$ = interval(GameConstants.TICK_RATE_MS).pipe(map(elapsed => new Tick(elapsed)));

  // Merge observables to action stream
  const action$: Observable<Action> = merge(tick$, shiftBlockLeft$, shiftBlockRight$, dropBlock$);
  // Accumulate actions in state
  const state$: Observable<State> = action$.pipe(scan(reduceState, initialState));
  // Render state using subscription
  const subscription: Subscription = state$.subscribe(updateView(() => subscription.unsubscribe()));

}

// Execute main function on load
if (typeof window !== "undefined") {
  window.onload = () => {
    main();
  };
}
