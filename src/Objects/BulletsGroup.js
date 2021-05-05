import Bullet from '../Objects/Bullet.js';

class BulletsGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);
        
        //  Creo multiples instancias de la bala
        var numBullets = 50;
        this.createMultiple({
            key: 'bullet',
            repeat: numBullets,
            classType: Bullet,
            active: false,
            visible: false,
            allowGravity: false,  
        });

    }

    fireBullet(x,y,directionBullet,speed) {
        //  Obtengo las balas creadas
        const bullet = this.getFirstDead(false);
        if(bullet) {
            bullet.create(x,y,directionBullet,speed);
        }
    }

    destroyBullet() {
        var firstBullet = this.getFirst(true);
        if(firstBullet) {
            firstBullet.destroy();
        }
    }

}

export default BulletsGroup;