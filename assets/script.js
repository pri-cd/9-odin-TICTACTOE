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

    const resetPlayerManager = () => {
        ERR = false;
        ERRStr = "";

        players.initiated = false;
        players.player1.name = "";
        players.player1.mark = "";
        players.player2.name = "";
        players.player2.mark = "";
    };

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
        resetPlayerManager,
    }

})();

const gameLogic = (() => {

    let status = {
        win: false,
        draw: false,
        playerWhoWon: null,
        mark: '',
    };

    const resetStatus = () => {
        status.win = false;
        status.draw = false;
        status.playerWhoWon = null;
        status.mark = "";
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
                    status.mark = singleRow[0];
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
        for (let [rowIdx, innerRow] of boardMatrix.entries()) {
            for (let [colIdx, mark] of innerRow.entries()) {
                colMatrix[colIdx].push(mark);
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

        diagMatrix[0] = boardMatrix.map((innerArr, index) => {
            return innerArr[index];
        });

        diagMatrix[1] = [boardMatrix[2][0], boardMatrix[1][1], boardMatrix[0][2]];
        return checkRowWin(diagMatrix);
    }

    /**
     * Checks If Board is in win condition..! 
     * @param {Array} boardArr 
     * @returns (If user wins!)..
     */
    const checkStatus = (boardArr) => {
        resetStatus();
        let win = false;

        do {
            if (checkRowWin(boardArr)) {
                win = true;
                break;
            }

            if (checkColWin(boardArr)) {
                win = true;
                break;
            }

            if (checkDiagWin(boardArr)) {
                win = true;
                break;
            }

            if (boardManager.getCount() === 9) {
                win = false;
                status.win = win;
                status.draw = true;
                break;
            }
        } while (false);

        return win;
    };

    const getBoardStatus = () => {
        return status;
    };

    return {
        checkStatus,
        getBoardStatus,
        resetStatus,
    };
})();

const boardManager = (() => {
    const ID_GAME_BOARD = "#gameBoard";
    const ID_TURN_MSG = "#board-turn";
    const MSG_PLAYER_TURN = "'s Turn";

    let turnSystem = {
        count: 0,
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

    const getBoard = () => {
        return boardArr;
    };

    /**
      * 
      * @param {HTMLButtonElement} target 
      * @returns results
      */
    const handleTurnSystem = (target = null) => {
        const players = playerManager.getPlayers();
        let successInteraction = false;

        do {
            if (!turnSystem.currPlyr && target === null) {
                /**
                 * This is when the system is starting for the first time 
                 * we start with Player 1 -> As, the first playable...
                 */
                debug("Initiating Turn System!-");
                if (turnMsgEM instanceof HTMLParagraphElement) {
                    turnMsgEM.textContent = players.player1.name + MSG_PLAYER_TURN;
                    turnSystem.currPlyr = players.player1.name;
                    successInteraction = true;
                    break;
                }
            }

            if (target.textContent === "") {
                /**
                 * > "target.textContent == EMPTY" this condition is here, 
                 * > Because, If- the cell is already holding a symbol, we don't touch it!..
                 */
                if (turnSystem.currPlyr === players.player1.name) {
                    turnMsgEM.textContent = players.player2.name + MSG_PLAYER_TURN;
                    turnSystem.prevTurn = turnSystem.currPlyr;

                    turnSystem.prevMark = players.player1.mark;
                    turnSystem.currPlyr = players.player2.name;
                    debug("Prev Turn: Player1. Now, Player2's Turn..!");
                    successInteraction = true;
                    break;
                }

                if (turnSystem.currPlyr === players.player2.name) {
                    turnMsgEM.textContent = players.player1.name + MSG_PLAYER_TURN;
                    turnSystem.prevTurn = turnSystem.currPlyr;

                    turnSystem.prevMark = players.player2.mark;
                    turnSystem.currPlyr = players.player1.name;
                    debug("Prev Turn: Player2. Now, Player1's Turn..!");
                    successInteraction = true;
                    break;
                }
            }
        } while (false);
        return successInteraction;
    };

    /**
     * 
     * @param {HTMLButtonElement} target 
     */
    const registerArea = (target) => {
        const getIndex = target.dataset.index;
        const index = Array(Number(getIndex.split('|')[0]), Number(getIndex.split('|')[1]));

        if (boardArr[index[0]][index[1]] === EMPTY) {
            boardArr[index[0]][index[1]] = turnSystem.prevMark;
            target.textContent = turnSystem.prevMark;
            ++turnSystem.count;
        }
        debug(boardArr);
    };

    /**
     * 
     * @param {HTMLButtonElement} target 
     */
    const handleTurn = (target) => {
        if (handleTurnSystem(target)) {
            registerArea(target);
        }
    };

    /**
     * The event handler for when the user clicks on the grid-!
     * @param {Event} event 
     */
    const handlePlayerClick = (event) => {
        const target = event.target;
        if (target instanceof HTMLButtonElement) {
            debug("Cell Pressed: ", target);
            handleTurn(target);

            /** 
             * @Info: If the user wins.. 
             * we'll have to stop the loop and, print the winner!.. 
             */
            const winCondition = gameLogic.checkStatus(boardArr);
            const status = gameLogic.getBoardStatus();

            if (winCondition) {
                debug("A Player: ", status.playerWhoWon, " has won! with Mark: ", status.mark);
                dialogManager.gameOverDialogHandler();
                debug("Resetting board!");
            }
            else {
                if (status.draw) {
                    debug("A draw has occured!");
                    dialogManager.gameOverDialogHandler();
                }
            }
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

    const getCount = () => {
        return turnSystem.count;
    };

    const resetTurnSystem = () => {
        turnSystem.prevTurn = undefined;
        turnSystem.currTurn = undefined;
        turnMsgEM.textContent = "";
        turnSystem.currPlyr = undefined;
        turnSystem.count = 0;
    };

    const resetBoardMarks = () => {
        const gameBoard = document.querySelector(ID_GAME_BOARD);
        const allCells = Array.from(gameBoard.querySelectorAll('button'));
        for (let cell of allCells) {
            if (cell instanceof HTMLButtonElement) {
                cell.textContent = "";
            }
        }
    };

    const unregisterGameArea = () => {
        const board = document.querySelector(ID_GAME_BOARD);
        board.removeEventListener('click', handlePlayerClick);
    };

    const resetBoard = () => {
        resetTurnSystem();
        playerManager.resetPlayerManager();
        gameLogic.resetStatus();
        boardArr = [
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY],
            [EMPTY, EMPTY, EMPTY]
        ];
        resetBoardMarks();
        unregisterGameArea();
    };

    return {
        registerGameBoard,
        handleTurnSystem,
        getBoard,
        resetBoard,
        getCount,
    };
})();

const dialogManager = (() => {
    const ID_DIALOG_PLAYER_INP = "#player-dialog";
    const ID_DIALOG_ERR = "#dialog-error";
    const ID_DIALOG_PLAYER_WIN = "#player-win-dialog";

    const winDialog = document.querySelector(ID_DIALOG_PLAYER_WIN);
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

    const registergameOverDialogListener = () => {
        const ID_BTN_DIALOG_CLOSE = "#close-win-dialog";
        const winDialogCloseBTN = document.querySelector(ID_BTN_DIALOG_CLOSE);
        winDialogCloseBTN.addEventListener('click', (event) => {
            winDialog.close();
            boardManager.resetBoard();
        });
    };

    const gameOverDialogHandler = () => {
        const ID_IMG_HOLDER = "#game-result-img";
        const ID_RESULT_HOLDER = "#game-result-msg";

        const IMG_PATH_WIN = "./assets/icons/win.png";
        const IMG_PATH_DRW = "./assets/icons/draw.png";

        const resultMessageEM = document.querySelector(ID_RESULT_HOLDER);
        const imgHolder = document.querySelector(ID_IMG_HOLDER);

        const boardStatus = gameLogic.getBoardStatus();

        if (boardStatus.draw) {
            imgHolder.setAttribute('src', IMG_PATH_DRW);
            resultMessageEM.textContent = "Draw!";
        }
        else {
            if (boardStatus.win) {
                imgHolder.setAttribute('src', IMG_PATH_WIN);
                resultMessageEM.textContent = `Player: ${boardStatus.playerWhoWon} won the game!!`
            }
        }

        if (winDialog instanceof HTMLDialogElement) {
            winDialog.showModal();
        }
    };

    const registerDialog = () => {
        registerStartGame();
        registergameOverDialogListener();
        registerSubmit();
    };


    return {
        registerDialog,
        clearErrorUI,
        gameOverDialogHandler,
    };
})();

dialogManager.registerDialog();