class GameOver extends Phaser.Scene {
    constructor() {
        super({key: 'GameOver'});
    }

    init(data) {
        console.log('Se ha iniciado la escena GameOver');
        this.sound.play('gameOver', {volume: 1, loop: false});
        if(Object.keys(data).length != 0){
            this.points = data.points;
        }
    }

    create() {
        const pointsDB = localStorage.getItem('best_points');
        this.bestPoints = (pointsDB !== null) ? pointsDB : 0;
        
        if(this.points > this.bestPoints) {
            localStorage.setItem('best_points', this.points);
        }
        
        this.gameOverText = this.add.bitmapText(0, 0, 'future', 'GAME OVER', 70)
        .setOrigin(0.5)
        .setLetterSpacing(-8)
        .setAlpha(0);
        
        this.scoreText = this.add.bitmapText(0, 60, 'future', `SCORE ${this.points}`, 35)
        .setOrigin(0.5)
        .setLetterSpacing(-8)
        .setAlpha(0);
        
        this.bestScoreText = this.add.bitmapText(0, 100, 'future', `BEST SCORE ${this.bestPoints}`, 35)
        .setInteractive()
        .setOrigin(0.5)
        .setLetterSpacing(-8)
        .setAlpha(0);
        
        this.playAgainText = this.add.bitmapText(0, 170, 'future', 'PLAY AGAIN', 50)
        .setOrigin(0.5)
        .setLetterSpacing(-8)
        .setAlpha(0)
        .setInteractive({useHandCursor: true});
        
        this.playAgainButton = this.add.image(180, 160, 'return')
        .setScale(0.6)
        .setTintFill(0xffffff)
        .setOrigin(0.5)
        .setAlpha(0)
        .setInteractive({useHandCursor: true});

        this.mainMenuText = this.add.bitmapText(0, 240, 'future', 'MAIN MENU', 50)
        .setOrigin(0.5)
        .setLetterSpacing(-8)
        .setAlpha(0)
        .setInteractive({useHandCursor: true});
        
        this.mainMenuButton = this.add.image(160, 230, 'home')
        .setScale(0.5)
        .setTintFill(0xffffff)
        .setOrigin(0.5)
        .setAlpha(0)
        .setInteractive({useHandCursor: true});

        this.containerGameOver = this.add.container(
            this.scale.width/2,
            this.scale.height/2.5,
            [
                this.gameOverText, this.scoreText, this.bestScoreText, 
                this.playAgainText, this.playAgainButton,
                this.mainMenuText, this.mainMenuButton
            ]
        );
        //  Creo un timeline para agregar efectos al principio
        this.timeline = this.tweens.createTimeline();
        
        this.timeline.add({
            targets: this.gameOverText,
            alpha: {from: 0, to: 1},
            ease: 'Sine.easeInOut',
            duration: 1000,
        });

        this.timeline.add({
            targets: [this.scoreText, this.bestScoreText],
            delay: 200,
            alpha: {from: 0, to: 1},
            ease: 'Sine.easeInOut',
            duration: 500,
        });

        this.timeline.add({
            targets: [this.playAgainText, this.playAgainButton],
            delay: 300,
            x:{
                from: -100, to: function(target,targetKey,value,targetIndex,totalTargets,tween) {
                    if (targetIndex === 1) return 180;
                    else return 0;
                }
            },
            alpha: {from: 0, to: 1},
            ease: 'Linear',
            duration: 500,
        });

        this.timeline.add({
            targets: [this.mainMenuText, this.mainMenuButton],
            delay: 400,
            x:{
                from: -100, to: function(target,targetKey,value,targetIndex,totalTargets,tween) {
                    if (targetIndex === 1) return 160;
                    else return 0;
                }
            },
            alpha: {from: 0, to: 1},
            ease: 'Linear',
            duration: 500,
        });

        this.timeline.play();

        //  Eventos del jugar de nuevo
        this.playAgainText.on('pointerover', () => {
            this.tweensScenes('PlayAgain','over');
        });
        
        this.playAgainText.on('pointerout', () => {
            this.tweensScenes('PlayAgain','out');
        });

        this.playAgainButton.on('pointerover', () => {
            this.tweensScenes('PlayAgain','over');
        });
        
        this.playAgainButton.on('pointerout', () => {
            this.tweensScenes('PlayAgain','out');
        });

        this.playAgainText.on('pointerdown', () => {
            this.startsScenes('PlayAgain');
        });
        
        this.playAgainButton.on('pointerdown', () => {
            this.startsScenes('PlayAgain');
        });

        //  Eventos del menú principal
        this.mainMenuText.on('pointerover', () => {
            this.tweensScenes('MainMenu','over');
        });
        
        this.mainMenuText.on('pointerout', () => {
            this.tweensScenes('MainMenu','out');
        });

        this.mainMenuButton.on('pointerover', () => {
            this.tweensScenes('MainMenu','over');
        });
        
        this.mainMenuButton.on('pointerout', () => {
            this.tweensScenes('MainMenu','out');
        });

        this.mainMenuText.on('pointerdown', () => {
            this.startsScenes('MainMenu');
        });
        
        this.mainMenuButton.on('pointerdown', () => {
            this.startsScenes('MainMenu');
        });
        
    }
    
    tweensScenes(scene, pointerevent) {
        if (scene === 'PlayAgain') {
            if (pointerevent === 'over') {
                this.add.tween({
                    targets: this.playAgainText,
                    scale: {from: 1, to: 1.2},
                    ease: 'Circular',
                    duration: 200,
                });
    
                this.add.tween({
                    targets: this.playAgainButton,
                    x: {value: 210, duration: 0},
                    scale: {from: 0.5, to: 0.7},
                    angle : {from: 0, to: -360},
                    ease: 'Circular',
                    duration: 300,
                });
            }
    
            if (pointerevent === 'out') {
                this.add.tween({
                    targets: this.playAgainText,
                    scale: {from: 1.2, to: 1},
                    ease: 'Circular',
                    duration: 200,
                });
    
                this.add.tween({
                    targets: this.playAgainButton,
                    x: {value: 180, duration: 0},
                    scale: {from: 0.7, to: 0.5},
                    ease: 'Circular',
                    duration: 300,
                });
            }
        } 

        if (scene === 'MainMenu') {
            if (pointerevent === 'over') {
                this.add.tween({
                    targets: this.mainMenuText,
                    scale: {from: 1, to: 1.2},
                    ease: 'Circular',
                    duration: 200,
                });
    
                this.add.tween({
                    targets: this.mainMenuButton,
                    x: {value: 190, duration: 0},
                    scale: {from: 0.5, to: 0.7},
                    ease: 'Circular',
                    duration: 300,
                });
            }
    
            if (pointerevent === 'out') {
                this.add.tween({
                    targets: this.mainMenuText,
                    scale: {from: 1.2, to: 1},
                    ease: 'Circular',
                    duration: 200,
                });
    
                this.add.tween({
                    targets: this.mainMenuButton,
                    x: {value: 160, duration: 0},
                    scale: {from: 0.7, to: 0.5},
                    ease: 'Circular',
                    duration: 300,
                });
            }
        }
    }

    startsScenes(scene) {
        if (scene === 'PlayAgain') {
            this.playAgainText.setTint(0x7f5fa2);
            this.playAgainButton.setTintFill(0x7f5fa2);
            this.time.addEvent({
                delay: 600,
                callback: () => {
                    this.sound.stopByKey('gameOver');
                    this.scene.start('Play');
                }
            });
        }
        
        if (scene === 'MainMenu') {
            this.mainMenuText.setTint(0x7f5fa2);
            this.mainMenuButton.setTintFill(0x7f5fa2);
            this.time.addEvent({
                delay: 600,
                callback: () => {
                    this.sound.stopByKey('gameOver');
                    this.scene.start('MainMenu');
                }
            });
        }

    }

}
export default GameOver;