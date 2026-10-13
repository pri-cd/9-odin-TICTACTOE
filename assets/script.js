const DEBUG = true;

function debug(...args) {
    if (DEBUG === true) {
        console.log(...args);
    }
}

const gameBoard = (() => {
    const choice = {
        X: 'X',
        O: 'O',
        E: null
    };

    const EMPTY = choice.E;

    let boardArr = [
        [choice.X, choice.X, choice.O],
        [choice.X, choice.X, choice.X],
        [EMPTY, EMPTY, EMPTY]
    ];

    const printBoard = () => {
        debug(boardArr);
    };

    const checkWin = () => {
    };

    return {
        printBoard,
        checkWin
    };
})();

gameBoard.printBoard();