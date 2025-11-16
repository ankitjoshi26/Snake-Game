const board = document.querySelector('.board');  //full board
const startButton = document.querySelector('.btn-start')  // game start button
const modal = document.querySelector('.modal');  // showing modal div.
const startGameModal = document.querySelector(".start-game");  // game starting display
const gameOverModal = document.querySelector(".game-over");    // game-over display
const restartBtn = document.querySelector(".btn-restart")    // restart button

const highScoreElem = document.querySelector("#high-score")
const ScoreElem = document.querySelector("#score")
const timeElem = document.querySelector("#time")

const blockHeight = 30;
const blockWidth = 30;

let highScore = localStorage.getItem("highScore") || 0; // local storage m phle kuch nhi hoga to undefined show hoga to uski jagah 0 kr dega.
let score = 0;
let time = '00:00'

const cols = Math.floor(board.clientWidth / blockWidth); //removes digits after decimal(point).
const rows = Math.floor(board.clientHeight / blockHeight);

let intervalId = null;
let timeIntervalId = null;

const blocks = [];  // Array for storing coordinates of each block(div).
let  snake = [{
                x:1,y:3
            }]  // length of snake
let direction = 'right';
let food = {
            x: Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        }

for(let row=0;row<rows;row++){ 
    for(let col=0;col<cols;col++){
        const block = document.createElement('div'); // created a div.
        block.classList.add("block");  // given class to the div.
        board.appendChild(block);     // added to board(in html element).
        // block.innerText = `${row}-${col}` // showing value of row and col in each block.
        blocks[`${row}-${col}`] = block; //block array m jo row or col ki value hai unko ek ek block(div) dedia(assign kr dia). 
    }
}

function render() {
    let head = null //head of snake

    blocks[`${food.x}-${food.y}`].classList.add("food");  //adding styling to the the food.

    // Direction Logic
    if(direction === "left"){
        head = {x: snake[0].x, y: snake[0].y - 1};  //changing position of snake to left (by changing position of head of snake)
    }else if(direction === "right"){
        head = {x: snake[0].x, y: snake[0]. y + 1};
    }else if(direction === "down"){
        head = {x: snake[0].x + 1, y: snake[0].y};
    }else{
        head = {x: snake[0].x - 1, y: snake[0].y};
    }

    // Wall collision logic 
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        // alert("Game Over")
        clearInterval(intervalId); // Game stop(snake ab move nhi krega).
        modal.style.display = "flex"; // show restart button on display.
        startGameModal.style.display = "none" // remove start button from display.
        gameOverModal.style.display = "flex" // show restart button of display.
        return; 
    }

    // Food consume logic
    if(head.x == food.x && head.y == food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food"); // removing food 
        food = {  // generating food again
            x: Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        }
        blocks[`${food.x}-${food.y}`].classList.add("food"); // adding food again
        snake.unshift(head) //increase snake length

        score += 10;
        ScoreElem.innerText = `${score}`

        // storing high score to local storage
        if(score > highScore){
            highScore = score; 
            localStorage.setItem("highScore", highScore.toString()); // saving highscore to local storage. (Note: local storage m koi bhi data string ki form m save hota hai)
        }

    }

    snake.forEach( (snake) => {
        blocks[`${snake.x}-${snake.y}`].classList.remove("fill");
    })

    snake.unshift(head); // added new direction in starting of the snake Array of object(snake object).
    snake.pop(); //remove last object from Array of object(snake object).


    snake.forEach((snake) => {  // selecting and iterating on snake(object).
        blocks[`${snake.x}-${snake.y}`].classList.add("fill"); // adding css class on snake.
    })
}


startButton.addEventListener("click", () => { // game start button
    modal.style.display = "none"; // jaise hi user start button pe click krega modal ka display none ho jayega 
    intervalId = setInterval( () => {  // set timer for snake movement.
        render();
    },300)

    // Game time logic
    timeIntervalId = setInterval( () => {  // set timer for game playing time.
        let [minute,second] = time.split(":").map(Number)  // split(":") -> : ke basis pe string ko  tod ke array ke ander string  return krta hai. ('00:00' bn jayega -> ["00","00 "]) ..... to ishme ye hoga jo time ki value hai wo  : ke basis pe split ho jayegi or jo split() array return krega ushe numbers m convert kr denge .map(Number) ke use krke. or fr jo number aayenge po minute or second ko assign ho jayenge. 

        if(second == 59){   // agar second 59 ke barabar ho jata hai...
            minute += 1;   // to minute ko 1 se badha do...
            sec = 0;   // or fr se second ko 0 kr do.
        }else{  // or esha nhi hai..
            second += 1;  //second ko ek se bdha do. 
        }

        time = `${minute < 10 ? "0" + minute : minute}:${second < 10 ? "0" + second : second}`;  // setting time
        timeElem.innerHTML = `${time}`  // showing time.

    },1000) // 1000 ms = 1 second.
})


restartBtn.addEventListener("click", restartGame)

// Restart game logic
function restartGame(){
    score = 0; // score will be zero(0) again after restarting the game.
    time = "00:00" // time will also restart after restarting the game.

    ScoreElem.innerText = `${score}` // upading score again after restarting the game.
    highScoreElem.innerText = `${highScore}`; // showing high score.
    timeElem.innerHTML = `${time}`; // showing time.


    blocks[`${food.x}-${food.y}`].classList.remove("food");
    snake.forEach(snake => {
        blocks[`${snake.x}-${snake.y}`].classList.remove("fill");
    })
    modal.style.display = "none"; // remove modal from display after clicking restart button.
    direction = "down";
    snake = [{x:1, y:3}];  // re-assign snake length after restarting the game.
    food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)}; // re generate food after restarting the game.
    intervalId = setInterval( () => {
        render();
    },300) 
}


addEventListener("keydown", (event) => {  // for key press (snake movement).
    if(event.key == "ArrowUp"){
        direction = "up"
    }else if(event.key == "ArrowDown"){
        direction = "down"
    }else if(event.key == "ArrowLeft"){
        direction = "left"
    }else{
        direction = "right"
    }
})