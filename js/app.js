/*-------------------------------- Constants --------------------------------*/
//first we grab all the cards so we can make them flip
const allCards = document.querySelectorAll(".card");

/*---------------------------- Variables (state) ----------------------------*/
let hasFlipped = false;
let lockCard = false;
let firstCard;
let secondCard;

/*------------------------ Cached Element References ------------------------*/

/*-------------------------------- Functions --------------------------------*/
//Here is our flip function toggling the class or .card to .flip then rotates with css rotateY
//also checks for a match
function flipCard() {
  if (lockCard) return;

  this.classList.toggle("flip");

  if (!hasFlipped) {
    //first flip
    hasFlipped = true;
    firstCard = this;
  } else {
    //second flip
    hasFlipped = false;
    secondCard = this;
    lockCard = true;

    console.log({
      firstCard,
      secondCard
    });

    //check if cards match
    if (firstCard.dataset.value === secondCard.dataset.value) {
      console.log("It's a match!");
      firstCard.removeEventListener("click", flipCard);
      secondCard.removeEventListener("click", flipCard);
      lockCard = false;
    } else {
      console.log("Not a match.");

      // Wait a short time before flipping them back
      setTimeout(
        () => {
          firstCard.classList.remove("flip");
          secondCard.classList.remove("flip");
          lockCard = false;
        },

        1000
      ); // 1-second delay
    }
  }
}

/*----------------------------- Event Listeners -----------------------------*/
//loop through and add a click even to each card
allCards.forEach((card) => card.addEventListener("click", flipCard));
