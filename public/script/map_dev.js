let geojson;
let map = L.map('mapid').setView([60.8, 100], 3.5);
let info = L.control();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken:'pk.eyJ1Ijoia2l0dmFsZW50eW4xIiwiYSI6ImNrcHBxd2liMjBjYngycXM0aXl5MG8wZjkifQ.Lu-g6dONffgL4I0Cj1p5_A'
}).addTo(map);

L.geoJson(statesData).addTo(map);

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = (props ?
        '<b>' + props.name + '</b><br />' + props.student + ' people / mi<sup>2</sup>'
        : 'Наведите на область');
};
info.addTo(map);

function getColor(d) {
    return d > 1000 ? '#800026' :
        d > 500  ? '#BD0026' :
            d > 200  ? '#E31A1C' :
                d > 100  ? '#FC4E2A' :
                    d > 50   ? '#FD8D3C' :
                        d > 20   ? '#FEB24C' :
                            d > 10   ? '#FED976' :
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
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
    if (feature.properties && feature.properties.name) {
        layer.bindPopup(feature.properties.name);
    }
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);





