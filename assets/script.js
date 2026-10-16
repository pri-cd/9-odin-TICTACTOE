const DEBUG = true;

function debug(...args) {
    if (DEBUG === true) {
        console.log(...args);
    }
}

const playerManager = (() => {

    let players =
    {
        player1: { name: "", mark: "" },
        player2: { name: "", mark: "" }
    }

    const initiateP1 = (name, mark) => {
        players.player1.name = name;
        players.player1.mark = mark;
    };

    const initiateP2 = (name, mark) => {
        players.player2.name = name;
        players.player2.mark = mark;
    };

    const ERR_SAME_NAME = "Error: Same names detected!";
    const ERR_NAME_LEN = "Error: Invalid name length!";
    const ERR_SAME_MARK = "Error: Same marks detected!";

    let ERR = false;
    let ERRStr = "";

    /**
     * This will verify and initiate players in game!-
     * @param {string} name1 
     * @param {string} mark1 
     * @param {string} name2 
     * @param {string} mark2 
     * @returns 
     */
    const initiatePlayers = (name1, mark1, name2, mark2) => {
        const p1Name = name1.trim();
        const p2Name = name2.trim();
        ERR = false;
        ERRStr = "";


        if (p1Name.length < 1 ||
            p2Name.length < 1
        ) {
            ERR = true;
            ERRStr = ERR_NAME_LEN;
            debug(ERRStr, ", ", p1Name.length, ", ", p2Name.length);
            return ERR;
        }

        if (p1Name === p2Name) {
            ERR = true;
            ERRStr = ERR_SAME_NAME;
            debug(ERRStr);
            return ERR;
        }

        if (mark1 === mark2) {
            ERR = true;
            ERRStr = ERR_SAME_MARK;
            debug(ERRStr);
            return ERR;
        }

        initiateP1(p1Name, mark1);
        initiateP2(p2Name, mark2);
        return ERR;
    }

    /**
     * Returns Errors if Any.
     */
    const getError = () => {
        return ERRStr;
    }

    const showPlayers = () => {
        if (!ERR) {
            debug("Name (P1): ", players.player1.name, ", Mark (P1): ", players.player1.mark);
            debug("Name (P2): ", players.player2.name, ", Mark (P2): ", players.player2.mark);
        }
    };

    /**
     * Returns player name based on the chosen player..!
     * @param {string} markChoice 
     */
    const getPlayerFromMark = (markChoice) => {
        for (let player in players) {
            if (players[player].mark === markChoice) {
                debug(players[player].name);
                return players[player].name;
            }
        }
    };

    return {
        initiatePlayers,
        showPlayers,
        getError,
        getPlayerFromMark,
    }

})();

const gameLogic = (() => {
    const choice = {
        X: 'X',
        O: 'O',
    };

    const EMPTY = null;

    let boardArr = [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];


    let status = {
        win: false,
        playerWhoWon: null,
    };

    const clearStatus = () => {
        status.win = false;
        status.playerWhoWon = null;
    };

    const printBoard = () => {
        debug(boardArr);
    };

    /**
     * 
     * @param {boardArr} boardMatrix 
     * @returns {boolean} win
     */
    const checkRowWin = (boardMatrix) => {
        return boardMatrix.some((singleRow) => {
            let win = singleRow.every((mark) => singleRow[0] === mark);
            if (win) {
                status.win = win;
                status.playerWhoWon = playerManager.getPlayerFromMark(singleRow[0]);
                debug("Win condition met: ", status.win, status.playerWhoWon);
            }
            return win;
        });
    };

    /**
     * This code is practically "transposing the matrix... that's all.
     * Note: I didn't replace it with .map().. because I understand my code!.
     * 
     * Then, sends data to checkRowWin() ---> 
     * @param {boardArr} boardMatrix 
     */
    const checkColWin = (boardMatrix) => {
        let colMatrix = [[], [], []];
        for (let innerArr in boardMatrix) {
            for (let index in boardMatrix[innerArr]) {
                colMatrix[innerArr].push(boardMatrix[index][innerArr]);
            }
        }
        debug("Transposed: ", colMatrix);
        return checkRowWin(colMatrix);
    };

    const checkStatus = () => {
        clearStatus();

        if (checkRowWin(boardArr)) {
            return;
        }

        if (checkColWin(boardArr)) {
            return;
        }

    };

    return {
        printBoard,
        checkStatus
    };
})();

const dialogManager = (() => {
    const ID_DIALOG_PLAYER_INP = "#player-dialog";
    const ID_DIALOG_ERR = "#dialog-error";
    const dialog = document.querySelector(ID_DIALOG_PLAYER_INP);
    const errEM = document.querySelector(ID_DIALOG_ERR);

    /**
     * Shows error in UI.
     * @param {string} ERRStr 
    */
    const showErrorUI = (ERRStr) => {
        if (errEM instanceof HTMLParagraphElement) {
            errEM.textContent = ERRStr;
        }
    };

    const clearErrorUI = () => {
        if (errEM instanceof HTMLParagraphElement) {
            errEM.textContent = "";
        }
    };

    const registerStartGame = () => {
        const ID_BTN_START_GAME = "#btn-start";
        const startBtn = document.querySelector(ID_BTN_START_GAME);

        startBtn.addEventListener('click', (event) => {
            if (dialog instanceof HTMLDialogElement) {
                dialog.showModal();
            }
        });
    };

    const registerSubmit = () => {
        const ID_BTN_SUBMIT_NAMES = "#btn-submit-p-names";
        const ID_INP_P1_NAME = "#player-1-name";
        const ID_INP_P2_NAME = "#player-2-name";
        const SL_INP_P1_MARK = ".radio-inp[name='p1-mark']:checked";
        const SL_INP_P2_MARK = ".radio-inp[name='p2-mark']:checked";

        const p1NameEM = document.querySelector(ID_INP_P1_NAME);
        const p2NameEM = document.querySelector(ID_INP_P2_NAME);
        
        const submitButton = document.querySelector(ID_BTN_SUBMIT_NAMES);
        submitButton.addEventListener('click', (event) => {
            if (dialog instanceof HTMLDialogElement) {
                /** Moved them inside the submit button.
                 ** Because, when I selected the Elements outside the submit button, 
                 ** It then kept getting the default state (because dialog didn't exist at that moment).
                 */
                const p1MarkEM = document.querySelector(SL_INP_P1_MARK);
                const p2MarkEM = document.querySelector(SL_INP_P2_MARK);

                if (p1NameEM instanceof HTMLInputElement &&
                    p2NameEM instanceof HTMLInputElement &&
                    p1MarkEM instanceof HTMLInputElement &&
                    p2MarkEM instanceof HTMLInputElement) {

                    if (!playerManager.initiatePlayers(
                        p1NameEM.value,
                        p1MarkEM.value,
                        p2NameEM.value,
                        p2MarkEM.value
                    )) {
                        playerManager.showPlayers();
                        p1NameEM.value = "";
                        p2NameEM.value = "";
                        clearErrorUI();
                        dialog.close();
                    }
                    else {
                        showErrorUI(playerManager.getError());
                    }
                }
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

dialogManager.registerDialog();
gameLogic.checkStatus();