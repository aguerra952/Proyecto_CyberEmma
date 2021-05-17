class MainMenu extends Phaser.Scene {
    constructor() {
        super({key: 'MainMenu'});
    }

    init() {
        // this.sound.play('musicMenu', {volume: 1, loop: true});
    }

    create() {

        this.add.image(0,0,'menu_background')
        .setScale(0.94,0.53)
        .setOrigin(0);

        this.textTitle = this.add.bitmapText(50,30,'font','CYBEREMMA',115)
        .setTint(0x7f5fa2, 0xd61b27, 0xd61b27, 0x7f5fa2)
        .setLetterSpacing(-5);

        this.textPlay = this.add.bitmapText(150,this.scale.height/2 - 80,'font','PLAY',80)
        .setLetterSpacing(-5)
        .setInteractive({useHandCursor: true});

        this.textHelp = this.add.bitmapText (150,this.scale.height/2 + 20,'font','HELP',80)
        .setLetterSpacing(-5)
        .setInteractive({useHandCursor: true});

        this.textOptions = this.add.bitmapText (150,this.scale.height/2 + 120,'font','OPTIONS',80)
        .setLetterSpacing(-5)
        .setInteractive({useHandCursor: true});
        
        this.emmaIdle = this.add.sprite(this.scale.width/1.4, this.scale.height/1.1, 'emma')
        .setScale(5);

        var emmaIdle = {
            key: 'emma_idle',
            frames: 'emma',
            frameRate: 3,
            repeat: -1
        }
        //  Animacion de emma
        this.emmaIdle.anims.play(emmaIdle);
        //  Eventos del puntero sobre los textos
        this.textPlay.on('pointerover', () => {
            this.textPlay.alpha = 0.7;
            this.sound.play('menu_navigate_1', {volume: 1, detune: -150});
        });

        this.textPlay.on('pointerout', () => {
            this.textPlay.clearAlpha();
        });

        this.textHelp.on('pointerover', () => {
            this.textHelp.alpha = 0.7;
            this.sound.play('menu_navigate_1', {volume: 1, detune: -150});
        });
        
        this.textHelp.on('pointerout', () => {
            this.textHelp.clearAlpha();
        });

        this.textOptions.on('pointerover', () => {
            this.textOptions.alpha = 0.7;
            this.sound.play('menu_navigate_1', {volume: 1, detune: -150});
        });

        this.textOptions.on('pointerout', () => {
            this.textOptions.alpha = 1;
        });
        //  Eventos de los textos al hacer clik sobre ellos
        this.textPlay.on('pointerdown', () => {
            this.textPlay.clearAlpha();
            this.textPlay.setTint(0x7f5fa2);
            this.sound.play('menu_navigate_2', {volume: 0.5});
            
            this.time.addEvent({
                //  Añado tiempo de espera
                delay: 600,
                callback: () => {
                    this.input.setDefaultCursor('default');
                    this.sound.stopAll();
                    this.events.removeAllListeners();
                    this.scene.start('Play');
                },
            });
            
        });

        this.textHelp.on('pointerdown', () => {
            this.textHelp.clearAlpha();
            this.textHelp.setTint(0x7f5fa2);
            
            this.time.addEvent({
                delay: 400,
                callback: () => {
                    // this.input.setDefaultCursor('default')
                    //this.scene.start('Play')
                },
            });
        });

        this.textOptions.on('pointerdown', () => {
            this.textOptions.clearAlpha();
            this.textOptions.setTint(0x7f5fa2);
            
            this.time.addEvent({
                delay: 600,
                callback: () => {
                    // this.input.setDefaultCursor('default')
                    //this.scene.start('Play')
                },
            })
            
        });
    }

}

export default MainMenu;