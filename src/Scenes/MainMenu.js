class MainMenu extends Phaser.Scene {
    constructor() {
        super({key: 'MainMenu'});
    }

    init() {
        this.scene.bringToTop('MainMenu');
        console.log('Se ha iniciado la escena MainMenu');
        //  Obtengo de la BD local los iconos de las opciones
        var iconMusicDB = localStorage.getItem('icon_music');
        var iconAudioDB = localStorage.getItem('icon_audio');
        //  Si no se obtienen datos se introduce un icono por defecto
        var iconMusic = (iconMusicDB !== null) ? iconMusicDB : 'musicOn';
        var iconAudio = (iconAudioDB !== null) ? iconAudioDB : 'audioOn';
        //  Si los iconos coinciden se reproducen los sonidos inicialmentente
        if (iconMusic === 'musicOn') {
            this.sound.play('musicMenu', {volume: 0.3, loop: true});
        }

        if (iconAudio === 'audioOn') {
            this.muteAudio = false;
        } else {
            this.muteAudio = true;
        }
    }
    
    create() {
        //  Añado el fondo
        this.add.image(0, 0, 'menu_background')
        .setScale(0.94, 0.53)
        .setOrigin(0);
        //  Creo los botones de texto principales
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

        /**
         * FUNCIONALIDAD FUTURA
         * 
         * SE PUEDE AÑADIR UN DESPLEGABLE PARA VER LAS MEJORES PUNTUACIONES
         */
        /*
            this.textLeaderboard = this.add.bitmapText(
                150, 
                this.scale.height/2 + 120, 
                'future', 
                'LEADERBOARD', 
                80
            ).setLetterSpacing(-8)
            .setInteractive({useHandCursor: true});
        */
        //  Creo un sprite
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
        //  Reproduzco la animación
        this.emmaIdle.anims.play(emmaIdle);
        //  Eventos del puntero sobre los textos
        this.createMainEvents(this.textPlay);
        this.createMainEvents(this.textOptions);
    }

    update() {
        //  Se obtiene continuamente el valor de los iconos
        var iconAudioDB = localStorage.getItem('icon_audio');
        var iconMusicDB = localStorage.getItem('icon_music');
        //  Si no tienen valor por defecto se le asigna un valor
        this.iconAudio = (iconAudioDB !== null) ? iconAudioDB : 'audioOn';
        this.iconMusic = (iconMusicDB !== null) ? iconMusicDB : 'musicOn';
    }
    //  Método para crear el menú de opciones
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

        this.muteFXButton = this.add.image(130, muteFXText.y + 20, this.iconAudio)
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

        this.muteMusicButton = this.add.image(130, muteMusicText.y + 20, this.iconMusic)
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
        //  Añado los elemento anteriores a un contenedor
        this.containerOpt = this.add.container(
            this.scale.width/2, 
            this.scale.height/2,
            [
                this.tableOptions, textOptions, this.closeButtonOpt,
                muteFXText, this.muteFXButton, muteMusicText, 
                this.muteMusicButton, fullscreenText, this.fullscreenButton
            ]
        ).setAlpha(0);
        //  Creo un efecto al aparecer
        this.add.tween({
            targets: this.containerOpt,
            ease: 'Bounce',
            scale: {from: 0, to: 1},
            alpha: {from: 0, to: 1},
            delay: 100,
            duration: 500
        });
        //  Botón de cerrar
        this.createButtonsEvents(this.closeButtonOpt);
        //  Botón de mutear efectos de sonido
        this.createButtonsEvents(this.muteFXButton);
        //  Botón de mutear la música
        this.createButtonsEvents(this.muteMusicButton);
        //  Botón de habilitar/deshabilitar la pantalla completa
        this.createButtonsEvents(this.fullscreenButton);
    }
    //  Método para bloquear la interactividad con los botones
    blockMainEvents(ok) {
        if (ok) {
            this.textPlay.disableInteractive();
            this.textOptions.disableInteractive();
        } else {
            this.textPlay.setInteractive();
            this.textOptions.setInteractive();
        }
    }
    //  Método que crea los eventos de los textos
    createMainEvents(button) {
        //  Evento al dejar el cursor encima del botón
        button.on('pointerover', () => {
            button.alpha = 0.7;
            this.sound.play('menu_selection_1', {volume: 0.2, mute: this.muteAudio});
        });
        //  Evento al quitar el cursor sobre el botón
        button.on('pointerout', () => {
            button.clearAlpha();
        });
        //  Evento al hacer clic sobre el botón
        button.on('pointerdown', () => {
            button.clearAlpha();
            button.setTint(0x7f5fa2);
            this.sound.play('menu_selection_2', {volume: 0.2, mute: this.muteAudio});
            this.blockMainEvents(true);
            
            if (button === this.textPlay) {
                this.time.addEvent({
                    delay: 400,
                    callback: () => {
                        this.input.setDefaultCursor('default');
                        this.sound.stopByKey('musicMenu');
                        this.scene.start('HowToPlay');
                    },
                });
            } else if (button === this.textOptions) {
                this.windowOptions();
            }
        });
    }
    //  Método que crea los eventos de los botones del menú Opciones
    createButtonsEvents(button) {
        button.on('pointerover', () => { 
            button.setTintFill(0xedcb05); 
            this.sound.play('menu_selection_1', {volume: 0.2, mute: this.muteAudio});
        });

        button.on('pointerout', () => { 
            button.setTintFill(0xffffff);
        });

        button.on('pointerdown', () => { 
            this.sound.play('menu_selection_2', {volume: 0.2, mute: this.muteAudio});
            //  Compruebo el botón introducido
            if (button === this.closeButtonOpt) {
                //  Efecto al cerrar la ventana de opciones
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
                //  Cambio la textura del botón
                if (button.texture.key !== 'audioOff') {
                    button.setTexture('audioOff');
                    localStorage.setItem('icon_audio', 'audioOff');
                    this.muteAudio = true;
                } else {
                    button.setTexture('audioOn');
                    localStorage.setItem('icon_audio', 'audioOn');
                    this.muteAudio = false;
                }

            } else if (button === this.muteMusicButton) {
                //  Cambio la textura del botón
                if (button.texture.key !== 'musicOff') {
                    button.setTexture('musicOff');
                    localStorage.setItem('icon_music', 'musicOff');
                    //  Detengo la música del menú
                    this.sound.stopByKey('musicMenu');
                } else {
                    button.setTexture('musicOn');
                    localStorage.setItem('icon_music', 'musicOn');
                    //  Vuelvo a reproducir la música del menú
                    this.sound.play('musicMenu', {volume: 0.3, loop: true});
                }

            } else if (button === this.fullscreenButton) {
                //  Cambio la textura del botón
                if (button.texture.key !== 'no-fullscreen') {
                    button.setTexture('no-fullscreen');
                } else {
                    button.setTexture('fullscreen');
                }
                //  Funcionalidad para la pantalla completa
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