export { Constants, Viewport, Block }

// This file defines constants

const
    Viewport = {
        CANVAS_WIDTH: 200,
        CANVAS_HEIGHT: 400,
        PREVIEW_WIDTH: 160,
        PREVIEW_HEIGHT: 80,
    } as const,

    Constants = {
        TICK_RATE_MS: 500,
        GRID_WIDTH: 10,
        GRID_HEIGHT: 20,
    } as const,

    Block = {
        WIDTH: Viewport.CANVAS_WIDTH / Constants.GRID_WIDTH,
        HEIGHT: Viewport.CANVAS_HEIGHT / Constants.GRID_HEIGHT,
    };