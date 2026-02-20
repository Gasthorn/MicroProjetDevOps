const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;
const gridSize = canvasSize / box;

let snake;
let direction;
let food;
let score;
let running = false;
let directionChanged = false;

let lastUpdateTime = 0;
let updateInterval = 120;

document.addEventListener("keydown", changeDirection);

function init() {
    snake = [{ x: 6 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    document.getElementById("score").innerText = score;

    food = {
        x:15*box,
        y:10*box
    };
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

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    for (let i = 0; i < snake.length; i++) {
        if (i== 0){
            ctx.fillStyle = "lime";
        }else {
            ctx.fillStyle = 'green';
        }
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function isWallCollision(x, y) {
    return (
        x < 0 ||
        y < 0 ||
        x > canvasSize - box ||
        y > canvasSize - box
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

    if (event.key === "ArrowLeft" && direction !== "RIGHT"){
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

init();