// Functions to render the view based on the model

export { updateView }

import { State } from "./types"
import { Viewport, Block } from "./constants";

/** Reusable rendering (side effects) function*/

/**
 * Displays a SVG element on the canvas. Brings to foreground.
 * @param elem SVG element to display
 */
const show = (elem: SVGGraphicsElement) => {
    elem.setAttribute("visibility", "visible");
    elem.parentNode!.appendChild(elem);
};

/**
 * Hides a SVG element on the canvas.
 * @param elem SVG element to hide
 */
const hide = (elem: SVGGraphicsElement) =>
    elem.setAttribute("visibility", "hidden");

/**
 * Creates an SVG element with the given properties.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/SVG/Element for valid
 * element names and properties.
 *
 * @param namespace Namespace of the SVG element
 * @param name SVGElement name
 * @param props Properties to set on the SVG element
 * @returns SVG element
 */
const createSvgElement = (
    namespace: string | null,
    name: string,
    props: Record<string, string> = {}
) => {
    const elem = document.createElementNS(namespace, name) as SVGElement;
    Object.entries(props).forEach(([k, v]) => elem.setAttribute(k, v));
    return elem;
};

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

        // document.getElementById can return null
        // so use optional chaining to safely access method on element
        const show = (id: string, condition: boolean) => ((e: HTMLElement | null) =>
            condition ? e?.classList.remove('hidden')
                : e?.classList.add('hidden'))(document.getElementById(id))

        /**
         * Renders the current state to the canvas.
         *
         * In MVC terms, this updates the View using the Model.
         *
         * @param s Current state
         */
        // Add blocks to the main grid canvas
        const cube = createSvgElement(svg.namespaceURI, "rect", {
            height: `${Block.HEIGHT}`,
            width: `${Block.WIDTH}`,
            x: "0",
            y: "0",
            style: "fill: green",
        });
        svg.appendChild(cube);
        const cube2 = createSvgElement(svg.namespaceURI, "rect", {
            height: `${Block.HEIGHT}`,
            width: `${Block.WIDTH}`,
            x: `${Block.WIDTH * (3 - 1)}`,
            y: `${Block.HEIGHT * (20 - 1)}`,
            style: "fill: red",
        });
        svg.appendChild(cube2);
        const cube3 = createSvgElement(svg.namespaceURI, "rect", {
            height: `${Block.HEIGHT}`,
            width: `${Block.WIDTH}`,
            x: `${Block.WIDTH * (4 - 1)}`,
            y: `${Block.HEIGHT * (20 - 1)}`,
            style: "fill: red",
        });
        svg.appendChild(cube3);

        // Add a block to the preview canvas
        const cubePreview = createSvgElement(preview.namespaceURI, "rect", {
            height: `${Block.HEIGHT}`,
            width: `${Block.WIDTH}`,
            x: `${Block.WIDTH * 2}`,
            y: `${Block.HEIGHT}`,
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
