class ZapperDroid extends Phaser.GameObjects.Sprite {
    constructor(config) {
      super(config.scene, config.x, config.y, "zapper_droid");
  
      this.scene = config.scene;
      this.scene.add.existing(this);
      this.scene.physics.world.enable(this);
  
      this.setScale(3);
      this.body.setSize(29);
      this.body.setBounce(0.2);
      this.body.setImmovable(true);
      this.anims.play("zapper_droid_run");

      this.hitDelay = false;
      this.life = 3;
      this.points = 40;
      this.velocity = 40;
      this.direction = "left";
    }
    
    update() {
      if(this.direction === "left") {
        this.body.velocity.x = this.velocity;
        // this.body.offset.x = 15;
        this.setFlipX(false);
      } else if(this.direction === "right"){
        this.body.velocity.x = -this.velocity;
        // this.body.offset.x = 40;
        this.setFlipX(true);
      }
    }
  
    enemyDamage() {
      if (!this.hitDelay) {
        this.hitDelay = true;
        
        this.scene.sound.play("damage", {volume: 0.2});
        this.life--;
        
        if(this.life === 0) {
          this.body.setVelocityX(0);
          this.anims.play("zapper_droid_death");
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
    
    export default ZapperDroid;