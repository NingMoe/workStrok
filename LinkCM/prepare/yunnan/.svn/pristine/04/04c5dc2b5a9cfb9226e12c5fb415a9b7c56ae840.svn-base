export default function(map) {
    let style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 255, 0.8)',
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.3)'
        })
    });
    let layer = new ol.layer.Vector({
        style: style,
        source: new ol.source.Vector({
            features: []
        })
    });
    return layer;
}