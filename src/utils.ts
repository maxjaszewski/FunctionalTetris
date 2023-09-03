import { GameConstants } from "./constants";
import { Block, BlockMatrix, Matrix, TetrisPiece } from "./types";

// Can we change the readme please to avoid having all util functions in one
// file?
// - Cheers, Max

export {
    RNG,
    shiftPieceDown,
    shiftPieceLeft,
    shiftPieceRight,
    generatePiece,
    generateRandomPiece,
    attr,
    show,
    hide,
    createSvgElement,
    initialize2DArray,
    pieceToMatrix,
    overlay,
    overlayConflict,
    getLeftMost,
    getRightMost,
    getTopMost,
    getBottomMost,
    hasBlock,
    transpose,
    rotate,
    isFullRow,
};

// **************************************************************************
// **************************************************************************
// **************************************************************************
// **************************************************************************
// ***********************   RANDOM FUNCTIONS   *****************************
// **************************************************************************
// **************************************************************************
// **************************************************************************
// **************************************************************************

/**
 * A random number generator which provides two pure functions
 * `hash` and `scaleToRange`.  Call `hash` repeatedly to generate the
 * sequence of hashes.
 */
abstract class RNG {
    // LCG using GCC's constants
    private static m = 0x80000000; // 2**31
    private static a = 1103515245;
    private static c = 12345;

    /**
     * Call `hash` repeatedly to generate the sequence of hashes.
     * @param seed
     * @returns a hash of the seed
     */
    public static hash = (seed: number) => (RNG.a * seed + RNG.c) % RNG.m;

    /**
 h    * Takes hash value and scales it to the range [-1, 1]
     */
    public static scale = (hash: number) => (2 * hash) / (RNG.m - 1) - 1;

    public static discrete =
        (low: number) =>
        (high: number) =>
        (hash: number): number =>
            Math.floor((hash / (RNG.m - 1)) * (high - low) + low);
}

// **************************************************************************
// **************************************************************************
// **************************************************************************
// **************************************************************************
// **********************   TETRIS PIECE FUNCTIONS    ***********************
// **************************************************************************
// **************************************************************************
// **************************************************************************
// **************************************************************************

const shiftPieceDown = (tetrisPiece: TetrisPiece): TetrisPiece => {
    return {
        ...tetrisPiece,
        y: tetrisPiece.y + 1,
    };
};

const shiftPieceLeft = (tetrisPiece: TetrisPiece): TetrisPiece => {
    return {
        ...tetrisPiece,
        x: tetrisPiece.x - 1,
    };
};

const shiftPieceRight = (tetrisPiece: TetrisPiece): TetrisPiece => {
    return {
        ...tetrisPiece,
        x: tetrisPiece.x + 1,
    };
};

const generateRandomPiece = (seed: number) => {
    const scaleRGB = RNG.discrete(0)(255);
    const scalePiece = RNG.discrete(1)(8);
    const pieceID: number = scalePiece(RNG.hash(seed));
    const rgb1: number = RNG.hash(seed + 1);
    const rgb2: number = RNG.hash(seed + 2);
    const rgb3: number = RNG.hash(seed + 3);
    return generatePiece(pieceID)(
        `rgb(${scaleRGB(rgb1)}, ${scaleRGB(rgb2)}, ${scaleRGB(rgb3)})`
    );
};

const generatePiece =
    (piece: number) =>
    (colour: Block): TetrisPiece => {
        return {
            x: 3,
            y: -3,
            matrix: generatePieceMatrix(piece)(colour),
        };
    };

const generatePieceMatrix =
    (piece: number) =>
    (colour: Block): BlockMatrix => {
        switch (piece) {
            case 1: //O
                return [
                    [null, null, null, null],
                    [null, colour, colour, null],
                    [null, colour, colour, null],
                    [null, null, null, null],
                ];
            case 2: //J
                return [
                    [null, null, null, null],
                    [null, colour, null, null],
                    [null, colour, colour, colour],
                    [null, null, null, null],
                ];
            case 3: //L
                return [
                    [null, null, null, null],
                    [null, null, null, colour],
                    [null, colour, colour, colour],
                    [null, null, null, null],
                ];
            case 4: //I
                return [
                    [null, colour, null, null],
                    [null, colour, null, null],
                    [null, colour, null, null],
                    [null, colour, null, null],
                ];
            case 5: //S
                return [
                    [null, null, null, null],
                    [null, null, colour, colour],
                    [null, colour, colour, null],
                    [null, null, null, null],
                ];
            case 6: //Z
                return [
                    [null, null, null, null],
                    [null, colour, colour, null],
                    [null, null, colour, colour],
                    [null, null, null, null],
                ];
            default: //T
                return [
                    [null, null, null, null],
                    [null, null, colour, null],
                    [null, colour, colour, colour],
                    [null, null, null, null],
                ];
        }
    };

// **************************************************************************
// **************************************************************************
// **************************************************************************
// **************************************************************************
// *************************   HTML FUNCTIONS   *****************************
// **************************************************************************
// **************************************************************************
// **************************************************************************
// **************************************************************************

/**
 * set a number of attributes on an Element at once
 * @param e the Element
 * @param o a property bag
 */
const attr = (e: Element, o: { [p: string]: unknown }) => {
    for (const k in o) e.setAttribute(k, String(o[k]));
};

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

// **************************************************************************
// **************************************************************************
// **************************************************************************
// **************************************************************************
// *************************   MATRIX FUNCTIONS   ***************************
// **************************************************************************
// **************************************************************************
// **************************************************************************
// **************************************************************************

function initialize2DArray(rows: number, cols: number) {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols })
    );
}

function pieceToMatrix(tetrisPiece: TetrisPiece): BlockMatrix {
    const numRows = tetrisPiece.matrix.length;
    const numCols = tetrisPiece.matrix[0].length;
    const x = tetrisPiece.x;
    const y = tetrisPiece.y;

    const baseGrid = initialize2DArray(
        GameConstants.GRID_HEIGHT,
        GameConstants.GRID_HEIGHT
    );
    return baseGrid.map((currRow, row) =>
        currRow.map((_, col) =>
            row >= y && row < y + numRows && col >= x && col < x + numCols
                ? tetrisPiece.matrix[row - y][col - x]
                : null
        )
    );
}

function hasBlock(matrixRow: ReadonlyArray<Block>): boolean {
    return matrixRow.reduce((accum, curr) => accum || curr != null, false);
}

function isFullRow(matrixRow: ReadonlyArray<Block>): boolean {
    return matrixRow.reduce((accum, curr) => {
        return accum && curr != null;
    }, true);
}

const overlayConflict: (a: BlockMatrix) => (b: BlockMatrix) => boolean =
    (matrixA) => (matrixB) => {
        return matrixA.reduce(
            (accum, currRow, rowNum) =>
                accum ||
                currRow.reduce(
                    (accum, _, colNum) =>
                        accum ||
                        (matrixA[rowNum][colNum] && matrixB[rowNum][colNum]) !=
                            null,
                    false
                ),
            false
        );
    };

const overlay: (a: BlockMatrix) => (b: BlockMatrix) => BlockMatrix =
    (matrixA) => (matrixB) => {
        return matrixA.map((currRow, rowNum) =>
            currRow.map(
                (_, colNum) =>
                    matrixA[rowNum][colNum] || matrixB[rowNum][colNum]
            )
        );
    };

function getLeftMost(matrix: BlockMatrix): number {
    return transpose(matrix)
        .map((row, rowIndex) => ({ index: rowIndex, bool: hasBlock(row) }))
        .filter((rowBool) => rowBool.bool)[0].index;
}

function getRightMost(matrix: BlockMatrix): number {
    const rowBooleans = transpose(matrix)
        .map((row, rowIndex) => ({ index: rowIndex, bool: hasBlock(row) }))
        .filter((rowBool) => rowBool.bool);
    return rowBooleans[rowBooleans.length - 1].index;
}

function getTopMost(matrix: BlockMatrix): number {
    return matrix
        .map((row, rowIndex) => ({ index: rowIndex, bool: hasBlock(row) }))
        .filter((rowBool) => rowBool.bool)[-1].index;
}

function getBottomMost(matrix: BlockMatrix): number {
    const rowBooleans = matrix
        .map((row, rowIndex) => ({ index: rowIndex, bool: hasBlock(row) }))
        .filter((rowBool) => rowBool.bool);
    return rowBooleans[rowBooleans.length - 1].index;
}

const getColumn =
    <T>(matrix: Matrix<T>) =>
    (column: number): ReadonlyArray<T> => {
        return transpose(matrix)[column];
    };

const transpose = <T>(matrix: Matrix<T>): Matrix<T> => {
    return matrix.map((row, rowIndex) =>
        row.map((col, colIndex) => matrix[colIndex][rowIndex])
    );
};

function rotate<T>(matrix: Matrix<T>) {
    // Jadhav, N., (2022, December 6th), Rotating a two dimensional m x n matrix
    // https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
    return matrix[0].map((val, index) =>
        matrix.map((row) => row[index]).reverse()
    );
}
