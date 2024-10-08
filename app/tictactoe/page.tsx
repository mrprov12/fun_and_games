"use client"; // Client component for Link usage
import { useEffect, useState } from "react";

export default function TicTacToe() {
  const [useComputer, setUseComputer] = useState(true);
  const [xTurn, setXTurn] = useState(true);
  const [winners, setWinners] = useState([] as number[][]);
  const [board, setBoard] = useState(Array(9).fill(null) as string[]);

  useEffect(() => {
    if (winners.length === 0) {
      analyzeWin();
    }
  }, [board]);

  useEffect(() => {
    if (winners.length === 0 && !xTurn && useComputer) {
      computerMove();
    }
  }, [winners]);

  // Placeholder board state (just for the UI)
  const setBoardData = (idx: number) => {
    if (winners.length === 0 && !board[idx]) {
      let newBoard = [...board];
      newBoard[idx] = xTurn ? "X" : "O";
      setBoard(newBoard);
      setXTurn(!xTurn);
    }
  };

  const winningCombinations: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
  ];

  const analyzeWin = () => {
    let wins: number[][] = [];
    winningCombinations.forEach((combo) => {
      console.log({ combo });
      if (
        board[combo[0]] &&
        board[combo[1]] &&
        board[combo[2]] &&
        board[combo[0]] === board[combo[1]] &&
        board[combo[0]] === board[combo[2]]
      ) {
        wins.push(combo);
      }
    });
    setWinners(wins);
  };

  const computerMove = () => {
    let placed = false;

    const placeO = (idx: number) => {
      if (board[idx] === null && !placed) {
        let newBoard = [...board];
        newBoard[idx] = "O";
        setBoard(newBoard);
        placed = true;
      }
    };

    let moveOptions: {
      priorityMove: number;
      winningMoves: number[];
      blockingMoves: number[];
      randomMoves: number[];
    } = {
      priorityMove: -1,
      winningMoves: [],
      blockingMoves: [],
      randomMoves: [],
    };

    winningCombinations.forEach((combo) => {
      let xList: number[] = [];
      let oList: number[] = [];
      let emptyList: number[] = [];

      combo.forEach((boardIdx) => {
        if (board[boardIdx] === "X") xList.push(boardIdx);
        if (board[boardIdx] === "O") oList.push(boardIdx);
        if (!board[boardIdx]) emptyList.push(boardIdx);
      });

      if (oList.length === 2 && emptyList.length === 1) {
        moveOptions.winningMoves.unshift(...emptyList);
      } else if (oList.length === 1 && xList.length == 0) {
        moveOptions.winningMoves.push(...emptyList);
      }
      if (xList.length == 2 && emptyList.length === 1) {
        moveOptions.priorityMove = emptyList[0];
      } else if (xList.length === 1 && emptyList.length > 0) {
        moveOptions.blockingMoves.push(...emptyList);
      } else if (emptyList.length > 0) {
        moveOptions.randomMoves.push(...emptyList);
      }
    });

    // Attempt to place "O" with priority: winning, blocking, or random empty spot
    if (moveOptions.priorityMove !== -1) {
      placeO(moveOptions.priorityMove);
    } else {
      if (moveOptions.winningMoves.length > 0) {
        placeO(moveOptions.winningMoves[0]);
      } else if (moveOptions.blockingMoves.length > 0) {
        placeO(moveOptions.blockingMoves[0]);
      } else if (moveOptions.randomMoves.length > 0) {
        placeO(
          moveOptions.randomMoves[
            Math.floor(Math.random() * moveOptions.randomMoves.length)
          ]
        );
      }
    }

    if (placed) {
      setXTurn(!xTurn);
    }
  };

  const getWinningClass = (index: number) => {
    let className = "";
    winners.forEach((combo) => {
      if (combo.includes(index)) {
        if (combo[0] === 0 && combo[1] === 1 && combo[2] === 2)
          className = "horizontal"; // Top row
        if (combo[0] === 3 && combo[1] === 4 && combo[2] === 5)
          className = "horizontal"; // Middle row
        if (combo[0] === 6 && combo[1] === 7 && combo[2] === 8)
          className = "horizontal"; // Bottom row
        if (combo[0] === 0 && combo[1] === 3 && combo[2] === 6)
          className = "vertical"; // Left column
        if (combo[0] === 1 && combo[1] === 4 && combo[2] === 7)
          className = "vertical"; // Middle column
        if (combo[0] === 2 && combo[1] === 5 && combo[2] === 8)
          className = "vertical"; // Right column
        if (combo[0] === 0 && combo[1] === 4 && combo[2] === 8)
          className = "diagonal-lr"; // Diagonal from top-left to bottom-right
        if (combo[0] === 2 && combo[1] === 4 && combo[2] === 6)
          className = "diagonal-rl"; // Diagonal from top-right to bottom-left
      }
    });
    return className;
  };

  const getWinner = () => {
    let winString = "";
    winners.forEach((win) => {
      winString += board[win[0]] + " ";
    });
    return winString;
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Tic-Tac-Toe</h1>

      <h3>
        {useComputer
          ? "One Player Mode"
          : `Two Player Mode: ${xTurn ? "X" : "O"}'s Turn`}
      </h3>

      <h3>{`Winner: ${getWinner()}`}</h3>

      <div className="grid grid-cols-3 gap-2">
        {board.map((value, index) => (
          <button
            key={index}
            className={`w-24 h-24 bg-gray-200 text-3xl font-bold flex items-center justify-center border-4 border-gray-400 
              ${getWinningClass(index)}`} // Apply class for winning combination
            onClick={() => setBoardData(index)}
          >
            {value}
          </button>
        ))}
      </div>

      {/* Set Computer Button */}
      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
        // Add computer game logic here
        onClick={() => {
          setUseComputer(!useComputer);
        }}
      >
        {useComputer ? "Set to two-player Mode" : "Set to one-player Mode"}
      </button>
      {/* Reset Button */}
      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg"
        // Add reset game logic here
        onClick={() => {
          setBoard(Array(9).fill(null) as string[]);
          setWinners([]);
          setXTurn(true);
        }}
      >
        Reset Game
      </button>
    </div>
  );
}
