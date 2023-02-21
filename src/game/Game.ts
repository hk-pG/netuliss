import Phaser from 'phaser'
import { Tutorial } from './Tutorial'

class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config)
  }
}

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300,
      },
      debug: false,
    },
  },
  scene: [Tutorial],
  backgroundColor: '#cdcdcd',
}

export const game = new Game(config)
