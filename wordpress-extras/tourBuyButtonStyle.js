
const addBuyButtonStyle = () => {
    let stripeBuyButtonContainer = document.querySelector("BuyButton-container");
    if(stripeBuyButtonContainer){
        console.log(stripeBuyButtonContainer)
        clearInterval(addBuyButtonStyle);
        stripeBuyButtonContainer.style.width = "80%";
        stripeBuyButtonContainer.style.color = "#f05624";
    } else {
        console.log(document.querySelector("BuyButton-container"))
    }
    
}

setInterval(addBuyButtonStyle, 1000);