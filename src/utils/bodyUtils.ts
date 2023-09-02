import { JPiece } from "../constants";
import { Block, BlockMatrix, State, TetrisPiece } from "../types";
import { RNG } from "./randomUtils";

export { shiftPieceDown, shiftPieceLeft, shiftPieceRight, generatePiece, generateRandomPiece }

const shiftPieceDown = (tetrisPiece: TetrisPiece): TetrisPiece => {
    return {
        ...tetrisPiece,
        y: tetrisPiece.y + 1
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

const generateRandomPiece = (seed: number) => {
    const scaleRGB = RNG.discrete(0)(255);
    const scalePiece = RNG.discrete(1)(8);
    const pieceID: number = scalePiece(RNG.hash(seed));
    const rgb1: number = RNG.hash(seed+1);
    const rgb2: number = RNG.hash(seed+2);
    const rgb3: number = RNG.hash(seed+3);
    return generatePiece(pieceID)(`rgb(${scaleRGB(rgb1)}, ${scaleRGB(rgb2)}, ${scaleRGB(rgb3)})`);
}

const generatePiece = (piece: number) => (colour: Block): TetrisPiece => {
    return {
        x: 3,
        y: -2,
        matrix: generatePieceMatrix(piece)(colour)

    }
}

const generatePieceMatrix = (piece: number) => (colour: Block): BlockMatrix => {
    switch (piece) {
        case 1: //O
            return [
                [null, null, null, null],
                [null, colour, colour, null],
                [null, colour, colour, null],
                [null, null, null, null]
            ];
        case 2: //J
            return [
                [null, null, null, null],
                [null, colour, null, null],
                [null, colour, colour, colour],
                [null, null, null, null]
            ];
        case 3: //L
            return [
                [null, null, null, null],
                [null, null, null, colour],
                [null, colour, colour, colour],
                [null, null, null, null]
            ];
        case 4: //I
            return [
                [null, colour, null, null],
                [null, colour, null, null],
                [null, colour, null, null],
                [null, colour, null, null]
            ];
        case 5: //S
            return [
                [null, null, null, null],
                [null, null, colour, colour],
                [null, colour, colour, null],
                [null, null, null, null]
            ];
        case 6: //Z
            return [
                [null, null, null, null],
                [null, colour, colour, null],
                [null, null, colour, colour],
                [null, null, null, null]
            ];
        default: //T
            return [
                [null, null, null, null],
                [null, null, colour, null],
                [null, colour, colour, colour],
                [null, null, null, null],
            ];
        

    } 
}