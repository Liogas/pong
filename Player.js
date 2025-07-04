"use strict";

export class Player 
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
        this.#height = 50;
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

    // Methode de rendu graphique pour le canvas
    render(ctx)
    {
        ctx.fillStyle = this.#color;
        ctx.fillRect(this.#posX, this.#posY, this.#width, this.#height);
    };

    // Methode qui met a jour la position de la barre du player
    update(dep)
    {
        if (dep === -1 && this.#posY + dep * this.#speed >= 0)
            this.#posY += dep * this.#speed;
        else if (dep === 1 && (this.#posY + dep * this.#speed) + this.#height <= this.#canvas.height)
            this.#posY += dep * this.#speed;
    };

    // Methode qui ajoute 1 au score du player
    addScore()
    {
        this.#score += 1;
    }

    // GETTERS
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
