import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	const winningStyle = {
		background: '#ccc'
	};
    return (
      <button className="square" onClick={props.onClick} style={props.winningSquare?winningStyle:null}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {
	createBoard(row, col) {
		const board=[];
		for(let i=0;i<row;i++){
			const colmns = [];
			for(let j=0;j<col;j++){
				colmns.push(this.renderSquare(i*3+j))
			}
			board.push(<div key={i} className="board-row">{colmns}</div>);
		}
		return board;
	}

  renderSquare(i) {
  	let winningSquare=this.props.winner && this.props.winner.includes(i)?true:false;
    return (
    	<Square value={this.props.squares[i]} 
    	onClick={() => this.props.onClick(i)}
    	winningSquare={winningSquare}
    	/>
    );
  }

  render() {
    return (
      <div>
        {this.createBoard(3,3)}
      </div>
    );
  }
}

function calculateWinner(squares) {
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
      return {
      	winner: squares[a],
      	winningSquares: lines[i]
      }
    }
  }
  return null;
}

class Game extends React.Component {
	constructor(props){
  	super(props);
  	this.state = {
  		history: [{
  			squares: Array(9).fill(null)
  		}],
  		stepNumber: 0,
  		xIsNext: true,
  		ascending: true
  	};
  }

  handleClick(i){
  	const history = this.state.history.slice(0, this.state.stepNumber+1);
  	const current = history[history.length - 1];
  	const squares = current.squares.slice();
  	if(calculateWinner(squares) || squares[i]){
  		return;
  	}
  	squares[i] = this.state.xIsNext? 'X': 'O';
  	this.setState({history: history.concat([{
  		squares: squares,
  		currentLocation: i
  	}]),
  	stepNumber: history.length,
  	xIsNext: !this.state.xIsNext,
  });
  }

  jumpTo(step){
  	this.setState({
  		stepNumber: step,
  		xIsNext: (step%2)===0,
  	});
  }

  getLocation(i) {
  	return '(' + i%3 + ',' + parseInt(i/3) + ')'
  }

  sortList(){
  	this.setState({
  		ascending: !this.state.ascending
  	})
  }

  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);

  	const chosen = {
  		border: '2px solid #4CAF50'
  	}

  	const notChosen = {
  		border: 'none'
  	}

  	const moves = history.map((step, move) => {
  		const location = step.currentLocation!=null? this.getLocation(step.currentLocation) : '';
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          
		<button style={this.state.stepNumber === move ? chosen: notChosen}onClick={() => this.jumpTo(move)}>{desc} {location}</button>
		        
		</li>
      );
    });

  	let status;
  	if(winner) {
  		status = 'Winner: '+ winner.winner;
  	} else if(this.state.stepNumber === 9){
  		status = 'There is no winner';
  	} else {
  		status = 'Next player: '+ (this.state.xIsNext?'X':'O');
  	}

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winner={winner&&winner.winningSquares}/>
          <br />
          <button onClick={() => this.sortList()}>Reverse Move List</button>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.ascending?moves: moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
