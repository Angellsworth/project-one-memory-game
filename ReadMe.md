# 🌀 **Doctor Who: Memory Card Game** 🌀  

_A timey-wimey test of memory through all of time and space!_  

![Game Screenshot](images/screenShot.jpg)  

---

## 🕹️ About the Game  
**Doctor Who: Memory Card Game** is a **browser-based memory matching game** where players flip over cards to find matching pairs of **all the legendary Doctors** who have played the role of The Doctor in the hit TV series, _Doctor Who_.  

The task? **Match as many Doctors as you can before time runs out!** But beware—Time slips away quickly! 🚀🌀  

---

## 🎭 Background  
I was introduced to **Doctor Who** by my son, and through him, I became a **huge fan**! This is also the first game I played with my grand-daughter, I wanted to create a game that brings together family, **coding and all things Doctor Who!**  

This is my **first project for Adobe Digital Academy**, where I am refining my **JavaScript skills, game logic, and DOM manipulation techniques**. Through this project, I learned how to manage **game state, handle timing functions, and dynamically update the UI** while creating an engaging user experience.   

---

## 🚀 Getting Started  
🔗 **Play the game here:** [Link to deployed game]  

### 🎯 How to Play:  
1. Flip cards to reveal **Doctor Who characters**.  
2. Find and match **two identical Doctors**.  
3. **Match all pairs** before the **timer reaches 0** to win.  
4. Click **Reset** to shuffle and play again.  

---

## 🛠️ How the Game Works  
1️⃣ **Cards are shuffled** using CSS `order` to visually randomize cards.  
2️⃣ **Clicking a card** flips it over.  
3️⃣ **Timer starts** when the first card is flipped.  
4️⃣ **If two cards match**, they stay flipped.  
5️⃣ **If they don’t match**, they flip back after 1 second.  
6️⃣ **Game Ends When Time Runs Out** – Your final score is how many doctors you matched.  

---

### 🔄 Shuffle Method  
The game shuffles the cards by **randomly assigning each card a `flexbox order` value** using JavaScript.  
This visually rearranges the cards on the board each time the game starts.  

📌 **Future Improvement:** Implementing **card number choices** for changing difficulty levels.  

---

## 🔍 Key Functions  

Here are a few core functions that make the game work:  

### 🃏 Flip Card Function  
Controls the flipping logic and ensures only two cards are flipped at a time.  
```javascript
function flipCard() {
  if (lockBoard) return; // Prevents extra clicks
  if (this === firstCard) return; // Prevents clicking the same card twice

  this.classList.toggle("flip");

  if (!hasFlipped) {
    hasFlipped = true;
    firstCard = this;
    return;
  }

  hasFlipped = false;
  secondCard = this;
  lockBoard = true; 

  checkMatch();
}