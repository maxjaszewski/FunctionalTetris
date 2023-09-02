// Functions to render the view based on the model

export { updateView }

import { State, Block, BlockMatrix } from "./types"
import { Viewport, BlockConstants } from "./constants";
import { show, hide, createSvgElement } from "./utils/htmlUtils";
import { isNotNullOrUndefined } from "./utils/jsUtils";
import { pieceToMatrix } from "./utils/matrixUtils";


/**
 * Updates the view of a Block
 * 
 * @param block Update view for this block
 */

const clearSVGBoard = (rootSVG: HTMLElement): void => {
    Array.from(rootSVG.children).filter(element => element.classList.contains("block")).forEach(block => rootSVG.removeChild(block));   

}


const paintMatrix = (rootSVG: HTMLElement) => (matrix: BlockMatrix): void => {
    matrix.forEach((row, rowNumber) => row.forEach((block, columnNumber) => createBlockView(rootSVG)(block)(rowNumber)(columnNumber)));
}
/**
 * Updates the view of a Block
 * 
 * @param block Update view for this block
 */

const createBlockView = (rootSVG: HTMLElement) => (block: Block) => (row: number) => (column: number): void => {
    if ( block != null ) {
        function appendNewRect() {
            const v = createSvgElement(rootSVG.namespaceURI, "rect");
            rootSVG.appendChild(v)
            return v;
        }
        const b = appendNewRect();
        b.setAttribute("height", `${BlockConstants.HEIGHT}`);
        b.setAttribute("width", `${BlockConstants.WIDTH}`);
        b.setAttribute("x", `${BlockConstants.WIDTH * column}`);
        b.setAttribute("y", `${BlockConstants.HEIGHT * row}`);
        b.setAttribute("style", `fill: ${block}`);
        b.setAttribute("class", "block");
    }
    
}

/**
 * Renders the current state to the canvas.
 *
 * In MVC terms, this updates the View using the Model.
 *
 * @param onFinish a callback function to be applied when the game ends.  For example, to clean up subscriptions.
 * @param s the current game model State
 * @returns void
 */
function updateView(onFinish: () => void) {
    return function (s: State): void {
        // Canvas elements
        const svg = document.querySelector("#svgCanvas") as SVGGraphicsElement &
            HTMLElement;
        const preview = document.querySelector("#svgPreview") as SVGGraphicsElement &
            HTMLElement;
        const gameover = document.querySelector("#gameOver") as SVGGraphicsElement &
            HTMLElement;
        const container = document.querySelector("#main") as HTMLElement;

        svg.setAttribute("height", `${Viewport.CANVAS_HEIGHT}`);
        svg.setAttribute("width", `${Viewport.CANVAS_WIDTH}`);
        preview.setAttribute("height", `${Viewport.PREVIEW_HEIGHT}`);
        preview.setAttribute("width", `${Viewport.PREVIEW_WIDTH}`);

        // Text fields
        const levelText = document.querySelector("#levelText") as HTMLElement;
        const scoreText = document.querySelector("#scoreText") as HTMLElement;
        const highScoreText = document.querySelector("#highScoreText") as HTMLElement;
        levelText.textContent = s.level.toString();
        scoreText.textContent = s.score.toString();
        highScoreText.textContent = s.highscore.toString();


        // Clear Board
        clearSVGBoard(svg);
        clearSVGBoard(preview);
        // Paint stationary blocks
        const svgPaint = paintMatrix(svg);
        svgPaint(s.stationaryBlocks);
        svgPaint(pieceToMatrix(s.currentTetrisPiece));


        const previewPaint = paintMatrix(preview);
        previewPaint(s.upComingTetrisPiece.matrix)


        if (s.gameEnd) {
            show(gameover);
            //onFinish();
        } else {
            hide(gameover);
        }
    }
}

