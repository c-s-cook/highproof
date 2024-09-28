
// const waveform = document.getElementById("waveformHeader");
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
// wavebar.style.height = "100%";

let x = 0;
let w = 70;
let i = 80;

let addWaves = () => {
    if (x >= w){
        clearInterval(addWaves);
    } else {
        waveformLeft.insertBefore(wavebar.cloneNode(true), waveformLeft.children[0]);
        waveformRight.appendChild(wavebar.cloneNode(true));
        let h = 30 + Math.floor(Math.random()*70);
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




