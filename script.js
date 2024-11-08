var temp;
var collision = true;
var onFloor = false;
function colliding(x, y, width, height, x2, y2, width2, height2) {
    if ((y + height < y2) || (y > y2 + height2) || (x + width < x2) || (x > x2 + width2)) {
        collision = false;
    }
    if (y + height >= y2) {
        onFloor = true;
    }
    else {
        onFloor = false;
    }
    return collision;
}

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

let playerState = 'idle';
const dropdown = document.getElementById('animations');

class Player {
    constructor(imageRight, imageLeft, spriteWidth, spriteHeight, spriteToCharacterScale, downSpeed, x, y, speed, canWalk, gravitySpeed, runningSpeed) {
        this.imageRight = new Image(),
        this.imageRight.src = imageRight,
        this.imageLeft = new Image(),
        this.imageLeft.src = imageLeft,
        this.spriteWidth = spriteWidth,
        this.spriteHeight = spriteHeight,
        this.spriteToCharacterScale = spriteToCharacterScale,
        this.width = this.spriteWidth / this.spriteToCharacterScale,
        this.height = this.spriteHeight / this.spriteToCharacterScale,
        this.downSpeed = downSpeed,
        this.x = x,
        this.y = y,
        this.speed = speed,
        this.canWalk = canWalk,
        this.gravitySpeed = gravitySpeed,
        this.runningSpeed = runningSpeed
    }
}
const player = new Player('./sprites/shadow_dog_right.png', './sprites/shadow_dog_left.png', 575, 523, 3, 0, 100, 0, 1, true, 1, 8);

class Enemy {
    constructor(imageRight, imageLeft, spriteWidth, spriteHeight, spriteToEnemyScale, affectedByGravity, x, y, speed, movementSpeed) {
        this.imageRight = new Image(),
        this.imageRight.src = imageRight,
        this.imageLeft = new Image(),
        this.imageLeft.src = imageLeft,
        this.spriteWidth = spriteWidth,
        this.spriteHeight = spriteHeight,
        this.spriteToEnemyScale = spriteToEnemyScale,
        this.width = this.spriteWidth / this.spriteToEnemyScale,
        this.height = this.spriteHeight / this.spriteToEnemyScale,
        this.affectedByGravity = affectedByGravity,
        this.downSpeed = 0,
        this.x = x,
        this.y = y,
        this.speed = speed,
        this.movementSpeed = movementSpeed
    }

    update() {

    }

    draw() {

    }
}
var enemy1 = new Enemy('./sprites/black.png', './sprites/black.png', 50, 50, 1, true, 500, 200, 0.9, 6);

var floorHeight = CANVAS_HEIGHT - 120;

var gameSpeed = 0;
const sliderValue = document.getElementById('slider');
const showGameSpeed = document.getElementById('showGameSpeed');

const backgroundLayer1 = new Image();
backgroundLayer1.src = './sprites/background/layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = './sprites/background/layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = './sprites/background/layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = './sprites/background/layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = './sprites/background/layer-5.png';

class Layer {
    constructor(image, speedModifier) {
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }
    update() {
        this.speed = gameSpeed * this.speedModifier;
        if (this.x <= -this.width) {
            this.x = 0;
        }
        if (this.x >= this.width) {
            this.x = 0;
        }
        this.x = this.x - this.speed;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x - this.width, this.y, this.width, this.height);
    }
}

const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.6);
const layer4 = new Layer(backgroundLayer4, 0.8);
const layer5 = new Layer(backgroundLayer5, 1);

const backgroundLayers = [layer1, layer2, layer3, layer4, layer5];

class Obstacle {
    constructor(image, x, y, width, height) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.image = image;
    }

    update() {
        this.speed = gameSpeed;
        if (this.x <= player.x + player.width && this.x + this.width >= player.x/* && player.y + player.height >= this.y && player.y <= this.y + this. height*/)
        {
            if (player.y + player.height >= this.y && player.x <= this.x + this.width && player.x + player.width >= this.x && player.downSpeed >= 0 && player.y + player.height - this.y < player.downSpeed) {
                player.y = this.y - player.height;
                onFloor = true;
            }
            else if (player.x + player.width >= this.x && player.y + player.height >= this.y && player.y <= this.y + this.height && player.x + player.width - this.x < 20) {
                player.x = this.x - player.width;
            }
            else if (player.x <= this.x + this.width && player.y + player.height >= this.y && player.y <= this.y + this.height && player.x - (this.x + this.width) > -20) {
                player.x = this.x + this.width;
            }
            else if (player.y <= this.y + this.height  && player.x <= this.x + this.width && player.x + player.width >= this.x && player.y - (this.y + this.height) > player.downSpeed) {
                player.y = this.y + this.height;
                player.downSpeed = 0;
            }
        }
        this.x -= this.speed;
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

var randomBlockHorizOffset = 800 + Math.floor(Math.random() * 100);
var obstacle01 = new Obstacle('./black.png', randomBlockHorizOffset, 300, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle02 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle03 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle04 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle05 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle06 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle07 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle08 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle09 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle10 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle11 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle12 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle13 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle14 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle15 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle16 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle17 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle18 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle19 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
randomBlockHorizOffset += Math.floor(Math.random() * 400) + 200;
var obstacle20 = new Obstacle('./black.png', randomBlockHorizOffset, 250, 100, 100);
obstacles = [obstacle01, obstacle02, obstacle03, obstacle04, obstacle05, obstacle06, obstacle07, obstacle08, obstacle09, obstacle10, obstacle11, obstacle12, obstacle13, obstacle14, obstacle15, obstacle16, obstacle17, obstacle18, obstacle19, obstacle20];

let gameFrame = 0;
var staggerFrames = 5;
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 9,
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'sit',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'ko',
        frames: 12,
    },
    {
        name: 'getHit',
        frames: 4,
    }
]

offset = 0;
function definePlayerSpriteArea() {
    animationStates.forEach((state, index) => {
        let frames = {
            loc: [],
        }
        for (let j = 0; j < state.frames; j++) {
            let positionX = j * player.spriteWidth;
            let positionY = index * player.spriteHeight;
            frames.loc.push({x: positionX, y: positionY});
        }
        spriteAnimations[state.name] = frames;
    });
}
definePlayerSpriteArea();

var facingRight = true;
var facingLeft = !facingRight;
function facePlayerRight() {
    if (!facingRight) {
        facingRight = true;
        facingLeft = false;
    }
}
function facePlayerLeft() {
    if (!facingLeft) {
        facingLeft = true;
        facingRight = false;
    }
}

var dashing = false;
function dash() {
    if (player.downSpeed > 0 && !onFloor) {
        playerState = 'roll';
        player.gravitySpeed /= 2;
        dashing = true;
        if (keys[67]) {
            player.canWalk = false;
        }
        if (facingRight) {
            gameSpeed = 2 * player.runningSpeed;
        }
        else {
            gameSpeed = -2 * player.runningSpeed;
        }
    }
}

function movePlayer() {
    if (!keys[67]) {
        player.canWalk = true;
    };
    if (player.canWalk) {
        if (keys && keys[90]) {
            if (onFloor) {
                player.downSpeed -= 25;
                if (player.downSpeed < -25) {
                    player.downSpeed = -25;
                }
                onFloor = false;
            }
        };
        if (keys && keys[37]) {
            playerState = 'run';
            player.x -= player.runningSpeed;
            facePlayerLeft();
        };
        if (keys && keys[39]) {
            playerState = 'run';
            player.x += player.runningSpeed;
            facePlayerRight();
        };
		if (keys[37] && keys[39]) {
			playerState = 'idle';
		};
        if (keys && keys[67]) {
            dash();
        };
        if (player.x > CANVAS_WIDTH - 200 - player.width) {
            gameSpeed += player.speed;
			player.x = CANVAS_WIDTH - 200 - player.width;
            if (gameSpeed > player.runningSpeed) {
                gameSpeed = player.runningSpeed;
            };
        }
        else if (player.x < 100) {
            gameSpeed -= player.speed;
            player.x = 100;
            if (gameSpeed < -player.runningSpeed) {
                gameSpeed = -player.runningSpeed;
            };
        }
		else {
			gameSpeed = 0;
		};
        if (gameSpeed > 25) {
            gameSpeed = 25;
        }
    }
};

function playerGravity() {
    if (onFloor) {
        player.downSpeed = 0;
        if (!keys) {
            playerState = 'idle';
        }
    }
    if (!dashing) {
        if (player.downSpeed < 0) {
            playerState = 'jump';
        }
        if (player.downSpeed > 0) {
            playerState = 'fall';
        }
    }
    player.y += player.downSpeed;
    player.downSpeed += player.gravitySpeed;
}

var keys = [];
window.addEventListener('keydown', function(e) {
    keys = (keys || []);
    keys[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
    keys[e.keyCode] = false;
    playerState = 'idle';
});

window.addEventListener('load', function() {
    function animate() {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        backgroundLayers.forEach(layer => {
            layer.update();
            layer.draw();
        });

        obstacles.forEach(obstacle => {
            obstacle.update();
            obstacle.draw();
        });

        let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length;
        let frameX = player.spriteWidth * position;
        let frameY = spriteAnimations[playerState].loc[position].y;
        if (facingRight) {
            ctx.drawImage(player.imageRight, frameX, frameY, player.spriteWidth, player.spriteHeight, player.x, player.y, player.width, player.height);
        }
        if (facingLeft) {
            ctx.drawImage(player.imageLeft, player.imageLeft.width - frameX, frameY, -player.spriteWidth, player.spriteHeight, player.x, player.y, player.width, player.height);
        }

        if (!keys[37] && !keys[39]) {
            gameSpeed = 0;
                if (onFloor) {
                    playerState = 'idle';
                }
        }

        if (!keys[90] && !keys[67]) {
            if (player.downSpeed < 5) {
                player.downSpeed = 5;
            }
        }
        
        if (onFloor) {
            dashing = false;
            player.canWalk = true;
            playerstate = 'idle';
            player.gravitySpeed = 1;
        }

        movePlayer();
        playerGravity();
        colliding(player.x, player.y, player.width, player.height, 0, floorHeight, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (onFloor) {
            player.y = floorHeight - player.height;
        }

        gameFrame++;
        requestAnimationFrame(animate);
    }

    animate();
});