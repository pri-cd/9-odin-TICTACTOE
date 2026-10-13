const DEBUG = true;

function debug(...args) {
    if (DEBUG === true) {
        console.log(...args);
    }
}

const gameBoard = (() => {
    const EMPTY = null;

    let boardArr = [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];

    const printBoard = () => {
        debug(boardArr);
    }

    const checkWin = () => {

    };

    return {
        printBoard,
    };
})();

gameBoard.printBoard();