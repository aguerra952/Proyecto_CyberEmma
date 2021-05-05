import Bullets from "../Objects/Bullet.js";

class EnemyBlack extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, "enemblack");

    this.nextTick = 0;
    this.bullets = this.scene.physics.add.group({
      classType: Bullets,
      key: "bullet"
    });

    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    
    this.setScale(2.9);
    this.body.setSize(20, 35);
    this.body.setBounce(0.2);
    this.body.setImmovable(true);
    
    this.anims.play("enemblack_run");

    this.hitDelay = false;
    this.life = 3;
    this.points = 50;
    this.velocity = 50;
    this.direction = "left";
  }

  update() {
    //  Reestablezco la velocidad en función de la dirección
    if(this.direction === "left") {
      this.body.velocity.x = this.velocity;
      this.setFlipX(false);
    } else if(this.direction === "right"){
      this.body.velocity.x = -this.velocity;
      this.setFlipX(true);
    }
  }
  //  Pauso el movimiento del enemigo
  stopMovement(playerX) {
    this.body.setVelocityX(0);
    
    //  Reseteo la dirección para que tenga la dirección opuesta a la de Emma
    if(this.x > playerX) {
      this.direction = "right"; 
    } else {
      this.direction = "left";
    }
    
  }

  //  Esta método calcula el tiempo que pasa entre la bala que ha salido y el tiempo del juego
  fire(time) {
    //  Si el tiempo del juego es mayor que el tiempo de salida de la proxima bala se produce el disparo
    if (time > this.nextTick) {
      //  Es la frecuencia en milisegundos que tiene que haber de diferencia
      var tickFreq = 3000;
      this.nextTick = time + tickFreq;

      var bullet = this.bullets.get();
      if (this.direction === "left") {
        //  Dispara a la izquierda
        if (bullet) {
          bullet.create(this.x, this.y - 15, true, 250);
        }
      } else if(this.direction === "right") {
        //  Dispara a la derecha
        if (bullet) {
          bullet.create(this.x, this.y - 15, false, 250);
        }
      }
    } 

  }

  enemyDamage() {
    if (!this.hitDelay) {
      this.hitDelay = true;
      this.scene.sound.play('damage', {volume: 0.2});
      this.life--;
      
      if(this.life === 0) {
        this.body.velocity.x = 0;
        this.anims.play("enemblack_death");
        this.scene.time.addEvent({
          delay: 600,
          callback: () => {
            this.scene.registry.events.emit('update_points', this.points);
            this.destroy();
          }
        });
      }

      this.setTint(0xd40000);

      this.scene.time.addEvent({
        delay: 200,
        callback: () => {
          this.hitDelay = false;
          this.clearTint();
        },
      });
    }
     
  }

}

export default EnemyBlack;