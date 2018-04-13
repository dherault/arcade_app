import React, { Component } from 'react';
import './Tetris.css';

const boardSizeX = 10;
const boardSizeY = 18;
const tileSize = 2; // vw

const emptyRow = [];

for (let x = 0; x < boardSizeX; x++) {
  emptyRow.push(0);
}

class Shape {
  constructor(definition) {
    this.originalDefinition = definition;

    this.init();
  }

  init() {
    this.definition = this.originalDefinition;

    this.dimX = this.definition[0].length;
    this.dimY = this.definition.length;

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

class BottomLayer {
  constructor() {
    this.board = [
      [1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
      [1, 0, 0, 0, 0, 1, 1, 0, 1, 0],
      [1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
      [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
    ];
  }

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

    let nFloodedTiles = 0;
    let nNextFloodedTiles = 0;
    let rowIndex = 1;

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

    for (let y = posY; y <= boardSizeY - this.board.length + 1; y++) {
      console.log('unshift:');
      this.board.unshift(emptyRow.slice());
    }

    console.log('this.board:', this.board);

    const boardLength = this.board.length;

    for (let x = 0; x < dimX; x++) {
      for (let y = 0; y < dimY; y++) {
        if (definition[y][x]) {
          console.log(posY + boardLength - boardSizeY + y);
          this.board[posY + boardLength - boardSizeY + y][x + posX] = definition[y][x];
        }
      }
    }

    const nextBoard = [];

    this.board.forEach(row => !row.every(tile => tile) && nextBoard.push(row));

    this.computeColisionTiles();

    this.board = nextBoard;
  }
}

const indexToColor = ['', 'yellow', 'green', 'red', 'purple'];

const shapes = [
  // new Shape([
  //   [0, 1],
  //   [1, 1],
  //   [1, 0],
  // ]),
  // new Shape([
  //   [2, 2],
  //   [2, 2],
  // ]),
  // new Shape([
  //   [3, 3, 3, 3],
  // ]),
  new Shape([
    [4, 4],
    [0, 4],
    [0, 4],
  ]),
];

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

class Tetris extends Component {

  componentWillMount() {
    this.createNewGame();
  }

  componentDidMount() {
    // this.moveShapeDownInterval = setInterval(this.moveShapeDown.bind(this), 1000);

    window.addEventListener('keydown', e => e.key === 'ArrowLeft' && this.moveShapeLeft());
    window.addEventListener('keydown', e => e.key === 'ArrowRight' && this.moveShapeRight());
    window.addEventListener('keydown', e => e.key === 'ArrowDown' && this.moveShapeDown());
    window.addEventListener('keydown', e => e.key === 'ArrowUp' && this.rotateShape());
  }

  createNewGame() {
    this.setState({
      shape: randomItem(shapes),
      bottomLayer: new BottomLayer(),
    });
  }

  checkColision(shapeColisionTiles, ) {
    const bottomLayerColisionTiles = this.state.bottomLayer.getColisionTiles();

    return shapeColisionTiles.some(({ x, y }) =>
      bottomLayerColisionTiles.some(({ x: bx, y: by }) =>
        x === bx && y === by
      )
    );
  }

  moveShapeDown() {
    const { shape, bottomLayer } = this.state;

    shape.posY++;

    if (this.checkColision(shape.getBottomColisionTiles())) {
      shape.posY--;

      bottomLayer.addShape(shape);

      const nextShape = randomItem(shapes);

      nextShape.init();

      this.setState({
        shape: nextShape,
        bottomLayer,
      });
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

  render() {
    const { shape, bottomLayer } = this.state;

    console.log('shape.posY:', shape.posY);
    const board = bottomLayer.board.map(row => row.slice());

    for (let y = board.length; y < boardSizeY; y++) {
      board.unshift(emptyRow.slice());
    }

    shape.getTiles().forEach(({ x, y, c }) => board[y][x] = c);

    bottomLayer.getColisionTiles().forEach(({ x, y }) => {
      board[y][x] = 2;
    });

    return (
      <div className="Tetris">
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
      </div>
    );
  }
}

export default Tetris;
