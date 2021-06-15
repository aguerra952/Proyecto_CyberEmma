import Bootloader from './Bootloader.js';
import UI from './Scenes/UI.js';
import MainMenu from './Scenes/MainMenu.js';
import Play from './Scenes/Play.js';
import GameOver from './Scenes/GameOver.js';
import HowToPlay from './Scenes/HowToPlay.js';

const config = {
    title: "CyberEmma",
    version: "1.0",
    type: Phaser.AUTO,
    scale: {
        parent: "phaser_container",
        width: 1800,
        height: 568,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: true,
    physics: {
        default: "arcade",
        "arcade": {
            debug: false,
            gravity: {
                y: 2000
            }
        }
    },
    scene: [
       Bootloader,
       MainMenu,
       HowToPlay,
       UI,
       Play,
       GameOver,
    ]
}

new Phaser.Game(config);
