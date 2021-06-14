class Drone extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, "drone");

    this.setData({name: "Drone"});
    this.scene = config.scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);

    this.setScale(2.8);
    this.body.setSize(30, 45);
    this.body.offset.y = 10;
    this.body.setBounce(0.2);
    this.setDepth(1);

    this.anims.play("drone_idle");

    this.hitDelay = false;
    this.life = 3;
    this.points = 20;
    this.velocity = 55;
    this.direction = "right";
  }
  
  update() {
    if(this.direction === "right") {
      this.body.velocity.x = -this.velocity;
      this.setFlipX(false);
    } else if(this.direction === "left"){
      this.body.velocity.x = this.velocity;
      this.setFlipX(true);
    } else {
      this.body.velocity.x = 0;
    }
  }

  enemyDamage() {
    if (!this.hitDelay) {
      this.hitDelay = true;
      this.life--;
      
      if(this.life === 0) {
        this.direction = "none";
        this.anims.play("drone_death");
        // this.scene.sound.play('explosion', {volume: 0.2});
        this.scene.registry.events.emit('soundAudio', 'explosion');
        this.scene.time.addEvent({
          delay: 800,
          callback: () => {
            this.scene.registry.events.emit('update_points', this.points);
            this.scene.registry.events.emit('enemy_deaths');
            this.destroy();
          }
        })
      } else {
        // this.scene.sound.play("damage", {volume: 0.2});
        this.scene.registry.events.emit('soundAudio', 'damage');
        
        this.tint = 0xecd869;
        this.scene.time.addEvent({
          delay: 200,
          callback: () => {
            this.hitDelay = false;
            this.clearTint();
          }
        })
      }

    }
     
  }
  
}

export default Drone;