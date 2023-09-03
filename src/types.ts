// This file defines Typescript types and interfaces

export type {
    Key,
    Event,
    State,
    Action,
    Block,
    TetrisPiece,
    Matrix,
    BlockMatrix
};

/**
 * Block fill styles
 */
type BlockStyle = "fill: red" | "fill: green";

/**
 * a string literal type for each key used in game control
 */
type Key = "KeyS" | "KeyA" | "KeyD";

/**
 * only input events are keydown and up
 */
type Event = "keydown" | "keyup" | "keypress";


/**
 * Block
 * null: no block
 * string: colour of block
 */
type Block = string | null;

/**
 * Matrix representation
 */
type Matrix<T> = ReadonlyArray<ReadonlyArray<T>>;

/**
 * Matrix representation of blocks
 */
type BlockMatrix = Matrix<Block>;

/**
 * Tetris pieces
 * x: x-coord of top left corner
 * y: y-coord of top left corner
 * matrix: 4x4 BlockMatrix of piece
 */
type TetrisPiece = Readonly<{
    x: number;
    y: number;
    matrix: BlockMatrix;
}>;

/**
 * Game state
 */
type State = Readonly<{
    upComingTetrisPiece: TetrisPiece;
    currentTetrisPiece: TetrisPiece;
    stationaryBlocks: BlockMatrix;
    level: number;
    score: number;
    highscore: number;
    gameEnd: boolean;
    seed: number;
}>;

/**
 * Actions modify state
 */
interface Action {
    apply(s: State): State;
}
