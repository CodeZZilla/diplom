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
        $('#yearId').append("<option style='max-width: 200px' value = 'null'>Ничего не выбрано</option>");
        $.each(data, function (k, v) {
            let option = "<option style='max-width: 200px' value = '" + v + "'>" + v + "</option>";
            $('#yearId').append(option);
        });
        $('#yearId').selectpicker('refresh');
    });

    $.get('/getBasisOfTraining', (data) => {
        $('#basisOfTrainingId').empty();
        $('#basisOfTrainingId').append("<option style='max-width: 200px' value = 'null'>Ничего не выбрано</option>");
        $.each(data, function (k, v) {
            let option = "<option style='max-width: 200px' value = '" + v + "'>" + v + "</option>";
            $('#basisOfTrainingId').append(option);
        });
        $('#basisOfTrainingId').selectpicker('refresh');
    });

    $.get('/getFormOfStudy', (data) => {
        $('#formOfStudyId').empty();
        $('#formOfStudyId').append("<option style='max-width: 200px' value = 'null'>Ничего не выбрано</option>");
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
                if (item.properties.name.split(' ')[0] === el.region.split(' ')[0]) {
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

    $('#region').append("<option style='max-width: 200px' value = 'null'>Ничего не выбрано</option>");
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

    let str = '/getDataFilter?year=' + year +
        '&basisOfTraining=' + basisOfTraining +
        '&formOfStudy=' + formOfStudy +
        '&gender=' + gender +
        '&min=' + min +
        '&max=' + max;
    $.get(str, (data) => {
        console.log(data);
        for (let item of statesData.features) {
            item.properties.student = 0;
        }
        for (let item of statesData.features) {
            for (let el of data) {
                console.log(item.properties.name.split(' ')[0] + ' === ' + el.region.split(' ')[0])
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
        render();
        $('#genderId').selectpicker('refresh');
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
    render();
}


function poisk(){
    let value = $('#region').val();
    let feature;
    for (let item of statesData.features){
        if(item.properties.name === value){
            feature = item;
        }
    }
    map.fitBounds(feature.properties.cartodb_id);
}