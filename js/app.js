/*-------------------------------- Constants --------------------------------*/
//first we grab all the cards so we can make them flip
const allCards = document.querySelectorAll(".card");

/*---------------------------- Variables (state) ----------------------------*/
let hasFlipped = false;
let lockBoard = false; //lockboard prevents extra clicks
let firstCard;
let secondCard;

/*------------------------ Cached Element References ------------------------*/

/*-------------------------------- Functions --------------------------------*/
//Here is our flip function toggling the class or .card to .flip then rotates with css rotateY
//also checks for a match
function flipCard() {
  if (lockBoard) return; //stops clicking

  this.classList.toggle("flip");

  if (!hasFlipped) {
    //first flip
    hasFlipped = true;
    firstCard = this;
    console.log("first flip");
    return;
  }
  //second flip
  hasFlipped = false;
  secondCard = this;
  console.log("second click");
  lockBoard = true; //stops clicking
  console.log({
    firstCard,
    secondCard
  });
  checkMatch();
  console.log("Check Match called in flip function");
}

function checkMatch() {
  //check if cards match
  if (firstCard.dataset.value === secondCard.dataset.value) {
    console.log("It's a match!");
    //call stopFlipEvent when you get a match no more flipping.
    stopFlipEvent();
    resetBoard(); //unlocks board AFTER the match
  } else {
    console.log("Not a match.");
    //call flipBack function to flip card back to starting position
    flipCardBack();
  }
}

function stopFlipEvent() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
}

function flipCardBack() {
  // Wait a short time before flipping them back
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    firstCard = null; //setting to null resets the card
    secondCard = null;
    resetBoard(); //unlocks board AFTER flipping back - use instead of "lockBoard" to clear value
  }, 1000); // 1-second delay
}

function resetBoard() {
  //reset clears values of first and second card so new selections can happen
  firstCard = null;
  secondCard = null;
  lockBoard = false; //board is locked AFTER everything is done
}
/*----------------------------- Event Listeners -----------------------------*/
//loop through and add a click even to each card
allCards.forEach((card) => card.addEventListener("click", flipCard));
