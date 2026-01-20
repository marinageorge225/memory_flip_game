 /* ================= GAME SETTINGS ================= */

    const levels = [
      { cards: 6 },
      { cards: 12 },
      { cards: 18 }
    ];

    const BASE_TIME = 20;
    const TIME_INCREMENT = 5;

   const symbols = [
  "images/img1.png",
  "images/img2.png",
  "images/img3.png",
  "images/img4.png",
  "images/img5.png",
  "images/img6.png",
  "images/img7.png",
  "images/img8.png",
  "images/img9.png"
];

    /* ================= GAME STATE ================= */

    let currentLevel = 0;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedCards = 0;
    let timeLeft = BASE_TIME;
    let timer;

    /* ================= DOM ELEMENTS ================= */

    const gameBoard = document.getElementById("gameBoard");
    const levelText = document.getElementById("level");
    const timeText = document.getElementById("time");
    const message = document.getElementById("message");

    /* ================= START GAME ================= */

    function startGame() {
      clearInterval(timer);
      currentLevel = 0;
      startLevel();
    }

    /* ================= START LEVEL ================= */

    function startLevel() {
      clearInterval(timer);
      gameBoard.innerHTML = "";
      message.textContent = "";

      matchedCards = 0;
      firstCard = null;
      secondCard = null;
      lockBoard = true;

      levelText.textContent = currentLevel + 1;

      timeLeft = BASE_TIME + currentLevel * TIME_INCREMENT;
      timeText.textContent = timeLeft;

      startTimer();

      const totalCards = levels[currentLevel].cards;
      gameBoard.style.gridTemplateColumns = "repeat(3, 110px)";

      const selectedSymbols = symbols.slice(0, totalCards / 2);
      const cardsArray = [...selectedSymbols, ...selectedSymbols].sort(
        () => Math.random() - 0.5
      );

      cardsArray.forEach(symbol => {
        const card = document.createElement("div");
        card.className = "card show";
        card.dataset.symbol = symbol;

        card.innerHTML = `
          <div class="card-front"></div>
          <div class="card-back">
            <img src="${symbol}" alt="card image">
          </div>
        `;

        card.addEventListener("click", () => flipCard(card));
        gameBoard.appendChild(card);
      });

      setTimeout(() => {
        document.querySelectorAll(".card").forEach(card => {
          card.classList.remove("show");
        });
        lockBoard = false;
      }, 2000);
    }

    /* ================= FLIP CARD ================= */

    function flipCard(card) {
      if (
        lockBoard ||
        card.classList.contains("show") ||
        card.classList.contains("matched")
      ) return;

      card.classList.add("show");

      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        lockBoard = true;
        checkMatch();
      }
    }

    /* ================= CHECK MATCH ================= */

    function checkMatch() {
      const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;

      if (isMatch) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedCards += 2;
        resetTurn();

        if (matchedCards === levels[currentLevel].cards) {
          clearInterval(timer);
          nextLevel();
        }
      } else {
        setTimeout(() => {
          firstCard.classList.remove("show");
          secondCard.classList.remove("show");
          resetTurn();
        }, 900);
      }
    }

    /* ================= RESET TURN ================= */

    function resetTurn() {
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }

    /* ================= NEXT LEVEL ================= */

    function nextLevel() {
      if (currentLevel < levels.length - 1) {
        message.textContent = "✅ Level completed! Next level...";
        currentLevel++;
        setTimeout(startLevel, 1500);
      } else {
        message.textContent = "🎉 Congratulations! You won all levels!";
      }
    }

    /* ================= TIMER ================= */

    function startTimer() {
      timer = setInterval(() => {
        timeLeft--;
        timeText.textContent = timeLeft;

        if (timeLeft === 0) {
          clearInterval(timer);
          message.textContent = "⏰ Time's up! Game Over!";
          lockBoard = true;
        }
      }, 1000);
    }