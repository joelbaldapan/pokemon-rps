// DOM Manipulation
const scores = document.querySelector('h2');
const selection = document.getElementById('select');
const results = document.getElementById('textbox');

const rockBtn = document.getElementById('rock');
const paperBtn = document.getElementById('paper');
const scissorsBtn = document.getElementById('scissors');

// INITIALIZE
let humanScore = 0;
let compScore = 0;
let humanSelection;
let compSelection;
let win = 5;

//Get Symbol
function getSymbol(num) {
  num = num.toString();
  num = num.replace("0", "💎");
  num = num.replace("1", "📃");
  num = num.replace("2", "✂️");
  return num;
}

// Get Computer Choice
function getCompChoice() {
  return choice = Math.floor(Math.random() * 3);
}

// 0 = ROCK
// 1 = PAPER
// 2 = SCISSORS

// Play Round
function playRound(humanChoice) {
  const compChoice = getCompChoice();

  // Draw
  if (humanChoice == compChoice) {
    results.textContent = "Results: It's a draw!";
  }
  // You win! (R vs S; P vs R; S vs P)
  else if (
    (humanChoice === 0 && compChoice === 2) ||
    (humanChoice === 1 && compChoice === 0) ||
    (humanChoice === 2 && compChoice === 1)) {
    results.textContent = "Results: You win!";
    humanScore++
  }
  // Computer wins!
  else {
    results.textContent = "Results: Computer wins!";
    compScore++
  }

  // Show Results
  selection.textContent = `Human: ${getSymbol(humanChoice)} vs. Computer: ${getSymbol(compChoice)}`
  scores.textContent = `Human: ${humanScore} | Computer: ${compScore}`

  return;
}


// EVENT LISTENERS
rockBtn.addEventListener('click', () => {
  playRound(0)
});

paperBtn.addEventListener('click', () => {
  playRound(1)
});

scissorsBtn.addEventListener('click', () => {
  playRound(2)
});

// GAME DONE
if (humanScore >= win || compScore >= win) {
  if (humanScore > compScore) {
    // YOU WIN!
    console.log("🏆Congratulations! You win!🏆");
    prompt("🏆Congratulations! You win!🏆")
  } else {
    // YOU LOSE.
    console.log("😢Too bad! You lose!😢");
    prompt("😢Too bad! You lose!😢")
  }
}