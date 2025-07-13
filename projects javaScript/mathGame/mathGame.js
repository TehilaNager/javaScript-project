const helpIcon = document.querySelector(".help-icon");
const exercise = document.getElementById("exercise");
const answerInput = document.getElementById("answerInput");
const btnCheck = document.querySelector(".btnCheck");
const btnNext = document.querySelector(".btnNext");
const answerRows = document.getElementById("answerRows");
const scoreTotal = document.getElementById("scoreTotal");
const audio = document.getElementById("audio");

let isSoundOn = true;
let operator = "+";
let range = "0-10";
let totalScore = 0;
let currentNum1, currentNum2, rightAnswer;

window.addEventListener("load", () => {
    createExercise();
});

helpIcon.addEventListener("click", () => {
    Swal.fire({
        title: 'ברוכים הבאים!',
        html: `
        <div style="text-align: right; direction: rtl;">
            <p>👋 עליך לבחור פעולה חשבונית וטווח מספרים.</p>
            <p>✏️ התרגילים כוללים רק מספרים שלמים, אך התשובות עשויות להיות עשרוניות.</p>
            <p>🔢 לאחר מכן יופיע תרגיל – הכנס תשובה ולחץ על "בדוק".</p>
            <p>✅ תשובה נכונה = 10 נקודות</p>
            <p>❌ תשובה לא נכונה = 0 נקודות</p>
            <p>📊 כל תרגיל, תשובה, ותוצאה יוצגו בטבלה למטה.</p>
            <p>➡️ ניתן ללחוץ על "הבא" כדי לדלג לתרגיל חדש.</p>
        </div>
        `,
        icon: 'info',
        confirmButtonText: 'הבנתי 👍',
        confirmButtonColor: '#0b5fc0'
    });
});

document.getElementById("operatorSelect").addEventListener("change", (e) => {
    operator = e.target.value;
    createExercise();
});

document.getElementById("rangeSelect").addEventListener("change", (e) => {
    range = e.target.value;
    createExercise();
});

function getNumberRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function createExercise() {
    const rangeArr = range.split("-");

    const min = parseInt(rangeArr[0]);
    const max = parseInt(rangeArr[1]);

    let num1, num2;

    if (operator === "+" || operator === "*") {
        num1 = getNumberRandom(min, max);
        num2 = getNumberRandom(min, max);
    }

    if (operator === "-") {
        num1 = getNumberRandom(min, max);
        num2 = getNumberRandom(min, num1);
        if (num2 > num1) [num1, num2] = [num2, num1];
    }

    if (operator === "/") {
        let valid = false;

        while (!valid) {
            num2 = getNumberRandom(min === 0 ? 1 : min, max);
            let result = getNumberRandom(min, max);
            num1 = num2 * result;

            if (num1 <= max) {
                valid = true;
            }
        }
    };

    currentNum1 = num1;
    currentNum2 = num2;

    exercise.innerHTML = `${num1}${operator}${num2}=`;
};

function checkAnswer(num1, operator, num2) {
    const userAnswer = parseFloat(answerInput.value);
    const answerValue = answerInput.value.trim();

    if (!answerValue) {
        playSound("./sounds/wrongAnswer.mp3")
        Swal.fire({
            icon: 'warning',
            title: 'שגיאה',
            text: 'אנא הזן תשובה לפני הלחיצה על הכפתור.',
            confirmButtonText: 'אישור'
        });
        return;
    }

    if (isNaN(userAnswer)) {
        playSound("./sounds/wrongAnswer.mp3")
        Swal.fire({
            icon: 'error',
            title: 'שגיאה! ❌',
            html: '<h3 style="color: #c0392b;">יש להכניס מספר בלבד</h3><p>אנא נסה/י שוב עם ערך תקין 😊</p>',
            background: '#fff0f0',
            color: '#2c3e50',
            confirmButtonText: 'הבנתי',
            confirmButtonColor: '#e74c3c',
            customClass: {
                popup: 'swal-wide'
            }
        });
        answerInput.value = "";
        return;
    };

    if (operator === "+") {
        rightAnswer = num1 + num2
    } else if (operator === "-") {
        rightAnswer = num1 - num2
    } else if (operator === "*") {
        rightAnswer = num1 * num2
    } else if (operator === "/") {
        rightAnswer = num1 / num2
    }

    rightAnswer = Math.round(rightAnswer * 100) / 100;

    if (Math.abs(userAnswer - rightAnswer) < 0.0001) {
        playSound("./sounds/correctAnswer.mp3")
        Swal.fire({
            icon: 'success',
            title: 'כל הכבוד! 🎉',
            html: '<h3 style="color: #27ae60;">פתרת נכון!</h3><p ממש מרשים, המשך כך! 👏</p>',
            background: '#f0fff0',
            color: '#2c3e50',
            confirmButtonText: 'יאללה, ממשיכים 🚀',
            confirmButtonColor: '#27ae60',
            customClass: {
                popup: 'swal-success'
            }
        });
        addAnswerRow(10);
        answerInput.value = "";
        createExercise();
    } else {
        playSound("./sounds/failure.wav");
        addAnswerRow(0);
        Swal.fire({
            icon: 'error',
            title: 'אופס! 🤔',
            html: `
                <div style="direction: rtl; text-align: center;">
                    <h3 style="color: #c0392b;">התשובה לא נכונה</h3>
                    <p>🔁 התשובה שהזנת נשארה, תוכל לתקן אותה ולנסות שוב.</p>
                    <p>➡️ או לחץ על "הבא" כדי לעבור לתרגיל חדש.</p>
                    <p>בהצלחה! 💪</p>
                </div>
            `,
            background: '#fff0f0',
            color: '#2c3e50',
            confirmButtonText: 'הבנתי, מנסה שוב! 🔄',
            confirmButtonColor: '#e74c3c',
            customClass: {
                popup: 'swal-wide'
            }
        });
    };
};

function playSound(audioFilePath) {
    if (!isSoundOn) return;

    const sound = new Audio(audioFilePath);
    sound.play();
}

function addAnswerRow(score) {
    totalScore += Number(score);

    const emoji = score > 0 ? "✅" : "❌";

    answerRows.innerHTML += `
    <tr>
        <td>${emoji} ${score}</td>
        <td>${rightAnswer}</td>
        <td>${answerInput.value}</td>
        <td>= ${currentNum1} ${operator} ${currentNum2}</td>
    </tr>`;

    scoreTotal.innerText = totalScore;
};

btnCheck.addEventListener("click", () => {
    checkAnswer(currentNum1, operator, currentNum2);
});

btnNext.addEventListener("click", () => {
    answerInput.value = "";
    createExercise();
});

answerInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        btnCheck.click();
    }
});

audio.addEventListener("click", () => {
    isSoundOn = !isSoundOn;
    audio.src = isSoundOn ? "./images/volume-up-fill.svg" : "./images/volume-mute-fill.svg";
});