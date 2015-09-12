$(document).ready(function () {
    var ID = getParameterByName("ID");
    $('#body-overlay').fadeIn();
    $.ajax({
        type: "GET",
        url: "http://clients.topmovierankings.com/api/product/" + ID,
        beforeSend: setHeader,
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