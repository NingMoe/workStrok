import geom from './geom';
import config from '../../config'

export default function(map, wkt) {
    let style = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
        })
    });
    let format = new ol.format.WKT();
    let feature = format.readFeature(wkt, {
        dataProjection: config.SOURCE_PROJECTION,
        featureProjection: config.SYSTEM_PROJECTION
    });
    let layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [feature]
        }),
        style: style
    });
    return layer;
}