class Visualizer{
    static drawNetwork(ctx, network){
        const margin=50;
        const left=margin;
        const top=margin;
        const width=ctx.canvas.width-2*margin;
        const height=ctx.canvas.height-2*margin;

        const levelHeight=height/network.levels.length;
        for(let i=network.levels.length-1; i>=0; i--){   //draw all the levels
            const levelTop=top + lerp(height-levelHeight, 0, network.levels.length==1?0.5:i/(network.levels.length-1));
            ctx.setLineDash([7,3]);
            Visualizer.drawLevel(ctx, network.levels[i], left, levelTop, width, levelHeight, i==network.levels.length-1?['🠉','🠈', '🠊', '🠋']:[]);
        }

    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels){
        const right=left+width;
        const bottom=top+height;
        const nodeRadius=14;
        //const nodePadding=10;
        const {inputs,outputs,weights,biases}=level;

        for(let i=0;i<inputs.length;i++){    //draw lines between input and output nodes
            for(let j=0;j<outputs.length;j++){
                ctx.beginPath();
                ctx.moveTo(Visualizer.#getNodeX(inputs,i,left,right), bottom);
                ctx.lineTo(Visualizer.#getNodeX(outputs,j,left,right), top);
                ctx.lineWidth=2;
                ctx.strokeStyle=getRGBA(weights[i][j]);  //color line acc. to weight value
                ctx.stroke();
            }
        }

        for(let i=0;i<inputs.length;i++){   //draw input nodes
            const x=Visualizer.#getNodeX(inputs,i,left,right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius*1.8, 0, 2*Math.PI);
            ctx.fillStyle="black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, 2*Math.PI);
            ctx.fillStyle=getRGBA(inputs[i]);
            ctx.fill();
        }

        for(let i=0;i<outputs.length;i++){   //draw output nodes
            const x=Visualizer.#getNodeX(outputs,i,left,right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius*1.8, 0, 2*Math.PI);
            ctx.fillStyle="black";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, 2*Math.PI);
            ctx.fillStyle=getRGBA(outputs[i]);
            ctx.fill();

            ctx.beginPath();  //draw biases for output nodes as circle
            ctx.lineWidth=2;
            ctx.arc(x, top, nodeRadius*1.4, 0, Math.PI*2);
            ctx.strokeStyle=getRGBA(biases[i]);
            ctx.setLineDash([4,3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if(outputLabels[i]){   //draw arrows
                ctx.beginPath();
                ctx.fillStyle="black";
                ctx.textAlign="center";
                ctx.textBaseline="middle";
                ctx.strokeStyle="white";
                ctx.font=(nodeRadius*2)+"px Arial";
                ctx.fillText(outputLabels[i], x, top+nodeRadius*0.1);
                ctx.lineWidth=0.5;
                ctx.strokeText(outputLabels[i], x, top+nodeRadius*0.1);
            }
        }

    }

    static #getNodeX(nodes,index,left,right){
        return lerp(left, right, nodes.length==1?0.5:index/(nodes.length-1));
    }
}