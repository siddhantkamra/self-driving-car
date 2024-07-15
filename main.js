const carCanvas=document.getElementById("carCanvas");
const carCtx=carCanvas.getContext("2d");
carCanvas.width=300;

const networkCanvas=document.getElementById("networkCanvas");
const networkCtx=networkCanvas.getContext("2d");
networkCanvas.width=500;

const road=new Road(carCanvas.width/2,carCanvas.width*0.9, 3);

document.getElementById('carCount').value = localStorage.getItem("carCount") || 1;
document.getElementById('mutationAmount').value = localStorage.getItem("mutationAmount") || '0.5';

document.getElementById('saveButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default action of the button click
    const userConfirmed = confirm("This will update the car's brain. Do you really want to do this?");
    if (userConfirmed) {
        save();
    } else {
        // Optionally handle the cancel action
        console.log("User cancelled the save action.");
    }
});

document.getElementById('discardButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default action of the button click
    const userConfirmed = confirm("This will delete the car's brain and you will have to train the car again. Do you really want to do this?");
    if (userConfirmed) {
        discard();
    } else {
        // Optionally handle the cancel action
        console.log("User cancelled the delete action.");
    }
});

const N=Number(document.getElementById('carCount').value);
const cars=generateCars(N);
let bestCar=cars[0];


if(!localStorage.getItem("beenHereBefore")){
    localStorage.setItem("beenHereBefore","true");
    localStorage.setItem("bestBrain",'{"levels":[{"inputs":[0.3220237916195907,0.04119685114213756,0,0,0,0,0],"outputs":[0,1,1,1,1,0],"biases":[0.13782453020388868,-0.05215769386122128,-0.2282166561304734,-0.22858238196743827,-0.0018476239309021605,0.16519025012968272],"weights":[[-0.2564039081722149,0.14388352392606965,0.3219530653139458,-0.01636023647212749,0.0037219825121455204,0.10908334020056593],[0.2175943683712401,0.2746856734282595,0.3329163144104135,-0.3124171521936382,-0.04271980146436272,-0.25231801215339567],[0.12836517572624953,0.14454722251046453,0.43096534020377597,0.15236057232415093,0.09909263699585863,0.17371834035588277],[0.15050221209785486,0.43545958893944525,-0.07277808986963241,0.2074491347247034,-0.2833915426362502,-0.1583768948029125],[0.447814751645508,-0.1508544916860891,0.04987202323286,-0.14809276652737338,-0.27422484227254557,-0.3336996716887431],[-0.19046925769295212,-0.30438446164926447,0.19433862569058102,-0.36990780742358675,0.2607048716028785,0.03406919120272063],[0.3860560359829789,-0.17858643666894727,-0.12382710650668555,-0.06785390488299879,-0.12582050337004652,0.18140935862439309]]},{"inputs":[0,1,1,1,1,0],"outputs":[1,0,0,0],"biases":[0.3537872434378489,-0.04051480561163685,0.18197383942135492,0.21375796120688623],"weights":[[0.2687493801316309,0.17973177375632293,-0.28245486954926396,-0.29189559291358713],[0.12483410263596248,0.09989552847170183,0.2536978066208755,0.1770760555896892],[0.350248563563865,-0.05149808603418074,-0.008564799450767567,-0.4433068352328282],[0.15050625482088134,-0.15969492041969327,0.09531831682300061,-0.23112470600735752],[0.2692202494170285,-0.13663915158479556,-0.4729898787396452,0.0758085193151539],[-0.3443561110772435,-0.40853549658040256,-0.21142546896494419,0.2848420308829671]]}]}');
}

if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, Number(document.getElementById('mutationAmount').value));
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1),200,40,70,"DUMMY"),
    new Car(road.getLaneCenter(2),0,40,80,"DUMMY"),
    new Car(road.getLaneCenter(0),0,40,70,"DUMMY"),
    new Car(road.getLaneCenter(0),-200,50,90,"DUMMY"),
    new Car(road.getLaneCenter(1),-200,60,110,"DUMMY"),
    new Car(road.getLaneCenter(1),-450,70,130,"DUMMY"),
    new Car(road.getLaneCenter(2),-450,40,70,"DUMMY"),
    new Car(road.getLaneCenter(0),-850,70,130,"DUMMY"),
    new Car(road.getLaneCenter(1),-850,40,70,"DUMMY"),
    new Car(road.getLaneCenter(2),-1050,40,80,"DUMMY"),
    new Car(road.getLaneCenter(0),-1050,60,110,"DUMMY"),
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
        cars.push(new Car(road.getLaneCenter(1),window.innerHeight*0.7,40,80,"AI"));
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
