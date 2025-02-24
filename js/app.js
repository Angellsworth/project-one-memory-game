/*-------------------------------- Constants --------------------------------*/
//first we grab all the cards so we can make them flip
const allCards = document.querySelectorAll(".card");
const matchCountEl = document.getElementById("match-count"); //Updates the matches count
const resetButton = document.getElementById("reset-button");
const regenerateSound = new Audio("sounds/regenerate.mp3"); // Load the sound file
//Doctor Who match messages
const matchMessageArray = [
  "Bow ties are cool! And so is that match!",
  "Allons-y! You're speeding through these matches!",
  "Geronimo! Another match secured!",
  "I am and always will be the optimist. And you're winning!",
  "Great men are forged in fire. So are great matches!",
  "We're all stories in the end... And this match is a good one!",
  "The universe is big. It's vast and complicated... But you figured that match out!",
  "Don't blink! You almost missed that match!",
  "I love a good puzzle. And you're solving this one brilliantly!",
  "You want weapons? We're in a library! But you found a match instead!"
];
const noMatchMessageArray = [
  "Do you want me to apologize? All right, I'm sorry. Sorry about that! But no match!",
  "I'm sorry. I'm so sorry That wasn't a match! ",
  "Wibbly-wobbly, timey-wimey... stuff But not a match. Try again! ",
  "The universe is vast and complicated And so is this game! No match!",
  "People assume that time is a strict progression of cause to effect But that card wasn't the effect you expected! ",
  "You need to get yourself a better dictionary Because that wasn't a match! ",
  "Don't blink. Don't even blink But maybe try a different card. ",
  "Logic, my dear Zoe, merely enables one to be wrong with authority No match! ",
  "Fantastic Oh wait... no, not this time. Try again!",
  "Reverse the polarity of the neutron flow But that won't help this mismatch! "
];
const newGameMessageArray = [
  "Time to do what I do best. Be brilliant! A new game begins!",
  "All of time and space, where do you want to start? Here's a fresh board!",
  "Change, my dear. And it seems not a moment too soon. The game has been reset!",
  "Time is not the boss of you. But you better hurry up!",
  "We're all stories in the end... Let's make this a good one!",
  "The moment has been prepared for. Ready for another round?",
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
let messageEl; // Hooked up with an eventlistener at the bottom
let match = 0;
let fadeOutInterval; // Handles sound fade out

/*------------------------ Cached Element References ------------------------*/

/*-------------------------------- Functions --------------------------------*/
//Handles flipping cards and checking matches
function flipCard() {
  if (lockBoard) return; //Stops extra clicks
  if (this === firstCard) return; //Prevents matching the same card

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

  checkMatch();
}
//Checks if the two flipped cards match
function checkMatch() {
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
//Prevents matche cards from being clicked again
function stopFlipEvent() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
}
//Flips cards back if they don't match
function flipCardBack() {
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    firstCard = null; //setting to null resets the card
    secondCard = null;
    resetBoard(); //unlocks board AFTER flipping back - use instead of "lockBoard" to clear value
  }, 1000); // 1-second delay
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
  shuffleCards();
  resetBoard();
  match = 0;
  matchCountEl.textContent = match;
  messageEl.textContent = getRandomMessage(newGameMessageArray);

  allCards.forEach((card) => {
    card.classList.remove("flip"); //turn each individual card face down
    card.addEventListener("click", flipCard); //"RE-add" click event
  });
}
//Gets random message from the message arrays
function getRandomMessage(messagesArray) {
  return messagesArray[Math.floor(Math.random() * messagesArray.length)];
}

/*----------------------------- Event Listeners -----------------------------*/
//Attach click event to all cards
allCards.forEach((card) => card.addEventListener("click", flipCard));

//Shuffle cards when page loads
document.addEventListener("DOMContentLoaded", function () {
  messageEl = document.getElementById("message");
  shuffleCards();
});

//Regenerate game when reset button is clicked
resetButton.addEventListener("click", regenerateGame);

// Play regeneration sound when hovering over the button
resetButton.addEventListener("mouseenter", function () {
  clearInterval(fadeOutInterval); // Stop any existing fade-out process
  regenerateSound.volume = 1.0; // Reset volume to full
  regenerateSound.currentTime = 0; // Start from the beginning
  regenerateSound.play();
});

// Fade out the regeneration sound when moving the cursor away
resetButton.addEventListener("mouseleave", function () {
  fadeOutInterval = setInterval(() => {
    if (regenerateSound.volume > 0.05) {
      regenerateSound.volume -= 0.05; // Reduce volume gradually
    } else {
      regenerateSound.pause(); // Stop playback when volume is low enough
      regenerateSound.currentTime = 0; // Reset to start
      clearInterval(fadeOutInterval); // Stop the fade-out process
    }
  }, 50); //smooths fade
});

//Play regeneration sound when clicking button
resetButton.addEventListener("click", function () {
  clearInterval(fadeOutInterval); // Stop any fade-out when clicking
  regenerateSound.volume = 0.8; // volume on click
  regenerateSound.currentTime = 0; // Reset sound to start
  regenerateSound.play();

  resetButton.classList.add("regenerating"); // Add glow effect to look like regeneration

  setTimeout(() => {
    resetButton.classList.remove("regenerating"); // Remove glow after 1.5 seconds
  }, 1500);
});
