$('#txtSearch').keyup(function () {
    if ($('#txtSearch').val() != '')
        $('.icon-addon .close').fadeIn();
    else
        $('.icon-addon .close').fadeOut();

});
$('.icon-addon .close').click(function () {
    $('#txtSearch').val('');
    $(this).fadeOut();
});
var isHoverSelect = false;
$(function () {
    $(".tb").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "http://clients.topmovierankings.com/api/product/search/"+request.term,
                data: "{ 'sterm': '" + request.term + "' }",
                headers: { 'Authorization': 'bearer YSg06E-CN3AiL8r9PsQrHnlCb-ZuBKCPUOTqTBOcg4qqTgd1f_zMXi0GG5xmOEXSZIQwiUKJmn129ato3uNIcr5FsHXX63Ph4ySVm9Wm-7Yi253pfZ2OUGNz4_jpt7dIsoBp7yjSccmoUlWOB_M8Uuy8oBbasBzi9GkQk5tlE18bPZHo8f96hvxAUFInNko7Hg8KpzoW7t6C3NbUO5xUBM8dL354xesWD58-be250Itjet3MRL1rvpOpMidBLQGudrGyLfCtulfvUYJsE3ogmR7_5_9HhUJAa4SKEioYtTrIRmOodiTk_816RDJabDuStSuevkMzPgQuEcOv2D4zXqvQu5WHfvw8cgemtD3Dn-p6DHibXqZDLJ1ciD1RoWEJjqRx5Sd3jRhIpETda250-6DwerhxBSOeHQZHU-Dx01c' },
                dataType: "json",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataFilter: function (data) { return data; },
                success: function (data) {
                    $('#results').html('');
                    var inner_html = '';
                    var currentRequest = data.SearchResult;
                    response($.map(currentRequest, function (item) {
                        inner_html += "<div class='search-prod search-border'><h3><a href='/products/default.html?ID=" + item.ID + "' class='fancybox' data-group='products'>" + item.Name + "</a><a href='javascript:void(0);' class='btn btn-warning btn-xs pull-right buy-now' data-amount='" + data.Price + "' data-id='" + item.ID + "'>Buy</a><span class='pull-right'>Price:  " + item.Price + ", Pack Type:" + item.PackType + "</span></h3><div class='col-md-12'><p class='text-center' style='width:100%;'>Slide to add quantity</p><span class='col-md-3'><input type='text' class='amount form-control input-sm' id='slider2_amount' /></span><div class='col-md-9'><div class='slider' id='slider' data-begin='200' data-end='500'></div></div></div></div>";
                    }))
                    if (inner_html != '') {
                        $('#resultpane').fadeIn();
                        $('#results').html(inner_html);

                        $(function () {
                            $(".slider").slider({
                                min: 1,
                                max: 100,
                                step: 1,
                                value: 1,
                                animate: true,
                                slide: function (event, ui) {
                                    $(this).parent().prev().find(".amount").val(ui.value);
                                },
                                create: function (event, ui) {
                                    $(".amount").val(1);
                                }
                            });
                            $(".fancybox").fancybox({
                                'autoScale': true,
                                'transitionIn': 'none',
                                'transitionOut': 'none',
                                'type': 'iframe'
                            });
                            $('.buy-now').click(function () {
                                $('#overlay1').fadeIn();
                                var cartID = $.cookie("cartID");
                                $.ajax({
                                    type: "POST",
                                    url: "http://clients.topmovierankings.com/api/cart",
                                    headers: { 'Authorization': 'bearer YSg06E-CN3AiL8r9PsQrHnlCb-ZuBKCPUOTqTBOcg4qqTgd1f_zMXi0GG5xmOEXSZIQwiUKJmn129ato3uNIcr5FsHXX63Ph4ySVm9Wm-7Yi253pfZ2OUGNz4_jpt7dIsoBp7yjSccmoUlWOB_M8Uuy8oBbasBzi9GkQk5tlE18bPZHo8f96hvxAUFInNko7Hg8KpzoW7t6C3NbUO5xUBM8dL354xesWD58-be250Itjet3MRL1rvpOpMidBLQGudrGyLfCtulfvUYJsE3ogmR7_5_9HhUJAa4SKEioYtTrIRmOodiTk_816RDJabDuStSuevkMzPgQuEcOv2D4zXqvQu5WHfvw8cgemtD3Dn-p6DHibXqZDLJ1ciD1RoWEJjqRx5Sd3jRhIpETda250-6DwerhxBSOeHQZHU-Dx01c' },
                                    data: "{ 'PID':" + $(this).attr("data-id") + ",'cartID':'"+cartID+"','Quantity':" + $(this).parent().next().find('.amount').val() + "}",
                                    contentType: "application/json",
                                    crossDomain: true,
                                    dataType: "json",
                                    success: setCartValues,
                                    error: function (xhr, status, err) {
                                        var err = eval("(" + xhr.responseText + ")");
                                        alert(err.Message);

                                    }
                                });
                                return false;

                            });
                        });

                    }
                    return false;

                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            });
        },
        minLength: 2, autoFill: true
    });

});

$(".amount").on('change', function () {
    $(this).parent().next.find('.slider').slider('value', this.value);
});
$('#resultpane .close').click(function () { $('#resultpane').fadeOut(); });
$('.masthead-nav li a.dropdownmenu').click(function () { $('.shopping-cart').slideToggle(); });

$('#page-check-out').click(function () {
    $('#body-overlay').fadeIn();
    var cartID = $.cookie("cartID");
    $.ajax({
        type: "POST",
        headers: { 'Authorization': 'bearer YSg06E-CN3AiL8r9PsQrHnlCb-ZuBKCPUOTqTBOcg4qqTgd1f_zMXi0GG5xmOEXSZIQwiUKJmn129ato3uNIcr5FsHXX63Ph4ySVm9Wm-7Yi253pfZ2OUGNz4_jpt7dIsoBp7yjSccmoUlWOB_M8Uuy8oBbasBzi9GkQk5tlE18bPZHo8f96hvxAUFInNko7Hg8KpzoW7t6C3NbUO5xUBM8dL354xesWD58-be250Itjet3MRL1rvpOpMidBLQGudrGyLfCtulfvUYJsE3ogmR7_5_9HhUJAa4SKEioYtTrIRmOodiTk_816RDJabDuStSuevkMzPgQuEcOv2D4zXqvQu5WHfvw8cgemtD3Dn-p6DHibXqZDLJ1ciD1RoWEJjqRx5Sd3jRhIpETda250-6DwerhxBSOeHQZHU-Dx01c' },
        url: "http://clients.topmovierankings.com/api/order",
        data: "{'cartID':'" + cartID + "'}",
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
});