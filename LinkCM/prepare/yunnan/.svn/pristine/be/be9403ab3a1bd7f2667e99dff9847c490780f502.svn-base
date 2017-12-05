import config from '../../config'
export default {
    drawGeom: function(type, params) {
        let geom = null;
        switch (type) {
            case 'point':
                geom = new ol.geom.Point(params);
                break;
            case 'lineString':
                geom = new ol.geom.LineString(params);
                break;
        }
        geom.transform(config.SOURCE_PROJECTION, config.SYSTEM_PROJECTION);
        let feature = new ol.Feature({});
        feature.setGeometry(geom);
        return feature;
    }
}