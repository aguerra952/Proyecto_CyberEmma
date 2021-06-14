import Bullets from "../Objects/Bullet.js";

class EnemyBlack extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, 'enemblack');
    //  Establezco el nombre del sprite como dato
    this.setData({name: "Enemy Black"});
    //  Añado la escena al sprite
    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    //  Propiedades del sprite
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
    //  Creo un grupo para ir creando las balas 
    this.bullets = this.scene.physics.add.group({
      classType: Bullets,
      key: 'bullet',
      visible: false
    });

  }
  
  update() {
    //  Reestablezco la velocidad en función de la dirección
    if(this.direction === "right") {
      //  El enemigo se mueve hacia la izquierda
      this.body.velocity.x = -this.velocity;
      this.setFlipX(true);
      
    } else if(this.direction === "left"){
      //  El enemigo se mueve hacia la derecha
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

  //  Este método permite disparar al enemigo
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
          bullet.create(this.x + 50, this.y - 10, true, 250);
      } else {
        //  Dispara a la derecha
        if (bullet)
          bullet.create(this.x - 50, this.y - 10, false, 250);
      }
    } 
  }

  enemyDamage() {
    if (!this.hitDelay) {
      this.hitDelay = true;
      this.life--;
      
      if(this.life === 0) {
        //  No establezco ninguna dirección
        this.direction = "none";
        this.anims.play('enemblack_death');
        this.scene.registry.events.emit('soundAudio', 'enemy_black');
        //  Se añade un evento de tiempo
        this.scene.time.addEvent({
          delay: 600,
          callback: () => {
            //  Emito el evento de actualizar los puntos
            this.scene.registry.events.emit('update_points', this.points);
            //  Emito el evento para incremetar las muertes enemigas
            this.scene.registry.events.emit('enemy_deaths');
            this.destroy();
          }
        })
      } else {
        //  Emito el evento de reproducir sonido
        this.scene.registry.events.emit('soundAudio', 'damage');
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