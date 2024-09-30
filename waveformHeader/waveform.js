
// create & append the main container
const waveform = document.createElement("div");
waveform.id = "waveformHeader";
document.body.appendChild(waveform);


// create the Left and Right split boxes
const waveformLeft = document.createElement("div");
waveformLeft.classList.add("waveformSplit");
const waveformRight = waveformLeft.cloneNode(true);

waveform.appendChild(waveformLeft);
waveform.appendChild(waveformRight);


// create the initial, individual bar element
//  which will be cloned for all the others
const wavebar = document.createElement("div");
wavebar.classList.add("wavebar");


let width = window.innerWidth;

let wavebarGap = 50;
let wavebarWidth = 5;
wavebar.style.width = `${wavebarWidth}px`;

let bars = (width/2)/(wavebarGap + wavebarWidth);

let changeWaveBars = () => {
    bars = (width/2)/(wavebarGap + wavebarWidth);

    waveformLeft.style.gap = `${wavebarGap}px`;
    waveformRight.style.gap = `${wavebarGap}px`;

    waveformLeft.style.paddingRight = `${wavebarGap/2}px`;
    waveformRight.style.paddingLeft = `${wavebarGap/2}px`;

    console.log(wavebarGap, wavebarWidth);

    // waveformLeft.children.style.width = `${wavebarWidth}px`;
    for (let c=0; c < waveformLeft.children.length; c++){
        waveformLeft.children[c].style.width = `${wavebarWidth}px`;
        waveformRight.children[c].style.width = `${wavebarWidth}px`;
    }
}


let setWaveBars = () => {
    console.log("width: ", width);
    if (width < 360){
        wavebarGap = 2;
        wavebarWidth = 2;
        changeWaveBars();
    } else if (640 >= width && width >= 360) {
        wavebarGap = 3;
        wavebarWidth = 4;
        changeWaveBars();
    } else if (1280 >= width && width > 640) {
        wavebarGap = 4;
        wavebarWidth = 7;
        changeWaveBars();
    } else if (width > 1280) {
        wavebarGap = 6;
        wavebarWidth = 10;
        changeWaveBars();
    }   
};
setWaveBars();
changeWaveBars();






window.addEventListener("resize", () => {
    width = window.innerWidth;
    setWaveBars();
    bars = (width/2)/(wavebarGap + wavebarWidth);
    setTimeout(addWaves, i);
})

// wave frequency
//      - increasing gives more waves
//      - f = 1 just tapers down to edges, not back up
let f = 2.5;

//  initial interval delay
let i = 80;

// minimum height of the bar (associated with the waveform div's y offset)
let minHeight = 30;



let x = 0;
let waveHeight = () => {
    let t = Math.abs(Math.sin(Math.trunc((Math.abs(bars - x*f) / bars)*100)/100));

    // console.log("t^2: ", t*t);
    return t*t;
}

let addWaves = () => {
    if (x >= bars){
        clearInterval(addWaves);
    } else {
        waveformLeft.insertBefore(wavebar.cloneNode(true), waveformLeft.children[0]);
        waveformRight.appendChild(wavebar.cloneNode(true));
        
        let h = minHeight 
                + (waveHeight() * (80-minHeight))
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



