{/* <script defer>  */}

let  DEV_TRANSACTION_ID = 'cs_test_b1rz3tIUPyNp9XxFSn6YQuwmz9DA7DpHdBMp0IsdLH9DoCpJqG1JQIHJMv';

let TRANSACTION_ID;
let orderConfirmationAPI = 'https://cbvblxsbqbh6d36qogyygvmfhq0xcmdc.lambda-url.us-east-2.on.aws/';

let queryParams = new URLSearchParams(window.location.search)
if(!queryParams.has("order_id")){
    console.log('Error, no session id!');
    TRANSACTION_ID = DEV_TRANSACTION_ID;
    console.log('TRANSACTION_ID dev default = ', TRANSACTION_ID);
} else {
    TRANSACTION_ID = queryParams.get("order_id");
    console.log('TRANSACTION_ID = ',TRANSACTION_ID);
}


// loading message
const loadingMsg = document.getElementById('loading-msg');




// confirmation message elements
const confirmationMsg = document.getElementById('order-confirmation-msg');


const tourTitle = document.querySelector('.tour-codes h3.title');
tourTitle.innerText = "TOUR_TITLE";

const tourCodeOne = document.getElementById('voucher-code-1');
tourCodeOne.innerText = 'AAAAAAAA';


const tourCodeTwo = document.getElementById('voucher-code-2');
tourCodeTwo.innerText = 'BBBBBBBB';

const startingLocation = document.getElementById('starting-loc');
startingLocation.innerText = 'your first distillery'

const userEmail = document.getElementById('user-email');
userEmail.innerText = 'your email addressssss';



// error message
const errorMsg = document.getElementById('error-msg');



// Fetch the order confirmation data from the API, passing TRANSACTION_ID as a query-string parameter
// and updating the confirmation message with the response data

let transaction;

fetch(orderConfirmationAPI + '?TRANSACTION_ID=' + TRANSACTION_ID)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
            
        } else {
            transaction = response.json();
            console.log(transaction);
            return transaction;
        }
        
        // Check if the response is JSON

        
    })
    .then(data => {
        console.log(data);
        loadingMsg.innerText = JSON.stringify(data, null, 2); // Format the JSON response for better readability
        loadingMsg.style.backgroundColor = "#4CAF50"; // Green

        tourTitle.innerText = data.TOUR_TITLE;
        tourCodeOne.innerText = data.VOUCHERS[0];
        userEmail.innerText = data.CUSTOMER;
        if(data.VOUCHERS.length > 1) {
            
            document.querySelector('p.voucher-code').innerText += ' 1 of 2';
            document.querySelector('p.voucher-code').style.fontWeight = 'bold';
            tourCodeTwo.innerText = data.VOUCHERS[1];
            
            document.querySelectorAll('.hidden').forEach((el) => {
                el.classList.remove('hidden');
            });
            
            
        }
        confirmationMsg.classList.remove('hidden');
        loadingMsg.classList.add('hidden');
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // loadingMsg.innerText = "Error: " + error.message;
        // loadingMsg.style.backgroundColor = "#f44336"; // Red
        loadingMsg.classList.add('hidden');
        errorMsg.classList.remove('hidden');
    });


// </script>