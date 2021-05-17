class Bootloader extends Phaser.Scene {
    constructor() {
        super('Bootloader'); 
    }

    preload() {
        this.load.path = './assets/';

        this.load.image([
            'background',
            'menu_background',
            'large_floor',
            'floor',
            'wall_end',
            'invisible_wall',
            'bullet',
            'spark',
            'life'
        ]);
        //  Cargo la fuente del videojuego
        this.load.image('font', 'font/font.png');
        this.load.json('fontData', 'font/font.json');
        //  Cargo el sonido del juego
        this.load.audio('musicPlay', 'music_play.mp3');
        this.load.audio('musicMenu', 'music_menu.mp3');
        this.load.audio('shootSound', 'sound_effects/ak47_cut.mp3');
        this.load.audio('damage','sound_effects/damage.mp3');
        this.load.audio('menu_selection_1', 'sound_effects/menu_selection_1.mp3');
        this.load.audio('menu_selection_2', 'sound_effects/menu_selection_1.mp3');
        this.load.audio('enemy_black', 'sound_effects/enemy_black.mp3');
        this.load.audio('explosion', 'sound_effects/explosion.mp3');
        this.load.audio('zapper_droid', 'sound_effects/zapper_droid.mp3');
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
            this.cache.bitmapFont.add('font', Phaser.GameObjects.RetroFont.Parse(this, fontConfig));

            this.scene.start('Play');
        })
    }

}

export default Bootloader;