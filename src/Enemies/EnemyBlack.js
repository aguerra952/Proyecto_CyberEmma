import Bullets from "../Objects/Bullet.js";

class EnemyBlack extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, 'enemblack');

    this.setData({name: "Enemy Black"});
    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    
    this.setScale(2.9);
    this.body.setSize(20, 35);
    this.body.setBounce(0.2);
    this.setDepth(1);
    
    this.life = 3;
    this.points = 30;
    this.velocity = 50;
    this.direction = "left";
    this.hitDelay = false;
    //  Propiedad para controlar la próxima bala que se dispare
    this.nextTick = 0;
    this.bullets = this.scene.physics.add.group({
      classType: Bullets,
      key: 'bullet',
    });

  }

  update() {
    //  Reestablezco la velocidad en función de la dirección
    if(this.direction === "right") {
      this.body.velocity.x = -this.velocity;
      this.setFlipX(true);
    } else if(this.direction === "left"){
      this.body.velocity.x = this.velocity;
      this.setFlipX(false);
    } else {
      //  Si no hay ninguna dirección el enemigo se queda quieto
      this.body.velocity.x = 0;
    }
    //  Si el update está activo y el enemigo no ha muerto se reproduce la animación
    if(this.active && this.direction != "none") 
      this.anims.play('enemblack_run', true);
    
  }

  //  Pauso el movimiento del enemigo
  stopMovement(emmaX) {
    //  El enemigo se para luego para poder disparar
    this.body.velocity.x = 0;
    //  Si se llama al método se reproduce la animación
    this.anims.play('enemblack_idle', false);
    
    //  Reseteo la dirección para que tenga la dirección opuesta a la de Emma
    if(this.x > emmaX) {
      this.direction = "right"; 
    } else {
      this.direction = "left";
    }
  }

  //  Esta método permite disparar al enemigo
  attack(time) {
    //  Si el tiempo del juego es mayor que el tiempo de salida de la proxima bala se produce el disparo
    if (time > this.nextTick) {
      //  Es la frecuencia de disparo en milisegundos
      var tickFreq = 3000;
      //  El próximo dispara es la suma del tickFreq más el tiempo del juego
      this.nextTick = time + tickFreq;
      //  Obtengo las balas
      var bullet = this.bullets.get()
      if (this.direction === "left") {
        //  Dispara a la izquierda
        if (bullet) 
          bullet.create(this.x + 50, this.y - 10, true, 300);
      } else {
        //  Dispara a la derecha
        if (bullet) 
          bullet.create(this.x - 50, this.y - 10, false, 300);
      }
    } 
  }

  enemyDamage() {
    if (!this.hitDelay) {
      this.hitDelay = true;
      this.life--;
      
      if(this.life === 0) {
        //  Cuando muere el enemigo no se mueve
        this.direction = "none";
        this.anims.play('enemblack_death');
        this.scene.sound.play('enemy_black', {volume: 0.5});
        //  Se añade un evento de tiempo
        this.scene.time.addEvent({
          delay: 600,
          callback: () => {
            this.scene.registry.events.emit('update_points', this.points);
            this.scene.registry.events.emit('enemy_deaths', 1);
            this.destroy();
          }
        })
      } else {
        this.scene.sound.play('damage', {volume: 0.2});
        //  Cuando recibe daño el enemigo cambia de color
        this.tint = 0xd40000;
        //  Se añade un delay para limpiar el color del enemigo
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
  //  Método que destruye la primera bala que aparece
  destroyBullet() {
    this.bullets.getFirstAlive(true).destroy();
  }

}

export default EnemyBlack;