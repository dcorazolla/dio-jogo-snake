// let snakeGame = () => {

    /**
     * Valores padrao
     */
    let defs = {
        bgColor: "#000",
        boxSize: 15,
        direction: "right",
        transBorder: false,
        updateTime: 200,
        paused: true,
        winWidth: 0,
        winHeight: 0,
        gameWidth: 0,
        gameHeight: 0,
        panelWidth: 0,
        panelHeight: 0
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
    let food = {
        x: Math.floor(Math.random() * 37 + 1) * defs.boxSize,
        y: Math.floor(Math.random() * 37 + 1) * defs.boxSize
    };

    let points = 0;
    let render = 0;

    let changeStatus = (el) => {
        console.log(el.checked);
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

    /**
     * Desenha a cobra
     */
    let createSnake = () => {
        let green = 0;
        let size = snake.length;
        // se cobra estiver vazio, cria primeiro box
        if (size==0) {
            snake.push({x: defs.boxSize * 19, y: defs.boxSize * 19});
        }
        // indice de mudanca de cor
        let sumColor = parseInt(255/size);
        // desenha cobra
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

    let restart = () => {
        clearInterval(interval);
        snake = [
            {
                
            }
        ];
        points = 0;
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
            food = {
                x: Math.floor(Math.random() * 37 + 1) * defs.boxSize,
                y: Math.floor(Math.random() * 37 + 1) * defs.boxSize
            };
        }
        snake.unshift({x: posX, y: posY});
    }

    /**
     * Detecta tecla pressionada
     * @param {EventListener} event 
     */
    let getKey = (event) => {
        if (movimento == false) {
            if (event.keyCode == 37 && defs.direction != "right") {
                defs.direction = "left";
                movimento = true;
            }
            else if (event.keyCode == 38 && defs.direction != "down") {
                defs.direction = "up";
                movimento = true;
            }
            else if (event.keyCode == 39 && defs.direction != "left") {
                defs.direction = "right";
                movimento = true;
            }
            else if (event.keyCode == 40 && defs.direction != "up") {
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
        if (snake[0].y > defs.boxSize * 39 && defs.direction=="down") {
            if (defs.transBorder == true) snake[0].y = 0;
            else gameOver();
        }
    };

    /**
     * Detecta colisao na borda direita
     */
    let colisionDetectRight = () => {
        if (snake[0].x > defs.boxSize * 39 && defs.direction=="right") {
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
        clearInterval(interval);
        alert("Game over!");
    };

    let printData = () => {
        document.getElementById("spnpontos").innerHTML = points;
    };

    document.addEventListener('keydown', getKey);

    let sizeDetect = () => {
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;

        if (defs.winWidth != winWidth || defs.winHeight != winHeight) {
            sizeModify(winWidth, winHeight);
        }
    };

    let sizeModify = (width, height) => {

        let oldWidth = defs.winWidth;
        let oldHeight = defs.winHeight;
        let oldBoxSize = defs.boxSize;

        defs.winWidth = width;
        defs.winHeight = height;
   
        // pegando altura do painel
        defs.panelHeight = pn.offsetHeight;
        // definindo tamanho do canvas em 90% do menor tamanho da tela
        let size = 0;
        // paisagem - se a tela tiver largura maior que altura
        if (defs.winWidth >= defs.winHeight) {
            size = Math.floor((defs.winHeight - defs.panelHeight) * 0.9);
        }
        // retrato - se a tela for mais alta
        else {
            size = Math.floor(defs.winWidth * 0.9);
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

        snakeSizeModify();
    };
    
    let snakeSizeModify = (boxSize, wid) => {
        if (snake.length > 0) {
            let propY = snake[0].y / defs.boxSize;
            let propX = snake[0].x / defs.boxSize;
            console.log(defs.boxSize);
            console.log(defs.boxSize);
            // console.log(propY);
        }
    };

    /**
     * As rodadas de renderizacao do jogo
     */
    let updateGame = () => {
        sizeDetect();
        createBackground();
        createSnake();
        printData();
        if (!defs.paused) {
            movimento = false;
            createFood();
            moveSnake();
            colisionDetect();
            render++;
        }
    }

    // startConfigs();
    let interval = setInterval(updateGame, defs.updateTime);

// };

// snakeGame();