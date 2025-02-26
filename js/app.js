/*-------------------------------- Constants --------------------------------*/
//first we grab all the cards so we can make them flip
const allCards = document.querySelectorAll(".card");
const matchCountEl = document.getElementById("match-count"); //Updates the matches count
const resetButton = document.getElementById("reset-button");
const regenerateSound = new Audio("sounds/regenerate.mp3"); // Load the sound file
const themeSong = new Audio("sounds/themeSong.mp3"); //make it global so everyone can use it and stop it

//Doctor Who match messages
const matchMessageArray = [
  "Bow ties are cool! And so is that match!",
  "Allons-y! You're speeding through these matches!",
  "Geronimo! Another match secured!",
  "I am and always will be the optimist. And you're winning!",
  "Great men are forged in fire. So are great matches!",
  "The universe is big. It's vast and complicated... But you figured that match out!",
  "Don't blink! You almost missed that match!",
  "I love a good puzzle. And you're solving this one brilliantly!"
];
const noMatchMessageArray = [
  "Do you want me to apologize? All right, I'm sorry. Sorry about that! But no match!",
  "I'm sorry. I'm so sorry That wasn't a match! ",
  "Wibbly-wobbly, timey-wimey... stuff But not a match. Try again! ",
  "The universe is vast and complicated And so is this game! No match!",
  "People assume that time is a strict progression of cause to effect But that card wasn't the effect you expected! ",
  "You need to get yourself a better dictionary Because that wasn't a match! ",
  "Don't blink. Don't even blink But maybe try a different card. ",
  "Fantastic Oh wait... no, not this time. Try again!"
];
const newGameMessageArray = [
  "Time to do what I do best. Be brilliant! A new game begins!",
  "All of time and space, where do you want to start? Here's a fresh board!",
  "Change, my dear. And it seems not a moment too soon. The game has been reset!",
  "Time is not the boss of you. But you better hurry up!",
  "Run! The matches won't find themselves!",
  "It's like when you're a kid, and your best friend is imaginary… But these matches are real!",
  "A straight line may be the shortest distance between two points... But can you match them?",
  "Bow ties are cool! But matching cards is cooler!"
];

/*---------------------------- Variables (state) ----------------------------*/
let hasFlipped = false;
let lockBoard = false; //Prevents extra clicks
let firstCard;
let secondCard;
let timeLeft = 90;
let timerInterval; //This will store countdown
themeSong.loop = true;
let messageEl; // Hooked up with an eventlistener at the bottom
let match = 0;
let fadeOutInterval; // Handles sound fade out

/*------------------------ Cached Element References ------------------------*/

/*-------------------------------- Functions --------------------------------*/
//Handles flipping cards and checking matches
function flipCard() {
  if (lockBoard) return; //Stops extra clicks
  if (this === firstCard) return; //Prevents matching the same card

  // Start the timer when the first card is flipped
  if (!timerInterval) {
    startTimer();
  }

  this.classList.toggle("flip");

  if (!hasFlipped) {
    //first flip
    hasFlipped = true;
    firstCard = this;
    return;
  }

  //second flip
  hasFlipped = false;
  secondCard = this;
  lockBoard = true; //stops clicking

  if (firstCard && secondCard) {
    checkMatch();
  } else {
    console.log("checkMatch was skipped: missing first or second card");
    flipCardBack();
  }
}

//Timer starts when we flip our first card
function startTimer() {
  if (timerInterval) return; //Prevents multiple timers going

  themeSong.play().catch((error) => console.log("Audio blocked:", error));

  // Plays only once
  timerInterval = setInterval(
    () => {
      //Start the countdown
      timeLeft--; //subtracts time by 1 second
      document.getElementById("time-left").textContent = timeLeft; //update the display

      if (timeLeft === 10) {
        document.getElementById("timer").classList.add("low-time");
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval); //stops the countdown
        timerInterval = null; // Reset timer state
        themeSong.pause(); //stops song at 0seconds
        themeSong.currentTime = 0;
        endGame(); //Calls function to end the game
      }
    },

    1000
  ); //runs every second
}

//Checks if the two flipped cards match
function checkMatch() {
  if (!firstCard || !secondCard) {
    messageEl.textContent = getRandomMessage(noMatchMessageArray);
    //if there is an issue and cards are null they will act as NOT a match and flip back over
    flipCardBack();
    return;
  }

  //prevents error if a card is null

  if (firstCard.dataset.value === secondCard.dataset.value) {
    console.log("It's a match!");
    messageEl.textContent = getRandomMessage(matchMessageArray);
    match++; //if it's a match it updates the count
    matchCountEl.textContent = match;

    stopFlipEvent(); //Remove click events from matched cards
    resetBoard(); //unlocks board AFTER the match
  } else {
    messageEl.textContent = getRandomMessage(noMatchMessageArray);
    console.log("Not a match.");
    flipCardBack(); //Flips unmatched cards back over
  }
}

//Prevents matched cards from being clicked again
function stopFlipEvent() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
}

//Flips cards back if they don't match
function flipCardBack() {
  setTimeout(
    () => {
      if (firstCard && secondCard) {
        // Check if they exist before modifying them
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
      } else {
        console.warn(
          "flipCardBack() was called but firstCard or secondCard is null."
        );
      }

      firstCard = null; // Reset the card selection
      secondCard = null;
      resetBoard(); // Unlocks board AFTER flipping back
    },

    500
  );
}

//Resets Board state so you can make new selections
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false; //board is locked AFTER everything is done
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
  // Stop the theme song when regenerating
  themeSong.pause();
  themeSong.currentTime = 0; // Reset song position to the start

  shuffleCards();
  resetBoard();

  match = 0;
  matchCountEl.textContent = match;
  messageEl.textContent = getRandomMessage(newGameMessageArray);

  timeLeft = 90; //Reset Timer
  document.getElementById("time-left").textContent = timeLeft; //update timer display
  clearInterval(timerInterval); //Stop running timer
  timerInterval = null; //start fresh
  document.getElementById("timer").classList.remove("low-time"); //Remove flashing red

  allCards.forEach((card) => {
    card.classList.remove("flip"); //turn each individual card face down
    card.addEventListener("click", flipCard); //"RE-add" click event
  });
  document.getElementById("game-over-overlay").style.display = "none"; // Hide overlay
}

//Gets random message from the message arrays
function getRandomMessage(messagesArray) {
  return messagesArray[Math.floor(Math.random() * messagesArray.length)];
}

//Stop the Game after 60sec, stop the music, generate a stats message, restart game button
function endGame() {
  lockBoard = true; //stops card clicks
  clearInterval(timerInterval); //Stops Timer

  themeSong.pause(); //Pauses the song
  themeSong.currentTime = 0; //Reset song to start

  // Only show the overlay if the timer reached 0 (not when all matches are found)
  if (timeLeft <= 0) {
    document.getElementById("final-match-count").textContent = match;
    document.getElementById("game-over-overlay").style.display = "flex";
  }
  allCards.forEach((card) => card.removeEventListener("click", flipCard)); //remove event listener

  resetButton.style.display = "block"; //make button visible
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
  // Stop theme song when regenerating
  themeSong.pause();
  themeSong.currentTime = 0;

  // Stop any running timer
  clearInterval(timerInterval);
  timerInterval = null;

  // Regenerate the game (shuffle cards, reset matches & time)
  regenerateGame();

  // Play the regeneration animation, but NOT the sound
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
  clearInterval(fadeOutInterval); // Stop any existing fade-out process
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
  console.log("DOM fully loaded. Hiding Play Again button...");

  document.getElementById("game-over-overlay").style.display = "none";

  const playAgainButton = document.getElementById("play-again-button");
  if (playAgainButton) {
    playAgainButton.addEventListener("click", function () {
      console.log("Play Again button clicked! Restarting game...");
      document.getElementById("game-over-overlay").style.display = "none"; // Hide overlay
      regenerateGame(); // Restart the game
    });
  } else {
    console.error("Play Again button not found! Check your HTML.");
  }
});
