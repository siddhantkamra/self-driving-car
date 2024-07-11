class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=2;
        this.friction=0.03;
        this.angle=0;
        this.damaged=false;

        this.sensor=new Sensor(this);
        this.controls=new Controls();
    }

    update(roadBorders){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders);
        }
        this.sensor.update(roadBorders);
    }

    #assessDamage(roadBorders){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){    //checking to see if car touches any borders
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const radius=Math.hypot(this.width, this.height)/2;
        const alpha=Math.atan2(this.width, this.height);
        points.push({x:this.x-Math.sin(this.angle-alpha)*radius, y:this.y-Math.cos(this.angle-alpha)*radius});
        points.push({x:this.x-Math.sin(this.angle+alpha)*radius, y:this.y-Math.cos(this.angle+alpha)*radius});
        points.push({x:this.x-Math.sin(Math.PI+this.angle-alpha)*radius, y:this.y-Math.cos(Math.PI+this.angle-alpha)*radius});
        points.push({x:this.x-Math.sin(Math.PI+this.angle+alpha)*radius, y:this.y-Math.cos(Math.PI+this.angle+alpha)*radius});
        return points;
    }

    #move(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }
        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.02*flip;
            }
            if(this.controls.right){
                this.angle-=0.02*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }
    

    draw(ctx){
        if(this.damaged){
            ctx.fillStyle="gray";
        }else{
            ctx.fillStyle="blue";
        }
        this.sensor.draw(ctx);
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
    }
}