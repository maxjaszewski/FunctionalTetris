// Functions to render the view based on the model

export { updateView }

import { State, Block } from "./types"
import { Viewport, BlockConstants } from "./constants";
import { show, hide } from "./util";


/**
 * Updates the view of a Block
 * 
 * @param block Update view for this block
 */

const updateBlockView = (rootSVG: HTMLElement) => (block: Block): void => {
    function createBlockView() {
        const v = createSvgElement(rootSVG.namespaceURI, "rect", {
            id: `${block.id}`,
            height: `${BlockConstants.HEIGHT}`,
            width: `${BlockConstants.WIDTH}`,
            x: `${block.x}`,
            y: `${block.y}`,
            style: `${block.style}`,
        });
        return v;
    }
    const b = document.getElementById(block.id) || createBlockView();
    Object.entries(block).forEach(([k, v]) => b.setAttribute(k, v));

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

        /**
         * Renders the current state to the canvas.
         *
         * In MVC terms, this updates the View using the Model.
         *
         * @param s Current state
         */
        // Add blocks to the main grid canvas
        const cube = createSvgElement(svg.namespaceURI, "rect", {
            height: `${BlockConstants.HEIGHT}`,
            width: `${BlockConstants.WIDTH}`,
            x: "0",
            y: "0",
            style: "fill: green",
        });
        svg.appendChild(cube);
        const cube2 = createSvgElement(svg.namespaceURI, "rect", {
            height: `${BlockConstants.HEIGHT}`,
            width: `${BlockConstants.WIDTH}`,
            x: `${BlockConstants.WIDTH * (3 - 1)}`,
            y: `${BlockConstants.HEIGHT * (20 - 1)}`,
            style: "fill: red",
        });
        svg.appendChild(cube2);
        const cube3 = createSvgElement(svg.namespaceURI, "rect", {
            height: `${BlockConstants.HEIGHT}`,
            width: `${BlockConstants.WIDTH}`,
            x: `${BlockConstants.WIDTH * (4 - 1)}`,
            y: `${BlockConstants.HEIGHT * (20 - 1)}`,
            style: "fill: red",
        });
        svg.appendChild(cube3);

        // Add a block to the preview canvas
        const cubePreview = createSvgElement(preview.namespaceURI, "rect", {
            height: `${BlockConstants.HEIGHT}`,
            width: `${BlockConstants.WIDTH}`,
            x: `${BlockConstants.WIDTH * 2}`,
            y: `${BlockConstants.HEIGHT}`,
            style: "fill: green",
        });
        preview.appendChild(cubePreview);


        if (s.gameEnd) {
            show(gameover);
        } else {
            hide(gameover);
        }
    }
}
