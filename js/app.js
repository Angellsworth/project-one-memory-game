/*-------------------------------- Constants --------------------------------*/
//first we grab all the cards so we can make them flip
const allCards = document.querySelectorAll(".card");
const matchCountEl = document.getElementById("match-count");
const resetButton = document.getElementById("reset-button");
const regenerateSound = new Audio("sounds/regenerate.mp3");
const themeSong = new Audio("sounds/themeSong.mp3");

//Doctor Who match messages
const matchMessageArray = [
  "Bow ties are cool! And so is that match!",
  "Allons-y! You're speeding through these matches!",
  "Geronimo! Another match secured!",
  "I am and always will be the optimist. And you're winning!",
  "Great men are forged in fire. So are great matches!"
];
const noMatchMessageArray = [
  "Do you want me to apologize? All right, I'm sorry. Sorry about that! But no match!",
  "I'm sorry. I'm so sorry That wasn't a match! ",
  "Wibbly-wobbly, timey-wimey... stuff But not a match. Try again! ",
  "The universe is vast and complicated And so is this game! No match!",
  "People assume that time is a strict progression of cause to effect But that card wasn't the effect you expected! "
];
const newGameMessageArray = [
  "Time to do what I do best. Be brilliant! A new game begins!",
  "All of time and space, where do you want to start? Here's a fresh board!",
  "Change, my dear. And it seems not a moment too soon. The game has been reset!",
  "Time is not the boss of you. But you better hurry up!",
  "Run! The matches won't find themselves!"
];
const winMessageArray = [
  "Fantastic! You were FANTASTIC!",
  "All of time and space, and you conquered this game!",
  "Well done! Even the Doctor would be impressed!",
  "You’re a Time Lord of memory games!",
  "Brilliant! The Daleks don’t stand a chance against you!"
];

/*---------------------------- Variables (state) ----------------------------*/
let hasFlipped = false;
let lockBoard = false;
let firstCard;
let secondCard;
let timeLeft = 130;
let timerInterval;
themeSong.loop = true;
let messageEl;
let match = 0;
let fadeOutInterval;

/*------------------------ Cached Element References ------------------------*/

/*-------------------------------- Functions --------------------------------*/
//Handles flipping cards and checking matches
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  // Start the timer when the first card is flipped
  if (!timerInterval) {
    startTimer();
  }

  this.classList.toggle("flip");

  //first flip
  if (!hasFlipped) {
    hasFlipped = true;
    firstCard = this;
    return;
  }

  //second flip
  hasFlipped = false;
  secondCard = this;
  lockBoard = true;

  if (firstCard && secondCard) {
    checkMatch();
  } else {
    flipCardBack();
  }
}

//Timer starts when we flip our first card
function startTimer() {
  if (timerInterval) return;

  themeSong.play().catch((error) => console.log("Audio blocked:", error));

  // Plays only once
  timerInterval = setInterval(
    () => {
      //Start the countdown
      timeLeft--;
      document.getElementById("time-left").textContent = timeLeft;

      if (timeLeft === 10) {
        document.getElementById("timer").classList.add("low-time");
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        themeSong.pause();
        themeSong.currentTime = 0;
        endGame();
      }
    },

    1000
  );
}

//Checks if the two flipped cards match
function checkMatch() {
  if (!firstCard || !secondCard) {
    messageEl.textContent = getRandomMessage(noMatchMessageArray);
    flipCardBack();
    return;
  }

  //prevents error if a card is null
  if (firstCard.dataset.value === secondCard.dataset.value) {
    messageEl.textContent = getRandomMessage(matchMessageArray);
    match++;
    matchCountEl.textContent = match;

    stopFlipEvent();
    resetBoard();
    checkWin();
  } else {
    messageEl.textContent = getRandomMessage(noMatchMessageArray);
    flipCardBack();
  }
}

//Prevents matched cards from being clicked again
function stopFlipEvent() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
}

//Flips cards back if they don't match
function flipCardBack() {
  setTimeout(() => {
    if (firstCard && secondCard) {
      // Check if they exist before modifying them
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
    }
    firstCard = null;
    secondCard = null;
    resetBoard();
  }, 500);
}

//Resets Board state so you can make new selections
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

//Shuffles all cards on the board
function shuffleCards() {
  allCards.forEach((card) => {
    let randomPosition = Math.floor(Math.random() * allCards.length);
    card.style.order = randomPosition;
  });
}

//Resets the game, shuffles, resets match count to 0
function regenerateGame() {
  themeSong.pause();
  themeSong.currentTime = 0;

  resetBoard();

  match = 0;
  matchCountEl.textContent = match;
  messageEl.textContent = getRandomMessage(newGameMessageArray);

  timeLeft = 120;
  document.getElementById("time-left").textContent = timeLeft;
  clearInterval(timerInterval);
  timerInterval = null;
  document.getElementById("timer").classList.remove("low-time");

  allCards.forEach((card) => {
    card.classList.remove("flip");
    card.addEventListener("click", flipCard);
  });
  shuffleCards();
  document.getElementById("game-over-overlay").style.display = "none";
}

//Gets random message from the message arrays
function getRandomMessage(messagesArray) {
  return messagesArray[Math.floor(Math.random() * messagesArray.length)];
}

//Stop the Game after time, stop the music, generate a stats message, restart game button
function endGame() {
  lockBoard = true;
  clearInterval(timerInterval);

  themeSong.pause();
  themeSong.currentTime = 0;

  // Only show the overlay if the timer reached 0 (not when all matches are found)
  document.getElementById("final-match-count").textContent = match;
  document.getElementById("game-over-overlay").style.display = "flex";

  allCards.forEach((card) => card.removeEventListener("click", flipCard));

  resetButton.style.display = "block";
}

function checkWin() {
  const totalPairs = allCards.length / 2;
  if (match === totalPairs) {
    setTimeout(() => {
      clearInterval(timerInterval);
      themeSong.pause();
      themeSong.currentTime = 0;

      document.getElementById("game-win-overlay").style.display = "flex";
      document.getElementById("win-message").textContent =
        getRandomMessage(winMessageArray);
      endWin();
    }, 500);
  }
}
function endWin() {
  lockBoard = true;
  clearInterval(timerInterval);
}
/*----------------------------- Event Listeners -----------------------------*/

// Attach click event to all cards
allCards.forEach((card) => card.addEventListener("click", flipCard));

// Shuffle cards when page loads
document.addEventListener("DOMContentLoaded", function () {
  messageEl = document.getElementById("message");
  shuffleCards();
});

// Reset button click event (merged logic)
resetButton.addEventListener("click", function () {
  themeSong.pause();
  themeSong.currentTime = 0;

  clearInterval(timerInterval);
  timerInterval = null;

  regenerateGame();

  resetButton.classList.add("regenerating");

  setTimeout(
    () => {
      resetButton.classList.remove("regenerating");
    },

    1500
  );
});

// Keep regeneration sound for hover effect
resetButton.addEventListener("mouseenter", function () {
  clearInterval(fadeOutInterval);
  regenerateSound.volume = 1.0;
  regenerateSound.currentTime = 0;
  regenerateSound.play();
});

// Keep fade-out effect when moving the cursor away
resetButton.addEventListener("mouseleave", function () {
  fadeOutInterval = setInterval(
    () => {
      if (regenerateSound.volume > 0.05) {
        regenerateSound.volume -= 0.05;
      } else {
        regenerateSound.pause();
        regenerateSound.currentTime = 0;
        clearInterval(fadeOutInterval);
      }
    },

    50
  );
});

// Ensure the script runs only after the page is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("game-over-overlay").style.display = "none";
  document.getElementById("game-win-overlay").style.display = "none";
});
//game over and win game event listeners
document
  .getElementById("play-again-button")
  .addEventListener("click", function () {
    document.getElementById("game-over-overlay").style.display = "none";
    regenerateGame();
  });

document
  .getElementById("play-again-win-button")
  .addEventListener("click", function () {
    document.getElementById("game-win-overlay").style.display = "none";
    regenerateGame();
  });
