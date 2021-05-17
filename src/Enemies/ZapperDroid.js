import Spark from '../Objects/Spark.js';

class ZapperDroid extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, 'zapper_droid')                

    this.setData({name: "Zapper Droid"});
    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.setScale(3);
    this.body.setSize(20, 30);
    this.body.setBounce(0.2);

    this.life = 3;
    this.points = 40;
    this.velocity = 55;
    this.hitDelay = false;
    this.direction = "left";

    this.nextTick = 0;
    this.sparks = this.scene.physics.add.group({
      classType: Spark,
      key: 'spark'
    });
  }

  update() {
    if(this.direction === "left") {
      this.body.velocity.x = this.velocity;
      this.setFlipX(false);
      this.body.setOffset(5, 11);
    } else if(this.direction === "right"){
      this.body.velocity.x = -this.velocity;
      this.setFlipX(true);
      this.body.setOffset(30, 11);
    } else {
      this.body.velocity.x = 0;
    }

    if(this.active && this.direction != "none") 
      this.anims.play('zapper_run', true);

  }

  //  Cambio la dirección para que tenga la dirección opuesta a la de Emma
  changeDirection(emmaX) {
    if(this.x > emmaX) {
      this.direction = "right"; 
    } else {
      this.direction = "left";
    }
  }

  attack(time) {
    if (time > this.nextTick) {
      //  Es la frecuencia de disparo en milisegundos
      var tickFreq = 2500;
      //  El próximo dispara es la suma del tickFreq más el tiempo del juego
      this.nextTick = time + tickFreq;
      //  Obtengo las balas
      var spark = this.sparks.get();
      if (this.direction === "left") {
        //  Dispara a la izquierda
        if(spark && this.life > 0)
          spark.create(this.x, this.y + 15, true, 250);
      } else {
        //  Dispara a la derecha
        if(spark && this.life > 0)
          spark.create(this.x, this.y + 15, false, 250);
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
        this.anims.play('zapper_death');
        this.scene.sound.play('zapper_droid', {volume: 1});
        //  Se añade un evento de tiempo
        this.scene.time.addEvent({
          delay: 750,
          callback: () => {
            this.scene.registry.events.emit('update_points', this.points);
            this.destroy();
          }
        });
      } else {
        this.scene.sound.play('damage', {volume: 0.2});
        //  Cuando recibe daño el enemigo cambia de color
        this.tint = 0xecd869;
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

  //  Método que destruye la primera chispa que aparece
  destroySpark() {
    this.sparks.getFirstAlive(true).destroy();
  }
}
    
export default ZapperDroid;