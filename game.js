var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 1850,
    height: 950,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        reset: reset
    }
};
var score = 0;
var scoreText;
var livesText;
var game = new Phaser.Game(config);
var platforms;
var assets;
var lives = 3;
var worldWidth = config.width * 2;
function preload() {
    this.load.image('sky', 'assets/nebo.jpg');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('sign', 'assets/Sign_2.png');
    this.load.image('platform1', 'assets/1.png');
    this.load.image('platform2', 'assets/2.png');
    this.load.image('platform3', 'assets/3.png');
    this.load.image('gameover', 'assets/gameover.png');
    this.load.image('snowman', 'assets/SnowMan.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 50 }
    );
    this.load.spritesheet('enemy',
        'assets/enemy.png',
        { frameWidth: 32, frameHeight: 50 }
    );
}

function reset() {
    this.scene.start('preload');
    

}

function create() {
    // границі камери + ствоерння фону
    this.tilesprite = this.add.tileSprite(950, 500, 1920, 1080, 'sky');
    this.cameras.main.setBounds(0, 0, 1850, 950);
    
    this.reset = function() {
            location.reload();
        }
        document.getElementById('button').onclick = this.reset.bind(this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.mode = 1; // 0 = direct, 1 = physics
    this.directSpeed = 4.5;

    player = this.physics.add.sprite(100, 450, 'dude').setDepth(5);

    // скрипт камери
    this.cameras.main.startFollow(player, true);


    this.cameras.main.setZoom(1.5);

    platforms = this.physics.add.staticGroup();




    // створення платформ
    platforms.create(800, 800, 'ground');//
    platforms.create(400, 650, 'ground'); //
    platforms.create(750, 500, 'ground');
    platforms.create(1450, 600, 'ground');
    // створення асетів
    for (var x = 0; x < 9600; x = x + 400) {
        console.log(x)
        platforms.create(x, 920, 'ground').setOrigin(0, 0).refreshBody();
    }

    
    for (var x = 0; x < 9600; x = x + 400) {
        console.log("snow x: " + x)
        snowman = this.physics.add.sprite(x, 920, 'snowman').setOrigin(0, 1).refreshBody().setScale(0.5, 0.5).setDepth(Phaser.Math.Between(1, 10));
        this.physics.add.collider(snowman, platforms);
    }
    for (var x = 200; x < 9600; x = x + 800) {
        console.log("snow x: " + x)
        sign = this.physics.add.sprite(x, 920, 'sign').setOrigin(0, 1).refreshBody().setScale(0.5, 0.5).setDepth(Phaser.Math.Between(1, 10));
        this.physics.add.collider(sign, platforms);
    }

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //анімації
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    player.body.setGravityY(40)
    this.physics.add.collider(player, platforms);
    cursors = this.input.keyboard.createCursorKeys();
    // створення зірок
    stars = this.physics.add.group({
        key: 'star',
        repeat: 25,
        setXY: { x: 16, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    
    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(bombs, assets);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(stars, platforms);

    
    this.physics.add.collider(stars, assets);
    this.physics.add.overlap(player, bombs, hitBomb, null, this);
    // коли гравець торкаеться бомби
    function hitBomb(player, bomb) {
        bomb.disableBody(true, true);
        lives -= 1;
        livesText.setText('Lives: ' + lives);
        document.getElementById('lives').innerText = lives;
        if (lives == 0){
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            gameOver = true;
            
        }
        
    }

    this.physics.add.overlap(player, stars, collectStar, null, this);
    // рахунок
    function collectStar(player, star) {
        star.disableBody(true, true);

        score += 10;
        scoreText.setText('Score: ' + score);
        document.getElementById('score').innerText = score;

        var x = (player.x < 400) ? Phaser.Math.Between(400, 1820) : Phaser.Math.Between(0, 1820);
        var bomb = bombs.create(x, 16, 'bomb')

        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        if (stars.countActive(true) === 0) {
            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });



        }
    }

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    livesText = this.add.text(16, 16, 'lives: 3', { fontSize: '32px', fill: '#000' });





// рух
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-320);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(320);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}