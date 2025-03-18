
const addBuyButtonStyle = () => {
    let stripeBuyButtonContainer = document.getElementsByClassName("BuyButton-container")[0];
    stripeBuyButtonContainer.style.width = "80%";
    stripeBuyButtonContainer.style.color = "#f05624";
}

setInterval(addBuyButtonStyle, 1000);