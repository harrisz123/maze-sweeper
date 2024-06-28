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

function createBoard() {
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));
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
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
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
        gameOver = true
      
