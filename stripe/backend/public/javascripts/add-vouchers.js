
"use strict"


let fileInput = document.getElementById('fileInput');


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




const checkAllConfirmed = () => {

    // If any existing titles are NOT confirmed, return/end
    for (let t = 0; t < existingTourTitles.length; t++){
        if(!existingTourTitles[t].confirmed) return;
    }

    // If any new titles are NOT confirmed, return/end
    for(let t = 0; t < newTourTitles.length; t++){
        if(!newTourTitles[t].confirmed) return;
    }
    

    // If we make it here, assume that all titles have been confirmed...
    
    // Add tourNumber from existingTourTitles to matching vouchers...
    for(let t = 0; t < existingTourTitles.length; t++){
        for(let v = 0; v < vouchers.length; v++){
            if(vouchers[v].TourTitle == existingTourTitles[t].TourTitle.TITLE){
                vouchers[v].TOUR_NUM = existingTourTitles[t].tourNumber;

                if(existingTourTitles[t].updateDBLinks) vouchers[v].allTitles = existingTourTitles[t].allTitles
            }
        }
    }

    // Add new tourNumber for newTourTitles to matching vouchers...
    let tourNumbers = []
    let newTourNum = 0;
    if(toursInDB.length > 0) {
        toursInDB.map((tour) => tourNumbers.push(tour.TOUR_NUM))
        newTourNum = Math.max(...tourNumbers)
    }

    for(let t = newTourTitles.length; t > 0; t--){
        newTourNum += 1;
        console.log(newTourNum)
        for(let v = 0; v < vouchers.length; v++){
            if(vouchers[v].TourTitle == newTourTitles[t-1].TourTitle.TITLE){
                vouchers[v].TOUR_NUM = newTourNum
                vouchers[v].isNewTour = true
                vouchers[v].allTitles = null
                newTourTitles[t-1].tourNumber = newTourNum
            }
        }
    }

    displayVouchers();
    displayActionItems();
    
}






const handleNewTourTrue = (e) => {
   
    let i = e.target.dataset.tourIndex;
    // console.log("Clicked, and found this array index: ",i)
    // console.log("Tour Title in question is -> ", newTourTitles[i].TourTitle.TITLE)

    // console.log(document.querySelector(`.new-tour.checked, [data-tour-index="${i}"]`));
    document.querySelector(`.new-tour.checked[data-tour-index="${i}"]`).style.visibility = "visible";
    e.target.disabled = true;
    
    newTourTitles[i].confirmed = true,
    checkAllConfirmed();
}




const handleNewTourFalseSelection = async (e, tourDBNum, i, dbIndex, newOrExist) => {


    let allTitles = []
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
    document.getElementById('new-tour-false').style.display = "none";
    displayTourTitleResults();
    
}

const handleNewTourFalse = (e, newOrExist) => {

    let i = e.target.dataset.tourIndex;

    if (!newOrExist){ 
        newOrExist = "new-tour";
        newTourTitles[i].confirmed = false;
    } else {
        existingTourTitles[i].confirmed = false;
    }

    console.log(newOrExist, i);
    console.log("toursInDB = ", toursInDB)

    document.querySelector(`.${newOrExist}.checked[data-tour-index="${i}"]`).style.visibility = "hidden";
    document.querySelector(`.${newOrExist}.true[data-tour-index="${i}"]`).disabled = false;
    togglePopUp();

    // console.log("upon entering handleNewTourFalse()...")
    // console.log(existingTourTitles)
    // console.log(newTourTitles)
    
   
    // console.log("Clicked, and found this array index: ",i)
    // console.log("Tour Title in question is -> ", newTourTitles[i].TourTitle.TITLE)

    document.getElementById('existing-tour-false').style.display = "none";
    
    let menu = document.getElementById('new-tour-false');
    menu.style.display = "block";

    
    let menuTitle = document.getElementById('ntf-title');
    menuTitle.innerText = newOrExist == "existing-tour" ? `"${existingTourTitles[i].TourTitle.TITLE}"` : `"${newTourTitles[i].TourTitle.TITLE}"`

    let menuTourList = document.getElementById('ntf-existing-tours-list');
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


const handleExistingTourTrue = (e) => {
    
    let i = e.target.dataset.tourIndex;
    // console.log("Clicked, and found this array index: ",i)
    // console.log("Tour Title in question is -> ", existingTourTitles[i].TourTitle.TITLE)

    // console.log(document.querySelector(`.existing-tour.checked[data-tour-index="${i}"]`));
    document.querySelector(`.existing-tour.checked[data-tour-index="${i}"]`).style.visibility = "visible";
    e.target.disabled = true;
    
    existingTourTitles[i].confirmed = true;
    checkAllConfirmed();

}


const handleExistingTourChange = (e) => {
    // togglePopUp();
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked Exisitng but Different... and found this array index: ",i)
    console.log("Tour Title in question is -> ", existingTourTitles[i].TourTitle.TITLE)

    handleNewTourFalse(e, "existing-tour");
}


const handleExistingTourFalse = (e) => {
    
    let i = e.target.dataset.tourIndex;
    // console.log("Clicked, and found this array index: ",i)
    // console.log("Tour Title in question is -> ", existingTourTitles[i].TourTitle.TITLE)

    document.querySelector(`.existing-tour.checked[data-tour-index="${i}"]`).style.visibility = "hidden";
    document.querySelector(`.existing-tour.true[data-tour-index="${i}"]`).disabled = false;
    existingTourTitles[i].confirmed = false;

    let oldMenu = document.getElementById('new-tour-false');
    oldMenu.style.display = "none";

    let menu = document.getElementById('existing-tour-false');
    menu.style.display = "block";

    let input = document.querySelector('#existing-tour-false input[type="text"]');
    input.value = existingTourTitles[i].TourTitle.TITLE;

    let errMessage = document.querySelector('#existing-tour-false p#error');
    errMessage.innerText = "testing error";
    errMessage.style.visibility = "hidden";

    let sbmtButton = document.querySelector('#existing-tour-false button');

    sbmtButton.innerText += "??";

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

        if(titleConflict){
            if(titleConflict.isNew){
                errMessage.innerHTML += `
                <p class="error">ERROR: CONFLICT WITH ANOTHER NEW TOUR</p>
                <p style="font-weight: bold">${titleConflict.tour}</p>
                `
            } else {
                if(titleConflict.index == 0){
                    errMessage.innerHTML += `
                    <p class="error">ERROR: CONFLICT WITH TOUR #${titleConflict.tour.TOUR_NUM}</p>
                    `
                } else {
                    errMessage.innerHTML += `
                    <p class="warning">WARNING: MATCHES WITH TOUR #${titleConflict.tour.TOUR_NUM}</p>
                    `
                }
                for(let t = 0; t < titleConflict.tour.TITLES.length; t++){
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
                    "COUNT":existingTourTitles[i].TourTitle.COUNT
                },
                "confirmed": false,
            })
            existingTourTitles.splice(i, 1);
            togglePopUp();
            menu.style.display = "none";
            displayTourTitleResults();
        }

    })


    togglePopUp();
}


function displayTourTitleResults() {
    //  DISPLAY RESULTS AND GET CONFIRMATION
    document.getElementById('title-results').style.display = "block";

    document.getElementById('input').style.display = "none";

    // insert new Tours
    if (newTourTitles.length < 1) {
        document.getElementById('new-tours').innerHTML = `<ul><li><small>No New Tours</small></li></ul>`;
    } else {
        document.getElementById('new-tours').innerHTML = '';
        for (var nt = 0; nt < newTourTitles.length; nt++) {
            document.getElementById('new-tours').innerHTML += `
                <div class="tour-title-list">
                        <div class="title"><span class="new-tour checked ${nt}" data-tour-index="${nt}" style="visibility:hidden">&#9989</span> ${newTourTitles[nt].TourTitle.TITLE} </div>
                        <div class="count">Count: ${newTourTitles[nt].TourTitle.COUNT}</div>
                        <div class="buttons">
                            <button class="new-tour true ${nt}" data-tour-index="${nt}" onclick="handleNewTourTrue(event)">Yes, it's a new tour</button>
                            <button class="new-tour false ${nt}" data-tour-index="${nt}" onclick="handleNewTourFalse(event)">No, not a new tour</button>
                        </div>
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
                    <div class="tour-title-list">
                        <div class="title"><span class="existing-tour checked ${et}"  data-tour-index="${et}" style="visibility:hidden">&#9989</span> ${existingTourTitles[et].TourTitle.TITLE}</div>
                        <div class="count">Count: ${existingTourTitles[et].TourTitle.COUNT}</div>
                        <div class="buttons">
                            <button class="existing-tour true ${et}" data-tour-index="${et}" onclick="handleExistingTourTrue(event)">Yes, this is the right tour</button>
                            <button class="existing-tour change ${et}" data-tour-index="${et}" onclick="handleExistingTourChange(event)">Yes, BUT this is a different tour</button>
                            <button class="existing-tour false ${et}" data-tour-index="${et}" onclick="handleExistingTourFalse(event)">No, this is a new tour</button>
                        </div>
                    
                        
                    `;

            let altTitles = existingTourTitles[et].allTitles.filter((title) => title != existingTourTitles[et].TourTitle.TITLE);

            if (existingTourTitles[et].allTitles.length > 1) {

                let altTitlesHTML = `<p class='alt-titles'><small> FORMERLY:`

                for (var alts = 1; alts < existingTourTitles[et].allTitles.length; alts++) {
                    altTitlesHTML += `
                        "${existingTourTitles[et].allTitles[alts]}"  --  
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

// should not every need to use this a newly-imported voucher CSV
function updateVoucherTitle(ogTitle, newTitle) {
    // update voucher.Title
    for(let v = 0; v < vouchers.length; v++){
        if(ogTitle == vouchers[v].TourTitle) vouchers[v].TourTitle = newTitle
    }
}

// ...actually, should not every need to use this at this stage
// ...it would likely mess things up way too much
function updateVoucherLinks(ogTitle, newTitle, ogLink){

    // this function should only be run AFTER the voucher's .TourTitle has been updated with the New Title

    if(!ogTitle || !newTitle || !ogLink) {
        console.log("updateVoucherLinks() ERROR --> Missing at least one param")
        return
    } 

    let ogLinkTitle = ogTitle.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
    console.log(ogTitle);

    let newLinkTitle = newTitle.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
    console.log(newTitle);

    let splitLink = ogLink.split(ogTitle)
    let newLink = `${splitLink[0]}${newTitle}${splitLink[1]}`

    console.log(`Initial link is --> ${ogLink}`)
    console.log(`New link is     --> ${newLink}`)

    for(let v = 0; v < vouchers.length; v++){
        if(newTitle == vouchers[v].TourTitle && ogLink == vouchers[v].LINK){
            vouchers[v].LINK = newLink
        }
    }
}

function displayVouchers(){
    console.log("in displayVouchers()")

    let results = document.getElementById('voucher-results')
    let table = document.getElementById('voucher-body')
    table.innerHTML = ''

    let toUpdateDBLinks = []
    for (let t = 0; t < existingTourTitles.length; t++){
        if(existingTourTitles[t].updateDBLinks) toUpdateDBLinks.push(existingTourTitles[t].TourTitle.TITLE)
    }


    vouchers.map((voucher) => {
        // console.log(voucher)

        let isRedeemed = voucher.REDEEMED ? 'T' : 'F'
        let isAvailable = voucher.AVAILABLE ? 'T' : 'F'
        let dbStatus = voucher.dbStatus ? voucher.dbStatus : ""
        

        let isNewTour = voucher.isNewTour ? 'class="new-tour"' : ''

        let isUpdatedTitle = voucher.allTitles ? ' class="updated-title"' : '';
        let oldTitles = ''
        if(voucher.allTitles){
            oldTitles = 'title="Former Titles:'
            for(let t = 1; t < voucher.allTitles.length; t++){
                oldTitles += `&#10;${voucher.allTitles[t]}`
            }
            oldTitles += '"'
        }

        table.innerHTML += `
        <tr>
            <td class='${dbStatus}' title='${dbStatus}'></td>
            <td>${voucher.VOUCHER_ID}</td>
            <td ${isUpdatedTitle} ${isNewTour}>${voucher.TOUR_NUM}</td>
            <td ${isUpdatedTitle} ${oldTitles}>${voucher.TourTitle}</td>
            <td class='${voucher.REDEEMED}'>${isRedeemed}</td>
            <td class='${voucher.AVAILABLE}'>${isAvailable}</td>
            <td ${isUpdatedTitle}>${voucher.LINK}</td>
            <td>${voucher.CREATED}</td>
        </tr>
        `
    })

    
}


function displayActionItems(){
    console.log("display action items...")
    document.getElementById('action-items').style.display = 'flex';

    // check existingTourTitles for updated titles...
    actionUpdateTours()

    // check newTourTitles for listing...
    actionCreateTours()

    actionUpdateVoucherLinks()

    actionCreateVouchers()

}




function actionUpdateTours(){
    
    let needUpdating = false;

    let toursList = document.querySelector('#tours-to-update .tours-list tbody')
    
    // toursList.innerText += "Found it!"

    
    // check existingTourTitles for updated titles and display results...
    existingTourTitles.map((tour) => {
        if(tour.updateDBLinks) {
            needUpdating = true;
            let newTableHTML = ''
            newTableHTML += `
            <tr>
                <td>
                    <p>${toursInDB[tour.dbIndex].TOUR_REGION} #${toursInDB[tour.dbIndex].TOUR_NUM}</p>
            `
            for(let t = 0; t < toursInDB[tour.dbIndex].TITLES.length; t++){
                newTableHTML += `
                    <p>${toursInDB[tour.dbIndex].TITLES[t]}</p>
            `
            }

            newTableHTML += `
                </td>
                <td>
                    <p>${toursInDB[tour.dbIndex].TOUR_REGION} #${tour.tourNumber}</p>
            `
            for(let t = 0; t < tour.allTitles.length; t++){
                newTableHTML += `
                    <p>${tour.allTitles[t]}</p>
            `
            }
            newTableHTML += `
                </td>
            </tr>
            
            `
            toursList.innerHTML += newTableHTML
            toursList.style.visibility = "visible"
        }
    })

    // function for the button to update tours in the database...
    const updateToursInDB = () => {
        existingTourTitles.map((tour) => {
            // This function would typically involve sending the updated tour information to the backend API to update the database...
            if(tour.updateDBLinks){
                console.log("Updating Tour in DB...")
                console.log(tour)
                fetch('/api/update-tour', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "TOUR_REGION": toursInDB[tour.dbIndex].TOUR_REGION,
                        "TOUR_NUM": tour.tourNumber,
                        "TITLES": tour.allTitles
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    tour.updatedDBTour = true; // Mark this tour as updated in the DB
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }
        })
    }

    // if no tours were found in need of updates, give message
    if(!needUpdating) {
        document.querySelector('#tours-to-update .tours-list').innerHTML = "<ul><li><i><small>No tours found needing title updates.</small></i></li></ul>"
        document.getElementById('tours-to-update').style.color = "lightgray"
    }
    // otherwise, make the update button visible and add event listener...
    else {
        let updateToursBtn = document.querySelector('#tours-to-update .tours-list button')
        updateToursBtn.style.visibility = "visible"
        updateToursBtn.addEventListener('click', updateToursInDB)
    }
}



function actionCreateTours(){

    let toursList = document.querySelector('#tours-to-create .tours-list ul')
    toursList.style.visibility = "visible"

    // check against an empty array
    if(newTourTitles.length == 0){
        toursList.innerHTML += '<li><small><italic>No new tours found.</italic></small></li>'
        document.getElementById('tours-to-create').style.color = "lightgray"
    } else {
    // list out any newTourTitles
        newTourTitles.map((tour) => {
            
            toursList.innerHTML += `<li>KBT #${tour.tourNumber} - ${tour.TourTitle.TITLE}</li>`
        })

        // function for handling the button click to create tours in the database...
        const createToursInDB = () => {
            // this function sends the new tours to the backend API to create new tours in the database...
            console.log("Creating Tours in DB...")
            console.log(newTourTitles)
            for (let t = 0; t < newTourTitles.length; t++){
                fetch('/api/create-tour', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "TOUR_REGION": "KBT", // Using a fixed region for now...
                        "TOUR_NUM": newTourTitles[t].tourNumber,
                        "TITLES": [newTourTitles[t].TourTitle.TITLE] // Assuming single title for new tours...
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    newTourTitles[t].createdInDB = true; // Mark this tour as created in the DB
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            }
        }

        // if there are new tours, make the create tours button visible and add event listener...
        let createToursBtn = document.querySelector('#tours-to-create .tours-list button')
        createToursBtn.style.visibility = "visible"
        createToursBtn.addEventListener('click', createToursInDB)

    }

}




function actionUpdateVoucherLinks(){


    const checkforExistingVouchers = () => {

        document.querySelector('#vouchers-to-update .voucher-list button').removeEventListener('click', checkforExistingVouchers)
        document.querySelector('#vouchers-to-update .voucher-list button').disabled = true

        let results = document.querySelector('#vouchers-to-update .voucher-list .results')

        let linkPrefix = 'https://voicemap.me/tour/'

        const splitLinks = (link) => {
            return link.split(linkPrefix)[1].split('?')[0].split('/')
        }

        existingTourTitles.map((tour) => {
            if(tour.updateDBLinks) {

                // flip title into URL form
                let urlActiveTitle = tour.TourTitle.TITLE.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-')

                // flip previous title into URL form
                let urlPreviousTitle = tour.allTitles[1].toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-')

                // break a current link to {prefix}/{area}/{title}/{voucher}
                let sampleCsvVoucher = vouchers.find((voucher) => voucher.TOUR_NUM == tour.tourNumber)
                let sampleCsvLinkSplits = splitLinks(sampleCsvVoucher.LINK)

                // get AVAILABLE (not sold) tour vouchers from DB...
                const getTourVouchersFromDB = async (TOUR_NUM) => {
                    // this function fetches voucher items from the database using a GET request with a TOUR_NUM paramenter
                    try {
                        const response = await fetch(`/api/tour-vouchers/${TOUR_NUM}`);
                        if (!response.ok) {
                            throw new Error(`Error fetching vouchers for TOUR ${TOUR_NUM}: ${response.statusText}`);
                        }
                        const data = await response.json();
                        console.log(data.vouchers)
                        return data.vouchers;
                    } catch (error) {
                        console.error('Error:', error);
                        return [];
                    }
                }
                let tourDbVouchers = getTourVouchersFromDB(tour.tourNumber)

                // check to make sure that there were available vouchers returned
                if(tourDbVouchers && tourDbVouchers.lenght == 0){
                    results.innerText = "No available tours were found."
                } else {
                    let sampleDbLinkSplits = splitLinks(tourDbVouchers[0].LINK)

                    let regionStyle = (sampleCsvLinkSplits[0] == sampleDbLinkSplits[0]) ? 'style="font-weight: bold"' : ''


                    results.innerHTML += `<hr /><h3>TOUR #${tour.tourNumber}</h3>`
                    results.innerHTML += `<p>Active Title:   ${tour.TourTitle.TITLE} | <strong>${urlActiveTitle}</strong></p>`
                    results.innerHTML += `<p>Previous Title: ${tour.allTitles[1]} | <italic>${urlPreviousTitle}</italic></p>`
                    results.innerHTML += `<p class="sample-link">CSV SAMPLE LINK: ${linkPrefix}/<span ${regionStyle}>${sampleCsvLinkSplit[0]}</span>/<strong>${sampleCsvLinkSplit[1]}</strong>/?voucher=${sampleCsvVouncher.VOUCHER_ID}</p>`
                    results.innerHTML += `<p class="sample-link">_DB SAMPLE LINK: ${linkPrefix}/<span ${regionStyle}>${sampleDbLinkSplit[0]}</span>/<strong>${sampleDbLinkSplit[1]}</strong>/?voucher=${tourDbVouchers[0].VOUCHER_ID}</p>`
                    results.innerHTML += `<p>Number of Vouchers needing this update: ${tourDbVouchers.length}`

                }



            }
        })

        // let user select to update the vouchers that were found to have (presumably) invalidated links
        document.querySelector('#vouchers-to-update .voucher-list button').innerText = "Update These Vouchers' Links"
        document.querySelector('#vouchers-to-update .voucher-list button').addEventListener('click', ()=>{
            console.log("We'll circle back to this one here, okay?")
        })
        document.querySelector('#vouchers-to-update .voucher-list button').disabled = false;



    }



    // List out the tours that have new Active Titles...
    let toursList = document.querySelector('#vouchers-to-update .voucher-list ul')
    
    if(existingTourTitles.filter((tour) => tour.updateDBLinks).length > 0) {
    // if(!existingTourTitles.length == 0) {
        existingTourTitles.map((tour) => {
            if(tour.updateDBLinks) {
                toursList.innerHTML += `<li>KBT #${tour.tourNumber} - ${tour.TourTitle.TITLE}</li>`
            }
        })

        let updateLinksBtn = document.querySelector('#vouchers-to-update .voucher-list button')
        updateLinksBtn.addEventListener('click', checkforExistingVouchers)
        updateLinksBtn.style.visibility = "visible";

    } else {
        toursList.innerHTML = "<small><i>No tours have new Active Titles.</i></small>"
        document.getElementById('vouchers-to-update').style.color = "lightgray"
    }
}




function  actionCreateVouchers(){

    const uploadVouchersToDB = async () => {
        // This function would be called to create new vouchers based on the current state of the vouchers array...

        document.querySelector('#vouchers-to-upload .upload-to-db button').removeEventListener('click', uploadVouchersToDB)
        document.querySelector('#vouchers-to-upload .upload-to-db button').disabled = true
        console.log("Creating Vouchers in DB...")
        console.log(vouchers)
        

        for (let v = 0; v < vouchers.length; v++){

            // add a filter checking for/against flags added from DB Voucher Check
            if(vouchers[v].dbStatus) continue;

            
            await fetch('/api/add-voucher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vouchers[v])
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                vouchers[v].dbStatus = "uploaded-successfully"; // Mark this voucher as created in the DB
                
            })
            .catch((error) => {
                console.error('Error:', error);
                vouchers[v].dbStatus = "upload-error"; // Mark this voucher as attempted, but errored
            });
            displayVouchers();
        }
        
    }

    // confirm that the "likely-in-database" vouchers are indeed there...
    const confirmVoucherInDB = async () => {
        console.log("gonna check our asumptions...")
        for(let v = 0; v < vouchers.length; v++){
            // console.log(`Working on VOUCHER_ID ${vouchers[v].VOUCHER_ID} | .dbStatus = ${vouchers[v].dbStatus}`)
            if(!vouchers[v].dbStatus || vouchers[v].dbStatus != "likely-in-database") continue;

            console.log("gonna check the DB for VOUCHER_ID: ", vouchers[v].VOUCHER_ID)
            try {
                const response = await fetch(`/api/vouchers/${vouchers[v].VOUCHER_ID}`);
                if (!response.ok) {
                    vouchers[v].dbStatus = null;
                    throw new Error(`Error fetching voucher ${vouchers[v].VOUCHER_ID}: ${response.statusText}`);
                }
                const data = await response.json();
                
                
                if(data.voucher.VOUCHER_ID == vouchers[v].VOUCHER_ID){
                    vouchers[v].dbStatus = "confirmed-in-database"
                };
            } catch (error) {
                vouchers[v].dbStatus = null;
                console.error('Error:', error);
            }

        }
        // update vouchers list UI to display any new info...
        displayVouchers()
        document.querySelector('#vouchers-to-upload .how-to-proceed').style.display = "none"
        document.querySelector('#vouchers-to-upload .upload-to-db').style.display = "block"
        document.querySelector('#vouchers-to-upload .upload-to-db button').addEventListener('click', uploadVouchersToDB)

    }

    // check database for every voucher listed in CSV...
    const deepCheckAllVouchers = async () => {
        window.alert = "I got lazy and haven't written this function yet..."
    }

    const checkForVoucherInDB = async () => {

        // Get One (most recent) voucher from DB...
        // API returns an object with "success:" and "voucher:" elements
        let latestDbVoucher
        try {
            const response = await fetch(`/api/get-latest-voucher`);
            if (!response.ok) {
                throw new Error('Error fetching the single, most recent, voucher...');
            }
            const data = await response.json();
            console.log("Most recent voucher in DB is... ", data.voucher)
            latestDbVoucher = data.voucher;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }

        if(latestDbVoucher){
            // Test it's voucher code + creation Data against current CSV vouchers...
            for (let v = 0; v < vouchers.length; v++){
                if(new Date(vouchers[v].CREATED) > new Date(latestDbVoucher.CREATED)) {
                    // add nothing. element's abscense will be the key
                    console.log("this voucher was newer")
                } else if (vouchers[v].VOUCHER_ID == latestDbVoucher.VOUCHER_ID) {
                    vouchers[v].dbStatus = "confirmed-in-database"
                    console.log("this was the same voucher")
                } else {
                    // if the CREATED date isn't greater that (later / after) the most recent
                    // AND it's not the same voucher, assume it was created on or before
                    // the current voucher and therefore is like to already be in the database
                    vouchers[v].dbStatus = "likely-in-database"
                    console.log("this voucher had the same or earlier creation date")
                }
            }
        }

        // Update UI with results + state we assume that all vouchers with the same + 
        // older CREATED Date are already in the DB. Give Three Options:
        //      1. Proceed with "assumed existing" (and displayed?) vouchers division
        //      2. Check all of the "assumed existing" against DB
        //      3. Check ALL vouchers in CSV against DB
        displayVouchers()
        document.querySelector('#vouchers-to-upload .check-db').style.display = "none"
        document.querySelector('#vouchers-to-upload .how-to-proceed').style.display = "block"

        // listen for and handle "proceed" click
        document.querySelector('#vouchers-to-upload .how-to-proceed button.proceed').addEventListener('click', ()=>{
            document.querySelector('#vouchers-to-upload .how-to-proceed').style.display = "none"
            document.querySelector('#vouchers-to-upload .upload-to-db').style.display = "block"
            document.querySelector('#vouchers-to-upload .upload-to-db button').addEventListener('click', uploadVouchersToDB)
        })

        // listen for "check" click
        document.querySelector('#vouchers-to-upload .how-to-proceed button.check').addEventListener('click', confirmVoucherInDB)

        // listen for "deep check" click
        document.querySelector('#vouchers-to-upload .how-to-proceed button.deep-check').addEventListener('click', deepCheckAllVouchers)


        


        // Handle each choice + notate & display results
        
        

        //  Enable "Upload Vouchers" Btn 

    }



    // need to find then activate the button...
    let checkDbVouchersBtn = document.querySelector('#vouchers-to-upload .check-db button')
    checkDbVouchersBtn.addEventListener('click', checkForVoucherInDB)
    checkDbVouchersBtn.style.color = "blue"
    let uploadVouchersBtn = document.querySelector('#vouchers-to-upload .upload-to-db button')
    uploadVouchersBtn.dsabled = true

}



fileInput.addEventListener('change', async function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            var lines = this.result.split(/\r\n|\n/);
            var startAt = lines[0].split(",")[0] == "Voucher Name" ? 1 : 0;
            console.log(startAt);
            for (var line = startAt; line < lines.length - 1; line++) {
                // console.log(line + ' --> ' + lines[line]);
                //   var columns = lines[line].split(",");
                // split each line into an array of columns
                var columns = lines[line].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                if (columns[1] == "") continue; // skip empty lines
                var voucher = {
                    "VOUCHER_ID": columns[0],
                    "TourTitle": columns[1].replace(/^"|"$/g, ''),
                    "Quantity": columns[2],
                    "REDEEMED": columns[3] == "0" ? false : true,
                    "State": columns[4],
                    "TOUR_NUM": null,
                    "LINK": columns[5],
                    "AVAILABLE": columns[3] == "0" ? true : false,
                    "CREATED": columns[6],
                    "PURCHASED": null,      //Date()
                    "TRANSACTION_ID": null  //Str / Foreign Key
                }
                vouchers.push(voucher);
                if (voucher.REDEEMED != "1") availableVouchers.push(voucher);

                var foundIt = false;
                if (tourTitles.length > 0) {
                    for (var t = 0; t < tourTitles.length; t++) {
                        if (columns[1].replace(/^"|"$/g, '') == tourTitles[t].TITLE) {
                            tourTitles[t].COUNT += 1;
                            foundIt = true;
                            break;
                        }
                    }
                }
                if (!foundIt) {
                    tourTitles.push({
                        "TITLE": columns[1].replace(/^"|"$/g, ''),
                        "COUNT": 1
                    })
                }
                //   if(!tourTitles.includes(columns[1])) tourTitles.push(columns[1]);

            }


            console.log("vouchers = ", vouchers);
            console.log("tourTitles = ", tourTitles);


            // const content = e.target.result;
            // document.getElementById('output').innerText = content;
            document.getElementById('output').innerHTML += `<p>Vouchers to add: ${vouchers.length} | Available vouchers: ${availableVouchers.length}</p>`;
        };
        reader.readAsText(file);
    }

    // GET EXISTING TOURS & TOUR NAMES
    try {

        const response = await fetch('../api/query-table');
        const data = await response.json();
        toursInDB = data.Items;
        Object.freeze(toursInDB);
        for (let o = 0; o < toursInDB.length; o++) {
            Object.freeze(toursInDB[o].TITLES)
            Object.freeze(toursInDB[o])
        }

        console.log("toursInDB = ", toursInDB)
    } catch (error) {
        console.log(error);
    };


    // let toursInDBLocal = await JSON.parse('[{"TOUR_REGION":"KBT","TOUR":1,"TITLES":["Birth to Boom Driving Tour - Single Day"]},{"TOUR_REGION":"KBT","TOUR":2,"TITLES":["Birth to Boom Driving Tour - Single Day"]},{"TOUR_REGION":"KBT","TOUR":4,"TITLES":["Kentucky Bourbon: Birth to Boom"]}]')


    // COMPARE NEW VOURCHERS' TOUR NAMES AGAINST EXISTING TOUR NAMES

    for (var nt = 0; nt < tourTitles.length; nt++) {
        let titleExists = false;
        let tourNumber = null;
        for (var et = 0; et < toursInDB.length; et++) {
            if (toursInDB[et].TITLES[0] == tourTitles[nt].TITLE) {
                titleExists = true;
                tourNumber = et;
                console.log("Found tour - ", tourTitles[nt].TITLE, " - in TOUR ", toursInDB[et].TOUR_NUM, ". --> ", toursInDB[et].TITLES);
            }
        }
        if (!titleExists) {
            console.log("New Tour Name: ", tourTitles[nt].TITLE);
            newTourTitles.push({
                "TourTitle": tourTitles[nt],
                "confirmed": false
            });
        } else {
            console.log("Existing Tour Name: ", tourTitles[nt].TITLE);

            existingTourTitles.push({
                "TourTitle": tourTitles[nt],
                "allTitles": toursInDB[tourNumber].TITLES,
                "tourNumber": toursInDB[tourNumber].TOUR_NUM,
                "dbIndex": tourNumber,
                "confirmed": false
            });
        }
    }

    console.log("after initial sorting...")
    console.log(existingTourTitles)
    console.log(newTourTitles)

    displayVouchers();
    displayTourTitleResults();


});


