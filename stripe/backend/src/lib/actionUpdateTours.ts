import { existingTourTitles, toursInDB } from "../addVouchers";

export function actionUpdateTours(){
    
    let needUpdating = false;

    let toursList = document.querySelector('#tours-to-update .tours-list tbody')! as HTMLTableSectionElement;
    

    
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
        document.querySelector('#tours-to-update .tours-list')!.innerHTML = "<ul><li><i><small>No tours found needing title updates.</small></i></li></ul>"
        document.getElementById('tours-to-update')!.style.color = "lightgray"
    }
    // otherwise, make the update button visible and add event listener...
    else {
        let updateToursBtn = document.querySelector('#tours-to-update .tours-list button') as HTMLButtonElement
        updateToursBtn.style.visibility = "visible"
        updateToursBtn.addEventListener('click', updateToursInDB)
    }
}