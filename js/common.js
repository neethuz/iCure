var accessToken;
$(".decimal").keydown(function (event) {
    if (event.shiftKey == true) {
        event.preventDefault();
    }
    if ((event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105) ||
        event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 ||
        event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {
    } else {
        event.preventDefault();
    }
    if ($(this).val().indexOf('.') !== -1 && event.keyCode == 190)
        event.preventDefault();
});
$(".numeric").on("keydown", function (event) {
    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
        // Allow: Ctrl+A
       (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
       (event.keyCode >= 35 && event.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    else {
        // Ensure that it is a number and stop the keypress
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
        }
    }
});
function getToken(callback) {
  
    var loginData = {
        grant_type: "password",
        username: "ratheesh",
        password: "#aadya123"
    };

    $.ajax({
        type: 'POST',
        url: "http://clients.topmovierankings.com/Token",
        data: loginData,
        crossDomain: true,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        dataType: 'json'
    }).done(function (data) {
        accessToken = data.access_token;
        callback();
    }).fail(showError);

    function showError(req, s, t) {
        alert('Request Status: ' + req.status + ' Status Text: ' + req.statusText + ' ' + req.responseText);
    }
}
function LoadCart() {
    var cart = $('.show-cart');
    var cartID = '';
    if ($.cookie('cartID') != null)
        cartID = $.cookie('cartID');
    cart.html("<img alt='Loading' src='/img/load.gif' />");
    $.ajax({
        type: "GET",
        url: "http://clients.topmovierankings.com/api/cart/" + cartID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: setHeader,
        crossDomain: true,
        success:setCartValues,
        error: function (xhr, status, err) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);

        }
    });
}
function setHeader(xhr) {
    xhr.setRequestHeader('Authorization', "bearer " + accessToken);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
}

$(document).ready(function () {
    //window.localStorage.clear();
    getToken(function () { LoadCart(); });
   
    
    
});
function setCartValues(data) {
    var cartCount = 0;
    var json = data.CartItems;
    var innerHtml = '';
    var innerShoppingHtml = "<table class='table table-bordered' id='tab-Shop'><thead><tr><th>Product</th><th class='text-center'>Delete</th><th>Quantity</th><th class='text-right'>Unit Price</th><th class='text-right'>Total</th></tr></thead><tbody>";
    var cart = $('.show-cart');
    var itemCount = 0;
    var shoptotal = 0;
    var confirmshoptotal = 0;
    var cartID = '';
    var prescriptionHtml;
    $.each(json, function () {
       // innerHtml += "<li><div class='cart-item'><h3><span class='desc'>" + this.ProductName.substr(0, 25) + " (" + this.Quantity + ")</span><a href='javascript:void(0);' class='del-item' data-id='" + this.PID + "' onclick='return removecartitem(" + this.PID + ");'><span class='glyphicon glyphicon-remove pull-right'></span></a></h3></div></li>";
        cartCount += this.Quantity;
        cartID = this.cartID;
        if ($('#shopping-cart-table').length > 0) {
            innerShoppingHtml += "<tr data-id='"+ this.PID + "'><td class='text-left'>" + this.ProductName + "</td>";
            innerShoppingHtml += "<td class='text-center'><a href='javascript:void(0);' class='del-item' data-id='" + this.PID + "' onclick='return removecartitem(" + this.PID + ");'><span class='glyphicon glyphicon-remove'></span></a></td>";
            innerShoppingHtml += "<td class='text-left'><table id='qty-tab'><tr><td><a href='javascript:void(0)' onclick='return decrementQuantity(this);'><span class='glyphicon glyphicon-minus text-info'></span></a></td><td><input onkeydown='return FilterNumbers(event);' onkeyup='return updateQty(this);' id='txt" + this.PID + "' class='form-control quantity-text' style='width:60px;margin:0px 5px;' value='" + this.Quantity + "' type='text'/></td><td><a href='javascript:void(0)'onclick='return incrementQuantity(this);'><span class='glyphicon glyphicon-plus text-info'></span></a></td></tr></table></td>";
            innerShoppingHtml += "<td class='text-right'><span class='unit-price'>" + this.UnitPrice + "</span></td>";
            innerShoppingHtml += "<td class='text-right'><span class='total-price'>" + (this.UnitPrice * this.Quantity).toFixed(2) + "</span></td></tr>";
            shoptotal += this.UnitPrice * this.Quantity;
        }

       
    });
    
    $.cookie("cartID", cartID, {expires:3600});
    innerShoppingHtml += "<tr><td colspan='4' class='text-right'>Grand  Total:</td><td class='text-right'><span class='all-grand-total'>" + shoptotal.toFixed(2) + "</span></td></tr></tbody></table>";
    if ($('#shopping-cart-table').length > 0) 
        $('#shopping-cart-table').html(innerShoppingHtml);
    if ($('.shopping-cart ul').length > 0) {
        $('.shopping-cart ul').html(innerHtml);
        $('#overlay').fadeOut();
        $('#overlay1').fadeOut();
    }
    
    cart.html(cartCount);
    cart.effect("shake");
    if ($('#prescription-table').length > 0) {
        $.ajax({
            type: "GET",
            url: "http://clients.topmovierankings.com/api/Prescription/" + cartID,
            beforeSend:setHeader,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.Prescriptionlist.length > 0) {
                    prescriptionHtml += "<h1 class='text-left'>Prescription</h1>";
                    prescriptionHtml += "<table class='table table-bordered'><thead><th>Image</th><th>Title</th><th>Delete</th></tbody>";
                    $.each(data.Prescriptionlist, function () {
                        prescriptionHtml += "<tr><td><a href='http://clients.topmovierankings.com/" + this.Image + "' class='fancybox' rel='prescription'><img style='width:50px' src='http://clients.topmovierankings.com/" + this.Thumb + "' alt='" + this.Title + "'/></a></td><td>" + this.Title + "</td><td><a href='javascript:void(0);' class='del-item' data-id='" + this.ID + "' onclick='return removePrescription(" + this.ID + ");'><span class='glyphicon glyphicon-remove'></span></a></td></tr>";

                    });
                    prescriptionHtml += "</table>";
                    $('#prescription-table').html(prescriptionHtml);
                    $(".fancybox").fancybox({
                        'autoScale': true,
                        'transitionIn': 'none',
                        'transitionOut': 'none',
                    });
                }
                else
                    $('#prescription-table').html("<h1 class='text-left'>Prescription</h1><div class='alert alert-danger'> No prescriptions found</div>");
            },
            error: function (xhr, status, err) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);

            }
        });
    }
    $('#body-overlay').fadeOut();
}
function removePrescription(id) {
    var cartID = '';
    if ($.cookie('cartID') != null)
        cartID = $.cookie('cartID');
    if (confirm('Do you want to remove this product from cart?')) {
        $('#overlay').fadeIn();
        $.ajax({
            type: "DELETE",
            url: "http://clients.topmovierankings.com/api/Prescription/" + id + "/" + cartID,
            beforeSend:setHeader,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: setCartValues,
            error: function (xhr, status, err) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);

            }
        });
    } else
        return false;
}

function removecartitem(pid) {
    var cartID = '';
    if ($.cookie('cartID') != null)
        cartID = $.cookie('cartID');
    if (confirm('Do you want to remove this product from cart?')) {
        $('#overlay').fadeIn();
        $.ajax({
            type: "DELETE",
            url: "http://clients.topmovierankings.com/api/cart/"+pid+"/"+cartID,
            beforeSend: setHeader,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: setCartValues,
            error: function (xhr, status, err) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);

            }
        });
    } else
        return false;
}