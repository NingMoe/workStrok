<template>
    <div>
        <div class="poiPop panelhover water-logging" v-if="waterLoggingStat==true">
        	<a class="Close" @click="close('waterLoggingStat')"></a>
            <div class="title nullbg">内涝点详情</div>
            <div class="popTab popTaBorder">
            	<div class="title">基本信息</div>
                <div class="popTab-box">
	                <ul>
	                    <li>地址：{{ waterLoggingPoint.full_name }}</li>
	                    <li>等级：{{ waterLoggingPoint.Level }}</li>
	                    <!--<li>详情：{{ waterLoggingPoint.detail }}</li>-->
	                </ul>
	            </div>
            </div>
        </div>
        <div class="poiPop panelhover fire-danger" v-if="fireDangerStat==true">
        	<a class="Close" @click="close('fireDangerStat')"></a>
        	<div class="title nullbg">森林火点详情</div>
            <div class="popTab popTaBorder">
            	<div class="title">基本信息</div>
            	<div class="popTab-box">
	                <ul>
	                    <li>卫星名称：{{ fireDangerPoint.full_name }}</li>
	                    <li>等级：{{ fireDangerPoint.Level }}</li>
	                    <li>火点置信度：{{ fireDangerPoint.detail }}</li>
	                    <li>位置：{{ fireDangerPoint.lon }} {{ fireDangerPoint.lat }}</li>
	                    <li>4微米亮温：{{ fireDangerPoint['4微米亮温'] }}</li>
	                    <li>11微米亮温：{{ fireDangerPoint['11微米亮温'] }}</li>
	                    <li>详情：{{ fireDangerPoint.detail }}</li>
	                </ul>
	           	</div>
            </div>
        </div>
    </div>
</template>

<script>
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import { updateParam } from '../../vuex/store'
    import TimeUtil from '../../util/tools/TimeUtil'
    import ModelTime from '../common/model'

    export default {
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                status: state => state.model.status,
                pType: state => state.model.pType,
                cType: state => state.model.cType,
                levels: state => state.model.levels,
                dateTime: state => state.model.dateTime,
                respTime: state => state.model.respTime,
                code: state => state.cityCode,
                cTime: state => state.model.cTime,
                loadArr: state => state.time.loadArr,
                isPlaying: state => state.time.isPlaying,
                opacity: state => state.opacity.value,
                dzType: state => state.dropzone.pType,
            },
            actions: { updateParam }
        },
        data() {
            return {
                map: config.getParam('map'),
                model: {
                    url: this.dss_sj+'/gd_image/image!loadModelStatic.action',
                    name: 'model',
                    opacity: '1',
                    extent: [106.89, 14.72, 121.11, 25.98],
                    imageSize: [1100, 850],
                    params: {
                        filestr: '1,2,3,4,5,6,7,',
                        pfmtype: 'heavyRainfall24_2d',
                        ddatetime: '',
                        respTime: ''
                    }
                },
                modelSize: {
                    heavyRainfall: [2200, 1700],
                    other: [1100, 850]
                },
                rel: {
                    gale: '1,2,3,4,5,6,7,',
                    heavyRainfall: '1,2,3,4,5,6,',
                    temp: '1,2,3,4,5,6,7,8,',
                    mountainTorrents: '1,2,3,4,',
                    waterLogging: '1,2,3,4,',
                    mt: '1,2,3,4,5,6,7,',
                    stormTide: '1,2,3,4,5,6,7,8,9,',
                    pollutantDispersion: '1,2,3,',
                    fireDanger: '0,1,2,3,4,5,6,7,'
                },
                waterLogging: {
                    url: this.dss_sj+'/gdmodel/model!queryWaterLoggingImg.action',
                    name: 'waterLogging',
                    opacity: '1',
                    extent: [106.89, 14.72, 121.11, 25.98],
                    params: {
                        pType: 'waterLogging',
                        filestr: '1,2,3,4,',
                        code: '',
                        dateTime: '',
                        pfmtype: 'past12'
                    }
                },
                waterLayer: null,
                waterLoggingPoint: {}, // 内涝点详情
                waterLoggingStat: false,
                fireDangerPoint: {}, // 森林火点详情
                activeStat: false, // 记录是否选中图标
                fireDangerStat: false,
                modelSource: null,
                sourceTime: '', // 用于记录原始时间，避免因模型时间规则导致时间错乱
                layer: null
            }
        },
        watch: {
            'pType': function() {
                this.unActivePoint();
                this.sourceTime = this.dateTime;
                this.refreshModel('pfmtype', this.pType)
            },
            'cType': function() {
                this.refreshModel('pfmtype', this.cType)
            },
            'levels': function() {
                let lev = this.levels.toString();
                if (lev === '') lev = this.rel[this.pType];
                // 获取强降水类型的模型图时，默认的0会导致无法获取到图片
                if (this.pType == 'heavyRainfall' && lev.indexOf('0,') !== -1) lev = lev.replace('0,', '');
                this.refreshModel('filestr', lev)
            },
            'dateTime': function() {
                this.sourceTime = this.dateTime;
                this.refreshModel('ddatetime', this.dateTime.toString())
            },
            'cTime': function() {
                this.refreshModel('pfmtype', this.cType)
            },
            'respTime': function() {
                this.refreshModel('respTime', this.respTime)
            },
            'code': function() {
                this.refreshModel('code', this.code)
            }
        },
        methods: {
            // 关闭森林火险和内涝点详情窗口
            close: function(type) {
                this[type] = false;
                this.unActivePoint();
            },
            // 取消图标选中效果
            unActivePoint: function() {
                if (this.activeStat) { // 清除图标选中
                    this.activeStat = false;
                    this.controlActivePoint('');
                    this.waterLoggingStat = false;
                    this.fireDangerStat = false;
                }
            },
            // 更新模型图层
            updateLayer: function() {
                let source = lmap.image.updateImageStatic(this.layer, this.model, 'model');
                source.on('imageloadend', this.loadEndEvt);
                source.on('imageloaderror', this.loadEndEvt);
            },
            // 刷新图层
            refreshModel: function(type, val) {
                if (!!this.layer) this.layer.setVisible(false);
                if (this.cType) {
                    if (this.pType == 'waterLogging' || this.pType == 'fireDanger') { // 内涝、森林火点
                        if (!!this.layer) this.layer.setVisible(false);
                        if (!!this.waterLayer) {
                            this.waterLayer.setVisible(true);
                            this.map.un('singleclick', this.clickWater);
                            this.map.on('singleclick', this.clickWater);
                        }
                        this.waterLogging.params.pType = this.pType;
                        this.waterLogging.params.pfmtype = this.cType;
                        this.waterLogging.params.dateTime = this.dateTime;
                        this.updateWaterLayer();
                    } else { // 其他模型
                        if (!!this.waterLayer) {
                            this.waterLayer.setVisible(false);
                            this.map.un('singleclick', this.clickWater);
                        }
                        if (type == 'pfmtype') this.updateModelSize();
                        if (!!this.layer) {
                            if (this.layer.getVisible() == false) {
                                this.initModelLayer();
                            }
                            if (!this.dzType) {
                                this.initModelLayer();
                            }
                            this.model.params[type] = val;
                            this.getModelTime(); // 改变模型时间
                            this.updateLayer();
                        }
                        if (!!this.layer) this.layer.setVisible(true);
                    }
                }
            },
            // 切换模型图层不同的extent值，避免出现偏位的问题
            updateModelSize: function() {
                let extent = this.modelSize.other;
                // 包含_2d的强降水模型的图片分辨率为1100*850
                if (this.pType == 'heavyRainfall' && this.cType.indexOf('_2d') == -1) {
                    extent = this.modelSize.heavyRainfall;
                }
                this.model.params.filestr = this.rel[this.pType];
                this.model.imageSize = extent;
            },
            // 内涝
            initWaterLogging: function() {
                let data = this.waterLogging.params;
                data.dateTime = this.dateTime;
                data.code = this.code;
                data.pType = this.pType;
                let lev = this.levels.toString();
                if (lev === '') lev = this.rel[this.pType];
                data.filestr = lev;
                let type = this.pType;
                if (this.cType != '') type = this.cType;
                data.pfmtype = type;
                this.waterLogging.params = data;
                let waterWms = lmap.image.loadImageWMS(this.map, this.waterLogging, 'model');
                this.waterLayer = waterWms;
            },
            // 更新内涝图层
            updateWaterLayer: function() {
                if (!!this.waterLayer) {
                    lmap.image.updateImageWMS(this.waterLayer, this.waterLogging.params);
                } else {
                    this.initWaterLogging();
                }
            },
            // 点击事件
            clickWater: function(evt) {
                this.getWaterDetail(lmap.controler.getEvtLonLat(evt));
            },
            getWaterDetail: function(lonlat) {
                let url = this.dss_sj+'/gdmodel/model!getWaterDetailByLonlat.action';
                let lev = this.levels.toString();
                if (lev === '') lev = this.rel[this.pType];
                let type = this.pType;
                if (this.cType != '') type = this.cType;
                let zoom = this.map.getView().getZoom() + '';
                let qd = {
                    PARAM: {
                        "pType": this.pType,
                        "dateTime": this.dateTime,
                        "code": this.code,
                        "filestr": lev,
                        "pfmtype": type,
                        "lon": lonlat[0],
                        "lat": lonlat[1],
                        "zoom": zoom
                    }
                };
                qd.PARAM = JSON.stringify(qd.PARAM);
                this.waterWinStat = false;
                $.getJSON(url, qd, (it) => {
                    if (!!it.lon) {
                        this[this.pType + 'Point'] = it;
                        this[this.pType + 'Stat'] = true;
                        let picName = '';
                        if (it.Level !== '未知') picName = this.pType;
                        else picName = 'waterLogging_select';
                        if (!this.bType) {
                            this.activeStat = true;
                            this.controlActivePoint(picName + "#" + it.lon + "#" + it.lat);
                        }
                    }

                })
            },
            // 控制选中图标
            controlActivePoint: function(val) {
                this.updateParam('activePoint', 'point', val); // 选中图标
            },
            loadEndEvt: function() {
                if (this.isPlaying) {
                    let arr = this.loadArr;
                    arr = arr.replace('model,', '');
                    arr += 'model,';
                    this.updateParam('time', 'loadArr', arr);
                }
            },
            /**
             * 获取规定的模型时间格式
             * @param name model's name
             */
            getModelTime: function() {
                let name = this.pType;
                let time = this.model.params.ddatetime;
                if (time == '') time = this.dateTime;
                if (!this.dzType) {
                    let mTime = ModelTime.getModelTime(name, this.cType, this.sourceTime, time);
                    this.model.params.ddatetime = mTime;
                    let lev = this.levels.toString();
                    if (lev === '') lev = this.rel[this.pType];
                    if (this.pType == 'heavyRainfall' && lev.indexOf('0,') !== -1) lev = lev.replace('0,', '');
                    this.model.params.filestr = lev;
                }
            },
            // 初始化Layer
            initModelLayer: function() {
                if (!!this.layer) {
                    this.map.removeLayer(this.layer);
                }
                // 更新模型范围像素大小
                this.updateModelSize();
                this.layer = lmap.image.loadImageStatic(this.model, 'model');
                this.map.addLayer(this.layer);
                this.layer.setOpacity(this.opacity / 100);
                this.layer.getSource().on('imageloadend', this.loadEndEvt);
                this.layer.getSource().on('imageloaderror', this.loadEndEvt);
                this.updateParam('model', 'layer', this.layer);
            }

        },
        ready: function() {
            let call = setInterval(() => {
                if (!!this.map) {
                    let type = this.pType;
                    if (this.cType != '') type = this.cType;
                    this.model.params.pfmtype = type;
                    this.getModelTime(); // 改变模型时间
                    this.initModelLayer();
                    clearInterval(call);
                    if (this.pType == 'waterLogging' || this.pType == 'fireDanger') {
                        this.initWaterLogging();
                        this.map.on('singleclick', this.clickWater);
                    }
                }
            }, 50);
        },
        detached: function() { // 销毁时调用
            this.layer.getSource().un('imageloadend', this.loadEndEvt);
            this.layer.getSource().un('imageloaderror', this.loadEndEvt);
            this.map.removeLayer(this.layer);
            if (!!this.waterLayer) this.map.removeLayer(this.waterLayer);
            this.updateParam('model', 'status', false)
            this.updateParam('model', 'cType', '');
            this.updateParam('model', 'layer', null);
            this.layer = null;
            this.waterLayer = null;
            this.map.un('singleclick', this.clickWater);
            this.unActivePoint(); // 清除图标选中
        }
    }
</script>

<style scoped="scoped" lang="less">
@import "../../assets/css/common.less";

.poiPop {
    width: 427px;
    height: auto;
    position: absolute;
    z-index: 4;
    right: 0;
    top: 0px;
    background: #fff;
    -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
.Close {
    position: absolute;
    right: 0;
    top: 0;
    height: 20px;
    width: 20px;
    background: url("../../assets/img/toolsbar/rightIcon.png") no-repeat;
    background-position: -153px -60px !important;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
}
.popTab {
    margin: 3px;

    .popTab-box {
        width: 100%;

        ul {
            width: 98%;
            margin: auto;
            margin-top: 3px;
            margin-bottom: 3px;
            min-height: 30px;
            max-height: 300px;
            overflow-y: auto;
        }
        ul li {
            height: 22px;
            line-height: 22px;
            width: 100%;
            text-align: left;
            float: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}

/*big*/
.big .poiPop {
    width: 500px;

    .popTab .popTab-box ul li {
        height: 30px;
        line-height: 30px;
    }
}
</style>