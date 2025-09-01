
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
import { get } from 'http';
import { read } from 'fs';
// add the actions to the global window object so they can be called from HTML...
    (window as any).actionCreateVouchers = actionCreateVouchers;
    (window as any).actionUpdateTours = actionUpdateTours;
    (window as any).actionCreateTours = actionCreateTours;
    (window as any).actionUpdateVoucherLinks = actionUpdateVoucherLinks;







let fileInput = document.getElementById('fileInput') as HTMLInputElement;


document.getElementById('close-pop-up')!.addEventListener("click", togglePopUp);


















export function displayActionItems(){
    document.getElementById('action-items')!.style.display = 'flex';

    // check existingTourTitles for updated titles...
    actionUpdateTours()

    // check newTourTitles for listing...
    actionCreateTours()

    actionUpdateVoucherLinks()

    actionCreateVouchers()
}




async function readCSVFile(file: File) {
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
        
        for (var line = startAt; line < lines.length - 1; line++) {

            
            var columns = lines[line].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);   // split each line into an array of columns
            if (columns[1] == "") continue;                                     // skip empty lines
            var voucher: CSVVoucher = {
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
            if (!voucher.REDEEMED) availableVouchers.push(voucher);

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
        }

        console.log("vouchers = ", vouchers);
        console.log("tourTitles = ", tourTitles);

        document.getElementById('output')!.innerHTML += `<p>Vouchers to add: ${vouchers.length} | Available vouchers: ${availableVouchers.length}</p>`;
    };
    reader.readAsText(file);
}




async function getToursInDB() {
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
}







fileInput.addEventListener('change', async function (event) {
    const file = (event.target as HTMLInputElement).files![0];

    if (file) await readCSVFile(file);

    // GET EXISTING TOURS & TOUR NAMES
    // load it into the global toursInDB variable...
    await getToursInDB();

    // COMPARE TOUR NAMES IN CSV AGAINST EXISTING TOUR NAMES FROM THE DB

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


