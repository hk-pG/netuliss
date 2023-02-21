export class Tutorial extends Phaser.Scene {
  constructor() {
    super({ key: 'Tutorial' })
  }

  init() {}

  preload() {
    this.load.image('react', '../assets/react.svg')
  }

  create() {
    this.add.image(50, 20, 'react')
  }

  update() {}
}
