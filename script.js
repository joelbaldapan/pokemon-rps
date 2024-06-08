// DOM Manipulation
const scores = document.querySelector('h2');
const selection = document.getElementById('select');
const textbox = document.getElementById('textbox');

const player = document.getElementById('player');
const computer = document.getElementById('computer');

const rockBtn = document.getElementById('rockBtn');
const paperBtn = document.getElementById('paperBtn');
const scissorsBtn = document.getElementById('scissorsBtn');

const audioBtn = document.getElementById('audioBtn');
const powerBtn = document.getElementById('powerBtn');

// INITIALIZE
const pName = "Lucario";
const cName = "Charizard";

let index = 0;

let ongoingStart = false;
let ongoingBattle = false;
let humanScore = 0;
let compScore = 0;
let humanSelection;
let compSelection;

let win = 5;

//Get Symbol
function getSymbol(num) {
  num = num.toString();
  num = num.replace("0", "Fire");
  num = num.replace("1", "Water");
  num = num.replace("2", "Grass");
  return num;
}

// Get Computer Choice
function getCompChoice() {
  return choice = Math.floor(Math.random() * 3);
}

// Display Text on Textbox
function displayText(text) {
  textbox.textContent = "";
  index = 0;
  nextLetter(text);
}

function nextLetter(text) {
  if (index < text.length) {
    toggleBattleBtns(true);
    textbox.textContent += text[index];
    index++;
    setTimeout(nextLetter, 20, text);
  } else {
    toggleBattleBtns(false);
    toggleControlBtns(false);
    if (ongoingBattle) {
      ongoingBattle = false;
      animBattle()
    }
    if (ongoingStart) {
      ongoingStart = false;
      animStart();
    }
  }
}

// Toggle Buttons

function toggleBattleBtns(toggle) {
  rockBtn.disabled = toggle;
  paperBtn.disabled = toggle;
  scissorsBtn.disabled = toggle;
  statusBtn.disabled = toggle;
}

function toggleControlBtns(toggle) {
  audioBtn.disabled = toggle;
  powerBtn.disabled = toggle;
}

// Animation Toggles
function animBattle() {
  player.classList.toggle("battle-anim");
  computer.classList.toggle("battle-anim");
}

function animStart() {
  player.classList.toggle("start-anim");
  computer.classList.toggle("start-anim");
}

// 0 = ROCK
// 1 = PAPER
// 2 = SCISSORS

// Play Round
function playRound(humanChoice) {
  ongoingBattle = true;
  const compChoice = getCompChoice();

  // Play animation
  animBattle();

  // Draw
  if (humanChoice == compChoice) {
    displayText(`${pName} and ${cName} use ${getSymbol(humanChoice)}! So, it's a draw!`);
  }
  // You win! (R vs S; P vs R; S vs P)
  else if (
    (humanChoice === 0 && compChoice === 2) ||
    (humanChoice === 1 && compChoice === 0) ||
    (humanChoice === 2 && compChoice === 1)) {
    displayText(`${pName} uses ${getSymbol(humanChoice)}, and ${cName} uses ${getSymbol(compChoice)}! So, you win!`);
    humanScore++
  }
  // Computer wins!
  else {
    displayText(`${cName} uses ${getSymbol(compChoice)}, and ${pName} uses ${getSymbol(humanChoice)}! So, you lose!`);
    compScore++
  }

  // Show Results
  selection.textContent = `Human: ${getSymbol(humanChoice)} vs. Computer: ${getSymbol(compChoice)}`
  scores.textContent = `Human: ${humanScore} | Computer: ${compScore}`
}


// EVENT LISTENERS
// Attack Buttons


rockBtn.addEventListener('click', () => {
  playRound(0)
});

paperBtn.addEventListener('click', () => {
  playRound(1)
});

scissorsBtn.addEventListener('click', () => {
  playRound(2)
});

// Power Button
powerBtn.addEventListener('click', () => {
  displayText("Welcome to Rock, Paper, Scissors: Pokemon Edition! First to five wins.")
  
  ongoingStart = true;
  toggleControlBtns(true);
  animStart();
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