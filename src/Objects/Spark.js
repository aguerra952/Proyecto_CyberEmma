class Spark extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'spark');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
    }

    create(x, y, direction, speed) {
        //  Reseteo el cuerpo de la bala
        this.body.reset(x, y);
        this.setScale(0.15);
        this.tintTopLeft = 0xfff400;
        this.tintBottomRight = 0xf4d247;

        //  Quito la gravedad
        this.body.allowGravity = false;
        
        //  Evito que al iniciar el juego el disparo sea hacia la izquierda
        switch (direction) {
            case true:
                //  Cambio la dirección de la bala
                this.setPosition(x,y) ;
                this.setVelocityX(speed);
                break;
            case false:
                this.setPosition(x,y);
                this.setFlipX(true);
                this.setVelocityX(-speed);
                break;
        }

        this.scene.registry.events.on('update_spark', () => {
            if(direction) {
                this.angle += 4;
            } else {
                this.angle -= 4;
            }
        });
        
    }
}

export default Spark;