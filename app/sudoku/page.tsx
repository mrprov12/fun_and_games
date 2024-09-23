"use client";
import NoWorkResult from "postcss/lib/no-work-result";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useState,
} from "react";

export default function Sudoku() {
  const initializeBoard = () =>
    Array.from({ length: 9 }, () => Array(9).fill(null));

  const [playBoard, setPlayBoard] = useState(initializeBoard);
  const [answerBoard, setAnswerBoard] = useState(initializeBoard);

  const [invalidCells, setInvalidCells] = useState<
    { row: number; col: number }[]
  >([]); // Track invalid cells
  const [mistakesCounter, setMistakesCounter] = useState(0);

  const [inputNum, setInputNum] = useState(1);

  const validateRow = (
    board: number[][],
    num: number,
    rowIdx: number
  ): boolean => {
    return board[rowIdx].filter((el: number) => el === num).length === 0;
  };

  const validateCol = (
    board: number[][],
    num: number,
    colIdx: number
  ): boolean => {
    return (
      board
        .map((row: number[]) => row[colIdx])
        .filter((el: number) => el === num).length === 0
    );
  };

  const validateSquare = (
    board: number[][],
    num: number,
    rowIdx: number,
    colIdx: number
  ): boolean => {
    const squareValues: number[] = [];

    // find range of board
    const rowIdxRem = rowIdx % 3;
    let startRowIdx = rowIdx - rowIdxRem;

    const colIdxRem = colIdx % 3;
    let startColIdx = colIdx - colIdxRem;

    for (let r = startRowIdx; r < startRowIdx + 3; r++) {
      squareValues.push(
        ...board[r].filter(
          (el: number, idx: number) =>
            idx === startColIdx ||
            idx === startColIdx + 1 ||
            idx === startColIdx + 2
        )
      );
    }

    return squareValues.filter((el: number) => el === num).length === 0;
  };

  const validateNumberPlacement = (
    board: number[][],
    num: number,
    rowIdx: number,
    colIdx: number
  ): boolean => {
    return (
      validateRow(board, num, rowIdx) &&
      validateCol(board, num, colIdx) &&
      validateSquare(board, num, rowIdx, colIdx)
    );
  };
  const baseNums = Array.from({ length: 9 }, (_, i) => i + 1);

  const findPlayableOptions = (
    board: number[][],
    r: number,
    c: number
  ): number[] => {
    return baseNums.filter((num) => validateNumberPlacement(board, num, r, c));
  };

  const createBaseBoard = () => {
    // create random top row
    const rowBase = [...baseNums];
    const rowArr = [];
    while (rowBase.length > 0) {
      if (rowBase.length > 0)
        rowArr.push(
          rowBase.splice(Math.floor(Math.random() * rowBase.length), 1)[0]
        );
    }

    const newBoard = initializeBoard();

    // set row 0 nums
    newBoard[0] = [...rowArr];

    //algo to solve puzzle
    const playStack: {
      r: number;
      c: number;
      untried: number[];
    }[] = [];
    let r = 1;
    let c = 0;

    let options = findPlayableOptions(newBoard, r, c);
    console.log({ firstOp: options });

    while (r < 9) {
      if (options.length > 0) {
        // Try the first available option
        const num = options.shift()!;
        if (validateNumberPlacement(newBoard, num, r, c)) {
          newBoard[r][c] = num;
          playStack.push({ r, c, untried: options });

          // Move to the next cell
          if (c === 8) {
            if (r === 8) break;
            c = 0;
            r++;
          } else {
            c++;
          }

          // Get options for the next cell
          options = findPlayableOptions(newBoard, r, c);
        }
      } else {
        if (playStack.length > 0) {
          const last = playStack.pop()!;

          r = last.r;
          c = last.c;
          options = last.untried;
          newBoard[r][c] = null; // Reset the board cell to try new options
        } else {
          break;
        }
      }
    }

    setAnswerBoard(newBoard);
    setPlayBoard(newBoard);
  };

  const adjustPlayBoard = (level: number) => {
    //copy board
    let newBoard = [];
    answerBoard.forEach((row) => {
      newBoard.push([...row]);
    });

    // switch (level) {
    //   case 1: // easy
    //     const missingCells = 51;

    //   default;
    //     return;
    // }
  };

  const createNewGame = (level?: number) => {
    // placeholder for level logic
    if (!level) level = 1;

    // create filled out board
    createBaseBoard();

    // create playboard based on level
    adjustPlayBoard(level);
  };

  const handleCellClick = (rowIdx: number, colIdx: number) => {
    const isValid = validateNumberPlacement(
      playBoard,
      inputNum,
      rowIdx,
      colIdx
    );
    if (isValid) {
      const newBoard = playBoard.map((r, rIdx) =>
        rIdx === rowIdx
          ? r.map((val: any, cIdx: any) =>
              cIdx === colIdx && val === null ? inputNum : val
            )
          : r
      );
      setPlayBoard(newBoard);
    } else {
      // Mark this cell as invalid and flash "X"
      setInvalidCells((prev) => [...prev, { row: rowIdx, col: colIdx }]);
      setMistakesCounter(mistakesCounter + 1);
      // Remove the invalid flag after 500ms
      setTimeout(() => {
        setInvalidCells((prev) =>
          prev.filter((cell) => cell.row !== rowIdx || cell.col !== colIdx)
        );
      }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-white">Sudoku</h1>

      <h3>{`Mistakes: ${mistakesCounter}`}</h3>

      {/* Sudoku Board */}
      <div className="grid grid-cols-9 gap-[1px]">
        {playBoard.map((row, rowIdx) =>
          row.map((value, colIdx) => (
            <div
              key={`${rowIdx}-${colIdx}`}
              onClick={() => handleCellClick(rowIdx, colIdx)} // Handle click
              className={`w-10 h-10 flex items-center justify-center border border-gray-300 bg-white cursor-pointer
                ${rowIdx % 3 === 0 ? "border-t-4 border-t-gray-500" : ""}
                ${colIdx % 3 === 0 ? "border-l-4 border-l-gray-500" : ""}
                ${rowIdx === 8 ? "border-b-4 border-b-gray-500" : ""}
                ${colIdx === 8 ? "border-r-4 border-r-gray-500" : ""}`}
            >
              {
                // Show "X" if this cell was marked as invalid
                invalidCells.some(
                  (cell) => cell.row === rowIdx && cell.col === colIdx
                ) ? (
                  <span className="text-red-500">X</span> // Invalid entry shows as red
                ) : value !== null ? (
                  <span className="text-gray-500">{value}</span> // Grey text for cell values
                ) : (
                  ""
                )
              }
            </div>
          ))
        )}
      </div>

      {/* Row of Numbers 1-9 */}
      <div className="mt-4 flex space-x-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => setInputNum(num)} // Set the clicked number as inputNum
            className={`w-10 h-10 text-center rounded-lg border-2 border-gray-300 text-xl font-bold ${
              inputNum === num
                ? "bg-blue-500 text-white"
                : "bg-white text-black"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* New Game Button */}
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => createNewGame()} // Reset the board
        >
          New Game
        </button>
      </div>
    </div>
  );
}
