/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/addVouchers.ts":
/*!****************************!*\
  !*** ./src/addVouchers.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   displayActionItems: () => (/* binding */ displayActionItems),
/* harmony export */   existingTourTitles: () => (/* binding */ existingTourTitles),
/* harmony export */   newTourTitles: () => (/* binding */ newTourTitles),
/* harmony export */   toursInDB: () => (/* binding */ toursInDB),
/* harmony export */   vouchers: () => (/* binding */ vouchers)
/* harmony export */ });
/* harmony import */ var _lib_togglePopUp__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/togglePopUp */ "./src/lib/togglePopUp.ts");
/* harmony import */ var _lib_displayTourTitleResults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/displayTourTitleResults */ "./src/lib/displayTourTitleResults.ts");
/* harmony import */ var _lib_displayVouchers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/displayVouchers */ "./src/lib/displayVouchers.ts");
/* harmony import */ var _lib_tourListHandlers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/tourListHandlers */ "./src/lib/tourListHandlers.ts");
/* harmony import */ var _lib_actionCreateVouchers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/actionCreateVouchers */ "./src/lib/actionCreateVouchers.ts");
/* harmony import */ var _lib_actionUpdateTours__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/actionUpdateTours */ "./src/lib/actionUpdateTours.ts");
/* harmony import */ var _lib_actionCreateTours__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/actionCreateTours */ "./src/lib/actionCreateTours.ts");
/* harmony import */ var _lib_actionUpdateVoucherLinks__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/actionUpdateVoucherLinks */ "./src/lib/actionUpdateVoucherLinks.ts");

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let vouchers = [];
let tourTitles = [];
let availableVouchers = [];
let toursInDB = [];
let newTourTitles = [];
let existingTourTitles = [];



// handlers for initial listing of tour titles...

// add Tour Title Handlers to global window object so they can be called from HTML...
window.handleExistingTourTrue = _lib_tourListHandlers__WEBPACK_IMPORTED_MODULE_3__.handleExistingTourTrue;
window.handleExistingTourChange = _lib_tourListHandlers__WEBPACK_IMPORTED_MODULE_3__.handleExistingTourChange;
window.handleExistingTourFalse = _lib_tourListHandlers__WEBPACK_IMPORTED_MODULE_3__.handleExistingTourFalse;
window.handleNewTourTrue = _lib_tourListHandlers__WEBPACK_IMPORTED_MODULE_3__.handleNewTourTrue;
window.handleNewTourFalse = _lib_tourListHandlers__WEBPACK_IMPORTED_MODULE_3__.handleNewTourFalse;
window.handleNewTourFalseSelection = _lib_tourListHandlers__WEBPACK_IMPORTED_MODULE_3__.handleNewTourFalseSelection;
// import Action Step methods for after the Tour Titles have been confirmed...




// add the actions to the global window object so they can be called from HTML...
window.actionCreateVouchers = _lib_actionCreateVouchers__WEBPACK_IMPORTED_MODULE_4__.actionCreateVouchers;
window.actionUpdateTours = _lib_actionUpdateTours__WEBPACK_IMPORTED_MODULE_5__.actionUpdateTours;
window.actionCreateTours = _lib_actionCreateTours__WEBPACK_IMPORTED_MODULE_6__.actionCreateTours;
window.actionUpdateVoucherLinks = _lib_actionUpdateVoucherLinks__WEBPACK_IMPORTED_MODULE_7__.actionUpdateVoucherLinks;
let fileInput = document.getElementById('fileInput');
document.getElementById('close-pop-up').addEventListener("click", _lib_togglePopUp__WEBPACK_IMPORTED_MODULE_0__.togglePopUp);
function displayActionItems() {
    document.getElementById('action-items').style.display = 'flex';
    // check existingTourTitles for updated titles...
    (0,_lib_actionUpdateTours__WEBPACK_IMPORTED_MODULE_5__.actionUpdateTours)();
    // check newTourTitles for listing...
    (0,_lib_actionCreateTours__WEBPACK_IMPORTED_MODULE_6__.actionCreateTours)();
    (0,_lib_actionUpdateVoucherLinks__WEBPACK_IMPORTED_MODULE_7__.actionUpdateVoucherLinks)();
    (0,_lib_actionCreateVouchers__WEBPACK_IMPORTED_MODULE_4__.actionCreateVouchers)();
}
function readCSVFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const reader = new FileReader();
        reader.onload = function (e) {
            let textResult;
            if (typeof this.result === "string") {
                textResult = this.result;
            }
            else if (this.result instanceof ArrayBuffer) {
                textResult = new TextDecoder().decode(this.result);
            }
            else {
                throw new Error("Unsupported file type");
            }
            var lines = textResult.split(/\r\n|\n/);
            var startAt = lines[0].split(",")[0] == "Voucher Name" ? 1 : 0;
            for (var line = startAt; line < lines.length - 1; line++) {
                var columns = lines[line].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // split each line into an array of columns
                if (columns[1] == "")
                    continue; // skip empty lines
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
                    "PURCHASED": null, //Date()
                    "TRANSACTION_ID": null //Str / Foreign Key
                };
                vouchers.push(voucher);
                if (voucher.REDEEMED)
                    availableVouchers.push(voucher);
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
                    });
                }
            }
            console.log("vouchers = ", vouchers);
            console.log("tourTitles = ", tourTitles);
            document.getElementById('output').innerHTML += `<p>Vouchers to add: ${vouchers.length} | Available vouchers: ${availableVouchers.length}</p>`;
        };
        reader.readAsText(file);
    });
}
function getToursInDB() {
    return __awaiter(this, void 0, void 0, function* () {
        // GET EXISTING TOURS & TOUR NAMES
        try {
            const response = yield fetch('../api/query-table');
            const data = yield response.json();
            toursInDB = data.Items;
            Object.freeze(toursInDB);
            for (let o = 0; o < toursInDB.length; o++) {
                Object.freeze(toursInDB[o].TITLES);
                Object.freeze(toursInDB[o]);
            }
            console.log("toursInDB = ", toursInDB);
        }
        catch (error) {
            console.log(error);
        }
        ;
    });
}
fileInput.addEventListener('change', function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = event.target.files[0];
        if (file)
            yield readCSVFile(file);
        // GET EXISTING TOURS & TOUR NAMES
        // load it into the global toursInDB variable...
        yield getToursInDB();
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
            }
            else if (tourNumber != null) {
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
        console.log("after initial sorting...");
        console.log(existingTourTitles);
        console.log(newTourTitles);
        (0,_lib_displayVouchers__WEBPACK_IMPORTED_MODULE_2__.displayVouchers)();
        (0,_lib_displayTourTitleResults__WEBPACK_IMPORTED_MODULE_1__.displayTourTitleResults)();
    });
});


/***/ }),

/***/ "./src/lib/actionCreateTours.ts":
/*!**************************************!*\
  !*** ./src/lib/actionCreateTours.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionCreateTours: () => (/* binding */ actionCreateTours)
/* harmony export */ });
/* harmony import */ var _addVouchers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../addVouchers */ "./src/addVouchers.ts");

function actionCreateTours() {
    let toursList = document.querySelector('#tours-to-create .tours-list ul');
    toursList.style.visibility = "visible";
    // check against an empty array
    if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles.length == 0) {
        toursList.innerHTML += '<li><small><italic>No new tours found.</italic></small></li>';
        document.getElementById('tours-to-create').style.color = "lightgray";
    }
    else {
        // list out any newTourTitles
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles.map((tour) => {
            toursList.innerHTML += `<li class="new-tour" data-tour="${tour.tourNumber}">KBT #${tour.tourNumber} - ${tour.TourTitle.TITLE}</li>`;
        });
        // function for handling the button click to create tours in the database...
        const createToursInDB = () => {
            // this function sends the new tours to the backend API to create new tours in the database...
            console.log("Creating Tours in DB...");
            console.log(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles);
            for (let t = 0; t < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles.length; t++) {
                fetch('/api/create-tour', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "TOUR_REGION": "KBT", // Using a fixed region for now...
                        "TOUR_NUM": _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t].tourNumber,
                        "TITLES": [_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t].TourTitle.TITLE], // Assuming single title for new tours...
                        "VM_PUBLISHED": _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t].published
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                    console.log('Success:', data);
                    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t].createdInDB = true; // Mark this tour as created in the DB
                    document.querySelector(`#tours-to-create>.tours-list>ul>li[data-tour="${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t].tourNumber}"]`).classList.add('success');
                    createToursBtn.disabled = true;
                })
                    .catch((error) => {
                    console.error('Error:', error);
                    document.querySelector(`#tours-to-create>.tours-list>ul>li[data-tour="${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t].tourNumber}"]`).classList.add('failure');
                });
            }
        };
        // if there are new tours, make the create tours button visible and add event listener...
        let createToursBtn = document.querySelector('#tours-to-create .tours-list button');
        createToursBtn.style.visibility = "visible";
        createToursBtn.addEventListener('click', createToursInDB);
    }
}


/***/ }),

/***/ "./src/lib/actionCreateVouchers.ts":
/*!*****************************************!*\
  !*** ./src/lib/actionCreateVouchers.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionCreateVouchers: () => (/* binding */ actionCreateVouchers)
/* harmony export */ });
/* harmony import */ var _addVouchers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../addVouchers */ "./src/addVouchers.ts");
/* harmony import */ var _displayVouchers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./displayVouchers */ "./src/lib/displayVouchers.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


function actionCreateVouchers() {
    const uploadVouchersToDB = () => __awaiter(this, void 0, void 0, function* () {
        // This function would be called to create new vouchers based on the current state of the vouchers array...
        document.querySelector('#vouchers-to-upload .upload-to-db button').removeEventListener('click', uploadVouchersToDB);
        document.querySelector('#vouchers-to-upload .upload-to-db button').disabled = true;
        console.log("Creating Vouchers in DB...");
        console.log(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers);
        //  update the CREATED attribute of the 0000_MOST_RECENT voucher in DB...
        let mostRecentCreated;
        const updateMostRecentVoucher = (newMostRecent) => __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield fetch(`api/update-latest-voucher/${newMostRecent}`);
                if (!response.ok)
                    throw new Error(`Error updating 0000_MOST_RECENT voucher to ${newMostRecent}: ${response}`);
                const data = yield response.json();
                return data.voucher.CREATED;
            }
            catch (error) {
                console.error('Errps:', error);
                return null;
            }
        });
        for (let v = 0; v < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers.length; v++) {
            // add a filter checking for/against flags added from DB Voucher Check
            if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus)
                continue;
            yield fetch('/api/add-voucher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v])
            })
                .then(response => response.json())
                .then(data => {
                console.log('Success:', data);
                _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus = "uploaded-successfully"; // Mark this voucher as created in the DB
            })
                .catch((error) => {
                console.error('Error:', error);
                _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus = "upload-error"; // Mark this voucher as attempted, but errored
            });
            // call method to update 0000_MOST_RECENT
            if ((!mostRecentCreated && _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus == "uploaded-successfully") || (mostRecentCreated < new Date(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].CREATED).valueOf())) {
                mostRecentCreated = yield updateMostRecentVoucher(new Date(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].CREATED).valueOf());
            }
            (0,_displayVouchers__WEBPACK_IMPORTED_MODULE_1__.displayVouchers)();
        }
    });
    // confirm that the "likely-in-database" vouchers are indeed there...
    const confirmVoucherInDB = () => __awaiter(this, void 0, void 0, function* () {
        console.log("gonna check our asumptions...");
        for (let v = 0; v < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers.length; v++) {
            // console.log(`Working on VOUCHER_ID ${vouchers[v].VOUCHER_ID} | .dbStatus = ${vouchers[v].dbStatus}`)
            if (!_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus || _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus != "likely-in-database")
                continue;
            console.log("gonna check the DB for VOUCHER_ID: ", _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].VOUCHER_ID);
            try {
                const response = yield fetch(`/api/vouchers/${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].VOUCHER_ID}`);
                if (!response.ok) {
                    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus = null;
                    throw new Error(`Error fetching voucher ${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].VOUCHER_ID}: ${response.statusText}`);
                }
                const data = yield response.json();
                if (data.voucher.VOUCHER_ID == _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].VOUCHER_ID) {
                    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus = "confirmed-in-database";
                }
                ;
            }
            catch (error) {
                _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus = null;
                console.error('Error:', error);
            }
        }
        // update vouchers list UI to display any new info...
        (0,_displayVouchers__WEBPACK_IMPORTED_MODULE_1__.displayVouchers)();
        document.querySelector('#vouchers-to-upload .how-to-proceed').style.display = "none";
        document.querySelector('#vouchers-to-upload .upload-to-db').style.display = "block";
        document.querySelector('#vouchers-to-upload .upload-to-db button').addEventListener('click', uploadVouchersToDB);
    });
    // check database for every voucher listed in CSV...
    const deepCheckAllVouchers = () => __awaiter(this, void 0, void 0, function* () {
        window.alert("I got lazy and haven't written this function yet...");
    });
    const checkForVoucherInDB = () => __awaiter(this, void 0, void 0, function* () {
        // Get the 0000_MOST_RECENT voucher from DB...
        // API returns an object with "success:" and "voucher:" elements
        let latestDbVoucher;
        try {
            const response = yield fetch(`/api/get-latest-voucher`);
            if (!response.ok) {
                throw new Error('Error fetching the single, most recent, voucher...');
            }
            const data = yield response.json();
            console.log("Most recent voucher in DB is... ", data.voucher);
            latestDbVoucher = data.voucher;
        }
        catch (error) {
            console.error('Error:', error);
            return [];
        }
        if (latestDbVoucher) {
            // Test it's voucher code + creation Data against current CSV vouchers...
            for (let v = 0; v < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers.length; v++) {
                // console.log(new Date(vouchers[v].CREATED), ' > ', new Date(latestDbVoucher.CREATED), ' ? : ', (new Date(vouchers[v].CREATED) > new Date(latestDbVoucher.CREATED)));
                if (new Date(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].CREATED) > new Date(latestDbVoucher.CREATED)) {
                    // add nothing. element's abscense will be the key
                    console.log("this voucher was newer");
                }
                else if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].VOUCHER_ID == latestDbVoucher.VOUCHER_ID) {
                    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus = "confirmed-in-database";
                    console.log("this was the same voucher");
                }
                else {
                    // if the CREATED date isn't greater that (later / after) the most recent
                    // AND it's not the same voucher, assume it was created on or before
                    // the current voucher and therefore is like to already be in the database
                    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].dbStatus = "likely-in-database";
                    console.log("this voucher had the same or earlier creation date");
                }
            }
        }
        // Update UI with results + state we assume that all vouchers with the same + 
        // older CREATED Date are already in the DB. Give Three Options:
        //      1. Proceed with "assumed existing" (and displayed?) vouchers division
        //      2. Check all of the "assumed existing" against DB
        //      3. Check ALL vouchers in CSV against DB
        (0,_displayVouchers__WEBPACK_IMPORTED_MODULE_1__.displayVouchers)();
        document.querySelector('#vouchers-to-upload .check-db').style.display = "none";
        document.querySelector('#vouchers-to-upload .how-to-proceed').style.display = "block";
        // listen for and handle "proceed" click
        document.querySelector('#vouchers-to-upload .how-to-proceed button.proceed').addEventListener('click', () => {
            document.querySelector('#vouchers-to-upload .how-to-proceed').style.display = "none";
            document.querySelector('#vouchers-to-upload .upload-to-db').style.display = "block";
            document.querySelector('#vouchers-to-upload .upload-to-db button').addEventListener('click', uploadVouchersToDB);
        });
        // listen for "check" click
        document.querySelector('#vouchers-to-upload .how-to-proceed button.check').addEventListener('click', confirmVoucherInDB);
        // listen for "deep check" click
        document.querySelector('#vouchers-to-upload .how-to-proceed button.deep-check').addEventListener('click', deepCheckAllVouchers);
        // Handle each choice + notate & display results
        //  Enable "Upload Vouchers" Btn 
    });
    // need to find then activate the button...
    let checkDbVouchersBtn = document.querySelector('#vouchers-to-upload .check-db button');
    checkDbVouchersBtn.addEventListener('click', checkForVoucherInDB);
    checkDbVouchersBtn.style.color = "blue";
    let uploadVouchersBtn = document.querySelector('#vouchers-to-upload .upload-to-db button');
    uploadVouchersBtn.disabled = true;
}


/***/ }),

/***/ "./src/lib/actionUpdateTours.ts":
/*!**************************************!*\
  !*** ./src/lib/actionUpdateTours.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionUpdateTours: () => (/* binding */ actionUpdateTours)
/* harmony export */ });
/* harmony import */ var _addVouchers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../addVouchers */ "./src/addVouchers.ts");

function actionUpdateTours() {
    let needUpdating = false;
    let toursList = document.querySelector('#tours-to-update .tours-list tbody');
    // check existingTourTitles for updated titles and display results...
    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.map((tour) => {
        if (tour.updateDBLinks) {
            needUpdating = true;
            let newTableHTML = '';
            newTableHTML += `
            <tr>
                <td>
                    <p>${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[tour.dbIndex].TOUR_REGION} #${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[tour.dbIndex].TOUR_NUM}</p>
            `;
            for (let t = 0; t < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[tour.dbIndex].TITLES.length; t++) {
                newTableHTML += `
                    <p>${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[tour.dbIndex].TITLES[t]}</p>
            `;
            }
            newTableHTML += `
                </td>
                <td>
                    <p>${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[tour.dbIndex].TOUR_REGION} #${tour.tourNumber}</p>
            `;
            for (let t = 0; t < tour.allTitles.length; t++) {
                newTableHTML += `
                    <p>${tour.allTitles[t]}</p>
            `;
            }
            newTableHTML += `
                </td>
            </tr>
            
            `;
            toursList.innerHTML += newTableHTML;
            toursList.style.visibility = "visible";
        }
    });
    // function for the button to update tours in the database...
    const updateToursInDB = () => {
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.map((tour) => {
            // This function would typically involve sending the updated tour information to the backend API to update the database...
            if (tour.updateDBLinks) {
                console.log("Updating Tour in DB...");
                console.log(tour);
                fetch('/api/update-tour', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "TOUR_REGION": _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[tour.dbIndex].TOUR_REGION,
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
        });
    };
    // if no tours were found in need of updates, give message
    if (!needUpdating) {
        document.querySelector('#tours-to-update .tours-list').innerHTML = "<ul><li><i><small>No tours found needing title updates.</small></i></li></ul>";
        document.getElementById('tours-to-update').style.color = "lightgray";
    }
    // otherwise, make the update button visible and add event listener...
    else {
        let updateToursBtn = document.querySelector('#tours-to-update .tours-list button');
        updateToursBtn.style.visibility = "visible";
        updateToursBtn.addEventListener('click', updateToursInDB);
    }
}


/***/ }),

/***/ "./src/lib/actionUpdateVoucherLinks.ts":
/*!*********************************************!*\
  !*** ./src/lib/actionUpdateVoucherLinks.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionUpdateVoucherLinks: () => (/* binding */ actionUpdateVoucherLinks)
/* harmony export */ });
/* harmony import */ var _addVouchers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../addVouchers */ "./src/addVouchers.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

function actionUpdateVoucherLinks() {
    const checkforExistingVouchers = () => {
        document.querySelector('#vouchers-to-update .voucher-list button').removeEventListener('click', checkforExistingVouchers);
        document.querySelector('#vouchers-to-update .voucher-list button').disabled = true;
        let results = document.querySelector('#vouchers-to-update .voucher-list .results');
        let linkPrefix = 'https://voicemap.me/tour/';
        const splitLinks = (link) => {
            return link.split(linkPrefix)[1].split('?')[0].split('/');
        };
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.map((tour) => __awaiter(this, void 0, void 0, function* () {
            if (tour.updateDBLinks) {
                // flip title into URL form
                let urlActiveTitle = tour.TourTitle.TITLE.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
                // flip previous title into URL form
                let urlPreviousTitle = tour.allTitles[1].toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
                // break a current link to {prefix}/{area}/{title}/{voucher}
                let sampleCsvVoucher = _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers.find((voucher) => voucher.TOUR_NUM == tour.tourNumber);
                let sampleCsvLinkSplits = splitLinks(sampleCsvVoucher.LINK);
                // get AVAILABLE (not sold) tour vouchers from DB...
                const getTourVouchersFromDB = (TOUR_NUM) => __awaiter(this, void 0, void 0, function* () {
                    // this function fetches voucher items from the database using a GET request with a TOUR_NUM paramenter
                    try {
                        const response = yield fetch(`/api/tour-vouchers/${TOUR_NUM}`);
                        if (!response.ok) {
                            throw new Error(`Error fetching vouchers for TOUR ${TOUR_NUM}: ${response.statusText}`);
                        }
                        const data = yield response.json();
                        console.log(data.vouchers);
                        return data.vouchers;
                    }
                    catch (error) {
                        console.error('Error:', error);
                        return [];
                    }
                });
                let tourDbVouchers = yield getTourVouchersFromDB(tour.tourNumber);
                // check to make sure that there were available vouchers returned
                if (tourDbVouchers && tourDbVouchers.length == 0) {
                    results.innerText = "No available tours were found.";
                }
                else {
                    let sampleDbLinkSplits = splitLinks(tourDbVouchers[0].LINK);
                    let regionStyle = (sampleCsvLinkSplits[0] == sampleDbLinkSplits[0]) ? 'style="font-weight: bold"' : '';
                    results.innerHTML += `<hr /><h3>TOUR #${tour.tourNumber}</h3>`;
                    results.innerHTML += `<p>Active Title:   ${tour.TourTitle.TITLE} | <strong>${urlActiveTitle}</strong></p>`;
                    results.innerHTML += `<p>Previous Title: ${tour.allTitles[1]} | <italic>${urlPreviousTitle}</italic></p>`;
                    results.innerHTML += `<p class="sample-link">CSV SAMPLE LINK: ${linkPrefix}/<span ${regionStyle}>${sampleCsvLinkSplits[0]}</span>/<strong>${sampleCsvLinkSplits[1]}</strong>/?voucher=${sampleCsvVoucher.VOUCHER_ID}</p>`;
                    results.innerHTML += `<p class="sample-link">_DB SAMPLE LINK: ${linkPrefix}/<span ${regionStyle}>${sampleDbLinkSplits[0]}</span>/<strong>${sampleDbLinkSplits[1]}</strong>/?voucher=${tourDbVouchers[0].VOUCHER_ID}</p>`;
                    results.innerHTML += `<p>Number of Vouchers needing this update: ${tourDbVouchers.length}`;
                }
            }
        }));
        // let user select to update the vouchers that were found to have (presumably) invalidated links
        document.querySelector('#vouchers-to-update .voucher-list button').innerText = "Update These Vouchers' Links";
        document.querySelector('#vouchers-to-update .voucher-list button').addEventListener('click', () => {
            console.log("We'll circle back to this one here, okay?");
        });
        document.querySelector('#vouchers-to-update .voucher-list button').disabled = false;
    };
    // List out the tours that have new Active Titles...
    let toursList = document.querySelector('#vouchers-to-update .voucher-list ul');
    if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.filter((tour) => tour.updateDBLinks).length > 0) {
        // if(!existingTourTitles.length == 0) {
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.map((tour) => {
            if (tour.updateDBLinks) {
                toursList.innerHTML += `<li>KBT #${tour.tourNumber} - ${tour.TourTitle.TITLE}</li>`;
            }
        });
        let updateLinksBtn = document.querySelector('#vouchers-to-update .voucher-list button');
        updateLinksBtn.addEventListener('click', checkforExistingVouchers);
        updateLinksBtn.style.visibility = "visible";
    }
    else {
        toursList.innerHTML = "<small><i>No tours have new Active Titles.</i></small>";
        document.getElementById('vouchers-to-update').style.color = "lightgray";
    }
}
// should not ever need to use this on a newly-imported voucher CSV
function updateVoucherTitle(ogTitle, newTitle) {
    // update voucher.Title
    for (let v = 0; v < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers.length; v++) {
        if (ogTitle == _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].TourTitle)
            _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].TourTitle = newTitle;
    }
}
// ...actually, should not ever need to use this at this stage
// ...it would likely mess things up way too much
function updateVoucherLinks(ogTitle, newTitle, ogLink) {
    // this function should only be run AFTER the voucher's .TourTitle has been updated with the New Title
    if (!ogTitle || !newTitle || !ogLink) {
        console.log("updateVoucherLinks() ERROR --> Missing at least one param");
        return;
    }
    let ogLinkTitle = ogTitle.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
    console.log(ogTitle);
    let newLinkTitle = newTitle.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-');
    console.log(newTitle);
    let splitLink = ogLink.split(ogTitle);
    let newLink = `${splitLink[0]}${newTitle}${splitLink[1]}`;
    console.log(`Initial link is --> ${ogLink}`);
    console.log(`New link is     --> ${newLink}`);
    for (let v = 0; v < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers.length; v++) {
        if (newTitle == _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].TourTitle && ogLink == _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].LINK) {
            _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].LINK = newLink;
        }
    }
}


/***/ }),

/***/ "./src/lib/checkAllConfirmed.ts":
/*!**************************************!*\
  !*** ./src/lib/checkAllConfirmed.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkAllConfirmed: () => (/* binding */ checkAllConfirmed)
/* harmony export */ });
/* harmony import */ var _addVouchers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../addVouchers */ "./src/addVouchers.ts");
/* harmony import */ var _displayVouchers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./displayVouchers */ "./src/lib/displayVouchers.ts");


const checkAllConfirmed = () => {
    // If any existing titles are NOT confirmed, return/end
    for (let t = 0; t < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.length; t++) {
        if (!_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[t].confirmed)
            return;
    }
    // If any new titles are NOT confirmed, return/end
    for (let t = 0; t < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles.length; t++) {
        if (!_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t].confirmed)
            return;
    }
    // If we make it here, assume that all titles have been confirmed...
    // Add tourNumber from existingTourTitles to matching vouchers...
    for (let t = 0; t < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.length; t++) {
        for (let v = 0; v < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers.length; v++) {
            if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].TourTitle == _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[t].TourTitle.TITLE) {
                _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].TOUR_NUM = _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[t].tourNumber;
                if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[t].updateDBLinks)
                    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].allTitles = _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[t].allTitles;
            }
        }
    }
    // Add new tourNumber for newTourTitles to matching vouchers...
    let tourNumbers = [];
    let newTourNum = 0;
    if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB.length > 0) {
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB.map((tour) => tourNumbers.push(tour.TOUR_NUM));
        newTourNum = Math.max(...tourNumbers);
    }
    for (let t = _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles.length; t > 0; t--) {
        newTourNum += 1;
        console.log(newTourNum);
        for (let v = 0; v < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers.length; v++) {
            if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].TourTitle == _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t - 1].TourTitle.TITLE) {
                _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].TOUR_NUM = newTourNum;
                _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].isNewTour = true;
                _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers[v].allTitles = null;
                _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t - 1].tourNumber = newTourNum;
            }
        }
    }
    (0,_displayVouchers__WEBPACK_IMPORTED_MODULE_1__.displayVouchers)();
    (0,_addVouchers__WEBPACK_IMPORTED_MODULE_0__.displayActionItems)();
};


/***/ }),

/***/ "./src/lib/displayTourTitleResults.ts":
/*!********************************************!*\
  !*** ./src/lib/displayTourTitleResults.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   displayTourTitleResults: () => (/* binding */ displayTourTitleResults)
/* harmony export */ });
/* harmony import */ var _addVouchers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../addVouchers */ "./src/addVouchers.ts");

function displayTourTitleResults() {
    //  DISPLAY RESULTS AND GET CONFIRMATION
    document.getElementById('title-results').style.display = "block";
    document.getElementById('input').style.display = "none";
    // insert new Tours
    if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles.length < 1) {
        document.getElementById('new-tours').innerHTML = `<ul><li><small>No New Tours</small></li></ul>`;
    }
    else {
        document.getElementById('new-tours').innerHTML = '';
        for (var nt = 0; nt < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles.length; nt++) {
            document.getElementById('new-tours').innerHTML += `
                <div class="tour-title-list">
                        <div class="new-tour checked ${nt}" data-tour-index="${nt}" style="visibility:hidden">&#9989</div>
                        <div class="title"> ${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[nt].TourTitle.TITLE} </div>
                        <div class="count">Count: ${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[nt].TourTitle.COUNT}</div>
                        <div class="buttons">
                            <button class="new-tour true ${nt}" data-tour-index="${nt}" onclick="handleNewTourTrue(event)">Yes, it's a new tour</button>
                            <button class="new-tour false ${nt}" data-tour-index="${nt}" onclick="handleNewTourFalse(event)">No, not a new tour</button>
                        </div>
                </div>
                `;
        }
    }
    //  insert existing tours that have new vouchers in the uploaded csv...
    if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.length < 1) {
        document.getElementById('existing-tours').innerHTML = 'No Existing Tours';
    }
    else {
        document.getElementById('existing-tours').innerHTML = '';
        for (var et = 0; et < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.length; et++) {
            let isPublished = _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[et].published ? ' <div><span id="is-published">(published)</span></div>' : '';
            document.getElementById('existing-tours').innerHTML += `
                    <div class="tour-title-list">
                        <div class="existing-tour checked ${et}"  data-tour-index="${et}" style="visibility:hidden">&#9989</div>
                        <div class="title"> ${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[et].TourTitle.TITLE}</div>
                         ${isPublished}
                        <div class="count">Count: ${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[et].TourTitle.COUNT}</div>
                        <div class="buttons">
                            <button class="existing-tour true ${et}" data-tour-index="${et}" onclick="handleExistingTourTrue(event)">Correct</button>
                            <button class="existing-tour change ${et}" data-tour-index="${et}" onclick="handleExistingTourChange(event)">This is a different tour</button>
                            <button class="existing-tour false ${et}" data-tour-index="${et}" onclick="handleExistingTourFalse(event)">No, it's a new tour</button>
                        </div>
                    
                        
                    `;
            let altTitles = _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[et].allTitles.filter((title) => title != _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[et].TourTitle.TITLE);
            if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[et].allTitles.length > 1) {
                let altTitlesHTML = `<p class='alt-titles'><small> FORMERLY:`;
                for (var alts = 1; alts < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[et].allTitles.length; alts++) {
                    altTitlesHTML += `
                        "${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[et].allTitles[alts]}"  --  
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


/***/ }),

/***/ "./src/lib/displayVouchers.ts":
/*!************************************!*\
  !*** ./src/lib/displayVouchers.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   displayVouchers: () => (/* binding */ displayVouchers)
/* harmony export */ });
/* harmony import */ var _addVouchers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../addVouchers */ "./src/addVouchers.ts");

function displayVouchers() {
    let results = document.getElementById('voucher-results');
    results.style.display = "block";
    let table = document.getElementById('voucher-body');
    table.innerHTML = '';
    let toUpdateDBLinks = [];
    for (let t = 0; t < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.length; t++) {
        if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[t].updateDBLinks)
            toUpdateDBLinks.push(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[t].TourTitle.TITLE);
    }
    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.vouchers.map((voucher) => {
        // console.log(voucher)
        let isRedeemed = voucher.REDEEMED ? 'T' : 'F';
        let isAvailable = voucher.AVAILABLE ? 'T' : 'F';
        let dbStatus = voucher.dbStatus ? voucher.dbStatus : "";
        let isNewTour = voucher.isNewTour ? 'class="new-tour"' : '';
        let isUpdatedTitle = voucher.allTitles ? ' class="updated-title"' : '';
        let oldTitles = '';
        if (voucher.allTitles) {
            oldTitles = 'title="Former Titles:';
            for (let t = 1; t < voucher.allTitles.length; t++) {
                oldTitles += `&#10;${voucher.allTitles[t]}`;
            }
            oldTitles += '"';
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
        `;
    });
}


/***/ }),

/***/ "./src/lib/togglePopUp.ts":
/*!********************************!*\
  !*** ./src/lib/togglePopUp.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   togglePopUp: () => (/* binding */ togglePopUp)
/* harmony export */ });
function togglePopUp() {
    let popUps = document.getElementsByClassName('pop-up');
    for (let e = 0; e < popUps.length; e++) {
        if (popUps[e].style.display == "none") {
            popUps[e].style.display = "block";
        }
        else {
            popUps[e].style.display = "none";
        }
    }
}


/***/ }),

/***/ "./src/lib/tourListHandlers.ts":
/*!*************************************!*\
  !*** ./src/lib/tourListHandlers.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   handleExistingTourChange: () => (/* binding */ handleExistingTourChange),
/* harmony export */   handleExistingTourFalse: () => (/* binding */ handleExistingTourFalse),
/* harmony export */   handleExistingTourTrue: () => (/* binding */ handleExistingTourTrue),
/* harmony export */   handleNewTourFalse: () => (/* binding */ handleNewTourFalse),
/* harmony export */   handleNewTourFalseSelection: () => (/* binding */ handleNewTourFalseSelection),
/* harmony export */   handleNewTourTrue: () => (/* binding */ handleNewTourTrue)
/* harmony export */ });
/* harmony import */ var _addVouchers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../addVouchers */ "./src/addVouchers.ts");
/* harmony import */ var _togglePopUp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./togglePopUp */ "./src/lib/togglePopUp.ts");
/* harmony import */ var _checkAllConfirmed__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./checkAllConfirmed */ "./src/lib/checkAllConfirmed.ts");
/* harmony import */ var _displayTourTitleResults__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./displayTourTitleResults */ "./src/lib/displayTourTitleResults.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};




/************************

    EXISTING TOURS LIST

************************/
const handleExistingTourTrue = (e) => {
    let i = Number(e.target.dataset.tourIndex);
    document.querySelector(`.existing-tour.checked[data-tour-index="${i}"]`).style.visibility = "visible";
    e.target.disabled = true;
    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].confirmed = true;
    (0,_checkAllConfirmed__WEBPACK_IMPORTED_MODULE_2__.checkAllConfirmed)();
};
const handleExistingTourChange = (e) => {
    // togglePopUp();
    let i = Number(e.target.dataset.tourIndex);
    console.log("Clicked Exisitng but Different... and found this array index: ", i);
    console.log("Tour Title in question is -> ", _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].TourTitle.TITLE);
    handleNewTourFalse(e, "existing-tour");
};
const handleExistingTourFalse = (e) => {
    let i = Number(e.target.dataset.tourIndex);
    document.querySelector(`.existing-tour.checked[data-tour-index="${i}"]`).style.visibility = "hidden";
    document.querySelector(`.existing-tour.true[data-tour-index="${i}"]`).disabled = false;
    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].confirmed = false;
    let oldMenu = document.getElementById('new-tour-false');
    oldMenu.style.display = "none";
    let menu = document.getElementById('existing-tour-false');
    menu.style.display = "block";
    let input = document.querySelector('#existing-tour-false input[type="text"]');
    input.value = _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].TourTitle.TITLE;
    let errMessage = document.querySelector('#existing-tour-false p#error');
    errMessage.innerText = "testing error";
    errMessage.style.visibility = "hidden";
    let sbmtButton = document.querySelector('#existing-tour-false button');
    sbmtButton.addEventListener('click', () => {
        errMessage.innerHTML = "";
        let titleConflict = null;
        // Check submitted title against current & past titles of existing tours...
        for (let t = 0; t < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB.length; t++) {
            if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[t].TITLES.includes(input.value)) {
                let index = 0;
                while (index < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[t].TITLES.length) {
                    if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[t].TITLES[index] == input.value)
                        break;
                }
                titleConflict = {
                    "isNew": false,
                    "tour": _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[t],
                    "index": index
                };
                break;
            }
        }
        // Check submited title against the titles of any new tours...
        for (let t = 0; t < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles.length; t++) {
            if (_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t].TourTitle.TITLE == input.value) {
                titleConflict = {
                    "isNew": true,
                    "tour": _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[t].TourTitle.TITLE,
                    "index": null
                };
            }
        }
        if (titleConflict) {
            if (titleConflict.isNew) {
                errMessage.innerHTML += `
                <p class="error">ERROR: CONFLICT WITH ANOTHER NEW TOUR</p>
                <p style="font-weight: bold">${titleConflict.tour}</p>
                `;
            }
            else if (typeof titleConflict.tour != "string") {
                {
                    if (titleConflict.index == 0) {
                        errMessage.innerHTML += `
                    <p class="error">ERROR: CONFLICT WITH TOUR #${titleConflict.tour.TOUR_NUM}</p>
                    `;
                    }
                    else {
                        errMessage.innerHTML += `
                    <p class="warning">WARNING: MATCHES WITH TOUR #${titleConflict.tour.TOUR_NUM}</p>
                    `;
                    }
                    for (let t = 0; t < titleConflict.tour.TITLES.length; t++) {
                        let isMatch = (t == titleConflict.index) ? 'style="font-weight:bold"' : '';
                        errMessage.innerHTML += `
                    <p ${isMatch}>${titleConflict.tour.TITLES[t]}</p>
                    `;
                    }
                }
                errMessage.style.visibility = "visible";
            }
            else {
                console.log("All good, bro!");
                _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles.push({
                    "TourTitle": {
                        "TITLE": _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].TourTitle.TITLE,
                        "COUNT": _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].TourTitle.COUNT
                    },
                    "confirmed": false,
                });
                _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.splice(i, 1);
                (0,_togglePopUp__WEBPACK_IMPORTED_MODULE_1__.togglePopUp)();
                menu.style.display = "none";
                (0,_displayTourTitleResults__WEBPACK_IMPORTED_MODULE_3__.displayTourTitleResults)();
            }
        }
    });
    (0,_togglePopUp__WEBPACK_IMPORTED_MODULE_1__.togglePopUp)();
};
/************************

    NEW TOURS LIST

************************/
const handleNewTourTrue = (e) => {
    let i = Number(e.target.dataset.tourIndex);
    let isPublished = false;
    // confirm newTourTitle
    let confirmNewTour = () => {
        document.querySelector(`.new-tour.checked[data-tour-index="${i}"]`).style.visibility = "visible";
        e.target.disabled = true;
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[i].confirmed = true;
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[i].published = isPublished;
        (0,_togglePopUp__WEBPACK_IMPORTED_MODULE_1__.togglePopUp)();
        document.getElementById("new-tour-is-published").style.display = "none";
        (0,_checkAllConfirmed__WEBPACK_IMPORTED_MODULE_2__.checkAllConfirmed)();
    };
    // POP-UP: check if the new tour is "Published" on VoiceMap...
    if (i)
        document.getElementById("is-published-tour-title").innerText = _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[i].TourTitle.TITLE;
    document.querySelector("#new-tour-is-published button.yes").addEventListener("click", () => {
        isPublished = true;
        confirmNewTour();
    });
    document.querySelector("#new-tour-is-published button.no").addEventListener("click", confirmNewTour);
    (0,_togglePopUp__WEBPACK_IMPORTED_MODULE_1__.togglePopUp)();
};
const handleNewTourFalseSelection = (e, tourDBNum, i, dbIndex, newOrExist) => __awaiter(void 0, void 0, void 0, function* () {
    let allTitles = [];
    // have to map through it b/c of deepfreeze
    _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[dbIndex].TITLES.map((title) => allTitles.push(title));
    console.log("allTitles = ", allTitles);
    if (newOrExist == "new-tour") {
        allTitles.unshift(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[i].TourTitle.TITLE);
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.push({
            "TourTitle": {
                "TITLE": _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[i].TourTitle.TITLE,
                "COUNT": _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[i].TourTitle.COUNT
            },
            "allTitles": allTitles,
            "tourNumber": tourDBNum,
            "dbIndex": dbIndex,
            "updateDBLinks": true
        });
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles.splice(i, 1);
    }
    else if (newOrExist == "existing-tour") {
        allTitles.unshift(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].TourTitle.TITLE);
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].allTitles = allTitles;
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].tourNumber = tourDBNum;
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].dbIndex = dbIndex;
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].updatedTourTitle = true;
    }
    console.log("after push and splice...");
    console.log(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles);
    console.log(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles);
    console.log("toursInDB[0] = ", _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[0]);
    (0,_togglePopUp__WEBPACK_IMPORTED_MODULE_1__.togglePopUp)();
    document.getElementById('new-tour-false').style.display = "none";
    (0,_displayTourTitleResults__WEBPACK_IMPORTED_MODULE_3__.displayTourTitleResults)();
});
const handleNewTourFalse = (e, newOrExist) => {
    let i = Number(e.target.dataset.tourIndex);
    if (!newOrExist) {
        newOrExist = "new-tour";
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[i].confirmed = false;
    }
    else {
        _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].confirmed = false;
    }
    console.log(newOrExist, i);
    console.log("toursInDB = ", _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB);
    document.querySelector(`.${newOrExist}.checked[data-tour-index="${i}"]`).style.visibility = "hidden";
    document.querySelector(`.${newOrExist}.true[data-tour-index="${i}"]`).disabled = false;
    (0,_togglePopUp__WEBPACK_IMPORTED_MODULE_1__.togglePopUp)();
    // console.log("upon entering handleNewTourFalse()...")
    // console.log(existingTourTitles)
    // console.log(newTourTitles)
    // console.log("Clicked, and found this array index: ",i)
    // console.log("Tour Title in question is -> ", newTourTitles[i].TourTitle.TITLE)
    document.getElementById('existing-tour-false').style.display = "none";
    let menu = document.getElementById('new-tour-false');
    menu.style.display = "block";
    let menuTitle = document.getElementById('ntf-title');
    menuTitle.innerText = newOrExist == "existing-tour" ? `"${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[i].TourTitle.TITLE}"` : `"${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.newTourTitles[i].TourTitle.TITLE}"`;
    let menuTourList = document.getElementById('ntf-existing-tours-list');
    menuTourList.innerHTML = '';
    let tourNumbers = [];
    for (let et = 0; et < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles.length; et++) {
        tourNumbers.push(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.existingTourTitles[et].tourNumber);
    }
    // console.log("tourNumbers = ", tourNumbers);
    for (let db = 0; db < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB.length; db++) {
        if (tourNumbers.includes(_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[db].TOUR_NUM))
            break;
        let listTheTitles = () => {
            let titleList = ``;
            for (let t = 0; t < _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[db].TITLES.length; t++) {
                let isMainTitle = (t == 0) ? `style="font-weight: bold"` : ``;
                titleList += `<p ${isMainTitle}>${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[db].TITLES[t]}</p>`;
            }
            return titleList;
        };
        menuTourList.innerHTML += `
        <div class="menu-tours-list" onclick="handleNewTourFalseSelection(event, ${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[db].TOUR_NUM}, ${i}, ${db}, '${newOrExist}')">
            <p>${_addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB[db].TOUR_NUM}</p>
            <div>
                ${listTheTitles()}
            </div>
        `;
    }
    console.log("toursInDB at end of handleNewToursFalse() = ", _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB);
    setTimeout(() => {
        console.log("toursInDB after timeout = ", _addVouchers__WEBPACK_IMPORTED_MODULE_0__.toursInDB);
    }, 3000);
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/addVouchers.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=addVouchersBundle.js.map