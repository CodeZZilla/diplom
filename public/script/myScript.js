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
                for (let item of statesData.features) {
                    item.properties.student = 0;
                }
                for (let item of statesData.features) {
                    for (let el of data) {
                        if (item.properties.name.split(' ')[0] === el.region) {
                            item.properties.student = el.count;
                        }
                    }
                }
                geojson.remove();
                geojson = L.geoJson(statesData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
                console.log(data);
            });
        }
    });

});


function render() {
    $.get('/getYears', (data) => {
        $('#yearId').empty();
        $.each(data, function (k, v) {
            let option = "<option style='max-width: 200px' value = '" + v + "'>" + v + "</option>";
            $('#yearId').append(option);
        });
        $('#yearId').selectpicker('refresh');
    });

    $.get('/getBasisOfTraining', (data) => {
        $('#basisOfTrainingId').empty();
        $.each(data, function (k, v) {
            let option = "<option style='max-width: 200px' value = '" + v + "'>" + v + "</option>";
            $('#basisOfTrainingId').append(option);
        });
        $('#basisOfTrainingId').selectpicker('refresh');
    });

    $.get('/getFormOfStudy', (data) => {
        $('#formOfStudyId').empty();
        $.each(data, function (k, v) {
            let option = "<option  style='max-width: 200px' value = '" + v + "'>" + v + "</option>";
            $('#formOfStudyId').append(option);
        });
        $('#formOfStudyId').selectpicker('refresh');
    });

    $.get('/getMinMaxMark', (data) => {
        let $d0 = $("#demo_0");
        $d0.ionRangeSlider({
            min: data[0],
            max: data[1],
            from: 50,
            step: 1,            // default 1 (set step)
            grid: true,         // default false (enable grid)
            grid_num: 4,        // default 4 (set number of grid cells)
            grid_snap: false
        });
    });

}


$(window).load(function () {
    $('.loader').hide();
    $.get('/getData', (data) => {
        for (let item of statesData.features) {
            item.properties.student = 0;
        }
        for (let item of statesData.features) {
            for (let el of data) {
                if (item.properties.name.split(' ')[0] === el.region) {
                    item.properties.student = el.count;
                }
            }
        }

        geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });
    render();

    for (let item of statesData.features) {
        let option = "<option style='max-width: 200px' value = '" + item.properties.name + "'>" + item.properties.name + "</option>";
        $('#region').append(option);
    }
    $('#region').selectpicker('refresh');
});

$(document).ajaxStart(function () {
    //$('.mainblock').hide();
    $('.loader').show();
}).ajaxStop(function () {
    $('.loader').hide();
    //$('.mainblock').show();
});

function btnGo() {
    let year = $('#yearId').val();
    let basisOfTraining = $('#basisOfTrainingId').val();
    let formOfStudy = $('#formOfStudyId').val();
    let gender = $('#genderId').val();

    let $inp = $('#demo_0');
    let v = $inp.prop("value");     // input value in format FROM;TO
    let min = $inp.data("from");   // input data-from attribute
    let max = $inp.data("to");       // input data-to attribute

    $.ajax({
        url: '/postDataFilter',                               /* Куда пойдет запрос */
        method: 'post',                                           /* Метод передачи (post или get) */
        dataType: 'json',                                         /* Тип данных в ответе (xml, json, script, html). */
        data: {
            year: year,
            basisOfTraining: basisOfTraining,
            formOfStudy: formOfStudy,
            gender: gender,
            min: min,
            max: max
        },
        success: function (data) {                    /* функция которая будет выполнена после успешного запроса.  */
            for (let item of statesData.features) {
                item.properties.student = 0;
            }
            for (let item of statesData.features) {
                for (let el of data) {
                    if (item.properties.name.split(' ')[0] === el.region) {
                        item.properties.student = el.count;
                    }
                }
            }
            geojson.remove();
            geojson = L.geoJson(statesData, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
        }
    });
}

function btnClear() {
    $.get('/getData', (data) => {
        for (let item of statesData.features) {
            item.properties.student = 0;
        }
        for (let item of statesData.features) {
            for (let el of data) {
                if (item.properties.name.split(' ')[0] === el.region.split(' ')[0]) {
                    item.properties.student = el.count;
                }
            }
        }

        geojson.remove();
        geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });
}


function poisk() {
    let value = $('#region').val();
    let feature;
    for (let item of statesData.features) {
        if (item.properties.name === value) {
            feature = item;
        }
    }

    $.get('/getGeoFromName?name=' + value.split(' ')[0], (data) => {

    });

    map.fitBounds(feature.properties.cartodb_id);
}