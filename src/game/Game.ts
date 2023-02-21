import Phaser from 'phaser'
import { Tutorial } from './Tutorial'

class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config)
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  width: 800,
  height: 600,
  parent: 'game',
  scene: [Tutorial],
  backgroundColor: '#cdcdcd',
}

new Game(config)
