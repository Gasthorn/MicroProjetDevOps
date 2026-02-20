const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = 400;

let snake = [
    {x:9*box, y:10*box}
];

let direction = "RIGHT";
let food = {
    x: Math.floor(Math.random()*20)*box,
    y: Math.floor(Math.random()*20)*box
};

let score = 0;

document.addEventListener("keydown",changeDirection);

function changeDirection(event){
    if(event.key === "ArrowLeft" && direction !== "RIGHT"){
        direction = "LEFT";
    }
    else if (event.key === "ArrowRight" && direction !== "LEFT"){
        direction = "RIGHT";
    }
    else if (event.key === "ArrowUp" && direction !== "DOWN"){
        direction = "UP";
    }
    else if (event.key === "ArrowDown" && direction !== "UP"){
        direction = "DOWN";
    }
}

function draw(){
    ctx.clearRect(0,0,canvasSize,canvasSize);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x,food.y,box,box);

    for (let i = 0;i < snake.length; i++){
        if (i === 0){
            ctx.fillStyle = "lime";
        } else {fillStyle = "green";}
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
    }

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") {
        snakeX -= box;
    }else if (direction === "RIGHT"){
        snakeX += box;
    }else if (direction === "UP"){
        snakeY -= box;
    }else if (direction === "DOWN"){
        snakeY += box;
    }

    if (snakeX === food.x && snakeY === food.y){
        score ++;
        document.getElementById("score").innerText=score;
        food = {
            x: Math.floor(Math.random()*20)*box,
            y: Math.floor(Math.random()*20)*box
        };
    }else {
        snake.pop();
    }

    let newHead = {
        x:snakeX,
        y:snakeY
    };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)){
        clearInterval(game);
        alert("Game Over !");
    } 

    snake.unshift(newHead);
}

function collision(head, array){
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

let game = serInterval(draw,100);