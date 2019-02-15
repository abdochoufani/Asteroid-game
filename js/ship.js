var showBounds= true;

function Ship(){
    var that=this
    this.x=canvas.width/2;
    this.y=canvas.height/2;
    this.size=30;
    this.dead=false;
    this.r=this.size/2;
    this.angle=90/180 *Math.PI;
    this.rotation=0;
    this.TURN_VELOCITY = 360;
    this.thrusting=false;
    this.lasers=[];
    this.canShoot=true;
    this.THRUST_SHIP=5;
    this.blinkDuration=0.1;
    this.explosionDuration=0.3;
    this.invisibility=3;
    this.explodeTime=0;
    this.blinkNumber=Math.ceil(this.invisibility/this.blinkDuration);
    this.blinkTime=Math.ceil(this.blinkDuration * FPS);
    this.thrust={
        x:0,
        y:0
    };
    this.explodeShip= function(){
        ship.explodeTime = Math.ceil(ship.explosionDuration * FPS);
        ship.explodeShipEffect();
    }

    this.drawShip=function(ctx,x,y,angle,colour="white"){
        ctx.strokeStyle=colour;
        ctx.lineWidth = that.size/20;
        ctx.beginPath();
        ctx.moveTo(
            x + 4/3 *that.r * Math.cos(angle),
            y - 4/3 * that.r * Math.sin(angle)
            );
        ctx.lineTo(
            x - that.r * (2/3 * Math.cos(angle) + Math.sin(angle)),
            y + that.r * (2/3 * Math.sin(angle) - Math.cos(angle))
            );
        ctx.lineTo(
            x - that.r * (2/3 * Math.cos(angle) - Math.sin(angle)),
            y + that.r * (2/3 * Math.sin(angle) + Math.cos(angle))
            )
        ctx.closePath();
        ctx.stroke();

        if (showBounds) {
            ctx.strokeStyle = "lime";
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
            ctx.stroke();
        }

    }
}


Ship.prototype = {
    keyDown : (event) =>{
        if (ship.dead) {
            return;
        }
        switch(event.keyCode){
            case 13:
            paused=!paused
            break;
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
    },
    keyUp : (event)=>{
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
    },

    rotateShip : function(){
        this.angle += this.rotation;
    },

    thrustShip :function(ctx,exploding,blinkOn){
        if(this.thrusting){
          this.thrust.x+=this.THRUST_SHIP * Math.cos(this.angle)/FPS; 
          this.thrust.y-=this.THRUST_SHIP * Math.sin(this.angle)/FPS; 
          if(!exploding && blinkOn){
          ctx.fillStyle = "red";
          ctx.strokeStyle = "yellow";
          ctx.lineWidth = ship.size / 10;
          ctx.beginPath();
          ctx.moveTo( 
              ship.x - ship.rotation * (2 / 3 * Math.cos(ship.angle) + 0.5 * Math.sin(ship.angle)),
              ship.y + ship.rotation * (2 / 3 * Math.sin(ship.angle) - 0.5 * Math.cos(ship.angle))
          );
          ctx.lineTo(
              ship.x - ship.rotation * 5 / 3 * Math.cos(ship.angle),
              ship.y + ship.rotation * 5 / 3 * Math.sin(ship.angle)
          );
          ctx.lineTo( 
              ship.x - ship.rotation * (2 / 3 * Math.cos(ship.angle) - 0.5 * Math.sin(ship.angle)),
              ship.y + ship.rotation * (2 / 3 * Math.sin(ship.angle) + 0.5 * Math.cos(ship.angle))
          );
          ctx.closePath();
          ctx.stroke();
          }
        }else {
            this.thrust.x -= friction * this.thrust.x / FPS;
            this.thrust.y -= friction * this.thrust.y / FPS;
        }
    },
  
    moveShip :function(){
        this.x+=this.thrust.x;
        this.y+=this.thrust.y;
        if (this.x < 0 - this.rotation) {
            this.x = canvas.width + this.rotation;
            } else if (this.x > canvas.width + this.rotation) {
                this.x = 0 - this.rotation;
            }
            if (this.y < 0 - this.rotation) {
                this.y = canvas.height + this.rotation;
            } else if (this.y > canvas.height + this.rotation) {
                this.y = 0 - this.rotation;
        }
    },

    blinkShip : ()=> {
        if (ship.blinkNumber > 0) {
            // reduce the blink time
            ship.blinkTime--;

            // reduce the blink num
            if (ship.blinkTime == 0) {
                ship.blinkTime = Math.ceil(ship.blinkDuration * FPS);
                ship.blinkNumber--;
            }
        }
    },

    explodeShipEffect: ()=> {
        ctx.fillStyle = "darkred";
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "orange";
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false);
            ctx.fill();
    },


    shootLasers: function(){
        if (ship.canShoot && ship.lasers.length < MAX_LASER) {
            ship.lasers.push(new Laser(ship.x + 4 / 3 * ship.r * Math.cos(ship.angle),
            ship.y - 4 / 3 * ship.r * Math.sin(ship.angle),
            laserSpeed * Math.cos(ship.angle) / FPS,
            -laserSpeed * Math.sin(ship.angle) / FPS
            ));
        }
        ship.canShoot = false;
    }


    
}