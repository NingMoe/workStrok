<template>
    <div v-el:legend-box class="legend">
        <ul>
            <li v-for="item in legend[model]['legend']" class="{{legend[model]['className']}}">
                <input class="checkbox" type="checkbox" id="{{item.id}}" value="{{item.level}}" v-model="level" @click="selectInput(item.level)">
                <label for="{{item.id}}">{{item.name}}</label>
                <span class="legend_logo" :style="{ background: item.color }"></span>
            </li>
        </ul>
    </div>
</template>

<script>

    import { updateParam } from '../../../vuex/store'
    import ModelTime from '../../common/model'
    import config from '../../../config'
    import lmap from '../../../util/lmap/lmap'
    import TimeUtil from '../../../util/tools/TimeUtil'

    export default {
        props: ['model'],
        data() {
            return {
                legend: {
                    heavyRainfall: {
                        name: '强降水',
                        className: 'heavyRainfall',
                        legend: [
                            {'level': '25', 'name': '0-25', 'color': 'rgba(30,180,30,192)',"id":"heavyRainfall_1"},
                            {'level': '50', 'name': '25-50', 'color': 'rgba(255,50,0,192)',"id":"heavyRainfall_2"},
                            {'level': '100', 'name': '50-100', 'color': 'rgba(165,0,10,192)',"id":"heavyRainfall_3"},
                            {'level': '250', 'name': '100-250', 'color': 'rgba(165,0,10,192)',"id":"heavyRainfall_4"}
                        ],
                        level: ['25', '50', '100', '250']
                    },
                    gale: {
                        name: '大风',
                        className: 'gale',
                        legend: [
                            {'level': '6', 'name': '6', 'color': 'rgba(116,242,143,192)',"id":"gale_1"},
                            {'level': '8', 'name': '8', 'color': 'rgba(61,186,61,192)',"id":"gale_2"},
                            {'level': '10', 'name': '10', 'color': 'rgba(97,184,255,192)',"id":"gale_3"},
                            {'level': '12', 'name': '12', 'color': 'rgba(0,0,225,192)',"id":"gale_4"}
                        ],
                        level: ['6', '8', '10', '12']
                    },
                    temp: {
                        name: '温度',
                        className: 'temp',
                        legend: [
                            {'level': '25', 'name': '0-25', 'color': 'rgba(30,180,30,192)',"id":"temp_1"},
                            {'level': '29', 'name': '25-29', 'color': 'rgba(254,170,0,192)',"id":"temp_2"},
                            {'level': '33', 'name': '29-33', 'color': 'rgba(233,54,1,192)',"id":"temp_3"},
                            {'level': '34', 'name': '34', 'color': 'rgba(223,46,2,192)',"id":"temp_4"},
                            {'level': '35', 'name': '35', 'color': 'rgba(223,46,2,192)',"id":"temp_5"},
                            {'level': '36', 'name': '36', 'color': 'rgba(223,46,2,192)',"id":"temp_6"},
                            {'level': '100', 'name': '>36', 'color': 'rgba(202,30,2,192)',"id":"temp_7"},
                        ],
                        level: ['25', '29', '33', '34', '35', '36', '100']
                    },
                },
                geoObj: {},
                level: [],
                tLevel: [],
                map: config.getParam('map')
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dateTime: state => state.dropzone.dateTime,
                pType: state => state.dropzone.pType,
                cType: state => state.dropzone.cType,
                code: state => state.cityCode,
                opacity: state => state.opacity.value,
                mlayer: state => state.model.layer
            },
            actions: { updateParam }
        },
        watch: {
            level: function(levelArr) {
                let levelStr = levelArr.join(',');
                let tempLevelArr = [];
                if (!levelStr) {
                    let mainLegend = this.legend[this.model].level;
                    tempLevelArr = mainLegend.slice(0);
                    this.updateParam('dropzone', 'levels', []);
                } else {
                    tempLevelArr = levelArr.slice(0);
                    this.updateParam('dropzone', 'levels', tempLevelArr);
                }
                let geoArr = [];
                tempLevelArr = this.sortLevel(tempLevelArr);
                tempLevelArr.forEach((data) => {
                    geoArr.push(this.geoObj[data]);
                });
                this.setGeo(geoArr);
            },
            cType: function(type){
                if (type) this.getLegend();
            },
            dateTime: function(){
                this.getLegend();
                if (this.tLevel[0]) {
                    let geoArr = [];
                    let tempLevelArr = this.sortLevel(this.tLevel);
                    tempLevelArr.forEach((data) => {
                        geoArr.push(this.geoObj[data]);
                    });
                    this.setGeo(geoArr);
                }
            }
        },
        methods: {

            sortLevel: function(arr) {
                let tempArr = [];
                arr.sort((a, b) => { return a - b });
                return arr;
            },

            initModel: function() {
                if (this.initTimer) window.clearTimeout(this.initTimer);
                this.initTimer = window.setTimeout(() => {
                    this.map.removeLayer(this.mlayer);
                    this.updateParam('model', 'layer', null);
                    let reqData = this.getReqParam();
                    let type = this.cType.split('_');
                    let url = 'http://10.148.16.56/server/data/disaster/' + type[0];
                    $.ajax({
                        url: url,
                        type: 'get',
                        data: { prediction: reqData.prediction, level: reqData.level, time: reqData.time },
                        dataType: 'json',
                        success: (json) => {
                            let obj = json.data;
                            let modelDatas = {
                                townCount: { name: '行政镇', num: 0 },
                                pop: { name: '人口', num: 0.0 },
                                area: { name: '面积', num: 0.0 },
                                gdp: { name: 'GDP', num: 0.0 }
                            };
                            let poiData = {};
                            if (obj !== null) {
                                let regionInfo = obj.regionInfo;
                                let counted = obj.counted;
                                let countedObj = this.countedData(counted);
                                poiData = countedObj.poi;
                                modelDatas.townCount.num = countedObj.town.count;
                                modelDatas.pop.num = regionInfo.population.toFixed(2);
                                modelDatas.area.num = regionInfo.acreage.toFixed(2);
                                modelDatas.gdp.num = Number(regionInfo.gdp / 100000000.0).toFixed(2);
                                this.updateParam('dropzone', 'rowKey', obj.rowkey);
                            }
                            this.updateParam('dropzone', 'minDatas', poiData);
                            this.$parent.count.datas = modelDatas;
                        }
                    });
                }, 10);
            },

            countedData: function(data) {
                let countedObj = {};
                data.forEach((obj) => {
                    if (obj.type === 'region' && obj.name === 'region') {
                        countedObj['town'] = { count: obj.count, rowkey: obj.rowkey };
                    } else if (obj.type === 'poi') {
                        if ($.isEmptyObject(countedObj['poi'])) {
                            countedObj['poi'] = {};
                        }
                        countedObj['poi'][obj.name] = { count: obj.count, rowkey: obj.rowkey };
                    }
                });
                return countedObj;
            },

            selectInput: function(level) {
                let levelArr = this.legend[this.model].level;
                let index = levelArr.indexOf(level);
                let hasLevel = this.tLevel.indexOf(level) !== -1 ? true : false;
                let tempLevelArr = [];
                if (!hasLevel) {
                    for (index; index < levelArr.length; index++) {
                        tempLevelArr.push(levelArr[index]);
                    }
                    this.tLevel.forEach((data) => {
                        if (tempLevelArr.indexOf(data) === -1) {
                            tempLevelArr.push(data);
                        }
                    });
                } else {
                    index = this.tLevel.indexOf(level);
                    this.tLevel.splice(index, 1);
                    tempLevelArr = this.tLevel;
                }
                this.tLevel = tempLevelArr;
                this.level = tempLevelArr;
            },

            setGeo: function(geoArr) {
                // this.clearGeo();
                lmap.draw.clear(this.layer);
                let geoIds = '';
                geoArr.forEach((data) => {
                    if (data === undefined) {
                        return;
                    } else {
                        let color = 'rgba(' + data.color + ')';
                        let style = { fill: color, fillOpacity: 1, strokeColor: 'rgba(0, 0, 1, 0)', strokeWidth: 1 };
                        lmap.polygon.addFeatureFromWkt(this.layer, data.wkt, style, 'dropzone');
                        geoIds += data.id + ',';
                    }
                });
                geoIds = geoIds.substring(0, geoIds.length - 1);
                this.initModel();
                this.updateParam('dropzone', 'geoIds', geoIds);
            },

            clearGeo: function() {
                this.geoObj = {};
                lmap.draw.clear(this.layer);
            },

            getLegend: function() {
                this.map.removeLayer(this.mlayer);
                this.updateParam('model','layer',null);
                this.updateParam('dropzone', 'levels', '');
                let reqData = this.getReqParam();
                let url = 'http://10.148.16.56/server/data/disaster/area';
                $.ajax({
                    url: url,
                    type: 'get',
                    data: { productCode: reqData.productCode, prediction: reqData.prediction, level: reqData.level, time: reqData.time },
                    dataType: 'json',
                    success: (json) => {
                        if (this.cType) {
                            this.markLegend(json.data);
                        }
                    }
                });
                this.initModel();
            },

            markLegend: function(legend) {
                let geoObj = {};
                let tempGeoArr = [];
                if (legend) {
                    legend.forEach((data, index) => {
                        geoObj[data.level] = {
                            id: data.id,
                            wkt: data.geoJson,
                            color: data.color
                        };
                        tempGeoArr.push(geoObj[data.level]);
                    });
                    this.geoObj = geoObj;
                    this.setGeo(tempGeoArr);
                } else {
                    this.clearGeo();
                }
            },

            getReqParam: function() {
                let typeArr = this.cType.split('_');
                let productCode = typeArr[0];
                let time = TimeUtil.format(this.dateTime, 'yyyy-MM-dd HH:mm:ss');
                let prediction = typeArr[1];
                let level = this.level.join(',');
                level = level ? level : '';
                if (this.level.length > 0) {
                } else { // 没有勾选等级时，用所有的等级去查
                    level = this.legend[this.model].level.join(',');
                }
                return { productCode: productCode, time: time, prediction: prediction, level: level };
            }

        },
        ready: function(){
            let layer = lmap.icon.initLayer(this.map, 'model');
            this.layer = layer;
            this.layer.setOpacity(0.6);
            this.updateParam('dropzone', 'layer', layer);
            this.getLegend();
        },
        detached: function(){
            this.clearGeo();
            this.tLevel = [];
            this.updateParam('dropzone', 'levels', []);
            this.updateParam('dropzone', 'layer', '');
        }
    }
</script>

<style scoped lang="less">
.legend { width: 100%; padding: 2px; z-index: 2; overflow: hidden; background-color: #fff;border: 1px solid #ccc;
    ul li { height: 27px; float: left; text-align: center; cursor: pointer;
        input { margin-top: 0; vertical-align: middle; margin-right: 4px; margin-left: 0; cursor: pointer; height: 16px; width: 16px; cursor: pointer; }
        font { margin-left: -6px; }
    }
    .gale { width:25% }
    .heavyRainfall { width:25%; }
    .temp { width:14.1%; }
    .legend_logo { display: inline-block; height: 4px; width: 100%; border: 1px solid #dadada; float: left; margin-top: 2px; }
}

/* big */
.big .legend { ul li { height: 36px; font-size: 19px;
        input { height: 16px; width: 16px; margin-right: 3px; }
    }
    .legend_logo { display: inline-block; height: 6px; width: 100%; border: 1px solid #dadada; float: left; margin-top: 2px; }
}
</style>