export { GameConstants, Viewport, BlockConstants };

// This file defines constants

const Viewport = {
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
    } as const;
