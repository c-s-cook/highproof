
const waveform = document.createElement("div");
waveform.id = "waveformHeader";
document.body.appendChild(waveform);

const waveformLeft = document.createElement("div");
waveformLeft.classList.add("waveformSplit");
const waveformRight = waveformLeft.cloneNode(true);
waveform.appendChild(waveformLeft);
waveform.appendChild(waveformRight);


const wavebar = document.createElement("div");
wavebar.classList.add("wavebar");


let x = 0;
let w = 40;

// wave frequency
//      - increasing gives more waves
//      - f = 1 just tapers down to edges, not back up
let f = 1.5;

//  initial interval delay
let i = 80;

// minimum height of the bar (associated with the waveform div's y offset)
let minHeight = 30;


let waveHeight = () => {
    
    let t = Math.abs(Math.sin(Math.trunc((Math.abs(w - x*f) / w)*100)/100));

    // console.log("t^2: ", t*t);
    return t*t;
}

let addWaves = () => {
    if (x >= w){
        clearInterval(addWaves);
    } else {
        waveformLeft.insertBefore(wavebar.cloneNode(true), waveformLeft.children[0]);
        waveformRight.appendChild(wavebar.cloneNode(true));
        
        let h = minHeight 
                + (waveHeight() * (100-minHeight))
                + Math.floor(Math.random()*20);
        
        waveformLeft.firstChild.style.height = `${h}%`;
        waveformRight.lastChild.style.height = `${h}%`;
        x++;
        if (i < 3){
            i = 10;
        } else {
            i -= 8;
        }
        setTimeout(addWaves, i);
    }
}; 

setTimeout(addWaves, i);


console.log("\n \n redo \n \n");



