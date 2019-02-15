
//declaring global variables
var FPS = 30;
var paused=false;
var canvas = document.getElementById("canvas");
var friction=0.7;
var StartingLives=4;
var ctx = canvas.getContext("2d");
var ship;
var lifeColour;
var TEXT_FADE_TIME = 2.5; 
var TEXT_SIZE = 40
var astroids = [];
var level=2, lives,text, textAlpha

 newGame(); // start new game
document.addEventListener("keydown",function(event){keyDown(event)});
document.addEventListener("keyup", function(event){keyUp(event)});


    var render=setInterval(update, 1000 / FPS);
    
// var render=setInterval(update, 1000 / FPS);  //update and rerender the canvas state
// Asteroid.prototype.createAstroidBelt();

function update() {
    var blinkOn = ship.blinkNumber % 2 == 0;
    var exploding = ship.explodeTime > 0;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Asteroid.prototype.drawAstroids(ctx);
    if(!exploding){
        ship.thrustShip(ctx,exploding,blinkOn);
        if(blinkOn){
            ship.drawShip(ctx,ship.x,ship.y,ship.angle);
        }
        ship.blinkShip();
    } 
    checkCollision(exploding);
    Laser.prototype.drawLaser();
    Asteroid.prototype.moveAsteroid();
    drawText(exploding);
};



function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};



function checkCollision(exploding){
    if (!exploding) {
        if (ship.blinkNumber == 0 && !ship.dead) {
            for (var i = 0; i < astroids.length; i++) {
                if (distBetweenPoints(ship.x, ship.y, astroids[i].x, astroids[i].y) < ship.r + astroids[i].radius) {
                    ship.explodeShip();
                    lives--;
                    break;
                }
            }
        }
    ship.rotateShip();
    ship.moveShip();
    } else {
        ship.explodeTime--;
        if (ship.explodeTime == 0) {
            if(lives==0){
                gameOver()
            } else{
            ship = new Ship();
            }
        }
    }

}


function newGame (){
    ship = new Ship();
    level=0;
    lives=StartingLives;
    newLevel();
}


function gameOver() {
    ship.dead = true;
    level=0;
    text = "Game Over";
    textAlpha = 1.0;
}


function newLevel() {
    text = "Level " + (level + 1);
    textAlpha = 1.0;
    if(astroidsNumber <10) astroidsNumber++;
    Asteroid.prototype.createAstroidBelt();
}

function drawText(exploding) {
    if (textAlpha >= 0) {
        ctx.textAlign = "center";
       // ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(255, 255, 255, " + textAlpha + ")";
        ctx.font = "small-caps " + TEXT_SIZE + "px dejavu sans mono";
        ctx.fillText(text, canvas.width / 2, canvas.height * 0.75);
        textAlpha -= (1.0 / TEXT_FADE_TIME / FPS);
    } else if (ship.dead) {
        newGame();
    }
    for (var i = 0; i < lives; i++) {
        lifeColour = exploding && i == lives - 1 ? "red" : "white";
        ship.drawShip(ctx,ship.size + i * ship.size * 1.2, ship.size, 0.5 * Math.PI, lifeColour);
    }
}


function keyDown  (event) {
    if (ship.dead) {
        return;
    }
    switch(event.keyCode){
        case 32: // space bar (allow shooting again)
        ship.shootLasers();
        case 65:
        ship.rotation= ship.TURN_VELOCITY /180 * Math.PI /FPS;
        break;
        case 87:
        ship.thrusting=true;
        break;
        case 68:
        ship.rotation= -ship.TURN_VELOCITY /180 * Math.PI /FPS;
        break;
    }
};
function keyUp (event){
    if (ship.dead) {
        return;
    }
    switch(event.keyCode){
        case 32: // space bar (allow shooting again)
        ship.canShoot = true;
        case 65:
        ship.rotation= 0
        break;
        case 87:
        ship.thrusting=false;
        break;
        case 68:
        ship.rotation= 0
        break;
    }
};
