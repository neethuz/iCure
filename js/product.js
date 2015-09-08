$(document).ready(function () {
    var ID = getParameterByName("ID");
    $('#body-overlay').fadeIn();
    $.ajax({
        type: "GET",
        url: "http://clients.topmovierankings.com/api/product/" + ID,
        headers: { 'Authorization': 'bearer YSg06E-CN3AiL8r9PsQrHnlCb-ZuBKCPUOTqTBOcg4qqTgd1f_zMXi0GG5xmOEXSZIQwiUKJmn129ato3uNIcr5FsHXX63Ph4ySVm9Wm-7Yi253pfZ2OUGNz4_jpt7dIsoBp7yjSccmoUlWOB_M8Uuy8oBbasBzi9GkQk5tlE18bPZHo8f96hvxAUFInNko7Hg8KpzoW7t6C3NbUO5xUBM8dL354xesWD58-be250Itjet3MRL1rvpOpMidBLQGudrGyLfCtulfvUYJsE3ogmR7_5_9HhUJAa4SKEioYtTrIRmOodiTk_816RDJabDuStSuevkMzPgQuEcOv2D4zXqvQu5WHfvw8cgemtD3Dn-p6DHibXqZDLJ1ciD1RoWEJjqRx5Sd3jRhIpETda250-6DwerhxBSOeHQZHU-Dx01c' },
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var prod = data.Products;
            if (prod != "failed") {
                var prodhtml = "<h1>" + prod.ProductName + "</h1>";
                prodhtml += "<p><label>Manufacture:</label> " + prod.Manufacture + "</p>";
                prodhtml += "<p><label>Composition:</label> " + prod.Composition + "</p>";
                prodhtml += "<p><label>Price:</label> " + prod.Price + "</p>";
                prodhtml += "<p><label>Description:</label> " + prod.Description + "</p>";
                $('#product-info').html(prodhtml);
            }
            else {
                $('#product-info').html("Invalid Product");
            }
            $('#body-overlay').fadeOut();
        },
        error: function (xhr, status, err) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);

        }
    });

});
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}