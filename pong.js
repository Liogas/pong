"use strict";


let keys = new Set();



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
    #control;
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
        {
            this.#posX = 20;
            this.#control = {up: "q", down: "a"};
        }
        else
        {
            this.#posX = this.#canvas.width - 20 - this.#width;
            this.#control = {up: "ArrowUp", down: "ArrowDown"};
        }
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

    get down()
    {
        return this.#control.down;
    }

    get up()
    {
        return this.#control.up;
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
        this.#speed = 3;
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
            return (1);
        else if (this.#posX <= 0)
            return (2);
        else
            return (0);
    };

    reset()
    {
            this.#posX = this.#canvas.width / 2;
    };

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
        if ((tmp = this.#ball.goal) != 0)
        {
            if (tmp === 1)
                this.#player1.addScore();
            else if (tmp === 2)
                this.#player2.addScore();
            this.#ball.reset();
        }
        this.#ball.bounce();
        this.#ball.hit(this.#player1);
        this.#ball.hit(this.#player2);
        this.render();
        window.requestAnimationFrame(() => this.update());
    };

    handleKeys()
    {
       if (keys.has(this.#player2.down))
            this.#player2.update(1);
        else if (keys.has(this.#player2.up))
            this.#player2.update(-1);

        if (keys.has(this.#player1.down))
            this.#player1.update(1);
        else if (keys.has(this.#player1.up))
            this.#player1.update(-1);
    };

    start()
    {
       window.requestAnimationFrame(() => this.update());
    };
};

function keyDownHandler(e)
{
    keys.add(e.key);
}

function keyUpHandler(e)
{
    keys.delete(e.key);   
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




