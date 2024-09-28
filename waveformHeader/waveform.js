const waveform = document.getElementById("waveformHeader");
const waveformSplits = document.getElementsByClassName("waveformSplit");
console.log(waveformSplits);

const wavebar = document.createElement("div");
wavebar.classList.add("wavebar");

waveformSplits[0].innerText = "testing one 2 three?";

let x = 0;
let w = 10;

while (x <= w) {
    waveform.innerText += x;
    setTimeout(() => {
        for (side in waveformSplits) {
            side.appendChild(wavebar);
        }
    }, 500);
    x++;
    
};



