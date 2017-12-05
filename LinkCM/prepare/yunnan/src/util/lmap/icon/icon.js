import config from '../config'

var icon = {

    add: function(map, lon, lat) {
        if (typeof(lon) == 'string') lon = parseFloat(lon);
        if (typeof(lat) == 'string') lat = parseFloat(lat);
        let feature = new ol.Feature(new ol.geom.Point(config.transform([lon, lat])));
        feature.setStyle(new ol.style.Style({
            image: new ol.style.Icon(({
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR42mP8DwABAwEBnHxMcgAAAABJRU5ErkJggg==',
                anchor: [16, 0],
                size: [32, 32],
                scale: 1,
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                anchorOrigin: 'bottom-left'
            }))
        }));
        let layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [feature]
            })
        });
        this.map = map;
        return layer;
    },
    remove: function(layer) {
        this.map.removeLayer(layer);
    },
    initVector: function(map) {
        return this.initLayer(map);
    },
    // 初始化画布
    initLayer: function(map, index) {
        let layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: []
            })
        });
        layer.setZIndex(config.getIndex(index));
        map.addLayer(layer);
        return layer;
    },
    // 添加icon
    addIcon: function(layer, param, lon, lat, type) {
        if (typeof(lon) == 'string') lon = parseFloat(lon);
        if (typeof(lat) == 'string') lat = parseFloat(lat);
        let feature = new ol.Feature(new ol.geom.Point(config.transform([lon, lat])));
        if (!!type) feature.set('name', type);
        this.setStyle(feature, param);
        layer.getSource().addFeature(feature);
        return feature;
    },

    getStyle(param){

        let fillColor = 'rgba(224,76,56,0.5)',
            fontColor = '#999',
            fontSize = '12px',
            outColor = '#fff',
            outWidth = 0,
            strokeColor = '#1A1A1A',
            strokeWidth = '1',
            text = '',
            offsetY = 0,
            offsetX = 0,
            src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR42mP8DwABAwEBnHxMcgAAAABJRU5ErkJggg==',
            anchor = [0.5, 0.5],
            iconSize = [0, 0],
            scale = 1;

        if (!!param) {
            if (!!param.strokeColor) strokeColor = param.strokeColor;
            if (!!param.strokeWidth) strokeWidth = param.strokeWidth;
            if (!!param.fontColor) fontColor = param.fontColor; //文字颜色
            if (!!param.outColor) outColor = param.outColor; //描边颜色
            if (!!param.outWidth) outWidth = param.outWidth; //描边宽度
            if (!!param.fontSize) fontSize = param.fontSize; //文字大小
            if (!!param.text) text = param.text; //文本内容
            if (!!param.offsetY) offsetY = param.offsetY; //文本Y轴偏移
            if (!!param.offsetX) offsetX = param.offsetX; //文本X轴偏移
            if (!!param.anchor) anchor = param.anchor; //icon位置偏移
            if (!!param.iconUrl) src = param.iconUrl; //icon路径
            if (!!param.iconSize) iconSize = param.iconSize; //icon大小
            if (!!param.scale) scale = param.scale; //icon比例
        }

        return new ol.style.Style({
            image: new ol.style.Icon({
                anchor: anchor,
                src: src,
                size: iconSize,
                scale: scale,
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                anchorOrigin: 'bottom-left'
            }),
            text: new ol.style.Text({
                text: text,
                offsetY: offsetY,
                font: fontSize + ' Times New Roman',
                fill: new ol.style.Fill({
                    color: fontColor
                }),
                stroke: new ol.style.Stroke({
                    color: outColor,
                    width: outWidth
                })
            }),
            fill: new ol.style.Fill(strokeColor),
            stroke: new ol.style.Stroke(strokeWidth),
        })
    },

    // 设置feature样式
    setStyle: function(feature, param) {
        feature.setStyle(this.getStyle(param));
    },
    // 撤消上一次画图
    undo: function(layer) {
        let source = layer.getSource();
        let features = source.getFeatures();
        let l = features.length;
        if (l > 0) source.removeFeature(features[l - 1]);
    },
    // 清除所有
    clear: function(layer) {
        layer.getSource().clear();
    },
};

module.exports = icon;