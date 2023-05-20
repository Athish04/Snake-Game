const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const initialTime = 60;
const timeIncrease = 5;
const timerElement = document.getElementById("timer");
const timeremainingelement = document.getElementById("time-remaining");
const livesElement = document.getElementById("lives");
const initialLives = 3;
const pauseButton = document.getElementById("pause-btn");

timeremainingelement.textContent = initialTime;

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let lives = initialLives;
let highScore = localStorage.getItem("high-score") || 0;
let timeRemaining = initialTime;
let isFirstFoodEaten = false;
let isPaused = false;

highScoreElement.innerText = `High Score: ${highScore}`;
livesElement.innerText = `Lives: ${lives}`;

const timerFunction = setInterval(function() {
    if (!isPaused) {
        timeRemaining--;
        timeremainingelement.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timerFunction);
            gameOver = true;
            handleGameOver();
        }
    }
}, 1000);

const togglePause = () => {
    isPaused = !isPaused;

    if (isPaused) {
        clearInterval(setIntervalId);
    } else {
        setIntervalId = setInterval(initGame, 100);
    }
};

pauseButton.addEventListener("click", togglePause);

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;

    if (isFirstFoodEaten) {
        timeRemaining += timeIncrease + 1;
    } else {
        isFirstFoodEaten = true;
    }
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    lives--;

    if (lives > 0) {
        livesElement.innerText = `Lives: ${lives}`;
        alert("You lost a life! Press OK to replay...");
        resetSnakeAndFood();
        gameOver = false;
        isPaused = false;
        setIntervalId = setInterval(initGame, 100);
        timeRemaining = initialTime + 1;
    } else {
        livesElement.innerText = `Lives: ${lives}`;
        alert("Game Over! You lost all your lives. Press OK to restart the game.");
        location.reload();
    }

};

const changeDirection = e => {
    if (isPaused) return;

    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
};

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const resetSnakeAndFood = () => {
    snakeX = 5;
    snakeY = 5;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    updateFoodPosition();
};

const initGame = () => {
    if (gameOver || isPaused) return;

    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    snakeX += velocityX;
    snakeY += velocityY;

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
        handleGameOver();
        return;
    }

    for (let i = 1; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][1] && snakeY === snakeBody[i][0]) {
            gameOver = true;
            handleGameOver();
            return;
        }
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeY, snakeX];

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][0]} / ${snakeBody[i][1]}"></div>`;
    }

    playBoard.innerHTML = html;
};


updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
