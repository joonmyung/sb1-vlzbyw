export type Piece = {
  shape: number[][];
  color: number;
};

export const PIECES: Piece[] = [
  { shape: [[1, 1, 1, 1]], color: 1 },  // I
  { shape: [[2, 0, 0], [2, 2, 2]], color: 2 },  // J
  { shape: [[0, 0, 3], [3, 3, 3]], color: 3 },  // L
  { shape: [[4, 4], [4, 4]], color: 4 },  // O
  { shape: [[0, 5, 5], [5, 5, 0]], color: 5 },  // S
  { shape: [[0, 6, 0], [6, 6, 6]], color: 6 },  // T
  { shape: [[7, 7, 0], [0, 7, 7]], color: 7 },  // Z
];

export function createEmptyBoard(rows: number, cols: number): number[][] {
  return Array(rows).fill(null).map(() => Array(cols).fill(0));
}

export function rotateMatrix(matrix: number[][]): number[][] {
  const N = matrix.length;
  const rotated = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - 1 - j][i])
  );
  return rotated;
}

export function isValidMove(board: number[][], piece: Piece, row: number, col: number): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] !== 0) {
        if (
          row + r < 0 ||
          row + r >= board.length ||
          col + c < 0 ||
          col + c >= board[0].length ||
          board[row + r][col + c] !== 0
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

export function placePiece(board: number[][], piece: Piece, row: number, col: number): number[][] {
  const newBoard = board.map(row => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (piece.shape[r][c] !== 0) {
        newBoard[row + r][col + c] = piece.color;
      }
    }
  }
  return newBoard;
}

export function clearLines(board: number[][]): { newBoard: number[][], linesCleared: number } {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    if (row.every(cell => cell !== 0)) {
      linesCleared++;
      return false;
    }
    return true;
  });

  while (newBoard.length < board.length) {
    newBoard.unshift(Array(board[0].length).fill(0));
  }

  return { newBoard, linesCleared };
}