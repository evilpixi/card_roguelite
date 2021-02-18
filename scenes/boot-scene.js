class BootScene extends Phaser.Scene {
  constructor() {
      super("BootScene")
  }

  preload() {
    console.log("Booty")
    this.load.image("boscha", "assets/images/img1.jpg")
    this.load.image("avatar", "assets/images/img2.png")
  }

  create() {
    Utils.drawDesignLines(this)

    const scaleConst = 5

    this.add.image(5, 5, "boscha").setOrigin(0, 0)
    let rect = this.add.rectangle(0, 0, 63*scaleConst, 88*scaleConst, 0x6666ff);
    let avatar = this.add.image(0, -20, "avatar").setScale(scaleConst*0.38)
    let name = this.add.text(0, -76*scaleConst/2, "Comander Yuriko", { fontSize: 5*scaleConst}).setOrigin(0.5, 0.5)
    //let c1 = new Card(this, 100, 100, "prof")

    let cont = new Card(this, 100, 350, [rect, avatar, name])
    gdv = cont

    
  }


}