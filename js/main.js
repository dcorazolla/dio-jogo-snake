(function snakeGame(){

    /**
     * Valores padrao
     */
    let defs = {
        bgColor: "#000",
        boxSize: 15,
        direction: "right",
        transBorder: true,
        updateTime: 250
    };

    // pega o canvas
    let cv = document.getElementById("snake-game");
    // pega o contexto 2d do canvas
    let ct = cv.getContext("2d");

    /**
     * A cobra
     */
    let snake = [
        {
            x: defs.boxSize * 19,
            y: defs.boxSize * 19
        }
    ];
    let food = {
        x: Math.floor(Math.random() * 37 + 1) * defs.boxSize,
        y: Math.floor(Math.random() * 37 + 1) * defs.boxSize
    };

    let points = 0;

    /**
     * Desenha o fundo
     */
    let createBackground = () => {
        ct.fillStyle = defs.bgColor;
        ct.fillRect(0, 0, defs.boxSize * 40, defs.boxSize * 40);
    };

    /**
     * Desenha a cobra
     */
    let createSnake = () => {
        let green = 0;
        let size = snake.length;
        let sumColor = parseInt(255/size);
        for (let i=0; i<size; i++) {
            ct.fillStyle = "rgb(255, " + green + ", 0)"; //defs.boxHeadColor;
            ct.fillRect(snake[i].x, snake[i].y, defs.boxSize, defs.boxSize);
            green += sumColor;
        }
    };

    let createFood = () => {
        ct.fillStyle = "green";
        ct.fillRect(food.x, food.y, defs.boxSize, defs.boxSize);
    };

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
        snake.pop();
        snake.unshift({x: posX, y: posY});
    }

    /**
     * Detecta tecla pressionada
     * @param {EventListener} event 
     */
    let getKey = (event) => {
        if (event.keyCode == 37 && defs.direction != "right") defs.direction = "left";
        else if (event.keyCode == 38 && defs.direction != "down") defs.direction = "up";
        else if (event.keyCode == 39 && defs.direction != "left") defs.direction = "right";
        else if (event.keyCode == 40 && defs.direction != "up") defs.direction = "down";
    };

    /**
     * Detecta colisao na borda esquerda
     */
    let colisionDetectLeft = () => {
        if (snake[0].x < 0 && defs.direction=="left") {
            if (defs.transBorder == true) snake[0].x = defs.boxSize * 39;
        }
    };

    /**
     * Detecta colisao na borda superior
     */
    let colisionDetectTop = () => {
        if (snake[0].y < 0 && defs.direction=="up") {
            if (defs.transBorder == true) snake[0].y = defs.boxSize * 39;
        }
    };

    /**
     * Detecta colisao na borda inferior
     */
    let colisionDetectBottom = () => {
        if (snake[0].y > defs.boxSize * 39 && defs.direction=="down") {
            if (defs.transBorder == true) snake[0].y = 0;
        }
    };

    /**
     * Detecta colisao na borda direita
     */
    let colisionDetectRight = () => {
        if (snake[0].x > defs.boxSize * 39 && defs.direction=="right") {
            if (defs.transBorder == true) snake[0].x = 0;
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
    };

    /**
     * Encerra o jogo
     */
    let gameOver = () => {};

    document.addEventListener('keydown', getKey);

    /**
     * As rodadas de renderizacao do jogo
     */
    let updateGame = () => {
        createBackground();
        createSnake();
        createFood();
        moveSnake();
        colisionDetect();
        points++;
        // setTimeout(updateGame, defs.updateTime);
    }

    setInterval(updateGame, defs.updateTime);

})();