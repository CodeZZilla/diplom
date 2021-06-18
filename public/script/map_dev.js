//инициализация карты
let geojson;
let map = L.map('mapid').setView([60.8, 100], 3.5);
let info = L.control();
let markers = [];
let numbers = [];

//создание панели для правильного отображения слоев
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';
//добавляем геокодер на карту
L.Control.geocoder().addTo(map);
//создаем основной слой
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken:'pk.eyJ1Ijoia2l0dmFsZW50eW4xIiwiYSI6ImNrcHBxd2liMjBjYngycXM0aXl5MG8wZjkifQ.Lu-g6dONffgL4I0Cj1p5_A'
}).addTo(map).bringToFront();

//слоя с подписями на карте
let positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {}).addTo(map);

let positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
    pane: 'labels'
}).addTo(map);

//всплывающее окно с данными
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

//обновления окна
info.update = function (props) {
    this._div.innerHTML = (props ?
        '<b>' + props.name + '</b><br />' + props.student + ' people'
        : 'Наведите на область');
};
//добавление на карту
info.addTo(map);

//динамическая легенда
function getColor(d) {
    numbers.sort((a, b) => a - b)
    $('#h4-1').text('>' + numbers[0]);
    $('#h4-2').text('>' + numbers[1]);
    $('#h4-3').text('>' + numbers[2]);
    $('#h4-4').text('>' + numbers[3]);
    $('#h4-5').text('>' + numbers[4]);
    $('#h4-6').text('>' + numbers[5]);
    $('#h4-7').text('>' + numbers[6]);
    return d >= numbers[6] ? '#800026' :
        d > numbers[5]  ? '#BD0026' :
            d > numbers[4]  ? '#E31A1C' :
                d > numbers[3]  ? '#FC4E2A' :
                    d > numbers[2]   ? '#FD8D3C' :
                        d > numbers[1]   ? '#FEB24C' :
                            d >  numbers[0]  ? '#FED976' :
                                '#fff7bc';
}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.student),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    feature.properties.cartodb_id = layer.getBounds();
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

