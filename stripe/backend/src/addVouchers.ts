
"use strict"

import type { CSVVoucher, DBVoucher, TourTitle, Tour, ExistingTourTitle, NewTourTitle } from './types';





export let vouchers: CSVVoucher[] = [];
let tourTitles: TourTitle[] = [];
let availableVouchers = [];
export let toursInDB: Tour[] = [];
export let newTourTitles: NewTourTitle[] = [];
export let existingTourTitles: ExistingTourTitle[] = [];



import { togglePopUp } from './lib/togglePopUp';
import { displayTourTitleResults } from './lib/displayTourTitleResults';
import { displayVouchers } from './lib/displayVouchers';
import { checkAllConfirmed } from './lib/checkAllConfirmed';


// handlers for initial listing of tour titles...
import { handleNewTourTrue, handleNewTourFalse, handleNewTourFalseSelection, handleExistingTourTrue, handleExistingTourChange, handleExistingTourFalse } from './lib/tourListHandlers';
// add Tour Title Handlers to global window object so they can be called from HTML...
   (window as any).handleExistingTourTrue = handleExistingTourTrue;
   (window as any).handleExistingTourChange = handleExistingTourChange;
   (window as any).handleExistingTourFalse = handleExistingTourFalse;
   (window as any).handleNewTourTrue = handleNewTourTrue;
   (window as any).handleNewTourFalse = handleNewTourFalse;
   (window as any).handleNewTourFalseSelection = handleNewTourFalseSelection;



// import Action Step methods for after the Tour Titles have been confirmed...
import { actionCreateVouchers } from './lib/actionCreateVouchers';
import { actionUpdateTours } from './lib/actionUpdateTours';
import { actionCreateTours } from './lib/actionCreateTours';
import { actionUpdateVoucherLinks } from './lib/actionUpdateVoucherLinks';







let fileInput = document.getElementById('fileInput') as HTMLInputElement;


document.getElementById('close-pop-up')!.addEventListener("click", togglePopUp);

















// should not ever need to use this on a newly-imported voucher CSV
function updateVoucherTitle(ogTitle: string, newTitle: string) {
    // update voucher.Title
    for(let v = 0; v < vouchers.length; v++){
        if(ogTitle == vouchers[v].TourTitle) vouchers[v].TourTitle = newTitle
    }
}

// ...actually, should not ever need to use this at this stage
// ...it would likely mess things up way too much
function updateVoucherLinks(ogTitle: string, newTitle: string, ogLink: string){

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



export function displayActionItems(){
    console.log("display action items...")
    document.getElementById('action-items')!.style.display = 'flex';

    // check existingTourTitles for updated titles...
    actionUpdateTours()

    // check newTourTitles for listing...
    actionCreateTours()

    actionUpdateVoucherLinks()

    actionCreateVouchers()

}





fileInput.addEventListener('change', async function (event) {
    const file = (event.target as HTMLInputElement).files![0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            let textResult: string;
            if (typeof this.result === "string") {
                textResult = this.result;
            } else if (this.result instanceof ArrayBuffer) {
                textResult = new TextDecoder().decode(this.result);
            } else {
                throw new Error("Unsupported file type");
            }
            var lines = textResult.split(/\r\n|\n/);
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
                if (voucher.REDEEMED) availableVouchers.push(voucher);

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
            document.getElementById('output')!.innerHTML += `<p>Vouchers to add: ${vouchers.length} | Available vouchers: ${availableVouchers.length}</p>`;
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
        } else if (tourNumber != null) {
            console.log("Existing Tour Name: ", tourTitles[nt].TITLE);

            existingTourTitles.push({
                "TourTitle": tourTitles[nt],
                "allTitles": toursInDB[tourNumber].TITLES,
                "tourNumber": toursInDB[tourNumber].TOUR_NUM,
                "dbIndex": tourNumber,
                "confirmed": false,
                "published": toursInDB[tourNumber].VM_PUBLISHED
            });
        }
    }

    console.log("after initial sorting...")
    console.log(existingTourTitles)
    console.log(newTourTitles)

    displayVouchers();
    displayTourTitleResults();

});


