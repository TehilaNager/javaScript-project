const audio = document.querySelector(".audio");
const gameOver = document.querySelector(".game-over");
const theQuestion = document.querySelector(".the-question");
const theCategory = document.querySelector(".category");
const answersBox = document.querySelector(".answers-box");
const currentScore = document.querySelector(".current-score");
const numberQuestion = document.querySelector(".numberQuestion");
const seconds = document.querySelector(".seconds");

let isSoundOn = true;
let allQuestions = [];
let currentIndex = 0;
let totalScore = 0;
let mistakesCount = 0;
let timerInterval;
let remaining;

window.onload = () => {
    const selectedTime = localStorage.getItem("time");
    const timeOnly = selectedTime.split(": ")[1];

    Swal.fire({
        title: 'Game Instructions',
        html: `
        <p>To complete the game:</p>
        <p>✅ You can make up to <strong>3 mistakes</strong>.</p>
        <p>⏱️ Time per question: <strong>${timeOnly}</strong>.</p>
        <p>🎯 10 questions, 10 points each.</p>
      `,
        icon: 'info',
        confirmButtonText: 'Let\'s Start!',
        confirmButtonColor: '#ff7e5f',
        customClass: {
            popup: 'clean-popup'
        }
    }).then(() => {
        document.getElementById("game-area").style.display = "block";
        startGame();
    });
};

function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
};

async function startGame() {
    currentScore.innerHTML = 0;
    allQuestions = await getQuestions();

    if (!allQuestions) {
        Swal.fire({
            icon: "error",
            title: "Oops!",
            text: "Failed to load questions. Please refresh the page.",
        });
        return;
    };

    currentIndex = 0;
    showQuestion();
};

function startTimer() {
    clearInterval(timerInterval);

    const timeStr = localStorage.getItem("time") || "Easy: 20 seconds";
    const timeInSec = parseInt(timeStr.match(/\d+/)) || 20;

    if (remaining === undefined) {
        remaining = timeInSec;
    }

    seconds.textContent = `00:${String(remaining).padStart(2, "0")}`;

    timerInterval = setInterval(() => {
        remaining--;
        seconds.textContent = `00:${String(remaining).padStart(2, "0")}`;

        if (remaining <= 0) {
            clearInterval(timerInterval);
            playSound("../sounds/finishTime.mp3");

            Swal.fire({
                title: '⏰ Time\'s up!',
                text: 'Moving to next question.',
                icon: 'warning',
                timer: 2000,
                showConfirmButton: false,
                toast: true,
                position: 'top'
            }).then(() => {
                currentIndex++;
                showQuestion();
            });
        }
    }, 1000);
};

async function getQuestions() {
    const difficulty = localStorage.getItem("level").toLowerCase();
    const category = localStorage.getItem("category");

    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}`);
            const questions = await response.json();

            if (questions.response_code === 0 && questions.results.length > 0) {
                return questions.results;
            }
        } catch (error) {
            console.log(error);
        }

        if (i === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Trying again...',
                text: 'There was a problem loading the questions. Trying again...',
                timer: 1500,
                showConfirmButton: false,
            });
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    return null;
};

function showQuestion() {
    if (currentIndex >= allQuestions.length) {
        endGame();
        return;
    };

    const timeStr = localStorage.getItem("time") || "Easy: 20 seconds";
    remaining = parseInt(timeStr.match(/\d+/)) || 20;

    const ques = allQuestions[currentIndex];

    answersBox.innerHTML = "";
    theQuestion.innerHTML = decodeHTML(ques.question);
    theCategory.innerHTML = decodeHTML(ques.category);

    numberQuestion.innerHTML = currentIndex + 1;

    let answers = [...ques.incorrect_answers, ques.correct_answer];
    const sortedAnswers = answers.sort(() => Math.random() - 0.5);

    sortedAnswers.forEach((answer, i) => {
        const div = document.createElement("div");
        div.classList.add("answer");
        div.innerHTML = `
                <div><span class="numberAnswer">${i + 1}.</span> <span class="textAnswer">${decodeHTML(answer)}</span></div>
        `;

        div.addEventListener("click", () => {
            div.classList.add("touched");
            checkAnswer();
        });
        answersBox.appendChild(div);
    });

    startTimer();
};

function checkAnswer() {
    clearInterval(timerInterval);

    const answerCorrect = decodeHTML(allQuestions[currentIndex].correct_answer);
    const answerUserDiv = document.querySelector(".touched");
    const answerUser = answerUserDiv.querySelector(".textAnswer").textContent.trim();

    if (answerCorrect === answerUser) {
        answerUserDiv.classList.add("is-valid");
        playSound("../sounds/correctAnswer.mp3");
        Swal.fire({
            title: 'Correct! ✅',
            text: 'Well done!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            position: 'top',
            toast: true
        }).then(() => {
            currentIndex++;
            showQuestion();
        });
        totalScore += 10;
        currentScore.innerHTML = totalScore;
    } else {
        answerUserDiv.classList.add("is-invalid");
        playSound("../sounds/wrongAnswer.mp3")
        mistakesCount++;

        if (mistakesCount >= 3) {
            endGame();
            return;
        }

        Swal.fire({
            title: 'Oops... ❌',
            text: 'Incorrect answer',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false,
            position: 'top',
            toast: true
        }).then(() => {
            currentIndex++;
            showQuestion();
        });
    }
};

function endGame() {
    clearInterval(timerInterval);

    const playAgainBtnHTML = `<button class="btn-play-again">Play Again</button>`;
    const goHomeBtnHTML = `<button class="btn-play-again btn-go-home">Go to Home</button>`;

    if (totalScore >= 70) {
        playSound("../sounds/success.mp3")
        Swal.fire({
            icon: 'success',
            title: 'You passed the test! 😀',
            html: `
              <p class="score">Your final score: <span class="theScore">${totalScore}</span></p>
              ${playAgainBtnHTML}
              ${goHomeBtnHTML}
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                document.querySelector(".btn-play-again").addEventListener("click", () => {
                    location.reload();
                });
                document.querySelector(".btn-go-home").addEventListener("click", () => {
                    window.location.href = 'trivia.html';
                });
            }
        });
    } else {
        playSound("../sounds/failure.wav")
        Swal.fire({
            icon: 'error',
            title: 'You didn’t pass 🙁',
            html: `
              <p>You made 3 mistakes, so the game ended.</p>
              <p>Don't worry, try again!</p>
              <p class="score">Your final score: <span class="theScore">${totalScore}</span></p>
              ${playAgainBtnHTML}
              ${goHomeBtnHTML}
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                document.querySelector(".btn-play-again").addEventListener("click", () => {
                    location.reload();
                });
                document.querySelector(".btn-go-home").addEventListener("click", () => {
                    window.location.href = 'trivia.html';
                });
            }
        });
    }
};

function playSound(audioFilePath) {
    if (!isSoundOn) return;

    const sound = new Audio(audioFilePath);
    sound.play();
};

audio.addEventListener("click", () => {
    isSoundOn = !isSoundOn;
    audio.src = isSoundOn ? "../images/volume-up-fill.svg" : "../images/volume-mute-fill.svg";
});

gameOver.addEventListener("click", () => {
    clearInterval(timerInterval);

    Swal.fire({
        showConfirmButton: false,
        showCloseButton: false,
        showCancelButton: false,
        html: `
        <div class="popup-buttons">
          <button class="popup-btn finish-btn">
            Finish Game <i class="fas fa-arrow-right"></i>
          </button>
          <button class="popup-btn restart-btn">
            Restart <i class="fas fa-rotate-right"></i>
          </button>
          <button class="popup-btn instructions-btn">
            Instructions <i class="fas fa-book-open"></i>
          </button>
          <button class="popup-btn cancel-btn">
            Cancel <i class="fas fa-times"></i>
          </button>
        </div>
      `,
        customClass: {
            popup: 'clean-popup',
        },
        didOpen: () => {
            document.querySelector('.finish-btn').addEventListener('click', () => {
                window.location.href = 'trivia.html';
                Swal.close();
            });
            document.querySelector('.restart-btn').addEventListener('click', () => {
                Swal.close();
                startGame();
            });
            document.querySelector('.cancel-btn').addEventListener('click', () => {
                Swal.close();
                startTimer();
            });
            document.querySelector('.instructions-btn').addEventListener('click', () => {
                Swal.fire({
                    title: '<div class="swal-title-center">Welcome to the Trivia Game! 🎉</div>',
                    html: `
                      <div style="text-align:left; direction:ltr; font-size:16px">
                        <p>In this interactive game, you'll answer 10 consecutive multiple-choice questions based on the topics you choose in advance. This is your chance to test your knowledge and have fun along the way!</p>
                  
                        <h3>🎮 How to play?</h3>
                        <ul>
                          <li><strong>Category</strong> – e.g. Music, History, Science, and more</li>
                          <li><strong>Difficulty level</strong> – Easy / Medium / Hard</li>
                          <li><strong>Time limit</strong> – the shorter the time, the more challenging the game</li>
                        </ul>
                  
                        <h4>⏱️ Time options per question:</h4>
                        <ol>
                          <li>Easy: 20 seconds</li>
                          <li>Medium: 15 seconds</li>
                          <li>Hard: 10 seconds</li>
                          <li>Very Hard: 5 seconds</li>
                        </ol>
                  
                        <h3>📋 Game rules:</h3>
                        <ul>
                          <li>The game includes 10 questions</li>
                          <li>You are allowed up to <strong>3 mistakes</strong> – after the 4th mistake, the game ends</li>
                          <li>If you don't answer on time – it's counted as a mistake</li>
                          <li>Each correct answer = 10 points</li>
                          <li>Maximum score: 100 points</li>
                        </ul>
                  
                        <p>You can select an answer by clicking with your mouse or pressing keys 1–4 on your keyboard.</p>
                  
                        <h3>🎛️ Clicked on the "End Game" button?</h3>
                        <p>You will see a popup with 4 options:</p>
                        <ul>
                          <li>📖 <strong>Instructions</strong> – view the game instructions again</li>
                          <li>🔁 <strong>Restart</strong> – start the game from the beginning</li>
                          <li>🏠 <strong>Go to Home</strong> – change the category, difficulty or time</li>
                          <li>❌ <strong>Cancel</strong> – return to the current game where you left off</li>
                        </ul>
                  
                        <p style="margin-top:10px"><strong>Good luck – and enjoy the challenge! 💡🧠</strong></p>
                      </div>
                    `,
                    confirmButtonText: 'Close',
                    customClass: {
                        popup: 'custom-swal-popup',
                        confirmButton: 'swal-button-ltr'
                    }
                }).then(() => {
                    startTimer();
                });
            });
        }
    });
});

document.addEventListener("keydown", (e) => {
    const key = e.key;

    if (["1", "2", "3", "4"].includes(key)) {
        const index = parseInt(key) - 1;
        const allAnswers = document.querySelectorAll(".answer");
        const selected = allAnswers[index];

        if (selected) {
            selected.classList.add("touched");
            checkAnswer();
        }
    }
});


