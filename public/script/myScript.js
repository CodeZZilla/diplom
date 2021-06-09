function setFile() {
    console.log('fdfsdfsdfg')
    $('#myform').submit(function (e) {
        console.log("32432423432");
        $.ajax({
            url: '/addFile',
            type: 'POST',
            data: new FormData(this),
            processData: false,
            contentType: false
        });
        e.preventDefault();
    });
}

