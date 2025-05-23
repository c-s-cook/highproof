import { existingTourTitles, vouchers } from "../addVouchers";
import type { CSVVoucher, DBVoucher } from "../types";

export function actionUpdateVoucherLinks(){


    const checkforExistingVouchers = () => {

        document.querySelector('#vouchers-to-update .voucher-list button')!.removeEventListener('click', checkforExistingVouchers);
        (document.querySelector('#vouchers-to-update .voucher-list button') as HTMLButtonElement).disabled = true;

        let results = document.querySelector('#vouchers-to-update .voucher-list .results')! as HTMLDivElement;

        let linkPrefix = 'https://voicemap.me/tour/'

        const splitLinks = (link: string) => {
            return link.split(linkPrefix)[1].split('?')[0].split('/')
        }

        existingTourTitles.map(async(tour) => {
            if(tour.updateDBLinks) {

                // flip title into URL form
                let urlActiveTitle = tour.TourTitle.TITLE.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-')

                // flip previous title into URL form
                let urlPreviousTitle = tour.allTitles[1].toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-')

                // break a current link to {prefix}/{area}/{title}/{voucher}
                let sampleCsvVoucher: CSVVoucher = vouchers.find((voucher) => voucher.TOUR_NUM == tour.tourNumber)!
                let sampleCsvLinkSplits = splitLinks(sampleCsvVoucher.LINK)

                // get AVAILABLE (not sold) tour vouchers from DB...
                const getTourVouchersFromDB = async (TOUR_NUM: number) => {
                    // this function fetches voucher items from the database using a GET request with a TOUR_NUM paramenter
                    try {
                        const response = await fetch(`/api/tour-vouchers/${TOUR_NUM}`);
                        if (!response.ok) {
                            throw new Error(`Error fetching vouchers for TOUR ${TOUR_NUM}: ${response.statusText}`);
                        }
                        const data = await response.json();
                        console.log(data.vouchers)
                        return data.vouchers as DBVoucher[];
                    } catch (error) {
                        console.error('Error:', error);
                        return [];
                    }
                }
                let tourDbVouchers: DBVoucher[]  = await getTourVouchersFromDB(tour.tourNumber)

                // check to make sure that there were available vouchers returned
                if(tourDbVouchers && tourDbVouchers.length == 0){
                    results.innerText = "No available tours were found."
                } else {
                    let sampleDbLinkSplits = splitLinks(tourDbVouchers[0].LINK)

                    let regionStyle = (sampleCsvLinkSplits[0] == sampleDbLinkSplits[0]) ? 'style="font-weight: bold"' : ''


                    results.innerHTML += `<hr /><h3>TOUR #${tour.tourNumber}</h3>`
                    results.innerHTML += `<p>Active Title:   ${tour.TourTitle.TITLE} | <strong>${urlActiveTitle}</strong></p>`
                    results.innerHTML += `<p>Previous Title: ${tour.allTitles[1]} | <italic>${urlPreviousTitle}</italic></p>`
                    results.innerHTML += `<p class="sample-link">CSV SAMPLE LINK: ${linkPrefix}/<span ${regionStyle}>${sampleCsvLinkSplits[0]}</span>/<strong>${sampleCsvLinkSplits[1]}</strong>/?voucher=${sampleCsvVoucher.VOUCHER_ID}</p>`
                    results.innerHTML += `<p class="sample-link">_DB SAMPLE LINK: ${linkPrefix}/<span ${regionStyle}>${sampleDbLinkSplits[0]}</span>/<strong>${sampleDbLinkSplits[1]}</strong>/?voucher=${tourDbVouchers[0].VOUCHER_ID}</p>`
                    results.innerHTML += `<p>Number of Vouchers needing this update: ${tourDbVouchers.length}`

                }



            }
        });

        // let user select to update the vouchers that were found to have (presumably) invalidated links
        (document.querySelector('#vouchers-to-update .voucher-list button') as HTMLElement).innerText = "Update These Vouchers' Links";
        document.querySelector('#vouchers-to-update .voucher-list button')!.addEventListener('click', ()=>{
            console.log("We'll circle back to this one here, okay?");
        });
        (document.querySelector('#vouchers-to-update .voucher-list button') as HTMLButtonElement).disabled = false;



    }



    // List out the tours that have new Active Titles...
    let toursList = document.querySelector('#vouchers-to-update .voucher-list ul') as HTMLUListElement
    
    if(existingTourTitles.filter((tour) => tour.updateDBLinks).length > 0) {
    // if(!existingTourTitles.length == 0) {
        existingTourTitles.map((tour) => {
            if(tour.updateDBLinks) {
                toursList.innerHTML += `<li>KBT #${tour.tourNumber} - ${tour.TourTitle.TITLE}</li>`
            }
        })

        let updateLinksBtn = document.querySelector('#vouchers-to-update .voucher-list button') as HTMLButtonElement
        updateLinksBtn.addEventListener('click', checkforExistingVouchers)
        updateLinksBtn.style.visibility = "visible";

    } else {
        toursList.innerHTML = "<small><i>No tours have new Active Titles.</i></small>"
        document.getElementById('vouchers-to-update')!.style.color = "lightgray"
    }
}








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