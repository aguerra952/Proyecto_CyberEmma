class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
    }

    create(x, y, direction, speed){
        //  Reseteo el cuerpo de la bala
        this.body.reset(x,y);
        this.setScale(1.1);
        //  Quito la gravedad
        this.body.allowGravity = false;
        //  Cambio la dirección de la bala
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
            //  Evito que al iniciar el juego el disparo sea hacia la izquierda
            default:
                this.setPosition(x,y) ;
                this.setVelocityX(speed);
                break;
        } 
    }

}

export default Bullet;