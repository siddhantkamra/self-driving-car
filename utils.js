function lerp(a,b,t){
    return a + (b-a)*t;
}

function getIntersection(A, B, C, D){
    const tTop=(D.x-C.x)*(A.y-C.y) - (D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x) - (C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x) - (D.x-C.x)*(B.y-A.y);

    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {x:lerp(A.x,B.x,t), y:lerp(A.y,B.y,t), offset:t};
        }
    }

    return null;
}

function polysIntersect(poly1, poly2){
    for(let i=0; i<poly1.length; i++){
        for(let j=0; j<poly2.length; j++){
            const touch=getIntersection(poly1[i], poly1[(i+1)%poly1.length], poly2[j], poly2[(j+1)%poly2.length]);
            if(touch){
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value){
    const alpha=Math.abs(value);  //aplha signifies transparency acc. to value
    const R=value<0?0:255;  //positive values have yellow color (equal red and green)
    const G=R;
    const B=value>0?0:255;  //negative values have blue color
    return "rgba("+R+","+G+","+B+","+alpha+")";
}

function getImgSrc(controlType, width, height){
    if(controlType=="AI" || controlType=="KEYS"){
        return "main-car.png";
    }
    if(width==70 && height==130){
        return "biggest-car.png";
    }
    if(width==40 && height==70){
        return "car.png";
    }
    if(width==40 && height==80){   
        return "car2.png";
    }
    if(width==60 && height==110){
        return "car3.png";
    }
    if(width==50 && height==90){
        return "car2.png";
    }
}