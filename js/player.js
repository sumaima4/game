export class Player {
  constructor(game, image) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin; // Start at the bottom of the canvas
    this.vy = 0;
    this.gravity = 0.5;
    this.image = image;
    this.speed = 0;
    this.maxSpeed = 10; // Maximum horizontal speed
  }

  update(input) {
    // Jumping
    if (input.includes("ArrowUp") && this.onGround()) {
      this.vy -= 20; // Jump
    }

    // Vertical movement
    this.y += this.vy;
    if (!this.onGround()) {
      this.vy += this.gravity;
    } else {
      this.vy = 0;
      this.y = this.game.height - this.height - this.game.groundMargin; // Ensure on the ground
    }
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

  onGround() {
    return this.y + this.height >= this.game.height - this.game.groundMargin;
  }
}
