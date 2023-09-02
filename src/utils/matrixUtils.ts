import { min } from "rxjs";
import { GameConstants } from "../constants";
import { Block, BlockMatrix, TetrisPiece } from "../types";

export { initialize2DArray, pieceToMatrix, overlay, overlayConflict, getLeftMost, getRightMost, getTopMost, getBottomMost, hasBlock, transpose, rotate, isFullRow }

function initialize2DArray(rows: number, cols: number) {
    return Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => null)
    );
}

function pieceToMatrix(tetrisPiece: TetrisPiece): BlockMatrix {
    const numRows = tetrisPiece.matrix.length;
    const numCols = tetrisPiece.matrix[0].length;
    const x = tetrisPiece.x;
    const y = tetrisPiece.y;

    const baseGrid = initialize2DArray(GameConstants.GRID_HEIGHT, GameConstants.GRID_HEIGHT);
    return baseGrid.map((currRow, row) => currRow.map((_, col) => row >= y && row < y + numRows && col >= x && col < x + numCols ?
        tetrisPiece.matrix[row - y][col - x]
        :
        null)
    );

}

function hasBlock(matrixRow: ReadonlyArray<Block>): boolean {
    return matrixRow.reduce((accum, curr) => (accum || (curr != null)), false);
}

function isFullRow(matrixRow: ReadonlyArray<Block>): boolean {
    return matrixRow.reduce((accum, curr) => {
        return (accum && (curr != null))
    }, true)
}

const overlayConflict: (a: BlockMatrix) => (b: BlockMatrix) => boolean = matrixA => matrixB => {
    return matrixA.reduce((accum, currRow, rowNum) => accum || currRow.reduce((accum, _, colNum) => accum || ((matrixA[rowNum][colNum] && matrixB[rowNum][colNum]) != null), false), false)
}

const overlay: (a: BlockMatrix) => (b: BlockMatrix) => BlockMatrix = matrixA => matrixB => {
    return matrixA.map((currRow, rowNum) => currRow.map((_, colNum) => matrixA[rowNum][colNum] || matrixB[rowNum][colNum]));
}

function getLeftMost(matrix: BlockMatrix): number {
    return transpose(matrix).map((row, rowIndex) => ({ index: rowIndex, bool: hasBlock(row) })).filter(rowBool => rowBool.bool)[0].index;
}

function getRightMost(matrix: BlockMatrix): number {
    const rowBooleans = transpose(matrix).map((row, rowIndex) => ({ index: rowIndex, bool: hasBlock(row) })).filter(rowBool => rowBool.bool);
    return rowBooleans[rowBooleans.length - 1].index;
}

function getTopMost(matrix: BlockMatrix): number {
    return matrix.map((row, rowIndex) => ({ index: rowIndex, bool: hasBlock(row) })).filter(rowBool => rowBool.bool)[-1].index;
}

function getBottomMost(matrix: BlockMatrix): number {
    const rowBooleans = matrix.map((row, rowIndex) => ({ index: rowIndex, bool: hasBlock(row) })).filter(rowBool => rowBool.bool);
    return rowBooleans[rowBooleans.length - 1].index;
}

const getColumn = (matrix: BlockMatrix) => (column: number): ReadonlyArray<Block> => {
    return transpose(matrix)[column];
}

const transpose = (matrix: BlockMatrix): BlockMatrix => {
    return matrix.map((row, rowIndex) => row.map((col, colIndex) => matrix[colIndex][rowIndex]));
}

function rotate(matrix: BlockMatrix) {
    //TODO https://stackoverflow.com/questions/15170942/how-to-rotate-a-matrix-in-an-array-in-javascript
    return matrix[0].map((val, index) => matrix.map(row => row[index]).reverse())
}

