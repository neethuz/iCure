$(window).load(function () {
    if (window.localStorage.getItem("OrderID") != null)
        GetUserDetails();
    else
        window.location.href = "shopping-cart.html";
});
$(document).ready(function () {
    if (accessToken == undefined) {
        getToken(function () { confirmOrder(); });
    }
    
    confirmOrder();
   
});
function confirmOrder() {
    var cartID = $.cookie('cartID');
    $.ajax({
        type: "POST",
        url: "http://clients.topmovierankings.com/api/order/confirm",
        beforeSend: setHeader,
        data: "{'cartID':'" + cartID + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: setConfirmation,
        error: function (xhr, status, err) {

        }
    });
}
function setConfirmation(data) {
    var cartCount = 0;
    var cartID = $.cookie('cartID');
    var json = data.CartItems;
    var innerConfirmHtml = "<table class='table table-bordered' id='tab-Shop'><thead><tr><th>Product</th><th>Quantity</th><th class='text-right'>Unit Price</th><th class='text-right'>Total</th></tr></thead><tbody>";
    var itemCount = 0;
    var shoptotal = 0;
    var confirmshoptotal = 0;
    var discount = 0;
    $.ajax({
        type: "GET",
        url: "http://clients.topmovierankings.com/api/discount/" + cartID,
        beforeSend: setHeader,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            discount = parseFloat(data.DiscountRate);
            $.each(json, function () {
                // innerHtml += "<li><div class='cart-item'><h3><span class='desc'>" + this.ProductName.substr(0, 25) + " (" + this.Quantity + ")</span><a href='javascript:void(0);' class='del-item' data-id='" + this.PID + "' onclick='return removecartitem(" + this.PID + ");'><span class='glyphicon glyphicon-remove pull-right'></span></a></h3></div></li>";
                cartCount += this.Quantity;

                if ($('#checkout-cart-table').length > 0) {
                    innerConfirmHtml += "<tr data-id='" + this.PID + "'><td class='text-left'>" + this.ProductName + "</td>";
                    innerConfirmHtml += "<td class='text-left'>" + this.Quantity + "</td>";
                    innerConfirmHtml += "<td class='text-right'><span class='unit-price'>" + this.UnitPrice + "</span></td>";
                    innerConfirmHtml += "<td class='text-right'><span class='total-price'>" + (this.UnitPrice * this.Quantity).toFixed(2) + "</span></td></tr>";
                    confirmshoptotal += this.UnitPrice * this.Quantity;

                }
            });
            if (discount > 0) {
                innerConfirmHtml += "<tr><td colspan='3' class='text-right'>Discount:</td><td class='text-right'><span class='all-grand-total'>" + ((confirmshoptotal * discount) / 100).toFixed(2) + "</span></td></tr>";
                innerConfirmHtml += "<tr><td colspan='3' class='text-right'>Grand  Total:</td><td class='text-right'><span class='all-grand-total'>" + (confirmshoptotal - ((confirmshoptotal * discount) / 100).toFixed(2)).toFixed(2) + "</span></td></tr></tbody></table>";
            }
            else
                innerConfirmHtml += "<tr><td colspan='3' class='text-right'>Grand  Total:</td><td class='text-right'><span class='all-grand-total'>" + confirmshoptotal.toFixed(2) + "</span></td></tr></tbody></table>";
            if ($('#checkout-cart-table').length > 0)
                $('#checkout-cart-table').html(innerConfirmHtml);
        },
        error: function (xhr, status, err) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);

        }
    });



}
function GetUserDetails() {
    var usertable = "<table class='table'>";
    usertable += "<tr><td class='text-right'>Name: </td><td class='text-left'><b>" + window.localStorage.getItem("Name") + "</b></td></tr>";
    usertable += "<tr><td class='text-right'>Mobile: </td><td class='text-left'><b>" + window.localStorage.getItem("Mobile") + "</b></td></tr></table>";
    $('#user-details').html(usertable);
}
$('#confirm-order').click(function () {
    $.ajax({
        type: "POST",
        url: "http://clients.topmovierankings.com/api/checkout",
        beforeSend: setHeader,
        data: "{ \"Name\":\"" + window.localStorage.getItem("Name") + "\",\"OrderID\":" + window.localStorage.getItem("OrderID") + ",\"Mobile\":\"" + window.localStorage.getItem("Mobile") + "\",\"Address\":\"" + window.localStorage.getItem("Address") + "\",\"City\":\"" + window.localStorage.getItem("City") + "\",\"State\":\"" + window.localStorage.getItem("State") + "\",\"Pin\":\"" + window.localStorage.getItem("Pin") + "\",\"Email\":\"" + window.localStorage.getItem("Email") + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var OrderID = parseInt(data);
            if (OrderID > 1) {
                window.location.href = 'thank-you.html';
            }
        },
        error: function (xhr, status, err) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);

        }
    });
});