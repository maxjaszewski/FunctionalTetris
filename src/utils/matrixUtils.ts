import { GameConstants } from "../constants";
import { Block, BlockMatrix, TetrisPiece } from "../types";

export { initialize2DArray, pieceToMatrix, overlay, overlayConflict, getBottomY, rowHasBlock }




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
    return baseGrid.map( (currRow, row) => currRow.map( (_, col) => row >= y && row < y + numRows && col >= x && col < x + numCols ? 
        tetrisPiece.matrix[row-y][col-x]
        : 
        null)
    ); 

}

function rowHasBlock(matrixRow: ReadonlyArray<Block>): boolean {
    return matrixRow.reduce((accum, curr) =>  (accum || (curr != null)), false);
}

const overlayConflict: (a: BlockMatrix) => (b: BlockMatrix) => boolean = matrixA => matrixB => {
    return matrixA.reduce((accum, currRow, rowNum) => accum || currRow.reduce((accum,_,colNum) => accum || ( (matrixA[rowNum][colNum] && matrixB[rowNum][colNum]) != null ), false), false)    
}   

const overlay: (a: BlockMatrix) => (b: BlockMatrix) => BlockMatrix = matrixA => matrixB => {
    return matrixA.map((currRow, rowNum) => currRow.map((_,colNum) => matrixA[rowNum][colNum] || matrixB[rowNum][colNum] )   );  
}

function getLeftX(tetrisPiece: TetrisPiece): number {
    return tetrisPiece.y + tetrisPiece.matrix.reduce((accum, currRow, currRowNum) => rowHasBlock(currRow) ? currRowNum : accum, 0)
}

function getRightX(tetrisPiece: TetrisPiece): number {
    return tetrisPiece.y + tetrisPiece.matrix.reduce((accum, currRow, currRowNum) => rowHasBlock(currRow) ? currRowNum : accum, 0)
}

function getTopY(tetrisPiece: TetrisPiece): number {
    return tetrisPiece.y + tetrisPiece.matrix.reduce((accum, currRow, currRowNum) => rowHasBlock(currRow) ? currRowNum : accum, 0)
}

function getBottomY(tetrisPiece: TetrisPiece): number {
    return tetrisPiece.y + tetrisPiece.matrix.reduce((accum, currRow, currRowNum) => rowHasBlock(currRow) ? currRowNum : accum, 0)
}

