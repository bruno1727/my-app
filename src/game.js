import React from 'react';
import Board from './board';
import HistoryNavigator from './history-navigator';

export default class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history: new History,
            stepNumber: 0,
            xIsNext: true,
            playWithComputer: true,
            myTurn: true,
        };
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={this.getCurrent()}
                        onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{this.getStatus()}</div>
                    <ol><HistoryNavigator 
                            history={this.state.history}
                            onClick={(move) => this.jumpTo(move)}/>
                    </ol>
                </div>
            </div>
        );
    }

    hasWinner(){
        return this.calculateWinner(this.getCurrent());
    }

    handleClick(i, allowComputerMove = true){

        this.state.history.split(this.state.stepNumber);

        if(this.hasWinner() || this.state.history.last()[i]){
            return;
        }

        this.state.history.add(this.state.xIsNext, i);

        this.setState({
            stepNumber: this.state.history.length()-1,
            xIsNext: !this.state.xIsNext,
            myTurn: !this.state.myTurn
        });

        if(this.state.playWithComputer && allowComputerMove){
            this.getComputerMove()
                .then(response => response.json())
                .then(i => this.handleClick(i, false));
        }
    }

    getComputerMove(){
        return fetch('http://localhost:3002/move', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(this.state.history.get(this.state.history.length() - 1))
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    getCurrent(){
        return this.state.history.get(this.state.stepNumber)
    }

    getStatus(){
        const winner = this.calculateWinner(this.getCurrent());
        if (winner) {
            return 'Winner: ' + winner;
        } else {
            return 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
    }

    calculateWinner(squares) {

        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
          const [a, b, c] = lines[i];
          if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
          }
        }
        return null;
    }
}

class History{

    squares;

    constructor(){
        this.squares = [];
        this.squares.push(Array(9).fill(null));
    }

    get(i){
        return this.squares[i];
    }

    length(){
        return this.squares.length;
    }

    add(xIsNext, i){
        let newSquares = this.last().slice();
        newSquares[i] = xIsNext ? 'X' : 'O';
        this.squares.push(newSquares);
    }

    last(){
        return this.squares[this.squares.length - 1];
    }

    split(stepNumber){
        this.squares = this.squares.slice(0, stepNumber + 1);
    }
}

