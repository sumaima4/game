import { Player } from "./player.js";
import { InputHandler } from "./handler.js";
import { Background } from "./background.js";
import { GroundEnemy } from "./enemies.js";

window.addEventListener("load", function () {
  const playerImage = document.getElementById("player");
  const enemyImage = document.getElementById("enemy");
  const layer1Image = document.getElementById("layer1");
  const layer2Image = document.getElementById("layer2");
  const layer3Image = document.getElementById("layer3");
  const layer4Image = document.getElementById("layer4");
  const layer5Image = document.getElementById("layer5");

  const images = [
    playerImage,
    enemyImage,
    layer1Image,
    layer2Image,
    layer3Image,
    layer4Image,
    layer5Image,
  ];

  let loaded = 0;
  images.forEach((img) => {
    if (img.complete) loaded++;
    else
      img.onload = () => {
        loaded++;
        if (loaded === images.length) startGame();
      };
  });
  if (loaded === images.length) startGame();

  function startGame() {
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 1000;
    canvas.height = 600;

    class Game {
      // The constructor initializes the game with a specified width and height.
      constructor(width, height) {
        this.width = width;
        this.height = height;
        this.groundMargin = 100;
        this.speed = 3;
        this.input = new InputHandler();
        this.background = new Background(this, {
          layer1Image,
          layer2Image,
          layer3Image,
          layer4Image,
          layer5Image,
        });
        this.player = new Player(this, playerImage);
        this.enemies = [];
        this.enemyTimer = 0;
        this.enemyInterval = 5000; // Time in milliseconds between hurdles
        this.enemyImage = enemyImage;
        this.gameOver = false;
        this.timer = 0;
        this.speedIncreaseRate = 0.1;

        this.addEnemy();
      }
      // The update method is intended to handle game logic updates.
      update(deltaTime) {
        if (this.gameOver) return;

        this.timer += deltaTime;

        this.speed += this.speedIncreaseRate * (deltaTime / 1000);
        this.background.update();
        this.player.update(this.input.keys);
        // enemy logic
        if (this.enemyTimer > this.enemyInterval) {
          this.addEnemy();
          this.enemyTimer = 0;
        } else {
          this.enemyTimer += deltaTime;
        }

        this.timeToNextEnemy = Math.max(
          0,
          this.enemyInterval - this.enemyTimer
        );

        this.enemies.forEach((enemy) => enemy.update(deltaTime));

        for (let enemy of this.enemies) {
          if (this.checkCollision(this.player, enemy)) {
            this.gameOver = true;
            break;
          }
        }
        // enemy deletion outside loop
        this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      }
      // The draw method is intended to handle rendering the game state to the canvas.
      draw(context) {
        this.background.draw(context);
        this.player.draw(context);
        this.enemies.forEach((enemy) => {
          enemy.draw(context);
        });

        context.fillStyle = "black";
        context.font = "30px Arial";
        context.textAlign = "left";
        context.fillText(`Timer: ${(this.timer / 1000).toFixed(1)}s`, 20, 50);

        if (this.gameOver) {
          context.fillStyle = "rgba(0, 0, 0, 0.5)";
          context.fillRect(0, 0, this.width, this.height);
          context.fillStyle = "white";
          context.font = "bold 60px Arial";
          context.textAlign = "center";
          context.fillText("GAME OVER!", this.width / 2, this.height / 2);
        }
      }
      addEnemy() {
        this.enemies.push(new GroundEnemy(this, this.enemyImage));
        console.log(this.enemyImage);
      }

      checkCollision(player, enemy) {
        return (
          player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y
        );
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
    requestAnimationFrame(animate);
  }
});
