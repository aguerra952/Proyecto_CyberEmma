class Spark extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'spark');

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
    }

    create(x, y, direction, speed) {
        //  Reseteo el cuerpo de la chispa
        this.body.reset(x, y);
        this.setScale(0.15);
        //  Cambio el color a la chispa
        this.tintTopLeft = 0xfff400;
        this.tintBottomRight = 0xf4d247;
        //  Quito la gravedad
        this.body.allowGravity = false;
        
        //  Cambio la dirección de la chispa
        switch (direction) {
            case true:
                this.setPosition(x,y) ;
                this.setVelocityX(speed);
                break;
            case false:
                this.setPosition(x,y);
                this.setFlipX(true);
                this.setVelocityX(-speed);
                break;
        }
        //  Registro un método para hacer que la chispa gire según la dirección
        this.scene.registry.events.on('update_spark', () => {
            if(direction) {
                this.angle += 5;
            } else {
                this.angle -= 5;
            }
        });
        
    }
}

export default Spark;