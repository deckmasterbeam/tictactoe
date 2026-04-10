import { useState } from 'react'
import './App.css'

type Player = 'X' | 'O'
type SquareValue = Player | null

type GameResult = {
  winner: Player
  line: number[]
} | null

function createWinningLines(size: number) {
  const lines: number[][] = []

  for (let row = 0; row < size; row += 1) {
    const line: number[] = []
    for (let col = 0; col < size; col += 1) {
      line.push(row * size + col)
    }
    lines.push(line)
  }

  for (let col = 0; col < size; col += 1) {
    const line: number[] = []
    for (let row = 0; row < size; row += 1) {
      line.push(row * size + col)
    }
    lines.push(line)
  }

  const mainDiagonal = Array.from({ length: size }, (_, index) => index * size + index)
  const antiDiagonal = Array.from({ length: size }, (_, index) => index * size + (size - 1 - index))

  lines.push(mainDiagonal)
  lines.push(antiDiagonal)

  return lines
}

function calculateWinner(squares: SquareValue[], size: number): GameResult {
  const lines = createWinningLines(size)

  for (const line of lines) {
    const [first, ...rest] = line
    const value = squares[first]
    if (value && rest.every((index) => squares[index] === value)) {
      return { winner: value, line }
    }
  }

  return null
}

const boardOptions = Array.from({ length: 8 }, (_, index) => index + 3)

function App() {
  const [selectedSize, setSelectedSize] = useState(3)
  const [boardSize, setBoardSize] = useState(3)
  const [gameStarted, setGameStarted] = useState(false)
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  const result = calculateWinner(squares, boardSize)
  const winner = result?.winner
  const winningLine: number[] = result?.line ?? []
  const isDraw = !winner && squares.every(Boolean)

  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a draw"
    : `Next player: ${xIsNext ? 'X' : 'O'}`

  const handleSquareClick = (index: number) => {
    if (!gameStarted || squares[index] || winner) {
      return
    }

    const nextSquares = [...squares]
    nextSquares[index] = xIsNext ? 'X' : 'O'
    setSquares(nextSquares)
    setXIsNext((current) => !current)
  }

  const startGame = () => {
    setBoardSize(selectedSize)
    setSquares(Array(selectedSize * selectedSize).fill(null))
    setXIsNext(true)
    setGameStarted(true)
  }

  const resetGame = () => {
    setSquares(Array(boardSize * boardSize).fill(null))
    setXIsNext(true)
  }

  const resetToSetup = () => {
    setGameStarted(false)
    setSelectedSize(boardSize)
  }

  return (
    <main className="app-shell">
      <section className="game-panel">
        <h1>Tic Tac Toe</h1>

        {!gameStarted ? (
          <div className="setup-panel">
            <p className="status">Choose your board size before starting.</p>
            <label className="size-selector">
              <span>Board size</span>
              <select
                value={selectedSize}
                onChange={(event) => setSelectedSize(Number(event.target.value))}
              >
                {boardOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} x {size}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="reset-button" onClick={startGame}>
              Start {selectedSize} x {selectedSize} game
            </button>
          </div>
        ) : (
          <>
            <p className="status">{status}</p>
            <p className="board-info">Board size: {boardSize} × {boardSize}</p>
            <div
              className="board"
              role="grid"
              aria-label={`Tic tac toe board ${boardSize} by ${boardSize}`}
              style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}
            >
              {squares.map((value, index) => {
                const isWinningSquare = winningLine.includes(index)

                return (
                  <button
                    key={index}
                    type="button"
                    className={`square ${isWinningSquare ? 'winning' : ''}`}
                    onClick={() => handleSquareClick(index)}
                    disabled={Boolean(value) || Boolean(winner)}
                    aria-label={`Square ${index + 1}, ${value ?? 'empty'}`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
            <div className="button-row">
              <button type="button" className="reset-button" onClick={resetGame}>
                Restart game
              </button>
              <button type="button" className="secondary-button" onClick={resetToSetup}>
                Choose new size
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}

export default App
