// DOM Manipulation
const scores = document.querySelector("h2");
const selection = document.getElementById("select");
const textbox = document.getElementById("textbox");

const battleView = document.getElementsByClassName("battle")[0];
const player = document.getElementById("player");
const computer = document.getElementById("computer");
const pAttack = document.getElementById("p-attack");
const cAttack = document.getElementById("c-attack");
const pInfo = document.getElementsByClassName("p-info")[0];
const cInfo = document.getElementsByClassName("c-info")[0];

const rockBtn = document.getElementById("rockBtn");
const paperBtn = document.getElementById("paperBtn");
const scissorsBtn = document.getElementById("scissorsBtn");

const audioBtn = document.getElementById("audioBtn");
const audioPlayer = document.getElementById("battle-music");
const sfxPlayer = document.getElementById("sfx");
const hitPlayer = document.getElementById("hit-sfx");
const powerBtn = document.getElementById("powerBtn");

const pBar = document.getElementById("p-healthBar");
const cBar = document.getElementById("c-healthBar");
const pHealth = document.getElementById("p-health");
const pHealthTotal = document.getElementById("p-healthTotal");

const winForm = document.getElementById("win-form");
const inputArea = document.getElementById("num-wins");
const saveBtn = document.getElementById("saveBtn");

const logo = document.getElementById("logo");

// Scrollers
const frontContainer = document.querySelector(".scroller-inner.front");
const backContainer = document.querySelector(".scroller-inner.back");
const scrollers = document.querySelectorAll(".scroller");

// WEB PAGE
// Initialize
logo.src = "images/header/signatureW.gif?a=" + Math.random();
logo.style.opacity = "1";

document.addEventListener("DOMContentLoaded", () => {
  const numberOfImages = 12; // Total number of images

  for (let i = 0; i < numberOfImages; i++) {
    const frontImg = document.createElement("img");
    frontImg.src = `images/scroller/front/${i}.gif`;
    frontImg.alt = "pokemon";
    frontContainer.appendChild(frontImg);

    const backImg = document.createElement("img");
    backImg.src = `images/scroller/back/${i}.gif`;
    backImg.alt = "pokemon";
    backContainer.appendChild(backImg);
  }

  // REDUCED MOTION
  if (!window.matchMedia("(prefers-reduced-motion: reduce").matches) {
    addAnimation();
  }
});

// Add Animation
function addAnimation() {
  scrollers.forEach((scroller) => {
    scroller.classList.add("animated");

    const scrollerInner = scroller.querySelector(".scroller-inner");
    const scrollerContent = Array.from(scrollerInner.children);

    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      duplicatedItem.setAttribute("aria-hidden", true);
      scrollerInner.appendChild(duplicatedItem);
    });
  });
}

// Flag to track if animation has been reset
let animationReset = false;

// Function to check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to handle scroll event
function handleScroll() {
  if (isInViewport(logo) && !animationReset) {
    logo.src = logo.src; // Reset the src attribute to replay the GIF animation
    animationReset = true; // Set flag to true once animation is reset
  } else if (!isInViewport(logo)) {
    animationReset = false; // Reset flag if element goes out of view
  }
}

// Add scroll event listener to window
window.addEventListener("scroll", handleScroll);

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
audioPlayer.volume = 0.5;
powerBtn.style.backgroundColor = "#f6f2db";
audioBtn.style.backgroundColor = "#dbf6dc";
pHealth.textContent = baseHealth;
pHealthTotal.textContent = baseHealth;

// NUMBER OF WINS
let win = 5;

// INITIALIZE
function initialize() {
  if (gameOngoing) {
    gameEnded = false;
    gameOngoing = false;
    toggleBattleBtns(true);

    // Add Input Area
    winForm.style.display = "block";

    // Remove animations and reset DOM
    player.classList.remove("faint");
    computer.classList.remove("faint");
    battleView.classList.remove("start-anim");
    powerBtn.style.backgroundColor = "#f6f2db";
    textbox.textContent = "";

    // Reset audio
    audioPlayer.src = `audios/music/wildBattle-BW.mp3`;
    audioPlayer.pause();
  } else {
    gameStarting = true;
    gameOngoing = true;
    playerScore = 0;
    compScore = 0;

    // Remove Input Area
    winForm.style.display = "none";

    // Initialize starting animation and audio
    powerBtn.style.backgroundColor = "#dbf6dc";
    pHealth.textContent = baseHealth;
    pHealthTotal.textContent = baseHealth;
    controlAudio();
    renderHealth();

    displayText(`${cName} challenges you to a battle! Go, ${pName}!`);
    setTimeout(
      displayText,
      3000,
      `Welcome to Rock, Paper, Scissors... with a spice of Pokémon! First to ${win} wins.`
    );
    powerBtn.disabled = false; // Disable power buttons;
    playAnim("start-anim");
  }
}

// 0 = ROCK
// 1 = PAPER
// 2 = SCISSORS

// PLAY ROUND
function playRound(playerChoice) {
  const compChoice = getCompChoice();

  // RPS LOGIC

  // Draw
  if (playerChoice == compChoice) {
    displayText(
      `${pName} and ${cName} use ${getSymbol(playerChoice)}! So, it's a draw!`
    );
    playBattleAnim("d");

    playSFX(getSymbol(compChoice) + "-sfx");
  }
  // You win! (R vs S; P vs R; S vs P)
  else if (
    (playerChoice === 0 && compChoice === 2) ||
    (playerChoice === 1 && compChoice === 0) ||
    (playerChoice === 2 && compChoice === 1)
  ) {
    displayText(
      `${pName} uses ${getSymbol(playerChoice)}, and ${cName} uses ${getSymbol(
        compChoice
      )}! So, you win!`
    );
    playBattleAnim("p");
    renderBar("computer");
    playerScore++;

    playSFX(getSymbol(playerChoice) + "-sfx");
    setTimeout(playHitSFX, 600);
  }
  // Computer wins!
  else {
    displayText(
      `${cName} uses ${getSymbol(compChoice)}, and ${pName} uses ${getSymbol(
        playerChoice
      )}! So, you lose!`
    );
    playBattleAnim("c");
    renderBar("player");
    compScore++;

    playSFX(getSymbol(compChoice) + "-sfx");
    setTimeout(playHitSFX, 600);
  }

  // Show Results, animations
  playAnim("battle-anim");
  updateAttack(playerChoice, compChoice);
  setTimeout(renderHealth, 600);
}

// GAME DONE
function checkWin() {
  if (playerScore >= win || compScore >= win) {
    toggleBattleBtns(true);
    if (playerScore > compScore) {
      // YOU WIN!
      computer.classList.add("faint");
      audioPlayer.src = `audios/music/victoryMusic.mp3`;
      displayText(
        `${cName} fainted... Congratulations! You win! Press START to restart.`
      );
    } else {
      // YOU LOSE.
      player.classList.add("faint");
      audioPlayer.src = `audios/music/lostMusic.mp3`;
      displayText(
        `${pName} fainted... Womp womp. You lose! Press START to restart.`
      );
    }

    // Play audio
    if (toggleAudio) {
      audioPlayer.play();
      playSFX("Faint-sfx");
    }

    gameEnded = true;
  }
}

// Function to play battle animations
function playBattleAnim(winner) {
  const classes = {
    p: {
      player: "win",
      pAttack: "win",
      computer: "lose",
      cAttack: "lose",
    },
    c: {
      player: "lose",
      pAttack: "lose",
      computer: "win",
      cAttack: "win",
    },
    d: {
      player: "draw",
      pAttack: "draw",
      computer: "draw",
      cAttack: "draw",
    },
  };

  if (classes[winner]) {
    player.classList.add(classes[winner].player);
    pAttack.classList.add(classes[winner].pAttack);
    computer.classList.add(classes[winner].computer);
    cAttack.classList.add(classes[winner].cAttack);

    [player, pAttack, computer, cAttack].forEach((element, index) => {
      const abrv = classes[winner];
      const classNames = [
        abrv.player,
        abrv.pAttack,
        abrv.computer,
        abrv.cAttack,
      ];
      element.addEventListener("animationend", () => {
        removeClass(element, classNames[index]);
      });
    });
  }
}

// Function to remove class from element
function removeClass(element, className) {
  element.classList.remove(className);
}

// Animation Names:
// start-anim
// battle-anim
// draw
// win
// lose

// Animation Toggles
function playAnim(name) {
  // Add Animation Class
  player.classList.add(name);
  computer.classList.add(name);
  pAttack.classList.add(name);
  cAttack.classList.add(name);
  battleView.classList.add(name);
  pInfo.classList.add(name);
  cInfo.classList.add(name);

  // Listen and Remove Animation Class
  const elements = [player, computer, pAttack, cAttack, pInfo, cInfo];

  elements.forEach((element) => {
    element.addEventListener("animationend", () => {
      element.classList.remove(name);
    });
  });
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
  return (choice = Math.floor(Math.random() * 3));
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
    powerBtn.disabled = true;
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

// Update Attack Sprite
function updateAttack(player, comp) {
  pAttack.src = `images/attack/${getSymbol(player)}.png`;
  cAttack.src = `images/attack/${getSymbol(comp)}.png`;
}

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
  cBar.style.width = `${((1 - playerScore / win) * barWidth).toFixed(1)}em`;
  pBar.style.width = `${((1 - compScore / win) * barWidth).toFixed(1)}em`;
  pHealth.textContent = `${((1 - compScore / win) * baseHealth).toFixed(0)}`;

  // Render Red Health
  if (1 - playerScore / win < 0.2) {
    cBar.style.backgroundColor = "#c43939";
  } else {
    cBar.style.backgroundColor = "#39c440";
  }
  if (1 - compScore / win < 0.2) {
    pBar.style.backgroundColor = "#c43939";
  } else {
    pBar.style.backgroundColor = "#39c440";
  }
}

// EVENT LISTENERS

// Attack Buttons
rockBtn.addEventListener("click", () => {
  playRound(0);
});

paperBtn.addEventListener("click", () => {
  playRound(1);
});

scissorsBtn.addEventListener("click", () => {
  playRound(2);
});

// Status Button
statusBtn.addEventListener("click", () => {
  displayText(
    `First to ${win} wins! ${pName} has ${playerScore} points, and ${cName} has ${compScore} points!`
  );
});

// Power Button
powerBtn.addEventListener("click", () => {
  initialize();
});

// AUDIO
// Toggle music
audioBtn.addEventListener("click", () => {
  if (toggleAudio) {
    toggleAudio = false;
    audioBtn.style.backgroundColor = "#f6f2db";
  } else {
    toggleAudio = true;
    audioBtn.style.backgroundColor = "#dbf6dc";
  }

  controlAudio();
});

// Play music
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

// Play SFX
function playSFX(name) {
  if (toggleAudio) {
    sfxPlayer.src = `audios/sfx/${name}.mp3`;
    sfxPlayer.play();
  }
}

function playHitSFX() {
  if (toggleAudio) {
    hitPlayer.play();
  }
}

// FORM SUBMISSION
winForm.addEventListener("submit", (e) => {
  e.preventDefault();
  win = document.getElementById("num-wins").value;
  inputArea.style.backgroundColor = "#dbf6dc";
  saveBtn.style.backgroundColor = "#dbf6dc";
  inputArea.style.borderColor = "#dbf6dc";
  saveBtn.style.borderColor = "#dbf6dc";
  saveBtn.textContent = "Saved!";
});

// Detect change in form
inputArea.addEventListener("input", () => {
  if (win !== undefined && inputArea.value !== win) {
    inputArea.style.backgroundColor = "#f6f2db";
    saveBtn.style.backgroundColor = "#f6f2db";
    inputArea.style.borderColor = "#f6f2db";
    saveBtn.style.borderColor = "#f6f2db";
    saveBtn.textContent = "Unsaved";
  }
});
