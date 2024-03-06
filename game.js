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
        update: update
    }
};
var score = 0;
var scoreText;
var game = new Phaser.Game(config);
var platforms;
var assets;
function preload() {
    this.load.image('sky', 'assets/nebo.jpg');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('sign', 'assets/Sign_2.png');

    this.load.image('snowman', 'assets/SnowMan.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 50 }
    );
}

function create() {
    //this.add.image(950, 500, 'sky');
    this.tilesprite = this.add.tileSprite(950, 500, 1920, 1080, 'sky');
    this.cameras.main.setBounds(0, 0, 1850, 950);


    this.cursors = this.input.keyboard.createCursorKeys();

    this.mode = 1; // 0 = direct, 1 = physics
    this.directSpeed = 4.5;

    player = this.physics.add.sprite(100, 450, 'dude')

    this.cameras.main.startFollow(player, true);
    //scoreText.startFollow(player, [false], [0], [0], [-300], [200])
    // this.cameras.main.startFollow(this.ship, true, 0.09, 0.09);

    this.cameras.main.setZoom(1.5);

    platforms = this.physics.add.staticGroup();
    //assets = this.physics.add.staticGroup();



    //platforms.create(1000, 1000, 'ground').setScale(5).refreshBody();

    platforms.create(800, 800, 'ground');//
    platforms.create(400, 650, 'ground'); //
    platforms.create(750, 500, 'ground');
    platforms.create(1450, 600, 'ground');
    for (var x = 0; x < 9600; x = x + 400) {
        console.log(x)
        platforms.create(x, 920, 'ground').setOrigin(0, 0).refreshBody();
    }

    //
    for (var x = 0; x < 9600; x = x + 400) {
        console.log("snow x: " + x)
        snowman = this.physics.add.sprite(x, 920, 'snowman').setOrigin(0, 1).refreshBody().setScale(0.5, 0.5);
        this.physics.add.collider(snowman, platforms);
    }
    for (var x = 200; x < 9600; x = x + 800) {
        console.log("snow x: " + x)
        sign = this.physics.add.sprite(x, 920, 'sign').setOrigin(0, 1).refreshBody().setScale(0.5, 0.5);
        this.physics.add.collider(sign, platforms);
    }

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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
    function hitBomb(player, bomb) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;
    }
    this.physics.add.overlap(player, stars, collectStar, null, this);
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






}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

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