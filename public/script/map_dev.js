let geojson;
let map = L.map('mapid').setView([60.8, 100], 3.5);
let info = L.control();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    id: 'mapbox/light-v9',
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
        '<b>' + props.name + '</b><br />' + props.student + ' people'
        : 'Наведите на область');
};
info.addTo(map);

function getColor(d) {
    return d > 50 ? '#800026' :
        d > 40  ? '#BD0026' :
            d > 30  ? '#E31A1C' :
                d > 10  ? '#FC4E2A' :
                    d > 5   ? '#FD8D3C' :
                        d > 2   ? '#FEB24C' :
                            d > 1   ? '#FED976' :
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
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);





