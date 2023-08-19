// This file defines Typescript types and interfaces


export type { Key, Event, ViewType, State, Action, Block, TetrisPiece }


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

type Block = Readonly<{
    id: string,
    x: number,
    y: number,
    style: BlockStyle
}>

/**
 * Tetris pieces
 */
type TetrisPiece  = Readonly<{
    blocks: ReadonlyArray<Block>
}>

/**
 * Game state
 */
type State = Readonly<{
    upComingTetrisPiece?: TetrisPiece, // Tetris piece may not exist at start or end of game
    currentTetrisPiece?: TetrisPiece, // Tetris piece may not exist at start or end of game
    stationaryBlocks: ReadonlyArray<Block>,
    level: number,
    score: number,
    highscore: number,
    gameEnd: boolean
}>

/**
 * Actions modify state
 */
interface Action {
    apply(s: State): State;
}
