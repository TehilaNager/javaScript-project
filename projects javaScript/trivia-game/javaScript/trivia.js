const time = document.querySelector(".time");
const difficulty = document.querySelector(".difficulty");
const category = document.getElementById("category");
const instructions = document.querySelector('.btn-instructions')

localStorage.setItem("time", "Easy: 20 seconds");
localStorage.setItem("level", "Easy");
localStorage.setItem("category", "");

instructions.addEventListener('click', () => {
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
  });
});

time.addEventListener("change", (e) => {
  const timeChoosed = e.target.value;
  localStorage.setItem("time", timeChoosed)
});

difficulty.addEventListener("change", (e) => {
  const levelChoosed = e.target.value;
  localStorage.setItem("level", levelChoosed)
});

category.addEventListener("change", (e) => {
  const categoryChoosed = e.target.value;
  localStorage.setItem("category", categoryChoosed);
});