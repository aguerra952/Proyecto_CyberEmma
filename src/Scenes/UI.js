class UI extends Phaser.Scene {
    constructor() {
        super({key: 'UI'});
    }

    init() {
        console.log('Se ha iniciado la escena UI');
        this.scene.bringToTop('UI');
        this.actual_points = 0;
        this.round = 0;
    }

    create() {
        this.groupLife = this.add.group({
            key: 'life',
            repeat: 3,
            setXY: {
                x: 40, 
                y: this.scale.height - 55,
                stepX: 80,
            },
        }).setOrigin(0);

        this.points = this.add.bitmapText(
            this.scale.width - 20,
            this.scale.height - 50,
            'font',
            'SCORE ' + Phaser.Utils.String.Pad('0',6,'0',1))
        .setOrigin(1,0)
        .setLetterSpacing(-5)
        .setFontSize(55)
        .setTint(0xffffff);

        //  Eventos
        this.registry.events.on('remove_life', () => {
            this.groupLife.getChildren()[this.groupLife.getChildren().length - 1].destroy();
        });

        this.registry.events.on('game_over', () => {
            this.registry.events.removeAllListeners();
            //this.scene.start('MainMenu', {points: this.actual_points});
        });
        
        this.registry.events.on('update_points', (points) => {
            this.actual_points += points;
            this.points.setText('SCORE ' + Phaser.Utils.String.Pad(this.actual_points,6,'0',1));
        });
    }

    update() {
        
    }
}

export default UI;