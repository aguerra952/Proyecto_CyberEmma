import Emma from '../Player/Emma.js';
import EnemyBlack from '../Enemies/EnemyBlack.js';
import Drone from "../Enemies/Drone.js";
import ZapperDroid from "../Enemies/ZapperDroid.js";

class Play extends Phaser.Scene {
    constructor() {
        super({key: 'Play'});
    }

    init(numberRound) {
        console.log('Se ha iniciado la escena Play');
        //  Si la número de ronda no es una no se reproduce la música
        if(numberRound === 1) {
            //  Evento emisor de música
            this.registry.events.emit('soundMusic', 'musicPlay');
        }
        //  
        this.countEnemyDeaths = 0;
    }

    create() {
        //  Establezco la imagen de fondo
        this.add.image(0,0,'background')
        .setOrigin(0);
        //  Creo el grupo donde introduciré los suelos
        this.floors = this.physics.add.staticGroup();
        //  large_floor: 1314x251 px
        this.floors.create(900, this.scale.height + 50,'large_floor');
        this.floors.getChildren()[0]
        .setScale(1.32, 1)
        .setSize(1734.48, 251);
        //  floor: 512x512 px
        this.floors.create(150, 475,'floor');
        this.floors.create(220, 230,'floor');
        this.floors.create(900, 280,'floor');
        this.floors.create(this.scale.width - 265,this.scale.height - 120,'floor');
        this.floors.create(this.scale.width - 215,this.scale.height/2 - 70,'floor');
        //  Añado un offset personalizado
        let offset = 20;
        //  Añado el tamaño a las física a los objetos creados
        this.floors.getChildren()[1]
        .setScale(0.45, 0.15)
        .setSize(230.4, 76.8 - offset);
        this.floors.getChildren()[2]
        .setScale(0.7, 0.2)
        .setSize(358.4, 102.4 - offset);
        this.floors.getChildren()[3]
        .setScale(1.2, 0.25)
        .setSize(614.4, 128 - offset);
        this.floors.getChildren()[4]
        .setScale(0.9, 0.26)
        .setSize(460.8, 133.12 - offset);
        this.floors.getChildren()[5]
        .setScale(0.7, 0.2)
        .setSize(358.4, 102.4 - offset);
        //  Actualizo el cuerpo estático de los suelos
        this.floors.refresh();
        //  Añado un offset a cada miembro del grupo para que el size disminuya en el eje Y
        var posY = 0;
        //  Bucle para añadir a cada miembro un offset
        for (let i = 0; i < 6; i++) {
            if (i === 0) {
                posY = 20;
            } else {
                posY = 30;
            }
            this.floors.getChildren()[i]
            .setOffset(0, posY);     
        }
        //  Creo el grupo donde introduciré los muros
        this.walls = this.physics.add.staticGroup();
        //  wall_end: 64x1021 px
        this.walls.create(0, 0, 'wall_end')
        .setScale(0.6)
        .setOrigin(0);

        this.walls.create(this.scale.width,this.scale.height,'wall_end')
        .setOrigin(1)
        .setScale(0.6)
        .setFlipX(true);
        //  Actualizo el cuerpo estático de los muros
        this.walls.refresh();
        //  Añado un offset al primer muro
        this.walls.getChildren()[0].setOffset(-25, 0);
        
        this.invisibleWalls = this.physics.add.staticGroup();
        //  invisible_black: 32x113 px
        //  Creo los muros invisibles con los que los enemigos chocarán
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
        //  Pongo invisibles los muros creados
        this.invisibleWalls.setVisible(false);
        //  Creo al personaje principal Emma
        this.emma = new Emma({
            scene: this,
            x: 100,
            y: 300
        });
        //  Cre un grupo para ir añadiendo a los enemigos
        this.enemies = this.physics.add.group();
        //  Creo un evento de tiempo para que cargue primero las plataformas antes que los enemigos
        this.time.addEvent({
            delay: 300,
            callback: () => {
                //  Llamo al método
                this.generateEnemies();
                //  Obtengo una muerte de enemigo aleatorio, es decir, un número
                var randomEnemyDeath = Phaser.Math.Between(2, 6);
                //  Registro un evento al morir algún enemigo
                this.registry.events.on('enemy_deaths', () => {
                    this.countEnemyDeaths++;
                    
                    if (randomEnemyDeath === this.countEnemyDeaths) {
                        //  Llamo al método
                        this.generateHeart();
                    }
                    
                    if (this.countEnemyDeaths === 7) {
                        //  Reseteo la cuenta de los enemigos que mueren
                        this.registry.events.removeAllListeners('enemy_deaths');
                        //  Añado un tiempo de espera para llamar al evento
                        this.time.addEvent({
                            delay: 350,
                            callback: () => {
                                //  Emito el evento de terminar la ronda
                                this.registry.events.emit('round_ends');
                            }
                        });
                    }
                });
                //  Colisión de Emma con las plataformas
                this.physics.add.collider(this.emma, [this.walls, this.floors]);
                //  Colisión de los enemigos con la plataforma inicial
                this.physics.add.collider(this.enemies, this.floors.getChildren()[0]);
                //  Colisiones de los enemigos con las paredes invisibles y los suelos
                //  Colisión primer enemigo
                let enemy1 = this.enemies.getChildren()[0];
                this.physics.add.collider(
                    enemy1,
                    this.floors.getChildren()[1], () => {
                        enemy1.anims.playReverse('drone_rotate');
                        enemy1.direction = "left";
                        enemy1.velocity = this.randomVelocity;
                    }
                );
                this.physics.add.collider(
                    enemy1,
                    this.invisibleWalls.getChildren()[0], () => {
                        enemy1.anims.playReverse('drone_rotate');
                        enemy1.direction = "right";
                        enemy2.velocity = this.randomVelocity;
                    }
                );
                // Colisión segundo enemigo
                let enemy2 = this.enemies.getChildren()[1];
                this.physics.add.collider(
                    enemy2,
                    this.invisibleWalls.getChildren()[0], () => {
                        enemy2.direction = "left";
                        enemy2.velocity = this.randomVelocity;
                    }
                );
                
                this.physics.add.collider(
                    enemy2,
                    this.invisibleWalls.getChildren()[1], () => {
                        enemy2.direction = "right";
                        enemy2.velocity = this.randomVelocity;
                    }
                ); 
                //  Colisión tercer enemigo
                let enemy3 = this.enemies.getChildren()[2];
                this.physics.add.collider(
                    enemy3,
                    this.invisibleWalls.getChildren()[1], () => {
                        enemy3.direction = "left";
                        enemy3.body.reset(enemy3.body.position.x + 70, enemy3.body.position.y + 10);
                        enemy3.velocity = this.randomVelocity;
                    }
                );
                
                this.physics.add.collider(
                    enemy3,
                    this.floors.getChildren()[4], () => {
                        enemy3.direction = "right";
                        enemy3.body.reset(enemy3.body.position.x, enemy3.body.position.y + 10);
                        enemy3.velocity = this.randomVelocity;
                    }
                );  
                //  Colisión cuarto enemigo
                let enemy4 = this.enemies.getChildren()[3];
                this.physics.add.collider(
                    enemy4,
                    this.walls.getChildren()[0], () => {
                        enemy4.direction = "left";
                        enemy4.velocity = this.randomVelocity;
                    }
                );
                
                this.physics.add.collider(
                    enemy4,
                    this.invisibleWalls.getChildren()[2], () => {
                        enemy4.direction = "right";
                        enemy4.velocity = this.randomVelocity;
                    }
                );
                //  Colisión quinto enemigo
                let enemy5 = this.enemies.getChildren()[4];
                this.physics.add.collider(
                    enemy5,
                    this.invisibleWalls.getChildren()[3], () => {
                        enemy5.direction = "left";
                        enemy5.body.reset(enemy5.body.position.x + 70, enemy5.body.position.y + 10);
                        enemy5.velocity = this.randomVelocity;
                    }
                );
                
                this.physics.add.collider(
                    enemy5,
                    this.invisibleWalls.getChildren()[4], () => {
                        enemy5.direction = "right";
                        enemy5.body.reset(enemy5.body.position.x, enemy5.body.position.y + 10);
                        enemy5.velocity = this.randomVelocity;
                    }
                );
                //  Colisión sexto enemigo
                let enemy6 = this.enemies.getChildren()[5];
                this.physics.add.collider(
                    enemy6,
                    this.invisibleWalls.getChildren()[5], () => {
                        enemy6.direction = "left";
                        enemy6.velocity = this.randomVelocity;
                    }
                );
                
                this.physics.add.collider(
                    enemy6,
                    this.walls.getChildren()[1], () => {
                        enemy6.direction = "right";
                        enemy6.velocity = this.randomVelocity;
                    }
                );
                //   Colisión séptimo enemigo
                let enemy7 = this.enemies.getChildren()[6];
                this.physics.add.collider(
                    enemy7,
                    this.invisibleWalls.getChildren()[6], () => {
                        enemy7.anims.playReverse('drone_rotate');
                        enemy7.direction = "left";
                        enemy7.velocity = this.randomVelocity;
                    }
                )
                
                this.physics.add.collider(
                    enemy7,
                    this.walls.getChildren()[1], () => {
                        enemy7.anims.playReverse('drone_rotate');
                        enemy7.direction = "right";
                        enemy7.velocity = this.randomVelocity;
                    }
                ) 
                //  Colisión de los enemigos con las plataformas del segundo nivel
                this.physics.add.collider(
                    this.enemies, 
                    [
                        this.floors.getChildren()[2],
                        this.floors.getChildren()[3],
                        this.floors.getChildren()[4],
                        this.floors.getChildren()[5]
                    ]
                );
                //  Colisión de daño entre Emma y los enemigos
                this.physics.add.overlap(
                    this.emma,
                    this.enemies.getChildren(), () => {
                        this.emma.emmaDamage();
                    }
                );
                //  Colisión de las balas de Emma con las paredes
                this.physics.add.overlap(
                    this.emma.bullets,
                    [this.floors, this.walls], () => {
                        this.emma.destroyBullet();
                    }
                );
                //  Colision de las balas de Emma con los enemigos
                this.physics.add.overlap(
                    this.emma.bullets,
                    this.enemies.getChildren(), 
                    (enemy) => {
                        this.emma.destroyBullet();
                        enemy.enemyDamage()
                    }
                );
                //  Creo un array para introducir los enemigos EnemBlack
                this.enemBlacks = [
                    this.enemBlack1,
                    this.enemBlack2,
                    this.enemBlack3
                ];
                //  Creo un array para introducir las balas de los enemigos EnemBlack
                this.enemBlacksBullets = [
                    this.enemBlack1.bullets, 
                    this.enemBlack2.bullets,
                    this.enemBlack3.bullets
                ];
                //  Colisión de las balas enemigas con las paredes
                this.physics.add.overlap(
                    this.enemBlacksBullets,
                    [this.floors, this.walls], () => {
                        //  Se destruyen las balas de cada enemigo
                        this.enemBlacks.forEach((enemBlack) => {
                            enemBlack.destroyBullet();
                        });
                    }
                );
                //  Colision de las balas enemigas con Emma
                this.physics.add.overlap(
                    this.enemBlacksBullets,
                    this.emma, () => {
                        this.enemBlacks.forEach((enemBlack) => {
                            enemBlack.destroyBullet();
                        });
                        this.emma.emmaDamage();
                    }
                );
                //  Creo un array para introducir los enemigos Zapper
                this.zappers = [
                    this.zapper1,
                    this.zapper2
                ];
                //  Creo un array para introducir las chispas de los enemigos Zapper
                this.zapperBullets = [
                    this.zapper1.sparks,
                    this.zapper2.sparks
                ];
                // Colisión de las las chispas con las paredes
                this.physics.add.overlap(
                    this.zapperBullets,
                    [this.floors, this.walls], () => {
                        //  Se destruyen las balas de cada enemigo
                        this.zappers.forEach((zapper) => {
                            zapper.destroySpark();
                        });
                    }
                );
                // Colisión de las chispas con Emma
                this.physics.add.overlap(
                    this.zapperBullets,
                    this.emma, () => {
                        this.zappers.forEach((zapper) => {
                            zapper.destroySpark();
                        });
                        this.emma.emmaDamage();
                    }
                );
            }
        });
    }

    update(time) {
        //  Compruebo si Emma existe
        if (this.emma) {
            //  Actualizo a Emma para que pueda moverse
            this.emma.update();   
        }
        //  Compruebo si los enemigos existen
        if (this.enemies) {
            //  Actualizo a todos los enemigos en el update de la escena
            this.enemies.getChildren().forEach((enemy) => {
                enemy.update();
            })
            //  Compruebo si el array enemBlacks existe
            if (this.enemBlacks) {
                this.enemBlacks.forEach((enemBlack) => {
                    if (enemBlack.life > 0) {
                        this.enemyAttack(time, this.emma, enemBlack);
                    }
                });
            }
            //  Compruebo si el array zappers existe
            if (this.zappers) {
                this.zappers.forEach((zapper) => {
                    if (zapper.life > 0) {
                        this.enemyAttack(time, this.emma, zapper);
                        this.registry.events.emit('update_spark');
                    }
                });
            }
        }
        //  Genero una velocidad aleatoria entre 30 y 80
        this.randomVelocity = Phaser.Math.Between(30, 80);
    }
    //  Método que permite que los enemigos ataquen
    enemyAttack(time, emma, enemy) {
        if(enemy.getData('name') === "Enemy Black") {
            //  Obtengo la distancia entre Emma y el enemigo Enemy Black
            if (Math.abs(emma.x - enemy.x) <= 300 && Math.abs(emma.y - enemy.y) <= 10) {
                enemy.stopMovement(emma.x);
                enemy.attack(time);
            }
        } 
        
        if(enemy.getData('name') === "Zapper Droid") {
            //  Variable que determina el ángulo entre Emma y el enemigo
            var angle = Math.atan2(emma.x - enemy.x, emma.y - enemy.y);
            //  Obtengo la distancia entre Emma y el enemigo Zapper
            if(Math.abs(emma.x - enemy.x) <= 300 && Math.abs(emma.y - enemy.y) <= 10) { 
                enemy.attack(time, angle);
            }
        }  
    }
    //  Método que genera a todos los enemigos
    generateEnemies() {
        //  Variables de los niveles
        var level1 = 400;
        var level2 = 300;
        var level3 = 90;
        //  Variables de los muros invisibles
        var block1 = this.invisibleWalls.getChildren()[0].x;
        var block2 = this.invisibleWalls.getChildren()[1].x;
        var block3 = this.invisibleWalls.getChildren()[2].x;
        var block4 = this.invisibleWalls.getChildren()[3].x;
        var block5 = this.invisibleWalls.getChildren()[4].x;
        var block6 = this.invisibleWalls.getChildren()[5].x;
        var block7 = this.invisibleWalls.getChildren()[6].x;
        //  Variables que se utilizarán el eje x de los enemigos
        var respawn1 = Phaser.Math.Between(350, block1 - 50);
        var respawn2 = Phaser.Math.Between(block1 + 50, block2 - 50);
        var respawn3 = Phaser.Math.Between(block2 + 100, this.floors.getChildren()[4].x - 250);
        var respawn4 = Phaser.Math.Between(this.walls.getChildren()[0].x + 100, block3 - 100);
        var respawn5 = Phaser.Math.Between(block4 + 100, block5 - 100);
        var respawn6 = Phaser.Math.Between(block6 + 100, this.walls.getChildren()[1].x - 100);
        var respawn7 = Phaser.Math.Between(block7 + 100, this.walls.getChildren()[1].x - 50);
        //  Enemigo 1
        this.drone1 = new Drone({
            physicsWorld: this.physics.world,
            scene: this,
            x: respawn1,
            y: level1
        });
        this.enemies.add(this.drone1);
        //  Enemigo 2
        this.enemBlack1 = new EnemyBlack({
            physicsWorld: this.physics.world,
            scene: this,
            x: respawn2,
            y: level1
        });
        this.enemies.add(this.enemBlack1);
        //  Enemigo 3
        this.zapper1 = new ZapperDroid({
            physicsWorld: this.physics.world,
            scene: this,
            x: respawn3,
            y: level1
        });
        this.enemies.add(this.zapper1);
        //  Enemigo 4
        this.enemBlack2 = new EnemyBlack({
            physicsWorld: this.physics.world,
            scene: this,
            x: respawn4,
            y: level3
        })
        this.enemies.add(this.enemBlack2);
        //  Enemigo 5
        this.zapper2 = new ZapperDroid({
            physicsWorld: this.physics.world,
            scene: this,
            x: respawn5,
            y: level3
        })
        this.enemies.add(this.zapper2);
        //  Enemigo 6 
        this.enemBlack3 = new EnemyBlack({
            physicsWorld: this.physics.world,
            scene: this,
            x: respawn6,
            y: level2
        });
        this.enemies.add(this.enemBlack3);
        //  Enemigo 7
        this.drone2 = new Drone({
            physicsWorld: this.physics.world,
            scene: this,
            x: respawn7,
            y: level3
        });
        this.enemies.add(this.drone2);
    }
    //  Método que genera un corazón
    generateHeart() {
        //  Obtengo la posición del corazón de manera aleatoria
        var levels = [400, 90];
        var positionX = Phaser.Math.Between(200, 1200);
        var positionY = Phaser.Utils.Array.GetRandom(levels);
        //  Creo el corazón
        this.heart = this.physics.add.image(positionX, positionY, 'heart_pixel')
        .setScale(1.8);
        //  Quito la gravedad de la imagen
        this.heart.body.allowGravity = false;
        //  Creo un efecto de movimiento para el corazón
        this.heartPumping = this.add.tween({
            targets: this.heart,
            repeatDelay: 500,
            ease: 'Bounce',
            scale: 2,
            repeat: -1,
            yoyo: true
        });  
        //  Colisión de los corazones con Emma
        this.physics.add.overlap(
            this.emma, this.heart, () => { 
                //  Emito el evento de agregar una vida
                this.registry.events.emit('add_life');
                this.heart.destroy();
            }
        );
    }
}

export default Play;