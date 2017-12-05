<template>
    <div></div>
</template>

<script>

    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import { updateParam } from '../../vuex/store'

    export default {
        data() {
            return {
                layer: null,
                helpTooltip: null,
                helpEle: null,
                measureTooltip: [],
                measureEle: [],
                sketch: null,
                helpMsg: '双击结束',
                hander: null,
                map: config.getParam('map')
            }
        },
        vuex: {
            getters: { draw: state => state.distance.draw },
            actions: { updateParam }
        },
        methods: {
            // 撤消上一次画图
            undo: function() {
                let source = this.layer.getSource();
                let features = source.getFeatures();
                let l = features.length;
                if (l > 0) source.removeFeature(features[l - 1]);
            },
            // 清除所有
            clear: function() {
                this.layer.getSource().clear();
            },
            // 提示标签
            initHelpTip: function() {
                let helpEle = document.createElement('div');
                helpEle.className = 'tooltip hidden';
                this.helpEle = helpEle;
                this.helpTooltip = new ol.Overlay({
                    element: helpEle,
                    offset: [15, 0],
                    positioning: 'center-left'
                });
                this.map.addOverlay(this.helpTooltip);
            },
            // 内容标签
            initMeasureTip: function() {
                let measureEle = document.createElement('div');
                measureEle.className = 'tooltip tooltip-measure';
                this.measureEle.push(measureEle);
                let measureTooltip = new ol.Overlay({
                    element: measureEle,
                    offset: [0, -15],
                    positioning: 'bottom-center'
                });
                this.measureTooltip.push(measureTooltip);
                this.map.addOverlay(measureTooltip);
                let obj = {
                    ele: measureEle,
                    tip: measureTooltip,
                };
                return obj;
            },
            // 初始化图层
            initLayer: function() {
                let source = new ol.source.Vector();
                this.layer = new ol.layer.Vector({
                    source: source,
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#FD8044',
                            width: 4
                        }),
                        image: new ol.style.Circle({
                            radius: 7,
                            fill: new ol.style.Fill({
                                color: '#ffcc33'
                            })
                        })
                    })
                });
                this.layer.setZIndex(4);
                this.map.addLayer(this.layer);
            },
            moveHandler: function(evt) {
                if (evt.dragging) return;
                let helpMsg = '点击确定起点';
                let sketch = this.sketch;
                if (sketch) helpMsg = this.helpMsg;
                this.helpEle.innerHTML = helpMsg;
                this.helpTooltip.setPosition(evt.coordinate);
                this.helpEle.classList.remove('hidden');
            },
            // 长度格式化
            formatLength: function(line) {
                let length = 0;
                if (lmap.is84) {
                    let wgs84Sphere = new ol.Sphere(6378137);
                    let coordinates = line.getCoordinates();
                    for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
                        let c1 = coordinates[i];
                        let c2 = coordinates[i + 1];
                        length += wgs84Sphere.haversineDistance(c1, c2);
                    }
                } else {
                    length = Math.round(line.getLength() * 100) / 100;
                }
                let output;
                if (length > 100) output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
                else output = (Math.round(length * 100) / 100) + ' ' + 'm';
                return output;
            },
            // 初始化画笔
            initDraw: function() {
                let source = this.layer.getSource();
                let hander = new ol.interaction.Draw({
                    source: source,
                    type: 'LineString',
                    style: new ol.style.Style({
                        fill: new ol.style.Fill({
                            color: 'rgba(255, 255, 255, 0.2)'
                        }),
                        stroke: new ol.style.Stroke({
                            color: 'rgba(0, 0, 0, 0.5)',
                            lineDash: [10, 10],
                            width: 2
                        }),
                        image: new ol.style.Circle({
                            radius: 5,
                            stroke: new ol.style.Stroke({
                                color: 'rgba(0, 0, 0, 0.7)'
                            }),
                            fill: new ol.style.Fill({
                                color: 'rgba(255, 255, 255, 0.2)'
                            })
                        })
                    })
                });
                this.map.addInteraction(hander);
                this.hander = hander;

                let listener;
                let _ele = this;
                let measureEle = _ele.measureEle[0];
                let measureTooltip = _ele.measureTooltip[0];
                hander.on('drawstart', function(evt) {
                    let sketch = evt.feature;
                    _ele.sketch = sketch;
                    let tooltipCoord = evt.coordinate;
                    listener = sketch.getGeometry().on('change', function(evt) {
                        let geom = evt.target;
                        let output = _ele.formatLength(geom);
                        tooltipCoord = geom.getLastCoordinate();
                        measureEle.innerHTML = output;
                        measureTooltip.setPosition(tooltipCoord);
                    });
                }, this);

                hander.on('drawend', function() {
                    measureEle.className = 'tooltip tooltip-static';
                    measureTooltip.setOffset([0, -7]);
                    _ele.sketch = null;
                    let measure = _ele.initMeasureTip(this.map);
                    measureEle = measure.ele;
                    measureTooltip = measure.tip;
                    ol.Observable.unByKey(listener);
                }, this);
            }
        },
        compiled: function() {

            this.initHelpTip(this.map);
            this.initMeasureTip(this.map);
            this.initLayer();
            this.map.on('pointermove', this.moveHandler);
            this.map.getViewport().addEventListener('mouseout', () => {
                this.helpEle.classList.add('hidden');
            });

            this.initDraw(this.map, this.layer);
        },
        detached: function() {  
            this.map.removeInteraction(this.hander);
            this.map.removeLayer(this.layer);
            let tips = this.measureTooltip;
            tips.forEach((it) => {
                this.map.removeOverlay(it);
            });
            this.measureTooltip = [];
            this.measureEle = [];
            this.map.removeOverlay(this.helpTooltip);
            this.map.un('pointermove', this.moveHandler);
        }
    }
</script>

<style lang='less' scoped>
.tooltip {
    position: relative;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    padding: 4px 8px;
    opacity: 0.7;
    white-space: nowrap;
}
.tooltip-measure {
    opacity: 1;
}
.tooltip-static {
    background-color: #ffcc33;
    color: black;
    border: 1px solid white;
}
.tooltip-measure:before, .tooltip-static:before {
    border-top: 6px solid rgba(0, 0, 0, 0.5);
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    content: "";
    position: absolute;
    bottom: -6px;
    margin-left: -7px;
    left: 50%;
}
.tooltip-static:before {
    border-top-color: #ffcc33;
}
</style>