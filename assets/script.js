const DEBUG = true;

function debug(...args) {
    if (DEBUG === true) {
        console.log(...args);
    }
}

const playerManager = (() => {

    let players =
    {
        initiated: false,
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
        players.initiated = true;
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

    const getPlayers = () => {
        if (players.initiated === true) {
            return players;
        }
        return undefined;
    };

    return {
        initiatePlayers,
        showPlayers,
        getError,
        getPlayerFromMark,
        getPlayers,
    }

})();

const gameLogic = (() => {

    let status = {
        win: false,
        playerWhoWon: null,
    };

    const clearStatus = () => {
        status.win = false;
        status.playerWhoWon = null;
    };

    /**
     * 
     * @param {Array} boardMatrix 
     * @returns {boolean} win
     */
    const checkRowWin = (boardMatrix) => {
        return boardMatrix.some((singleRow) => {
            let win = false;

            if (singleRow[0] != null) {
                win = singleRow.every((mark) => singleRow[0] === mark);
                if (win) {
                    status.win = win;
                    status.playerWhoWon = playerManager.getPlayerFromMark(singleRow[0]);
                    debug("Win condition met: ", status.win, status.playerWhoWon);
                }
            }
            return win;
        });
    };

    /**
     * This code is practically "transposing the matrix... that's all.
     * Note: I didn't replace it with .map().. because I understand my code!.
     * 
     * Then, sends data to checkRowWin() ---> 
     * @param {Array} boardMatrix 
     */
    const checkColWin = (boardMatrix) => {
        let colMatrix = [[], [], []];
        for (let innerArr in boardMatrix) {
            for (let index in boardMatrix[innerArr]) {
                colMatrix[innerArr].push(boardMatrix[index][innerArr]);
            }
        }
        return checkRowWin(colMatrix);
    };

    /**
     * Checks the win condition in diagonal cases...
     * The first loop gets.. top-left to bottom-right diagonal..
     * And, hardcoded the other side of diagonal..
     * @param {Array} boardMatrix 
     */
    const checkDiagWin = (boardMatrix) => {
        let diagMatrix = [[], []];

        for (let innerArr in boardMatrix) {
            diagMatrix[0].push(boardMatrix[innerArr][innerArr])
        }

        diagMatrix[1] = [boardMatrix[2][0], boardMatrix[1][1], boardMatrix[0][2]];
        return checkRowWin(diagMatrix);
    }

    /**
     * Checks If Board is in win condition..! 
     * @param {Array} boardArr 
     * @returns 
     */
    const checkStatus = (boardArr) => {
        clearStatus();

        if (checkRowWin(boardArr)) {
            return;
        }

        if (checkColWin(boardArr)) {
            return;
        }

        if (checkDiagWin(boardArr)) {
            return;
        }
    };

    return {
        checkStatus
    };
})();

const boardManager = (() => {
    const ID_GAME_BOARD = "#gameBoard";
    const ID_TURN_MSG = "#board-turn";
    const MSG_PLAYER_TURN = "'s Turn";

    let turnSystem = {
        prevTurn: undefined,
        currTurn: undefined,
        currPlyr: undefined,
        prevMark: '',
    };

    const turnMsgEM = document.querySelector(ID_TURN_MSG);

    const EMPTY = null;
    let boardArr = [
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY],
        [EMPTY, EMPTY, EMPTY]
    ];

    const resetTurnSystem = () => {
        turnSystem.prevTurn = undefined;
        turnSystem.currTurn = undefined;
        turnSystem.currPlyr = undefined;

        turnMsgEM.textContent = "";
    };

    const getBoard = () => {
        return boardArr;
    };

    /**
      * 
      * @param {HTMLButtonElement} target 
      * @returns 
      */
    const handleTurnSystem = (target = null) => {

        const players = playerManager.getPlayers();
        if (!turnSystem.currPlyr && target === null) {
            /**
             * This is when the system is starting for the first time we start with Player 1
             * As, the first playable...
             */

            debug("Initiating Turn System!-");
            if (turnMsgEM instanceof HTMLParagraphElement) {
                turnMsgEM.textContent = players.player1.name + MSG_PLAYER_TURN;
                turnSystem.currPlyr = players.player1.name;
                return;
            }
        }

        if (turnSystem.currPlyr === players.player1.name) {
            turnMsgEM.textContent = players.player2.name + MSG_PLAYER_TURN;
            turnSystem.prevTurn = turnSystem.currPlyr;

            turnSystem.prevMark = players.player1.mark;
            turnSystem.currPlyr = players.player2.name;
            debug("Prev Turn: Player1. Now, Player2's Turn..!");
            return;
        }

        if (turnSystem.currPlyr === players.player2.name) {
            turnMsgEM.textContent = players.player1.name + MSG_PLAYER_TURN;
            turnSystem.prevTurn = turnSystem.currPlyr;

            turnSystem.prevMark = players.player2.mark;
            turnSystem.currPlyr = players.player1.name;
            debug("Prev Turn: Player2. Now, Player1's Turn..!");
            return;
        }
    };


    /**
     * 
     * @param {HTMLButtonElement} target 
     */
    const registerArea = (target) => {
        const getIndex = target.dataset.index;
        const index = Array(Number(getIndex.split('|')[0]), Number(getIndex.split('|')[1]));
        debug("Registering Area, ", index, ", Turn (Name): ", turnSystem.prevTurn, ", With: ", turnSystem.prevMark);

        boardArr[index[0]][index[1]] = turnSystem.prevMark;
        debug(boardArr);
    };


    /**
     * The event handler for when the user clicks on the grid-!
     * @param {Event} event 
     */
    const handlePlayerClick = (event) => {
        const target = event.target;
        if (target instanceof HTMLButtonElement) {
            debug("Cell Pressed: ", target);
            handleTurnSystem(target);
            registerArea(target);
            gameLogic.checkStatus(boardArr);
        }
    };

    /**
     * This registers- the gameBoard with ---> click listeners! 
     * Called for the first time when the game is starting, 
     * After dialog is submmitted!..
     * 
     */
    const registerGameBoard = () => {
        const board = document.querySelector(ID_GAME_BOARD);
        board.addEventListener('click', handlePlayerClick);
    };

    return {
        registerGameBoard,
        handleTurnSystem,
        getBoard,
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
                        boardManager.registerGameBoard();
                        boardManager.handleTurnSystem();

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
gameLogic.checkStatus(boardManager.getBoard());