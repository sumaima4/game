import { Player } from "./player.js";
import { InputHandler } from "./handler.js";
import { Background } from "./background.js";
import { GroundEnemy } from "./enemies.js";

let game;

window.addEventListener("load", function () {
  class Game {
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
      this.enemyInterval = 5000;
      this.enemyImage = enemyImage;
      this.gameOver = false;
      this.paused = false;
      this.timer = 0;
      this.speedIncreaseRate = 0.2;

      this.addEnemy();
    }

    update(deltaTime) {
      if (this.paused || this.gameOver) return;

      this.timer += deltaTime;

      this.speed += this.speedIncreaseRate * (deltaTime / 1000);

      this.enemyInterval = Math.max(1000, 5000 - this.speed * 300);
      this.background.update();
      this.player.update(this.input.keys);
      // enemy logic
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      this.enemies.forEach((enemy) => enemy.update(deltaTime));

      for (let enemy of this.enemies) {
        if (this.checkCollision(this.player, enemy)) {
          this.gameOver = true;
          break;
        }
      }

      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
    }

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

      if (this.paused) {
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = "white";
        context.font = "bold 50px Arial";
        context.textAlign = "center";
        context.fillText("PAUSED", this.width / 2, this.height / 2);
        return;
      }

      if (this.gameOver) {
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = "white";
        context.font = "bold 50px Arial";
        context.textAlign = "center";
        context.fillText("GAME OVER!", this.width / 2, this.height / 2);
      }
    }
    addEnemy() {
      const numberOfEnemies = Math.floor(this.speed);
      for (let i = 0; i < numberOfEnemies; i++) {
        this.enemies.push(new GroundEnemy(this, this.enemyImage));
      }
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

  const restartButton = document.createElement("button");
  restartButton.textContent = "RESTART";
  restartButton.id = "restartButton";
  Object.assign(restartButton.style, {
    position: "absolute",
    top: "90px",
    right: "12%",
    fontSize: "20px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "transparent",
    border: "none",
    padding: "8px 16px",
    zIndex: "10",
    cursor: "pointer",
    display: "block",
  });
  document.body.appendChild(restartButton);

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
    canvas.width = 1200
    canvas.height = 600;

    game = new Game(canvas.width, canvas.height);

    restartButton.addEventListener("click", () => {
      game = new Game(canvas.width, canvas.height);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        restartButton.click();
      }
      if (event.code === "Space") {
        game.paused = !game.paused;
      }
    });

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
