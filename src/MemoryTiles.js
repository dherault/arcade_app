import React, { Component } from 'react';
import './MemoryTiles.css';

const Tile = ({ active, symbol, width, onClick }) => (
  <div
    className="Tile"
    onClick={onClick}
    style={{
      minWidth: `${width}vw`,
      minHeight: `${width}vw`,
      backgroundColor: active ? '#d7e8f5' : 'transparent',
    }}
  >
    {active && symbol || ''}
  </div>
);

const boardWidth = 50;

class MemoryTiles extends Component {

  state = {
    boardSizeInput: 4,
  }

  componentWillMount() {
    this.generateBoardConfiguration();
  }

  generateBoardConfiguration() {
    const { boardSizeInput } = this.state;

    const tileSymbols = [];

    for (let i = 0; i < boardSizeInput * boardSizeInput / 2; i++) {
      let tileSymbol;

      do {
        tileSymbol = Math.floor(Math.random() * 1000) + 1;
      } while (tileSymbols.includes(tileSymbol))

      tileSymbols.push(tileSymbol, tileSymbol);
    }

    this.setState({
      boardSize: boardSizeInput,
      tileSymbols: tileSymbols.sort(() => Math.random() - 0.5),
      discoveredSymbols: [],
      activeTile: null,
    });
  }

  selectTile(i) {
    const { activeTile, tileSymbols } = this.state;

    if (activeTile === i) {
      return this.setState({ activeTile: null });
    }

    if (tileSymbols[activeTile] === tileSymbols[i]) {
      const newDiscoveredSymbols = this.state.discoveredSymbols.slice();
      newDiscoveredSymbols.push(this.state.tileSymbols[i]);

      return this.setState({
        activeTile: null,
        discoveredSymbols: newDiscoveredSymbols,
      });
    }

    this.setState({ activeTile: i });
  }

  handleBoardSizeChange(diff) {
    this.setState({
      boardSizeInput: Math.min(10, Math.max(0, this.state.boardSizeInput + diff)),
    });
  }

  render() {
    const { boardSize, boardSizeInput, tileSymbols, discoveredSymbols, activeTile } = this.state;

    return (
      <div
        className="MemoryTiles"
        style={{
          width: `${boardWidth}vw`,
          height: `${boardWidth}vw`,
        }}
      >
        <div className="MemoryTiles-header">
          <span>{boardSizeInput}</span>
          <button onClick={() => this.handleBoardSizeChange(-2)}>-</button>
          <button onClick={() => this.handleBoardSizeChange(+2)}>+</button>
          <button onClick={() => this.generateBoardConfiguration()}>New game</button>
        </div>
        <div className="MemoryTiles-board">
          {tileSymbols.map((tileSymbol, i) => (
            <Tile
              key={i}
              width={boardWidth / boardSize}
              symbol={tileSymbol}
              onClick={() => this.selectTile(i)}
              active={activeTile === i || discoveredSymbols.includes(tileSymbol)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default MemoryTiles;
