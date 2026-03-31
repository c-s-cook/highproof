import { newTourTitles, existingTourTitles } from '../addVouchers';


export function displayTourTitleResults() {
    
    //  DISPLAY RESULTS AND GET CONFIRMATION
    document.getElementById('title-results')!.style.display = "block";

    document.getElementById('input')!.style.display = "none";

    // insert new Tours
    if (newTourTitles.length < 1) {
        document.getElementById('new-tours')!.innerHTML = `<ul><li><small>No New Tours</small></li></ul>`;
    } else {
        document.getElementById('new-tours')!.innerHTML = '';
        for (var nt = 0; nt < newTourTitles.length; nt++) {
            document.getElementById('new-tours')!.innerHTML += `
                <div class="tour-title-list">
                        <div class="new-tour checked ${nt}" data-tour-index="${nt}" style="visibility:hidden">&#9989</div>
                        <div class="title"> ${newTourTitles[nt].TourTitle.TITLE} </div>
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
        document.getElementById('existing-tours')!.innerHTML = 'No Existing Tours';
    } else {
        document.getElementById('existing-tours')!.innerHTML = '';

        for (var et = 0; et < existingTourTitles.length; et++) {
            let isPublished = existingTourTitles[et].published ? ' <div><span id="is-published">(published)</span></div>' : ''

            document.getElementById('existing-tours')!.innerHTML += `
                    <div class="tour-title-list">
                        <div class="existing-tour checked ${et}"  data-tour-index="${et}" style="visibility:hidden">&#9989</div>
                        <div class="title"> ${existingTourTitles[et].TourTitle.TITLE}</div>
                         ${isPublished}
                        <div class="count">Count: ${existingTourTitles[et].TourTitle.COUNT}</div>
                        <div class="buttons">
                            <button class="existing-tour true ${et}" data-tour-index="${et}" onclick="handleExistingTourTrue(event)">Correct</button>
                            <button class="existing-tour change ${et}" data-tour-index="${et}" onclick="handleExistingTourChange(event)">This is a different tour</button>
                            <button class="existing-tour false ${et}" data-tour-index="${et}" onclick="handleExistingTourFalse(event)">No, it's a new tour</button>
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

                document.getElementById('existing-tours')!.innerHTML += `${altTitlesHTML}`;
            
            }

            document.getElementById('existing-tours')!.innerHTML += `
                    </div>
                    `;
        }
    }
}