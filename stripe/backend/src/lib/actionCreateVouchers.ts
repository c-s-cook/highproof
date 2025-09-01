import { vouchers } from "../addVouchers"
import { displayVouchers } from "./displayVouchers";



export function  actionCreateVouchers(){

    const uploadVouchersToDB = async () => {
        // This function would be called to create new vouchers based on the current state of the vouchers array...

        document.querySelector('#vouchers-to-upload .upload-to-db button')!.removeEventListener('click', uploadVouchersToDB);
        (document.querySelector('#vouchers-to-upload .upload-to-db button') as HTMLButtonElement).disabled = true;
        console.log("Creating Vouchers in DB...");
        console.log(vouchers);
        
        //  update the CREATED attribute of the 0000_MOST_RECENT voucher in DB...
        let mostRecentCreated;
        const updateMostRecentVoucher = async (newMostRecent: number) => {
            try {
                let response = await fetch(`api/update-latest-voucher/${newMostRecent}`);

                if (!response.ok) throw new Error(`Error updating 0000_MOST_RECENT voucher to ${newMostRecent}: ${response}`);

                const data = await response.json();
                
                return data.voucher.CREATED;
                
            } catch (error) {
                console.error('Errps:', error);
                return null;
            }
            

        }


        for (let v = 0; v < vouchers.length; v++){

            // add a filter checking for/against flags added from DB Voucher Check
            if(vouchers[v].dbStatus) continue;

            
            await fetch('/api/add-voucher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vouchers[v])
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                vouchers[v].dbStatus = "uploaded-successfully"; // Mark this voucher as created in the DB
                
            })
            .catch((error) => {
                console.error('Error:', error);
                vouchers[v].dbStatus = "upload-error"; // Mark this voucher as attempted, but errored
            });

            // call method to update 0000_MOST_RECENT
            if ((!mostRecentCreated && vouchers[v].dbStatus == "uploaded-successfully") || (mostRecentCreated < new Date(vouchers[v].CREATED).valueOf())) {
                
                mostRecentCreated = await updateMostRecentVoucher(new Date(vouchers[v].CREATED).valueOf());
            }
            displayVouchers();
        }
        
    }

    // confirm that the "likely-in-database" vouchers are indeed there...
    const confirmVoucherInDB = async () => {
        console.log("gonna check our asumptions...")
        for(let v = 0; v < vouchers.length; v++){
            // console.log(`Working on VOUCHER_ID ${vouchers[v].VOUCHER_ID} | .dbStatus = ${vouchers[v].dbStatus}`)
            if(!vouchers[v].dbStatus || vouchers[v].dbStatus != "likely-in-database") continue;

            console.log("gonna check the DB for VOUCHER_ID: ", vouchers[v].VOUCHER_ID)
            try {
                const response = await fetch(`/api/vouchers/${vouchers[v].VOUCHER_ID}`);
                if (!response.ok) {
                    vouchers[v].dbStatus = null;
                    throw new Error(`Error fetching voucher ${vouchers[v].VOUCHER_ID}: ${response.statusText}`);
                }
                const data = await response.json();
                
                
                if(data.voucher.VOUCHER_ID == vouchers[v].VOUCHER_ID){
                    vouchers[v].dbStatus = "confirmed-in-database"
                };
            } catch (error) {
                vouchers[v].dbStatus = null;
                console.error('Error:', error);
            }

        }
        // update vouchers list UI to display any new info...
        displayVouchers();
        (document.querySelector('#vouchers-to-upload .how-to-proceed') as HTMLElement).style.display = "none";
        (document.querySelector('#vouchers-to-upload .upload-to-db') as HTMLElement).style.display = "block";
        document.querySelector('#vouchers-to-upload .upload-to-db button')!.addEventListener('click', uploadVouchersToDB);

    }

    // check database for every voucher listed in CSV...
    const deepCheckAllVouchers = async () => {
        window.alert("I got lazy and haven't written this function yet...");
    }

    const checkForVoucherInDB = async () => {

        // Get the 0000_MOST_RECENT voucher from DB...
        // API returns an object with "success:" and "voucher:" elements
        let latestDbVoucher
        try {
            const response = await fetch(`/api/get-latest-voucher`);
            if (!response.ok) {
                throw new Error('Error fetching the single, most recent, voucher...');
            }
            const data = await response.json();
            console.log("Most recent voucher in DB is... ", data.voucher)
            latestDbVoucher = data.voucher;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }

        if(latestDbVoucher){
            // Test it's voucher code + creation Data against current CSV vouchers...
            for (let v = 0; v < vouchers.length; v++){
                // console.log(new Date(vouchers[v].CREATED), ' > ', new Date(latestDbVoucher.CREATED), ' ? : ', (new Date(vouchers[v].CREATED) > new Date(latestDbVoucher.CREATED)));

                if(new Date(vouchers[v].CREATED) > new Date(latestDbVoucher.CREATED)) {
                    // add nothing. element's abscense will be the key
                    console.log("this voucher was newer")
                } else if (vouchers[v].VOUCHER_ID == latestDbVoucher.VOUCHER_ID) {
                    vouchers[v].dbStatus = "confirmed-in-database"
                    console.log("this was the same voucher")
                } else {
                    // if the CREATED date isn't greater that (later / after) the most recent
                    // AND it's not the same voucher, assume it was created on or before
                    // the current voucher and therefore is like to already be in the database
                    vouchers[v].dbStatus = "likely-in-database"
                    console.log("this voucher had the same or earlier creation date")
                }
            }
        }

        // Update UI with results + state we assume that all vouchers with the same + 
        // older CREATED Date are already in the DB. Give Three Options:
        //      1. Proceed with "assumed existing" (and displayed?) vouchers division
        //      2. Check all of the "assumed existing" against DB
        //      3. Check ALL vouchers in CSV against DB
        displayVouchers();
        (document.querySelector('#vouchers-to-upload .check-db') as HTMLElement).style.display = "none";
        (document.querySelector('#vouchers-to-upload .how-to-proceed') as HTMLElement).style.display = "block";

        // listen for and handle "proceed" click
        document.querySelector('#vouchers-to-upload .how-to-proceed button.proceed')!.addEventListener('click', ()=>{
            (document.querySelector('#vouchers-to-upload .how-to-proceed') as HTMLElement).style.display = "none";
            (document.querySelector('#vouchers-to-upload .upload-to-db') as HTMLElement).style.display = "block";
            document.querySelector('#vouchers-to-upload .upload-to-db button')!.addEventListener('click', uploadVouchersToDB)
        })

        // listen for "check" click
        document.querySelector('#vouchers-to-upload .how-to-proceed button.check')!.addEventListener('click', confirmVoucherInDB)

        // listen for "deep check" click
        document.querySelector('#vouchers-to-upload .how-to-proceed button.deep-check')!.addEventListener('click', deepCheckAllVouchers)


        


        // Handle each choice + notate & display results
        
        

        //  Enable "Upload Vouchers" Btn
        uploadVouchersBtn.disabled = false;
        uploadVouchersBtn.addEventListener('click', uploadVouchersToDB);

    }



    // need to find then activate the button...
    let checkDbVouchersBtn = document.querySelector('#vouchers-to-upload .check-db button') as HTMLButtonElement;
    checkDbVouchersBtn.addEventListener('click', checkForVoucherInDB);
    checkDbVouchersBtn.style.color = "blue";

    let uploadVouchersBtn = document.querySelector('#vouchers-to-upload .upload-to-db button') as HTMLButtonElement;
    uploadVouchersBtn.disabled = true;

}