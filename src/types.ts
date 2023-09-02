// This file defines Typescript types and interfaces


export type { Key, Event, ViewType, State, Action, Block, TetrisPiece, BlockMatrix }


/**
 * Block fill styles
 */
type BlockStyle = "fill: red" | "fill: green"

/**
 * a string literal type for each key used in game control
 */
type Key = "KeyS" | "KeyA" | "KeyD";

/**
 * only input events are keydown and up
 */
type Event = 'keydown' | 'keyup' | "keypress";

/**
 * our game has the following view element types
 */
type ViewType = undefined; // TODO

type Block = string | null;

type BlockMatrix = ReadonlyArray<ReadonlyArray<Block>>;

/**
 * Tetris pieces
 */
type TetrisPiece = Readonly<{
    x: number,
    y: number,
    matrix: BlockMatrix
}>;

/**
 * Game state
 */
type State = Readonly<{
    upComingTetrisPiece: TetrisPiece, // Tetris piece may not exist at start or end of game
    currentTetrisPiece: TetrisPiece, // Tetris piece may not exist at start or end of game
    stationaryBlocks: BlockMatrix,
    level: number,
    score: number,
    highscore: number,
    gameEnd: boolean,
    seed: number
}>

/**
 * Actions modify state
 */
interface Action {
    apply(s: State): State;
}