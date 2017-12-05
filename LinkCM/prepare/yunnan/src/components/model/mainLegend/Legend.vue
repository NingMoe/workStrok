<template>
    <div v-el:legend-box class="legend">
        <ul>
            <li v-for="item in legend[model]['legend']" class="{{legend[model]['className']}}">
                <input class="checkbox" type="checkbox" id="{{item.id}}" value="{{item.level}}" v-model="legend[model].slevels" @click="selectInput(item.level)">
                <label for="{{item.id}}">{{item.name}}</label>
                <span class="legend_logo" :style="{background:item.color}"></span>
            </li>
        </ul>
    </div>
</template>

<script>
    import { updateParam } from '../../../vuex/store'
    import ModelTime from '../../common/model'

    export default {
        props: ['model'],
        data () {
            return {
                legend: {
                    "gale": {
                        name: "大风",
                        bounds: [106.89, 14.72, 121.11, 25.98],
                        width: '59px',
                        className:'tf',
                        legend: [{"level": "1", "name": "2-3", "color": "#4169FF","id":"gale_1"},
                                 {"level": "2", "name": "4-5", "color": "#0000FF","id":"gale_2"},
                                 {"level": "3", "name": "6-7", "color": "#DAA520","id":"gale_3"},
                                 {"level": "4", "name": "8-9", "color": "#FFFF00","id":"gale_4"},
                                 {"level": "5", "name": "10-11", "color": "#FF8C00","id":"gale_5"},
                                 {"level": "6", "name": "12-13", "color": "#FF1493","id":"gale_6"},
                                 {"level": "7", "name": ">=14", "color": "#DC1406","id":"gale_7"}],
                        slevels:[]
                    },
                    "heavyRainfall": {
                        name: "强降水",
                        width: 'auto',
                        className:'jy',
                        bounds: [106.89, 14.72, 121.11, 25.98],
                        legend: [{"level": "0", "name": "毛毛雨", "color": "#fff","id":"heavyRainfall_1"},
                                 {"level": "1", "name": "小雨", "color": "#A6F28E","id":"heavyRainfall_2"},
                                 {"level": "2", "name": "中雨", "color": "#3DB93D","id":"heavyRainfall_3"},
                                 {"level": "3", "name": "大雨", "color": "#61B8FF","id":"heavyRainfall_4"},
                                 {"level": "4", "name": "暴雨", "color": "#0000FE","id":"heavyRainfall_5"},
                                 {"level": "5", "name": "大暴雨", "color": "#FA00FA","id":"heavyRainfall_6"},
                                 {"level": "6", "name": "特大暴雨", "color": "#810040","id":"heavyRainfall_7"}],
                        slevels:[]
                    },
                    "temp": {
                        name: "温度",
                        width: 'auto',
                        className:'wd',
                        bounds: [106.89, 14.72, 121.11, 25.98],
                        legend: [{"level": "1", "name": "<=5", "color": "#285CFD","id":"temp_1"},
                                 {"level": "2", "name": "5-10", "color": "#10BDFD","id":"temp_2"},
                                 {"level": "3", "name": "10-15", "color": "#E66CC5","id":"temp_3"},
                                 {"level": "4", "name": "15-20", "color": "#FFFF9D","id":"temp_4"},
                                 {"level": "5", "name": "20-25", "color": "#FFD322","id":"temp_5"},
                                 {"level": "6", "name": "25-30", "color": "#FFA318","id":"temp_6"},
                                 {"level": "7", "name": "30-40", "color": "#FF5818","id":"temp_7"},
                                 {"level": "8", "name": ">40", "color": "#FF0000","id":"temp_8"}],
                        slevels:[]
                    },
                    "mountainTorrents": {
                        name: "山洪",
                        width: '104px',
                        className:'sh',
                        bounds: [106.89, 14.72, 121.11, 25.98],
                        legend: [{"level": "1", "name": "Ⅰ级", "color": "#F72D22","id":"mountainTorrents_1"},
                                 {"level": "2", "name": "Ⅱ级", "color": "#FF9513","id":"mountainTorrents_2"},
                                 {"level": "3", "name": "Ⅲ级", "color": "#FFFD00","id":"mountainTorrents_3"},
                                 {"level": "4", "name": "Ⅳ级", "color": "#00CFF1","id":"mountainTorrents_4"}],
                        slevels:[]
                    },
                    "waterLogging": {
                        name: "内涝",
                        width: '104px',
                        className:'nl',
                        bounds: [106.67734, 19.95449, 121.68466, 26.048628],
                        legend: [{"level": "1", "name": "Ⅰ级", "color": "#F72D22","id":"waterLogging_1"},
                                 {"level": "2", "name": "Ⅱ级", "color": "#FF9513","id":"waterLogging_2"},
                                 {"level": "3", "name": "Ⅲ级", "color": "#FFFD00","id":"waterLogging_3"},
                                 {"level": "4", "name": "Ⅳ级", "color": "#00CFF1","id":"waterLogging_4"}],
                        slevels:[]
                    },
                    "mt": {
                        name: "漫滩",
                        width: 'auto',
                        className:'mt',
                        bounds: [106.89, 14.75, 121.11, 26.01],
                        legend: [{"level": "1", "name": "0-0.5", "color": "#F7FFAA","id":"mt_1"},
                                 {"level": "2", "name": "0.5-1", "color": "#F3FF4E","id":"mt_2"},
                                 {"level": "3", "name": "1.1-1.5", "color": "#FFFD00","id":"mt_3"},
                                 {"level": "4", "name": "1.5-2", "color": "#FFA900","id":"mt_4"},
                                 {"level": "5", "name": "2.1-2.5", "color": "#FF6700","id":"mt_5"},
                                 {"level": "6", "name": "2.5-3", "color": "#FF0000","id":"mt_6"},
                                 {"level": "7", "name": ">3m", "color": "#570000","id":"mt_7"}],
                        slevels:[]
                    },
                    "stormTide": {
                        name: "风暴潮",
                        width: '40px',
                        className:'fb',
                        bounds: [106.89, 14.72, 121.11, 25.98],
                        legend: [{"level": "1", "name": "Ⅰ级", "color": "#0000CD","id":"stormTide_1"},
                                 {"level": "2", "name": "Ⅱ级", "color": "#4169E1","id":"stormTide_2"},
                                 {"level": "3", "name": "Ⅲ级", "color": "#1E90FF","id":"stormTide_3"},
                                 {"level": "4", "name": "Ⅳ级", "color": "#FFFFFF","id":"stormTide_4"},
                                 {"level": "5", "name": "Ⅴ级", "color": "#FFE132","id":"stormTide_5"},
                                 {"level": "6", "name": "Ⅵ级", "color": "#FFAA00","id":"stormTide_6"},
                                 {"level": "7", "name": "Ⅶ级", "color": "#FF6E00","id":"stormTide_7"},
                                 {"level": "8", "name": "Ⅷ级", "color": "#C80000","id":"stormTide_8"},
                                 {"level": "9", "name": "Ⅸ级", "color": "#A02323","id":"stormTide_9"}],
                        slevels:[]
                    },
                    "pollutantDispersion": {
                        name: "污染扩散",
                        width: '138px',
                        className:'wr',
                        bounds: [106.89, 14.72, 121.11, 25.98],
                        legend: [{"level": "1", "name": "轻度", "color": "#00E4FF","id":"pollutantDispersion_1"},
                                 {"level": "2", "name": "中度", "color": "#F6F744","id":"pollutantDispersion_2"},
                                 {"level": "3", "name": "重度", "color": "#CF3617","id":"pollutantDispersion_3"}],
                        slevels:[]
                    },
                    "fireDanger": {
                        name: "森林火点",
                        width: '52px',
                        className:'hd',
                        bounds: [106.67734, 19.95449, 121.68466, 26.048628],
                        legend: [{"level": "0", "name": "0级", "color": "#4169FE","id":"fireDanger_1"},
                                 {"level": "1", "name": "Ⅰ级", "color": "#0000FB","id":"fireDanger_2"},
                                 {"level": "2", "name": "Ⅱ级", "color": "#D9A31C","id":"fireDanger_3"},
                                 {"level": "3", "name": "Ⅲ级", "color": "#D5830F","id":"fireDanger_4"},
                                 {"level": "4", "name": "Ⅳ级", "color": "#F06B08","id":"fireDanger_5"},
                                 {"level": "5", "name": "Ⅴ级", "color": "#FF1193","id":"fireDanger_6"},
                                 {"level": "6", "name": "Ⅵ级", "color": "#DC1103","id":"fireDanger_7"},
                                 {"level": "7", "name": "Ⅶ级", "color": "#970E05","id":"fireDanger_8"}],
                        slevels:[]
                    }
                },
                sourceTime: ''
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                levels: state => state.model.levels,
                dateTime: state => state.model.dateTime,
                pType: state => state.model.pType,
                cType: state => state.model.cType,
                code: state => state.cityCode
            },
            actions: {
                updateParam
            }
        },
        watch: {
            pType: function(){
                this.initModel();
            },
            cType: function(){
                this.initModel();
            },
            dateTime: function(){
                this.initModel();
            },
            code: function(){
                this.initModel();
            }
        },
        methods: {
            // 点击图例checkbox
            selectInput: function(level, obj) {
                var levels = this.legend[this.model].legend;
                var allLevels = [];
                levels.forEach((item) => allLevels.push(item.level));
                let sArr = []; // 选中的项
                let allLev = this.legend[this.model].slevels;
                if (this.isIE()) {
                    if (allLev.indexOf(level) != -1) {
                        allLevels.forEach((item) => {
                            if (parseInt(item) >= parseInt(level)) sArr.push(item);
                        });
                    } else {
                        allLev.forEach((item) => {
                            if (item != level) sArr.push(item);
                        });
                    }
                } else {
                    let bversion = this.getBrowserVersion();
                    let stat = false;
                    if (bversion != '') { //chrome
                        let version = bversion.substring(7, 9);
                        if (parseInt(version) <= 44) stat = true;
                    }
                    if (stat) { //低版本浏览器
                        if (allLev.indexOf(level) != -1) {
                            allLevels.forEach((item) => {
                                if (item >= level) sArr.push(item);
                            });
                        } else {
                            allLev.forEach((item) => {
                                if (item != level) sArr.push(item);
                            });
                        }
                    } else {
                        if (allLev.indexOf(level) != -1) {
                            allLev.forEach((item) => {
                                if (item != level) sArr.push(item);
                            });
                        } else {
                            allLevels.forEach((item) => {
                                if (item >= level) sArr.push(item);
                            });
                        }
                    }
                }
                this.legend[this.model].slevels = sArr;
                this.updateParam('model', 'levels', sArr);
                if (this.pType != 'waterLogging' && this.pType != 'fireDanger') {
                    this.initModel();
                }
            },
            // 初始化模型面板数据
            initModel: function() {
                // 初始化之前先清空已选择的图例等级
                this.clearAllLegend(this.pType);
                var url = this.dss_sj+'/gdmodel/model!getModelDatas.action';
                var type = this.cType == '' ? this.pType : this.cType;
                let sArr = (this.legend[this.model].slevels).toString();
                if (sArr === '') return;
                // 获取正常的模型时间
                if (ModelTime.data[this.cType]) {
                    var mTime = ModelTime.getModelTime(this.pType, this.cType, this.sourceTime, this.dateTime);
                    if (mTime.length == 10) mTime += '00';
                    else mTime = mTime.substring(0, 12);
                    var qdata = { PARAM: { dateTime: mTime, modelType: type, levels: sArr, type: 'list', areaCode: this.code } };
                    qdata.PARAM = JSON.stringify(qdata.PARAM);
                    var modelDatas = {
                        townCount: { name: '行政镇', num: "---" },
                        pop: { name: '人口', num: "---" },
                        area: { name: '面积', num: "---" },
                        gdp: { name: 'GDP', num: "---" }
                    };
                    this.$parent.count.datas = modelDatas;
                    $.ajax({
                        url: url,
                        data: qdata,
                        type: 'POST',
                        success: (bd) => {
                            this.updateParam('model', 'cacheId', bd.id);
                            for (let key in bd) {
                                if (!!modelDatas[key]) modelDatas[key].num = bd[key];
                            }
                        },
                        error: () => { // 过去强降水存在分析结果较慢的问题
                            for (let key in modelDatas) {
                                modelDatas[key].num = '--';
                            }
                            this.$parent.count.datas = modelDatas;
                        }
                    });
                }
            },
            isIE: function() {
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    return true;
                } else {
                    return false;
                }
            },
            getBrowserVersion: function() {
                var agent = navigator.userAgent.toLowerCase();
                var regStr_chrome = /chrome\/[\d.]+/gi;
                if (agent.indexOf("chrome") > 0) {
                    return agent.match(regStr_chrome)[0];
                } else {
                    return '';
                }
            },
            /**
             * 清除图例原本勾选的等级 
             * @param {string}type 当前选中的图例类型
             */
            clearAllLegend: function(type) {
                let list = this.legend;
                for (let key in list) {
                    if (key !== type && list[key].slevels.length != 0) {
                        list[key].slevels = [];
                    }
                }
            }
        },
        detached: function(){
            this.updateParam('model', 'levels', []);
        }
    }
</script>

<style scoped lang="less">
.legend {
    width:100%;
    padding: 2px;
    z-index:2;
    overflow: hidden; 
    background-color: #fff;
    border: 1px solid #ccc;
    
    ul li {
        height:27px;
        float: left;
        text-align: center;
        cursor: pointer;
        input {
            margin-top: 0;
		    vertical-align: middle;
		    margin-right: 4px;
		    margin-left:0;
		    cursor: pointer;
		    height: 16px;
		    width: 16px;
		    cursor: pointer;
        }
        font {
            margin-left: -6px;
        }
    }
    .tf{width:59px}
    .jy{width:57px;}
    .jy:last-child{width:72px}
    .wd{width:13%;}
    .wd:first-child,.wd:nth-child(2),.wd:last-child{width:11%}
    .sh{width:25%;}
    .nl{width:25%;}
    .mt{width:59px}
    .fb{width:11%;}
    .wr{width:33.3%;}
    .hd{width:12.5%}
    .legend_logo {
        display: inline-block;
        height: 4px; width:100%;
        border: 1px solid #dadada;
        float: left;
        margin-top: 2px;
    }
}
/*big*/
.big .legend {
        ul li {
            height:36px;
            font-size: 19px;
            input {
			    height: 16px;
			    width: 16px;
			    margin-right:3px;
            }
        }
        .tf{width:89px}
        .jy{width:86px;}
        .jy:last-child{width:104px}
        .mt{width:13.4%}
        .mt:nth-child(3),.mt:nth-child(5){width:16%}
        .legend_logo {
            display: inline-block;
            height:6px; 
            width:100%;
            border: 1px solid #dadada;
            float: left;
            margin-top: 2px;
        }
    }
</style>