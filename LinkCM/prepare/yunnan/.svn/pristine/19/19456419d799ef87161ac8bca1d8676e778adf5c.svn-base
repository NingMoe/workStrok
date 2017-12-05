import config from '../config'

// 地图画图类
var draw = {

    /**
     * 操作工具画点
     * @param param:initVector初始化参数
     */
    point(param, drawend, style, name) { // 画点或者Icon
        return this.draw(param, 'Point', drawend, style, name);
    },
    lineString(param, drawend) { // 画线段
        return this.draw(param, 'LineString', drawend);
    },
    dyString(param, drawend) { // 画线段带小圆
        return this.drawDyString(param, 'LineString', drawend);
    },
    circle(param, drawend, cancel, dblclick) { // 画圆
        this.cursor(param.map, true);
        return this.drawCircle(param, 'Circle', drawend, cancel, dblclick);
    },
    polygon(param, drawend) { // 画多边形
        return this.draw(param, 'Polygon', drawend);
    },
    box(param, drawend, cancel, dblclick) { // 画矩形
        this.cursor(param.map, true);
        return this.drawBox(param, 'LineString', drawend, dblclick);
    },
    freePolygon(param, drawend) { // 画自由矩形
        this.cursor(param.map, true);
        return this.drawHandFree(param, 'Polygon', drawend);
    },
    freeLine(param, drawend) { // 画自由线
        return this.drawHandFree(param, 'LineString', drawend);
    },
    arrow(param, drawend) { // 画空心箭头
        this.cursor(param.map, true);
        return this.drawArrow(param, 'LineString', drawend);
    },
    text(param, drawend) { // 添加文字
        return this.drawText(param, 'Point', drawend);
    },

    cursor(map, status = false) {
        let target = map.getTarget();
        let cursor = typeof target === 'string' ? $('#' + target) : $(target);
        if (status) {
            cursor.css("cursor", "crosshair");
        } else {
            cursor.css("cursor", "default");
        }
    },

    draw(param, type, drawend, style, name) {
        let geometryFunction;
        let draw = new ol.interaction.Draw({
            features: param.features,
            type: type,
            geometryFunction: geometryFunction,
            style: this.getStyle(style)
        });
        param.map.addInteraction(draw);
        if (!!drawend) {
            if (!!name == false) name = type;
            draw.on('drawend', function(evt) {
                drawend(name, evt.feature);
            });
        }
        return draw;
    },

    circlePoint(param, drawstart, drawend, cancel) {
        return this.drawCirclePoint(param, 'Circle', drawstart, drawend);
    },

    overlay(param) {
        let overlay = new ol.Overlay({
            projection: config.SYSTEM_PROJECTION,
            offset: param.offset,
            positioning: param.positioning,
            element: param.ele,
            stopEvent: false
        });
        if (param.id) {
            overlay.set('olId', param.id);
        }
        let tempPoint = config.transform([ parseFloat(param.lon), parseFloat(param.lat) ]);
        overlay.setPosition(tempPoint);
        return overlay;
    },

    drawCirclePoint(param, type, drawStart, drawEnd, cancel) {
        this.cursor(param.map, true);
        let draw = new ol.interaction.Draw({
            features: param.features,
            type: type,
            style: this.getStyle({
                fill: 'rgba(224, 76, 56, 0.2)',
                strokeColor: '#1A1A1A',
                fillOpacity: 0.2,
                strokeWidth: 1,
                cRadius: param.cRadius
            })
        });
        param.map.addInteraction(draw);
        if (drawEnd) {
            draw.on('drawend', (evt) => {
                drawEnd(type, evt.feature);
            });
        }
        if (drawStart) {
            draw.on('drawstart', (evt) => {
                drawStart(evt.feature);
            });
        }
        return draw;
    },

    // 画圆
    drawCircle(param, type, drawend, cancel = true, dblclick, drawstart) {
        let draw = new ol.interaction.Draw({
            freehand: true,
            features: param.features,
            type: type,
            style: this.getStyle({
                fill: 'rgba(224, 76, 56, 0.2)',
                strokeColor: '#1A1A1A',
                fillOpacity: 0.2,
                strokeWidth: 1,
                cRadius: param.cRadius
            })
        });
        param.map.addInteraction(draw);
        draw.set('draw', 'circle');
        let tip = this.initRadiusBox(param.map);
        let listener;
        draw.on('drawstart', (evt) => {
            if (param.putdown) {
                draw.finishDrawing();
                let center = evt.feature.getGeometry().getCenter();
                this.setRadius(evt.feature, param.radius);
            } else {
                param.map.on('pointerdrag', dragEvt);

                function dragEvt() {
                    param.map.un('pointerdrag', dragEvt);
                }
                param.map.on('pointerdrag', tipDragEvt);

                function tipDragEvt(evt) {
                    if ($.isEmptyObject(tip)) {
                        tip = that.initRadiusBox(param.map);
                    }
                    tip.tipDragEvt = tipDragEvt;
                    try {
                        tip.overlay.setPosition(evt.coordinate);
                    } catch (e) {
                        param.map.un('pointerdrag', tipDragEvt);
                    }
                }
            }
            let that = this;
            let feature = evt.feature;
            listener = feature.getGeometry().on('change', (evt) => {
                let geom = evt.target;
                if (!$.isEmptyObject(tip)) {
                    tip.ele.innerHTML = this.formatLength(geom.getRadius());
                }
            });
        });
        draw.on('drawend', (evt) => {
            drawend(type, evt.feature);
            ol.Observable.unByKey(listener);
            param.map.removeOverlay(tip.overlay);
            param.map.un('pointerdrag', tip.tipDragEvt);
            tip = {};
        });
        this.initTipBox(param);
        return draw;
    },

    initRadiusBox(map) {
        if (!$.isEmptyObject(this.radiusBox)) {
            map.removeOverlay(this.radiusBox.overlay);
            map.un('pointerdrag', this.radiusBox.tipDragEvt);
            this.radiusBox = {};
        }
        let ele = document.createElement('div');
        ele.className = 'tooltip';
        let tip = new ol.Overlay({
            element: ele,
            offset: [15, 15],
            positioning: 'bottom-left'
        });
        map.addOverlay(tip);
        let radiusBox = {
            ele: ele,
            overlay: tip
        };
        this.radiusBox = radiusBox;
        return radiusBox;
    },

    initCircleBox(map, feature, layer, drawend, type) {
        if (!$.isEmptyObject(this.radiusBox)) {
            map.removeOverlay(this.radiusBox.overlay);
            map.un('pointerdrag', this.radiusBox.tipDragEvt);
            this.radiusBox = {};
        }
        let ele = document.createElement('div');
        let center = map.getView().getCenter();
        let $box = $('<div class="cricle-box-panel"><div class="cricle-box-title">选择半径画圆</div><div class="cricle-box-radio"><ul><li><label><input type="radio" name="cricle-box-radius" value="100" id="cricle-box-radius-100"></input>100公里</label></li><li><label><input type="radio" name="cricle-box-radius" value="300" id="cricle-box-radius-300"></input>300公里</label></li><li><label><input type="radio" name="cricle-box-radius" value="500" id="cricle-box-radius-500"></input>500公里</label></li></ul><div class="div_btn"><a href="javascript: void(0);" class="cricle-box-cancel" id="cricle-box-cancel">取消</a><a href="javascript: void(0);" class="cricle-box-confirm" id="cricle-box-confirm">确认</a></div></div></div>');
        ele.appendChild($box[0]);
        let tip = new ol.Overlay({
            element: ele,
            offset: [0, 0],
            positioning: 'center-center'
        });
        let that = this;
        $box.find('#cricle-box-cancel').unbind().click(function() {
            that.clearFeature(layer, feature);
            map.removeOverlay(tip);
            drawend(type, feature);
        });
        $box.find('#cricle-box-confirm').unbind().click(function() {
            let radius = $('input[id^=cricle-box-radius]:checked').val();
            if (radius) {
                that.setRadius(feature, parseFloat(radius) * 1000);
                map.removeOverlay(tip);
                drawend(type, feature);
            }
        });
        tip.setPosition(center);
        feature.set('overlay', tip);
        map.addOverlay(tip);
    },

    initTipBox(param) {
        let map = param.map;
        if (this.tipBox) {
            map.removeOverlay(this.tipBox.overlay);
            map.un('pointermove', pointerMoveEvt);
            this.tipBox = {};
        }
        let ele = document.createElement('div');
        ele.className = 'tooltip hidden';
        let tip = new ol.Overlay({
            element: ele,
            offset: [15, 0],
            positioning: 'center-left'
        });
        map.addOverlay(tip);
        let tipBox = {
            ele: ele,
            overlay: tip,
            pointerMoveEvt: pointerMoveEvt
        };
        this.tipBox = tipBox;
        map.on('pointermove', pointerMoveEvt);

        function pointerMoveEvt(evt) {
            if (evt.dragging) return;
            let text = param.tipText;
            text = text ? text : '鼠标按住拖拽，松开鼠标结束标绘';
            tipBox.ele.classList.remove('hidden');
            tipBox.ele.innerHTML = text;
            try {
                tipBox.overlay.setPosition(evt.coordinate);
            } catch (e) {
                param.map.un('pointermove', pointerMoveEvt);
            }
        }
    },

    formatLength(radius) {
        let length = Math.round(radius * ol.proj.METERS_PER_UNIT[config.getUnit()] * 100) / 100;
        let output;
        if (length > 100) output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
        else output = (Math.round(length * 100) / 100) + ' ' + 'm';
        return output;
    },

    drawBox(param, type, drawend, dblclick) {
        let draw = new ol.interaction.Draw({
            features: param.features,
            type: type,
            style: this.getStyle({
                fill: 'rgba(224, 76, 56, 0.2)',
                strokeColor: '#1A1A1A',
                fillOpacity: 0.2,
                strokeWidth: 1
            }),
            geometryFunction: ol.interaction.Draw.createBox(),
            freehand: true,
        });
        param.map.addInteraction(draw);
        if (!!drawend) {
            draw.on('drawend', (evt) => {
                drawend('box', evt.feature);
            });
        }
        this.initTipBox(param);
        return draw;
    },
    drawHandFree(param, type, drawend) {
        let draw = new ol.interaction.Draw({
            freehand: true,
            freehandCondition: ol.events.condition.always,
            features: param.features,
            type: type,
            style: this.getStyle({
                fill: 'rgba(224, 76, 56, 0.2)',
                strokeColor: '#1A1A1A',
                fillOpacity: 0.2,
                strokeWidth: 1
            }),
        });
        param.map.addInteraction(draw);
        if (!!drawend) {
            draw.on('drawend', (evt) => {
                drawend('free' + type, evt.feature);
            });
        }
        this.initTipBox(param);
        return draw;
    },
    drawArrow(param, type, drawend) {
        let map = param.map;
        let draw = new ol.interaction.Draw({
            features: param.features,
            type: type,
            geometryFunction: (coordinates, geometry) => {
                if (!geometry) geometry = new ol.geom.Polygon(null);

                let [start, end] = coordinates;
                let [tStart, tEnd] = coordinates;

                if (config.is84()) {
                    tStart = config.transform_meter(start);
                    tEnd = config.transform_meter(end);
                }

                let dist = getDist(map);
                let middle1 = pm(tStart, tEnd, 4);
                let k = -1 / ((tEnd[1] - tStart[1]) / (tEnd[0] - tStart[0]));
                let b1 = middle1[1] - k * middle1[0];
                let outPoints = solution(middle1, k, b1, dist);
                let middle2 = pm(tStart, tEnd, 5);
                let b2 = middle2[1] - k * middle2[0];
                let inPoints = solution(middle2, k, b2, dist / 2.5);

                if (config.is84()) {
                    outPoints[0] = config.transform_meter(outPoints[0], false);
                    outPoints[1] = config.transform_meter(outPoints[1], false);
                    inPoints[0] = config.transform_meter(inPoints[0], false);
                    inPoints[1] = config.transform_meter(inPoints[1], false);
                }

                geometry.setCoordinates([
                    [start, inPoints[0], outPoints[0], end, outPoints[1], inPoints[1], start]
                ]);
                return geometry;
            },
            maxPoints: 2
        });
        map.addInteraction(draw);
        if (!!drawend) {
            draw.on('drawend', function(evt) {
                drawend('arrow', evt.feature);
            });
        }

        // 获取一直线上的中间一点
        let pm = (start, end, p) => {
            let atwill = [];
            let x = (start[0] + p * end[0]) / (1 + p);
            let y = (start[1] + p * end[1]) / (1 + p);
            atwill[0] = x;
            atwill[1] = y;
            return atwill;
        }

        // 求二次方程解
        let solution = (point, k, lb, dist) => {
            let _A = point[0];
            let _B = point[1];
            let a = 1 + Math.pow(k, 2);
            let b = -1 * (2 * _A - 2 * k * lb + 2 * _B * k);
            let c = Math.pow(lb, 2) + Math.pow(_B, 2) + Math.pow(_A, 2) - 2 * _B * lb - Math.pow(dist, 2);
            let dt = Math.sqrt(Math.pow(b, 2) - 4 * a * c);
            let x0 = (-b + dt) / (2 * a);
            let x1 = (-b - dt) / (2 * a);
            let y0 = k * x0 + lb;
            let y1 = k * x1 + lb;
            let _obj1 = [x0, y0];
            let _obj2 = [x1, y1];
            let result = [_obj1, _obj2];
            return result;
        }

        // 按地图缩放层级设置距离值大小
        let getDist = (map) => {
            let zoom = map.getView().getZoom(); // min 5
            let item = 10000;
            let total = 50000;
            if (zoom >= 10 && zoom < 14) {
                total = 10000;
                item = 1300;
            } else if (zoom >= 14) {
                total = 1000;
                item = 80;
            }
            return total - (zoom - 5) * item;
        }
        return draw;
    },
    drawDyString(param, type, drawend, style) {
        let draw = new ol.interaction.Draw({
            features: param.features,
            type: type,
            style: this.getStyle(style)
        });
        param.map.addInteraction(draw);
        if (!!drawend) {
            draw.on('drawend', function(evt) {
                drawend('dyString', evt.feature);
            });
        }
        return draw;
    },
    drawText(param, type, drawend, style) {
        let draw = new ol.interaction.Draw({
            features: param.features,
            type: type,
            style: this.getStyle(style)
        });
        param.map.addInteraction(draw);
        if (!!drawend) {
            draw.on('drawend', function(evt) {
                drawend('text', evt.feature);
            });
        }
        return draw;
    },
    initVector(map) {
        return this.initDrawParam(map);
    },
    initDrawParam(map, index) {
        let features = new ol.Collection();
        let layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: features
            }),
            style: this.dynamicStyle
        });
        layer.setZIndex(config.getIndex(index));
        map.addLayer(layer);
        return {
            map: map,
            features: features,
            layer: layer,
        };
    },
    // 设置画笔样式
    setPenStyle(handler, param) {
        let anchor = [0.5, 0.5];
        let src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR42mP8DwABAwEBnHxMcgAAAABJRU5ErkJggg==';
        let iconSize = [0, 0];
        if (!!param.anchor) anchor = param.anchor;
        if (!!param.iconUrl) src = param.iconUrl;
        if (!!param.iconSize) iconSize = param.iconSize;
        let style = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: anchor,
                src: src,
                imgSize: iconSize
            })
        });
        handler.style = style;
    },
    getFeatures(layer) {
        return layer.getSource().getFeatures();
    },
    clearFeature(drawLayer, feature) {
        drawLayer.getSource().removeFeature(feature);
    },
    cancel(map, draw) {
        if (!$.isEmptyObject(this.tipBox)) {
            map.removeOverlay(this.tipBox.overlay);
            map.un('pointermove', this.tipBox.pointerMoveEvt);
            this.tipBox = {};
        }
        if (!$.isEmptyObject(this.radiusBox)) {
            map.removeOverlay(this.radiusBox.overlay);
            map.un('pointerdrag', this.radiusBox.tipDragEvt);
            this.radiusBox = {};
        }
        this.cursor(map, false);
        map.removeInteraction(draw);
    },
    // 添加修改图形
    modify(param, callBack) {
        let modify = new ol.interaction.Modify({
            features: param.features,
            deleteCondition(event) {
                return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
            }
        });
        if (!!callBack) {
            modify.on('modifyend', function(evt) {
                let features = evt.features.getArray();
                let modifiedFeatures = [];
                for (let i = 0; i < features.length; i++) {
                    let rev = features[i].getRevision();
                    if (rev > 1) {
                        modifiedFeatures.push(features[i]);
                    }
                }
                callBack(modifiedFeatures);
            });
        }
        param.map.addInteraction(modify);
        return modify;
    },
    // 获取layer图层中指定名称的feature对象
    clearFeaturesByName(layer, name) {
        let source = layer.getSource();
        let features = source.getFeatures();
        let arr = [];
        for (let key in features) {
            if (features[key].get('name') == name) {
                source.removeFeature(features[key]);
            }
        }
    },
    // 撤消上一次画图
    undo(drawLayer, callBack, map) {
        let source = drawLayer.getSource();
        let features = source.getFeatures();
        let l = features.length;
        if (l > 0) {
            let tempFea = features[l - 1];
            if (tempFea.get('overlay')) {
                map.removeOverlay(tempFea.get('overlay'));
            }
            if (!!callBack) callBack(tempFea.get('name'));
            source.removeFeature(tempFea);
        }
        return features;
    },
    // 清除所有
    clear(drawLayer, map) {
        if (!!map) {
            let source = drawLayer.getSource();
            let features = source.getFeatures();
            let l = features.length;
            features.forEach((feature) => {
                map.removeOverlay(feature.get('overlay'));
            });
        }
        drawLayer.getSource().clear();
    },
    // 设置圆的半径
    setRadius(feature, radius) {
        feature.getGeometry().setRadius(radius);
    },
    // 设置feature样式
    setFeatureStyle(feature, param) {
        let fontColor = '#999',
            outColor = '#fff',
            outWidth = 0,
            fontSize = '12px',
            text = '';
        let offsetY = 0,
            offsetX = 0;
        if (!!param) {
            if (!!param.fontColor) fontColor = param.fontColor; // 文字颜色
            if (!!param.outColor) outColor = param.outColor; // 描边颜色
            if (!!param.outWidth) outWidth = param.outWidth; // 描边宽度
            if (!!param.fontSize) fontSize = param.fontSize; // 文字大小
            if (!!param.text) text = param.text; // 文本内容
            if (!!param.offsetY) offsetY = param.offsetY; // 文本Y轴偏移
            if (!!param.offsetX) offsetX = param.offsetX; // 文本X轴偏移
        }
        let style = new ol.style.Style({
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
            })
        });
        feature.setStyle(style)
    },
    // 设定不同的主题颜色
    getStyle(param) {
        let src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR42mP8DwABAwEBnHxMcgAAAABJRU5ErkJggg==',
            strokeColor = '#1A1A1A',
            strokeWidth = 1,
            fontColor = '#999',
            fontSize = '12px',
            fillColor = 'rgba(224, 76, 56, 0.2)',
            outColor = '#fff',
            outWidth = 0,
            anchor = [0.5, 0.5],
            iconSize = [0, 0],
            scale = 1,
            text = '',
            offsetY = 0,
            offsetX = 0,
            radius = 5.5,
            srcState = true;
        if (!!param) {
            if (!!param.fill && !!param.fillOpacity) fillColor = draw.colorRgb(param.fill, param.fillOpacity);
            if (!!param.strokeColor) strokeColor = param.strokeColor;
            if (!!param.strokeWidth) strokeWidth = param.strokeWidth;
            if (!!param.anchor) anchor = param.anchor;
            if (!!param.iconSize) iconSize = param.iconSize;
            if (!!param.scale) scale = param.scale;
            if (!!param.fontColor) fontColor = param.fontColor; // 文字颜色
            if (!!param.outColor) outColor = param.outColor; // 描边颜色
            if (!!param.outWidth) outWidth = param.outWidth; // 描边宽度
            if (!!param.fontSize) fontSize = param.fontSize; // 文字大小
            if (!!param.text) text = param.text; // 文本内容
            if (!!param.offsetY) offsetY = param.offsetY; // 文本Y轴偏移
            if (!!param.offsetX) offsetX = param.offsetX; // 文本X轴偏移
            if (!!param.cRadius) radius = param.cRadius;
            if (!!param.iconUrl) {
                if (src !== param.iconUrl) {
                    srcState = !srcState;
                }
                src = param.iconUrl;
            }
        }
        let style = {
            fill: {
                color: fillColor
            },
            stroke: {
                color: strokeColor,
                width: strokeWidth
            },
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
            image: srcState ? new ol.style.Circle({
                radius: radius,
                fill: new ol.style.Fill({
                    color: 'rgba(224, 76, 56, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#1A1A1A',
                    width: 1
                })
            }) : new ol.style.Icon({
                anchor: anchor,
                src: src,
                size: iconSize,
                scale: scale,
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                anchorOrigin: 'bottom-left'
            })
        };
        let Style = new ol.style.Style({
            fill: new ol.style.Fill(style.fill),
            stroke: new ol.style.Stroke(style.stroke),
            image: style.image,
            text: style.text
        });
        return Style;
    },
    // 动态style
    dynamicStyle(feature, type = '') {
        let style = null;
        if (type == '' || typeof(type) == 'number') {
            style = feature.get('style');
            style = draw.getStyle(style);
        } else {
            style = draw.getStyle(feature);
        }
        let styles = [];
        let lineCircle = new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({
                    color: 'rgba(224, 76, 56, 0.4)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#1A1A1A',
                    width: 1
                })
            }),
            geometry(feature) {
                if (feature.get('name') == 'dyString') {
                    let coordinates = feature.getGeometry().getCoordinates();
                    return new ol.geom.MultiPoint(coordinates);
                }
            }
        });
        styles.push(lineCircle);
        styles.push(style);
        return styles;
    },
    // 获取feature wkt
    getWkt(feature) {
        let temp = feature.clone();
        let WKT = new ol.format.WKT();
        let simple = WKT.writeGeometry(temp.getGeometry().transform(config.SYSTEM_PROJECTION, config.SOURCE_PROJECTION));
        return simple;
    },
    // 获取圆心坐标以及半径长度
    getCircle(feature) {
        let tempGeom = feature.getGeometry();
        let center = tempGeom.getCenter();
        let rad = tempGeom.getRadius();
        center = config.transform(center, true);
        return {
            center: center,
            radius: rad,
        };
    },
    // 为画笔的回调返回的feature
    getHandWkt(feature) {
        let temp = feature.clone();
        let geometry = temp.getGeometry().transform(config.SYSTEM_PROJECTION, config.SOURCE_PROJECTION)
        let coordinates = geometry.getCoordinates()[0];
        let polygon = 'POLYGON((';
        coordinates.forEach((it) => {
            polygon += it[0] + ' ' + it[1] + ',';
        })
        polygon = polygon.substring(0, polygon.length - 1) + '))';
        return polygon;
    },
    // 将圆点与半径转化成polygon
    getCircleWkt(circle) {
        let center = config.transform(circle.center);
        let geom = new ol.geom.Circle(center, circle.radius);
        let polygon = ol.geom.Polygon.fromCircle(geom, 32);
        let geoWkt = new ol.format.WKT();
        let simple = geoWkt.writeGeometry(polygon.transform(config.SYSTEM_PROJECTION, config.SOURCE_PROJECTION));
        return simple;
    },
    // 颜色值转rgb
    colorRgb(color, opacity) {
        let sColor = color.toLowerCase();
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                let sColorNew = "#";
                for (let i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            // 处理六位的颜色值  
            let sColorChange = [];
            for (let i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return "rgba(" + sColorChange.join(",") + "," + opacity + ")";
        } else {
            return sColor;
        }
    }
};

module.exports = draw;