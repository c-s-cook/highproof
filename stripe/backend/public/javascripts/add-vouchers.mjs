
let fileInput = document.getElementById('fileInput');
if(fileInput) console.log("found fileInput!");


let vouchers = [];
let tourTitles = [];
let availableVouchers = [];
let newTourTitles = [];
let toursInDB;
let existingTourTitles = [];




function togglePopUp() {

    let popUps = document.getElementsByClassName('pop-up');

    for (let e = 0; e < popUps.length; e++) {
        if (popUps[e].style.display == "none") {
            popUps[e].style.display = "block";
        } else {
            popUps[e].style.display = "none";
        }
    }
}


document.getElementById('close-pop-up').addEventListener("click", togglePopUp);
// let closePopUp = document.getElementById('close-pop-up');
// closePopUp.addEventListener("click", ()=>{
//     togglePopUp();
// });



const handleNewTourTrue = (e) => {
    togglePopUp();
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked, and found this array index: ",i)
    console.log("Tour Title in question is -> ", newTourTitles[i].TITLE)
}




const handleCorrectedTourSelected = (e, tourDBNum, i, dbIndex) => {

    console.log("Picked a tour. It was tour: ", tourDBNum);
    console.log(existingTourTitles)
    console.log(newTourTitles)
    let allTitles = toursInDB[dbIndex].TITLES
    allTitles.push(newTourTitles[i].TITLE)

    existingTourTitles.push({
        "TourTitle": {
            "TITLE": newTourTitles[i].TITLE,
            "COUNT": newTourTitles[i].COUNT
        },
        "allTitles": allTitles,
        "tourNumber": tourDBNum, 
        "dbIndex": dbIndex
    });
    newTourTitles.splice(i, 1);

    console.log("after push and splice...")
    console.log(existingTourTitles)
    console.log(newTourTitles)

    togglePopUp();
    document.getElementById('new-tour-false').style.display = "none";
    displayTourTitleResults();
    
}

const handleNewTourFalse = (e) => {
    togglePopUp();

    

    console.log("upon entering handleNewTourFalse()...")
    console.log(existingTourTitles)
    console.log(newTourTitles)
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked, and found this array index: ",i)
    console.log("Tour Title in question is -> ", newTourTitles[i].TITLE)

    
    let menu = document.getElementById('new-tour-false');
    menu.style.display = "block";

    
    let menuTitle = document.getElementById('ntf-title');
    menuTitle.innerText = `"${newTourTitles[i].TITLE}"`



    let menuTourList = document.getElementById('ntf-existing-tours-list');
    toursInDB.map((tour, dbIndex) => {
        
        let listTheTitles = () => {
            let titleList = ``;
            for(let t = tour.TITLES.length; t > 0; t--){
                let isMainTitle = (t == tour.TITLES.length) ? `style="font-weight: bold"` : ``;
                titleList += `<p ${isMainTitle}>${tour.TITLES[t-1]}</p>`
            }
            
            return titleList
        }
        menuTourList.innerHTML += `
        <div class="menu-tours-list" onclick="handleCorrectedTourSelected(event, ${tour.TOUR}, ${i}, ${dbIndex})">
            <p>${tour.TOUR}</p>
            <div>
                ${listTheTitles()}
            </div>
        `;
    })



}


const handleExistingTourTrue = (e) => {
    
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked, and found this array index: ",i)
    console.log("Tour Title in question is -> ", existingTourTitles[i].TourTitle.TITLE)

    console.log(document.querySelector(`.existing-tour.checked, [data-tour-index="${i}]`));
    document.querySelector(`.existing-tour.checked, [data-tour-index="${i}]`).style.visibility = "visible";

}


const handleExistingTourChange = (e) => {
    togglePopUp();
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked, and found this array index: ",i)
    console.log("Tour Title in question is -> ", existingTourTitles[i].TourTitle.TITLE)
}


const handleExistingTourFalse = (e) => {
    togglePopUp();
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked, and found this array index: ",i)
    console.log("Tour Title in question is -> ", existingTourTitles[i].TourTitle.TITLE)
}






function displayTourTitleResults() {
    //  DISPLAY RESULTS AND GET CONFIRMATION
    document.getElementById('results').style.display = "inline-block";

    // insert new Tours
    if (newTourTitles.length < 1) {
        document.getElementById('new-tours').innerText = `No New Tours`;
    } else {
        document.getElementById('new-tours').innerHTML = '';
        for (var nt = 0; nt < newTourTitles.length; nt++) {
            document.getElementById('new-tours').innerHTML += `
                <div>
                    <p>
                        <span class="new-tour checked ${nt}" style="visibility:hidden">&#9989</span>
                        ${newTourTitles[nt].TITLE} | ${newTourTitles[nt].COUNT}
                        <button class="new-tour true" data-tour-index="${nt}" onclick="handleNewTourTrue(event)">Yes, it's a new tour</button>
                        <button class="new-tour false" data-tour-index="${nt}" onclick="handleNewTourFalse(event)">No, not a new tour</button>
                    </p>
                </div>
                `
        }
    }


    //  insert existing tours that have new vouchers in the uploaded csv...
    if (existingTourTitles.length < 1) {
        document.getElementById('existing-tours').innerHTML = 'No Existing Tours';
    } else {
        document.getElementById('existing-tours').innerHTML = '';

        for (var et = 0; et < existingTourTitles.length; et++) {
            document.getElementById('existing-tours').innerHTML += `
                    <div>
                        <p>
                            <span class="existing-tour checked ${et}" style="visibility:hidden">&#9989</span>
                            ${existingTourTitles[et].TourTitle.TITLE} | ${existingTourTitles[et].TourTitle.COUNT}
                            <button class="existing-tour true ${et}" data-tour-index="${et}" onclick="handleExistingTourTrue(event)">Yes, this is the right tour</button>
                            <button class="existing-tour change ${et}" data-tour-index="${et}" onclick="handleExistingTourChange(event)">Yes, BUT this is a different tour</button>
                            <button class="existing-tour false ${et}" data-tour-index="${et}" onclick="handleExistingTourFalse(event)">No, this is a new tour</button>
                        </p>
                    `;

            let altTitles = existingTourTitles[et].allTitles.filter((title) => title != existingTourTitles[et].TourTitle.TITLE);

            if (existingTourTitles[et].allTitles.length > 1) {

                let altTitlesHTML = `<p class='alt-titles'><small> AKA:`

                for (var alts = 0; alts < existingTourTitles[et].allTitles.length; alts++) {
                    altTitlesHTML += `
                         -- "${existingTourTitles[et].allTitles[alts]}"  
                        `;
                }

                altTitlesHTML += `</small></p>`;

                document.getElementById('existing-tours').innerHTML += `${altTitlesHTML}`;
            
            }

            document.getElementById('existing-tours').innerHTML += `
                    </div>
                    `;
        }
    }
}







fileInput.addEventListener('change', async function(event) {
    const file = event.target.files[0];
    
    // var vouchers = [];
    // var tourTitles = [];
    // var availableVouchers = [];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            var lines = this.result.split(/\r\n|\n/);
            var startAt = lines[0].split(",")[0] == "Voucher Name" ? 1 : 0;
            console.log(startAt);
            for (var line = startAt; line < lines.length - 1; line++) {
              // console.log(line + ' --> ' + lines[line]);
              var columns = lines[line].split(",");
              var voucher = {
                "VOUCHER_ID": columns[0],
                "TourTitle": columns[1],
                "Quantity": columns[2],
                "Redeemed": columns[3],
                "State": columns[4],
                "TOUR_ID": null,
                "LINK": columns[5],
                "AVAILABLE": columns[3] == "0" ? true : false,
                "CREATED": columns[6],
                "PURCHASED": null,      //Date()
                "TRANSACTION_ID": null  //Str / Foreign Key
              }
              vouchers.push(voucher);
              if(voucher.Redeemed != "1") availableVouchers.push(voucher);

              var foundIt = false;
              if (tourTitles.length > 0){
                for (var t = 0; t < tourTitles.length; t++){
                    if (columns[1] == tourTitles[t].TITLE) {
                        tourTitles[t].COUNT += 1;
                        foundIt = true;
                        break;
                    }
                }
              } 
              if (!foundIt) {
                tourTitles.push({
                    "TITLE": columns[1],
                    "COUNT": 1
                })
              }
            //   if(!tourTitles.includes(columns[1])) tourTitles.push(columns[1]);

            }
            console.log("vouchers = ", vouchers);
            console.log("tourTitles = ", tourTitles);
            const content = e.target.result;
            document.getElementById('output').innerText = content;
            document.getElementById('output').innerHTML += `
            
            <p>Vouchers to add: ${vouchers.length}</p>
            <p>Available vouchers: ${availableVouchers.length}</p>
            `;
        };
        reader.readAsText(file);
    }

    // GET EXISTING TOURS & TOUR NAMES

    try {

        const response = await fetch('../api/query-table');
        const data = await response.json();
        toursInDB = data.Items;
    } catch (error) {
        console.log(error);
    };


    // let toursInDBLocal = await JSON.parse('[{"TOUR_REGION":"KBT","TOUR":1,"TITLES":["Birth to Boom Driving Tour - Single Day"]},{"TOUR_REGION":"KBT","TOUR":2,"TITLES":["Birth to Boom Driving Tour - Single Day"]},{"TOUR_REGION":"KBT","TOUR":4,"TITLES":["Kentucky Bourbon: Birth to Boom"]}]')


    // COMPARE NEW VOURCHERS' TOUR NAMES AGAINST EXISTING TOUR NAMES

    for (var nt = 0; nt < tourTitles.length; nt++){
        let titleExists = false;
        let tourNumber = null;
        for (var et = 0; et < toursInDB.length; et++){
            if(toursInDB[et].TITLES.includes(tourTitles[nt].TITLE)) {
                titleExists = true;
                tourNumber = et;
                console.log("Found tour - ", tourTitles[nt].TITLE, " - in TOUR ", toursInDB[et].TOUR, ". --> ", toursInDB[et].TITLES);
            }
        }
        if (!titleExists) {
            console.log("New Tour Name: ", tourTitles[nt].TITLE);
            newTourTitles.push(tourTitles[nt]);
        } else {
            console.log("Existing Tour Name: ", tourTitles[nt].TITLE);



            existingTourTitles.push({
                "TourTitle": tourTitles[nt],
                "allTitles": toursInDB[et].TITLES,
                "tourNumber": tourNumber,
                "dbIndex": et
            });
        }
    }

    console.log("after initial sorting...")
    console.log(existingTourTitles)
    console.log(newTourTitles)

    displayTourTitleResults();

});


