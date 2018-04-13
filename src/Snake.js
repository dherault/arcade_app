import React, { Component } from 'react';
import './Snake.css';

const speed = 500;
const boardWidth = 40;
const boardHeight = 30;
const tileSize = 1; // vw

const typeToColor = ['transparent', 'black', 'red'];

class Snake extends Component {

  componentWillMount() {
    this.generateBoardConfiguration();
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this), false);
    window.addEventListener('keyup', this.handleKeyUp.bind(this), false);
    this.update();
  }

  handleKeyDown(e) {
    const { snakeDirection } = this.state;

    // console.log(e);

    switch (e.key) {
      case 'ArrowUp':
        return snakeDirection !== 'south' && this.setState({ nextSnakeDirection: 'north' });

      case 'ArrowDown':
        return snakeDirection !== 'north' && this.setState({ nextSnakeDirection: 'south' });

      case 'ArrowLeft':
        return snakeDirection !== 'east' && this.setState({ nextSnakeDirection: 'west' });

      case 'ArrowRight':
        return snakeDirection !== 'west' && this.setState({ nextSnakeDirection: 'east' });

      case 'Control':
        return this.setState({ speedUp: true });
    }
  }

  handleKeyUp(e) {
    if (e.key === 'Control') this.setState({ speedUp: false });
  }

  generateBoardConfiguration(startGame) {
    const tiles = [];
    const snakeStartingTile = {
      x: Math.floor(boardWidth / 2),
      y: Math.floor(boardHeight / 2),
    };

    let applePos;

    do {
      applePos = {
        x: Math.floor(Math.random() * boardWidth),
        y: Math.floor(Math.random() * boardHeight),
      };
    } while (applePos.x === snakeStartingTile.x && applePos.y === snakeStartingTile.y)

    this.setState({
      applePos,
      snakeDirection: 'north',
      nextSnakeDirection: 'north',
      snakePath: [snakeStartingTile],
      speed: 800,
      speedUp: false,
      gameOver: false,
    }, () => startGame && this.update());
    //   if (startGame) this.
    // });
  }

  update() {
    const { snakePath, applePos, nextSnakeDirection, gameOver, speed, speedUp } = this.state;

    if (gameOver) return;

    const nextState = {
      snakeDirection: nextSnakeDirection,
    };

    // Remove tail, compute new head
    const nextSnakePath = snakePath.slice();
    const currentSnakeHead = nextSnakePath[0];
    nextSnakePath.pop();

    let nextSnakeHead;

    if (nextSnakeDirection === 'north') {
      nextSnakeHead = {
        x: currentSnakeHead.x,
        y: currentSnakeHead.y - 1,
      };

      if (nextSnakeHead.y < 0) nextSnakeHead.y = boardHeight - 1;
    }
    else if (nextSnakeDirection === 'south') {
      nextSnakeHead = {
        x: currentSnakeHead.x,
        y: currentSnakeHead.y + 1,
      };

      if (nextSnakeHead.y === boardHeight) nextSnakeHead.y = 0;
    }
    else if (nextSnakeDirection === 'west') {
      nextSnakeHead = {
        x: currentSnakeHead.x - 1,
        y: currentSnakeHead.y,
      };

      if (nextSnakeHead.x < 0) nextSnakeHead.x = boardWidth - 1;
    }
    else {
      nextSnakeHead = {
        x: currentSnakeHead.x + 1,
        y: currentSnakeHead.y,
      };

      if (nextSnakeHead.x === boardWidth) nextSnakeHead.x = 0;
    }

    if (nextSnakePath.some(({ x, y }) => nextSnakeHead.x === x && nextSnakeHead.y === y)) {
      nextState.gameOver = true;
    }

    nextSnakePath.unshift(nextSnakeHead);

    nextState.snakePath = nextSnakePath;

    if (nextSnakeHead.x === applePos.x && nextSnakeHead.y === applePos.y) {
      nextSnakePath.push(currentSnakeHead);

      let applePos;

      do {
        applePos = {
          x: Math.floor(Math.random() * boardWidth),
          y: Math.floor(Math.random() * boardHeight),
        };
      } while (nextSnakePath.some(({ x, y }) => applePos.x === x && applePos.y === y))

      nextState.applePos = applePos;
      nextState.speed = speed * 0.9;
    }

    const workingSpeed = (nextState.speed || speed) * (speedUp ? 0.33 : 1);

    this.setState(nextState);
    setTimeout(() => this.update(), workingSpeed);
  }

  render() {
    const { snakePath, applePos, gameOver } = this.state;

    const tiles = [];
    const firstSnakePathTile = snakePath[0].y * boardWidth + snakePath[0].x;
    const snakePathTiles = snakePath.map(({ x, y }) => y * boardWidth + x);
    const appleTile = applePos.y * boardWidth + applePos.x;

    for (let i = 0; i < boardWidth * boardHeight; i++) {
      if (snakePathTiles.includes(i)) tiles.push(1);
      else if (appleTile === i) tiles.push(2);
      else tiles.push(0);
    }

    const tileDim = `${tileSize}vw`;

    return (
      <div className="Snake">
        <div
          className="Snake-board"
          style={{
            width: `${boardWidth * tileSize}vw`,
            height: `${boardHeight * tileSize}vw`,
          }}
        >
          {tiles.map((type, i) => (
            <div
              key={i}
              className="Snake-tile"
              style={{
                backgroundColor: typeToColor[type],
                minWidth: tileDim,
                minHeight: tileDim,
                lineHeight: tileDim,
              }}
            >
              {i === firstSnakePathTile && '*' || ''}
            </div>
          ))}
        </div>
        {gameOver && (
          <button onClick={() => this.generateBoardConfiguration(true)}>New game</button>
        )}
      </div>
    );
  }
}

export default Snake;
