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

    return {
        printBoard
    };
})();

const dialogManager = (() => {
    const ID_DIALOG_PLAYER_INP = "#player-dialog";
    const dialog = document.querySelector(ID_DIALOG_PLAYER_INP);

    const registerStartGame = () => {
        const ID_BTN_START_GAME = "#btn-start";
        const startBtn = document.querySelector(ID_BTN_START_GAME);

        startBtn.addEventListener('click', (event) => {
            if (dialog instanceof HTMLDialogElement) {
                debug("Opening dialog!");
                dialog.showModal();
            }
        });
    };

    const registerSubmit = () => {
        const ID_BTN_SUBMIT_NAMES = "#btn-submit-p-names";
        const ID_INP_P1_NAME = "#player-1-name";
        const ID_INP_P2_NAME = "#player-2-name";

        const p1Name = document.querySelector(ID_INP_P1_NAME);
        const p2Name = document.querySelector(ID_INP_P2_NAME);
        const submitButton = document.querySelector(ID_BTN_SUBMIT_NAMES);

        submitButton.addEventListener('click', (event) => {
            if (dialog instanceof HTMLDialogElement) {

                if (p1Name instanceof HTMLInputElement && p2Name instanceof HTMLInputElement) {
                    debug("Players name: ", p1Name.value, ", ", p2Name.value, "!! Also, clearing names from UI!");
                    p1Name.value = "";
                    p2Name.value = ""
                }

                debug("Closing dialog!");
                dialog.close();
            }
        });
    };

    const registerDialog = () => {
        registerStartGame();
        registerSubmit();
    };


    return {
        registerDialog
    };
})();

gameBoard.printBoard();
dialogManager.registerDialog();