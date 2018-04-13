import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import MemoryTiles from './MemoryTiles';
import Snake from './Snake';
import Tetris from './Tetris';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className="App-nav">
            <Link to="/">Home</Link>
            <Link to="/memory-tiles">Memory Tiles</Link>
            <Link to="/snake">Snake</Link>
            <Link to="/tetris">Tetris</Link>
          </nav>

          <Route path="/memory-tiles" component={MemoryTiles}/>
          <Route path="/snake" component={Snake}/>
          <Route path="/tetris" component={Tetris}/>
        </div>
      </Router>
    );
  }
}

export default App;
