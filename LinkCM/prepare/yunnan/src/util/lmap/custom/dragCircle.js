import draw from '../draw/draw'
import icon from '../icon/icon'
import config from '../config'

var dragCircle = {

    _param: {
        radius: 1000,
        pointA: undefined,
        pointB: undefined,
        handle: undefined,
        layer: undefined,
        lonlatA: undefined,
        lonlatB: undefined,
        polyline: undefined,
        circle: undefined,
        map: undefined,
        status: false,
        moveTimer: undefined,
        overlay: undefined,
        ele: undefined,
        downStatus: false,

    },

    addIcon(param) {
        let [ lon, lat ] = config.is84() ? param.lonlat : config.transform(param.lonlat);
        lon = parseFloat(lon);
        lat = parseFloat(lat);
        let point = new ol.geom.Point([ lon, lat ]);
        let feature = new ol.Feature({ 'geometry': point });
        feature.setStyle(icon.getStyle(param.style));
        feature.set('code', 'point' + param.code);
        this._param['point' + param.code] = feature;
        this._param['lonlat' + param.code] = [ lon, lat ];
        this._param.layer.getSource().addFeature(feature);
    },

    initHandle(drawEnd) {

        let _that = this;

        this._param.handle = new ol.interaction.Pointer({
            handleDownEvent: handleDownEvent,
            handleDragEvent: handleDragEvent,
            handleMoveEvent: handleMoveEvent,
            handleUpEvent: handleUpEvent
        });

        function handleDownEvent(evt) {
            let feature = evt.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                return feature;
            });
            if (!!feature && feature.get('code') == 'pointB') {
                let param = _that._param;
                let elon = evt.coordinate[0];
                let blon = param.lonlatB[0];
                feature.getGeometry().translate(elon - blon, 0);
                param.downStatus = true;
                param.lonlatB[0] = elon;
                if (!!param.polyline && !!param.circle) {
                    let lonlatA = param.lonlatA;
                    let radius = Math.abs(param.lonlatB[0] - lonlatA[0]);
                    let coordinates = [lonlatA, param.lonlatB];
                    param.polyline.setCoordinates(coordinates);
                    param.circle.setRadius(radius);
                }
            }
            return !!feature;
        }

        function handleDragEvent(evt) {
            let param = _that._param;
            let feature = param.pointB;
            if (!!feature && _that._param.status) {
                let elon = evt.coordinate[0];
                let lonlatB = param.lonlatB;
                let deltaX = elon - lonlatB[0];
                feature.getGeometry().translate(deltaX, 0);
                lonlatB[0] = elon;

                let lonlatA = param.lonlatA;
                let radius = Math.abs(lonlatB[0] - lonlatA[0]);
                let coordinates = [lonlatA, lonlatB];

                if (!!param.polyline && !!param.circle) {
                    // param.polyline = new ol.geom.LineString(coordinates);
                    // param.circle = new ol.geom.Circle(lonlatA, radius);
                    // param.layer.getSource().addFeatures([ new ol.Feature({ 'geometry': param.polyline }), new ol.Feature({ 'geometry': param.circle }) ]);
                    param.polyline.setCoordinates(coordinates);
                    param.circle.setRadius(radius);
                    param.ele.innerHTML = _that.formatLength(radius);
                } else {
                    return;
                }
            } else {
                return;
            }
        }

        function handleMoveEvent(evt) {
            if (_that._param.moveTimer) {
                window.clearTimeout(_that._param.moveTimer);
                _that._param.moveTimer = null;
            }
            _that._param.moveTimer = window.setTimeout(()=>{
                let feature = evt.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                    return feature;
                });
                let element = evt.map.getTargetElement();
                if (!!feature && feature.get('code') == 'pointB') {
                    element.style.cursor = 'pointer';
                    _that._param.status = true;
                } else {
                    element.style.cursor = 'default';
                    _that._param.status = false;
                    if (_that._param.downStatus) {
                        _that._param.downStatus = false;
                        return drawEnd(_that.getCircle());    
                    }
                }
            }, 50);
        }

        function handleUpEvent(evt) {
            let feature = evt.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                return feature;
            });
            if (!!feature && feature.get('code') == 'pointB') {
                _that._param.downStatus = false;
                return drawEnd(_that.getCircle());
            }
        }

        this._param.map.addInteraction(this._param.handle);

    },

    getCircle() {
        return { center: config.transform(this._param.lonlatA, true), radius: this._param.circle.getRadius() };
    },

    formatLength(radius) {
        return draw.formatLength(radius);
    },

    initRadiusTip(){
        let ele = document.createElement('div');
        ele.className = 'tooltip';
        let overlay = new ol.Overlay({
            element: ele,
            offset: [15, 15],
            positioning: 'bottom-left'
        });
        ele.innerHTML = this.formatLength(this._param.radius);
        overlay.setPosition(this._param.lonlatB);
        this._param.ele = ele;
        this._param.overlay = overlay;
        this._param.map.addOverlay(overlay);
    },

    initDragCircle() {
        let param = this._param;
        let radius = Math.abs(param.lonlatB[0] - param.lonlatA[0]);
        let coordinates = [param.lonlatA, param.lonlatB];
        this._param.radius = radius;
        this._param.polyline = new ol.geom.LineString(coordinates);
        this._param.circle = new ol.geom.Circle(param.lonlatA, radius);
        this._param.layer.getSource().addFeatures([ new ol.Feature({ 'geometry': this._param.polyline }), new ol.Feature({ 'geometry': this._param.circle }) ]);
    },

    getPointB(lonlat, distance) {
        let pointA = config.transform_meter(lonlat);
        pointA[0] += parseFloat(distance);
        let pointB = config.transform_meter(pointA, true);
        return pointB;
    },

    init(param, drawEnd) {

        let layer = icon.initLayer(param.map);
        layer.setStyle(draw.dynamicStyle);
        layer.setZIndex(config.getIndex('draw'));

        this._param.map = param.map;
        this._param.layer = layer;
        this.addIcon(param.pointA);
        this.addIcon(param.pointB);
        this.initDragCircle();
        this.initHandle(drawEnd);
        this.initRadiusTip();

        drawEnd({ center: config.transform(this._param.lonlatA, true), radius: this._param.circle.getRadius() });
        return { handle: this._param.handle, layer: this._param.layer, map: param.map, overlay: this._param.overlay };

    },

    remove(param) {
        this._param = {
            radius: 1000,
            pointA: undefined,
            pointB: undefined,
            handle: undefined,
            layer: undefined,
            lonlatA: undefined,
            lonlatB: undefined,
            polyline: undefined,
            circle: undefined,
            map: undefined,
            status: false,
            moveTimer: undefined,
            downStatus: undefined,
            overlay: undefined,
            ele: undefined,
        }
        param.map.removeOverlay(param.overlay);
        param.map.removeInteraction(param.handle);
        param.map.removeLayer(param.layer);
    }

};

module.exports = dragCircle;