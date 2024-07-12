class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount=6;
        this.rayLength=150;
        this.raySpread=Math.PI/2;

        this.rays=[];
        this.readings=[];
    }

    update(roadBorders,traffic){
        this.#castRays();

        this.readings=[];
        for(let i=0;i<this.rayCount;i++){
            this.readings.push(this.#getReadings(this.rays[i], roadBorders, traffic));
        }

    }

    #getReadings(ray, roadBorders, traffic){
        let touches=[];
        for(let i=0;i<roadBorders.length;i++){
            const touch=getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);
            if(touch){
                touches.push(touch);
            }
        }

        for(let i=0;i<traffic.length;i++){
            const poly=traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                const touch=getIntersection(ray[0], ray[1], poly[j], poly[(j+1)%poly.length]);
                if(touch){
                    touches.push(touch);
                }
            }
        }

        if(touches.length==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset); //store all offsets we get from getIntersection function into an array
            const minOffset=Math.min(...offsets);   //find min of all offests as this is the only one that matters
            return touches.find(e=>e.offset==minOffset);   //return the touch element from touches array that has min offest
        }
    }

    #castRays(){
        this.rays=[];
        for(let i=0;i<this.rayCount;i++){
            const rayAngle=lerp(this.raySpread/2, -this.raySpread/2, this.rayCount==1?0.5:i/(this.rayCount-1)) + this.car.angle;
            const rayStart={x:this.car.x, y:this.car.y};
            const rayEnd={x:this.car.x-Math.sin(rayAngle)*this.rayLength, y:this.car.y-Math.cos(rayAngle)*this.rayLength};
            this.rays.push([rayStart,rayEnd]);
        }
    }

    draw(ctx){
        for(let i=0;i<this.rayCount;i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];  //if there is a reading then end takes reading's x and y values
            }

            ctx.beginPath();
            ctx.strokeStyle="yellow";
            ctx.lineWidth=2;
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle="black";
            ctx.lineWidth=2;
            ctx.moveTo(end.x,end.y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();
        }
    }
}