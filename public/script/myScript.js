$('#submit').bind('click', function (e) {
    e.preventDefault();
    $("#result").html("")

    let file = $('.filedata')[0].files[0];
    let data = new FormData();
    data.append('filedata', file);
    $.ajax({
        url: '/addFile',
        method: 'POST',
        async: true,
        processData: false,
        contentType: false,
        data: data,
        success: function (res) {
            $("#result").append(res);
            $.get('/getData', (data) => {
                let mass = []
                for (let el of data) {
                    mass.push(el.region.split(' ')[0]);
                }
                for (let item of statesData.features) {
                    for (let el of data) {
                        if (item.properties.name.split(' ')[0] === el.region.split(' ')[0]) {
                            item.properties.student = el.count;
                        }
                    }
                }
                geojson = L.geoJson(statesData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
                console.log(data);
            });
        }
    });

});


$(window).load(function () {
    $('.loader').hide();

    $.get('/getData', (data) => {
        let mass = []
        for (let el of data) {
            mass.push(el.region.split(' ')[0]);
        }
        for (let item of statesData.features) {
            for (let el of data) {
                if (item.properties.name.split(' ')[0] === el.region.split(' ')[0]) {
                    item.properties.student = el.count;
                }
            }
        }

        geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
        console.log(data);
    });
});

$(document).ajaxStart(function () {
    //$('.mainblock').hide();
    $('.loader').show();
}).ajaxStop(function () {
    $('.loader').hide();
    //$('.mainblock').show();
});