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

  state = {
    userTurn: false,
    activeTile: -1,
    sequenceIndex: -1,
    sequence: [],
  }

  componentWillMount() {
    this.appendToSequence();
  }

  componentDidMount() {
    this.playSequence();
  }

  appendToSequence() {
    const sequence = this.state.sequence.slice();

    sequence.push(Math.floor(Math.random() * 4));

    this.setState({ sequence, userSequence: [] });
  }

  playSequence = () => {
    const { sequence, sequenceIndex } = this.state;

    if (sequenceIndex === sequence.length - 1) {
      return this.setState({
        activeTile: -1,
        userTurn: true,
        sequenceIndex: -1,
      });
    };

    this.setState({
      activeTile: sequence[sequenceIndex + 1],
      sequenceIndex: sequenceIndex + 1,
    });

    setTimeout(this.playSequence, 1000);
  }

  handleClick = n => {
    const { userTurn, sequence, sequenceIndex } = this.state;

    if (!userTurn) return;

    const nextState = {};

    if (sequence[sequenceIndex + 1] === n) {
      nextState.sequenceIndex = sequenceIndex + 1;
    }

  }

  render() {
    console.log('this.state.sequence:', this.state.sequence);
    const { activeTile } = this.state;

    return (
      <svg viewBox="-50 -50 100 100" width="300px">
        <path d={dYellow} fill={activeTile === 0 ? colors[0 * 2 + 1] : colors[0 * 2]} />
        <path d={dRed} fill={activeTile === 1 ? colors[1 * 2 + 1] : colors[1 * 2]} />
        <path d={dGreen} fill={activeTile === 2 ? colors[2 * 2 + 1] : colors[2 * 2]} />
        <path d={dBlue} fill={activeTile === 3 ? colors[3 * 2 + 1] : colors[3 * 2]} />
      </svg>
    )
  }
}

export default Simon;
