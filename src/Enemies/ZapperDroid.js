import Spark from '../Objects/Spark.js';

class ZapperDroid extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, 'zapper_droid')                
    //  Establezco el nombre del sprite como dato
    this.setData({name: "Zapper Droid"});
    //  Añado la escena al sprite
    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    //  Propiedades del sprite
    this.setScale(3);
    this.body.setSize(20, 30);
    this.body.setBounce(0.2);
    this.setDepth(1);
    this.life = 3;
    this.points = 40;
    this.velocity = 55;
    this.hitDelay = false;
    this.direction = "left";
    this.mute = config.mute;
    //  Propiedad para controlar la próxima bala que se dispare
    this.nextTick = 0;
    //  Creo un grupo para ir creando las chispas 
    this.sparks = this.scene.physics.add.group({
      classType: Spark,
      key: 'spark',
      visible: false
    });
  }

  update() {
    if(this.direction === "left") {
      //  El enemigo se mueve hacia la derecha
      this.body.velocity.x = this.velocity;
      this.setFlipX(false);
      //  Añado un offset cuando choque con la plataforma
      this.body.setOffset(5, 15);

    } else if(this.direction === "right"){
      //  El enemigo se mueve hacia la izquierda
      this.body.velocity.x = -this.velocity;
      this.setFlipX(true);
      //  Añado un offset cuando choque con la plataforma
      this.body.setOffset(30, 15);

    } else {
      //  Si no hay ninguna dirección el enemigo se queda quieto
      this.body.velocity.x = 0;
    }
    //  Si el update está activo y el enemigo no ha muerto se reproduce la animación
    if(this.active && this.direction != "none")
      this.anims.play('zapper_run', true);

  }
  //  Este método permite disparar al enemigo
  attack(time, angle) {
    if (time > this.nextTick) {
      //  Es la frecuencia de disparo en milisegundos
      var tickFreq = 2500;
      //  El próximo dispara es la suma del tickFreq más el tiempo del juego
      this.nextTick = time + tickFreq;
      if (this.direction === "left" && angle > 0) {
        //  Obtengo las chispas que se disaparán por la izquierda
        let sparkL = this.sparks.get();
        //  Dispara a la izquierda
        if (sparkL) 
          sparkL.create(this.x, this.y + 15, true, 250);
      } 
      
      if (this.direction === "right" && angle < 0) {
        //  Obtengo las chispas que se disaparán por la derecha
        let sparkR = this.sparks.get();
        //  Dispara a la derecha
        if (sparkR) 
          sparkR.create(this.x, this.y + 15, false, 250);
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
        this.anims.play('zapper_death');
        //  Emito el evento de reproducir sonido
        this.scene.sound.play('zapper_droid', {volume: 0.3, mute: this.mute});
        //  Se añade un evento de tiempo
        this.scene.time.addEvent({
          delay: 750,
          callback: () => {
            //  Emito el evento de actualizar los puntos
            this.scene.registry.events.emit('update_points', this.points);
            //  Emito el evento para incremetar las muertes enemigas
            this.scene.registry.events.emit('enemy_deaths');
            this.destroy();
          }
        });
        
      } else {
        this.scene.sound.play('damage', {volume: 0.2, mute: this.mute});
        //  El enemigo cambia de color
        this.tint = 0xecd869;
        //  Se añade un evento de tiempo
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

  //  Método que destruye la primera chispa que aparece
  destroySpark() {
    this.sparks.getFirstAlive(true).destroy();
  }
}
    
export default ZapperDroid;