let saveGeo = false;

//загрузка файла на сервер
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

                render();
                numbersUp(data);
                geojson = L.geoJson(statesData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
                saveGeo = false;
            });
        }
    });

});

//метод для выборки уникальных элементов в array
function unique(arr) {
    let result = [];
    for (let str of arr) {
        if (!result.includes(str)) {
            result.push(str);
        }
    }
    return result;
}

//динамическая легенда, основная логика
function numbersUp(outputArr) {
    numbers = [];

    let temps = [];
    for (let item of outputArr) {
        temps.push(item.count);
    }
    temps.sort((a, b) => a - b)
    temps = unique(temps);

    if (temps.length === 7) {
        numbers.push(1);
        numbers.push(10);
        numbers.push(20);
        numbers.push(50);
        numbers.push(100);
        numbers.push(150);
        numbers.push(200);
    } else if (temps.length < 7 && temps.length > 0) {
        numbers.push(1);
        numbers.push(10);
        numbers.push(20);
        numbers.push(50);
        numbers.push(100);
        numbers.push(150);
        numbers.push(200);
    } else if (temps.length === 0) {
        numbers.push(100);
        numbers.push(50);
        numbers.push(20);
        numbers.push(10);
        numbers.push(5);
        numbers.push(1);
        numbers.push(0);
    } else {
        numbers.push(temps[0]);

        let x = Math.round(temps.length / 2);
        numbers.push(temps[x]);

        numbers.push(temps[x + Math.round(x / 2)]);
        numbers.push(temps[x + Math.round(x / 3 * 2)]);

        numbers.push(temps[Math.round(x / 3)]);
        numbers.push(temps[Math.round(x / 3 * 2)]);

        numbers.push(temps[temps.length - 1] - 1);
    }

}

//мето для заполнения мультиселектов
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

    $.get('/getSpecialty', (data) => {
        $('#specialtyId').empty();
        $.each(data, function (k, v) {
            let option = "<option  style='max-width: 200px' value = '" + v + "'>" + v + "</option>";
            $('#specialtyId').append(option);
        });
        $('#specialtyId').selectpicker('refresh');
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

//метод при загрузки основного окна
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

        numbersUp(data);
        geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
        // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        //     zindex:1000
        // }).addTo(map);
    });
    render();

    for (let item of statesData.features) {
        let option = "<option style='max-width: 200px' value = '" + item.properties.name + "'>" + item.properties.name + "</option>";
        $('#region').append(option);
    }
    $('#region').selectpicker('refresh');
});

//загрузка лоадера, когда работает аджакс
$(document).ajaxStart(function () {
    //$('.mainblock').hide();
    $('.loader').show();
}).ajaxStop(function () {
    $('.loader').hide();
    //$('.mainblock').show();
});

//метод при нажатии кнопки "Применить"
function btnGo() {
    let year = $('#yearId').val();
    let basisOfTraining = $('#basisOfTrainingId').val();
    let formOfStudy = $('#formOfStudyId').val();
    let gender = $('#genderId').val();
    let specialty = $('#specialtyId').val();

    let $inp = $('#demo_0');
    let min = $inp.data("from");
    let max = $inp.data("to");

    $.ajax({
        url: '/postDataFilter',                               /* Куда пойдет запрос */
        method: 'post',                                           /* Метод передачи (post или get) */
        dataType: 'json',                                         /* Тип данных в ответе (xml, json, script, html). */
        data: {
            year: year,
            basisOfTraining: basisOfTraining,
            formOfStudy: formOfStudy,
            gender: gender,
            specialty: specialty,
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

            numbersUp(data);
            geojson.remove();
            geojson = L.geoJson(statesData, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);
        }
    });
}

//метод при нажатии кнопки "Сбросить"
function btnClear() {
    markers.forEach(el => el.remove());
    markers = [];
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

        numbersUp(data);
        geojson.remove();
        geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });
}

//метод при нажатии кнопки "Поиск"
function poisk() {
    let value = $('#region').val();
    let feature;
    for (let item of statesData.features) {
        if (item.properties.name === value) {
            feature = item;
        }
    }

    let year = $('#yearId').val();
    let basisOfTraining = $('#basisOfTrainingId').val();
    let formOfStudy = $('#formOfStudyId').val();
    let gender = $('#genderId').val();
    let specialty = $('#specialtyId').val();

    let $inp = $('#demo_0');
    let min = $inp.data("from");
    let max = $inp.data("to");

    $.ajax({
        url: '/postGeoFromName',                               /* Куда пойдет запрос */
        method: 'post',                                           /* Метод передачи (post или get) */
        dataType: 'json',                                         /* Тип данных в ответе (xml, json, script, html). */
        data: {
            year: year,
            basisOfTraining: basisOfTraining,
            formOfStudy: formOfStudy,
            gender: gender,
            specialty: specialty,
            min: min,
            max: max,
            nameRegion: value.split(' ')[0]
        },
        success: function (data) {
            markers.forEach(el => el.remove());
            markers = [];
            console.log(data);
            let countSum = 0;
            for (let item of data) {
                try {
                    countSum += item.count;
                    let marker = L.marker([item.geo[0].latitude, item.geo[0].longitude]).addTo(map);
                    marker.bindTooltip("<b>" + item.region + "</b><br>" + item.count + " people").openPopup();
                    markers.push(marker);
                } catch (e) {
                    continue;
                }
            }

            for (let item of statesData.features) {
                item.properties.student = 0;
            }
            for (let item of statesData.features) {
                if (item.properties.name === value) {
                    item.properties.student = countSum;
                }
            }

            numbersUp(data);
            geojson.remove();
            // geojson = L.geoJson(statesData, {
            //     style: style,
            //     onEachFeature: onEachFeature
            // }).addTo(map);

            map.fitBounds(feature.properties.cartodb_id);
        }
    });
}


function saveGeoData(){
    if(!saveGeo){
        $.get('/getGeoSave', (data) => {
            $('#result').text('Сохранено!');
            saveGeo = true;
        });
    }
}