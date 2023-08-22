import { Block, State, TetrisPiece } from "../types";

export { shiftPieceDown, shiftPieceLeft, shiftPieceRight, generateNewRandomPiece }

const shiftPieceDown = (tetrisPiece: TetrisPiece): TetrisPiece => {
    return {
        ...tetrisPiece,
        blocks: tetrisPiece.blocks.map(block => (
            {
                ...block,
                y: block.y + 1
            }
        )
        )
    };
}

const shiftPieceLeft = (tetrisPiece: TetrisPiece): TetrisPiece => {
    return {
        ...tetrisPiece,
        blocks: tetrisPiece.blocks.map(block => (
            {
                ...block,
                x: block.x - 1
            }
        )
        )
    };
}

const shiftPieceRight = (tetrisPiece: TetrisPiece): TetrisPiece => {
    return {
        ...tetrisPiece,
        blocks: tetrisPiece.blocks.map(block => (
            {
                ...block,
                x: block.x + 1
            }
        )
        )
    };
}

const generateNewRandomPiece = (s: State): TetrisPiece => {
    return {
        id: 1,
        blocks: [
            {
            id: (s.blockCount+1).toString(),
            x: 0,
            y: 0,
            style: "fill: red"
            },
            {
            id: (s.blockCount+2).toString(),
            x: 1,
            y: 0,
            style: "fill: red"
            },
            {
            id: (s.blockCount+3).toString(),
            x: 0,
            y: 1,
            style: "fill: red"
            },
            {
            id: (s.blockCount+4).toString(),
            x: 1,
            y: 1,
            style: "fill: red"
            }
        ]
      };
}