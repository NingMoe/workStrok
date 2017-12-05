import hander from '../draw/draw'
import config from '../config'

/**
 * 控制地图行为
 */
var controler = {

    /**
     * 设置地图中心点
     */
    setCenter: function(map, lon, lat, zoom) {
        if (typeof(lon) == 'string') lon = parseFloat(lon);
        if (typeof(lat) == 'string') lat = parseFloat(lat);
        if (!!zoom) map.getView().setZoom(zoom);
        map.getView().setCenter(config.transform([lon, lat]));
    },

    /**
     * 导出当前地图图片
     */
    exportMap: function(map, ele) {
        map.once('postcompose', function(event) {
            let canvas = event.context.canvas;
            ele[0].href = canvas.toDataURL('image/png');
        });
        map.renderSync();
    },

    /**
     * 地图放大1级
     */
    zoomIn: function(map) {
        this.zoom(map, 1);
    },

    /**
     * 地图缩小1级
     */
    zoomOut: function(map) {
        this.zoom(map, -1);
    },
    zoom: function(map, num) {
        let view = map.getView();
        let zoom = view.getZoom();
        view.setZoom(zoom + num);
    },
    panTo: function(map, lon, lat, zoom) {
        if (typeof(lon) == 'string') lon = Number.parseFloat(lon);
        if (typeof(lat) == 'string') lat = Number.parseFloat(lat);
        let view = map.getView();
        let pan = ol.animation.pan({
            duration: 2000,
            source: (view.getCenter())
        });
        map.beforeRender(pan);
        view.setZoom(zoom);
        view.setCenter(config.transform([lon, lat]));
    },
    flyTo: function(map, lon, lat) {
        if (typeof(lon) == 'string') lon = parseFloat(lon);
        if (typeof(lat) == 'string') lat = parseFloat(lat);
        let duration = 2000;
        let start = +new Date();
        let view = map.getView();
        let pan = ol.animation.pan({
            duration: duration,
            source: (view.getCenter()),
            start: start
        });
        let bounce = ol.animation.bounce({
            duration: duration,
            resolution: 4 * view.getResolution(),
            start: start
        });
        map.beforeRender(pan, bounce);
        view.setCenter(config.transform([lon, lat]));
    },
    addZoomSlider: function(map) {
        let zoomslider = new ol.control.ZoomSlider();
        map.addControl(zoomslider);
    },
    addScaleLine: function(map) {
        let scaleLine = new ol.control.ScaleLine();
        map.addControl(scaleLine);
    },
    getEvtLonLat: function(evt) {
        let coordinate = evt.coordinate;
        let [lon, lat] = config.transform(coordinate, true);
        return [parseFloat(lon), parseFloat(lat)];
    },
    // 弹出窗口
    addPopup: function(map, feature, callBack) {
        let measureEle = document.createElement('div');
        let inputEle = document.createElement('input');
        inputEle.value = '请输入文字';
        let btn = document.createElement('button')
        btn.innerHTML = '完成';
        let popup = null;
        inputEle.onfocus = function() {
            inputEle.value = '';
        };
        // 回车事件
        inputEle.onkeydown = function() {
            let event = window.event; //消除浏览器差异    
            if (event.keyCode == 13) {
                backEvt();
            }
        }

        btn.onclick = function() {
            backEvt();
        };

        // 输入框提交事件
        let backEvt = function() {
            if (!!callBack) {
                if (inputEle.value != '请输入文字') {
                    callBack(feature, inputEle.value);
                }
            }
            map.removeOverlay(popup);
        }

        measureEle.appendChild(inputEle);
        measureEle.appendChild(btn);

        popup = new ol.Overlay({
            element: measureEle,
            offset: [110, 0],
            positioning: 'bottom-center'
        });
        map.addOverlay(popup);
        let coord = feature.getGeometry().getCoordinates();
        popup.setPosition(coord);
        return popup;
    },
    // 移除
    removePopup: function(map, pop) {
        map.removeOverlay(pop);
    },
    // 鼠标经纬度显示控件
    mousePosition: function(map, id) {
        let controler = new ol.control.MousePosition({
            undefinedHTML: '未知',
            projection: config.SOURCE_PROJECTION,
            coordinateFormat: function(coordinate) {
                return ol.coordinate.format(coordinate, '{x}, {y}', 4);  //经纬度显示的格式 lon,lat   保留4位小数
            },
            target: document.getElementById(id)
        });
        map.addControl(controler);
        return controler;
    },
    // 地图网格线组件
    addGraticule: function(map) {
        let graticule = new ol.Graticule({
            strokeStyle: new ol.style.Stroke({
                color: 'rgba(192,190,190,1)',
                width: 1
            }),
            targetSize: 150,
            projection: config.SOURCE_PROJECTION,
        });
        graticule.setMap(map);
        return graticule;
    },
    // 移除网格线组件
    removeGraticule: function(grat) {
        grat.setMap(null);
    },
    /** 
     * 地图定位
     * @param {object}map 地图对象
     * @param {string|number}lon 经度
     * @param {string|number}lat 纬度
     * @param {object}style 样式对象
     * return {object}layer layer
     */
    mapPosition: function(map, lon = 0, lat = 0, style) {
        let layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: []
            })
        });

        if (typeof(lon) == 'string') lon = parseFloat(lon);
        if (typeof(lat) == 'string') lat = parseFloat(lat);

        let center = config.transform([lon, lat]);
        let feature = new ol.Feature(new ol.geom.Point(center));

        let tempStyle = hander.getStyle(style);
        feature.setStyle(tempStyle);
        layer.getSource().addFeature(feature);
        layer.setZIndex(0);
        map.addLayer(layer);

        let view = map.getView();
        view.setCenter(center);
        view.setZoom(5);

        return layer;
    },
    /** 
     * 移除定位点
     * @param {object}map 地图对象
     * @param {object}layer 地图定位返回对象
     */
    removePosition: function(map, layer) {
        if (!!map && !!layer)
            map.removeLayer(layer);
    },

    /**
     * 获取鼠标所在的像素
     */
    MousePageXY: function(e) {
        let mouseCoordInMapPixels = [e.originalEvent.offsetX, e.originalEvent.offsetY];
        return mouseCoordInMapPixels;
    }
};

module.exports = controler;