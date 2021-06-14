class UI extends Phaser.Scene {
    constructor() {
        super({key: 'UI'});
    }
    
    init() {
        console.log('Se ha iniciado la escena UI');
        this.scene.bringToTop('UI');
        this.actual_points = 0;
        //  Vidas que utiliza Emma
        this.lifes = 4;
        this.round = 1;
    }

    create() {
        //  Creo los elementos de la interfaz
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
        //  Llamo al método al iniciar la escena
        this.showRound();

        //  Registro un evento para eliminar vidas a Emma
        this.registry.events.on('remove_life', () => {
            this.lifes--;
            this.lifesCount.setText(this.lifes);
            //  Emito un evento que devuelve las vidas una vez removidas
            this.registry.events.emit('remove_emma_life', this.lifes);
        });
        //  Registro un evento para agregar vidas a Emma
        this.registry.events.on('add_life', () => {
            this.lifes++;
            this.lifesCount.setText(this.lifes);
            //  Emito un evento que devuelve las vidas una vez agregadas
            this.registry.events.emit('add_emma_life', this.lifes);
        });
        //  Registro un evento para actualizar los puntos
        this.registry.events.on('update_points', (points) => {
            this.actual_points += points;
            this.points.setText(Phaser.Utils.String.Pad(this.actual_points, 7, '0', 1));
        });
        //  Registro un evento para cuando finalice el juego
        this.registry.events.on('game_over', () => {
            //  Reseteo las vidas de Emma en la escena UI
            this.registry.events.removeListener('emma_life');
            //  Inicio la escena GameOver con los puntos actuales
            this.scene.start('GameOver', {points: this.actual_points});
        });
        //  Registro un evento para cuando la ronda se termine
        this.registry.events.on('round_ends', () => {
            //  Paro la escena Play
            this.scene.stop('Play');
            //  Reseteo las vidas de Emma en la escena UI
            this.registry.events.removeListener('emma_life');
            this.round++;
            this.showRound(this.round);
        });
    }
    //  Método que muestra la ronda actual
    showRound() {
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
        //  Efecto de aparición
        this.add.tween({
            targets: this.roundText,
            alpha: {from: 0, to: 1},
            scale: {from: 1, to: 1.5},
            ease: 'Linear',
            duration: 1000,
            yoyo: true,
            onComplete: () => {
                //  Pongo a visible los elementos principales del UI
                this.containerLife.setVisible(true);
                this.points.setVisible(true);
                //  Lanzo simultáneamete la escena Play con la ronda actual
                this.scene.launch('Play', this.round);
            }
        });


    }
}

export default UI;