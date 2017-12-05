import config from '../../config'

/**
 * 根据wkt画线
 * @param layer
 * @wktStr WKT字符串
 * @style feature样式
 */
export default function(layer, wktStr, style) {
    let formatRead = new ol.format.WKT();
    let feature = formatRead.readFeature(wktStr);
    feature.getGeometry().transform(config.SOURCE_PROJECTION, config.SYSTEM_PROJECTION);
    if (!!style) {
        let scolor = '#00A8FF';
        let swidth = '1';
        let lineDash = [];
        if (!!style.strokeColor) scolor = style.strokeColor;
        if (!!style.strokeWidth) swidth = style.strokeWidth;
        if (!!style.lineDash) lineDash = style.lineDash;
        let fstyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 8,
                lineDash: lineDash
            }),
        });
        let outstyle = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: scolor,
                width: swidth,
                lineDash: lineDash
            }),
        });
        feature.setStyle([fstyle, outstyle]);
    }
    let source = layer.getSource();
    source.addFeature(feature);
}