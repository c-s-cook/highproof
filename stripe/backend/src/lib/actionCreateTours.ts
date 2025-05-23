import { newTourTitles } from '../addVouchers';


export function actionCreateTours(){

    let toursList = document.querySelector('#tours-to-create .tours-list ul') as HTMLUListElement
    toursList.style.visibility = "visible"

    // check against an empty array
    if(newTourTitles.length == 0){
        toursList.innerHTML += '<li><small><italic>No new tours found.</italic></small></li>'
        document.getElementById('tours-to-create')!.style.color = "lightgray"
    } else {
    // list out any newTourTitles
        newTourTitles.map((tour) => {
            
            toursList.innerHTML += `<li class="new-tour" data-tour="${tour.tourNumber}">KBT #${tour.tourNumber} - ${tour.TourTitle.TITLE}</li>`
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
                        "TITLES": [newTourTitles[t].TourTitle.TITLE], // Assuming single title for new tours...
                        "VM_PUBLISHED": newTourTitles[t].published
                    })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                    newTourTitles[t].createdInDB = true; // Mark this tour as created in the DB
                    document.querySelector(`#tours-to-create>.tours-list>ul>li[data-tour="${newTourTitles[t].tourNumber}"]`)!.classList.add('success');
                    createToursBtn.disabled = true;
                })
                .catch((error) => {
                    console.error('Error:', error);
                    document.querySelector(`#tours-to-create>.tours-list>ul>li[data-tour="${newTourTitles[t].tourNumber}"]`)!.classList.add('failure');
                });
            }
        }

        // if there are new tours, make the create tours button visible and add event listener...
        let createToursBtn = document.querySelector('#tours-to-create .tours-list button') as HTMLButtonElement;
        createToursBtn.style.visibility = "visible"
        createToursBtn.addEventListener('click', createToursInDB)

    }

}