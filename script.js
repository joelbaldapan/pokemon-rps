// DOM Manipulation
const scores = document.querySelector('h2');
const selection = document.getElementById('select');
const textbox = document.getElementById('textbox');

const battleView = document.getElementsByClassName('battle')[0];
const player = document.getElementById('player');
const computer = document.getElementById('computer');
const pAttack = document.getElementById('pAttack');
const cAttack = document.getElementById('cAttack');

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
let gameStarting = false;
let gameEnded = false;
let gameOngoing = false;
let playerScore = 0;
let compScore = 0;
let playerSelection;
let compSelection;
toggleBattleBtns(true);

// SETTINGS
const barWidth = 6.1;
const baseHealth = 100;
const pName = "Lucario";
const cName = "Charizard";

pHealth.textContent = baseHealth;
pHealthTotal.textContent = baseHealth;

// NUMBER OF WINS
let win = 3;


// INITIALIZE
function initialize() {
  if (gameOngoing) {
    gameOngoing = false;
    toggleBattleBtns(true);
    battleView.classList.remove("start-anim");
    textbox.textContent = "";
  } else {
    gameStarting = true;
    gameOngoing = true;
    playerScore = 0;
    compScore = 0;

    pHealth.textContent = baseHealth;
    pHealthTotal.textContent = baseHealth;
    renderHealth();

    displayText(`${cName} challenges you to a battle! Go, ${pName}!`)
    setTimeout(displayText, 3000, `Welcome to Rock, Paper, Scissors... with a spice of Pokémon! First to ${win} wins.`);
    toggleControlBtns(true);
    playAnim("start-anim");
  }
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
    if (!gameEnded && !gameStarting) {
      toggleBattleBtns(false);
      checkWin();
    }
    if (gameStarting) {
      gameStarting = false;
    } else {
      toggleControlBtns(false);
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
function playAnim(name) {
  // Add Animation Class
  player.classList.add(name);
  computer.classList.add(name);
  pAttack.classList.add(name);
  cAttack.classList.add(name);
  battleView.classList.add(name);

  // Listen and Remove Animation Class
  const elements = [player, computer, pAttack, cAttack];

  elements.forEach(element => {
    element.addEventListener('animationend', () => {
      element.classList.remove(name);
    });
  });
}

// Function to remove class from element
function removeClass(element, className) {
  console.log(element, className);
  element.classList.remove(className);
}

// Function to play win animation
function playWinAnim(winner) {
  const classes = {
    p: {
      player: "win",
      pAttack: "win",
      computer: "lose",
      cAttack: "lose"
    },
    c: {
      player: "lose",
      pAttack: "lose",
      computer: "win",
      cAttack: "win"
    },
    d: {
      player: "draw",
      pAttack: "draw",
      computer: "draw",
      cAttack: "draw"
    }
  };

  if (classes[winner]) {
    player.classList.add(classes[winner].player);
    pAttack.classList.add(classes[winner].pAttack);
    computer.classList.add(classes[winner].computer);
    cAttack.classList.add(classes[winner].cAttack);

    [player, pAttack, computer, cAttack].forEach(element => {
      element.addEventListener('animationend', () => {
        removeClass(element, classes[winner][element.id]);
      });
    });
  }
}

// Animation Names:
// start-anim
// battle-anim
// draw
// win
// lose


// Render Bar
function renderBar(hurt) {
  pBar.classList.remove("renderBar");
  cBar.classList.remove("renderBar");

  void pBar.offsetWidth;
  void cBar.offsetWidth;

  if (hurt === "player") {
    pBar.classList.toggle("renderBar");
  } else {
    cBar.classList.toggle("renderBar");
  }
}

function renderHealth() {
  cBar.style.width = `${((1-(playerScore / win)) * barWidth).toFixed(1)}em`;
  pBar.style.width = `${((1-(compScore / win)) * barWidth).toFixed(1)}em`;
  pHealth.textContent = `${((1-(compScore / win)) * baseHealth).toFixed(0)}`;

  // Render Red Bar
  if ((1 - (playerScore / win) < 0.2)) {
    cBar.style.backgroundColor = "#c43939";
  } else {
    cBar.style.backgroundColor = "#39c440";
  }
  if ((1 - (compScore / win) < 0.2)) {
    pBar.style.backgroundColor = "#c43939";
  } else {
    pBar.style.backgroundColor = "#39c440";
  }
}

// 0 = ROCK
// 1 = PAPER
// 2 = SCISSORS

// PLAY ROUND
function playRound(playerChoice) {
  const compChoice = getCompChoice();

  // Play animation
  playAnim("battle-anim");

  // Draw
  if (playerChoice == compChoice) {
    displayText(`${pName} and ${cName} use ${getSymbol(playerChoice)}! So, it's a draw!`);
    playWinAnim("d");
  }
  // You win! (R vs S; P vs R; S vs P)
  else if (
    (playerChoice === 0 && compChoice === 2) ||
    (playerChoice === 1 && compChoice === 0) ||
    (playerChoice === 2 && compChoice === 1)) {
    displayText(`${pName} uses ${getSymbol(playerChoice)}, and ${cName} uses ${getSymbol(compChoice)}! So, you win!`);
    playWinAnim("p");
    renderBar("computer");
    playerScore++
  }
  // Computer wins!
  else {
    displayText(`${cName} uses ${getSymbol(compChoice)}, and ${pName} uses ${getSymbol(playerChoice)}! So, you lose!`);
    playWinAnim("c");
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

// Status Button
statusBtn.addEventListener('click', () => {
  displayText(`First to ${win} wins! ${pName} has ${playerScore} points, and ${cName} has ${compScore} points!`)
});

// Power Button
powerBtn.addEventListener('click', () => {
  initialize();
});


// GAME DONE
function checkWin() {
  if (playerScore >= win || compScore >= win) {
    toggleBattleBtns(true);
    if (playerScore > compScore) {
      // YOU WIN!
      displayText(`Congraulations! You win!`);
    } else {
      // YOU LOSE.
      displayText(`Womp womp. You lose!`);
    }
    gameEnded = true;
  }
};