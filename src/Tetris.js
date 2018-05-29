import React, { Component } from 'react';
import './Tetris.css';

/* -------
  Params
------- */

const boardSizeX = 10; // tiles
const boardSizeY = 18;
const tileSize = 2; // vw

const initialFallPeriod = 1000; // ms
const minFallPeriod = 200;

const indexToColor = ['', 'Red', 'Lime', 'Orange', 'Blue', 'Yellow', 'Aqua', 'MediumPurple'];

const shapeDefinitions = [
  [
    [0, 1],
    [1, 1],
    [1, 0],
  ],
  [
    [2, 0],
    [2, 2],
    [0, 2],
  ],
  [
    [3, 3],
    [0, 3],
    [0, 3],
  ],
  [
    [4, 4],
    [4, 0],
    [4, 0],
  ],
  [
    [5, 5],
    [5, 5],
  ],
  [
    [6, 6, 6, 6],
  ],
  [
    [0, 7, 0],
    [7, 7, 7],
  ],
];

// Empty row for reuse
const emptyRow = [];

for (let x = 0; x < boardSizeX; x++) {
  emptyRow.push(0);
}

/* -----
  Shape
------ */

class Shape {
  constructor(definition) {
    this.definition = definition;

    this.dimX = definition[0].length;
    this.dimY = definition.length;

    this.resetPos();
  }

  resetPos() {
    this.posX = Math.floor(boardSizeX / 2 - this.dimX / 2);
    this.posY = -this.dimY;
  }

  getTiles() {
    const tiles = [];

    this.definition.forEach((row, y) =>
      row.forEach((tileColor, x) => {
        if (tileColor && y + this.posY >= 0) {
          tiles.push({ x: x + this.posX, y: y + this.posY, c: tileColor });
        };
      })
    );

    return tiles;
  }

  rotate90Dregrees() {
    const newDefinition = [];

    for (let x = 0; x < this.dimX; x++) {
      const row = [];

      for (let y = 0; y < this.dimY; y++) {
        row.push(0);
      }

      newDefinition.push(row);
    }

    for (let x = 0; x < this.dimX; x++) {
      for (let y = this.dimY - 1; y >= 0; y--) {
        newDefinition[x][this.dimY - y - 1] = this.definition[y][x];
      }
    }

    this.definition = newDefinition;

    const newDimY = this.dimX;

    this.dimX = this.dimY;
    this.dimY = newDimY;

    if (this.posX + this.dimX > boardSizeX) {
      this.posX = boardSizeX - this.dimX;
    }

    this.posY += this.dimX - this.dimY;
  }

  getLeftColisionTiles() {
    const tiles = [];

    for (let y = 0; y < this.dimY; y++) {
      let x = 0;
      let tile;

      do {
        if (this.definition[y][x]) {
          tile = {
            x: x + this.posX,
            y: y + this.posY,
          };
        }
        else {
          x++;
        }
      } while (!tile)

      tiles.push(tile);
    }

    return tiles;
  }

  getRightColisionTiles() {
    const tiles = [];

    for (let y = 0; y < this.dimY; y++) {
      let x = this.dimX - 1;
      let tile;

      do {
        if (this.definition[y][x]) {
          tile = {
            x: x + this.posX,
            y: y + this.posY,
          };
        }
        else {
          x--;
        }
      } while (!tile)

      tiles.push(tile);
    }

    return tiles;
  }

  getBottomColisionTiles() {
    const tiles = [];

    for (let x = 0; x < this.dimX; x++) {
      let y = this.dimY - 1;
      let tile;

      do {
        if (this.definition[y][x]) {
          tile = {
            x: x + this.posX,
            y: y + this.posY,
          };
        }
        else {
          y--;
        }
      } while (!tile)

      tiles.push(tile);
    }

    return tiles;
  }
}

/* -----------
  BottomLayer
------------ */

class BottomLayer {

  board = []

  getColisionTiles() {
    if (this.colisionTiles) return this.colisionTiles;

    return this.computeColisionTiles();
  }

  computeColisionTiles() {
    const { board } = this;

    if (!board.length) return [];

    const floodedBoard = [emptyRow.map(_ => -1)];

    board.forEach(row => floodedBoard.push(row.slice()));

    const floodedBoardLength = floodedBoard.length;

    let rowIndex = 1;
    let nFloodedTiles = 0;
    let nNextFloodedTiles = 0;

    do {
      nNextFloodedTiles = nFloodedTiles;

      for (let x = 0; x < boardSizeX; x++) {
        // flood down
        if (floodedBoard[rowIndex - 1][x] === -1 && !floodedBoard[rowIndex][x]) {

          floodedBoard[rowIndex][x] = -1;
          nFloodedTiles++;

          let moveOn = true;
          let dx = 1;

          while (moveOn) {
            if (x - dx >= 0) {
              if (!floodedBoard[rowIndex][x - dx]) {
                floodedBoard[rowIndex][x - dx] = -1;
                nFloodedTiles++;
                dx++;
              }
              else {
                moveOn = false;
              }
            }
            else {
              moveOn = false;
            }
          }

          moveOn = true;
          dx = 1;

          while (moveOn) {
            if (x + dx < boardSizeX) {
              if (!floodedBoard[rowIndex][x + dx]) {
                floodedBoard[rowIndex][x + dx] = -1;
                nFloodedTiles++;
                dx++;
              }
              else {
                moveOn = false;
              }
            }
            else {
              moveOn = false;
            }
          }
        }
      }

      rowIndex++;

      // console.log(rowIndex);

    } while (nFloodedTiles !== nNextFloodedTiles && rowIndex < floodedBoard.length)

    // console.log(floodedBoard);

    const colisionTiles = [];

    floodedBoard.forEach((row, y) => {
      row.forEach((tile, x) => {
        // console.log(y, x)
        if (tile > 0 && (
          (y - 1 >= 0 && floodedBoard[y - 1][x] === -1) ||
          (x - 1 >= 0 && floodedBoard[y][x - 1] === -1) ||
          (x + 1 < boardSizeX && floodedBoard[y][x + 1] === -1) ||
          (y + 1 < floodedBoardLength && floodedBoard[y + 1][x] === -1)
        )) {
          colisionTiles.push({
            x,
            y: boardSizeY - floodedBoardLength + y,
          });
        }
      });
    });

    return this.colisionTiles = colisionTiles;
  }

  addShape(shape) {
    const { posX, posY, dimX, dimY, definition } = shape;

    let boardLength = this.board.length;

    // Add additional rows if necessary
    for (let y = posY; y < boardSizeY - boardLength; y++) {
      this.board.unshift(emptyRow.slice());
    }

    boardLength = this.board.length;

    // Add shape to bottom layer
    for (let x = 0; x < dimX; x++) {
      for (let y = 0; y < dimY; y++) {
        if (definition[y][x]) {
          this.board[posY + boardLength - boardSizeY + y][x + posX] = definition[y][x];
        }
      }
    }

    // Clear full rows
    const nextBoard = [];

    this.board.forEach(row => !row.every(tile => tile) && nextBoard.push(row));

    const nClearedRows = boardLength - nextBoard.length;

    // Set new board
    this.board = nextBoard;

    // Recompute colision tiles
    this.computeColisionTiles();

    // Indicate how many rows were cleared
    return nClearedRows;
  }
}

/* ------
  Tetris
------- */

const pickShape = () => new Shape(shapeDefinitions[Math.floor(Math.random() * shapeDefinitions.length)]);

const ShapePreview = ({ shape }) => !!shape && shape.definition.map((row, j) => (
  <div style={{ display: 'flex' }} key={j}>
    {row.map((c, i) => (
      <div
        key={i}
        style={{
          width: `${tileSize}vw`,
          height: `${tileSize}vw`,
          backgroundColor: indexToColor[c],
        }}
      />
    ))}
  </div>
));

class Tetris extends Component {

  constructor() {
    super();

    this.moveShapeDown = this.moveShapeDown.bind(this);
    this.setFallInterval = this.setFallInterval.bind(this);

    this.keyBindings = [
      e => e.code === 'ArrowUp' && this.rotateShape(),
      e => e.code === 'ArrowDown' && this.moveShapeDown(),
      e => e.code === 'ArrowLeft' && this.moveShapeLeft(),
      e => e.code === 'ArrowRight' && this.moveShapeRight(),
      e => e.code === 'Space' && this.holdShape(),
    ];

    this.state = {
      level: 0,
      gameOver: false,
      shape: pickShape(),
      nextShape: pickShape(),
      heldShape: null,
      bottomLayer: new BottomLayer(),
    };
  }

  componentDidMount() {
    this.addKeyBindings();
    this.setFallInterval();
  }

  componentWillUnmount() {
    this.removeKeyBindings();
    clearInterval(this.fallInterval);
  }

  addKeyBindings() {
    this.keyBindings.forEach(listener => window.addEventListener('keydown', listener));
  }

  removeKeyBindings() {
    this.keyBindings.forEach(listener => window.removeEventListener('keydown', listener));
  }

  setFallInterval() {
    if (this.fallInterval) clearInterval(this.fallInterval);

    const { level, gameOver } = this.state;

    if (gameOver) return;

    const period = Math.max(minFallPeriod, initialFallPeriod - level * 20);

    this.fallInterval = setInterval(this.moveShapeDown, period);
  }

  resetGame() {
    this.addKeyBindings();

    this.setState({
      level: 0,
      gameOver: false,
      shape: pickShape(),
      nextShape: pickShape(),
      heldShape: null,
      bottomLayer: new BottomLayer(),
    }, this.setFallInterval);
  }

  checkColision(shapeColisionTiles) {
    const bottomLayerColisionTiles = this.state.bottomLayer.getColisionTiles();

    return shapeColisionTiles.some(({ x, y }) =>
      bottomLayerColisionTiles.some(({ x: bx, y: by }) =>
        x === bx && y === by
      )
    );
  }

  moveShapeDown() {
    const { shape, nextShape, bottomLayer, level } = this.state;

    shape.posY++;

    if (shape.posY + shape.dimY === boardSizeY + 1 || this.checkColision(shape.getBottomColisionTiles())) {
      shape.posY--;

      const nClearedRows = bottomLayer.addShape(shape);
      const nextNextShape = pickShape();
      const gameOver = bottomLayer.board.length >= boardSizeY;

      if (gameOver) this.removeKeyBindings();

      this.setState({
        gameOver,
        bottomLayer,
        shape: nextShape,
        nextShape: nextNextShape,
        level: level + nClearedRows,
      }, this.setFallInterval);
    }
    else {
      this.setState({ shape });
    }
  }

  moveShapeLeft() {
    const { shape } = this.state;

    if (shape.posX > 0) {
      shape.posX--;

      if (this.checkColision(shape.getLeftColisionTiles())) {
        shape.posX++;
      }
      else {
        this.setState({ shape });
      }
    };
  }

  moveShapeRight() {
    const { shape } = this.state;

    if (shape.posX + shape.dimX < boardSizeX) {
      shape.posX++;

      if (this.checkColision(shape.getRightColisionTiles())) {
        shape.posX--;
      }
      else {
        this.setState({ shape });
      }
    };
  }

  rotateShape() {
    const { shape } = this.state;

    shape.rotate90Dregrees();

    this.setState({ shape });
  }

  holdShape() {
    const { shape, nextShape, heldShape } = this.state;

    if (!heldShape) {
      return this.setState({
        shape: nextShape,
        heldShape: shape,
        nextShape: pickShape(),
      });
    }

    heldShape.resetPos();

    this.setState({
      shape: heldShape,
      heldShape: shape,
    });
  }

  render() {
    const { shape, nextShape, heldShape, bottomLayer, level, gameOver } = this.state;

    // Construct board from bottom layer
    const board = bottomLayer.board.map(row => row.slice());

    // Remove overflowing rows at end game
    while (board.length > boardSizeY) {
      board.shift();
    }

    // Add empty rows to complete the board
    for (let y = board.length; y < boardSizeY; y++) {
      board.unshift(emptyRow.slice());
    }

    // Display the falling shape
    shape.getTiles().forEach(({ x, y, c }) => board[y][x] = c);

    // bottomLayer.getColisionTiles().forEach(({ x, y }) => board[y][x] = 2 });

    return (
      <div className="Tetris">
        <div className="Tetris-panel">
          <div>Next:</div>
          <div className="Tetris-shapepreview">
            <ShapePreview shape={nextShape} />
          </div>
          <div>On hold:</div>
          <div className="Tetris-shapepreview">
            <ShapePreview shape={heldShape} />
          </div>
        </div>
        <div
          className="Tetris-board"
          style={{
            width: `${boardSizeX * tileSize}vw`,
            height: `${boardSizeY * tileSize}vw`,
          }}
        >
          {board.map((row, j) => (
            row.map((c, i) => (
              <div
                key={`${i}_${j}`}
                style={{
                  width: `${tileSize}vw`,
                  height: `${tileSize}vw`,
                  backgroundColor: indexToColor[c],
                }}
              />
            ))
          ))}
        </div>
        <div className="Tetris-panel">
          <div>Level {level}</div>
          {gameOver && (
            <div className="Tetris-gameover">
              <div>Game over!</div>
              <div>
                <button className="Tetris-gameover-button" onClick={() => this.resetGame()}>New game</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Tetris;
