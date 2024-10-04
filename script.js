/**/

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

//Initialize canvas
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

//Player setup
let playerState = 'idle';
const dropdown = document.getElementById('animations');
/*dropdown.addEventListener('change', function(e) {
    playerState = e.target.value;
})*/
const playerImageRight = new Image();
playerImageRight.src = './sprites/shadow_dog_right.png';
const playerImageLeft = new Image();
playerImageLeft.src = './sprites/shadow_dog_left.png';
const playerSpriteWidth = 575;
const playerSpriteHeight = 523;
var playerSpriteToCharacterScale = 3;
var playerWidth = playerSpriteWidth / playerSpriteToCharacterScale;
var playerHeight = playerSpriteHeight / playerSpriteToCharacterScale;
var playerDownSpeed = 0;
var playerX = 100;
var playerY = 0;
var playerSpeed = 1;
var canWalk = true;
var gravitySpeed = 1;
var runningSpeed = 8;

//Floor initialization
var floorHeight = CANVAS_HEIGHT - 120;

//Control speed of background
var gameSpeed = 0;
const sliderValue = document.getElementById('slider');
const showGameSpeed = document.getElementById('showGameSpeed');
/*sliderValue.value = gameSpeed;*/
/*showGameSpeed.innerHTML = gameSpeed;*/
/*sliderValue.addEventListener('change', function(e) {
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = e.target.value;
});*/

//Define background images
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

//Control parallax layers
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

//Set up layer objects
const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.6);
const layer4 = new Layer(backgroundLayer4, 0.8);
const layer5 = new Layer(backgroundLayer5, 1);

const backgroundLayers = [layer1, layer2, layer3, layer4, layer5];

//Obstacle class setup
class Obstacle {
    constructor(image, width, height) {
        this.width = width;
        this.height = height;
        this.x = CANVAS_WIDTH;
        this.y = CANVAS_HEIGHT - this.height;
        this.image = image;
    }

    update() {
        this.speed = gameSpeed;
        if (this.x <= playerX + playerWidth && this.x + this.width >= playerX && playerY + playerHeight >= this.y && playerY <= this.y + this. height)
        {
            if (playerX + playerWidth >= this.x && playerY + playerHeight >= this.y && playerY <= this.y + this.height) {
                playerX = this.x - playerWidth;
            }
            if (playerX <= this.x + this.width && playerY + playerHeight >= this.y && playerY <= this.y + this.height) {
                //playerX = this.x + this.width;
            }
            if (playerY + playerHeight >= this.y && playerX <= this.x + this.width && playerX + playerWidth >= this.x) {
                playerY = this.y - playerHeight;
                //console.log('e');
                //console.log(this.y);
                //console.log(playerY);
            }
            if (playerY <= this.y + this.height  && playerX <= this.x + this.width && playerX + playerWidth >= this.x) {
                //playerY = this.y + this.height;
            }
        }
        this.x -= this.speed;
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
const blocks = new Image();
blocks.src = './sprites/black.png';
const testObstacle = new Obstacle(blocks, 100, 250);

//Animation and game speed controller
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

//Set up individual sprites
offset = 0;
function defineSpriteArea() {
    animationStates.forEach((state, index) => {
        let frames = {
            loc: [],
        }
        for (let j = 0; j < state.frames; j++) {
            let positionX = j * playerSpriteWidth;
            let positionY = index * playerSpriteHeight;
            frames.loc.push({x: positionX, y: positionY});
        }
        spriteAnimations[state.name] = frames;
    });
}
defineSpriteArea();

//Flipping player
//Note: only affects player, need another one for enemies
var facingRight = true;
var facingLeft = !facingRight;
function faceRight() {
    if (!facingRight) {
        defineSpriteArea();
        facingRight = true;
        facingLeft = false;
    }
}
function faceLeft() {
    if (!facingLeft) {
        defineSpriteArea();
        facingLeft = true;
        facingRight = false;
    }
}

//Create the function to dash in the direction the player is facing
var dashing = false;
function dash() {
    if (playerDownSpeed > 0 && !onFloor) {
        playerState = 'roll';
        gravitySpeed /= 4;
        dashing = true;
        canWalk = false;
        if (facingRight) {
            gameSpeed = 2 * runningSpeed;
        }
        else {
            gameSpeed = -2 * runningSpeed;
        }
    }
}

//Move function
function move() {
    //console.log(canWalk);
    if (canWalk) {
        if (keys && keys[87]) {
            if (onFloor) {
                playerDownSpeed -= 25;
                onFloor = false;
            }
        };
        if (keys && keys[32]) {
            if (onFloor) {
                playerDownSpeed -= 25;
                onFloor = false;
            }
        };
        if (keys && keys[65]) {
            playerState = 'run';
            playerX -= runningSpeed;
            faceLeft();
        };
        if (keys && keys[68]) {
            playerState = 'run';
            playerX += runningSpeed;
            faceRight();
        };
        if (keys && keys[17]) {
            dash();
        };
        if (playerX >= CANVAS_WIDTH - 100 - playerWidth) {
            gameSpeed += playerSpeed;
            if (gameSpeed > runningSpeed) {
                gameSpeed = runningSpeed;
                playerX = CANVAS_WIDTH - 100 - playerWidth;
            }
        };
        if (playerX <= 100) {
            gameSpeed -= playerSpeed;
            playerX = 100;
            if (gameSpeed < -runningSpeed) {
                gameSpeed = -runningSpeed;
            }
        };
    }
};

//Set up gravity
function gravity() {
    playerDownSpeed += gravitySpeed;
    if (onFloor) {
        playerDownSpeed = 0;
        if (!keys) {
            playerState = 'idle';
        }
    }
    if (!dashing) {
        if (playerDownSpeed < 0) {
            playerState = 'jump';
        }
        if (playerDownSpeed > 0) {
            playerState = 'fall';
        }
    }
    //console.log(playerDownSpeed);
    //console.log(onFloor);
    playerY += playerDownSpeed;
}

//Add input
var keys = [];
window.addEventListener('keydown', function(e) {
    keys = (keys || []);
    keys[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
    keys[e.keyCode] = false;
    playerState = 'idle';
});

//Ensure page is loaded before starting game
window.addEventListener('load', function() {
    function animate() {
        //Clear canvas so it is a clean animation
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        //Draw background layers
        backgroundLayers.forEach(layer => {
            layer.update();
            layer.draw();
        });

        //Draw obstacle
        testObstacle.update();
        testObstacle.draw();

        //Draw player
        let position = Math.floor(gameFrame / staggerFrames) % spriteAnimations[playerState].loc.length;
        let frameX = playerSpriteWidth * position;
        let frameY = spriteAnimations[playerState].loc[position].y;
        if (facingRight) {
            ctx.drawImage(playerImageRight, frameX, frameY, playerSpriteWidth, playerSpriteHeight, playerX, playerY, playerWidth, playerHeight);
        }
        if (facingLeft) {
            ctx.drawImage(playerImageLeft, playerImageLeft.width - frameX, frameY, -playerSpriteWidth, playerSpriteHeight, playerX, playerY, playerWidth, playerHeight);
        }

        if (keys.length > 0) {
            //console.log(keys);
        }

        if (!keys[65] && !keys[68]) {
            gameSpeed = 0;
                if (onFloor) {
                    playerState = 'idle';
                }
        }

        if (!keys[87] && !keys[32]) {
            if (playerDownSpeed < 5) {
                playerDownSpeed = 5;
            }
        }
        
        if (onFloor) {
            dashing = false;
            canWalk = true;
            playerstate = 'idle';
            gravitySpeed = 1;
        }

        move();
        gravity();
        colliding(playerX, playerY, playerWidth, playerHeight, 0, floorHeight, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (onFloor) {
            playerY = floorHeight - playerHeight;
        }

        //Advance frame and start loop again
        gameFrame++;
        requestAnimationFrame(animate);
    }

    animate();
});