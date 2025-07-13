const cells = document.querySelectorAll(".cell");
const statusElement = document.getElementById("status");
const resetGame = document.getElementById("resetGame");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const xState = document.getElementById("xState");
const oState = document.getElementById("oState");
const audio = document.getElementById("audio");
const board = Array(9).fill(null);
let gameOver = false;
let xWon;
let oWon;
let isSoundOn = true;

resetScore();
statusElement.innerHTML = `It's X's turn`;

addEventListener("DOMContentLoaded", () => {
    xWon = +localStorage.getItem("x-winner") ?? 0;
    oWon = +localStorage.getItem("o-winner") ?? 0;
    xState.innerText = xWon;
    oState.innerText = oWon;
})

function turnOf() {
    let x = 0;
    let o = 0;

    for (const tile of board) {
        if (tile === "x") x++;
        if (tile === "o") o++;
    }
    if (x + o === 9) { return null };

    return x <= o ? "x" : "o";
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const [a, b, c] of winPatterns) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
}

function handleCellClick(e) {
    const currentTurn = turnOf();
    const index = +e.target.getAttribute("data");

    if (gameOver) { return; }
    if (board[index]) { return; }
    if (!currentTurn) { return; }

    board[index] = currentTurn;

    e.target.innerText = currentTurn;
    e.target.classList.add(currentTurn);

    const winner = checkWinner();

    if (winner) {
        if (winner === "x") { xWon++ };
        if (winner === "o") { oWon++ };

        localStorage.setItem("x-winner", xWon);
        localStorage.setItem("o-winner", oWon);

        xState.innerText = xWon;
        oState.innerText = oWon;

        gameOver = true;
        playSound("./sounds/success.mp3")
        Swal.fire({
            title: `${winner.toUpperCase()} won! 🎉`,
            text: "Want to play again and beat your record?",
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Play Again',
            cancelButtonText: 'Close'
        }).then((result) => {
            if (result.isConfirmed) {
                resetBoard();
            }
        });

        statusElement.innerText = ``;
        return;
    }

    if (!winner && board.every(cell => cell !== null)) {
        gameOver = true;
        playSound("./sounds/success.mp3")
        Swal.fire({
            title: `It's a draw!`,
            text: "Would you like to try again?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Try Again',
            cancelButtonText: 'Close'
        }).then((result) => {
            if (result.isConfirmed) {
                resetBoard();
            }
        });

        statusElement.innerText = ``;
        return;
    }

    if (!gameOver) {
        const nextTurn = turnOf();
        statusElement.innerText = `It's ${nextTurn.toUpperCase()}'s turn`;
    }
};

function playSound(audioFilePath) {
    if (!isSoundOn) return;

    const sound = new Audio(audioFilePath);
    sound.play();
};

function resetBoard() {
    board.fill(null);
    gameOver = false;
    statusElement.innerHTML = `It's X's turn`;
    cells.forEach((cell) => {
        cell.innerHTML = "";
        cell.classList.remove("x", "o");
    })
};

function resetScore() {
    xWon = 0;
    oWon = 0;

    localStorage.setItem("x-winner", 0);
    localStorage.setItem("o-winner", 0);

    xState.innerText = xWon;
    oState.innerText = oWon;

    resetBoard();
};

audio.addEventListener("click", () => {
    isSoundOn = !isSoundOn;
    audio.src = isSoundOn ? "./images/volume-up-fill.svg" : "./images/volume-mute-fill.svg";
});

resetGame.addEventListener("click", resetBoard)

resetScoreBtn.addEventListener("click", resetScore);

cells.forEach((cell) => {
    cell.addEventListener("click", handleCellClick);
})

