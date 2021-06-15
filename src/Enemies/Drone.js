class Drone extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, "drone");
    //  Establezco el nombre del sprite como dato
    this.setData({name: "Drone"});
    //  Añado la escena al sprite
    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    //  Propiedades del sprite
    this.setScale(2.8);
    this.body.setSize(30, 45);
    this.body.offset.y = 10;
    this.body.setBounce(0.2);
    this.setDepth(1);
    this.life = 3;
    this.points = 20;
    this.velocity = 55;
    this.hitDelay = false;
    this.direction = "right";
    this.mute = config.mute;
  }
  
  update() {
    if(this.direction === "right") {
      //  El enemigo se desplaza hacia la izquierda
      this.body.velocity.x = -this.velocity;
      this.setFlipX(false);

    } else if(this.direction === "left"){
      //  El enemigo se desplaza hacia la derecha
      this.body.velocity.x = this.velocity;
      this.setFlipX(true);

    } else {
      //  El enemigo se detiene
      this.body.velocity.x = 0;
    }
  }
  //  Método que se ejecuta cuando el enemigo recibe daño
  enemyDamage() {
    //  Compruebo que el enemigo no ha recibido daño
    if (!this.hitDelay) {
      this.hitDelay = true;
      this.life--;
      
      if(this.life === 0) {
        //  No establezco ninguna dirección
        this.direction = "none";
        this.anims.play("drone_death");
        //  Emito el evento de reproducir sonido
        this.scene.sound.play('explosion', {volume: 0.2, mute: this.mute});
        // this.scene.registry.events.emit('soundAudio', 'explosion');
        
        this.scene.time.addEvent({
          delay: 800,
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
        this.scene.sound.play('damage', {volume: 0.2, mute: this.mute});
        //  Cambio el color
        this.tint = 0xecd869;

        this.scene.time.addEvent({
          delay: 200,
          callback: () => {
            this.hitDelay = false;
            this.clearTint();
          }
        });
      }
    }
     
  }
  
}

export default Drone;