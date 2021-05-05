class Drone extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, "drone");

    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.setScale(2.8);
    this.body.setSize(30, 45);
    this.body.offset.y = 10;
    this.body.setBounce(0.2);
    this.body.setImmovable(true);

    this.anims.play("drone_run");

    this.hitDelay = false;
    this.life = 3;
    this.points = 30;
    this.velocity = 55;
    this.direction = "left";
  }
  
  update() {
    if(this.direction === "left") {
      this.body.velocity.x = this.velocity;
      this.setFlipX(true);
    } else if(this.direction === "right"){
      this.body.velocity.x = -this.velocity;
      this.setFlipX(false);
    }
  }

  enemyDamage() {
    if (!this.hitDelay) {
      this.hitDelay = true;
      
      this.scene.sound.play("damage", {volume: 0.2});
      this.life--;
      
      if(this.life === 0) {
        this.body.setVelocityX(0);
        this.anims.play("drone_death");
        this.scene.time.addEvent({
          delay: 600,
          callback: () => {
            this.scene.registry.events.emit('update_points', this.points);
            this.destroy();
          }
        });
      }

      this.setTint(0xecd869);

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
  
  export default Drone;