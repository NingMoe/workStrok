import draw from './draw/draw';
import hander from '../draw/draw'
import config from '../config'

var polygon = {
    
    /**
     * 通过wkt获取feature
     * @layer vector图层对象
     * @param wkt wkt字符数据
     * @param style feature所需要的样式
     * @param name feature的名称
     * @return feature对象
     */
    addFeatureFromWkt: function(layer, wkt, style, name) {
        let format = new ol.format.WKT();
        let feature = format.readFeature(wkt, {
            dataProjection: config.SOURCE_PROJECTION,
            featureProjection: config.SYSTEM_PROJECTION
        });
        let tempStyle;
        if (name == 'dyString') tempStyle = hander.styleFun(style, 'dyString');
        else tempStyle = hander.getStyle(style);
        feature.setStyle(tempStyle);
        feature.set('name', name);
        feature.set('style', tempStyle);
        layer.getSource().addFeature(feature);
        return feature;
    },

    /**
     * 获得一个circle的feature对象
     * @layer vector图层对象
     * @param lon 经度
     * @param lat 纬度
     * @param radius 圆的半径
     * @param style feature样式
     * @param name feature的名称
     * @return feature对象
     */
    addFeatureFromCircle: function(layer, lon, lat, radius, style, name) {
        if (typeof(lon) == 'string') lon = parseFloat(lon);
        if (typeof(lat) == 'string') lat = parseFloat(lat);
        if (typeof(radius) == 'string') radius = parseFloat(radius);
        let circle = new ol.geom.Circle(config.transform([lon, lat]), radius);
        let feature = new ol.Feature(circle);
        if (!!name) feature.set('name', name);
        if (!!style) feature.set('style', style);
        let tempStyle = hander.getStyle(style);
        feature.setStyle(tempStyle);
        layer.getSource().addFeature(feature);
        return feature;
    },
    /**
     * 获取文本feature
     * @param layer layer图层
     * @param lon 经度
     * @param lat 纬度
     * @param style 样式
     * @param name feature名称
     */
    addFeatureText: function(layer, wkt, style, name) {
        if (typeof(lon) == 'string') lon = parseFloat(lon);
        if (typeof(lat) == 'string') lat = parseFloat(lat);
        let format = new ol.format.WKT();
        let feature = format.readFeature(wkt, {
            dataProjection: config.SOURCE_PROJECTION,
            featureProjection: config.SYSTEM_PROJECTION
        });

        if (!!name) feature.set('name', name);
        if (!!style) feature.set('style', style);
        // let style = hander.getStyle(style);
        let fontColor = '#999',
            outColor = '#fff',
            outWidth = 0,
            fontSize = '12px',
            text = '',
            offsetY = 0,
            offsetX = 0;
        if (!!style) {
            if (!!style.fontColor) fontColor = style.fontColor; //文字颜色
            if (!!style.outColor) outColor = style.outColor; //描边颜色
            if (!!style.outWidth) outWidth = style.outWidth; //描边宽度
            if (!!style.fontSize) fontSize = style.fontSize; //文字大小
            if (!!style.text) text = style.text; //文本内容
            if (!!style.offsetY) offsetY = style.offsetY; //文本Y轴偏移
            if (!!style.offsetX) offsetX = style.offsetX; //文本X轴偏移
        }
        let tempStyle = new ol.style.Style({
            text: new ol.style.Text({
                text: text,
                offsetY: offsetY,
                offsetX: offsetX,
                font: fontSize + ' Verdana',
                fill: new ol.style.Fill({ color: fontColor }),
                stroke: new ol.style.Stroke({
                    color: outColor,
                    width: outWidth
                })
            })
        });
        feature.setStyle(tempStyle);
        layer.getSource().addFeature(feature);
        return feature;
    },
    /**
     * 圈选任意的镇边界或县市边界 
     * @param {object}map 地图对象
     * @param {string}codeArr 需要圈选的区域编码
     * @param {object}style 样式对象
     * @param {boolean}extend 设置是否需要自动放大区域位置
     */
    selectArea: function(map, code, style = null, extend = false) {
        let outPath = '';
        let tempStyle = hander.getStyle(style);
        let type = 'json';
        let format = {
            'json': new ol.format.TopoJSON({ defaultProjection: config.SOURCE_PROJECTION }),
            'wkt': new ol.format.WKT()
        };
        let formatRead = format[type];
        let layer = new ol.layer.Vector({ style: tempStyle });
        let url = 'http://10.148.16.56/dss/topic/mapjson/' + outPath + code + '.' + type;
        let source = new ol.source.Vector({
            format: formatRead,
            projection: config.SOURCE_PROJECTION,
            url: url
        });
        layer.setSource(source);
        if (extend) lmap.extendToLayer(layer);
        return layer;
    }
}

polygon.draw = draw;
module.exports = polygon;