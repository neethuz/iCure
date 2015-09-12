$(document).ready(function () {
    $('#btnSearch').click(function () {
        if ($('#txtOrderSearch').val() != '') {
            if ($('#txtOrderSearch').val().length < 10) {
                $('#txtOrderSearch').focus();
                $('#txtOrderSearch').next().next().html("Mobile number should have 10 digits");
                return;
            }
            $('#body-overlay').fadeIn();    
            $.ajax({
                type: "GET",
                url: "http://clients.topmovierankings.com/api/order/mobile/" + $('#txtOrderSearch').val(),
                beforeSend: setHeader,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    var orders = data.orderList;
                    if (data.orderList.length>0) {
                        var inner_html = "<table class='table table-bordered'><thead><tr><th>OrderID</th><th class='text-left'>Name</th><th>Status</th></tr></thead><tbody>";
                        $.each(orders, function () {
                            inner_html += "<tr><td>" + this.OrderID + "</td><td>" + this.Name + "</td><td>" + this.Status + "</td><tr>";
                        });
                        inner_html += "</tbody></table>";
                        $('#track-details').html(inner_html);
                    }
                    else {
                        $('#track-details').html("<br/><div class='alert alert-danger'>No orders found</div>");
                    }
                    $('#body-overlay').fadeOut();
                },
                error: function (xhr, status, err) {
                    var err = eval("(" + xhr.responseText + ")");
                    alert(err.Message);

                }
            });
        }
        else
            $('#txtOrderSearch').next().next().html("Please enter mobile number");
    });
});