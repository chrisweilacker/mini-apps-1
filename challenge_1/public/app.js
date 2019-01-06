var controller = {
  resetBoard : function (event) {
    model.board = [new Array(3), new Array(3), new Array(3)];
    if (model.hasWon) {
      model.currentTurn = model.winner;
      model.hasWon = false;
      model.winner = null;
    } else {
      model.currentTurn = 'X';
    }
    view.emptyBoard();
  },

  placePiece: function (event) {
    model.changePiece(Number(event.target.id[1]), Number(event.target.id[2]));
    view.renderPiece(event.target.id, model.board[Number(event.target.id[1])][Number(event.target.id[2])]);
    view.renderAnnouncementLabel(model.currentTurn, model.currentTurn === 'X' ? model.XPlayerName : model.OPlayerName, model.hasWon === false ? 0 : 1);
    view.renderScoreBoard(model.scoreBoard, model.OPlayerName, model.XPlayerName);
  },

  changeOName: function (event){
    model.OPlayerName = event.target.value;
    view.renderAnnouncementLabel(model.currentTurn, model.currentTurn === 'X' ? model.XPlayerName : model.OPlayerName, model.hasWon === false ? 0 : 1);
    view.renderScoreBoard(model.scoreBoard, model.OPlayerName, model.XPlayerName);
  },

  changeXName: function (event) {
    model.XPlayerName = event.target.value;
    view.renderAnnouncementLabel(model.currentTurn, model.currentTurn === 'X' ? model.XPlayerName : model.OPlayerName, model.hasWon === false ? 0 : 1);
    view.renderScoreBoard(model.scoreBoard, model.OPlayerName, model.XPlayerName);
  }
}

var view = {
  renderAnnouncementLabel: function (piece, name, type) {
    if (type === 0) {
      document.getElementById('announcement').innerText = `           It is ${name}'s turn`;
    } else {
      document.getElementById('announcement').innerText = `           ${name} has Won!!`;
    }
  },

  renderScoreBoard: function (scores, OPlayerName, XPlayerName) {
    document.getElementById('scoreboard').innerHTML = `Scoreboard<br />X (${XPlayerName}): ${scores.X}<br /> O (${OPlayerName}): ${scores.O}`
  },

  renderPiece: function (id, piece) {
    if (piece) {
      document.getElementById(id).innerHTML = '<P id="P' + id.substring(1) +'" style="font-size:80px; text-align:center;">' + piece + '</p>';
      document.getElementById('P' + id.substring(1)).onclick = controller.placePiece;
    }

  },

  emptyBoard: function () {
    var pieces = document.getElementsByTagName('td');

    for (var i = 0; i<pieces.length; i++) {
      pieces[i].innerHTML = '<P style="font-size:80px; text-align:center;"></p>';
    }
  }
}

var model = {
  board: [new Array(3), new Array(3), new Array(3)],
  scoreBoard: {X: 0, O: 0},
  hasWon: false,
  winner: null,
  currentTurn: 'X',
  XPlayerName: 'X',
  OPlayerName: 'O',

  changePiece: function (row, column) {
    if (this.board[row][column]!==undefined) {
      return;
    }
    if (!this.hasWon) {

      this.board[row][column] = this.currentTurn;
      this.checkBoard(row, column);
    }

    if (!this.hasWon) {
      this.currentTurn === 'X' ? this.currentTurn = 'O' : this.currentTurn = 'X';
    }

  },

  checkBoard: function (row, column) {
    if (this.board[row][0] === this.board[row][1] && this.board[row][0] === this.board[row][2]) {
      this.hasWon = true;
      this.winner = this.currentTurn;
      this.scoreBoard[this.currentTurn] ++;
    } else if (this.board[0][column] === this.board[1][column] && this.board[0][column] === this.board[2][column]) {
      this.hasWon = true;
      this.winner = this.currentTurn;
      this.scoreBoard[this.currentTurn] ++;
    } else if (this.board[0][0] != undefined && this.board[0][0] === this.board[1][1] && this.board[0][0] === this.board[2][2]) {
      this.hasWon = true;
      this.winner = this.currentTurn;
      this.scoreBoard[this.currentTurn] ++;
    } else if (this.board[0][2] != undefined && this.board[0][2] === this.board[1][1] && this.board[0][2] === this.board[2][0]) {
      this.hasWon = true;
      this.winner = this.currentTurn;
      this.scoreBoard[this.currentTurn] ++;
    }
  }


}


var pieces = document.getElementsByTagName('td');

for (var i = 0; i<pieces.length; i++) {
  pieces[i].onclick = controller.placePiece;
}

document.getElementById('XPlayerName').onchange = controller.changeXName;

document.getElementById('OPlayerName').onchange = controller.changeOName;

document.getElementById('Reset').onclick = controller.resetBoard;

