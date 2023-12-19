import { InputHandler } from "./input.js";
import { Player } from "./player.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener("load", function () {
  const canvas = this.document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.speed = 0;
      this.maxSpeed = 3;
      this.background = new Background(this);
      this.groundMargin = 50;
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.enemies = [];
      this.particles = [];
      this.maxParticles = 50;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = true;
      this.score = 0;
      this.fontColor = "black";
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime) {
      this.background.update();
      this.player.update(this.input.keys, deltaTime);
      //handle Enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.map((enemy) => {
        enemy.update(deltaTime);
        if (enemy.markedForDeletion)
          this.enemies.splice(this.enemies.indexOf(enemy), 1);
      });

      //handle particles
      this.particles.map((particle, i) => {
        particle.update();
        if (particle.markedForDeletion) this.particles.splice(i, 1);
      });
      if (this.particles > this.maxParticles) {
        this.particles = this.particles.slice(0, 50);
      }
    }

    draw(context) {
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.map((enemy) => {
        enemy.draw(context);
      });

      //handle particles
      this.particles.map((particle) => {
        particle.draw(context);
      });

      this.UI.draw(context);
    }
    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5)
        this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));

      this.enemies.push(new FlyingEnemy(this));
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(animate);
  }

  animate(0);
});
