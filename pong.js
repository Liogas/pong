"use strict";


let keys = {
    "ArrowUp": false,
    "ArrowDown": false,
    "a": false,
    "q": false
};



class Player 
{
    #width;
    #height;
    #posX;
    #posY;
    #id;
    #color;
    #speed;
    #score;
    #canvas;
    constructor(id, color, canvas)
    {
        if (id < 1 || id > 2)
            throw new Error("id incorrect : " + id);
        this.#id = id;
        this.#height = 100;
        this.#width = 10;
        this.#color = color;
        this.#canvas = canvas;
        if (id === 1)
            this.#posX = 20;
        else
            this.#posX = 1280 - 20 - this.#width;
        this.#posY = (720 / 2) - (this.#height / 2);
        this.#speed = 10;
        this.#score = 0;
    };

    render(ctx)
    {
        ctx.fillStyle = this.#color;
        ctx.fillRect(this.#posX, this.#posY, this.#width, this.#height);
    };

    update(dep)
    {
        if (dep === -1 && this.#posY + dep * this.#speed >= 0)
            this.#posY += dep * this.#speed;
        else if (dep === 1 && (this.#posY + dep * this.#speed) + this.#height <= this.#canvas.height)
            this.#posY += dep * this.#speed;
    };

    addScore()
    {
        this.#score += 1;
    }

    get posX()
    {
        return this.#posX;
    }

    get posY()
    {
        return this.#posY;
    }

    get width()
    {
        return this.#width;
    }

    get height()
    {
        return this.#height;
    }

    get score()
    {
        return this.#score;
    }
};

class Ball
{
    #width;
    #posY;
    #posX;
    #speed;
    #color;
    #directionX;
    #directionY;
    #canvas;
    constructor(color, canvas)
    {
        this.#width = 20;
        this.#canvas = canvas;
        this.#posX = this.#canvas.width / 2;
        this.#posY = this.#canvas.height / 2;
        this.#speed = 5;
        this.#color = color;
        this.#directionX = 1;
        this.#directionY = 1;
    };

    move()
    {
        this.#posX += this.#directionX * this.#speed;
        this.#posY += this.#directionY * this.#speed;
    };

    bounce()
    {
        if (this.#posY >= this.#canvas.height || this.#posY <= 0)
            this.#directionY = -this.#directionY;
    };

    hit(player)
    {
        if (this.#posX + this.#width / 2 >= player.posX &&
            this.#posX - this.#width / 2 <= player.posX + player.width &&
            this.#posY + this.#width / 2 >= player.posY &&
            this.#posY - this.#width / 2 <= player.posY + player.height)
        {
            this.#directionX = -this.#directionX;
        }
    };

    get goal()
    {
        if (this.#posX >= this.#canvas.width)
        {
            this.#posX = this.#canvas.width / 2;
            return (1);
        }
        else if (this.#posX <= 0)
        {
            this.#posX = this.#canvas.width / 2;
            return (2);
        }
        else
            return (0);
    }

    render(ctx)
    {
        this.move();
        this.bounce();
        ctx.beginPath();
        ctx.fillStyle = this.#color;
        ctx.arc(this.#posX, this.#posY, this.#width / 2, 0, 2 * Math.PI);
        ctx.fill();
    };
};

class Game
{
    #player1;
    #player2;
    #ball;
    #ctx;
    #canvas;

    constructor()
    {
        this.#canvas = document.getElementById("bkgdPong");
        if (this.#canvas.getContext)
            this.#ctx = this.#canvas.getContext("2d");
        else
            throw new Error("canvas not compatible");
        this.#player1 = new Player(1, "rgb(255, 255, 255)", this.#canvas);
        this.#player2 = new Player(2, "rgb(255, 255, 255)", this.#canvas);
        this.#ball = new Ball("rgb(255, 255, 255)", this.#canvas);
    };

    render()
    {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#ctx.fillStyle = "rgb(0, 0, 0)";
        this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#ball.render(this.#ctx);
        this.#player1.render(this.#ctx);
        this.#player2.render(this.#ctx);
        this.#ctx.font = "30px Arial";
        this.#ctx.fillText(this.#player1.score, this.#canvas.width / 2 - this.#canvas.width / 4, this.#canvas.height / 2);
        this.#ctx.fillText(this.#player2.score, this.#canvas.width / 2 + this.#canvas.width / 4, this.#canvas.height / 2);
    };

    update()
    {
        this.handleKeys();
        this.#ball.move();
        let tmp = this.#ball.goal;
        console.log(tmp);
        if (tmp === 1)
            this.#player1.addScore();
        else if (tmp === 2)
            this.#player2.addScore();
        this.#ball.bounce();
        this.#ball.hit(this.#player1);
        this.#ball.hit(this.#player2);
        this.render();
        window.requestAnimationFrame(() => this.update());
    };

    handleKeys()
    {
        if (keys["ArrowDown"] === true && keys["ArrowUp"] === false)
            this.#player2.update(1);
        else if (keys["ArrowDown"] === false && keys["ArrowUp"] === true)
            this.#player2.update(-1);

        if (keys["a"] === true && keys["q"] === false)
            this.#player1.update(1);
        else if (keys["a"] === false && keys["q"] === true)
            this.#player1.update(-1);
    };

    start()
    {
       window.requestAnimationFrame(() => this.update());
    };
};

function keyDownHandler(e)
{
    if (e.key === "ArrowUp")
        keys["ArrowUp"] = true;
    else if (e.key === "ArrowDown")
        keys["ArrowDown"] = true;
    else if (e.key === "q" || e.key === "Q")
        keys["q"] = true;
    else if (e.key === "a" || e.key === "A")
        keys["a"] = true;
}

function keyUpHandler(e)
{
    if (e.key === "ArrowUp")
        keys["ArrowUp"] = false;
    else if (e.key === "ArrowDown")
        keys["ArrowDown"] = false;
    else if (e.key === "q" || e.key === "Q")
        keys["q"] = false;
    else if (e.key === "a" || e.key === "A")
        keys["a"] = false;
}

try {
    let game = new Game();
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    game.start();
} catch (err)
{
    console.error("Error : ", err.message);
}




