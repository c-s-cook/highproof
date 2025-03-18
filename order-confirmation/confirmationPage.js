{/* <script defer>  */}

let CHECKOUT_SESSION_ID;

if(!window.location.search){
    alert('Error, no session id!');
} else {
    let queryParams = new URLSearchParams(window.location.search);
    CHECKOUT_SESSION_ID = queryParams.get("order_id");
    console.log(CHECKOUT_SESSION_ID)
}

const confirmationMsg = document.getElementById('order-confirmation-msg');
console.log(confirmationMsg.innerText);

confirmationMsg.style.backgroundColor = "#ccc";

confirmationMsg.innerText += CHECKOUT_SESSION_ID;

// </script>