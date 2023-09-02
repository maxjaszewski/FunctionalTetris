export { GameConstants, Viewport, BlockConstants, OPiece, TPiece, LPiece, JPiece, SPiece, ZPiece, IPiece }

// This file defines constants

const
    Viewport = {
        CANVAS_WIDTH: 200,
        CANVAS_HEIGHT: 400,
        PREVIEW_WIDTH: 160,
        PREVIEW_HEIGHT: 80,
    } as const,

    GameConstants = {
        TICK_RATE_MS: 200,
        GRID_WIDTH: 10,
        GRID_HEIGHT: 20,
    } as const,

    BlockConstants = {
        WIDTH: Viewport.CANVAS_WIDTH / GameConstants.GRID_WIDTH,
        HEIGHT: Viewport.CANVAS_HEIGHT / GameConstants.GRID_HEIGHT,
    } as const,

    OPiece = {
        x: 0,
        y: 0,
        matrix: [
            [null, "red", "red", null],
            [null, "red", "red", null],
            [null, null, null, null],
            [null, null, null, null]
        ]
    } as const,

    JPiece = {
        x: 0,
        y: 0,
        matrix: [
            [null, "red", null, null],
            [null, "red", "red", "red"],
            [null, null, null, null],
            [null, null, null, null]
        ]
    } as const,

    LPiece = {
        x: 0,
        y: 0,
        matrix: [
            [null, null, null, "red"],
            [null, "red", "red", "red"],
            [null, null, null, null],
            [null, null, null, null]
        ]
    } as const,

    IPiece = {
        x: 0,
        y: 0,
        matrix: [
            [null, "red", null, null],
            [null, "red", null, null],
            [null, "red", null, null],
            [null, "red", null, null]
        ]
    } as const,

    SPiece = {
        x: 0,
        y: 0,
        matrix: [
            [null, null, "red", "red"],
            [null, "red", "red", null],
            [null, null, null, null],
            [null, null, null, null]
        ]
    } as const,

    ZPiece = {
        x: 0,
        y: 0,
        matrix: [
            [null, "red", "red", null],
            [null, null, "red", "red"],
            [null, null, null, null],
            [null, null, null, null]
        ]
    } as const,

    TPiece = {
        x: 0,
        y: 0,
        matrix: [
            [null, null, "red", null],
            [null, "red", "red", "red"],
            [null, null, null, null],
            [null, null, null, null]
        ]
    } as const

