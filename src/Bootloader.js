class Bootloader extends Phaser.Scene {
    constructor() {
        super('Bootloader'); 
    }

    preload() {
        this.load.path = './assets/';

        this.load.image([
            'background',
            'menu_background',
            'invisible_wall',
            'large_floor',
            'floor',
            'wall_end',
            'bullet',
            'spark',
            'life',
            'heart_pixel',
            'bg_tile'
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
        //  Cargo los sprites del HowToPlay
        this.load.spritesheet('keyW', 'keyboard/W-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyS', 'keyboard/S-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyA', 'keyboard/A-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyD', 'keyboard/D-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyJ', 'keyboard/J-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyUp', 'keyboard/Up-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyDown', 'keyboard/Down-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyLeft', 'keyboard/Left-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keyRight', 'keyboard/Right-Key.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('keySpace', 'keyboard/Space-Key.png', {frameWidth: 64, frameHeight: 32});
        //  Cargo los elementos del menú principal
        this.load.image('window', 'gui/Window.png');
        //  Cargo la fuente del videojuego
        this.load.image('font', 'font/font.png');
        this.load.json('fontData', 'font/font.json');
        //  Cargo el sonido del juego
        this.load.audio('musicPlay', 'music_play.mp3');
        this.load.audio('musicMenu', 'music_menu.mp3');
        this.load.audio('gameOver', 'sound_effects/game_over.wav');
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
        
        this.load.on('complete', () => {
            const fontConfig = this.cache.json.get('fontData');
            this.cache.bitmapFont.add('future', Phaser.GameObjects.RetroFont.Parse(this, fontConfig));

            this.scene.start('MainMenu');
        });
    }

}

export default Bootloader;