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
                headers: { 'Authorization': 'bearer YSg06E-CN3AiL8r9PsQrHnlCb-ZuBKCPUOTqTBOcg4qqTgd1f_zMXi0GG5xmOEXSZIQwiUKJmn129ato3uNIcr5FsHXX63Ph4ySVm9Wm-7Yi253pfZ2OUGNz4_jpt7dIsoBp7yjSccmoUlWOB_M8Uuy8oBbasBzi9GkQk5tlE18bPZHo8f96hvxAUFInNko7Hg8KpzoW7t6C3NbUO5xUBM8dL354xesWD58-be250Itjet3MRL1rvpOpMidBLQGudrGyLfCtulfvUYJsE3ogmR7_5_9HhUJAa4SKEioYtTrIRmOodiTk_816RDJabDuStSuevkMzPgQuEcOv2D4zXqvQu5WHfvw8cgemtD3Dn-p6DHibXqZDLJ1ciD1RoWEJjqRx5Sd3jRhIpETda250-6DwerhxBSOeHQZHU-Dx01c' },
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