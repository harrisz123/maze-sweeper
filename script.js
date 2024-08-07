const boardSize = 8;
const trapCount = 10;
let board = [];
let playerPosition = { row: 0, col: 0 };
let exitPosition = { row: 0, col: 0 };
let moveCount = 0;
let scansLeft = 3;
let gameOver = false;

const gameBoard = document.getElementById('game-board');
const moveCountDisplay = document.getElementById('move-count');
const scansLeftDisplay = document.getElementById('scans-left');
const newGameButton = document.getElementById('new-game');
const scanButton = document.getElementById('scan');

newGameButton.addEventListener('click', startNewGame);
scanButton.addEventListener('click', scan);
gameBoard.addEventListener('click', handleCellClick);

function createBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    moveCount = 0;
    scansLeft = 3;
    gameOver = false;
    
    playerPosition = { row: 0, col: 0 };
    
    do {
        exitPosition = {
            row: Math.floor(Math.random() * boardSize),
            col: Math.floor(Math.random() * boardSize)
        };
    } while (exitPosition.row === 0 && exitPosition.col === 0);
    
    let trapsPlaced = 0;
    while (trapsPlaced < trapCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (board[row][col] !== 'T' && (row !== 0 || col !== 0) && (row !== exitPosition.row || col !== exitPosition.col)) {
            board[row][col] = 'T';
            trapsPlaced++;
        }
    }
    
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            if (board[row][col] !== 'T') {
                board[row][col] = countAdjacentTraps(row, col);
            }
        }
    }
}

function countAdjacentTraps(row, col) {
    let count = 0;
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (board[newRow][newCol] === 'T') {
                    count++;
                }
            }
        }
    }
    return count;
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            if (row === playerPosition.row && col === playerPosition.col) {
                cell.classList.add('player');
            }
            if (row === exitPosition.row && col === exitPosition.col) {
                cell.classList.add('exit');
                cell.textContent = '🚪';
            }
            gameBoard.appendChild(cell);
        }
    }
    updateGameStatus();
}

function handleCellClick(event) {
    if (gameOver) return;

    const target = event.target;
    if (!target.classList.contains('cell')) return;

    const row = parseInt(target.dataset.row);
    const col = parseInt(target.dataset.col);

    if (Math.abs(row - playerPosition.row) <= 1 && Math.abs(col - playerPosition.col) <= 1) {
        movePlayer(row, col);
    } else {
        showMessage("You can only move to adjacent cells!");
    }
}

function movePlayer(row, col) {
    const cell = gameBoard.children[row * boardSize + col];

    if (board[row][col] === 'T') {
        cell.classList.add('trap');
        cell.textContent = '💥';
        gameOver = true;
        endGame(false);
    } else {
        playerPosition = { row, col };
        moveCount++;
        renderBoard();

        if (row === exitPosition.row && col === exitPosition.col) {
            gameOver = true;
            endGame(true);
        }
    }
}

function scan() {
    if (scansLeft > 0 && !gameOver) {
        scansLeft--;
        moveCount++;
        updateGameStatus();

        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                const newRow = playerPosition.row + r;
                const newCol = playerPosition.col + c;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    const cell = gameBoard.children[newRow * boardSize + newCol];
                    cell.classList.add('revealed');
                    if (board[newRow][newCol] === 'T') {
                        cell.textContent = '!';
                    } else {
                        cell.textContent = board[newRow][newCol];
                    }
                }
            }
        }
    } else {
        showMessage("No scans left!");
    }
}

function endGame(win) {
    if (win) {
        showMessage(`Congratulations! You escaped in ${moveCount} moves!`);
    } else {
        showMessage('Game Over! You hit a trap.');
    }
}

function updateGameStatus() {
    moveCountDisplay.textContent = `Moves: ${moveCount}`;
    scansLeftDisplay.textContent = `Scans: ${scansLeft}`;
}

function startNewGame() {
    createBoard();
    renderBoard();
}

function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translateX(-50%)';
    messageElement.style.backgroundColor = 'rgba(0,0,0,0.8)';
    messageElement.style.color = 'white';
    messageElement.style.padding = '10px 20px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '1000';
    document.body.appendChild(messageElement);
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

startNewGame();
