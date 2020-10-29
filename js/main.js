(function snakeGame(){

    /**
     * Valores padrao
     */
    let defs = {
        colors: {
            bg: "#000",
            snake: "#0f0"
        },
        sizes: {
            box: 15
        }
    };

    // pega o canvas
    let cv = document.getElementById("snake-game");
    // pega o contexto 2d do canvas
    let ct = cv.getContext("2d");

    let direction = "right";

    /**
     * A cobra
     */
    let snake = [
        {
            x: defs.sizes.box * 19,
            y: defs.sizes.box * 19
        }
    ];

    /**
     * Desenha o fundo
     */
    let createBackground = () => {
        ct.fillStyle = defs.colors.bg;
        ct.fillRect(0, 0, defs.sizes.box * 40, defs.sizes.box * 40);
    };

    /**
     * Desenha a cobra
     */
    let createSnake = () => {
        for (let i=0; i<snake.length; i++) {
            ct.fillStyle = defs.colors.snake;
            ct.fillRect(snake[i].x, snake[i].y, defs.sizes.box, defs.sizes.box);
        }
    };

    let moveSnake = () => {
        let posX = snake[0].x;
        let posY = snake[0].y;
        switch (direction) {
            case "top":
                posY -= defs.sizes.box;
                break;
            case "right":
                posX += defs.sizes.box;
                break;
            case "down":
                posY += defs.sizes.box;
                break;
            case "left":
                posX -= defs.sizes.box;
                break;
        }
        snake.pop();
        snake.unshift({x: posX, y: posY});
    }

    /**
     * As rodadas de renderizacao do jogo
     */
    let updateGame = () => {
        createBackground();
        createSnake();
        moveSnake();
    }

    setInterval(updateGame, 250);

})();