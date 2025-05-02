{/* <script defer>  */}

//  DEMO TRANSACTION ID: cs_test_b1rz3tIUPyNp9XxFSn6YQuwmz9DA7DpHdBMp0IsdLH9DoCpJqG1JQIHJMv

let TRANSACTION_ID;
let orderConfirmationAPI = 'https://cbvblxsbqbh6d36qogyygvmfhq0xcmdc.lambda-url.us-east-2.on.aws/';

if(!window.location.search){
    alert('Error, no session id!');
} else {
    let queryParams = new URLSearchParams(window.location.search);
    TRANSACTION_ID = queryParams.get("order_id");
    console.log(TRANSACTION_ID)
}

const confirmationMsg = document.getElementById('order-confirmation-msg');
console.log(confirmationMsg.innerText);

confirmationMsg.style.backgroundColor = "#ccc";

confirmationMsg.innerText += TRANSACTION_ID;

// Fetch the order confirmation data from the API, passing TRANSACTION_ID as a query-string parameter
// and updating the confirmation message with the response data

let transaction;

fetch(orderConfirmationAPI + '?TRANSACTION_ID=' + TRANSACTION_ID)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        transaction = response.json();
        console.log(transaction);
        // Check if the response is JSON

        return transaction;
    })
    .then(data => {
        console.log(data);
        confirmationMsg.innerText = JSON.stringify(data, null, 2); // Format the JSON response for better readability
        confirmationMsg.style.backgroundColor = "#4CAF50"; // Green
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        confirmationMsg.innerText = "Error: " + error.message;
        confirmationMsg.style.backgroundColor = "#f44336"; // Red
    });


// </script>