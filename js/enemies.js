export class Enemy {
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 10;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.markedForDeletion = false;
  }

  update(deltaTime) {
    this.x += this.speedX;
    this.y += this.speedY;

    this.frameTimer += deltaTime;
    if (this.frameTimer >= this.frameInterval) {
      this.frameTimer = 0;
      this.frameX = (this.frameX + 1) % (this.maxFrame + 1);
    }

    if (this.x + this.width < 0) this.markedForDeletion = true;
  }

  draw(context) {
    context.drawImage(
      this.image,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

export class GroundEnemy extends Enemy {
  constructor(game, image) {
    super();
    this.game = game;
    this.width = 60;
    this.height = 87;
    this.x = this.game.width;
    this.y = this.game.height - this.height - this.game.groundMargin; // Position above the ground
    this.image = image;
    this.speedX = -this.game.speed;
    this.speedY = 0;
    this.maxFrame = 5;
  }
}
