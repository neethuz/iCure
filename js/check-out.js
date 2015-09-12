$(document).ready(function () {
    if (window.localStorage.getItem("Name") != null) {
        $('#txtName').val(window.localStorage.getItem("Name"));
        $('#txtMobile').val(window.localStorage.getItem("Mobile"));
        $('#txtAddress').val(window.localStorage.getItem("Address"));
        $('#txtCity').val(window.localStorage.getItem("City"));
        $('#txtState').val(window.localStorage.getItem("State"));
        $('#txtPincode').val(window.localStorage.getItem("Pin"));
    }
});
$('#txtPincode').change(function () {
    if ($('#txtPincode').val() != '') {
        if ($('#txtPincode').val().length < 6) {
            $('#txtPincode').next().html("<p class='error'>Pincode must have 6 digits</p>");

            return;
        }
        $('#txtPincode').next().html("<p class='text-warning'><img src='load.gif' alt='loading'/> Please wait</p>")
        $.ajax({
            type: "GET",
            url: "http://clients.topmovierankings.com/api/countrystate/" + $('#txtPincode').val(),
            beforeSend: setHeader,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var pin = data;
                if (pin != 'failed') {
                    $('#txtCity').val(pin.City);
                    $('#txtState').val(pin.State);
                    $('#txtPincode').next().html("");
                }
                else {
                    $('#txtPincode').next().html("<p class='error'>Could not locate pin. Please enter state and city</p>");

                }

            },
            error: function (xhr, status, err) {
                var err = eval("(" + xhr.responseText + ")");

            }
        });
    }
    else {
        $('#txtPincode').next().html("<p class='error'>Please enter pincode</p>");

        return;
    }
});
$('#redeem').click(function () {
    if (($('#redeem').val() == "Redeem") && ($('#txtCoupon').val() != '')) {
        $('#error-coupon').html("");
        $('#redeem').val("Please wait..");
        var cartID = $.cookie("cartID");
        $.ajax({
            type: "POST",
            url: "http://clients.topmovierankings.com/api/coupon",
            beforeSend: setHeader,
            data: "{ \"Code\":\"" + $('#txtCoupon').val() + "\",\"Mobile\":\"" + $("#txtMobile").val() + "\",\"OrderID\":" + window.localStorage.getItem("OrderID") + ",'CartID':'" + cartID + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var OrderID = parseInt(data);
                if (OrderID == 9999) {
                    $('#hdnCoupon').val(OrderID);
                    $('#error-coupon').html("<p class='text-success'>Coupon applied successfully</p>");
                }
                else if (OrderID == -1) {
                    $('#error-coupon').html("<p class='error'>Already Redeemed the Coupon</p>");
                }
                else if (OrderID == 0) {
                    $('#txtCoupon').val('');
                    $('#error-coupon').html("<p class='error'>Invalid coupon code.</p>");
                }
                $('#redeem').val("Redeem");
            },
            error: function (xhr, status, err) {
                $('#error-coupon').html("<p class='error'>Error in applying coupon code</p>");
                $('#redeem').val("Redeem");
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);

            }
        });
    }
    else {
        if ($('#txtCoupon').val() == '')
            $('#error-coupon').html("<p class='error'>Please enter coupon code to redeem</p>");
    }
});
$('#check-out-submit').click(function () {
    $('#txtCoupon').val('');
    if ($('#txtName').val() == '') {
        $('#txtName').focus();
        $('#txtName').next().html("Please enter Name");
        return;
    }
    else
        $('#txtName').next().html("");
    if ($('#txtMobile').val() == '') {
        $('#txtMobile').focus();
        $('#txtMobile').next().next().html("Please enter mobile number");
        return;
    }
    else if ($('#txtMobile').val().length < 10) {
        $('#txtMobile').focus();
        $('#txtMobile').next().next().html("Mobile number should have 10 digits");
        return;
    }
    else
        $('#txtMobile').next().next().html("");

    if ($('#txtEmail').val() == '') {
        $('#txtEmail').focus();
        $('#txtEmail').next().html("Please enter Email");
        return;
    }
    else
        $('#txtEmail').next().html("");

    window.localStorage.setItem("Name", $('#txtName').val());
    window.localStorage.setItem("Email", $('#txtEmail').val());
    window.localStorage.setItem("Mobile", $('#txtMobile').val());
    window.localStorage.setItem("Address", $('#txtAddress').val());
    window.localStorage.setItem("City", $('#txtCity').val());
    window.localStorage.setItem("State", $('#txtState').val());
    window.localStorage.setItem("Pin", $('#txtPincode').val());
    window.location.href = 'confirm-order.html';

});