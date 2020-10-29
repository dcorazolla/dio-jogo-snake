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

    createBackground();
    createSnake();

})();