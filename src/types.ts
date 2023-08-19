export type { Key, Event, ViewType, State, Action }

// This file defines Typescript types and interfaces

/**
 * a string literal type for each key used in game control
 */
type Key = 'ArrowLeft' | 'ArrowRight' | 'ArrowDown';

/**
 * only input events are keydown and up
 */
type Event = 'keydown' | 'keyup'

/**
 * our game has the following view element types
 */
type ViewType = undefined; // TODO

/**
 * Game state
 */
type State = Readonly<{
    time: number,
    gameOver: boolean
}>

/**
 * Actions modify state
 */
interface Action {
    apply(s: State): State;
}