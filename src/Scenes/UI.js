class UI extends Phaser.Scene {
    constructor() {
        super({key: 'UI'});
    }
    
    init() {
        console.log('Se ha iniciado la escena UI');
        this.scene.bringToTop('UI');
        this.actual_points = 0;
        this.lifes = 4;
    }

    create() {
        this.lifeImage = this.add.image(55, 20, 'life');

        this.lifesCount = this.add.bitmapText(
            110,
            0,
            'future',
            this.lifes,
        ).setOrigin(0)
        .setFontSize(60);

        this.containerLife = this.add.container(
            20, 
            this.scale.height - 50, 
            [this.lifeImage, this.lifesCount]
        );

        this.points = this.add.bitmapText(
            this.scale.width - 20,
            this.scale.height - 50,
            'future',
            Phaser.Utils.String.Pad('0', 7, '0', 1)
        ).setOrigin(1, 0)
        .setLetterSpacing(-5)
        .setFontSize(55);
            
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

        this.registry.events.on('emma_life', (emmaLife) => {
            this.lifes = emmaLife;
        });

        this.registry.events.on('game_over', () => {
            //  Reseteo las vidas de Emma en la escena UI
            this.registry.events.removeAllListeners();
            this.scene.start('GameOver', {points: this.actual_points});
        });
        
    
    }
}

export default UI;