class UI extends Phaser.Scene {
    constructor() {
        super({key: 'UI'});
    }
    
    init() {
        console.log('Se ha iniciado la escena UI');
        this.scene.bringToTop('UI');
        this.actual_points = 0;
        this.lifes = 4;
        this.round = 1;
    }

    create() {
        this.lifeImage = this.add.image(55, 20, 'life');

        this.lifesCount = this.add.bitmapText(
            110,
            0,
            'future',
            this.lifes
        ).setOrigin(0)
        .setFontSize(60);

        this.containerLife = this.add.container(
            20, 
            this.scale.height - 50, 
            [this.lifeImage, this.lifesCount]
        ).setVisible(false);

        this.points = this.add.bitmapText(
            this.scale.width - 20,
            this.scale.height - 50,
            'future',
            Phaser.Utils.String.Pad(this.actual_points, 7, '0', 1)
        ).setOrigin(1, 0)
        .setLetterSpacing(-5)
        .setFontSize(55)
        .setVisible(false);

        this.showRound(0);

        //  Eventos
        this.registry.events.on('remove_life', () => {
            this.lifes--;
            this.lifesCount.setText(this.lifes);
            this.registry.events.emit('remove_emma_life', this.lifes);
        });
        
        this.registry.events.on('add_life', () => {
            this.lifes++;
            this.lifesCount.setText(this.lifes);
            this.registry.events.emit('add_emma_life', this.lifes);
        });
        
        this.registry.events.on('update_points', (points) => {
            this.actual_points += points;
            this.points.setText(Phaser.Utils.String.Pad(this.actual_points, 7, '0', 1));
        });

        this.registry.events.on('game_over', () => {
            //  Reseteo las vidas de Emma en la escena UI
            this.registry.events.removeAllListeners();
            this.scene.start('GameOver', {points: this.actual_points});
        });

        this.registry.events.on('round_ends', () => {
            this.round++;
            this.showRound(this.round);
            // this.registry.events.emit('set_round', this.round);
            // this.scene.launch('Play', this.round);
        });
    }

    showRound(round) {
        this.containerLife.setVisible(false);
        this.points.setVisible(false);

        this.roundText = this.add.bitmapText(
            this.scale.width/2, 
            this.scale.height/2, 
            'future', 
            `ROUND ${this.round}`, 
            80)
        .setOrigin(0.5)
        .setAlpha(0)
        .setLetterSpacing(-8);
        //  Cuando la animación se complete carga 
        this.add.tween({
            targets: this.roundText,
            alpha: {from: 0, to: 1},
            scale: {from: 1, to: 1.5},
            ease: 'Linear',
            duration: 2000,
            yoyo: true,
            onComplete: () => {
                this.containerLife.setVisible(true);
                this.points.setVisible(true);

                this.scene.launch('Play', [round]);
            }
        });


    }
}

export default UI;