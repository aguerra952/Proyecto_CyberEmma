import Bullets from "../Objects/Bullet.js"

class Emma extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, "emma");

    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.setScale(0.6);
    this.body.setSize(90, 190);
    this.body.setBounce(0.15);
    this.setDepth(2);

    this.velocity = 250;
    this.prevMov = "idle";
    this.jumping = false;
    this.hitDelay = false;
    this.life = 4;
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

    this.scene.registry.events.emit('emma_life', this.life);

    this.scene.registry.events.on('remove_emma_life', (removeLife) => {
      this.life = removeLife;
    });

    this.scene.registry.events.on('add_emma_life', (addLife) => {
      this.life = addLife;
    });

    // this.scene.registry.events.on('soundAudio', (muteFX) => {
    //   this.muteFX = muteFX;
    // });

  }

  update() {
    //  Compruebo si Emma sigue con vida, si lo está se actualiza
    if (this.alive) {

      if (this.keys.LEFT.isDown || this.keys.A.isDown) {
        this.body.velocity.x = -this.velocity;
        this.flipX = true;
        this.directionBullet = false;

        if (this.prevMov !== "left" && !this.jumping) {
          this.prevMov = "left";
          this.anims.play("emma_run");
        }
      } else if (this.keys.RIGHT.isDown || this.keys.D.isDown) {
        this.body.velocity.x = this.velocity;
        this.flipX = false;
        this.directionBullet = true;

        if (this.prevMov !== "right" && !this.jumping) {
          this.prevMov = "right";
          this.anims.play("emma_run");
        }
      } else if (this.keys.J.isDown) {
        if (this.prevMov !== "shoot") {
          this.prevMov = "shoot";
          this.anims.play("emma_shoot");
          this.body.velocity.x = 0;
          var ok = true;
          
          this.on("animationcomplete", () => {
            if(ok) {
              ok = false;
              
              if (this.prevMov !== "jump") {
                this.shootBullet();
                this.scene.registry.events.emit('soundAudio', 'shootSound');
                // this.scene.sound.play("shootSound", {volume: 0.2, mute: this.muteFX});
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
        this.jumping = true;
        this.body.velocity.y = -850;

        if (this.prevMov !== "jump") {
          this.prevMov = "jump";
          this.anims.play("emma_jump");
        }
      } else if (this.body.touching.down) {
        this.jumping = false;
      }

    } else {
      this.body.velocity.x = 0;
    }
  }

  emmaDamage() {
    if (!this.hitDelay) {
      this.hitDelay = true;

      // this.scene.sound.play("emma_damage", {volume: 0.2});
      this.scene.registry.events.emit('soundAudio', 'emma_damage');
      this.scene.registry.events.emit("remove_life");

      if (this.life === 0) {
        this.alive = false;
        this.anims.stop();
        this.setTexture("emma", "emma_idle_0");
        this.scene.sound.stopByKey("musicPlay");
        
        this.scene.time.addEvent({
          delay: 800,               
          callback: () => {
            this.anims.play("emma_death");
            
            this.once("animationcomplete", () => {
              // this.scene.sound.play("gameOver", {volume: 0.4});
              this.scene.registry.events.emit('soundMusic', 'gameOver');
              this.scene.registry.events.emit("game_over");
              this.scene.scene.pause("Play");
            })
          }
          
        });
        
      } else {
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

  shootBullet() {
    var bullet = this.bullets.get();
    if(this.directionBullet) {
      bullet.create(
        this.body.position.x + 70, 
        this.body.position.y + 35,  
        this.directionBullet, 350);
    } else {
      bullet.create(
        this.body.position.x - 20, 
        this.body.position.y + 35,  
        this.directionBullet, 350);
    }
  }

  destroyBullet() {
    this.bullets.getFirstAlive().destroy();
  }
}

export default Emma;