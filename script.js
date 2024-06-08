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

const pBar = document.getElementById('p-healthBar');
const cBar = document.getElementById('c-healthBar');
const pHealth = document.getElementById('p-health');
const pHealthTotal = document.getElementById('p-healthTotal');

// INITIALIZE
let index = 0;
let ongoingStart = false;
let ongoingBattle = false;
let playerScore = 0;
let compScore = 0;
let playerSelection;
let compSelection;

// SETTINGS
const barWidth = 6.1;
const baseHealth = 100;
const pName = "Lucario";
const cName = "Charizard";

pHealth.textContent = baseHealth;
pHealthTotal.textContent = baseHealth;

// NUMBER OF WINS
let win = 5;

// INITIALIZE
function initialize() {
  ongoingStart = true;
  ongoingBattle = false;
  playerScore = 0;
  compScore = 0;

  pHealth.textContent = baseHealth;
  pHealthTotal.textContent = baseHealth;
  renderHealth();
}

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
    toggleControlBtns(true);
    textbox.textContent += text[index];
    index++;
    setTimeout(nextLetter, 20, text);
  } else {
    toggleBattleBtns(false);
    toggleControlBtns(false);
    clearBar();
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

// Render Bar
function renderBar(hurt) {
  if (hurt === "player") {
    pBar.classList.toggle("renderBar");
  } else {
    cBar.classList.toggle("renderBar");
  }
}

function clearBar() {
  pBar.classList.remove("renderBar");
  cBar.classList.remove("renderBar");
}

function renderHealth() {
  cBar.style.width = `${((1-(playerScore / win)) * barWidth).toFixed(1)}em`;
  pBar.style.width = `${((1-(compScore / win)) * barWidth).toFixed(1)}em`;
  pHealth.textContent = `${((1-(compScore / win)) * baseHealth).toFixed(0)}`;

  if ((1 - (playerScore / win) < 0.2)) {
    cBar.style.backgroundColor = "#c43939";
  }
  if ((1 - (compScore / win) < 0.2)) {
    pBar.style.backgroundColor = "#c43939";
  }
}

// 0 = ROCK
// 1 = PAPER
// 2 = SCISSORS

// Play Round
function playRound(playerChoice) {
  ongoingBattle = true;
  const compChoice = getCompChoice();

  // Play animation
  animBattle();

  // Draw
  if (playerChoice == compChoice) {
    displayText(`${pName} and ${cName} use ${getSymbol(playerChoice)}! So, it's a draw!`);
  }
  // You win! (R vs S; P vs R; S vs P)
  else if (
    (playerChoice === 0 && compChoice === 2) ||
    (playerChoice === 1 && compChoice === 0) ||
    (playerChoice === 2 && compChoice === 1)) {
    displayText(`${pName} uses ${getSymbol(playerChoice)}, and ${cName} uses ${getSymbol(compChoice)}! So, you win!`);
    renderBar("computer");
    playerScore++
  }
  // Computer wins!
  else {
    displayText(`${cName} uses ${getSymbol(compChoice)}, and ${pName} uses ${getSymbol(playerChoice)}! So, you lose!`);
    renderBar("player");
    compScore++
  }

  // Show Results
  renderHealth()
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
  displayText(`Welcome to Rock, Paper, Scissors: Pokemon Edition! First to ${win} wins.`)

  ongoingStart = true;
  toggleControlBtns(true);
  animStart();
  initialize();
});

// GAME DONE
if (playerScore >= win || compScore >= win) {
  if (playerScore > compScore) {
    // YOU WIN!
    console.log("🏆Congratulations! You win!🏆");
    prompt("🏆Congratulations! You win!🏆")
  } else {
    // YOU LOSE.
    console.log("😢Too bad! You lose!😢");
    prompt("😢Too bad! You lose!😢")
  }
}