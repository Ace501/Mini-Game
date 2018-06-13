let content = document.getElementById('content');
let scoreBox = document.getElementById('score');
let speed = 200;
let snakeMove;
let startflag;


init();
bindEvent();


function init() {
    //地图
    this.mapW = parseInt(getComputedStyle(content).width);
    this.mapH = parseInt(getComputedStyle(content).height);
    this.mapDiv = content;
    //食物
    this.foodW = 4;
    this.foodH = 7;
    this.foodX = 0;
    this.foodY = 0;
    //蛇
    this.snakeW = 5;
    this.snakeH = 9;
    this.snakebody = [[3, 1, 'head'], [2, 1, 'body'], [1, 1, 'body']];
    //游戏属性
    this.direct = 'right';
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;
    startflag = 1;
    speed = 200;
    this.score = 0;
}


function startGame() {
    init();
    food();
    snake();
    snakeMove = setInterval(function () {
        move();
    }, speed);
}


function food() {
    let food = document.createElement('div');
    food.style.width = this.foodW + '%';
    food.style.height = this.foodH + '%';
    food.style.position = 'absolute';
    let flag = this.snakebody.length;

    while(flag) {
        flag = this.snakebody.length;
        this.foodX = Math.floor(Math.random()*(this.mapW/20));
        this.foodY = Math.floor(Math.random()*(this.mapH/20));
        for (let i = 0; i < this.snakebody.length; i++) {
            if (this.foodX != this.snakebody[i][0] || this.foodY != this.snakebody[i][1]) {
                flag -= 1;
            }
        }
    }

    food.style.left = this.foodX*20 +'px';
    food.style.top = this.foodY*20 + 'px';
    this.mapDiv.appendChild(food).setAttribute('class', 'food');
}


function snake() {
    for(let i = 0; i < this.snakebody.length; i++){
        let snake = document.createElement('div');
        snake.style.width = this.snakeW + '%';
        snake.style.height = this.snakeH + '%';
        snake.style.position = 'absolute';
        snake.style.left = this.snakebody[i][0]*20 + 'px';
        snake.style.top = this.snakebody[i][1]*20 + 'px';
        snake.classList.add(this.snakebody[i][2]);
        this.mapDiv.appendChild(snake).classList.add('snake');
        if(this.snakebody[i][2] == 'head') {
            switch (this.direct) {
                case 'right':
                    break;
                case 'up':
                    snake.style.transform = 'rotate(90deg)';
                    break;
                case 'left':
                    snake.style.transform = 'rotate(180deg)';
                    break;
                case 'down':
                    snake.style.transform = 'rotate(270deg)';
                    break;
                default:
                    break;
            }
        }
    }
}


function move() {
    for(let i = this.snakebody.length - 1; i > 0; i--) {
        this.snakebody[i][0] = this.snakebody[i - 1][0];
        this.snakebody[i][1] = this.snakebody[i - 1][1];
    }
    switch (this.direct) {
        case 'right':
            this.snakebody[0][0] += 1;
            this.left = false;
            this.right = false;
            this.up = true;
            this.down = true;
            break;
        case 'up':
            this.snakebody[0][1] += 1;
            this.left = true;
            this.right = true;
            this.up = false;
            this.down = false;
            break;
        case 'left':
            this.snakebody[0][0] -= 1;
            this.left = false;
            this.right = false;
            this.up = true;
            this.down = true;
            break;
        case 'down':
            this.snakebody[0][1] -= 1;
            this.left = true;
            this.right = true;
            this.up = false;
            this.down = false;
            break;
        default:
            break;
    }
    removeClass('snake');
    snake();

    if(this.snakebody[0][0] == this.foodX && this.snakebody[0][1] == this.foodY) {
        let snakeEndX = this.snakebody[this.snakebody.length - 1][0];
        let snakeEndY = this.snakebody[this.snakebody.length - 1][1];
        switch (this.direct){
            case 'right':
                this.snakebody.push([snakeEndX + 1, snakeEndY, 'body']);
                break;
            case 'up':
                this.snakebody.push([snakeEndX, snakeEndY - 1, 'body']);
                break;
            case 'left':
                this.snakebody.push([snakeEndX - 1, snakeEndY, 'body']);
                break;
            case 'down':
                this.snakebody.push([snakeEndX, snakeEndY + 1, 'body']);
                break;
            default:
                break;
        }
        this.score += 1;
        scoreBox.innerHTML = this.score;
        document.getElementById('score1').innerHTML = this.score;
        removeClass('food');
        food();
        speed -= 3;
        clearInterval(snakeMove);
        snakeMove = setInterval(function () {
            move();
        }, speed);
    }

    if(this.snakebody[0][0] < 0 || this.snakebody[0][0] >= this.mapW/20
        || this.snakebody[0][1] < 0 || this.snakebody[0][1] >= this.mapH/20) {
        reloadGame();
    }
    let snakeHX = this.snakebody[0][0];
    let snakeHY = this.snakebody[0][1];
    for (let i = 1; i < this.snakebody.length; i++) {
        if (snakeHX == this.snakebody[i][0] && snakeHY == this.snakebody[i][1]) {
            reloadGame();
        }
    }
}


function removeClass(className) {
    let ele = document.getElementsByClassName(className);
    while (ele.length > 0){
        ele[0].parentNode.removeChild(ele[0]);
    }
}

function setDirect(code) {
    switch (code){
        case 37:
            if(this.left){
                this.direct = 'left';
            }
            break;
        case 40:
            if(this.up){
                this.direct = 'up';
            }
            break;
        case 39:
            if(this.right){
                this.direct = 'right';
            }
            break;
        case 38:
            if(this.down){
                this.direct = 'down';
            }
            break;
        default:
            break;
    }
}


function bindEvent() {
    document.onkeydown = function (e) {
        let code = e.keyCode;
        setDirect(code);
    }
    document.getElementById('close').onclick = function () {
        document.getElementById('end').style.display = 'none';
    }
    document.getElementById("startgame").onclick = function () {
        document.getElementById("startPage").style.display = 'none';
        document.getElementById('start').style.backgroundImage = 'url("picture/pause.png")';
        startGame();
    }
    document.getElementById('start').onclick = function () {
        document.getElementById('end').style.display = 'none';
        if(startflag == 1) {
            startflag = 0;
            document.getElementById('start').style.backgroundImage = 'url("picture/start.png")';
            clearInterval(snakeMove);
        }
        else {
            startflag = 1;
            document.getElementById('start').style.backgroundImage = 'url("picture/pause.png")';
            if(document.getElementsByClassName('snake').length == 0) {
                this.score = 0;
                document.getElementById('score1').innerHTML = this.score;
                startGame();
            }
            else {
                 snakeMove = setInterval(function () {
                    move();
                }, speed);
            }
        }
    }
}


function reloadGame() {
    removeClass('snake');
    removeClass('food');
    clearInterval(snakeMove);
    startflag = 0;
    document.getElementById('start').style.backgroundImage = 'url("picture/start.png")';
    document.getElementById('end').style.display = 'block';
}
