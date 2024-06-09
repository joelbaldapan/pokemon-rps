// DOM Manipulation
const scores = document.querySelector('h2');
const selection = document.getElementById('select');
const textbox = document.getElementById('textbox');

const battleView = document.getElementsByClassName('battle')[0];
const player = document.getElementById('player');
const computer = document.getElementById('computer');
const pAttack = document.getElementById('p-attack');
const cAttack = document.getElementById('c-attack');

const rockBtn = document.getElementById('rockBtn');
const paperBtn = document.getElementById('paperBtn');
const scissorsBtn = document.getElementById('scissorsBtn');

const audioBtn = document.getElementById('audioBtn');
const audioPlayer = document.getElementById('battle-music');
const powerBtn = document.getElementById('powerBtn');

const pBar = document.getElementById('p-healthBar');
const cBar = document.getElementById('c-healthBar');
const pHealth = document.getElementById('p-health');
const pHealthTotal = document.getElementById('p-healthTotal');

// INITIALIZE
let gameStarting = false;
let gameEnded = false;
let gameOngoing = false;
let toggleAudio = true;

let index = 0;
let playerScore = 0;
let compScore = 0;
let playerSelection;
let compSelection;

// SETTINGS
const barWidth = 6.1;
const baseHealth = 100;
const pName = "Lucario";
const cName = "Charizard";

toggleBattleBtns(true);
powerBtn.style.backgroundColor = "#f6f2db";
audioBtn.style.backgroundColor = "#dbf6dc";
pHealth.textContent = baseHealth;
pHealthTotal.textContent = baseHealth;

// NUMBER OF WINS
let win = 10;

// INITIALIZE
function initialize() {
  if (gameOngoing) {
    gameEnded = false;
    gameOngoing = false;
    toggleBattleBtns(true);
    audioPlayer.pause();
    battleView.classList.remove("start-anim");
    powerBtn.style.backgroundColor = "#f6f2db";
    textbox.textContent = "";
  } else {
    gameStarting = true;
    gameOngoing = true;
    playerScore = 0;
    compScore = 0;

    powerBtn.style.backgroundColor = "#dbf6dc";
    controlAudio();
    pHealth.textContent = baseHealth;
    pHealthTotal.textContent = baseHealth;
    renderHealth();

    displayText(`${cName} challenges you to a battle! Go, ${pName}!`)
    setTimeout(displayText, 3000, `Welcome to Rock, Paper, Scissors... with a spice of Pokémon! First to ${win} wins.`);
    powerBtn.disabled = false; // Disable power buttons;
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
    powerBtn.disabled = true;;
    textbox.textContent += text[index];
    index++;
    setTimeout(nextLetter, 25, text);
  } else {
    if (!gameStarting && !gameEnded) {
      toggleBattleBtns(false);
      checkWin();
    }
    if (gameStarting) {
      gameStarting = false;
    } else {
      powerBtn.disabled = false; // Enable power buttons
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

    [player, pAttack, computer, cAttack].forEach((element, index) => {
      const abrv = classes[winner];
      const classNames = [abrv.player, abrv.pAttack, abrv.computer, abrv.cAttack];
      element.addEventListener('animationend', () => {
        removeClass(element, classNames[index]);
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

  // Render Red Health
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
  updateAttack(playerChoice, compChoice);

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
  setTimeout(renderHealth, 500);
}

function updateAttack(player, comp) {
  pAttack.src = `images/attack/${getSymbol(player)}.png`
  cAttack.src = `images/attack/${getSymbol(comp)}.png`
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

// AUDIO
audioBtn.addEventListener('click', () => {
  if (toggleAudio) {
    toggleAudio = false;
    audioBtn.style.backgroundColor = "#f6f2db";
  } else {
    toggleAudio = true;
    audioBtn.style.backgroundColor = "#dbf6dc";
  }

  controlAudio();
});

function controlAudio() {
  if (gameStarting) {
    audioPlayer.currentTime = 0; // Reset audio to the beginning
  }
  if (toggleAudio && gameOngoing) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }

}

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