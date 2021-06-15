let geojson;
let map = L.map('mapid').setView([60.8, 100], 3.5);
let info = L.control();
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;
map.getPane('labels').style.pointerEvents = 'none';

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    zoomSnap: 0.25,
    accessToken:'pk.eyJ1Ijoia2l0dmFsZW50eW4xIiwiYSI6ImNrcHBxd2liMjBjYngycXM0aXl5MG8wZjkifQ.Lu-g6dONffgL4I0Cj1p5_A'
}).addTo(map);

let positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap, ©CartoDB'
}).addTo(map);

let positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
    attribution: '©OpenStreetMap, ©CartoDB',
    pane: 'labels'
}).addTo(map);

let marker = L.marker([55.75583, 37.6173]).addTo(map).bindTooltip("I am a green leaf.");

let searchControl = new L.esri.Controls.Geosearch().addTo(map);
let results = new L.LayerGroup().addTo(map);

searchControl.on('results', function(data){
    results.clearLayers();
    for (let i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
    }
});

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = (props ?
        '<b>' + props.name + '</b><br />' + props.student + ' people'
        : 'Наведите на область');
}.addTo(map);
function getColor(d) {
    return d > 150 ? '#800026' :
        d > 100  ? '#BD0026' :
            d > 50  ? '#E31A1C' :
                d > 30  ? '#FC4E2A' :
                    d > 10   ? '#FD8D3C' :
                        d > 5   ? '#FEB24C' :
                            d > 0   ? '#FED976' :
                                '#fff7bc';
}
function style(feature) {
    return {
        fillColor: getColor(feature.properties.student),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.4
    };
}
function highlightFeature(e) {
    let layer = e.target;

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.4
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    };
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
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}
geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);




