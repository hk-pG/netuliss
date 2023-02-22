export class Tutorial extends Phaser.Scene {
  private platform?: Phaser.Physics.Arcade.StaticGroup
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private xVec = 160
  private yVec = 330
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
  private stars!: Phaser.Physics.Arcade.Group
  private score: number = 0
  private scoreText!: Phaser.GameObjects.Text
  private gameOver: boolean = false
  private bombs!: Phaser.Physics.Arcade.Group

  constructor() {
    super({ key: 'Tutorial' })
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  preload() {
    const assetDir = '/public/assets/tutorial'
    this.load.image('sky', `${assetDir}/sky.png`)
    this.load.image('ground', `${assetDir}/platform.png`)
    this.load.image('star', `${assetDir}/star.png`)
    this.load.image('bomb', `${assetDir}/bomb.png`)
    this.load.spritesheet('dude', `${assetDir}/dude.png`, {
      frameWidth: 32,
      frameHeight: 48,
    })
  }

  create() {
    // sky background
    this.add.image(400, 300, 'sky')

    // platform(ground)
    this.platform = this.physics.add.staticGroup()
    const ground = this.platform.create(400, 568, 'ground')

    if (ground instanceof Phaser.Physics.Arcade.Sprite) {
      ground.setScale(2)
      ground.refreshBody()
    }

    this.platform.create(600, 400, 'ground')
    this.platform.create(50, 250, 'ground')
    this.platform.create(750, 220, 'ground')

    // player
    this.player = this.physics.add.sprite(100, 450, 'dude')
    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20,
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    })

    this.physics.add.collider(this.player, this.platform)

    // stars
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: {
        x: 12,
        y: 0,
        stepX: 70,
      },
    })

    this.stars.children.iterate((child) => {
      if (child instanceof Phaser.Physics.Arcade.Sprite) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
      }
    })

    this.physics.add.collider(this.stars, this.platform)

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      undefined,
      this,
    )

    // bombs
    this.bombs = this.physics.add.group()
    // collider: bombs - platform
    this.physics.add.collider(this.bombs, this.platform)
    this.physics.add.collider(
      this.player,
      this.bombs,
      this.hitBomb,
      undefined,
      this,
    )

    // score
    const xy = 32
    this.scoreText = this.add.text(xy, xy, `score: ${this.score}`, {
      fontSize: '32px',
      backgroundColor: '#000',
      color: '#FFF',
    })

    this.createBomb()
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.xVec)
      this.player.anims.play('left', true)
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.xVec)
      this.player.anims.play('right', true)
    } else {
      this.player.setVelocityX(0)
      this.player.anims.play('turn', true)
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocity(-this.yVec)
    }
  }

  /**
   *
   * @param player collector collect stars
   * @param star be collected and delete soon
   */
  private collectStar(
    player: Phaser.GameObjects.GameObject,
    star: Phaser.GameObjects.GameObject,
  ) {
    if (star instanceof Phaser.Physics.Arcade.Sprite) {
      // 画面上から消滅させる
      star.disableBody(true, true)
    }

    // スコアに10点追加
    this.addScore(10)

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        if (child instanceof Phaser.Physics.Arcade.Sprite) {
          /* 
          星が全部無くなったら、
          画面上から消滅させた星を、Y座標を0にして復活させる
          */
          child.enableBody(true, child.x, 0, true, true)
        }
      })

      this.createBomb()
    }
  }

  createBomb() {
    // create bomb
    const { width: screenWidth, height: screenHeight } = this.sys.canvas
    const bombX =
      this.player.x < screenWidth / 2
        ? Phaser.Math.Between(screenWidth / 2, screenWidth)
        : Phaser.Math.Between(0, screenWidth / 2)

    const bomb = this.bombs.create(bombX, 16, 'bomb')

    if (bomb instanceof Phaser.Physics.Arcade.Sprite) {
      bomb.setBounce(1)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    }
  }

  private addScore(add: number) {
    this.score += add
    this.scoreText.setText(`score: ${this.score}`)
  }

  private hitBomb(
    player: Phaser.GameObjects.GameObject,
    bomb: Phaser.GameObjects.GameObject,
  ) {
    this.physics.pause()

    if (player instanceof Phaser.Physics.Arcade.Sprite) {
      // プレイヤーを赤色に上塗りする
      player.setTint(0xff0000)
      player.anims.play('turn')
    }

    this.gameOver = true
  }
}
