class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'bullet');
    }

    create(x, y, directionBullet, speed){
        //  Reseteo el cuerpo de la bala
        this.body.reset(x,y);
        
        this.setScale(1.1);
        this.setActive(true);
        this.setVisible(true);
        //  Quito la gravedad
        this.body.allowGravity = false;
        
        //  Evito que al iniciar el juego el disparo sea hacia la izquierda
        switch (directionBullet) {
            case true:
                //  Cambio la dirección de la bala
                this.setPosition(x,y); 
                this.setVelocityX(speed);
                break;
            case false:
                this.setPosition(x - 50,y);
                this.setFlipX(true);
                this.setVelocityX(-speed);
                break;
            default:
                this.setPosition(x,y); 
                this.setVelocityX(speed);
                break;
        } 
    }


}

export default Bullet;