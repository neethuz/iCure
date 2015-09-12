$(document).ready(function () {
    if (accessToken == undefined) {
        getToken(function () { ClearCookies(); });
    }
    else
        ClearCookies();
});

function ClearCookies() {

    if (window.localStorage.getItem("OrderID") != null) {
        $('#success-message').fadeIn(2000);
        $('#order-details').html("Please note down your Order ID <b>" + window.localStorage.getItem("OrderID") + "</b> for future communication<br/>For Order status: Email to <a href='mailto:support@icost.com'>support@icost.com</a> with order number <b>" + window.localStorage.getItem("OrderID") + "</b>/ Call us at <a href='tel:+919167490115'>+919167490115</a>");
        window.localStorage.clear();
    }
    else
        window.location.href = "shopping-cart.html";
}