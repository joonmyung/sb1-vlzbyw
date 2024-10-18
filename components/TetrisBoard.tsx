import React from 'react';
import { Piece } from '@/lib/tetris';

interface TetrisBoardProps {
  board: number[][];
  currentPiece: Piece | null;
  currentPosition: { row: number; col: number };
}

const TetrisBoard: React.FC<TetrisBoardProps> = ({ board, currentPiece, currentPosition }) => {
  const colors = [
    'bg-gray-800',  // Empty
    'bg-red-500',   // I
    'bg-blue-500',  // J
    'bg-orange-500', // L
    'bg-yellow-500', // O
    'bg-green-500', // S
    'bg-purple-500', // T
    'bg-pink-500',  // Z
  ];

  const renderBoard = () => {
    const renderedBoard = board.map(row => [...row]);

    if (currentPiece) {
      currentPiece.shape.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (cell !== 0) {
            const boardRow = currentPosition.row + rowIndex;
            const boardCol = currentPosition.col + cellIndex;
            if (boardRow >= 0 && boardRow < renderedBoard.length && boardCol >= 0 && boardCol < renderedBoard[0].length) {
              renderedBoard[boardRow][boardCol] = currentPiece.color;
            }
          }
        });
      });
    }

    return renderedBoard;
  };

  return (
    <div className="grid grid-cols-10 gap-px bg-gray-700 p-px">
      {renderBoard().map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            className={`w-6 h-6 ${colors[cell]}`}
          />
        ))
      )}
    </div>
  );
};

export default TetrisBoard;