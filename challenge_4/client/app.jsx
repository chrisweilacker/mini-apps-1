import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {

  constructor(props) {
    super(props);

    var theBoard = [];
    for (var row = 0; row<6; row++) {
      theBoard.push([]);
      for (var col = 0; col<7; col++) {
        theBoard[row].push('');
      }
    };

    this.state = {
      board: theBoard,
      currentPlayer: 'B',
      gameFinished: false,
      lastPiece : [-1,-1]
    };

  }

  drop(e) {
    //add B or R to the board array.
    if (!this.state.gameFinished) {
      var column = Number(e.target.id.substring(1));

      for (var row = 5; row >= 0; row--) {
        if (this.state.board[row][column]==='') {

          var newBoard = this.state.board;
          newBoard[row][column] = this.state.currentPlayer;
          var theLastPiece = [row, column]
          this.state.lastPiece = theLastPiece;
          this.setState({
            board: newBoard,
            currentPlayer: this.state.currentPlayer === 'B' ? 'R' : 'B',
            gameFinished: this.testForWin() === true ? true : false,
            lastPiece : theLastPiece
          });
          break;
        }
      }
    }
  }

  testForWin() {
    console.log(this.state.board);
    if (this.verticalCheck() || this.horizontalCheck() || this.diaganolCheck()) {
      alert(((this.state.currentPlayer === 'B') ? 'Black' : 'Red') + ' WON!!!');
      return true;
    } else {
      return false;
    }
  }

  diaganolCheck() {
    var startingRow = this.state.lastPiece[0];
    var startingColumn = this.state.lastPiece[1];
    var count = 1;

    (function upperRight() {
      //check upper right
      for (var diff= 1; diff < 4; diff++) {
          var row = startingRow - diff;
          var col = startingColumn + diff;
          if (row < 6 && row > -1 && col < 7 && col > -1) {
            if (this.state.board[row][col] === this.state.currentPlayer) {
              count++;
              if (count === 4) {
                return;
              }
            } else {
              return;
            }
          }
      }
    }).bind(this)();


    (function lowerLeft() {
      //check lower left
      for (var diff= 1; diff < 4; diff++) {
        var row = startingRow + diff;
        var col = startingColumn - diff;
        if (row < 6 && row > -1 && col < 7 && col > -1) {
          if (this.state.board[row][col] === this.state.currentPlayer) {
            count++;
          if (count === 4) {
            return;
          }
          } else {
            return;
          }
        }

      }
    }).bind(this)();

    if (count >= 4) {
      return true;
    } else {
      count = 1;
    }

    //reset then check upper left
    (function upperLeft() {
      //check upper left
      for (var diff= 1; diff < 4; diff++) {
        var row = startingRow - diff;
        var col = startingColumn - diff;
        if (row < 6 && row > -1 && col < 7 && col > -1) {
          if (this.state.board[row][col] === this.state.currentPlayer) {
            count++;
            if (count === 4) {
              return;
            }
          } else {
            return;
          }
        }

      }
    }).bind(this)();


    (function lowerRight() {
      //check lower Right
      for (var diff= 1; diff < 4; diff++) {
        var row = startingRow + diff;
        var col = startingColumn + diff;
        if (row < 6 && row > -1 && col < 7 && col > -1) {
          if (this.state.board[row][col] === this.state.currentPlayer) {
            count++;
          if (count === 4) {
            return;
          }
          } else {
            return;
          }
        }
      }
    }).bind(this)();

    if (count >= 4) {
      return true;
    } else {
      return false;
    }

  }


  verticalCheck() {
    var count = 0;
    var lastPiece = 'B';
    for (var col=0; col<7; col++) {
      count = 0;
      for (var row=0; row<6; row++) {
        if (this.state.board[row][col] !== lastPiece || this.state.board[row][col] === '') {
          if (this.state.board[row][col] !== '') {
            lastPiece = this.state.board[row][col];
            count = 1;
          }
        } else {
          count++;
        }

        if (count=== 4) {
          return true;
        }
      }
    }
    return false;
  }

  horizontalCheck() {
    var count = 0;
    var lastPiece = 'B';
    for (var row=0; row<6; row++) {
      count = 0;
      for (var col=0; col<7; col++) {
        if (this.state.board[row][col] !== lastPiece || this.state.board[row][col] === '') {
          if (this.state.board[row][col] !== '') {
            lastPiece = this.state.board[row][col];
            count=1;
          }
        } else {
          count++;
        }

        if (count=== 4) {
          return true;
        }
      }
    }
    return false;
  }

  clearBoard(e) {
    var theBoard = [];
    for (var row = 0; row<6; row++) {
      theBoard.push([]);
      for (var col = 0; col<7; col++) {
        theBoard[row].push('');
      }
    };

    this.setState({
      board: theBoard,
      currentPlayer: 'B',
      gameFinished: false
    })
  }

  render() {
    return (
    <div className="container">
      <Information currentPlayer={(this.state.currentPlayer === 'B') ? 'Black' : 'Red'} reset={this.clearBoard.bind(this)}/>
      <Board drop={this.drop.bind(this)} board={this.state.board}/>
    </div>);
  }

}

function Board (props) {
  console.log(props.board);
  var rows = props.board.map(function (row, rowindex) {
    return (
      <div id={'R' + rowindex} key={'R' + rowindex} className="row">
        {row.map(function (col, colindex) {
            var classN = "";

            if (col === "R") {
              classN="red-circle";
            } else if (col ==="B") {
              classN="black-circle";
            } else {
              classN="empty-circle";
            }

            return( <div id={'R' + rowindex + 'C' + colindex} key={'R' + rowindex + 'C' + colindex} className="col piece">
                      <div className={classN}>
                      </div>
                    </div>);
        })}
      </div>
    );
  });
  return (<div>
    <div id="throw" className="row">
    <div id="T0" className="col arrow-down" onClick={props.drop}></div>
    <div id="T1" className="col arrow-down" onClick={props.drop}></div>
    <div id="T2" className="col arrow-down" onClick={props.drop}></div>
    <div id="T3" className="col arrow-down" onClick={props.drop}></div>
    <div id="T4" className="col arrow-down" onClick={props.drop}></div>
    <div id="T5" className="col arrow-down" onClick={props.drop}></div>
    <div id="T6" className="col arrow-down" onClick={props.drop}></div>
    </div>
    {rows}
    </div>);
}

function Information (props) {
  return (<div className="row">
  <div className="col">
  <h2>It is Currently {props.currentPlayer}'s Turn'
  </h2><br/>
  <button className="reset btn btn-primary" onClick={props.reset}>Reset</button>
  </div>
  </div>);
}

ReactDOM.render(<App/>, document.getElementById('app'));