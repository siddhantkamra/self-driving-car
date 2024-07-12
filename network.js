class NeuralNetwork{
    constructor(neuronCounts){
        this.levels=[];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(neuronCounts[i],neuronCounts[i+1]));  //give input and output counts to the levels
        }
    }

    static feedForward(givenInputs, network){
        let outputs=Level.feedForward(givenInputs, network.levels[0]);  //output of first level calculated using given inouts
        for(let i=1;i<network.levels.length;i++){
            outputs=Level.feedForward(outputs, network.levels[i]);  //output of each level calculated using outputs of previous levels as inputs
        }
        return outputs;  //output from last level
    }

}



class Level{
    constructor(inputCount, outputCount){
        this.inputs=new Array(inputCount);
        this.outputs=new Array(outputCount);
        this.biases=new Array(outputCount);
        this.weights=[];

        for(let i=0;i<inputCount;i++){
            this.weights[i]=new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level){
        for(let i=0;i<level.inputs.length;i++){
            for(let j=0;j<level.outputs.length;j++){
                level.weights[i][j]=Math.random()*2-1;  //weights initialised to random vallues between 1 and -1
            }
        }

        for(let i=0;i<level.biases.length;i++){
            level.biases[i]=Math.random()*2-1;  //biases initialised to random
        }
    }

    static feedForward(givenInputs, level){
        for(let i=0;i<level.inputs.length;i++){
            level.inputs[i]=givenInputs[i];   //take inputs from previous level
        }

        for(let i=0;i<level.outputs.length;i++){
            let sum=0;
            for(let j=0;j<level.inputs.length;j++){
                sum+=level.inputs[j]*level.weights[j][i];
            }
            //level.outputs[i]=sum+level.biases[i];   we are not using this equation as our network is simple
            if(sum>level.biases[i]){    //turn the output neurons on or off acc. to bias
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            }
        }

        return level.outputs;
    }
}