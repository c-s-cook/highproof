import { vouchers, existingTourTitles } from '../addVouchers';

export function displayVouchers(){

    let results = document.getElementById('voucher-results')!
    results.style.display = "block";
    let table = document.getElementById('voucher-body')!
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