class Bootloader extends Phaser.Scene {
    constructor() {
        super('Bootloader'); 
    }

    preload() {	
        //  Cambio color del fondo
        this.cameras.main.setBackgroundColor('#3a3b3e');

        var centerX = this.scale.width / 2;
        var centerY = this.scale.height / 2;

        var loadingText = this.make.text({
            y: 50,
            text: 'Loading...',
            style: {
                fontSize: 25,
                fill: '#ffffff',
                align: 'center'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            text: '0%',
            style: {
                fontSize: 20,
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        //  Creo una caja de progreso para luego ir rellenándola
        var progressBox = this.add.graphics({x: -175, y: -25});
        var progressBar = this.add.graphics({x: -175, y: -25});
        //  Pinto la barra de progreso
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(0, 0, 350, 50);
        //  Lo meto todo en un contenedor para poder centrarlo en pantalla
        this.container = this.add.container(centerX, centerY, 
            [progressBar, progressBox, loadingText, percentText]
        );
        //  Evento que se está ejecutando mientras el preload está en proceso
        this.load.on('progress', function (value) {
            //  Actualizo el porcentaje de progreso
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            //  Se va pintando la barra de progreso de blanco
            progressBar.fillStyle(0xffffff, 1);
            //  Va cambiando la longuitud de la barra de progreso según el valor
            progressBar.fillRect(10, 10, 330 * value, 30);
        });
        //  Establezco una ruta predeterminada
        this.load.path = './assets/';
        //  Cargo imágenes
        this.load.image([
            'background',
            'menu_background',
            'invisible_wall',
            'large_floor',
            'heart_pixel',
            'wall_end',
            'floor',
            'bullet',
            'spark',
            'life',
            'bg_tile',
            'window'
        ]);
        //  Cargo los iconos del juego
        this.load.image('home', 'icons/home.png');
        this.load.image('return', 'icons/return.png');
        this.load.image('cross', 'icons/cross.png');
        this.load.image('audioOn', 'icons/audioOn.png');
        this.load.image('audioOff', 'icons/audioOff.png');
        this.load.image('musicOn', 'icons/musicOn.png');
        this.load.image('musicOff', 'icons/musicOff.png');
        this.load.image('fullscreen', 'icons/larger.png');
        this.load.image('no-fullscreen', 'icons/smaller.png');
        //  Cargo los sprites de las teclas del teclado
        this.load.spritesheet('keyW', 'keyboard/W-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyA', 'keyboard/A-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyD', 'keyboard/D-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyJ', 'keyboard/J-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyUp', 'keyboard/Up-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyLeft', 'keyboard/Left-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyRight', 'keyboard/Right-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keySpace', 'keyboard/Space-Key.png', {frameWidth: 64, frameHeight: 32});
        //  Cargo la fuente del videojuego
        this.load.image('font', 'font/font.png');
        this.load.json('fontData', 'font/font.json');
        this.load.audio('gameOver', 'game_over.wav');
        //  Cargo el sonido del juego
        this.load.audio('musicPlay', 'music_play.mp3');
        this.load.audio('musicMenu', 'music_menu.mp3');
        this.load.audio('shootSound', 'sound_effects/ak47_cut.mp3');
        this.load.audio('damage','sound_effects/damage.mp3');
        this.load.audio('menu_selection_1', 'sound_effects/menu_selection_1.mp3');
        this.load.audio('menu_selection_2', 'sound_effects/menu_selection_2.wav');
        this.load.audio('enemy_black', 'sound_effects/enemy_black.mp3');
        this.load.audio('explosion', 'sound_effects/explosion.mp3');
        this.load.audio('zapper_droid', 'sound_effects/zapper_droid.mp3');
        this.load.audio('emma_damage', 'sound_effects/emma_damage.mp3');
        //  Cargo a Emma
        this.load.atlas('emma', 'emma/emma.png', 'emma/emma_atlas.json');
        this.load.animation('emmaAnim', 'emma/emma_anim.json');
        //  Cargo al enemigo negro que dispara
        this.load.atlas('enemblack','enemy_black/enemblack.png', 'enemy_black/enemblack_atlas.json');
        this.load.animation('enemblackAnim', 'enemy_black/enemblack_anim.json');
        //  Cargo al dron enemigo
        this.load.atlas('drone','drone/drone.png', 'drone/drone_atlas.json');
        this.load.animation('droneAnim', 'drone/drone_anim.json');
        //  Cargo al droide zapper
        this.load.atlas('zapper_droid','zapper_droid/zapper_droid.png', 'zapper_droid/zapper_droid_atlas.json');
        this.load.animation('zapperAnim', 'zapper_droid/zapper_droid_anim.json');   
        //  Evento que se ejecutará cuando se termine de cargar la escena
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            //  Creo la configuración para la letra del juego
            const fontConfig = this.cache.json.get('fontData');
            this.cache.bitmapFont.add('future', Phaser.GameObjects.RetroFont.Parse(this, fontConfig));
            
            this.scene.start('MainMenu');
        }); 
    }

}

export default Bootloader;