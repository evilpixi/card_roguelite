// set values
const aspectRatio = window.innerWidth / window.innerHeight // > 1 is landscape, < 1 is portrait
const isPortrait = aspectRatio < 1
const baseResolution = {x: 1280, y: 720}

var gdv

const gWidth = !isPortrait ? baseResolution.y * aspectRatio : baseResolution.y //landscape 320* x 180
const gHeight = !isPortrait ? baseResolution.y : baseResolution.y * (1 / aspectRatio)

// init game config
let gameConfig = {
  type: Phaser.AUTO,
  scale: {
    parent: "game-container",
    mode: Phaser.Scale.Fit,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: gWidth,
    height: gHeight
  },
  render: {
    antialias: true
  }
}

let game = new Phaser.Game(gameConfig)
game.scene.add("BootScene", BootScene)

game.scene.start("BootScene")