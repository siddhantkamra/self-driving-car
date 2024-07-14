const carCanvas=document.getElementById("carCanvas");
const carCtx=carCanvas.getContext("2d");
carCanvas.width=300;

const networkCanvas=document.getElementById("networkCanvas");
const networkCtx=networkCanvas.getContext("2d");
networkCanvas.width=350;

const road=new Road(carCanvas.width/2,carCanvas.width*0.9, 3);
const car=new Car(road.getLaneCenter(1),window.innerHeight*0.7,30,50,"AI");
const traffic=[new Car(road.getLaneCenter(1),200,30,50,"DUMMY")];

animate();

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    car.update(road.borders,traffic);

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-car.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx, "red");
    }
    car.draw(carCtx, "blue");

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx, car.brain);
    
    requestAnimationFrame(animate);
}
