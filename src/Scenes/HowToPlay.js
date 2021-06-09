class HowToPlay extends Phaser.Scene {
    constructor() {
        super({key: 'HowToPlay'});
    }
    
    init() {
        console.log('Se ha iniciado la escena HowToPlay');
        this.scene.bringToTop('HowToPlay');
    }

    create() {
        this.bgTile = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg_tile')
        .setOrigin(0).setScale(3).setDepth(-1);

        var text1 = this.add.bitmapText(0, -250, 'future', "HOW TO PLAY", 65)
        .setOrigin(0.5)
        .setLetterSpacing(-8);

        var strokeConfig = {
            fontSize: 25, align: 'center', stroke: '#000000', strokeThickness: 4,
            shadow: { offsetX: 2, color: '#000000', fill: false, offsetY: -1, stroke: false }
        };
        
        var text2 = this.add.text(0, -180, 
            "Eliminate all the enemies you can and beat your own records\nHow far can you go?",
            strokeConfig
        ).setOrigin(0.5);

        var text3 = this.add.text(-200, 10, "MOVE:\n\nJUMP:\n\nCROACH:\n\nATTACK:", strokeConfig)
        .setOrigin(0.5)
        .setFontSize(30);

        var pressToStart = this.add.bitmapText(
            this.scale.width/2, 
            this.scale.height - 80,  
            'future', 
            "TAP TO START", 
            60
        ).setOrigin(0.5)
        .setAlpha(0)
        .setLetterSpacing(-8);

        this.container = this.add.container(
            this.scale.width/2,
            this.scale.height/2,
            [text1, text2, text3]
        ).setAlpha(0);
            
        this.tweens.add({
            targets: this.container,
            alpha: {from: 0, to: 1},
            scale: {from: 0, to: 1},
            ease: 'Back',
            duration: 600,
            onComplete: () => {
                this.createAnimKeys();
            }
        });

        this.tweens.add({
            targets: pressToStart,
            delay: 1500,
            ease: 'Circular',
            alpha: {from: 0.2, to: 1},
            repeat: -1,
            repeatDelay: 100,
            onStart: () => {
                this.input.on('pointerdown', () => {
                    this.scene.start('UI');
                });
            },
            onComplete: () => {
                this.clearAlpha();
            }
        });

    }

    update() {
        this.bgTile.tilePositionX -= 0.2;
        this.bgTile.tilePositionY -= 0.2;
    }
    
    createAnimKeys() {
        var keysName = [
            'keyA', 'keyD', 'keyLeft', 'keyRight', 'keyW', 
            'keyUp', 'keyS', 'keyDown', 'keyJ', 'keySpace'
        ];

        var delay = 0;
        var x = this.scale.width/2 - 170;
        var y = 0;
        
        for (let i = 0; i < keysName.length; i++) {
            var key = keysName[i];
            var keyAnim = key + '_anim';
            
            delay += 200;

            this.anims.create({
                key: keyAnim,
                frames: this.anims.generateFrameNumbers(key),
                frameRate: 1,
                repeat: -1,
                delay: delay
            });
             
            switch(key) {
                case 'keyA':
                    x += 80;
                    y = 190;
                    break;
                case 'keyD':
                    x += 60;
                    y = 190;
                    this.add.text(895, y - 25, "|", {fontSize: 50, fontStyle: 'bold'});
                    break;
                case 'keyLeft':
                    x += 80;
                    y = 190;
                    break;
                case 'keyRight':
                    x += 60;
                    y = 190;
                    break;
                case 'keyW':
                    x -= 140;
                    y = 255;
                    this.add.text(895, y - 25, "|", {fontSize: 50, fontStyle: 'bold'});
                    break;
                case 'keyUp':
                    x += 80;
                    y = 255;
                    this.add.text(980, y - 25, "|", {fontSize: 50, fontStyle: 'bold'});
                    break;
                case 'keySpace': 
                    x += 200;
                    y = 255;
                    break;
                case 'keyS': 
                    x -= 80;
                    y = 320;
                    this.add.text(895, y - 25, "|", {fontSize: 50, fontStyle: 'bold'});
                    break;
                case 'keyDown':
                    x += 80;
                    y = 320;
                    break;
                case 'keyJ':
                    x -= 80;
                    y = 385;
                    break;
            }

            
            var keySprite = this.add.sprite(x, y, key).setScale(1.7);
            keySprite.play(keyAnim);
        }

    }

}

export default HowToPlay;