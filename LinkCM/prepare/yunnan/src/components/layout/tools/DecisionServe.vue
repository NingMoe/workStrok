<template>
    <div class="decide-serve toolPop">
        <div class="tools">
            <ul>
                <li>
                	<div class=" decideSelect">
	                    <!--<select>
	                        <option v-for="item in typeItems" :value="$key">{{item.text}}</option>
	                    </select>-->
                        <v-select :defname="'typeValue'" :def="typeValue" :initvalue="typeValue" :list="typeItems"></v-select>
	                </div>
                </li>
                <li v-for="item in graphicsItems" @click="getTool(item)" :class="item.css" type="tools" :title="item.text"></li>
                <!-- <li class="line"></li> -->
                <li v-for="(key, value) in operationItems" @click="getTool(key)" type="tools" :class="$key" :title="value"></li>
            </ul>
            <a class="drag"></a>
            <a :class="{'unfold': isFold, 'fold': !isFold}" @click="showListPanel()"></a>
        </div>

        <div class="casesDiv" v-show="isSave">
            <input class="casesName" type="text" :value="casesName" placeholder="方案名" v-model="casesName"/>
            <input class="btnhover" type="button" value="确定" @click="saveCases()"/>
        </div>

        <div v-show="isFold">
            <div v-show="!isCases">
                <div class="list">
                    <div class="levels">
                        <span>等级：</span>
                        <a v-for="item in levelItems">
                        	<input class="checkbox" id="{{item.id}}" type="checkbox" v-model="levels" :value="item.level" />
                        	<label for="{{item.id}}">{{item.text}}</label>
                        </a>
                    </div>
                    <div class="times">
                        <span>时间：</span>
                        <input type="text" readonly="readonly" id="ds-start-time" :time-val="startTimeStr" :value="startTime" @click="selectStartTime()"> -
                        <input type="text" readonly="readonly" id="ds-end-time" :time-val="endTimeStr" :value="endTime" @click="selectEndTime()">
                        <a class="btnhover" @click="getList()">分析数据</a>
                    </div>
                    <div class="serverTable" v-show="siteItems[0] !== undefined">
                        <table cellpadding="0" cellspacing="0">
                            <thead>
                                <tr> <td> <input type="checkbox" v-model="allSites" /> </td> <td>站点名</td> <td>站点号</td> <td>风速</td> <td>时间</td> </tr>
                            </thead>
                            <tbody>
                                <tr @click="selectPoint(item.siteId)" v-for="item in siteItems"> <td><input :value="item.siteId" type="checkbox" v-model="siteIds" /></td> <td>{{item.name}}</td> <td>{{item.siteId}}</td> <td>{{item.maxWind}}</td> <td>{{item.time}}</td> </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-show="false" class="loading">loading</div>
                    <div v-show="nodata" class="nodata">暂无数据</div>
                </div>
                <div class="decideServeColor">
                    <div class="font-panel">
                        <span class="font" @click="selectPanel(true)"></span>
                        <div class="font-color" :style="{background:fontColor}" @click="selectPanel(true)"></div>
                        <div class="color-panel" v-show="isFontPanel">
                            <ul>
                                <li v-for="item in colorItems" @click="selectColor('font',item)" :class="item.class"></li>
                            </ul>
                        </div>
                        <input class="fontSizeInput" type="text" v-model="fontSize" :value="fontSize" v-show="isFontPanel"></input>
                        <div class="fontF" v-show="isFontPanel">
                            <!--<select v-model="fontFamilyVal">
                                <option v-for="item in foneItems" v-show="isFontPanel">{{item.text}}</option>
                            </select>-->
                            <v-select :defname="'foneValue'" :def="foneValue" :initvalue="foneValue" :list="foneItems"></v-select>
                        </div>
                        <div class="siteName" v-show="isFontPanel">
                        	<input id="siteName-checkbox" class="site-checkbox checkbox-btn" type="checkbox" v-model="siteNameStatus" />
                        	<label for="siteName-checkbox">站点名称</label>	
                        </div>
                    </div>
                    <div class="marker-panel">
                        <span :class="selectMarker" @click="selectPanel(false)"></span>
                        <div class="marker-color" :style="{background:pointColorVal}" @click="selectPanel(false)"></div>
                        <div class="color-panel" v-show="!isFontPanel">
                            <ul>
                                <li v-for="item in colorItems" @click="selectColor('marker',item)" :class="item.class"></li>
                            </ul>
                        </div>
                        <div class="slider">
                            <div id="marker-slider" class="marker-slider" v-show="!isFontPanel"></div>
                            <span class="slider-text" v-show="!isFontPanel">{{sliderText}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="casesList" v-show="isCases">
                <table cellpadding="0" cellspacing="0">
                    <thead>
                        <tr>
                            <td>序号</td>
                            <td>方案名</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in casesItems" @click="selectCases(item.id)">
                            <td>{{$index}}</td>
                            <td>{{item.name}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        
    </div>
</template>

<script>

    import lmap from '../../../util/lmap/lmap'
    import config from '../../../config'
    import TimeUtil from '../../../util/tools/TimeUtil'
    import { updateParam } from '../../../vuex/store'
    import '../../../util/timepicker/timepicker'
    import Select from '../../common/Select'

    import 'jquery-ui/ui/widgets/slider'
    import 'jquery-ui/themes/base/slider.css'
    import 'jquery-ui/themes/base/theme.css'

    export default {
        components: { 'v-select': Select },
        data() {
            return {
                casesItems: [],
                typeValue: "极大风风速",
                typeItems: [{ 'text': '极大风风速' }],
                graphicsItems: [
                    { 'code': 'circle', 'text': '画圆形', 'css': { 'circle': true, 's-circle': false } },
                    { 'code': 'rectangel', 'text': '画矩形', 'css': { 'rectangel': true, 's-rectangel': false } },
                    { 'code': 'polygon', 'text': '画多边形', 'css': { 'polygon': true, 's-polygon': false } },
                    { 'code': 'arrow', 'text': '画箭头', 'css': { 'arrow': true, 's-arrow': false } }
                ],
                operationItems: { 'undo': '撤销', 'delete': '删除当前图层', 'save': '保存', 'cases': '方案', 'close': '关闭' },
                levelItems: [
                    { 'level': 8, 'text': '8级', 'id': 'ba' },
                    { 'level': 9, 'text': '9级', 'id': 'jiu' },
                    { 'level': 10, 'text': '10级', 'id': 'shi' },
                    { 'level': 11, 'text': '11级', 'id': 'sy' },
                    { 'level': 12, 'text': '12级', 'id': 'se' },
                    { 'level': 13, 'text': '12级以上', 'id': 'ses' }
                ],
                colorItems: [
                    { 'color': '#000000', 'class': 'black', 'code': '16' }, 
                    { 'color': '#6f706b', 'class': 'dark-gray', 'code': '10' }, 
                    { 'color': '#6f180e', 'class': 'drak-red', 'code': '11' }, 
                    { 'color': '#f28837', 'class': 'orange', 'code': '02' }, 
                    { 'color': '#266d28', 'class': 'dark-green', 'code': '08' }, 
                    { 'color': '#0e37b8', 'class': 'deep-blue', 'code': '14 '},
                    { 'color': '#6d0b62', 'class': 'deep-purple', 'code': '12' }, 
                    { 'color': '#13807f', 'class': 'dark-cyan', 'code': '06' }, 
                    { 'color': '#ffffff', 'class': 'white', 'code': '01' }, 
                    { 'color': '#b3b5ae', 'class': 'gray', 'code': '05' }, 
                    { 'color': '#ed3f2b', 'class': 'tomato', 'code': '03' }, 
                    { 'color': '#ebde37', 'class': 'khaki', 'code': '07' }, 
                    { 'color': '#96c130', 'class': 'lime-green', 'code': '09' }, 
                    { 'color': '#0a78c8', 'class': 'royal-blue', 'code': '15' }, 
                    { 'color': '#d523c8', 'class': 'orchid', 'code': '04' }, 
                    { 'color': '#1ac1ca', 'class': 'turquoise', 'code': '13' }
                ],

                foneValue: "黑体",
                foneItems: [
                    {'text': '黑体', 'value': '黑体'},  
                    {'text': '宋体', 'value': '宋体'}
                ],

                siteItems: [],
                allSites: true,
                sliderText: '缩放：50%',
                pointColor: '#6d0b62',
                siteIds: [],
                levels: [],
                pointColorVal: '#6d0b62',
                siteNameStatus: false,

                isFontPanel: true,
                isFold: true,
                loading: false,
                nodata: false,
                isCases: false,
                isSave: false,
                casesName: '',

                // 参数
                ids: '',
                level: '',
                startTime: '',
                endTime: '',
                fontFamilyVal: '黑体',
                fontSize: '12',
                fontColor: '#000000',
                pointColor: '12',
                pointSize: 50,
                stationState: 'all',

                map: config.getParam('map'),
                layer: undefined,
                WMS: undefined

            }
        },

        computed: {
            selectMarker: function() {
                return 'marker-' + this.pointColor;
            }
        },

        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                code: state => state.cityCode,
                mapType: state => state.map.mapType
            },
            actions: { updateParam }
        },

        watch: {
            siteNameStatus: function() {
                this.drawLayout();
            },
            fontSize: function() {
                this.drawLayout();
            },
            fontFamilyVal: function() {
                this.drawLayout();
            },
            levels: function() {
                this.level = this.levels.join(',');
                this.drawLayout();
            },
            siteIds: function() {
                let siteIdsLen = this.siteIds.length;
                let siteItemsLen = this.siteItems.length;
                this.ids = '';
                if (siteIdsLen === siteItemsLen) {
                    this.stationState = 'all';
                    this.allSites = true;
                } else if (siteIdsLen === 0) {
                    this.stationState = 'none';
                    this.unSiteIds = this.allSiteIds.slice(0);
                    this.allSites = false;
                } else if (siteIdsLen >= Math.round(siteItemsLen / 2)) {
                    this.stationState = 'unsomeselect';
                    this.someSiteIds = this.siteIds;
                    this.ids = this.unSiteIds.join(',');
                    this.allSites = false;
                } else if (siteIdsLen < Math.round(siteItemsLen / 2)) {
                    this.stationState = 'someselect'
                    this.someSiteIds = this.siteIds;
                    this.ids = this.someSiteIds.join(',');
                    this.allSites = false;
                }
                this.drawLayout();
            },
            allSites: function() {
                if (this.allSites) {
                    let tempSiteIds = this.allSiteIds.slice(0);
                    this.siteIds = tempSiteIds;
                    this.unSiteIds = [];
                } else {
                    this.siteIds = [];
                    if (this.someSiteIds) {
                        this.siteIds = this.someSiteIds;
                    }
                }
                this.someSiteIds = [];
            },
            code: function() {
                this.getList();
            }
        },
        methods: {
            getTool: function(item) {
                if (item === 'undo') {
                    this.undo();
                    return;
                } else if (item === 'delete') {
                    this.clear();
                    return;
                } else if (item === 'close') {
                    this.updateParam('decisionserve', 'status', false);
                    this.$parent.list.decisionserve.stat = false;
                    return;
                } else if (item === 'cases') {
                    this.isCases = !this.isCases;
                    this.getCasesList();
                    return;
                } else if (item === 'save') {
                    this.isSave = !this.isSave;
                    return;
                }
                let currTool = this.currTool;
                if (currTool && item.code !== currTool.code && currTool.css['s-' + currTool.code]) {
                    currTool.css[currTool.code] = true;
                    currTool.css['s-' + currTool.code] = false;
                }
                let on = item.css['s-' + item.code];
                let off = item.css[item.code];
                if (on) {
                    off = true;
                    on = false;
                } else {
                    off = false;
                    on = true;
                }
                item.css['s-' + item.code] = on;
                item.css[item.code] = off;
                if (on) {
                    if (item.code === 'polygon') {
                        this.initDraw('freePolygon');
                    } else if (item.code === 'rectangel') {
                        this.initDraw('box');
                    } else if (item.code === 'circle') {
                        this.initDraw('circlePoint');
                    } else if (item.code === 'arrow') {
                        this.initDraw('arrow');
                    } else if (item.code === 'point') {
                        this.initDraw('text');
                    }
                } else {
                    this.cancel();
                }
                this.currTool = item;
            },
            showListPanel: function() {
                this.isFold = !this.isFold;
            },
            selectPanel: function(state) {
                this.isFontPanel = state;
            },
            selectColor: function(type, item) {
                if (type === 'font') {
                    this.fontColor = item.color;
                    this.drawLayout();
                } else if (type === 'marker') {
                    this.pointColorVal = item.color;
                    this.pointColor = item.code;
                }
            },
            selectStartTime: function() {
                let timeStr = this.startTime;
                timeStr = TimeUtil.format(timeStr, 'yyyy,MM,dd,HH,mm');
                $('#ds-start-time').unbind().timepicker({ date: timeStr, format: 'yyyy-MM-dd HH:mm', secondLock: true, maxTime: 'ds-end-time'}).on({
                    'console.timepicker': (e) => {
                        this.startTime = TimeUtil.format(e.date, 'yyyy-MM-dd HH:mm');
                    }
                });
            },
            selectEndTime: function() {
                let timeStr = this.endTime;
                timeStr = TimeUtil.format(timeStr, 'yyyy,MM,dd,HH,mm');
                $('#ds-end-time').unbind().timepicker({ date: timeStr, format: 'yyyy-MM-dd HH:mm', secondLock: true, minTime: 'ds-start-time'}).on({
                    'console.timepicker': (e) => {
                        this.endTime = TimeUtil.format(e.date, 'yyyy-MM-dd HH:mm');
                    }
                });
            },
            selectPoint: function(siteId) {
                let index = this.siteIds.indexOf(siteId);
                if (index !== -1) {
                    this.siteIds.splice(index, 1);
                    this.unSiteIds.push(siteId);
                } else {
                    this.siteIds.push(siteId);
                    let tempIndex = this.unSiteIds.indexOf(siteId);
                    this.unSiteIds.splice(tempIndex, 1);
                }
            },
            drawLayout: function() {
                if (this.layoutTimer) {
                    window.clearTimeout(this.layoutTimer);
                }
                this.layoutTimer = window.setTimeout(() => {
                    if (!this.GEOMSTR) {
                        this.loading = false;
                        let reqData = this.getReqData();
                        reqData.STATIONSTATE = 'none';
                        lmap.image.updateImageWMS(this.WMS, reqData);
                        return;
                    }
                    let reqData = this.getReqData();
                    reqData.GEOMSTR = '';
                    lmap.image.updateImageWMS(this.WMS, reqData);
                }, 10);
            },
            getReqData: function() {
                let reqData = {
                    'FONTFAMILYVAL': this.fontFamilyVal,
                    'STATIONSTATE': this.stationState,
                    'IDS': this.ids,
                    'LEVEL': this.level,
                    'STARTTIME': this.startTime,
                    'ENDTIME': this.endTime,
                    'FONTSIZE': this.fontSize,
                    'POINTSIZE': this.pointSize + '',
                    'POINTCOLOR': this.pointColor,
                    'FONTCOLOR': this.fontColor,
                    'RANDOM': this.RANDOM ? this.RANDOM : 0,
                    'GEOMSTR': this.getAllWKT(),
                    'BBOX': lmap.getExtent(this.map).join(','),
                    'LAYERS': 'assistTools',
                    'AREACODE': this.code,
                    'SITENAMESTATUS': this.siteNameStatus
                };
                return reqData;
            },
            setReqData: function(data) {
                this.fontFamilyVal = data.FONTFAMILYVAL;
                this.stationState = data.STATIONSTATE;
                this.ids = data.IDS;
                this.level = data.LEVEL;
                this.startTime = data.STARTTIME;
                this.endTime = data.ENDTIME;
                this.fontSize = data.FONTSIZE;
                this.pointSize = data.POINTSIZE;
                this.pointColor = data.POINTCOLOR;
                this.fontColor = data.FONTCOLOR;
                this.siteNameStatus = data.SITENAMESTATUS;
            },
            getList: function() {
                this.isCases = false;
                this.GEOMSTR = this.getAllWKT();
                this.siteItems = [];
                this.unSiteIds = [];
                this.nodata = false;
                if (!this.GEOMSTR) {
                    this.loading = false;
                    let reqData = this.getReqData();
                    reqData.STATIONSTATE = 'none';
                    lmap.image.updateImageWMS(this.WMS, reqData);
                    return;
                }
                this.loading = true;
                this.STATIONSTATE = 'all';
                this.IDS = '';
                this.LAYERS = 'assistToolsData';
                this.BBOX = lmap.getExtent(this.map).join(',');
                this.RANDOM = (Math.random() + '').replace('0.', '');
                let reqData = {
                    LAYERS: 'assistToolsData',
                    STATIONSTATE: 'all',
                    IDS: '',
                    GEOMSTR: this.GEOMSTR,
                    BBOX: this.BBOX,
                    RANDOM: this.RANDOM
                };
                let tempData = this.getReqData();
                reqData = $.extend(tempData, reqData);
                $.ajax({
                    url: this.dss+'/gis/gis!map.action',
                    dataType: 'json',
                    type: 'POST',
                    data: reqData,
                    success: (json) => {
                        this.loading = false;
                        if (!json[0]) {
                            this.nodata = true;
                        }
                        let tempSiteIds = [];
                        json.forEach((data) => {
                            tempSiteIds.push(data.siteId);
                        });
                        this.allSiteIds = tempSiteIds;
                        this.siteIds = tempSiteIds.slice(0);
                        this.siteItems = json;
                        this.drawLayout();
                    }
                });
            },

            // 画笔工具
            initDraw: function(type) {
                this.cancel();
                if (type === 'circlePoint') {
                    this.drawHander = lmap.draw[type](this.drawParam, this.drawStartEvt, this.drawEndEvt);
                } else {
                    this.drawHander = lmap.draw[type](this.drawParam, this.callback);
                }
            },

            // 画笔结束回调函数
            callback: function(type, feature) {
                if (type == 'text') {

                } else {
                    let style = {
                        fill: this.pointColorVal,
                        fillOpacity: 0.2,
                        strokeColor: '#000000',
                        strokeWidth: 1,
                        anchor: [16, 16],
                        iconSize: [32, 32],
                        outWidth: 1,
                        offsetY: 0,
                        offsetX: 0
                    };
                    feature.set('name', type);
                    feature.set('style', style);
                    window.setTimeout(() => {
                        this.getList();
                    }, 50);
                }
            },

            // 获取所画图层所有的wkt数据
            getAllWKT: function() {
                let str = '';
                let feats = lmap.draw.getFeatures(this.layer);
                feats.forEach((it) => {
                    let type = it.get('name');
                    if (type == 'Circle') {
                        str += lmap.draw.getCircleWkt(lmap.draw.getCircle(it)) + '#';
                    } else if (type === 'scene') {
                        str += lmap.draw.getWkt(it) + '_';
                    } else {
                        str += lmap.draw.getWkt(it) + '#';
                    }
                });
                return str;
            },

            // 取消画图状态
            cancel: function() {
                if (!!this.drawHander) {
                    lmap.draw.cancel(this.map, this.drawHander);
                }
            },

            // 撤消上一次画图
            undo: function() {
                lmap.draw.undo(this.layer);
                let feats = lmap.draw.getFeatures(this.layer);
                if (feats[feats.length - 1] && feats[feats.length - 1].get('name') === 'scene') {
                    lmap.draw.undo(this.layer);
                }
                this.getList();
            },

            // 清除所有
            clear: function() {
                lmap.draw.clear(this.layer);
                this.getList();
                this.siteItems = [];
                this.unSiteIds = [];
            },

            drawStartEvt: function(feature) {
                let style = {
                    anchor: [10, 0],
                    iconUrl: 'http://10.148.16.56/topic/little/decideserve/P' + this.pointColor + '.png',
                    iconSize: [20, 30],
                    fontColor: 'red',
                    fontSize: '12px',
                    outColor: 'white',
                    outWidth: 3,
                    text: '事故发生地点',
                    offsetY: 10,
                    offsetX: 0
                };
                this.sceneStyle = style;
                let center = feature.getGeometry().getCenter();
                let lonlat = lmap.transform([center[0], center[1]], true);
                let point = lmap.icon.addIcon(this.layer, style, lonlat[0], lonlat[1], 'scene');
                point.set('style', style);

                let distanceEl = document.createElement('div');
                distanceEl.className = 'tooltip hidden';
                let distanceElTip = new ol.Overlay({
                    element: distanceEl,
                    offset: [15, 0],
                    positioning: 'center-left'
                });
                this.distanceObj = {
                    el: distanceEl,
                    overlay: distanceElTip
                };
                this.map.addOverlay(distanceElTip);
                this.map.on('pointermove', this.moveHandler);
                this.map.on('singleclick', this.scenePointEvt);

                this.disListener = feature.getGeometry().on('change', (evt) => {
                    let geom = evt.target;
                    let output = lmap.draw.formatLength(geom.getRadius());
                    this.distanceObj.el.innerHTML = output;
                });

            },
            drawEndEvt: function(type, feature) {
                let style = {
                    fill: this.pointColorVal,
                    fillOpacity: 0.2,
                    strokeColor: '#27303F',
                    strokeWidth: 1,
                };
                feature.set('name', type);
                feature.set('style', style);
                this.map.removeOverlay(this.distanceObj.overlay);
                ol.Observable.unByKey(this.disListener);
                this.map.un('pointermove', this.moveHandler);
                window.setTimeout(() => {
                    this.getList();
                }, 50);
            },

            moveHandler: function(evt) {
                if (evt.dragging) return;
                this.distanceObj.overlay.setPosition(evt.coordinate);
                this.distanceObj.el.classList.remove('hidden');
            },

            scenePointEvt: function(evt) {
                let feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                    return feature;
                });
                if (!!feature) {
                    let type = feature.get('name');
                    if (type == 'scene') {
                        let overlay = feature.get('overlay');
                        if (!overlay) {
                            let lastFeature = this.lastFeature;
                            if (lastFeature && lastFeature.get('overlay')) {
                                this.map.removeOverlay(lastFeature.get('overlay'));
                                $('div[name="sceneDiv"]').remove();
                                lastFeature.set('overlay', undefined);
                            }
                            this.changeSceneName(feature);
                        } else {
                            this.map.removeOverlay(overlay);
                            $('div[name="sceneDiv"]').remove();
                            feature.set('overlay', undefined);
                        }
                    }
                }
            },

            changeSceneName: function(feature) {
                let $nameEl = $('<div name="sceneDiv" class="sceneName"><input name="sceneName" type="text" value="" placeholder="编辑文字"><input name="confirm" type="button" value="确定"/><input name="close" type="button" value="关闭"/></div>');
                let nameTip = new ol.Overlay({
                    element: $nameEl[0],
                    offset: [-32, 32],
                    positioning: 'center-left'
                });
                $nameEl.find('[name="confirm"]').click(() => {
                    let sceneName = $nameEl.find('[name="sceneName"]').val();
                    let tempStyle = $.extend({}, feature.get('style'));
                    if (sceneName) {
                        tempStyle.text = sceneName;
                    }
                    lmap.icon.setStyle(feature, tempStyle);
                    feature.set('style', tempStyle);
                    this.map.removeOverlay(this.nameTip);
                    $('div[name="sceneDiv"]').remove();
                    feature.set('overlay', undefined);
                });
                $nameEl.find('[name="close"]').click(() => {
                    this.map.removeOverlay(this.nameTip);
                    $('div[name="sceneDiv"]').remove();
                    feature.set('overlay', undefined);
                });
                nameTip.setPosition(feature.getGeometry().getFirstCoordinate());
                this.map.addOverlay(nameTip);
                feature.set('overlay', nameTip);
                this.lastFeature = feature;
            },

            selectCases: function(id) {
                lmap.draw.clear(this.layer);
                $.ajax({
                    url: this.dss_sj+'/gd_decision/decision!getDecisionData.action',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        id: id
                    },
                    success: (json) => {
                        let features = JSON.parse(json.layer_ele);
                        features.forEach((feature) => {
                            if (feature.name !== 'Circle' && feature.name !== 'map') {
                                lmap.polygon.addFeatureFromWkt(this.layer, feature.wkt, feature.style, feature.name);
                            } else if (feature.name === 'Circle') {
                                let lonlat = feature.center;
                                lmap.polygon.addFeatureFromCircle(this.layer, lonlat[0], lonlat[1], feature.radius, feature.style, feature.name);
                            }
                        });
                        let reqData = JSON.parse(json.param);
                        this.setReqData(reqData);
                        this.getList();
                    }
                });

            },

            getCasesList: function() {
                $.ajax({
                    url: this.dss_sj+'/gd_decision/decision!getDecision.action',
                    type: 'GET',
                    dataType: 'json',
                    success: (json) => {
                        this.casesItems = json;
                    }
                });
            },

            saveCases: function() {
                let casesName = this.casesName;
                if (!casesName) {
                    return;
                }
                let el = '';
                let feats = lmap.draw.getFeatures(this.layer);
                let arr = [];
                feats.forEach((it) => {
                    let type = it.get('name');
                    let style = it.get('style');
                    let obj = {};
                    obj['style'] = style;
                    obj['name'] = type;
                    if (type == 'Circle') {
                        let circle = lmap.draw.getCircle(it);
                        obj['center'] = circle.center;
                        obj['radius'] = circle.radius;
                    } else {
                        let wkt = lmap.draw.getWkt(it);
                        obj['wkt'] = wkt;
                    }
                    arr.push(obj);
                });
                let mapObj = {};
                mapObj['name'] = 'map';
                mapObj['zoom'] = this.map.getView().getZoom();
                mapObj['center'] = this.map.getView().getCenter();
                mapObj['mapType'] = this.mapType;
                arr.push(mapObj);
                let str = JSON.stringify(arr);
                let reqData = this.getReqData();
                reqData.GEOMSTR = '';
                reqData = JSON.stringify(reqData);
                $.ajax({
                    url: this.dss_sj+'/gd_decision/decision!save.action',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        areaCode: this.code,
                        layer: str,
                        casesName: casesName,
                        id: -1,
                        reqData: reqData
                    },
                    success: function(json) {

                    }
                });
            },
            modifyEvt: function() {
                this.getList();
            }
        },
        ready: function() {
            let date = new Date();
            this.startTime = TimeUtil.format(TimeUtil.addTime(date, -3, 'HH'), 'yyyy-MM-dd HH:mm');
            this.endTime = TimeUtil.format(date, 'yyyy-MM-dd HH:mm');
            let that = this;
            $('#marker-slider').slider({
                step: 5,
                min: 5,
                max: 100,
                value: 50,
                slide: function(event, ui) {
                    that.sliderText = '缩放：' + ui.value + '%';
                    that.pointSize = ui.value;
                    that.drawLayout();
                }
            });
            let drawParam = lmap.draw.initDrawParam(this.map, 'draw');

            this.drawParam = drawParam;
            this.layer = drawParam.layer;

            let imageParam = {
                'opacity': 1,
                'url': this.dss+'/gd_image/image!loadDecisionServeWMS.action',
                'name': 'assistTools',
                'params': this.getReqData()
            }
            this.WMS = lmap.image.loadImageWMS(this.map, imageParam, 'drawImpact');
        },
        detached: function() {
            lmap.draw.cancel(this.map, this.drawHander);
            lmap.draw.cancel(this.map, this.modify);
            this.map.removeLayer(this.layer);
            this.map.removeLayer(this.WMS);
            this.map.un('singleclick', this.scenePointEvt);
            delete this.WMS;
            delete this.layer;
            delete this.drawHander;
        }
    }
</script>

<style scoped lang='less'>
@import '../../../util/timepicker/timepicker.css';
@import "../../../assets/css/common.less";

.toolPop {
    position: absolute;
    top: 30px;
    right: 0px;
    width: 417px;
    height: auto;
    background-color: #fff;
    z-index: 4;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
div.decideSelect {
    float: left;
    width: 120px;
    margin-right: 10px;
}
div.decide-serve .tools {
    height: 30px;
    margin: 3px 3px -3px 3px;
    position: relative;
    width: auto;
    right: inherit;
}
.tools ul li {
    float: left;
}
.tools ul li[type="tools"] {
    width: 24px;
    height: 24px;
    margin-right: 5px;
    -webkit-background-size: 100% 100% !important;
    background-size: 100% 100% !important;
}
.levels {
    height: auto;
    overflow: hidden;
    padding: 4px;
    text-align: left;

    a {
        margin-right: 10px;

        input {
            width: 16px;
            height: 16px;
            vertical-align: middle;
            margin-top: -1px;
        }
    }
}
.times {
    height: auto;
    line-height: 22px;
    overflow: hidden;
    padding: 4px;
    text-align: left;

    input {
        background: #ecf2fc;
        border: 1px solid #ccc;
        height: 19px;
        padding-left: 2px;
        cursor: pointer;
        width: 138px;
        color: @colorH;
    }
    a {
        display: inline-block;
        height: 22px;
        line-height: 22px;
        padding: 0px 3px;
        cursor: pointer;
        border: 1px solid #ccc;
    }
    a:hover {
        background: #ecf2fc;
    }
}
.decideServeColor {
    border-top: 1px solid #E5E8EC;
    width: auto;
    height: 34px;
    padding: 8px 2px 3px 2px;
    text-align: left;
}
.unfold, .fold {
    float: right;
    width: 16px;
    height: 12px;
    height: 22px;
    border: 1px solid #D6D6D6;
    position: relative;
    cursor: pointer;
    background-color: -webkit-linear-gradient(#FEFEFE, #EEEEEE);
    background-color: -o-linear-gradient(#FEFEFE, #EEEEEE);
    background-color: -moz-linear-gradient(#FEFEFE, #EEEEEE);
    background-color: linear-gradient(#FEFEFE, #EEEEEE);
}
.unfold {
    background: url("../../../assets/img/econtrol/up.png") no-repeat center center;
}
.fold {
    background: url("../../../assets/img/econtrol/down.png") no-repeat center center;
}
.font-panel, .marker-panel {
    display: inline-block;
    float: left;
}
.font, .marker-01, .marker-02, .marker-03, .marker-04, .marker-05, .marker-06, .marker-07, .marker-08, .marker-09, .marker-10, .marker-11, .marker-12, .marker-13, .marker-14, .marker-15, .marker-16 {
    display: inline-block;
    width: 36px;
    height: 34px;
    float: left;
}
.font {
    background: url("../../../assets/img/common/A.png") no-repeat center center;
}
.marker-01 {
    background: url("../../../assets/img/decideserve/P01.png") no-repeat center center;
}
.marker-02 {
    background: url("../../../assets/img/decideserve/P02.png") no-repeat center center;
}
.marker-03 {
    background: url("../../../assets/img/decideserve/P03.png") no-repeat center center
}
.marker-04 {
    background: url("../../../assets/img/decideserve/P04.png") no-repeat center center;
}
.marker-05 {
    background: url("../../../assets/img/decideserve/P05.png") no-repeat center center;
}
.marker-06 {
    background: url("../../../assets/img/decideserve/P06.png") no-repeat center center;
}
.marker-07 {
    background: url("../../../assets/img/decideserve/P07.png") no-repeat center center;
}
.marker-08 {
    background: url("../../../assets/img/decideserve/P08.png") no-repeat center center;
}
.marker-09 {
    background: url("../../../assets/img/decideserve/P09.png") no-repeat center center
}
.marker-10 {
    background: url("../../../assets/img/decideserve/P10.png") no-repeat center center;
}
.marker-11 {
    background: url("../../../assets/img/decideserve/P11.png") no-repeat center center;
}
.marker-12 {
    background: url("../../../assets/img/decideserve/P12.png") no-repeat center center;
}
.marker-13 {
    background: url("../../../assets/img/decideserve/P13.png") no-repeat center center;
}
.marker-14 {
    background: url("../../../assets/img/decideserve/P14.png") no-repeat center center;
}
.marker-15 {
    background: url("../../../assets/img/decideserve/P15.png") no-repeat center center;
}
.marker-16 {
    background: url("../../../assets/img/decideserve/P16.png") no-repeat center center;
}
.font-color, .marker-color {
    display: inline-block;
    width: 30px;
    height: 30px;
    float: left;
    cursor: pointer;
}
.fontSizeInput {
    border: 1px solid #dadada;
    width: 28px;
    display: inline-block;
    margin: 0px 3px 0;
    float: left;
    height: 25px;
}
div.fontF {
    width: 45px;
    height: 27px;
    line-height: 27px;
    float: left;
}
.slider-text {
    width: 100%;
    text-align: center;
    display: block;
}
.slider {
    margin-left: 5px;
    float: left;
}
.marker-slider {
    width: 140px;
    display: inline-block;
    height: 6px;
}
.color span {
    display: inline-block;
    width: 24px;
    height: 30px;
}
.font-panel input {
    width: 20px;
}
.color-panel {
    display: inline-block;
    float: left;
}
.color-panel ul {
    width: 120px;
}
.color-panel ul li {
    display: inline-block;
    width: 13px;
    height: 13px;
    border: 1px solid #eee;
    float: left;
}
.line {
    width: 1px;
    height: 24px;
    border-left: 1px solid #d8d8d8;
    margin-left: 2px;
    margin-right: 5px;
}
.black {
    background-color: rgb(0, 0, 0);
}
.dark-gray {
    background-color: rgb(111, 112, 107);
}
.drak-red {
    background-color: rgb(111, 24, 14);
}
.orange {
    background-color: rgb(242, 136, 55);
}
.dark-green {
    background-color: rgb(38, 109, 40);
}
.deep-blue {
    background-color: rgb(14, 55, 184);
}
.deep-purple {
    background-color: rgb(109, 11, 98);
}
.dark-cyan {
    background-color: rgb(19, 128, 127);
}
.white {
    background-color: rgb(255, 255, 255);
}
.gray {
    background-color: rgb(179, 181, 174);
}
.tomato {
    background-color: rgb(237, 63, 43);
}
.khaki {
    background-color: rgb(235, 222, 55);
}
.lime-green {
    background-color: rgb(150, 193, 48);
}
.royal-blue {
    background-color: rgb(10, 120, 200);
}
.orchid {
    background-color: rgb(213, 35, 200);
}
.turquoise {
    background-color: rgb(26, 193, 202);
}
.circle {
    background: url("../../../assets/img/econtrol/circle.png") no-repeat center center;
}
.s-circle {
    background: url("../../../assets/img/econtrol/s-circle.png") no-repeat center center;
}
.rectangel {
    background: url("../../../assets/img/econtrol/rectangel.png") no-repeat center center;
}
.s-rectangel {
    background: url("../../../assets/img/econtrol/s-rectangel.png") no-repeat center center;
}
.polygon {
    background: url("../../../assets/img/econtrol/quan.png") no-repeat center center;
}
.s-polygon {
    background: url("../../../assets/img/econtrol/s-quan.png") no-repeat center center;
}
.undo {
    background: url("../../../assets/img/econtrol/undo.png") no-repeat center center;
}
.s-undo {
    background: url("../../../assets/img/econtrol/undo.png") no-repeat center center;
}
.delete {
    background: url("../../../assets/img/econtrol/delete.png") no-repeat center center;
}
.s-delete {
    background: url("../../../assets/img/econtrol/delete.png") no-repeat center center;
}
.close {
    background: url("../../../assets/img/econtrol/close.png") no-repeat center center;
}
.s-close {
    background: url("../../../assets/img/econtrol/close.png") no-repeat center center;
}
.arrow {
    background: url("../../../assets/img/econtrol/arrow.png") no-repeat center center;
}
.s-arrow {
    background: url("../../../assets/img/econtrol/s-arrow.png") no-repeat center center;
}
.point {
    background: url("../../../assets/img/econtrol/point.png") no-repeat center center;
}
.s-point {
    background: url("../../../assets/img/econtrol/s-point.png") no-repeat center center;
}
.save {
    background: url("../../../assets/img/econtrol/save.png") no-repeat center center;
}
.s-save {
    background: url("../../../assets/img/econtrol/save.png") no-repeat center center;
}
.cases {
    background: url("../../../assets/img/econtrol/plan.png") no-repeat center center;
}
.s-cases {
    background: url("../../../assets/img/econtrol/save.png") no-repeat center center;
}
.serverTable {
    width: 100%;
    height: auto;
    overflow: hidden;
    margin-top: 5px;
    margin-bottom: -1px;

    table {
        table-layout: fixed;
        width: 100%;
        background: #fff;

        thead {
            background: @bg;
            display: block;
        }
        tbody {
            overflow-y: scroll;
            overflow-x: hidden;
            display: block;
            height: 134px;
            width: 100%;
            border-bottom: 1px solid #E5E8EC;

            tr:hover {
                background: @bg;
                cursor: pointer;
            }
        }
        td {
            border: 0;
            height: 22px;
            line-height: 22px;
            text-align: center;
            width: 60px;
            vertical-align: middle;
            border-bottom: 1px solid #E5E8EC;
            border-right: 1px solid #E5E8EC;

            input {
                width: 16px;
                height: 16px;
            }
        }
        td:first-child {
            width: 30px
        }
        td:nth-child(2) {
            width: 154px
        }
        td:nth-child(5) {
            width: 80px
        }
    }
}
.casesList {
    width: 100%;
    height: auto;
    overflow: hidden;
    margin-top: 5px;
    margin-bottom: -1px;

    table {
        table-layout: fixed;
        width: 100%;
        background: #fff;

        thead {
            background: @bg;
            display: block;
            table-layout: fixed;
        }
        tbody {
            table-layout: fixed;
            overflow-y: scroll;
            overflow-x: hidden;
            display: block;
            height: 134px;
            width: 100%;
            border-bottom: 1px solid #E5E8EC;

            tr:hover {
                background: @bg;
                cursor: pointer;
            }
        }
        td {
            border: 0;
            height: 22px;
            line-height: 22px;
            text-align: center;
            width: 60px;
            vertical-align: middle;
            border-bottom: 1px solid #E5E8EC;
            border-right: 1px solid #E5E8EC;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        td:nth-child(2) {
            width: 330px
        }
    }
}
.casesDiv {
    position: absolute;
    overflow: hidden;
    right: 0px;
    z-index: 4;
    background: #fff;
    padding: 0 3px 3px 3px;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);

    .casesName {
        width: 120px;
        border: 1px solid #ccc;
        height: 16px;
    }
}
.siteName {
    display: inline-block;

    .site-checkbox+label {
        height: 27px;
        line-height: 27px;
        margin-left: 5px;
    }
}

/*big*/
.big .toolPop {
    width: 600px;
    top: 45px;
}
.big div.decide-serve .tools {
    height: 38px;

    div.decideSelect {
        width: 195px
    }
    li[type="tools"] {
        width: 30px;
        height: 31px;
        margin-right: 10px;
        -webkit-background-size: 30px !important;
        -moz-background-size: 30px !important;
        background-size: 30px !important;
    }
    .fold, .unfold {
        width: 25px;
        height: 29px;
        -webkit-background-size: 126% auto !important;
        background-size: 126% auto !important;
    }
    .line {
        height: 30px;
        margin-right: 9px
    }
}
.big .times {
    line-height: 30px;

    input {
        height: 30px;
        padding-left: 5px;
        font-size: 20px;
        width: 195px;
    }
    a {
        height: 30px;
        line-height: 30px;
        padding: 0px 5px;
    }
}
.big .decideServeColor {
    height: 44px;

    .font {
        width: 68px;
        height: 40px;
    }
    .font-color {
        width: 40px;
        height: 40px;
    }
    .color-panel ul {
        width: 160px;

        li {
            width: 18px;
            height: 18px;
        }
    }
    .font-panel input {
        width: 34px;
        height: 35px;
        font-size: 20px;
    }
    div.fontF {
        width: 80px;
        height: 37px;
        line-height: 37px;
    }
    div.fontF:after {
        top: 17px
    }
    .marker-panel span {
        width: 44px;
        height: 40px;
    }
    .marker-panel .marker-color {
        width: 40px;
        height: 40px;
    }
    .marker-panel span.slider-text {
        width: 100%;
        height: 22px;
        margin-top: -5px;
    }
    .slider {
        height: 40px;
    }
    .marker-slider {
        height: 8px;
        width: 230px
    }
}
.big .serverTable {
    table {
        tbody {
            height: 288px;
        }
        td {
            height: 30px;
            line-height: 30px;
            width: 80px;
        }
        td:first-child {
            width: 30px
        }
        td:nth-child(2) {
            width: 220px
        }
        td:nth-child(5) {
            width: 160px
        }
    }
}
.big .siteName {
    .site-checkbox+label {
        height: 37px;
        line-height: 37px;
    }
}
.big .casesList {
    table {
        tbody {
            height: 200px;
        }
        td {
            height: 32px;
            line-height: 32px;
            width: 80px;
        }
        td:nth-child(2) {
            width: 490px
        }
    }
}
.big .casesDiv .casesName {
    height: 24px;
    width: 200px;
}
</style>