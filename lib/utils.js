class Utils {}

Utils.save = (key, value) => {
    localStorage.setItem(key, value)
}
Utils.load = (key) => {
    return localStorage.setItem(key)
}

Utils.getTitleTextFormat = (fontSize, color)=> {
    return {
        fontFamily: "avenir-bold",
        align: "center",
        fontSize: fontSize || 40,
        color: color || "#000"
    }
}
Utils.generateTitleText = (scene,x,y,text, size, color1, color2) => {
    let siz = size || 30
    let titleTextFormat = {
        fontFamily: "avenir-bold",
        align: "center",
        fontSize: siz,
        color: color2 || "#432918",
        stroke: color2 || "#432918",
        strokeThickness: siz*0.8/3
    }

    let texts = {}

    texts.shadowOffset = scene.add.text(x + siz/10, y + siz/10, text, titleTextFormat)
        .setOrigin(0.5)
    texts.shadowCenter = scene.add.text(x, y, text, titleTextFormat)
        .setOrigin(0.5)

    titleTextFormat.color = color1 || "#fff"
    titleTextFormat.stroke = color1 || "#fff"
    titleTextFormat.strokeThickness = siz*0.2/3

    texts.titleText = scene.add.text(x, y, text, titleTextFormat).setOrigin(0.5)
    
    return texts
}

Utils.removeFromArray = (anArray, obj)=> {
    let i = anArray.indexOf(obj)
    if (i == -1) return anArray
    let a = anArray
    var l=anArray.length;
    if (l)
    {
        while (i<l){
            a[i++] = a[i];
        }--a.length;
    }
    return a
}

// AUDIO
Utils.initializeBackgroundMusic = (scene, backMusicKey) => {
    scene.events.on("shutdown", ()=>{
        DATA.music[backMusicKey].stop()
    })
    scene.events.on("pause", ()=>{
        DATA.music[backMusicKey].pause()
    })
    scene.events.on("resume", ()=> {
        DATA.music[backMusicKey].resume()
    })
}
Utils.stopMusic = ()=> {
    Object.values(DATA.music).forEach(m => m.stop())
}

// Design
Utils.drawDesignLines = (scene)=> {
    let graphics = scene.add.graphics()
    let lineVertical
    let lineHorizontal
    let lineSubHorizontal
    for (var i = 1; i<=9; i++) {
        lineVertical = new Phaser.Geom.Line(gWidth*i/10, 0, gWidth*i/10, gHeight)
        lineHorizontal = new Phaser.Geom.Line(0, gHeight*i/10, gWidth, gHeight*i/10)
        //lineSubHorizontal = new Phaser.Geom.Line(0, gHeight*(i+0.5)/10, gWidth, gHeight*(i+0.5)/10)
        graphics.lineStyle(1, 0x00aa00)
        graphics.strokeLineShape(lineVertical)
        graphics.strokeLineShape(lineHorizontal)
        //graphics.lineStyle(1, 0x005500)
        //graphics.strokeLineShape(lineSubHorizontal)

        scene.add.text(5, gHeight*i/10 - 2, "0."+i, {fontSize: 8})
        scene.add.text(gWidth*i/10 - 5, 2, "0."+i, {fontSize: 8})
    }
}

/* TEMPLATE
button1 = 
new ButtonImage({
    scene: this,
    x:100,
    y:100,
    image: "button-left",
    clickFunction: ()=> { console.log("clicked!")}
})
*/
class ButtonImage extends Phaser.GameObjects.Image {    
    constructor({scene, x=0, y=0, image, 
        text="", 
        textConfig={},
         scale=1, 
         clickFunction = ()=>{},
         levelButtons = false,
         sound = "soundButton"
        }) 
    {
        super(scene, x, y, image)
        scene.add.existing(this)
        
        this.startScale = scale
        this.setScale(this.startScale)

        this.text
        if (text) {
            let off = {x:0, y:0}
            if (levelButtons) {
                off = {x: 5, y: 5}
            }
            this.text = scene.add.text(x + off.x, y + off.y, text, textConfig)
            this.text.setOrigin(0.5)
            this.text.setScale(this.startScale)
        }

        this.setInteractive()
        this.setScrollFactor(0)

        this.isDown = false
        this.on("pointerover", ()=>{
            scene.tweens.add({
                targets: this.text? [this, this.text] : this,
                duration: DATA.animationTime,
                scale: this.startScale*1.1,
                ease: 'Back'
            })
        })
        this.on("pointerout", ()=>{
            scene.tweens.add({
                targets: this.text? [this, this.text] : this,
                duration: DATA.animationTime,
                scale: this.startScale,
                ease: 'Back'
            })
        })
        this.on("pointerdown", ()=>{
            this.isDown = true
            scene.tweens.add({
                targets: this.text? [this, this.text] : this,
                duration: DATA.animationTime,
                scale: this.startScale*0.8,
                ease: 'Back'
            })
        })
        this.on("pointerup", ()=>{
            this.isDown = false
            scene.tweens.add({
                targets: this.text? [this, this.text] : this,
                duration: DATA.animationTime,animationTimecale: this.startScale,
                ease: 'Back',
                onComplete: ()=> {
                    DATA.sound[sound].play()
                    clickFunction.call()
                }
            })
        })
    }
}

class Notification extends Phaser.GameObjects.Image {
    constructor({scene, x, y, image, 
        elements, newY = y, movY = 0, time=1200}) {
        super(scene, x, y, image)
        scene.add.existing(this)

        this.depth = 19
        this.elements = elements
        this.elements.forEach(e => e.depth = 20)
        this.behavior = "stand"
        this.startY = y
        this.newY = newY
        this.movY = movY
        this.timeUp = 0
        this.time = time
    }

    notifyFruit(element) {
        this.behavior = "up"
        let index = this.scene.fruitNames.indexOf(element)
        this.elements[3+index].setText(
            this.scene.collected[element] + 
            "/" + this.scene.levelData.fruits[index].need
        )
        if (this.scene.collected[element] == this.scene.levelData.fruits[index].need) {
            this.elements[3+index].alpha = 0
            this.elements[6+index].alpha = 1
        }
    }
    notifyCharacter(element) {
        this.behavior = "up"
        let index = this.scene.fruitNames.indexOf(element)
        this.elements[3].setText(
            this.scene.collected["character"] + "/"
            + this.scene.levelData.character.need
        )
        if (this.scene.collected["character"] == this.scene.levelData.character.need) {
            this.elements[3].alpha = 0
            this.elements[6].alpha = 1
        }
    }
    notifyBonus(element) {
        this.behavior = "up"
        let index = this.scene.bonusNames.indexOf(element)
        this.elements[4+index].setText(
            this.scene.collected[element] + "/" + this.scene.levelData.bonuses[index].amount
        )
        if (this.scene.collected[element] == this.scene.levelData.bonuses[index].amount) {
            this.elements[4+index].alpha = 0
            this.elements[7+index].alpha = 1
        }
    }
    update(delta) {
        if (this.behavior == "up") {
            
            this.y += this.movY*2.5

            this.elements.forEach(e => {
                e.y += this.movY*2.5
            })
            if (this.y < this.newY) {
                this.y = this.newY
                this.elements.forEach(e => {
                    e.y = this.newY
                })
                this.behavior = "stand"
                this.timeUp = this.time
            }
        }
        if (this.y == this.newY && this.behavior == "stand") {

            this.timeUp -= delta

            if (this.timeUp <= 0) {
                this.behavior = "down"
            }
        }
        if (this.behavior == "down") {
            this.y -= this.movY

            this.elements.forEach(e => {
                e.y -= this.movY
            })
            if (this.y > this.startY) {
                this.behavior = "stand"
            }
        }
    }
}

class Carousel {
    constructor({elements = [], 
        nameList = [], 
        updateFunction = ()=>{}, 
        prevFunction = ()=>{},
        nextFunction = ()=>{},
        autoInitialize = true
    }) {
        this.list = elements
        this.nameList = nameList
        this.active = 0
        this.before = 0
        this.max = this.list.length-1
        this.prevFunction = prevFunction
        this.nextFunction = nextFunction
        this.updateFunction = updateFunction

        //this.

        if (autoInitialize) this.initialize()
    }
    initialize() {
        for(var i=1; i<this.list.length; i++) {
            this.list[i].forEach(e => {
                e.active = false
                e.alpha = 0
            })
        }
        this.setActive(0)
    }

    add(element, name = null, prevFunction=undefined, nextFunction=undefined) {
        this.list.push(element)
        this.max++
        if (name) {
            this.nameList.push(name)
        }
        this.prevFunction = prevFunction? prevFunction : () => {}
        this.nextFunction = nextFunction? nextFunction : () => {}
    }

    prev() {
        if (this.active == 0) {
            this.setActive(this.max)
        }
        else {
            this.setActive(this.active-1)
        }
        this.prevFunction.call()
    }

    next() {
        if (this.active == this.max) {
            this.setActive(0)
        }
        else {
            this.setActive(this.active+1)
        }
        this.nextFunction.call()
    }

    setActive(index) {
        this.list[this.active].forEach(e => {
            e.active = false
            e.alpha = 0
        })
        this.list[index].forEach(e => {
            e.active = true
            e.alpha = 1
        })
        this.before = this.active
        this.active = index
        this.updateFunction.call()
    }

    setActiveByName(name) {
        this.setActive(this.nameList.indexOf(name))
    }
}

class Box {
    constructor(scene, width, height, config) {
        this.width = width
        this.height = height
        let pos = {
            centerX: gWidth/2,
            centerY: gHeight/2,
            left: gWidth/2 - width/2,
            right: gWidth/2 + width/2,
            up: gHeight/2 - height/2,
            down: gHeight/2 + height/2,
            bl: 61,
            br: 50,
            bu: 50,
            bd: 57
        }
        this.pos = pos
        this.components = {
            ul: scene.add.tileSprite(pos.left, pos.up, pos.bl, pos.bu, "box", "up-left"),
            ur: scene.add.tileSprite(pos.right, pos.up, pos.br, pos.bu, "box", "up-right"),
            dl: scene.add.tileSprite(pos.left, pos.down, pos.bl, pos.bd, "box", "down-left"),
            dr: scene.add.tileSprite(pos.right, pos.down, pos.br, pos.bd, "box", "down-right"),
            su: scene.add.tileSprite(pos.centerX, pos.up, width, pos.bu, "box", "up-side"),
            sd: scene.add.tileSprite(pos.centerX, pos.down, width, pos.bd, "box", "down-side"),
            sl: scene.add.tileSprite(pos.left, pos.centerY, pos.bl, height, "box", "left-side"),
            sr: scene.add.tileSprite(pos.right, pos.centerY, pos.br, height, "box", "right-side"),
            c: scene.add.tileSprite(pos.centerX, pos.centerY, width, height, "box", "center")
        }

        if (config.title) {
            let t = scene.add.text(pos.centerX, 
                pos.up - 15, 
                config.title, 
                Utils.getTitleTextFormat(config.titleSize))
            
            t.setOrigin(0.5)
            t.y += t.height/2 
            scene.add.image(t.x - t.width/2 - 30, t.y, "title-decoration-left")
            scene.add.image(t.x + t.width/2 + 30, t.y, "title-decoration-right")
        }

        if (config.close) {
            new ButtonImage({
                scene: scene,
                x: pos.right + 20,
                y: pos.up - 20,
                image: "button-close",
                scale: 1.3,
                clickFunction: ()=> {
                    scene.scene.stop()
                    scene.scene.resume(scene.parentScene)
                }
            })
        }
        /*this.components.su.setScale(width/100, 1)
        this.components.sd.setScale(width/100, 1)
        this.components.sl.setScale(1, height/100)
        this.components.sr.setScale(1, height/100)
        this.components.c.setScale(width/100, height/100)*/
    }
}