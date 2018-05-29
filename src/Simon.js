import React, { Component } from 'react';
import './Simon.css';

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  translate(dx, dy) {
    this.x += dx;
    this.y += dy;

    return this;
  }
}

const yellowPoints = [
  new Point(0, 0),
  new Point(30, -30),
  new Point(30, 30),
].map(p => p.translate(1, 0));

const dYellow = `M${yellowPoints[0].x} ${yellowPoints[0].y} L${yellowPoints[1].x} ${yellowPoints[1].y} A 45 45 0 0 1 ${yellowPoints[2].x} ${yellowPoints[2].y}  Z`;

const redPoints = [
  new Point(0, 0),
  new Point(30, 30),
  new Point(-30, 30),
].map(p => p.translate(0, 1));

const dRed = `M${redPoints[0].x} ${redPoints[0].y} L${redPoints[1].x} ${redPoints[1].y} A 45 45 0 0 1 ${redPoints[2].x} ${redPoints[2].y}  Z`;

const greenPoints = [
  new Point(0, 0),
  new Point(-30, 30),
  new Point(-30, -30),
].map(p => p.translate(-1, 0));

const dGreen = `M${greenPoints[0].x} ${greenPoints[0].y} L${greenPoints[1].x} ${greenPoints[1].y} A 45 45 0 0 1 ${greenPoints[2].x} ${greenPoints[2].y}  Z`;

const bluePoints = [
  new Point(0, 0),
  new Point(-30, -30),
  new Point(30, -30),
].map(p => p.translate(0, -1));

const dBlue = `M${bluePoints[0].x} ${bluePoints[0].y} L${bluePoints[1].x} ${bluePoints[1].y} A 45 45 0 0 1 ${bluePoints[2].x} ${bluePoints[2].y}  Z`;

const colors = [
  '#FEFE01',
  '#FDFD5D',
  '#FE0101',
  '#FE5D5D',
  '#01FE3C',
  '#54FE7C',
  '#0112FE',
  '#6973FE',
]

class Simon extends Component {

  componentWillMount() {
    this.resetSequence();
  }

  componentDidMount() {
    setTimeout(this.playSequence, 1000);
  }

  resetSequence() {
    this.setState({
      sequence: [Math.floor(Math.random() * 4)],
      sequenceIndex: 0,
      userTurn: false,
    })
  }

  playSequence = () => {
    const { sequence, sequenceIndex } = this.state;

    if (sequenceIndex === sequence.length) {
      return this.setState({
        userTurn: true,
        activeTile: -1,
        sequenceIndex: 0,
      });
    }

    this.setState({
      activeTile: sequence[sequenceIndex],
      sequenceIndex: sequenceIndex + 1,
    });

    setTimeout(() => this.setState({ activeTile: -1 }), 450);

    setTimeout(this.playSequence, 500);
  }

  handleClick = n => {
    const { userTurn, sequence, sequenceIndex } = this.state;

    if (!userTurn) return;

    // const nextState = {};

    if (sequence[sequenceIndex] === n) {
      if (sequenceIndex === sequence.length - 1) {
        this.setState({
          activeTile: n,
          sequence: [...sequence, Math.floor(Math.random() * 4)],
          sequenceIndex: 0,
          userTurn: false,
        });

        setTimeout(this.playSequence, 1000);
      }
      else {
        this.setState({
          activeTile: n,
          sequenceIndex: sequenceIndex + 1,
        });
      }

      setTimeout(() => this.setState({ activeTile: -1 }), 250);
    }
    else {
      this.resetSequence();

      this.setState({
        allTilesActive: true,
      });

      setTimeout(() => this.setState({ allTilesActive: false }), 500);
      setTimeout(() => this.setState({ allTilesActive: true }), 1000);
      setTimeout(() => this.setState({ allTilesActive: false }), 1500);
      setTimeout(() => this.setState({ allTilesActive: true }), 2000);
      setTimeout(() => this.setState({ allTilesActive: false }), 2500);

      setTimeout(this.playSequence, 3000);
    }
  }

  render() {
    const { sequence, activeTile, allTilesActive } = this.state;

    return (
      <svg viewBox="-50 -50 100 100" width="300px">
        <path d={dYellow} fill={allTilesActive || activeTile === 0 ? colors[0 * 2 + 1] : colors[0 * 2]} onClick={() => this.handleClick(0)} />
        <path d={dRed} fill={allTilesActive || activeTile === 1 ? colors[1 * 2 + 1] : colors[1 * 2]} onClick={() => this.handleClick(1)} />
        <path d={dGreen} fill={allTilesActive || activeTile === 2 ? colors[2 * 2 + 1] : colors[2 * 2]} onClick={() => this.handleClick(2)} />
        <path d={dBlue} fill={allTilesActive || activeTile === 3 ? colors[3 * 2 + 1] : colors[3 * 2]} onClick={() => this.handleClick(3)} />
      </svg>
    )
  }
}

export default Simon;
