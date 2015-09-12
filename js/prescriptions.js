$('#btn-submit').click(function () {
    if ($('#txtName').val() == '') {
        $('#txtName').focus();
        $('#txtName').next().html("Please enter Title");
        return;
    }
    else
        $('#txtName').next().html("");
    if ($('#fuPrescriptions').val() == '') {
        $('#fuPrescriptions').focus();
        $('#fuPrescriptions').next().html("Please select files to upload");
        return;
    }
    else
        $('#txtMobile').next().next().html("");
    var formData = new FormData();
    var file = $('#fuPrescriptions')[0];
    var cartID = window.localStorage.getItem("cartID");
    formData.append('file', file.files[0]);
    formData.append('cartID', cartID);
    formData.append('Desc', $('#txtDescription').val());
    formData.append('Title', $('#txtName').val());
    if (file.files[0].size > (512 * 1024)) {
        alert('File size more than 512 KB not allowed');
        return;
    }
    $('#body-overlay').fadeIn();
    $.ajax({
        type: "POST",
        url: "http://clients.topmovierankings.com/api/Prescription",
        beforeSend: setHeader,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,

        success: function (data) {
            //$('#fuPrescriptions').addClass('alert-success').html('<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a><strong>Success!</strong><a href="' + d + '">Open File</a>').show();
            $('#fuPrescriptions').val(null);
            window.location.href = 'shopping-cart.html';
        },
        error: function (xhr, status, err) {
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);

        }
    });
});
