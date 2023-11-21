function gameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];
  
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(cell());
      }
    }
  
    const getBoard = () => board;
  
    const placeMark = (row, column, player) => {
      if (board[row][column].getValue() == " ") {
        board[row][column].addMark(player);
      }
      else return;
  
    };
  
    const clearBoard = () => {
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          board[i][j].addMark(" ");
        }
      }
    };
  
    const printBoard = () => {
      const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
      console.log(boardWithCellValues);
    }
  
    return { getBoard, placeMark, clearBoard, printBoard };
  }
  
  function cell() {
    let value = " ";
  
    const addMark = (player) => {
      value = player;
    };
  
    const getValue = () => value;
  
    return {
      addMark,
      getValue
    };
  }
  
  function gameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const board = gameBoard();
  
    const players = [
      {
        name: "Player 1",
        mark: "X"
      },
      {
        name: "Player 2",
        mark: "O"
      }
    ];
  
    let activePlayer = players[0];
  
    const switchPlayerTurn = () => {
      activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;
  
    const playerBanner = document.getElementById("commentary-banner");
  
    const printNewRound = () => {
      board.printBoard();
      console.log(`${getActivePlayer().name}'s turn.`);
      playerBanner.innerText = `${getActivePlayer().name}'s turn.`;
  
    };
  
    const checkWinner = () => {
      const boardArray = board.getBoard();
  
      // Check rows and columns
      for (let i = 0; i < 3; i++) {
        if (
          boardArray[i][0].getValue() !== " " &&
          boardArray[i][0].getValue() === boardArray[i][1].getValue() &&
          boardArray[i][1].getValue() === boardArray[i][2].getValue()
        ) {
          return activePlayer;
        }
  
        if (
          boardArray[0][i].getValue() !== " " &&
          boardArray[0][i].getValue() === boardArray[1][i].getValue() &&
          boardArray[1][i].getValue() === boardArray[2][i].getValue()
        ) {
          return activePlayer;
        }
      }
  
      // Check diagonals
      if (
        boardArray[0][0].getValue() !== " " &&
        boardArray[0][0].getValue() === boardArray[1][1].getValue() &&
        boardArray[1][1].getValue() === boardArray[2][2].getValue()
      ) {
        return activePlayer;
      }
  
      if (
        boardArray[0][2].getValue() !== " " &&
        boardArray[0][2].getValue() === boardArray[1][1].getValue() &&
        boardArray[1][1].getValue() === boardArray[2][0].getValue()
      ) {
        return activePlayer;
      }
  
      // Check for a tie
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (boardArray[i][j].getValue() === " ") {
            return null;
          }
        }
      }
  
      return "Tie";
    };
  
    const playRound = (row, column) => {
      if (isValidMove(row, column)) {
        console.log(
          `${getActivePlayer().name} has placed a mark on ${row}, ${column}...`
        );
        board.placeMark(row, column, getActivePlayer().mark);
  
        const winner = checkWinner();
        if (winner) {
          if (winner === "Tie") {
            console.log("It's a tie!");
            resultDialogPop("It's a tie!".toUpperCase());
            board.printBoard();
          } else {
            console.log(`${winner.name} wins!`);
            resultDialogPop(`${winner.name} wins!`.toUpperCase());
            board.printBoard();
          }
  
        } else {
          switchPlayerTurn();
          printNewRound();
        }
      } else {
        console.log("Invalid move. Try again.");
        playerBanner.innerText = "Invalid move. Try again.";
      }
    };
  
    const isValidMove = (row, column) => {
      const boardArray = board.getBoard();
      // Checking if the move is within the board boundaries and if the cell is empty
      return (
        row >= 0 &&
        row < boardArray.length &&
        column >= 0 &&
        column < boardArray[row].length &&
        boardArray[row][column].getValue() === " "
      );
    };
  
  
    printNewRound();
  
    return {
      players,
      playRound,
      getActivePlayer,
      isValidMove
    };
  }
  
  const game = gameController();
  
  //UI Extras
  
  function updatePlayerName() {
  
    const dialog = document.querySelector("dialog");
    dialog.showModal();
  
    const player1Name = document.getElementById("player1-name");
    const player2Name = document.getElementById("player2-name");
    const confirmPlayerNames = document.getElementById("playername-submit");
  
    confirmPlayerNames.addEventListener("click", () => {
      event.preventDefault();
      game.players[0].name = player1Name.value;
      game.players[1].name = player2Name.value;
      dialog.close();
  
      const playerBanner = document.getElementById("commentary-banner");
      playerBanner.innerText = `${game.getActivePlayer().name}'s turn.`;
    })
  
  }
  
  const updatePlayer = updatePlayerName();
  
  function uiPlaceMarker() {
    const gameBoard = document.getElementById("game-board");
    const playerBanner = document.getElementById("commentary-banner");
    const cells = gameBoard.querySelectorAll("div");
  
    cells.forEach(cell => {
      cell.addEventListener("click", () => {
        const [, row, column] = cell.id.match(/cell(\d)(\d)/) || [];
  
        if (game.isValidMove(parseInt(row, 10), parseInt(column, 10))) {
          cell.textContent = game.getActivePlayer().mark;
          game.playRound(parseInt(row, 10), parseInt(column, 10));
          console.log(`Cell ${cell.id} clicked!`);
          cell.removeEventListener("click", arguments.callee);
          playerBanner.style.backgroundColor = "black";
        }
        else {
          console.log("Invalid move. Try again.");
          playerBanner.innerText = "Invalid move. Try again.";
          playerBanner.style.backgroundColor = "red";
        }
      });
    });
  }
  
  function resultDialogPop(message) {
    const resultDialog = document.createElement("dialog");
    resultDialog.innerHTML = message;
    resultDialog.style.display = "flex";
    resultDialog.style.flexDirection = "column";
    resultDialog.style.fontSize = "50px";
    resultDialog.style.textAlign = "center";
    resultDialog.style.justifyContent = "space-around";
    resultDialog.style.alignItems = "center";
  
    const resultDialogConfirm = document.createElement("button");
    resultDialogConfirm.innerHTML = "Play Again";
    resultDialogConfirm.addEventListener("click", () => {
      location.reload();
    });
  
    resultDialog.appendChild(resultDialogConfirm);
    document.body.appendChild(resultDialog);
    resultDialog.showModal();
  
  }
  
  const uiPlace = uiPlaceMarker();