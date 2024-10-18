"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import TetrisBoard from '@/components/TetrisBoard';
import { useToast } from '@/components/ui/use-toast';
import { Piece, PIECES, createEmptyBoard, isValidMove, placePiece, clearLines, rotateMatrix } from '@/lib/tetris';

export default function Home() {
  const [gameState, setGameState] = useState({
    board: createEmptyBoard(20, 10),
    score: 0,
    level: 1,
    gameOver: false,
    currentPiece: null as Piece | null,
    currentPosition: { row: 0, col: 0 },
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isPlaying) {
      const gameLoop = setInterval(() => {
        moveDown();
      }, 1000 - (gameState.level - 1) * 100);

      return () => clearInterval(gameLoop);
    }
  }, [isPlaying, gameState.level]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowLeft':
          moveHorizontal(-1);
          break;
        case 'ArrowRight':
          moveHorizontal(1);
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameState]);

  const startGame = () => {
    setIsPlaying(true);
    setGameState({
      board: createEmptyBoard(20, 10),
      score: 0,
      level: 1,
      gameOver: false,
      currentPiece: getRandomPiece(),
      currentPosition: { row: 0, col: 3 },
    });
    toast({
      title: "Game Started",
      description: "Good luck!",
    });
  };

  const pauseGame = () => {
    setIsPlaying(false);
    toast({
      title: "Game Paused",
      description: "Take a break!",
    });
  };

  const getRandomPiece = (): Piece => {
    return PIECES[Math.floor(Math.random() * PIECES.length)];
  };

  const moveHorizontal = (direction: number) => {
    if (!gameState.currentPiece) return;

    const newCol = gameState.currentPosition.col + direction;
    if (isValidMove(gameState.board, gameState.currentPiece, gameState.currentPosition.row, newCol)) {
      setGameState(prev => ({
        ...prev,
        currentPosition: { ...prev.currentPosition, col: newCol },
      }));
    }
  };

  const moveDown = () => {
    if (!gameState.currentPiece) return;

    const newRow = gameState.currentPosition.row + 1;
    if (isValidMove(gameState.board, gameState.currentPiece, newRow, gameState.currentPosition.col)) {
      setGameState(prev => ({
        ...prev,
        currentPosition: { ...prev.currentPosition, row: newRow },
      }));
    } else {
      // Place the piece and check for completed lines
      const newBoard = placePiece(gameState.board, gameState.currentPiece, gameState.currentPosition.row, gameState.currentPosition.col);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const newScore = gameState.score + linesCleared * 100;
      const newLevel = Math.floor(newScore / 1000) + 1;

      if (newRow <= 1) {
        // Game over
        setIsPlaying(false);
        setGameState(prev => ({ ...prev, gameOver: true }));
        toast({
          title: "Game Over",
          description: `Final Score: ${newScore}`,
        });
      } else {
        setGameState(prev => ({
          ...prev,
          board: clearedBoard,
          score: newScore,
          level: newLevel,
          currentPiece: getRandomPiece(),
          currentPosition: { row: 0, col: 3 },
        }));
      }
    }
  };

  const rotatePiece = () => {
    if (!gameState.currentPiece) return;

    const rotatedPiece = { ...gameState.currentPiece, shape: rotateMatrix(gameState.currentPiece.shape) };
    if (isValidMove(gameState.board, rotatedPiece, gameState.currentPosition.row, gameState.currentPosition.col)) {
      setGameState(prev => ({
        ...prev,
        currentPiece: rotatedPiece,
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Tetris</h1>
      <div className="flex justify-center items-start space-x-8">
        <Card className="p-6">
          <TetrisBoard
            board={gameState.board}
            currentPiece={gameState.currentPiece}
            currentPosition={gameState.currentPosition}
          />
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Game Info</h2>
          <p className="mb-2">Score: {gameState.score}</p>
          <p className="mb-2">Level: {gameState.level}</p>
          <div className="space-y-2">
            {!isPlaying && !gameState.gameOver && (
              <Button onClick={startGame} className="w-full">Start Game</Button>
            )}
            {isPlaying && (
              <Button onClick={pauseGame} className="w-full">Pause Game</Button>
            )}
            {gameState.gameOver && (
              <Button onClick={startGame} className="w-full">Play Again</Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}