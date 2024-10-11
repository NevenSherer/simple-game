const canvas = document.getElementById('gameWindow');
const ctx = canvas.getContext('2d');

var verticalSpeed = 0;
var horizontalSpeed = 0;

class Player {
    constructor(facingRight, facingLeft, spriteWidth, spriteHeight, playerSpriteToCharacterScale, downSpeed, x, y, speed, canWalk, onFloor, gravitySpeed, runningSpeed, state) {
        this.facingRight = facingRight;
        this.facingLeft = facingLeft;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;
        this.playerSpriteToCharacterScale = playerSpriteToCharacterScale;
        this.width = this.spriteWidth * playerSpriteToCharacterScale;
        this.height = this.spriteHeight * playerSpriteToCharacterScale;
        this.downSpeed = downSpeed;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.canWalk = canWalk;
        this.onFloor = onFloor;
        this.gravitySpeed = gravitySpeed;
        this.runningSpeed = runningSpeed;
        this.state = state;
    }

    update() {
        
    }

    defineSpriteArea() {

    }

    move() {
        if (this.canWalk) {

        }
    }

    faceLeft() {

    }

    faceRight() {

    }

    draw() {
        ctx.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

var keys = [];
window.addEventListener('keydown', function(e) {
    keys = (keys || []);
    keys[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
    keys[e.keyCode] = false;
    //player.state = 'idle';
});

const left = new Image();
left.src = './sprites/sprite.png'
const player = new Player(left, left, 24, 33, 1, 0, 100, 100, 1, true, 1, 8, 'idle');

class Objects {
    constructor(image, x, y, width, height, collider, background, speedModifier) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.collider = collider;
        this.background = background;
        this.verticalSpeed = verticalSpeed * speedModifier;
        this.horizontalSpeed = horizontalSpeed * speedModifier;
    }

    update() {
        this.verticalSpeed = verticalSpeed * this.speedModifier;
        this.horizontalSpeed = horizontalSpeed * this.speedModifier;
        if (this.background) {
            if (this.x <= -this.width) {
                this.x = 0;
            }
            if (this.x >= this.width) {
                this.x = 0;
            }
            if (this.y <= -this.height) {
                this.y = 0;
            }
            if (this.y >= this.height) {
                this.y = 0;
            }
        }
        else {
            if (this.x <= player.x + player.width && this.x + this.width >= player.x && player.y + player.height >= this.y && player.y <= this.y + this.height) {
                if (player.y + player.height >= this.y && player.x <= this.x + this.width && player.x + player.width >= this.x && player.downSpeed >= 0 && player.y + player.height - this.y < player.downSpeed) {
                    player.y = this.y - player.height;
                    onFloor = true;
                }
                else if (player.x + player.width >= this.x && player.y + player.height >= this.y && player.y <= this.y + this.height && player.x + player.width - this.x < horizontalSpeed) {
                    player.x = this.x - player.width;
                }
                else if (player.x <= this.x + this.width && player.y + player.height >= this.y && player.y <= this.y + this.height && player.x - (this.x + this.width) > horizontalSpeed) {
                    player.x = this.x + this.width;
                }
                else if (player.y <= this.y + this.height && player.x <= this.x + this.width && player.x + player.width >= this.x && player.downSpeed >= 0 && player.y + player.height - this.y > player.downSpeed) {
                    player.y = this.y + this.height;
                    player.downSpeed = 0;
                }
            }
        }
        this.x = this.x - horizontalSpeed;
        this.y = this.y - verticalSpeed;
    }

    draw() {
        if (this.background) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - this.width, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x, this.y + this.height, this.width, this.height);
            ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
        }
        else {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }
}

window.addEventListener('load', function() {
    function animate() {
        player.update();
        player.draw();

        requestAnimationFrame(animate);
    }

    animate();
})