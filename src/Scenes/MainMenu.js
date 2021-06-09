class MainMenu extends Phaser.Scene {
    constructor() {
        super({key: 'MainMenu'});
    }

    init() {
        this.scene.bringToTop('MainMenu');
        console.log('Se ha iniciado la escena MainMenu');
        this.muteFX = false;
        // this.sound.volume = 0.5;
        this.sound.play('musicMenu', {volume: 0.4, loop: true});
    }
    
    create() {
        this.add.image(0, 0, 'menu_background')
        .setScale(0.94, 0.53)
        .setOrigin(0);

        this.textTitle = this.add.bitmapText(60, 40, 'future', 'CYBEREMMA', 120)
        .setTint(0x7f5fa2, 0xd61b27, 0xd61b27, 0x7f5fa2)
        .setLetterSpacing(-5);
        
        this.textPlay = this.add.bitmapText(
            150, 
            this.scale.height/2 - 80, 
            'future', 
            'PLAY', 
            80
        ).setLetterSpacing(-8)
        .setInteractive({useHandCursor: true});

        this.textOptions = this.add.bitmapText(
            150, 
            this.scale.height/2 + 20, 
            'future', 
            'OPTIONS', 
            80
        ).setLetterSpacing(-8)
        .setInteractive({useHandCursor: true});

        this.textLeaderboard = this.add.bitmapText(
            150, 
            this.scale.height/2 + 120, 
            'future', 
            'LEADERBOARD', 
            80
        ).setLetterSpacing(-8)
        .setInteractive({useHandCursor: true});
        
        this.emmaIdle = this.add.sprite(
            this.scale.width/1.4, 
            this.scale.height/1.1, 
            'emma'
        ).setScale(5);

        //  Animación de emma
        var emmaIdle = {
            key: 'emma_idle',
            frames: 'emma',
            frameRate: 3,
            repeat: -1
        }
        this.emmaIdle.anims.play(emmaIdle);
        //  Eventos del puntero sobre los textos
        this.createMainEvents(this.textPlay);
        this.createMainEvents(this.textOptions);
        this.createMainEvents(this.textLeaderboard);
    }

    windowOptions() {
        this.tableOptions = this.add.image(0,0, 'window')
        .setAlpha(0.9)
        .setScale(0.6);

        var textOptions = this.add.text(-100, -210, 'OPTIONS', {
            fontSize: 50,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 2, color: '#000000', fill: false, offsetY: -1, stroke: false }
        });

        this.closeButtonOpt = this.add.image(230, -190, 'cross')
        .setScale(0.6)
        .setTintFill(0xffffff)
        .setInteractive({useHandCursor: true});

        var muteFXText = this.add.text(-180, -80, 'MUTE FX', {
            fontSize: 40,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 2, color: '#000000', fill: false, offsetY: -1, stroke: false }
        });

        this.muteFXButton = this.add.image(130, muteFXText.y + 20, 'audioOn')
        .setTintFill(0xffffff)
        .setScale(0.7)
        .setInteractive({useHandCursor: true});

        var muteMusicText = this.add.text(-180, 10, 'MUTE MUSIC', {
            fontSize: 40,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 2, color: '#000000', fill: false, offsetY: -1, stroke: false }
        });

        this.muteMusicButton = this.add.image(130, muteMusicText.y + 20, 'musicOn')
        .setTintFill(0xffffff)
        .setScale(0.7)
        .setInteractive({useHandCursor: true});

        var fullscreenText = this.add.text(-180, 100, 'FULLSCREEN', {
            fontSize: 40,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            shadow: { offsetX: 2, color: '#000000', fill: false, offsetY: -1, stroke: false }
        });

        this.fullscreenButton = this.add.image(130, fullscreenText.y + 20, 'fullscreen')
        .setTintFill(0xffffff)
        .setScale(0.7)
        .setInteractive({useHandCursor: true});

        this.containerOpt = this.add.container(
            this.scale.width/2, 
            this.scale.height/2,
            [
                this.tableOptions, textOptions, this.closeButtonOpt, 
                muteFXText, this.muteFXButton,
                muteMusicText, this.muteMusicButton,
                fullscreenText, this.fullscreenButton
            ]
        ).setAlpha(0);

        this.add.tween({
            targets: this.containerOpt,
            ease: 'Bounce',
            scale: {from: 0, to: 1},
            alpha: {from: 0, to: 1},
            delay: 100,
            duration: 500
        });
        
        this.createButtonsEvents(this.closeButtonOpt);

        this.createButtonsEvents(this.muteFXButton);

        this.createButtonsEvents(this.muteMusicButton);

        this.createButtonsEvents(this.fullscreenButton);
    }

    blockMainEvents(ok) {
        if (ok) {
            this.textPlay.disableInteractive();
            this.textOptions.disableInteractive();
            this.textLeaderboard.disableInteractive();
        } else {
            this.textPlay.setInteractive();
            this.textOptions.setInteractive();
            this.textLeaderboard.setInteractive();
        }
    }

    createMainEvents(button) {
        button.on('pointerover', () => {
            button.alpha = 0.7;
            this.sound.play('menu_selection_1', {volume: 0.3, mute: this.muteFX});
        });

        button.on('pointerout', () => {
            button.clearAlpha();
        });

        button.on('pointerdown', () => {
            button.clearAlpha();
            button.setTint(0x7f5fa2);
            this.sound.play('menu_selection_2', {volume: 0.3, mute: this.muteFX});
            this.blockMainEvents(true);
            
            if (button === this.textPlay) {
                this.time.addEvent({
                    delay: 400,
                    callback: () => {
                        this.input.setDefaultCursor('default');
                        this.sound.stopByKey('musicMenu');
                        this.scene.start('HowToPlay');
                        // this.scene.start('UI');
                        this.blockMainEvents(false);
                    },
                });
            } else if (button === this.textOptions) {
                this.windowOptions();
            } else if (button === this.textLeaderboard) {
                this.blockMainEvents(false);
            }
        });
    }

    createButtonsEvents(button) {
        button.on('pointerover', () => { 
            button.setTintFill(0xedcb05); 
        });

        button.on('pointerout', () => { 
            button.setTintFill(0xffffff);
        });

        button.on('pointerdown', () => { 
            if (button === this.closeButtonOpt) {
                this.tweenClose = this.add.tween({
                    targets: this.containerOpt,
                    ease: 'Circular',
                    scale: {from: 1, to: 0},
                    alpha: {from: 1, to: 0},
                    duration: 300,
                    onComplete: () => {
                        this.containerOpt.destroy();
                        this.textOptions.clearTint();
                        this.blockMainEvents(false);
                    }
                });
            } else if (button === this.muteFXButton) {
                if (button.texture.key !== 'audioOff') {
                    button.setTexture('audioOff');
                    this.muteFX = true;
                } else {
                    button.setTexture('audioOn');
                    this.muteFX = false;
                }
            } else if (button === this.muteMusicButton) {
                if (button.texture.key !== 'musicOff') {
                    button.setTexture('musicOff');
                    this.sound.stopByKey('musicMenu');
                } else {
                    button.setTexture('musicOn');
                    this.sound.play('musicMenu', {volume: 0.4, loop: true});
                }
            } else if (button === this.fullscreenButton) {
                if (button.texture.key !== 'no-fullscreen') {
                    button.setTexture('no-fullscreen');
                } else {
                    button.setTexture('fullscreen');
                }

                if(this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            }
        });
    }

}

export default MainMenu;