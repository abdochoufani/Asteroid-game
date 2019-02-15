var astroidsNumber=1;
var astroids = [];
var ASTROID_JAG=0.4;
 var ASTROID_SIZE=100
function Asteroid (x,y,radius){
    this.x=x;
    this.y=y;
    this.ASTROID_SPEED=50;
    this.velocityX=Math.random() * this.ASTROID_SPEED * (1 + 0.1 * level) /FPS *(Math.random()<0.5 ? 1 : -1);
    this.velocityY=Math.random() * this.ASTROID_SPEED * (1 + 0.1 * level) /FPS *(Math.random()<0.5 ? 1 : -1);
    this.radius=radius;
    this.offSet=[];
    this.ASTROID_VERTEX=10;
    this.vertex=Math.floor(Math.random() * (this.ASTROID_VERTEX +1) + this.ASTROID_VERTEX/2)
    this.angle=Math.random() *Math.PI *2;
    
    for (var j = 0; j < this.vertex; j++) {
        this.offSet.push(Math.random() * ASTROID_JAG * 2 + 1 - ASTROID_JAG)
    } 
    
}



Asteroid.prototype.createAstroidBelt = function(){
    astroids=[];
    for( var i=0 ;i<astroidsNumber;i++){
        do{
        var x=Math.floor(Math.random() * canvas.width);
        var y=Math.floor(Math.random() * canvas.height);
        } while(distBetweenPoints(ship.x,ship.y,x,y) < ASTROID_SIZE * 2){
        astroids.push(new Asteroid(x,y,Math.ceil( ASTROID_SIZE/ 2)));

        }
    } 
};

Asteroid.prototype.drawAstroids= function(ctx){
   for (var i=0;i<astroids.length;i++){
    ctx.strokeStyle="slategrey";
    ctx.lineWidth=ASTROID_SIZE/10;
        ctx.beginPath();
        ctx.moveTo(
            astroids[i].x + astroids[i].radius * astroids[i].offSet[0] *  Math.cos(astroids[i].angle),
            astroids[i].y + astroids[i].radius * astroids[i].offSet[0] * Math.sin(astroids[i].angle)
        );
        for(var j=0;j<astroids[i].vertex;j++) {
            ctx.lineTo(
                astroids[i].x + astroids[i].radius * astroids[i].offSet[j] * Math.cos(astroids[i].angle + j *Math.PI *2 /astroids[i].vertex),
                astroids[i].y + astroids[i].radius * astroids[i].offSet[j] * Math.sin(astroids[i].angle + j *Math.PI *2 /astroids[i].vertex)  
            );
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // if (showBounds) {
        //     ctx.strokeStyle = "lime";
        //     ctx.beginPath();
        //     ctx.arc(astroids[i].x, astroids[i].y, astroids[i].radius, 0, Math.PI * 2, false);
        //     ctx.stroke();
        // }
  }
};


Asteroid.prototype.moveAsteroid= function () {
    for(var i=0;i<astroids.length;i++){
        astroids[i].x+=astroids[i].velocityX;
        astroids[i].y+=astroids[i].velocityY;
        if (astroids[i].x < 0 - astroids[i].radius) {
            astroids[i].x = canvas.width + astroids[i].radius;
        } else if (astroids[i].x > canvas.width + astroids[i].radius) {
            astroids[i].x = 0 - astroids[i].radius
        }
        if (astroids[i].y < 0 - astroids[i].radius) {
            astroids[i].y = canvas.height + astroids[i].radius;
        } else if (astroids[i].y > canvas.height + astroids[i].radius) {
            astroids[i].y = 0 - astroids[i].radius
        }
    }
}


Asteroid.prototype.destroyAstroid= function(index) {
    //debugger
    var x = astroids[index].x;
    var y = astroids[index].y;
    var r = astroids[index].radius;
    if (r == Math.ceil(ASTROID_SIZE / 2)) { // large asteroid
        astroids.push(new Asteroid(x, y, Math.ceil(ASTROID_SIZE / 4)));
        astroids.push(new Asteroid(x, y, Math.ceil(ASTROID_SIZE / 4)));
    } else if (r == Math.ceil(ASTROID_SIZE / 4)) { // medium asteroid
        astroids.push(new Asteroid(x, y, Math.ceil(ASTROID_SIZE / 8)));
        astroids.push(new Asteroid(x, y, Math.ceil(ASTROID_SIZE / 8)));
    }
    astroids.splice(index, 1);
    if (astroids.length == 0){
        level++;
        newLevel();
    }
}








