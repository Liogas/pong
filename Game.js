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
    #state; // 0 : Pause | 1 : En cours | 2 : Engagement | 3 : termine
    #control;
    #countDown; // Utile pour le compteur de l'engagement
    #rules;
    #winner;
    constructor(rules)
    {
        this.#rules = rules;
        this.#canvas = document.getElementById("bkgdPong");
        if (this.#canvas.getContext)
            this.#ctx = this.#canvas.getContext("2d");
        else
            throw new Error("canvas not compatible");
        this.#player1 = new Player(1, "rgb(255, 255, 255)", this.#canvas, this.#ctx, this.#rules.playerSpeed);
        this.#player2 = new Player(2, "rgb(255, 255, 255)", this.#canvas, this.#ctx, this.#rules.playerSpeed);
        this.#ball = new Ball("rgb(255, 255, 255)", this.#canvas, this.#ctx, this.#rules.ballSpeed);
        this.#state = 0;
        this.#control = {pause: "p"};
        this.#countDown = {active: false, value: this.#rules.countDownTime, id: 0};
        this.#winner = null;
    };

    // Methode de rendu pour le compteur lors de l'engagement
    renderCountDown()
    {
        this.#ctx.font = "50px Arial";
        this.#ctx.fillStyle = "rgb(75, 75, 75)";
        if (this.#countDown.value !== 0)
            this.#ctx.fillText(this.#countDown.value, this.#canvas.width / 2, this.#canvas.height / 2);
        else
            this.#ctx.fillText("GO !", this.#canvas.width / 2, this.#canvas.height / 2);
    }

    // Methode de rendu graphique pour le canvas
    render()
    {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        this.#ctx.fillStyle = "rgb(0, 0, 0)";
        this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height);

        if (this.#countDown.active === true)
            this.renderCountDown();

        if (this.#state === 0)
        {
            this.#ctx.fillStyle = "rgb(255, 255, 255)";
            this.#ctx.font = "30px Arial";
            let text = "Jeu en pause !"
            this.#ctx.fillText("Jeu en pause !", this.#canvas.width / 2 - this.#ctx.measureText(text).width / 2, 50);
        }

        if (this.#state != 3)
            this.#ball.render(this.#ctx);
        else
        {
            this.#ctx.fillStyle = "rgb(255, 255, 255)";
            this.#ctx.font = "30px Arial";
            let text = `Player ${this.#winner.id} wins!`;
            this.#ctx.fillText(text, this.#canvas.width / 2 - this.#ctx.measureText(text).width / 2, this.#canvas.height / 2);
        }
        
        this.#player1.render();
        this.#player2.render();
        
        this.#ctx.font = "30px Arial";
        this.#ctx.fillText(this.#player1.score, this.#canvas.width / 2 - this.#canvas.width / 4, this.#canvas.height / 2);
        this.#ctx.fillText(this.#player2.score, this.#canvas.width / 2 + this.#canvas.width / 4, this.#canvas.height / 2);
    };

    startCountDown()
    {
        this.#state = 2;
        this.#countDown.id = setInterval(() => {
            this.#countDown.value--;
            if (this.#countDown.value === 0)
            {
                this.#state = 1;
                this.#countDown.active = false;
                clearInterval(this.#countDown.id);
            }
        }, 1000);
    }

    // Methode appele lorsqu'un player marque un point
    goal(player)
    {
        player.addScore();
    }

    hasWinner()
    {
        if (this.#player1.score >= this.#rules.scoreMax)
            this.#winner = this.#player1;
        else if (this.#player2.score >= this.#rules.scoreMax)
            this.#winner = this.#player2;
    };

    // Methode qui met a jour l'etat de la partie a chaque appel de window.requestAnimationFrame
    update()
    {
        if (this.#state != 3)
        {
            this.handleKeys();
            if (this.#state === 1)
            {
                this.#ball.move();
                let tmp = this.#ball.goal;
                if ((tmp = this.#ball.goal) != 0)
                {
                    if (tmp === 1)
                        this.goal(this.#player1);
                    else if (tmp === 2)
                        this.goal(this.#player2);
                    this.hasWinner();
                    if (this.#winner !== null)
                        this.#state = 3;
                    else
                    {
                        this.#ball.reset();
                        this.#countDown.value = this.#rules.countDownTime;
                        this.#countDown.active = true;
                        this.startCountDown();
                    }
                }
                this.#ball.bounce();
                this.#ball.hit(this.#player1);
                this.#ball.hit(this.#player2);
            }
        }
        this.render();
        window.requestAnimationFrame(() => this.update());
    };

    // Methode qui gere les actions selon les touches appuyees
    handleKeys()
    {
        if (this.#state >= 1 && this.#state <= 2)
        {
            if (keys.has(this.#player2.down))
                this.#player2.update(1);
            else if (keys.has(this.#player2.up))
                this.#player2.update(-1);
    
            if (keys.has(this.#player1.down))
                this.#player1.update(1);
            else if (keys.has(this.#player1.up))
                this.#player1.update(-1);

            if (keys.has(this.#control.pause) && this.#rules.allowPause === true)
            {
                keys.delete(this.#control.pause);
                if (this.#countDown.active === true)
                    clearInterval(this.#countDown.id);
                this.#state = 0;
            }
        } else
        {
            if (keys.has(this.#control.pause) && this.#rules.allowPause === true)
            {
                keys.delete(this.#control.pause);
                if (this.#countDown.active === true)
                    this.startCountDown();
                else
                    this.#state = 1;
            }
        }
    };


    // Methode qui lance la partie
    start()
    {
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
    let rules = {
            scoreMax: 1,
            timeLimit: 5,
            ballSpeed: 8,
            playerSpeed: 10,
            allowPause: true,
            countDownTime: 3
        };
    let game = new Game(rules);
    document.addEventListener("keydown", keyDownHandler, false); // Detecte quand une touche est appuyee
    document.addEventListener("keyup", keyUpHandler, false); // Detecte quand une touche est relachee
    game.start(); // Lance la partie
} catch (err)
{
    console.error("Error : ", err.message);
}




