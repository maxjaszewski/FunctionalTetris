import { Block, TetrisPiece } from "../types";

export { shiftPieceDown }

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