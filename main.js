const carCanvas=document.getElementById("carCanvas");
const carCtx=carCanvas.getContext("2d");
carCanvas.width=300;

const networkCanvas=document.getElementById("networkCanvas");
const networkCtx=networkCanvas.getContext("2d");
networkCanvas.width=450;

const road=new Road(carCanvas.width/2,carCanvas.width*0.9, 3);

const N=100;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, 0.1);
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1),200,30,50,"DUMMY"),
    new Car(road.getLaneCenter(2),0,30,50,"DUMMY"),
    new Car(road.getLaneCenter(0),0,30,50,"DUMMY"),
    new Car(road.getLaneCenter(0),-200,40,60,"DUMMY"),
    new Car(road.getLaneCenter(1),-200,30,50,"DUMMY"),
    new Car(road.getLaneCenter(1),-400,50,50,"DUMMY"),
    new Car(road.getLaneCenter(2),-400,60,80,"DUMMY"),
];

animate();

function save(){
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1),window.innerHeight*0.7,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(c=>c.y==Math.min(...cars.map(c=>c.y)));   //best car is one that goes most forward

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, "blue", true);  //only draw best car as fully opaque

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    
    requestAnimationFrame(animate);
}
