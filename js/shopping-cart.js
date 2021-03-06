﻿function updateCartDetails() {
    var total = 0;
    var vat = 0;
    var grandtotal = 0;
    var cart = $('.show-cart');
    var cartID = window.localStorage.getItem("cartID");
    cart.html("<img alt='Loading' src='load.gif' />");
    $.ajax({
        type: "GET",
        url: "http://clients.topmovierankings.com/api/cart/" + cartID,
        headers: { "Authorization" : "bearer "+ accessToken },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: setCartValues,
        error: function (xhr, status, err) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);

        }
    });
    $(".table-bordered tbody tr").each(function () {
        var subtotal = $(this).find('.total-price').text();
        if (subtotal != '')
            total += parseFloat(subtotal);
    });
    $('.all-grand-total').text(total.toFixed(2));
}
function decrementQuantity(obj) {
    var quantity = $(obj).parent().parent().find('.form-control').val();
    quantity = parseInt(quantity) - 1;
    if (quantity > 0) {
        $(obj).parent().parent().find('.form-control').val(quantity);
        var unitprice = $(obj).closest('table').parent().parent().find('.unit-price').text();
        $(obj).closest('table').parent().parent().find('.total-price').text((quantity * unitprice).toFixed(2));
        updateCartDetails();
        var pid = $(obj).closest('table').parent().closest('tr').attr('data-id');
        updatecart(pid, quantity);
    }

}
function updatecart(pid, quantity) {
    $('#overlay').fadeIn();
    var cartID = window.localStorage.getItem("cartID");
    $.ajax({
        type: "PUT",
        headers: { "Authorization" : "bearer "+ accessToken },
        url: "http://clients.topmovierankings.com/api/cart",
        data: "{ 'pid':" + pid + ",'cartID':'" + cartID + "','Quantity':" + quantity + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: setCartValues,
        error: function (xhr, status, err) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);

        }
    });
}
function incrementQuantity(obj) {
    var quantity = $(obj).parent().parent().find('.form-control').val();
    quantity = parseInt(quantity) + 1;
    if (quantity > 0) {
        $(obj).parent().parent().find('.form-control').val(quantity);
        var unitprice = $(obj).closest('table').parent().parent().find('.unit-price').text();
        $(obj).closest('table').parent().parent().find('.total-price').text((quantity * unitprice).toFixed(2));
        updateCartDetails();
        var pid = $(obj).closest('table').parent().closest('tr').attr('data-id');
        updatecart(pid, quantity);
    }

}
function FilterNumbers(event, obj) {
    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
        (event.keyCode == 65 && event.ctrlKey === true) ||
        (event.keyCode >= 35 && event.keyCode <= 39)) {

        return;
    }
    else {
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
        }
    }
}
function updateQty(obj) {
    var quantity = $(obj).val();
    var total = 0;
    var vat = 0;
    var grandtotal = 0;
    quantity = parseInt(quantity);
    if (quantity > 0) {
        var unitprice = $(obj).closest('table').parent().parent().find('.unit-price').text();
        $(obj).closest('table').parent().parent().find('.total-price').text((quantity * unitprice).toFixed(2));
        //updateCartDetails();
        var pid = $(this).closest('tr').attr('data-id');
        //updatecart(pid, quantity);
    }
}

$('#check-out').click(function () {
    $('#body-overlay').fadeIn();
    var cartID = window.localStorage.getItem("cartID");
    if (window.localStorage.getItem("OrderID") == null) {
        $.ajax({
            type: "POST",
            headers: { "Authorization" : "bearer "+ accessToken },
            url: "http://clients.topmovierankings.com/api/order",
            data: "{'CartID':'" + cartID + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var OrderID = parseInt(data);
                if (OrderID > 1) {
                    window.localStorage.setItem("OrderID", OrderID);
                    window.location.href = 'check-out.html';
                }
            },
            error: function (xhr, status, err) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);

            }
        });
    }
    else {
        $.ajax({
            type: "PUT",
            headers: { "Authorization" : "bearer "+ accessToken },
            url: "http://clients.topmovierankings.com/api/order",
            data: "{\"OrderID\":" + window.localStorage.getItem("OrderID") + ",'CartID':'" + cartID + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var OrderID = parseInt(data);
                if (OrderID > 1) {
                    window.localStorage.setItem("OrderID", OrderID);
                    window.location.href = 'check-out.html';
                }
            },
            error: function (xhr, status, err) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);

            }
        });
    }

});