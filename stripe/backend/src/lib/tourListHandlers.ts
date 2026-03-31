import { newTourTitles, existingTourTitles, toursInDB } from '../addVouchers';
import { togglePopUp } from './togglePopUp';
import { checkAllConfirmed } from './checkAllConfirmed';
import { displayTourTitleResults } from './displayTourTitleResults';



/************************

    EXISTING TOURS LIST

************************/



export const handleExistingTourTrue = (e: MouseEvent) => {
    
    let i: number = Number((e.target as HTMLButtonElement).dataset.tourIndex);
    (document.querySelector(`.existing-tour.checked[data-tour-index="${i}"]`) as HTMLElement)!.style.visibility = "visible";
    (e.target as HTMLButtonElement).disabled = true;
    
    existingTourTitles[i].confirmed = true;
    checkAllConfirmed();
}



export const handleExistingTourChange = (e: MouseEvent) => {
    // togglePopUp();
    
    let i: number = Number((e.target as HTMLElement).dataset.tourIndex);
    console.log("Clicked Exisitng but Different... and found this array index: ",i)
    console.log("Tour Title in question is -> ", existingTourTitles[i].TourTitle.TITLE)

    handleNewTourFalse(e, "existing-tour");
}



export const handleExistingTourFalse = (e: MouseEvent) => {
    
    let i: number = Number((e.target as HTMLElement).dataset.tourIndex);

    (document.querySelector(`.existing-tour.checked[data-tour-index="${i}"]`) as HTMLElement).style.visibility = "hidden";
    (document.querySelector(`.existing-tour.true[data-tour-index="${i}"]`) as HTMLButtonElement).disabled = false;
    existingTourTitles[i].confirmed = false;

    let oldMenu = document.getElementById('new-tour-false')!;
    oldMenu.style.display = "none";

    let menu = document.getElementById('existing-tour-false')!;
    menu.style.display = "block";

    let input = document.querySelector('#existing-tour-false input[type="text"]') as HTMLInputElement;
    input.value = existingTourTitles[i].TourTitle.TITLE;

    let errMessage = document.querySelector('#existing-tour-false p#error') as HTMLElement;
    errMessage.innerText = "testing error";
    errMessage.style.visibility = "hidden";

    let sbmtButton = document.querySelector('#existing-tour-false button') as HTMLButtonElement;

    sbmtButton.addEventListener('click', ()=> {

        errMessage.innerHTML = "";

        let titleConflict = null;

        // Check submitted title against current & past titles of existing tours...
        for (let t = 0; t < toursInDB.length; t++){
            if(toursInDB[t].TITLES.includes(input.value)){
                let index = 0;
                while(index < toursInDB[t].TITLES.length){
                    if (toursInDB[t].TITLES[index] == input.value) break;                    
                }
                titleConflict = {
                    "isNew": false,
                    "tour": toursInDB[t],
                    "index": index
                }
                break;
            }
        }

        // Check submited title against the titles of any new tours...
        for (let t = 0; t < newTourTitles.length; t++){
            if(newTourTitles[t].TourTitle.TITLE == input.value){
                titleConflict = {
                    "isNew": true,
                    "tour": newTourTitles[t].TourTitle.TITLE,
                    "index": null

                }
            }
        }

        if (titleConflict) {
            if (titleConflict.isNew) {
                errMessage.innerHTML += `
                <p class="error">ERROR: CONFLICT WITH ANOTHER NEW TOUR</p>
                <p style="font-weight: bold">${titleConflict.tour}</p>
                `
            } else if (typeof titleConflict.tour != "string") {
                {
                    if (titleConflict.index == 0) {
                        errMessage.innerHTML += `
                    <p class="error">ERROR: CONFLICT WITH TOUR #${titleConflict.tour.TOUR_NUM}</p>
                    `
                    } else {
                        errMessage.innerHTML += `
                    <p class="warning">WARNING: MATCHES WITH TOUR #${titleConflict.tour.TOUR_NUM}</p>
                    `
                    }
                    for (let t = 0; t < titleConflict.tour.TITLES.length; t++) {
                        let isMatch = (t == titleConflict.index) ? 'style="font-weight:bold"' : '';
                        errMessage.innerHTML += `
                    <p ${isMatch}>${titleConflict.tour.TITLES[t]}</p>
                    `
                    }
                }

                errMessage.style.visibility = "visible";
            } else {
                console.log("All good, bro!");
                newTourTitles.push({
                    "TourTitle": {
                        "TITLE": existingTourTitles[i].TourTitle.TITLE,
                        "COUNT": existingTourTitles[i].TourTitle.COUNT
                    },
                    "confirmed": false,
                })
                existingTourTitles.splice(i, 1);
                togglePopUp();
                menu.style.display = "none";
                displayTourTitleResults();
            }
        }

    })

    togglePopUp();
}











/************************

    NEW TOURS LIST

************************/


export const handleNewTourTrue = (e: MouseEvent) => {
   
    let i: number = Number((e.target as HTMLElement).dataset.tourIndex);
    let isPublished = false;

    // confirm newTourTitle
    let confirmNewTour = () => {
        
        (document.querySelector(`.new-tour.checked[data-tour-index="${i}"]`) as HTMLElement)!.style.visibility = "visible";
        (e.target as HTMLButtonElement).disabled = true;
        
        newTourTitles[i].confirmed = true;
        newTourTitles[i].published = isPublished;
        togglePopUp();
        (document.getElementById("new-tour-is-published") as HTMLElement)!.style.display = "none";
        checkAllConfirmed();

    }

    // POP-UP: check if the new tour is "Published" on VoiceMap...
    if(i) document.getElementById("is-published-tour-title")!.innerText = newTourTitles[i].TourTitle.TITLE;
    
    document.querySelector("#new-tour-is-published button.yes")!.addEventListener("click", () => {
        isPublished = true;
        confirmNewTour();
    });

    document.querySelector("#new-tour-is-published button.no")!.addEventListener("click", confirmNewTour);
    
    
    (document.getElementById("new-tour-is-published") as HTMLElement)!.style.display = "block";
    togglePopUp();
}





export const handleNewTourFalseSelection = async (e: MouseEvent, tourDBNum: number, i: number, dbIndex: number, newOrExist: string) => {

    let allTitles: string[] = []
    // have to map through it b/c of deepfreeze
    toursInDB[dbIndex].TITLES.map((title) => allTitles.push(title));
    console.log("allTitles = ", allTitles)
    
    if (newOrExist == "new-tour") {
        allTitles.unshift(newTourTitles[i].TourTitle.TITLE)

        existingTourTitles.push({
            "TourTitle": {
                "TITLE": newTourTitles[i].TourTitle.TITLE,
                "COUNT": newTourTitles[i].TourTitle.COUNT
            },
            "allTitles": allTitles,
            "tourNumber": tourDBNum, 
            "dbIndex": dbIndex,
            "updateDBLinks": true
        });
        newTourTitles.splice(i, 1);
    } else if (newOrExist == "existing-tour"){
        allTitles.unshift(existingTourTitles[i].TourTitle.TITLE)
        existingTourTitles[i].allTitles = allTitles
        existingTourTitles[i].tourNumber = tourDBNum
        existingTourTitles[i].dbIndex = dbIndex
        existingTourTitles[i].updatedTourTitle = true
    }


    console.log("after push and splice...")
    console.log(existingTourTitles)
    console.log(newTourTitles)
    console.log("toursInDB[0] = ", toursInDB[0])

    togglePopUp();
    document.getElementById('new-tour-false')!.style.display = "none";
    displayTourTitleResults();
    
}


export const handleNewTourFalse = (e: MouseEvent, newOrExist: string) => {

    let i: number = Number((e.target as HTMLElement).dataset.tourIndex);

    if (!newOrExist){ 
        newOrExist = "new-tour";
        newTourTitles[i].confirmed = false;
    } else {
        existingTourTitles[i].confirmed = false;
    }

    console.log(newOrExist, i);
    console.log("toursInDB = ", toursInDB);

    (document.querySelector(`.${newOrExist}.checked[data-tour-index="${i}"]`) as HTMLElement)!.style.visibility = "hidden";
    (document.querySelector(`.${newOrExist}.true[data-tour-index="${i}"]`) as HTMLButtonElement).disabled = false;
    togglePopUp();

    // console.log("upon entering handleNewTourFalse()...")
    // console.log(existingTourTitles)
    // console.log(newTourTitles)
    
   
    // console.log("Clicked, and found this array index: ",i)
    // console.log("Tour Title in question is -> ", newTourTitles[i].TourTitle.TITLE)

    document.getElementById('existing-tour-false')!.style.display = "none";
    
    let menu = document.getElementById('new-tour-false')!;
    menu.style.display = "block";

    
    let menuTitle = document.getElementById('ntf-title')!;
    menuTitle.innerText = newOrExist == "existing-tour" ? `"${existingTourTitles[i].TourTitle.TITLE}"` : `"${newTourTitles[i].TourTitle.TITLE}"`

    let menuTourList = document.getElementById('ntf-existing-tours-list')!;
    menuTourList.innerHTML = '';

    let tourNumbers = [];
    for(let et = 0; et < existingTourTitles.length; et++){
        tourNumbers.push(existingTourTitles[et].tourNumber)
    }

    // console.log("tourNumbers = ", tourNumbers);

    for(let db = 0; db < toursInDB.length; db++){
        if(tourNumbers.includes(toursInDB[db].TOUR_NUM)) break;

        let listTheTitles = () => {
            let titleList = ``;
            for(let t = 0; t < toursInDB[db].TITLES.length; t++){
                let isMainTitle = (t == 0) ? `style="font-weight: bold"` : ``;
                titleList += `<p ${isMainTitle}>${toursInDB[db].TITLES[t]}</p>`
            }
            
            return titleList
        }
        menuTourList.innerHTML += `
        <div class="menu-tours-list" onclick="handleNewTourFalseSelection(event, ${toursInDB[db].TOUR_NUM}, ${i}, ${db}, '${newOrExist}')">
            <p>${toursInDB[db].TOUR_NUM}</p>
            <div>
                ${listTheTitles()}
            </div>
        `;
    }


    console.log("toursInDB at end of handleNewToursFalse() = ", toursInDB)

    setTimeout(() => {
        console.log("toursInDB after timeout = ", toursInDB)
    }, 3000)
}