import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import MemoryTiles from './MemoryTiles';
import Snake from './Snake';
import Tetris from './Tetris';
import Simon from './Simon';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <nav className="App-nav">
            <Link to="/">Home</Link>
            <Link to="/memory-tiles">Memory Tiles</Link>
            <Link to="/snake">Snake</Link>
            <Link to="/tetris">Tetris</Link>
            <Link to="/simon">Simon</Link>
          </nav>

          <Route path="/memory-tiles" component={MemoryTiles}/>
          <Route path="/snake" component={Snake}/>
          <Route path="/tetris" component={Tetris}/>
          <Route path="/simon" component={Simon}/>
        </div>
      </Router>
    );
  }
}

export default App;
