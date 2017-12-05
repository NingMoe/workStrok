import geom from '../polygon/draw/geom';
import image from '../image/image';
import config from '../../../config';
import lmap_config from '../config';


/**
 * 台风功能模块
 */
var typhoon = {
    /**
     * 使台风路径动态显示
     */
    run: function(map, params, tsName, tsId, callBack, setTime) {
        let points = []; // 实况点
        let lines = []; // 实况路径
        let logos = []; // 风圈logo
        let circles = []; // 风圈
        let length = params.length;
        let topTcPoint; // 最新实况点数据
        for (let i = 0; i < length; i++) {
            let startPoint = params[i];
            startPoint.tsName = tsName;
            logos.push(this.createFC(startPoint));
            if (i == 0) {
                circles = this.createCircle(startPoint); // 记录第一个风圈
                topTcPoint = startPoint;
            }
            if (i != length - 1) {
                points.push(this.createPoint(startPoint));
                let endPoint = params[i + 1];
                lines.push(this.createLine(startPoint, endPoint));
            } else {
                points.push(this.createPoint(startPoint, tsName));
            }
        }
        let typhoon_layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: []
            })
        });

        typhoon_layer.setZIndex(3);
        map.addLayer(typhoon_layer);
        let source = typhoon_layer.getSource();
        let pointsLength = points.length - 1;
        let logoRe = null;
        let status = config.getParam('typhoonStatus');
        // 台风动态渲染
        if (!!setTime) {
            asycCount(pointsLength);

            function asycCount(index) {
                if (status) {
                    setTimeout(() => {
                        if (index >= 0) {
                            source.addFeature(points[index]);
                            if (!!logoRe) source.removeFeature(logoRe); // draw logo
                            logoRe = logos[index];
                            source.addFeature(logos[index]);
                            if (index > 0) {
                                source.addFeature(lines[index - 1]);
                            }
                            asycCount(--index);
                        } else {
                            if (!!callBack) {
                                callBack(topTcPoint); // 完成回调刷新台风预报图层
                            }
                        }
                    }, setTime);
                }
            }
        } else {
            // 一次性渲染台风，setTimeout为了先将layer返回
            setTimeout(() => {
                for (let i = pointsLength; i >= -1; i--) {
                    if (i >= 0) {
                        source.addFeature(points[i]);
                        if (i > 0) {
                            source.addFeature(lines[i - 1]);
                        }
                    } else {
                        logoRe = logos[i + 1];
                        source.addFeature(logos[i + 1]);
                        if (!!callBack && status) {
                            callBack(topTcPoint, 'run'); // 完成回调刷新台风预报图层
                        }
                    }
                }
            }, 10)
        }
        // source.addFeatures(lines);
        return typhoon_layer;
    },
    createPoint: function(startPoint, tsName) {
        let feature = geom.drawGeom('point', [parseFloat(startPoint.lon), parseFloat(startPoint.lat)]);
        feature.setStyle(this.getPointOrLineStyle(startPoint.trank, tsName));
        feature.type = 'tcPoint';
        feature.obs = startPoint;
        return feature;
    },
    createLine: function(startPoint, endPoint) {
        let feature = geom.drawGeom('lineString', [
            [parseFloat(startPoint.lon), parseFloat(startPoint.lat)],
            [parseFloat(endPoint.lon), parseFloat(endPoint.lat)]
        ]);
        feature.setStyle(this.getPointOrLineStyle(startPoint.trank));
        return feature;
    },
    createCircle: function(startPoint) {
        let rrArr = {
            rr06: startPoint.rr06,
            rr07: startPoint.rr07,
            rr08: startPoint.rr08,
            rr010: startPoint.rr010,
            rr012: startPoint.rr012
        };
        let circles = [];
        let wgs84Sphere = new ol.Sphere(6378137);
        for (let key in rrArr) {
            let rr = rrArr[key];
            if (rr != '') {
                let radius = rr * 1000;
                let circle4326 = ol.geom.Polygon.circular(wgs84Sphere, [startPoint.lon, startPoint.lat], radius, 64);
                let circle3857 = circle4326.clone().transform(lmap.SOURCE_PROJECTION, lmap.SYSTEM_PROJECTION);
                let circleFeature = new ol.Feature(circle3857);
                let style = this.getCircleStyle(key);
                circleFeature.setStyle(style);
                circleFeature.type = 'tcCircle';
                circles.push(circleFeature);
            }
        }
        return circles;
    },
    createFC: function(startPoint) {
        let iconFeature = geom.drawGeom('point', [parseFloat(startPoint.lon), parseFloat(startPoint.lat)]);
        sz(0);

        function sz(index) {
            let call = setTimeout(function() {
                iconFeature.setStyle(new ol.style.Style({
                    image: new ol.style.Icon(({
                        anchor: [31, 31],
                        rotation: 7.5 * index,
                        anchorXUnits: 'pixels',
                        anchorYUnits: 'pixels',
                        src: 'http://10.148.16.56/topic/little/typhoon/typhoon.png',
                        imgSize: [62, 62]
                    }))
                }));
                index++;
                if (7.5 * index > 360) index = -1;
                sz(index);
            }, 150);
            iconFeature.set('call', call);
        }
        return iconFeature;
    },
    removeFC: function() {

    },
    getPointOrLineStyle: function(type, tsName) {
        let params = {
            type: type,
            radius: 4,
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWidth: '1',
            tsName: tsName
        };
        return this.getStyle(params);
    },
    getCircleStyle: function(type) {
        let color = {
            'rr06': 'rgba(0, 228, 0, opacity)',
            'rr07': 'rgba(6, 95, 184, opacity)',
            'rr08': 'rgba(255, 255, 0, opacity)',
            'rr010': 'rgba(255, 126, 0, opacity)',
            'rr012': 'rgba(255, 0, 0, opacity)'
        };
        let tcolor = color[type];
        let fcolor = tcolor.replace('opacity', 0.1);
        let scolor = tcolor.replace('opacity', 1);
        let style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: scolor,
                width: 3
            }),
            fill: new ol.style.Fill({
                color: fcolor
            }),
        });
        return style;
    },
    getStyle: function(params) {
        let tsName = '';
        if (!!params.tsName) tsName = '<--' + params.tsName;
        let opacity = params.fillOpacity;
        let color = {
            'TD': 'rgba(0, 228, 0, opacity)',
            'TS': 'rgba(6, 95, 184, opacity)',
            'STS': 'rgba(255 ,255 ,0 ,opacity)',
            'TY': 'rgba(255,1 26,0 ,o pacity)',
            'STY': 'rgba(255, 0, 0, opacity)',
            'SUPER TY': 'rgba(117, 0, 33, opacity)'
        };
        let tcolor = color[params.type];
        tcolor = tcolor.replace('opacity', opacity);
        let stroke = new ol.style.Stroke({
            color: tcolor,
            width: 3
        });
        let style = new ol.style.Style({
            stroke: stroke,
            image: new ol.style.Circle({
                radius: params.radius,
                fill: new ol.style.Fill({
                    color: tcolor
                }),
                stroke: new ol.style.Stroke({
                    color: params.strokeColor,
                    width: params.strokeWidth
                })
            }),
            text: new ol.style.Text({
                font: '16px 黑体',
                text: tsName,
                fill: new ol.style.Fill({
                    color: '#000'
                }),
                stroke: new ol.style.Stroke({
                    color: '#fff',
                    width: 3
                }),
                offsetX: 50
            })
        });
        return style;
    }
};
module.exports = typhoon;