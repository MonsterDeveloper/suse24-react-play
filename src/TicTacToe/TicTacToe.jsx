import "./TicTacToe.css";
import { useState } from "react";

function isWinningRow(row) {
  return row.every((cell) => cell === row[0] && cell !== null);
}

function isWinningColumn(board, columnIndex) {
  return isWinningRow(board.map((row) => row[columnIndex]));
}

function checkWinningBoard(board) {
  // check rows
  for (const row of board) {
    if (isWinningRow(row)) {
      return row[0];
    }
  }

  // check columns
  for (let i = 0; i < board[0].length; i++) {
    if (isWinningColumn(board, i)) {
      return board[0][i];
    }
  }

  // check diagonals
  if (
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2] &&
    board[0][0] !== null
  ) {
    return board[0][0];
  }

  if (
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0] &&
    board[0][2] !== null
  ) {
    return board[0][2];
  }

  return null;
}

function isBoardFull(board) {
  return board.every((row) => row.every((cell) => cell !== null));
}

const EMPTY_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export function TicTacToe() {
  const [board, setBoard] = useState(EMPTY_BOARD);
  const [move, setMove] = useState("X");

  const [status, setStatus] = useState();

  const handleCellClick = (rowIndex, cellIndex) => {
    if (board[rowIndex][cellIndex] !== null) {
      return;
    }

    const newBoard = board.map((row, i) =>
      row.map((cell, j) => {
        if (i === rowIndex && j === cellIndex) {
          return move;
        }
        return cell;
      })
    );
    setBoard(newBoard);
    setMove(move === "X" ? "O" : "X");

    const winningMove = checkWinningBoard(newBoard);
    const isFull = isBoardFull(newBoard);

    if (winningMove) {
      setStatus(`${winningMove} wins!`);
    }

    if (!winningMove && isFull) {
      setStatus("It's a draw!");
    }
  };

  return (
    <div className={"tic-tac-toe"}>
      <h1>Tic Tac Toe</h1>
      <div className={"board"}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={"row"}>
            {row.map((cell, cellIndex) => (
              <div
                className={"cell"}
                key={`${rowIndex}-${cellIndex}`}
                onClick={() => handleCellClick(rowIndex, cellIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      {status && <div className={"status"}>{status}
      <button onClick={() => {
        setStatus(null);
        setBoard(EMPTY_BOARD);
        setMove("X");
      }}>Play again</button>
      </div>}
    </div>
  );
}
