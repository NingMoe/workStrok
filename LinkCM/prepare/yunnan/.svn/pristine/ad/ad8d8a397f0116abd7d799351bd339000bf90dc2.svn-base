<template>
    <div>
        <div class="agr poiPop panelhover" v-if="stat==true" id="agr" v-el:agr-win>
            <a class="close" @click="close()"></a>
            <div class="title" v-el:title>
                <label>{{title}}</label>
            </div>
            <ul class="agr-list">
                <template v-for="it of list">
                    <li @click="exchange($key)" :class="{'ns-li':it.isSelect}">
                        <i :class="$key"></i>
                        <span>{{obj[$key]}}<em class="emfocus"></em></span>
                    </li>
                </template>
            </ul>
            <div class="popTab">
                <div class="agr-art">
                    <p>{{list[type].content}}</p>
                </div>
                <v-picplay :list="list[type]"></v-picplay>
            </div>
        </div>
    </div>
</template>

<script>

    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import { updateParam } from '../../vuex/store'
    import picplay from '../common/PicPlay'
    import WinDrag from 'util/tools/WinDrag'
    import TimeUtil from '../../util/tools/TimeUtil'

    export default {
        components: { 'v-picplay': picplay },
        data() {
            return {
                agr: {
                    url: this.dss+'/agr/agr!queryAgrImage.action',
                    name: 'airq',
                    opacity: '1',
                    extent: [109.6, 20, 117.2, 25.5],
                    params: {
                        dateTime: '2016072417',
                        code: '44'
                    }
                },
                obj: { F: '水果', V: '蔬菜', R: '水稻', P: '花生', T: '黄烟', o: '其它', O: '其它' },
                list: '',
                title: '',
                stat: false,
                type: '',
                activeStat: false, // 记录是否选中图标
                lonlat: '',
                map: config.getParam('map'),
                WMS: undefined,
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                dateTime: state => state.agr.dateTime,
                code: state => state.cityCode,
                divIds: state => state.windows.divIds
            },
            actions: { updateParam }
        },
        methods: {
            close: function() {
                let tempIds = this.divIds;
                tempIds = tempIds.replace('agr,', '');
                this.updateParam('windows', 'divIds', tempIds);
                this.stat = false;
                this.activeStat = false;
                this.controlActivePoint('');
                if (this.timer) window.clearTimeout(this.timer);
            },
            // 显示图层
            initLayer: function() {
                this.agr.params.dateTime = this.dateTime;
                this.agr.params.code = this.code;
                this.WMS = lmap.image.loadImageWMS(this.map, this.agr, 'poitop');
            },
            // 点击事件
            clickEvt: function(evt) {
                this.getAgrData(lmap.controler.getEvtLonLat(evt));
            },
            getAgrData: function(lonlat) {
                this.lonlat = lonlat;
                let zoom = this.map.getView().getZoom() + '';
                let url = this.dss+'/agr/agr!queryArgDataByClick.action';
                let qdata = { PARAM: { dateTime: this.dateTime, code: this.code, lon: lonlat[0], lat: lonlat[1], zoom: zoom } };
                qdata.PARAM = JSON.stringify(qdata.PARAM);
                $.getJSON(url, qdata, (bd) => {
                    if (bd !== 'null' && bd !== null) {
                        this.title = bd[0].siteName;
                        let obj = {};
                        (bd[0].typeInfo).forEach((it) => {
                            obj[it.type] = it.typeList[0];
                            obj[it.type].isSelect = false;
                            this.type = it.type;
                        });
                        this.list = obj;
                        this.list[this.type].isSelect = true;
                        this.stat = true;
                        this.activeStat = true;
                        this.initTimer();
                        this.controlActivePoint('agr#' + bd[0].lon + '#' + bd[0].lat);
                        this.addWinDragEvt('title');

                        let tempIds = this.divIds;
                        tempIds = tempIds.replace('agr,', '');
                        tempIds += 'agr,';
                        this.updateParam('windows', 'divIds', tempIds);

                    }
                });
            },
            exchange: function(type) {
                this.list[this.type].isSelect = false;
                this.list[type].isSelect = true;
                this.type = type;
            },
            // 图标选中
            controlActivePoint: function(val) {
                this.updateParam('activePoint', 'point', val);
            },
            // 使窗口支持拖动功能
            addWinDragEvt: function(elName) {
                let call = setInterval(() => {
                    let winObj = this.$els[elName];
                    if (!!winObj) WinDrag.drag(winObj, this.$els.agrWin, this.map);
                    clearInterval(call);
                }, 10);
            },
            initTimer: function() {
                if (this.timer) window.clearTimeout(this.timer);
                if (this.stat) {
                    this.timer = window.setTimeout(() => {
                        return this.getAgrData(this.lonlat);
                    }, 1000 * 60 * 60 * 24);
                }
            }
        },
        compiled: function() {
            this.initLayer();
            this.map.on('singleclick', this.clickEvt);
        },
        detached: function() {

            let tempIds = this.divIds;
            tempIds = tempIds.replace('agr,', '');
            this.updateParam('windows', 'divIds', tempIds);

            this.map.removeLayer(this.WMS);
            this.map.un('singleclick', this.clickEvt);
            
            if (this.timer) window.clearTimeout(this.timer);
            this.stat = false;
            if (this.activeStat) {
                this.activeStat = false;
                this.controlActivePoint('');
            }
        }
    }
</script>

<style scoped lang='less'>
@import "../../assets/css/common.less";

.poiPop {
    width: 427px;
    height: auto;
    position: absolute;
    z-index: 3;
    right: 0;
    top: 0px;
    background: #fff;
    -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
.close {
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
    height: auto;
    overflow: hidden;
}
.agr-list {
    height: 20px;
    margin: 10px 5px;
}
.agr-list li {
    float: left;
    width: 16.6%;
    height: 20px;
    line-height: 20px;
    text-align: left;
    cursor: pointer;
}
.agr-list li i {
    background: url("../../assets/img/common/nongqing.png") no-repeat;
    display: inline-block;
    display: -moz-inline-stack;
    zoom: 1;
    *display: inline;
    width: 20px;
    height: 20px;
    float: left;
    margin-right: 2px;
}
.agr-list li i.F {
    background-position: -88px 0 !important;
}
.agr-list li i.V {
    background-position: -118px 0 !important;
}
.agr-list li i.R {
    background-position: -3px 0 !important
}
.agr-list li i.P {
    background-position: -63px 0 !important
}
.agr-list li i.T {
    background-position: -34px 0 !important;
}
.agr-list li i.o {
    background-position: -144px 2px !important;
}
.agr-list li i.O {
    background-position: -144px 2px !important;
}
.agr-list li span {
    position: relative;
    cursor: pointer;
}
.agr-list li span label {
    cursor: pointer;
}
.agr-list li:hover {
    color: @color
}
.agr-list li.ns-li {
    color: @color
}
.agr-list li.ns-li em {
    display: block;
    position: absolute;
    top: -3px;
    right: -14px;
    text-align: center;
}
.agr-list li:hover i.F, .agr-list li.ns-li i.F {
    background-position: -88px -22px !important;
}
.agr-list li:hover i.V, .agr-list li.ns-li i.V {
    background-position: -118px -22px !important;
}
.agr-list li:hover i.R, .agr-list li.ns-li i.R {
    background-position: -3px -22px !important
}
.agr-list li:hover i.P, .agr-list li.ns-li i.P {
    background-position: -63px -22px !important
}
.agr-list li:hover i.T, .agr-list li.ns-li i.T {
    background-position: -34px -22px !important;
}
.agr-list li:hover i.o, .agr-list li.ns-li i.o {
    background-position: -144px -22px !important;
}
.agr-list li:hover i.O, .agr-list li.ns-li i.O {
    background-position: -144px -22px !important;
}
.agr-art {
    height: auto;
    clear: both;
    max-height: 124px;
    height: auto;
    overflow-y: auto;
    margin-bottom: 5px;
}
.agr-art p {
    width: 100%;
    text-indent: 2em;
    line-height: 22px;
}
.panelhover {
    -webkit-transition: box-shadow .3s;
    -moz-transition: box-shadow .3s;
    -o-transition: box-shadow .3s;
    transition: box-shadow .3s;
}
.panelhover:hover {
    -webkit-box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.3);
    box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.3);
}
::-webkit-scrollbar {
    width: 6px;
}
::-webkit-scrollbar-track {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: #414e61;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}

::-webkit-scrollbar-corner {
    background-color: black;
}

/*big*/
.big .poiPop {
    width: 600px;

    .agr-list {
        height: 24px;
    }
    .agr-art {
        max-height: 166px;
    }
    .agr-art p {
        line-height: 30px;
    }
}
</style>