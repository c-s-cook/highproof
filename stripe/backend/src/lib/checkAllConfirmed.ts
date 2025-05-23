import { newTourTitles, existingTourTitles, vouchers, toursInDB, displayActionItems } from '../addVouchers';
import { displayVouchers } from './displayVouchers';

export const checkAllConfirmed = () => {

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
    let tourNumbers: number[] = []
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