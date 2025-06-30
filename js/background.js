class Layer {
  constructor(game, width, height, image, speedModifier) {
    this.game = game;
    this.image = image;
    this.speedModifier = speedModifier;
    this.width = width; // Width of the background image
    this.height = height; // Height of the background image
    this.x = 0;
    this.y = 0;
  }
  update() {
    if (this.x <= -this.width) {
      this.x = 0; // Reset x position when it goes off screen
    } else {
      this.x -= this.game.speed * this.speedModifier; // Move the background based on game speed and speed modifier
    }
  }
  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

export class Background {
  constructor(
    game,
    { layer1Image, layer2Image, layer3Image, layer4Image, layer5Image }
  ) {
    this.game = game;
    this.width = 1500;
    this.height = 600;
    this.layer1 = new Layer(game, this.width, this.height, layer1Image, 0.2);
    this.layer2 = new Layer(game, this.width, this.height, layer2Image, 0.4);
    this.layer3 = new Layer(game, this.width, this.height, layer3Image, 0.6);
    this.layer4 = new Layer(game, this.width, this.height, layer4Image, 0.8);
    this.layer5 = new Layer(game, this.width, this.height, layer5Image, 1.0);
    this.backgroundLayers = [
      this.layer1,
      this.layer2,
      this.layer3,
      this.layer4,
      this.layer5,
    ];
  }
  update() {
    this.backgroundLayers.forEach((layer) => layer.update());
  }
  draw(context) {
    this.backgroundLayers.forEach((layer) => layer.draw(context));
  }
}
