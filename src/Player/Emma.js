import Bullets from "../Objects/Bullet.js"

class Emma extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, "emma");
    //  Añado la escena al sprite 
    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    //  Cambio las propiedades
    this.setScale(0.6);
    this.body.setSize(90, 190);
    this.body.setBounce(0.15);
    this.setDepth(2);
    this.velocity = 250;
    this.prevMov = "idle";
    this.jumping = false;
    this.hitDelay = false;
    this.alive = true;
    //  Defino las teclas que voy a utilizar
    this.keys = this.scene.input.keyboard.addKeys(
      "LEFT, RIGHT, UP, DOWN, A, D, W, S, J, SPACE"
    );
    //  Balas que utiliza Emma
    this.bullets = this.scene.physics.add.group({
      classType: Bullets,
      key: "bullet",
      visible: false
    });
    //  Emito un evento para obtener la vida de Emma
    this.scene.registry.events.emit('emma_life', this.life);
    //  Creo un evento para eliminar vidas
    this.scene.registry.events.on('remove_emma_life', (removeLife) => {
      this.life = removeLife;
    });
    //  Creo un evento para añadir vidas
    this.scene.registry.events.on('add_emma_life', (addLife) => {
      this.life = addLife;
    });

  }

  update() {
    //  Compruebo si Emma sigue con vida, si lo está se actualiza
    if (this.alive) {

      if (this.keys.LEFT.isDown || this.keys.A.isDown) {
        //  Emma se mueve hacia la izquierda
        this.body.velocity.x = -this.velocity;
        this.flipX = true;
        this.directionBullet = false;

        if (this.prevMov !== "left" && !this.jumping) {
          this.prevMov = "left";
          this.anims.play("emma_run");
        }

      } else if (this.keys.RIGHT.isDown || this.keys.D.isDown) {
        //  Emma se mueve hacia la derecha
        this.body.velocity.x = this.velocity;
        this.flipX = false;
        this.directionBullet = true;

        if (this.prevMov !== "right" && !this.jumping) {
          this.prevMov = "right";
          this.anims.play("emma_run");
        }
        
      } else if (this.keys.J.isDown) {
        //  Emma disapara
        if (this.prevMov !== "shoot") {
          this.prevMov = "shoot";
          this.anims.play("emma_shoot");
          this.body.velocity.x = 0;
          //  Variable que permite que sólo se ejecute una vez
          var ok = true;
          //  Evento que se ejecuta cuando la animación se complete
          this.on("animationcomplete", () => {
            if(ok) {
              ok = false;
              
              if (this.prevMov !== "jump") {
                //  Llamo al método
                this.shootBullet();
                //  Emito el evento para reproducir sonido
                this.scene.registry.events.emit('soundAudio', 'shootSound');
              }
              //  Emma dispara continuamente
              this.prevMov = "";
            }
          });
        }

      } else {
        //  Establezco la velocidad a 0
        this.body.velocity.x = 0;

        if (this.prevMov !== "idle" && !this.jumping) {
          this.prevMov = "idle";
          this.anims.play("emma_idle");
        }

      }

      if ( (Phaser.Input.Keyboard.JustDown(this.keys.UP) || 
        Phaser.Input.Keyboard.JustDown(this.keys.W) || 
        Phaser.Input.Keyboard.JustDown(this.keys.SPACE) )  
        && this.body.onFloor()
      ) {
        //  Emma salta
        this.jumping = true;
        this.body.velocity.y = -850;

        if (this.prevMov !== "jump") {
          this.prevMov = "jump";
          this.anims.play("emma_jump");
        }
        
      } else if (this.body.touching.down) {
        //  Evito que Emma pueda saltar infinitamente
        this.jumping = false;
      }

    } else {
      //  Si Emma no está con vida la velocidad tiene que ser nula
      this.body.velocity.x = 0;
    }
  }
  //  Método que se llama cuando Emma recibe daño
  emmaDamage() {
    //  Compruebo que Emma que no ha recibido daño
    if (!this.hitDelay) {
      this.hitDelay = true;
      //  Emito el evento para reproducir sonido
      this.scene.registry.events.emit('soundAudio', 'emma_damage');
      //  Emito el evento para eliminar vidas
      this.scene.registry.events.emit("remove_life");
      //  Compruebo si emma tiene vidas
      if (this.life === 0) {
        this.alive = false;
        //  Para las animaciones
        this.anims.stop();
        //  Establezco una textura
        this.setTexture("emma", "emma_idle_0");
        //  Para la música
        this.scene.sound.stopByKey("musicPlay");
        //  Añado un tiempo de espera para que Emma caiga en el suelo si salta
        this.scene.time.addEvent({
          delay: 800,               
          callback: () => {
            //  Reproduzco la animación
            this.anims.play("emma_death");
            //  Evento que se ejecuta cuando la animación se complete
            this.once("animationcomplete", () => {
              //  //  Emito el evento para reproducir sonido
              this.scene.registry.events.emit('soundMusic', 'gameOver');
              //  Emito el evento para iniciar la escena GameOver
              this.scene.registry.events.emit("game_over");
              //  Pauso la escena Play
              this.scene.scene.pause("Play");
            });
          }
          
        });
        
      } else {
        //  Efecto cuando Emma recibe daño
        this.scene.tweens.add({
          targets: this,
          alpha: 0.5,
          duration: 300,
          repeat: 5,
          onRepeat: () => {
            this.clearAlpha();
          },
          onComplete: () => {
            this.hitDelay = false;
            this.clearAlpha();
          }
        });

      }

    }
  }
  //  Método que permite que Emma dispare
  shootBullet() {
    //  Obtengo las balas
    var bullet = this.bullets.get();
    if(this.directionBullet) {
      //  La bala se dispara hacia la derecha
      bullet.create(
        this.body.position.x + 70, 
        this.body.position.y + 35,  
        this.directionBullet, 350
      );

    } else {
      //  La bala se dispara hacia la izquierda
      bullet.create(
        this.body.position.x - 20, 
        this.body.position.y + 35,  
        this.directionBullet, 350
      );
      
    }
  }

  destroyBullet() {
    this.bullets.getFirstAlive().destroy();
  }
}

export default Emma;