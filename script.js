const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let canvasSize = 400;
let gridSize = canvasSize / box;

let snake;
let direction;
let food;
let score;
let running = false;
let directionChanged = false;

let lastUpdateTime = 0;
let updateInterval;

let difficulties; 

const difficultySelect = document.getElementById("difficulty");

document.addEventListener("keydown", changeDirection);

async function loadDifficulties() {
    const res = await fetch('./data.json');
    difficulties = await res.json();
    init(); 
}

loadDifficulties();

difficultySelect.addEventListener("change", () => {
    resetGame();
});

function init() {
    const difficulty = document.getElementById("difficulty").value;
    const params = difficulties.difficulties[difficulty];

    updateInterval = params.updateInterval;
    canvasSize = params.canvasSize;
    gridSize = canvasSize / box;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    snake = [{ x: Math.floor(gridSize / 4) * box, y: Math.floor(gridSize / 2) * box }];
    direction = "RIGHT";
    score = 0;
    document.getElementById("score").innerText = score;

    food = { x: Math.floor(gridSize / 4) * 3 * box, y: Math.floor(gridSize / 2) * box };
    render();
}

function randomFoodPosition() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
        };
    } while (collision(position, snake));
    return position;
}

function startGame() {
    if (!running) {
        running = true;
        lastUpdateTime = 0;
        requestAnimationFrame(gameLoop);
    }
}

function resetGame() {
    running = false;
    init();
}

function gameLoop(timestamp) {
    if (!running) return;

    if (timestamp - lastUpdateTime > updateInterval) {
        update();
        lastUpdateTime = timestamp;
    }

    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    directionChanged = false;

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    let newHead = { x: snakeX, y: snakeY };

    if (isWallCollision(snakeX, snakeY) || collision(newHead, snake)) {
        running = false;
        alert("Game Over !");
        return;
    }

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        document.getElementById("score").innerText = score;
        food = randomFoodPosition();
    } else {
        snake.pop();
    }

    snake.unshift(newHead);
}

function render() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // nourriture
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i === 0) ? "lime" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function isWallCollision(x, y) {
    return (
        x < 0 ||
        y < 0 ||
        x >= canvasSize ||
        y >= canvasSize
    );
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function changeDirection(event) {
    if (directionChanged) return;

    if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
        directionChanged = true;
    } 
    if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
        directionChanged = true;
    }
    if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
        directionChanged = true;
    }
    if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
        directionChanged = true;
    }
}