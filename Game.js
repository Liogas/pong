"use strict";

let keys = new Set();

import { Player } from './Player.js';
import { Ball } from './Ball.js';

class Game
{
    #player1;
    #player2;
    #ball;
    #ctx;
    #canvas;
    #state; // 0 : Construction | 1 : En cours | 2 : En pause
    #control;
    constructor()
    {
        this.#canvas = document.getElementById("bkgdPong");
        if (this.#canvas.getContext)
            this.#ctx = this.#canvas.getContext("2d");
        else
            throw new Error("canvas not compatible");
        this.#player1 = new Player(1, "rgb(255, 255, 255)", this.#canvas);
        this.#player2 = new Player(2, "rgb(255, 255, 255)", this.#canvas);
        this.#ball = new Ball("rgb(255, 255, 255)", this.#canvas, this.#ctx);
        this.#state = 0;
        this.#control = {pause: "p"};
    };

    // Methode de rendu graphique pour le canvas
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

    // Methode qui met a jour l'etat de la partie a chaque appel de window.requestAnimationFrame
    update()
    {
        this.handleKeys();
        if (this.#state === 1)
        {
            if (this.#ball.state === 1)
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
        }
        this.render();
        window.requestAnimationFrame(() => this.update());
    };

    // Methode qui gere les actions selon les touches appuyees
    handleKeys()
    {
        if (this.#state === 1)
        {
            if (keys.has(this.#player2.down))
                this.#player2.update(1);
            else if (keys.has(this.#player2.up))
                this.#player2.update(-1);
    
            if (keys.has(this.#player1.down))
                this.#player1.update(1);
            else if (keys.has(this.#player1.up))
                this.#player1.update(-1);

            if (keys.has(this.#control.pause))
            {
                keys.delete(this.#control.pause);
                this.#state = 0;
            }
        } else
        {
            if (keys.has(this.#control.pause))
            {
                keys.delete(this.#control.pause);
                this.#state = 1;
            }
        }
    };

    // Methode qui lance la partie
    start()
    {
        this.#ball.state = 1;
        this.#state = 1;
        window.requestAnimationFrame(() => this.update());
    };
};


// Fonction de gestion pour une touche appuyee
function keyDownHandler(e)
{
    keys.add(e.key);
}

// Fonction de gestion pour une touche relachee
function keyUpHandler(e)
{
    keys.delete(e.key);   
}

try {
    let game = new Game();
    document.addEventListener("keydown", keyDownHandler, false); // Detecte quand une touche est appuyee
    document.addEventListener("keyup", keyUpHandler, false); // Detecte quand une touche est relachee
    game.start(); // Lance la partie
} catch (err)
{
    console.error("Error : ", err.message);
}




