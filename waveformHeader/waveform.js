//  new comment for rebase test

// append css file
let head = document.getElementsByTagName('head')[0];
let css = document.createElement('link');
css.rel = 'stylesheet';
css.type = 'text/css';
css.href = './waveform.css';
head.appendChild(css);


// create & append the main container
const waveform = document.createElement("div");
waveform.id = "waveformHeader";
document.body.appendChild(waveform);

// create & append white gradient bg
const waveformGradientBG = document.createElement("div");
waveformGradientBG.id = "waveformGradientBG";
document.body.appendChild(waveformGradientBG);


// create the Left and Right split boxes
const waveformLeft = document.createElement("div");
waveformLeft.classList.add("waveformSplit");
waveform.appendChild(waveformLeft);


// create the initial, individual bar element
//  which will be cloned for all the others
const wavebar = document.createElement("div");
wavebar.classList.add("wavebar");


let width = window.innerWidth;


let wavebarGap;
let wavebarWidth;

let setWaveBars = () => {
    if (width < 360){
        wavebarGap = 5;
        wavebarWidth = 8;
        changeWaveBars();
    } else if (640 >= width && width >= 360) {
        wavebarGap = 7;
        wavebarWidth = 8;
        changeWaveBars();
    } else if (1280 >= width && width > 640) {
        wavebarGap = 9;
        wavebarWidth = 10;
        changeWaveBars();
    } else if (width > 1280) {
        wavebarGap = 14;
        wavebarWidth = 16;
        changeWaveBars();
    }   
};

let bars;

let changeWaveBars = () => {
    bars = (width/1)/(wavebarGap + wavebarWidth);

    waveformLeft.style.gap = `${wavebarGap}px`;

    waveformLeft.style.paddingRight = `${wavebarGap/2}px`;

    for (let c=0; c < waveformLeft.children.length; c++){
        waveformLeft.children[c].style.width = `${wavebarWidth}px`;
    }
}


setWaveBars();
changeWaveBars();

wavebar.style.width = `${wavebarWidth}px`;



window.addEventListener("resize", () => {
    width = window.innerWidth;
    setWaveBars();
    bars = (width/1)/(wavebarGap + wavebarWidth);
    setTimeout(addWaves, i);
})


// wave frequency
//      - increasing gives more waves
//      - f = 1 just tapers down to edges, not back up
let f = 2;

//  initial interval delay
let i = 80;

// minimum height of the bar (associated with the waveform div's y offset)
let minHeight = 30;



let x = 0;
let waveHeight = () => {
    let t = Math.abs(Math.sin(Math.trunc((Math.abs(bars - x*f) / bars)*100)/100));
    return t*t;
}



let addWaves = () => {
    if (x >= bars){
        clearInterval(addWaves);
    } else {
        waveformLeft.appendChild(wavebar.cloneNode(true));

        let h = minHeight 
                + (waveHeight() * (80-minHeight))
                + Math.floor(Math.random()*20);
        
        waveformLeft.lastChild.style.height = `${h}%`;
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


