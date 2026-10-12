const DEBUG = true;

function debug(...args) {
    if (DEBUG === true) {
        console.log(...args);
    }
}

function gameBoard() {
    let boardArr = [[], [], []];

    const printBoard = () => {
        debug(boardArr);
    }

    return {
        printBoard,
    };
}



const board = gameBoard();
board.printBoard();