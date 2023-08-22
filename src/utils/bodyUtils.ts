import { Block, TetrisPiece } from "../types";

export { shiftPieceDown, shiftPieceLeft, shiftPieceRight }

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