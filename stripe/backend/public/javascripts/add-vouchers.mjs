
let fileInput = document.getElementById('fileInput');
if(fileInput) console.log("found fileInput!");


let vouchers = [];
let tourTitles = [];
let availableVouchers = [];
let newTourTitles = [];
let existingTourTitles = [];



const handleNewTourTrue = (e) => {
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked, and found this array index: ",i)
    console.log("Tour Title in question is -> ", newTourTitles[i].TITLE)
}


const handleNewTourFalse = (e) => {
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked, and found this array index: ",i)
    console.log("Tour Title in question is -> ", newTourTitles[i].TITLE)
}


const handleExistingTourTrue = (e) => {
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked, and found this array index: ",i)
    console.log("Tour Title in question is -> ", existingTourTitles[i].TourTitle.TITLE)
}


const handleExistingTourChange = (e) => {
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked, and found this array index: ",i)
    console.log("Tour Title in question is -> ", existingTourTitles[i].TourTitle.TITLE)
}


const handleExistingTourFalse = (e) => {
    
    let i = e.target.dataset.tourIndex;
    console.log("Clicked, and found this array index: ",i)
    console.log("Tour Title in question is -> ", existingTourTitles[i].TourTitle.TITLE)
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
            console.log(vouchers);
            console.log(tourTitles);
            const content = e.target.result;
            document.getElementById('output').innerText = content;
            document.getElementById('output').innerHTML += `
            
            <p>Vouchers to add: ${vouchers.length}</p>
            <p>Available vouchers: ${availableVouchers.length}</p>
            `;
        };
        reader.readAsText(file);
    }
    console.log("...try dynamo.mjs 2...");

    // GET EXISTING TOURS & TOUR NAMES
    let toursInDB;
    try {
        const response = await fetch('../api/query-table');
        const data = await response.json();
        // console.log("fetched data...", data)
        toursInDB = data.Items;
    } catch (error) {
        console.log(error);
    };

    console.log(toursInDB);

    // COMPARE NEW VOURCHERS' TOUR NAMES AGAINST EXISTING TOUR NAMES

    console.log("and now to compare...", tourTitles.length);

    // let newTourTitles = [];
    // let existingTourTitles = [];

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
                "tourNumber": tourNumber
            });
        }
    }

    //  DISPLAY RESULTS AND GET CONFIRMATION
    document.getElementById('results').style.display = "inline-block";

    // insert new Tours
    if(newTourTitles.length < 1){
        document.getElementById('new-tours').innerText += `No New Tours`;
    } else {
        for (var nt = 0; nt < newTourTitles.length; nt++){
            document.getElementById('new-tours').innerHTML += `
            <div>
                <p>
                    ${newTourTitles[nt].TITLE} | ${newTourTitles[nt].COUNT}
                    <button class="new-tour-true" data-tour-index="${nt}" onclick="handleNewTourTrue(event)">Yes, it's a new tour</button>
                    <button class="new-tour-false" data-tour-index="${nt}" onclick="handleNewTourFalse(event)">No, not a new tour</button>
                </p>
            </div>
            `
        }
    }


    //  insert existing tours that have new vouchers in the uploaded csv...
    if(existingTourTitles.length < 1){

    } else {
        for (var et = 0; et < existingTourTitles.length; et++){
            document.getElementById('existing-tours').innerHTML += `
                <div>
                    <p>
                        ${existingTourTitles[et].TourTitle.TITLE} | ${existingTourTitles[et].TourTitle.COUNT}
                        <button class="existing-tour-true" data-tour-index="${et}" onclick="handleExistingTourTrue(event)">Yes, this is the right tour</button>
                        <button class="existing-tour-change" data-tour-index="${et}" onclick="handleExistingTourChange(event)">Yes, BUT this is a different tour</button>
                        <button class="existing-tour-false" data-tour-index="${et}" onclick="handleExistingTourFalse(event)">No, this is a new tour</button>
                    </p>
                `;

            let tourNumber = existingTourTitles[et].tourNumber;

            if(toursInDB[tourNumber].TITLES.length > 1){
                document.getElementById('existing-tours').innerHTML += `
                    <p class='alt-titles'><small> AKA: 
                    `;
                for (var alts = 0; alts < toursInDB[tourNumber].TITLES.length; alts++){
                    document.getElementById('existing-tours').innerHTML += `
                    "${toursInDB[tourNumber].TITLES[alts]}"  
                    `;
                }
                document.getElementById('existing-tours').innerHTML += `
                    </small></p>
                    `;

            }

            document.getElementById('existing-tours').innerHTML += `
                </div>
                `;
        }
    }
    
});


