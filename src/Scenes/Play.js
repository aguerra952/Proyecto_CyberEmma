import Emma from '../Player/Emma.js';
import EnemyBlack from '../Enemies/EnemyBlack.js';
import Drone from "../Enemies/Drone.js";
import ZapperDroid from "../Enemies/ZapperDroid.js";

class Play extends Phaser.Scene {
    constructor() {
        super({key: 'Play'});
    }

    init() {
        console.log('Se ha iniciado la escena Play');
        // this.sound.play('musicPlay',{volume: 1, loop: true});
        this.scene.launch('UI');
    }

    create() {
        //  Establezco la imagen de fondo
        this.add.image(0,0,'background')
        .setOrigin(0);

        this.floors = this.physics.add.staticGroup();
        
        //  large_floor: 1314x251 px
        this.floors.create(900,this.scale.height + 50,'large_floor');
        
        this.floors.getChildren()[0]
        .setScale(1.32,1)
        .setSize(1734.48,251);
        
        //  floor: 512x512 px
        this.floors.create(140,460,'floor');
        this.floors.create(220,230,'floor');
        this.floors.create(900,280,'floor');
        this.floors.create(this.scale.width - 265,this.scale.height - 120,'floor');
        this.floors.create(this.scale.width - 215,this.scale.height/2 - 70,'floor');

        var offset = 20;

        this.floors.getChildren()[1]
        .setScale(0.4, 0.2)
        .setSize(204.8,102.4 - offset);
        this.floors.getChildren()[2]
        .setScale(0.7, 0.2)
        .setSize(358.4,102.4 - offset);
        this.floors.getChildren()[3]
        .setScale(1.2, 0.25)
        .setSize(614.4,128 - offset);
        this.floors.getChildren()[4]
        .setScale(0.9, 0.26)
        .setSize(460.8,133.12 - offset);
        this.floors.getChildren()[5]
        .setScale(0.7, 0.2)
        .setSize(358.4,102.4 - offset);

        this.floors.refresh();
        
        this.floors.getChildren()[0]
        .setOffset(0,20); 
        this.floors.getChildren()[1]
        .setOffset(0,30); 
        this.floors.getChildren()[2]
        .setOffset(0,30); 
        this.floors.getChildren()[3]
        .setOffset(0,30); 
        this.floors.getChildren()[4]
        .setOffset(0,30); 
        this.floors.getChildren()[5]
        .setOffset(0,30); 
        
        this.walls = this.physics.add.staticGroup();
        //  wall_end: 64x1021 px
        this.walls.create(0,0,'wall_end')
        .setScale(0.6)
        .setOrigin(0);

        this.walls.create(this.scale.width,this.scale.height,'wall_end')
        .setOrigin(1)
        .setScale(0.6)
        .setFlipX(true);
        
        this.walls.refresh();

        this.walls.getChildren()[0].setOffset(-25,0);
        
        this.invisibleWalls = this.physics.add.staticGroup();
        //  invible_black: 32x113 px
        this.invisibleWalls.create(
            this.floors.getChildren()[0].body.width/2.6,
            this.floors.getChildren()[0].body.y - 55,
            'invisible_wall'
        ); 

        this.invisibleWalls.create(
            this.floors.getChildren()[0].body.width/1.8,
            this.floors.getChildren()[0].body.y - 55,
            'invisible_wall'
        ); 

        this.invisibleWalls.create(
            this.floors.getChildren()[2].x*2 - 25,
            this.floors.getChildren()[2].body.y - 55,
            'invisible_wall'
        );

        this.invisibleWalls.create(
            this.floors.getChildren()[3].body.x - 15,
            this.floors.getChildren()[3].body.y - 55,
            'invisible_wall'
        );

        this.invisibleWalls.create(
            this.floors.getChildren()[3].body.x + 630,
            this.floors.getChildren()[3].body.y - 55,
            'invisible_wall'
        );

        this.invisibleWalls.create(
            this.floors.getChildren()[4].body.x - 15,
            this.floors.getChildren()[4].body.y - 55,
            'invisible_wall'
        ); 

        this.invisibleWalls.create(
            this.floors.getChildren()[5].body.x - 15,
            this.floors.getChildren()[5].body.y - 55,
            'invisible_wall'
        );  
        
        //this.invisibleWalls.setVisible(false);

        //  Personaje principal Emma
        this.emma = new Emma({
            scene: this,
            x: 100,
            y: 300
        });
        
        //  Camara sigue a Emma
        // var camera = this.cameras.main;
        // camera.startFollow(this.emma);

        //  Grupo donde se irán introduciendo los enemigos
        this.enemies = this.physics.add.group();

        this.generateEnemies();

        //  Colisión de Emma con los ítems
        this.physics.add.collider(
            this.emma, 
            [this.walls, this.floors]
        );

        //  Colisión de los enemigos con la plataforma base
        this.physics.add.collider(
            this.enemies, 
            this.floors.getChildren()[0]
        );

        //  Colisiones de los enemigos con las paredes invisibles y los suelos
        //  Colisión primer enemigo
        var enemy1 = this.enemies.getChildren()[0];
        this.physics.add.collider(
            enemy1,
            this.floors.getChildren()[1], () => {
                enemy1.anims.playReverse("drone_rotate");
                enemy1.direction = "left";
            }
        );

        this.physics.add.collider(
            enemy1,
            this.invisibleWalls.getChildren()[0], () => {
                enemy1.anims.playReverse("drone_rotate");
                enemy1.direction = "right";
            }
        );
        // Colisión segundo enemigo
        var enemy2 = this.enemies.getChildren()[1];
        this.physics.add.collider(
            enemy2,
            this.invisibleWalls.getChildren()[0], () => {
                enemy2.direction = "left";
            }
        );
    
        this.physics.add.collider(
            enemy2,
            this.invisibleWalls.getChildren()[1], () => {
                enemy2.direction = "right";
            }
        ); 
        //  Colisión tercer enemigo
        var enemy3 = this.enemies.getChildren()[2];
        this.physics.add.collider(
            enemy3,
            this.invisibleWalls.getChildren()[1], () => {
                enemy3.direction = "left";
            }
        );
    
        this.physics.add.collider(
            enemy3,
            this.floors.getChildren()[4], () => {
                enemy3.direction = "right";
            }
        );  
        // //  Colisión cuarto enemigo
        // var enemy4 = this.enemies.getChildren()[3];
        // this.physics.add.collider(
        //     enemy4,
        //     this.walls.getChildren()[0], () => {
        //         this.speedEnemy(enemy4, 62, true);
        //     }
        // );
    
        // this.physics.add.collider(
        //     enemy4,
        //     this.invisibleWalls.getChildren()[2], () => {
        //         this.speedEnemy(enemy4, 55, false);
        //     }
        // ); 
        // //  Colisión quinto enemigo
        // var enemy5 = this.enemies.getChildren()[4];
        // this.physics.add.collider(
        //     enemy5,
        //     this.invisibleWalls.getChildren()[3], () => {
        //         this.speedEnemy(enemy5, 65, true);
        //     }
        // );
    
        // this.physics.add.collider(
        //     enemy5,
        //     this.invisibleWalls.getChildren()[4], () => {
        //         this.speedEnemy(enemy5, 75, false);
        //     }
        // ); 
        // //  Colisión sexto enemigo
        // var enemy6 = this.enemies.getChildren()[5];
        // this.physics.add.collider(
        //     enemy6,
        //     this.invisibleWalls.getChildren()[5], () => {
        //         this.speedEnemy(enemy6, 64, true);
        //     }
        // );
    
        // this.physics.add.collider(
        //     enemy6,
        //     this.walls.getChildren()[1], () => {
        //         this.speedEnemy(enemy6, 45, false);
        //     }
        // ); 
        // //  Colisión séptimo enemigo
        // var enemy7 = this.enemies.getChildren()[6];
        // this.physics.add.collider(
        //     enemy7,
        //     this.invisibleWalls.getChildren()[6], () => {
        //         this.speedEnemy(enemy7, 68, true);
        //     }
        // );
    
        // this.physics.add.collider(
        //     enemy7,
        //     this.walls.getChildren()[1], () => {
        //         this.speedEnemy(enemy7, 75, false);
        //     }
        // ); 

        // //  Colisión de los enemigos con las plataformas del segundo nivel
        // this.physics.add.collider(
        //     this.enemies, 
        //     [
        //         this.floors.getChildren()[2],
        //         this.floors.getChildren()[3],
        //         this.floors.getChildren()[4],
        //         this.floors.getChildren()[5]
        //     ]
        // );

        //  Colisión de daño entre Emma y los enemigos
        this.physics.add.overlap(
            this.emma,
            [enemy1,enemy2],
            () => {
                this.emma.emmaDamage();
            }
        );

        //  Colisión de las balas con las paredes del juego
        this.physics.add.overlap(
            this.emma.emmaBullets,
            [this.walls, this.floors], () => {
                this.emma.emmaBullets.destroyBullet();
            }
        );

        //  Colision de las balas de Emma con los enemigos
        this.physics.add.overlap(
            this.emma.emmaBullets,
            [enemy1,enemy2], 
            (enemy) => {
                this.emma.emmaBullets.destroyBullet();
                enemy.enemyDamage();
            }
        );

        //  Colision de las balas de los enemigos con Emma
        var bullet = enemy2.bullets.getFirstAlive();
        this.physics.add.overlap(
            bullet,
            this.emma, 
            (bullet) => {
                bullet.destroy();
                this.emma.emmaDamage();
            }
        );

    }

    update(time, delta) {
        this.emma.update();   
        
        if(this.enemBlack1.life > 0) 
            this.enemyFire(time, this.emma);
        //  Actualizo a todos lo enemigos en el update de la escena del juego
        this.enemies.getChildren().forEach((enemy) => {
            enemy.update();
        });

    }

    enemyFire(time,emma) {
        Phaser.Actions.Call([this.enemBlack1], function (enemy) {
            if(Math.abs(enemy.x - emma.x) <= 200 && Math.abs(enemy.y - emma.y) <= 20) {
                enemy.stopMovement(emma.x);
                enemy.fire(time);
            } else {
                enemy.stop = false;
            }
        }, this);
    }

    generateEnemies() {
        var level1 = 400;
        var level2 = 350;
        var level3 = 90;
        var block1 = this.invisibleWalls.getChildren()[0].body.x;
        var block2 = this.invisibleWalls.getChildren()[1].body.x;
        var block3 = this.invisibleWalls.getChildren()[2].body.x;
        var block4 = this.invisibleWalls.getChildren()[3].body.x;
        var block5 = this.invisibleWalls.getChildren()[4].body.x;
        var block6 = this.invisibleWalls.getChildren()[5].body.x;
        var block7 = this.invisibleWalls.getChildren()[6].body.x;
        
        var respawn1 = Phaser.Math.Between(280, block1 - 100);
        var respawn2 = Phaser.Math.Between(block1 + 100, block2 - 100);
        var respawn3 = Phaser.Math.Between(block2 + 100, this.floors.getChildren()[4].body.x);
        var respawn4 = Phaser.Math.Between(this.walls.getChildren()[0].body.x + 100, block3 - 100);
        var respawn5 = Phaser.Math.Between(block4 + 100, block5 - 100);
        var respawn6 = Phaser.Math.Between(block6 + 100, this.walls.getChildren()[1].body.x - 100);
        var respawn7 = Phaser.Math.Between(block7 + 100, this.walls.getChildren()[1].body.x - 100);

        this.drone1 = new Drone({
            physicsWorld: this.physics.world,
            scene: this,
            x: respawn1,
            y: level1
        });
        this.enemies.add(this.drone1);

        this.enemBlack1 = new EnemyBlack({
            physicsWorld: this.physics.world,
            scene: this,
            x: respawn2,
            y: level1
        });
        this.enemies.add(this.enemBlack1);

        this.zapper = new ZapperDroid({
            physicsWorld: this.physics.world,
            scene: this,
            x: respawn3,
            y: level1
        });
        this.enemies.add(this.zapper);

        // this.enemBlack4 = new EnemyBlack({
        //     physicsWorld: this.physics.world,
        //     scene: this,
        //     x: respawn4,
        //     y: level3
        // });
        // this.enemies.add(this.enemBlack4);
        // this.enemBlack4.update();

        // this.enemBlack5 = new EnemyBlack({
        //     physicsWorld: this.physics.world,
        //     scene: this,
        //     x: respawn5,
        //     y: level3
        // });
        // this.enemies.add(this.enemBlack5);
        // this.enemBlack5.update();

        // this.enemBlack6 = new EnemyBlack({
        //     physicsWorld: this.physics.world,
        //     scene: this,
        //     x: respawn6,
        //     y: level2
        // });
        // this.enemies.add(this.enemBlack6);
        // this.enemBlack6.update();

        // this.enemBlack7 = new EnemyBlack({
        //     physicsWorld: this.physics.world,
        //     scene: this,
        //     x: respawn7,
        //     y: level3
        // });
        // this.enemies.add(this.enemBlack7);
        // this.enemBlack7.update();

    }

}

export default Play;