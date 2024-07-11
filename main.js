const carCanvas=document.getElementById("carCanvas");
const carCtx=carCanvas.getContext("2d");
carCanvas.width=300;

const road=new Road(carCanvas.width/2,carCanvas.width*0.9, 3);
const car=new Car(road.getLaneCenter(1),window.innerHeight*0.7,30,50);
//const traffic=[new Car(road.getLaneCenter(1),-100,30,50)];

animate();

function animate(){
    car.update(road.borders);
    carCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-car.y+carCanvas.height*0.7);

    road.draw(carCtx);
    car.draw(carCtx);

    carCtx.restore();
    
    requestAnimationFrame(animate);
}
