import BulletsGroup from "../Objects/BulletsGroup.js";

class Emma extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, "emma");

    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.setScale(0.6);
    this.body.setSize(90, 190);
    this.body.setBounce(0.15);
    this.body.setMass(200);
    this.body.setCollideWorldBounds(true);

    this.jumping = false;
    this.velocity = 260;
    this.anims.play("emma_idle");
    this.prevMov = "emma_idle";

    this.hitDelay = false;
    this.life = 4;
    //this.isFalling = this.body.y < 0;

    //  Defino las teclas que voy a utilizar
    this.keys = this.scene.input.keyboard.addKeys(
      "LEFT, RIGHT, UP, A, D, W, J"
    );
    //  Añado las balas que Emma utiliza
    this.emmaBullets = new BulletsGroup(this.scene);
  }

  update(time,delta) {
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
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.J)) {
      this.body.setVelocityX(0);
      this.body.setSize(90, 190);
      
      if (this.prevMov !== "shoot") {
        this.prevMov = "shoot";
        this.anims.play("emma_shoot");
        
        this.shootBullet();
        this.scene.sound.play("shootSound", { delay: 0.1, volume: 0.2 }); 

        // this.on("animationrepeat", () => {
        //   if (this.anims.currentAnim.key === "emma_shoot") {}
        // });
      }
    } else {
      //  Reseteo el tamaño del body
      this.body.velocity.x = 0;
      this.body.setSize(90, 190);

      if (this.prevMov !== "idle" && !this.jumping) {
        this.prevMov = "idle";
        this.anims.play("emma_idle");
      }
    }

    if (
      (Phaser.Input.Keyboard.JustDown(this.keys.UP) ||
        Phaser.Input.Keyboard.JustDown(this.keys.W)) &&
      !this.jumping
    ) {
      this.jumping = true;
      this.body.velocity.y = -830;

      if (this.prevMov !== "jump") {
        this.prevMov = "jump";
        this.anims.play("emma_jump");
      }
    } else if (this.body.blocked.down) {
      this.jumping = false;
    }
  }

  emmaDamage() {
    if (!this.hitDelay) {
      this.hitDelay = true;

      //this.scene.sound.play('');

      this.life--;
      this.scene.registry.events.emit("remove_life");

      if (this.life === 0) {
        this.alive = false;
        this.scene.registry.events.emit("game_over");
      }

      this.scene.tweens.add({
        targets: this,
        alpha: 0.5,
        duration: 250,
        repeat: 3,
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

  shootBullet() {
    this.emmaBullets.fireBullet(
      this.body.position.x + 70,
      this.body.position.y + 35,
      this.directionBullet,
      350
    );
  }
}

export default Emma;