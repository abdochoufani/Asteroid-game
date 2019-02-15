var MAX_LASER=10;
var laserSpeed=500;
var LASER_EXPLODE_duration=0.1;
var laserDistance=0.6;
function Laser(x,y,velocityX,velocityY){
    this.x=x;
    this.y=y;
    this.velocityX=velocityX;
    this.velocityY=velocityY;
    this.distance=0;
    this.explodeTime=0;
}


Laser.prototype.drawLaser= function () {
    for (var i = 0; i < ship.lasers.length; i++) {
        if (ship.lasers[i].explodeTime == 0) {
            ctx.fillStyle = "salmon";
            ctx.beginPath();
            ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.size / 15, 0, Math.PI * 2, false);
            ctx.fill();
        } else {
            ctx.fillStyle = "orangered";
            ctx.beginPath();
            ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.75, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "salmon";
            ctx.beginPath();
            ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.5, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "pink";
            ctx.beginPath();
            ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.r * 0.25, 0, Math.PI * 2, false);
            ctx.fill();
        }
    } 
    this.moveLaser();
    this.checkLaserCollision();
}


Laser.prototype.checkLaserCollision=function(){
    for (var i = astroids.length - 1; i >= 0; i--) {
        ax = astroids[i].x;
        ay = astroids[i].y;
        ar = astroids[i].radius;
        for (var j = ship.lasers.length - 1; j >= 0; j--) {
            lx = ship.lasers[j].x;
            ly = ship.lasers[j].y;
            if (ship.lasers[j].explodeTime == 0 && distBetweenPoints(ax, ay, lx, ly) < ar) {
                Asteroid.prototype.destroyAstroid(i);
                ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_duration * FPS);
                break;
            }
        }
    }
}


Laser.prototype.moveLaser=function() {
    for (var i = ship.lasers.length - 1; i >= 0; i--) {
        if (ship.lasers[i].distance > laserDistance * canvas.width) {
            ship.lasers.splice(i, 1);
            continue;
        }
        if (ship.lasers[i].explodeTime > 0) {
            ship.lasers[i].explodeTime--;
            if (ship.lasers[i].explodeTime == 0) {
                ship.lasers.splice(i, 1);
                continue;
            }
        } else {
            ship.lasers[i].x += ship.lasers[i].velocityX;
            ship.lasers[i].y += ship.lasers[i].velocityY;
            ship.lasers[i].distance += Math.sqrt(Math.pow(ship.lasers[i].velocityX, 2) + Math.pow(ship.lasers[i].velocityY, 2));
        }    
   
    }
} 