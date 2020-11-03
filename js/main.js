// let snakeGame = () => {

    /**
     * Valores padrao
     */
    let defs = {
        bgColor: "#000",
        boxSize: 15,
        direction: "right",
        transBorder: true,
        updateTime: 150,
        paused: true,
        winWidth: 0,
        winHeight: 0,
        gameWidth: 0,
        gameHeight: 0,
        panelWidth: 0,
        panelHeight: 0,
        ended: false,
        rodada: false,
        points: 0,
        fruits: 0,
        level: 1
    };

    // pega o canvas
    let cv = document.getElementById("snake-game");
    // pega o contexto 2d do canvas
    let ct = cv.getContext("2d");
    let pn = document.getElementById("painel");

    let movimento = false;

    /**
     * A cobra
     */
    let snake = [];
    let food = null;

    let points = 0;
    let render = 0;

    let changeStatus = (el) => {
        if (el.checked) {
            el.checked = true;
            defs.transBorder = true;
        }
        else {
            el.checked = false;
            defs.transBorder = false;
        }
    };

    /**
     * Desenha o fundo
     */
    let createBackground = () => {
        ct.fillStyle = defs.bgColor;
        ct.fillRect(0, 0, defs.boxSize * 40, defs.boxSize * 40);
    };

    let createSquare = (x, y) => {
        ct.fillRect(x, y, defs.boxSize, defs.boxSize);
    };

    let createTriangle = (xx, yy, rotacao) => {
        let triangle = [
            {x: xx, y: yy + defs.boxSize},
            {x: xx + Math.floor(defs.boxSize / 2), y: yy},
            {x: xx + defs.boxSize, y: yy + defs.boxSize}
        ];
        if (rotacao == 1) {
            triangle = [
                {x: xx, y: yy},
                {x: xx + defs.boxSize, y: yy},
                {x: xx + defs.boxSize, y: yy + defs.boxSize}
            ];
        }
        else if (rotacao == 2) {
            triangle = [
                {x: xx, y: yy},
                {x: xx + defs.boxSize, y: yy + Math.floor(defs.boxSize / 2)},
                {x: xx, y: yy + defs.boxSize}
            ];
        }
        else if (rotacao == 3) {
            triangle = [
                {x: xx + defs.boxSize, y: yy},
                {x: xx + defs.boxSize, y: yy + defs.boxSize},
                {x: xx, y: yy + defs.boxSize}
            ];
        }
        else if (rotacao == 4) {
            triangle = [
                {x: xx, y: yy},
                {x: xx + defs.boxSize, y: yy},
                {x: xx + Math.floor(defs.boxSize / 2), y: yy + defs.boxSize}
            ];
        }
        else if (rotacao == 5) {
            triangle = [
                {x: xx, y: yy},
                {x: xx + defs.boxSize, y: yy + defs.boxSize},
                {x: xx, y: yy + defs.boxSize}
            ];
        }
        else if (rotacao == 6) {
            triangle = [
                {x: xx + defs.boxSize, y: yy},
                {x: xx + defs.boxSize, y: yy + defs.boxSize},
                {x: xx, y: yy + Math.floor(defs.boxSize / 2)}
            ];
        }
        ct.beginPath();
        ct.moveTo(triangle[0].x, triangle[0].y);
        ct.lineTo(triangle[1].x, triangle[1].y);
        ct.lineTo(triangle[2].x, triangle[2].y);
        // ct.rotate((Math.PI / 180) * 15);
        ct.fill();
        ct.closePath();
    };

    /**
     * Desenha a cobra
     */
    let createSnake = () => {
        let green = 0;
        let size = snake.length;
        // se cobra estiver vazio, cria primeiro box
        if (size==0) {
            snake.push({x: defs.boxSize * 19, y: defs.boxSize * 19});
            snake.push({x: defs.boxSize * 18, y: defs.boxSize * 19});
            // snake.push({x: defs.boxSize * 17, y: defs.boxSize * 19});
            // snake.push({x: defs.boxSize * 17, y: defs.boxSize * 18});
            // snake.push({x: defs.boxSize * 17, y: defs.boxSize * 17});
            // snake.push({x: defs.boxSize * 14, y: defs.boxSize * 19});
            // snake.push({x: defs.boxSize * 13, y: defs.boxSize * 19});
        }
        // indice de mudanca de cor
        let sumColor = parseInt(255/size);
        // desenha cobra
        for (let i=0; i<size; i++) {
            ct.fillStyle = "rgba(255, " + green + ", 0, 1)";
            if (size > 1 && i == (size-1)) {
                let rotacao = 0;
                if (snake[i].x == snake[i-1].x) {
                    if (snake[i].y > snake[i-1].y) rotacao = 4;
                }
                else {
                    if (snake[i].x < snake[i-1].x) rotacao = 6;
                    else rotacao = 2;
                }
                createTriangle(snake[i].x, snake[i].y, rotacao);
            }
            else {
                createSquare(snake[i].x, snake[i].y);
            }
            // createTriangle(snake[i].x, snake[i].y, i);
            green += sumColor;
        }
    };

    let createFood = () => {
        if (food == null) {
            startFood();
        }
        ct.fillStyle = "green";
        ct.fillRect(food.x, food.y, defs.boxSize, defs.boxSize);
    };

    let startFood = () => {
        food = {
            x: Math.floor(Math.random() * 37 + 1) * defs.boxSize,
            y: Math.floor(Math.random() * 37 + 1) * defs.boxSize
        };
    };

    let restart = () => {
        clearInterval(interval);
        snake = [];
        defs.points = 0;
        defs.updateTime = 150;
        defs.direction = "right";
        startFood();
        defs.ended = false;
        defs.fruits = 0;
        defs.level = 1;
        interval = setInterval(updateGame, defs.updateTime);
    }

    /**
     * Movimenta cobra conforme direcao
     */
    let moveSnake = () => {
        let posX = snake[0].x;
        let posY = snake[0].y;
        switch (defs.direction) {
            case "up":
                posY -= defs.boxSize;
                break;
            case "right":
                posX += defs.boxSize;
                break;
            case "down":
                posY += defs.boxSize;
                break;
            case "left":
                posX -= defs.boxSize;
                break;
        }
        if (posX != food.x || posY != food.y) {
            snake.pop();
        }
        else {
            defs.fruits++;
            startFood();
        }
        snake.unshift({x: posX, y: posY});
    }

    let mouseActionUp = () => {
        if (defs.direction != "down") {
            defs.direction = "up";
            // movimento = true;
        }
        return false;
    }

    let mouseActionDown = () => {
        if (defs.direction != "up") {
            defs.direction = "down";
            movimento = true;
        }
        return false;
    }

    let mouseActionLeft = () => {
        if (defs.direction != "right") {
            defs.direction = "left";
            movimento = true;
        }
        return false;
    }

    let mouseActionRight = () => {
        if (defs.direction != "left") {
            defs.direction = "right";
            movimento = true;
        }
        return false;
    }

    /**
     * Detecta tecla pressionada
     * @param {EventListener} event 
     */
    let getKey = (event) => {
        if (movimento == false) {
            if ((event.keyCode == 37 || event.keyCode == 65) && defs.direction != "right") {
                defs.direction = "left";
                movimento = true;
            }
            else if ((event.keyCode == 38 || event.keyCode == 87) && defs.direction != "down") {
                defs.direction = "up";
                movimento = true;
            }
            else if ((event.keyCode == 39 || event.keyCode == 68) && defs.direction != "left") {
                defs.direction = "right";
                movimento = true;
            }
            else if ((event.keyCode == 40 || event.keyCode == 83) && defs.direction != "up") {
                defs.direction = "down";
                movimento = true;
            }
        }
    };

    /**
     * Detecta colisao na borda esquerda
     */
    let colisionDetectLeft = () => {
        if (snake[0].x < 0 && defs.direction=="left") {
            if (defs.transBorder == true) snake[0].x = defs.boxSize * 39;
            else gameOver();
        }
    };

    /**
     * Detecta colisao na borda superior
     */
    let colisionDetectTop = () => {
        if (snake[0].y < 0 && defs.direction=="up") {
            if (defs.transBorder == true) snake[0].y = defs.boxSize * 39;
            else gameOver();
        }
    };

    /**
     * Detecta colisao na borda inferior
     */
    let colisionDetectBottom = () => {
        if (snake[0].y >= defs.boxSize * 40 && defs.direction=="down") {
            if (defs.transBorder == true) snake[0].y = 0;
            else gameOver();
        }
    };

    /**
     * Detecta colisao na borda direita
     */
    let colisionDetectRight = () => {
        if (snake[0].x >= defs.boxSize * 40 && defs.direction=="right") {
            if (defs.transBorder == true) snake[0].x = 0;
            else gameOver();
        }
    };

    let colisionAuto = () => {
        for (let i=1; i<snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
                gameOver();
                break;
            }
        }
    };

    /**
     * Coordena as deteccoes de colisao
     */
    let colisionDetect = () => {
        colisionDetectLeft();
        colisionDetectTop();
        colisionDetectBottom();
        colisionDetectRight();
        colisionAuto();
    };

    /**
     * Encerra o jogo
     */
    let gameOver = () => {
        defs.ended = true;
        clearInterval(interval);
        alert("Game over!");
    };

    let printData = () => {
        // document.getElementById("spnpontos").innerHTML = defs.points;
        document.getElementById("spnfrutas").innerHTML = defs.fruits;
        document.getElementById("spnnivel").innerHTML = defs.level;
    };

    document.addEventListener('keydown', getKey);
    document.getElementById("buttonUp").addEventListener('mousedown', mouseActionUp);
    document.getElementById("buttonUp").addEventListener('touchstart', mouseActionUp);
    document.getElementById("buttonLeft").addEventListener('mousedown', mouseActionLeft);
    document.getElementById("buttonLeft").addEventListener('touchstart', mouseActionLeft);
    document.getElementById("buttonDown").addEventListener('mousedown', mouseActionDown);
    document.getElementById("buttonDown").addEventListener('touchstart', mouseActionDown);
    document.getElementById("buttonRight").addEventListener('mousedown', mouseActionRight);
    document.getElementById("buttonRight").addEventListener('touchstart', mouseActionRight);

    let sizeDetect = () => {
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;

        if (defs.winWidth != winWidth || defs.winHeight != winHeight) {
            sizeModify(winWidth, winHeight);
        }
    };

    let sizeModify = (width, height) => {

        oldWidth = defs.gameWidth;
        oldSize = defs.boxSize;

        defs.winWidth = width;
        defs.winHeight = height;
   
        // pegando altura do painel
        defs.panelHeight = pn.offsetHeight;
        // definindo tamanho do canvas em 90% do menor tamanho da tela
        let size = 0;
        // paisagem - se a tela tiver largura maior que altura
        if (defs.winWidth >= defs.winHeight) {
            size = Math.floor((defs.winHeight - defs.panelHeight));
        }
        // retrato - se a tela for mais alta
        else {
            size = Math.floor(defs.winWidth);
        }
        // definindo tamanho do box.
        // maior divisivel por 40, menor do que tamanho do jogo
        // console.log(size);
        while (true) {
            if (size%40 == 0) break;
            size--;
        }
        // definindo tamanho do box
        defs.boxSize = size / 40;
        // ajustando tamanho do canvas
        defs.gameWidth = defs.gameHeight = size;
        // definindo largura do painel
        defs.panelWidth = size;

        // ajustando elementos da tela
        cv.width = defs.gameWidth;
        cv.height = defs.gameHeight;
        pn.setAttribute("style","width:" + (defs.panelWidth - 20) + "px");

        if (snake.length > 0) {
            snakeSizeModify(oldWidth, oldSize);
        }
    };
    
    let snakeSizeModify = (oldWidth, oldSize) => {
        if (oldSize != defs.boxSize) {
            restart();
        }
    };

    let start = () => {
        if (defs.points == 0) restart();
        defs.paused = false;
        document.getElementById("btn-start").style.display = "none";
        document.getElementById("btn-pause").style.display = "block";
        document.getElementById("btn-restart").style.display = "block";
    };

    let pause = () => {
        defs.paused = true;
        document.getElementById("btn-start").style.display = "block";
        document.getElementById("btn-pause").style.display = "none";
    }

    let pointsCount = () => {
        defs.points++;
        if (defs.points % (defs.level * 100) == 0 && defs.updateTime > 40) {
            defs.updateTime -= 10;
            defs.level++;
            defs.points = 0;
            clearInterval(interval);
            interval = setInterval(updateGame, defs.updateTime);
        }
    };

    /**
     * As rodadas de renderizacao do jogo
     */
    let updateGame = () => {
        if (!defs.rodada) {
            defs.rodada = true;
            if (food == null) startFood();
            sizeDetect();
            createBackground();
            createSnake();
            printData();
            if (!defs.paused && !defs.ended) {
                movimento = false;
                moveSnake();
                createFood();
                colisionDetect();
                pointsCount();
                render++;
            }
            defs.rodada = false;
        }
    }

    // startConfigs();
    let interval = setInterval(updateGame, defs.updateTime);

// };

// snakeGame();