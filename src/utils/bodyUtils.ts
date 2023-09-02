import { Block, State, TetrisPiece } from "../types";

export { shiftPieceDown, shiftPieceLeft, shiftPieceRight, generateNewPiece }

const shiftPieceDown = (tetrisPiece: TetrisPiece): TetrisPiece => {
    return {
        ...tetrisPiece,
        y: tetrisPiece.y+1
    };
}

const shiftPieceLeft = (tetrisPiece: TetrisPiece): TetrisPiece => {
    return {
        ...tetrisPiece,
        x: tetrisPiece.x - 1
    };
}

const shiftPieceRight = (tetrisPiece: TetrisPiece): TetrisPiece => {
    return {
        ...tetrisPiece,
        x: tetrisPiece.x + 1
    };
}

const generateNewPiece = (): TetrisPiece => {
    return {
        x: 0,
        y: 0,
        matrix: [
            [null, null, null, null],
            [null, "red", "red", null],
            [null, "red", "red", null],
            [null, null, null, null]
          ]
    }
}