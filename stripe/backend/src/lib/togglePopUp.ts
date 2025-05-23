export function togglePopUp() {

    let popUps = document.getElementsByClassName('pop-up') as HTMLCollectionOf<HTMLElement>;

    for (let e = 0; e < popUps.length; e++) {
        if (popUps[e].style.display == "none") {
            popUps[e].style.display = "block";
        } else {
            popUps[e].style.display = "none";
        }
    }
}