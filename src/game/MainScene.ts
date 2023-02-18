export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  init() {}

  preload() {}

  create() {
    this.add.text(30, 50, 'TEST');
  }

  update() {}
}
