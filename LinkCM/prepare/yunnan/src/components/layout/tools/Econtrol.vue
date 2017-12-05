<!--应急指挥工具-->
<template>
    <div class="toolPop" v-el:econtrol>
        <div class="e-items">
            <ul>
                <template v-for="item in list">
                    <li @click="selectButton($key)">
                        <div :class="item.co" title={{item.name}}></div>
                    </li>
                </template>
                <li><div class="drag" v-el:move-btn></div></li>
            </ul>
            
        </div>
        <div class="color-panel" v-if="colorStatus==true">
            <div class="color-size">
                <ul>
                    <template v-for="item in sizes">
                        <li @click="exSize($key)" :class="item"><div :class="$key"></div></li>
                    </template>
                </ul>
            </div>
            <div class="color-choose">
                <div class="background-color" :style="{backgroundColor:selectColor}"></div>
                <div class="choose-list">
                    <ul>
                        <template v-for="co in colors">
                            <li :style="{backgroundColor:co}" @click="exColor(co)"></li>
                        </template>
                    </ul>
                </div>
            </div>
        </div>
        <div class="save-panel" v-if="saveStatus==true">
            <input class="font-text" type="text" value="{{saveContent}}" v-model="saveContent" @focus="onfocus">
            <button @click="save" class="btnhover">保存</button>
        </div>
        <div class="auto-panel" v-if="autoStatus==true">
            <!--<select v-model="autoDefault">
                <option v-for="item in autoList" :value="item.value">{{ item.name }}</option>
            </select>-->
            <v-select :defname="'autoDefault'" :def="autoDefault" :initvalue="autoList[0].text" :list="autoList"></v-select>
        </div>
        <!--灾害导航详情窗口-->
        <div class="auto-detail" v-if="autoDetailStat==true">
            <div class="title nullbg auto-detail-title">
                路线始点：{{ autoData.sourceName }}
                <label style="float:right;margin-right: 10px;color:red;" @click="closeAuto()">x</label>
            </div>
            <div class="roadInfor">
                <ul>
                    <li v-for="it in autoData.targetInfo">
                        <div>路线{{ $key }}</div>
                        <div class="endRoad">
                            <span>{{ it.targetName }}</span>
                        </div>
                        <ul>
                            <li><img src="../../../assets/img/common/car.png" />{{ it.time }}</li>
                            <li>{{ it.distance }}</li>
                            <li>途径:{{ it.address }}</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import lmap from '../../../util/lmap/lmap'
    import config from '../../../config'
    import { updateParam } from '../../../vuex/store'
    import WinDrag from 'util/tools/WinDrag'
    import Select from '../../common/Select'

    export default {
        components: { 'v-select': Select },
        vuex: {
            getters: {
                dss: state => state.dss,
                code: state => state.cityCode,
                commandId: state => state.econtrol.commandId,
                mapType: state => state.map.mapType
            },
            actions: { updateParam }
        },
        data() {
            return {
                map: config.getParam('map'),
                list: {
                    point: { name: '标注', co: { 's-point': false, 'point': true } },
                    dyString: { name: '动态线', co: { 's-dyString': false, 'dyString': true } },
                    text: { name: '文字', co: { 's-text': false, 'text': true } },
                    arrow: { name: '箭头', co: { 's-arrow': false, 'arrow': true } },
                    circle: { name: '画圆', co: { 's-circle': false, 'circle': true } },
                    box: { name: '画矩形', co: { 's-box': false, 'box': true } },
                    freePolygon: { name: '画任意面', co: { 's-freePolygon': false, 'freePolygon': true } },
                    freeLine: { name: '画任意线', co: { 's-freeLine': false, 'freeLine': true } },
                    auto: { name: '自动导航', co: { 's-auto': false, 'auto': true } },
                    undo: { name: '撤销', co: { 's-undo': false, 'undo': true } },
                    delete: { name: '删除', co: { 's-delete': false, 'delete': true } },
                    save: { name: '保存', co: { 's-save': false, 'save': true } },
                    close: { name: '关闭', co: { 's-close': false, 'close': true } }
                },
                sizes: {
                    'o-size': { 'size-c': true },
                    't-size': { 'size-c': false },
                    'td-size': { 'size-c': false }
                },
                colors: ['#000000', '#6F706B', '#6F180E', '#F28837', '#266D28', '#0E37B8', '#6D0B62', '#13807F', '#FFFFFF', '#B3B5AE', '#ED3F2B', '#EBDE37', '#96C130', '#0A78C8', '#D523C8', '#1AC1CA'],
                selectColor: '#ED3F2B',
                selectSize: 'o-size',
                saveContent: '请输入预案名',
                saveStatus: false,
                autoDefault: 'SJZX_KEYPLACE_REFUGES',
                autoList: [
                    { text: '导航至:避难点', value: 'SJZX_KEYPLACE_REFUGES' }, 
                    { text: '导航至:医院', value: 'MEDICAL_HOSPITAL' }, 
                    { text: '导航至:学校', value: 'EDUCATION_SCHOOL' }
                ],
                autoStatus: false,
                autoData: null, // 自动导航的结果
                autoDetailStat: false, // 自动导航结果详情窗口
                autoLayer: null, // 自动导航layer
                autoTimeout: false, // 导航动态线状态
                autoFeature: null, // 导航灾害定点feature
                popup: null, // 文本弹出窗口
                popupFeature: null,
                timeoutArr: [] // 导航动态线定时器记录
            }
        },
        computed: {
            colorStatus: function() {
                let list = this.list;
                let status = false;
                let arr = ['auto', 'save', 'close'];
                for (let key in list) {
                    if (!list[key].co[key] && ($.inArray(key, arr) == -1)) {
                        status = true;
                    }
                }
                return status;
            },
            selectSize: function() {
                let list = this.sizes;
                let result = '';
                for (let key in list) {
                    if (list[key]['size-c']) result = key;
                }
                return result;
            }
        },
        watch: {
            autoDefault: function() { //导航下拉框变化
                if (!!this.autoLayer) {
                    lmap.draw.clear(this.autoLayer); //清理导航图层图层
                }
                this.getAutoData();
            },
            commandId: function() { //用于还原预案
                if (this.commandId != '') {
                    this.restore();
                } else {
                    this.updateParam('econtrol', 'status', false)
                }
            }
        },
        methods: {
            selectButton: function(type) {
                // this.clearPop(); // 清除添加文本面板
                // return 不取消选色面板
                if (type == 'undo') {
                    this.clearPop();
                    this.undo(); // 撤消
                    return;
                }
                if (type == 'delete') {
                    this.clear(); // 清除所有
                    return;
                }

                if (type == 'close') {
                    this.updateParam('econtrol', 'status', false);
                    this.$parent.list.econtrol.stat = false;
                    return;
                } else if (type == 'save') {
                    let stat = true;
                    this.saveContent = '请输入预案名';
                    if (this.saveStatus) stat = false;
                    this.saveStatus = stat;
                    return;
                }

                // 改变其他项状态
                let list = this.list;
                let newItem = 's-' + type;
                for (let key in list) {
                    if (key != type) {
                        let tempItem = 's-' + key;
                        let temobj = {};
                        temobj[tempItem] = false;
                        temobj[key] = true;
                        if (list[key].co[tempItem]) {
                            list[key].co = temobj;
                        }
                    }
                }
                let obj = {};
                obj[newItem] = true;
                obj[type] = false;
                let initArr = ['auto', 'undo', 'delete', 'save', 'close'];
                if (initArr.indexOf(type) == -1) { // 这几种类型不需要画笔
                    this.clearAuto(); // 清除导航结果
                    this.initDraw(type); // 画笔
                    // lmap.draw.setPenStyle(this.drawHander,this.getPanStyle(type));
                }
                if (this.list[type].co[newItem]) {
                    obj[newItem] = false;
                    obj[type] = true;
                    this.cancel(); // 取消画笔状态
                    if (type == 'text') {
                        this.clearPop();
                    }
                }
                this.list[type].co = obj;
                if (type == 'auto') {
                    let stat = true;
                    if (this.autoStatus) {
                        stat = false;
                        this.autoDetailStat = false;
                    }

                    this.autoStatus = stat;
                    if (stat) this.initDraw(type); // 画笔
                    else this.cancel(); // 取消画笔状态
                    return;
                }
            },
            // 选择颜色
            exColor: function(color) {
                this.selectColor = color;
            },
            // 选择大小
            exSize: function(type) {
                let status = true;
                let list = this.sizes;
                this.selectSize = type;
                for (let key in list) {
                    if (key != type) {
                        if (list[key]['size-c']) list[key]['size-c'] = false;
                    }
                }
                // if(this.sizes[type]['size-c']) status = false;
                this.sizes[type]['size-c'] = status;
            },
            onfocus: function() {
                this.saveContent = '';
            },
            // 保存预案
            save: function() {
                let str = this.getFeatureStyle();
                if (str.length == 0) return;
                if (this.saveContent != '请输入预案名' && this.saveContent != '') {
                    let url = this.dss+'/emergency/emergency!saveCommandInfo.action';
                    let qd = { areaCode: this.code, docName: this.saveContent, layerEle: str, commandId: -1 };
                    $.ajax({
                        url: url,
                        data: qd,
                        type: 'POST',
                        success: (bd) => {
                            if (!!bd) {
                                if (bd.status == 'success') {
                                    this.saveContent = '预案保存成功！';
                                    setTimeout(() => {
                                        this.saveStatus = false;
                                    }, 1000);
                                }
                            } else {
                                this.saveContent = '发生错误，请稍候重试。';
                            }
                        }
                    });
                }
            },
            // 使地图点击失效
            unClickMap: function() {
                this.updateParam('poi', 'unClick', true)
            },
            // 使地图恢复点击
            clickMap: function() {
                this.updateParam('poi', 'unClick', false)
            },
            // 初始画笔
            initDraw: function(type) {
                this.cancel();
                this.unClickMap();
                if (type == 'auto') {
                    let url = 'http://10.148.16.56/topic/little/toolbar/demage.png'
                    let style = { anchor: [12.5, 0], iconUrl: url, iconSize: [25, 41] };
                    this.drawHander = lmap.draw.point(this.drawParam, this.drawendCB, style, 'auto')
                } else {
                    this.drawHander = lmap.draw[type](this.drawParam, this.drawendCB);
                }
            },
            // 画笔结束回调函数
            drawendCB: function(type, feature) {
                if (type == 'text') {
                    this.clearPop(); // 先清除
                    this.popupFeature = feature;
                    this.popup = lmap.controler.addPopup(this.map, feature, this.popBack);
                } else if (type == 'auto') { // 获取灾害点导航数据
                    if (!!this.autoLayer) {
                        this.clearAutoFeature(); // 清理导航图层和layer图层
                    }
                    this.feature = feature;
                    this.getAutoData();
                }
                let style = this.getPanStyle(type);
                feature.set('name', type);
                feature.set('style', style);
                if (type == 'Circle') {
                    feature.set('conTip', this.drawHander.get('conTip'));
                }
            },
            // 获取灾害导航结果事件
            getAutoData: function() {
                let wkt = lmap.draw.getWkt(this.feature);
                wkt = wkt.replace('POINT(', '').replace(')', '').split(' ');
                let url = this.dss+'/gisInfo/gis-info!analysisPath.action';
                let qd = { 'targetType': this.autoDefault, 'lon': wkt[0], 'lat': wkt[1] };
                $.getJSON(url, qd, (bd) => {
                    this.autoData = bd;
                    this.drawAutoPath(); // 绘制导航路线
                })
            },
            // 画出自动导航路线结果
            drawAutoPath: function() {
                this.autoDetailStat = true;
                this.autoTimeout = true;
                let pathInfo = this.autoData.targetPath;
                for (let key in pathInfo) {
                    this.drawLine(pathInfo[key], 0, key)
                }
            },
            /**
             * @param data 路线数据
             * @param index 数组索引
             * @type A/B/C 类型
             */
            drawLine: function(data, index, type) {
                let call = setTimeout(() => {
                    if (this.autoTimeout) {
                        let style = { 'A': '#828DDD', 'B': '#FF6733', 'C': '#2B32D6'};
                        let sty = { strokeColor: style[type], strokeWidth: 4 };
                        lmap.polygon.draw.lineString(this.autoLayer, data[index], sty);
                        index++;
                        if (index < data.length) {
                            this.drawLine(data, index, type)
                        } else { // 画到最后加个类型点
                            this.drawIcon(type);
                        }
                    }
                }, 30);
                this.timeoutArr.push(call);
            },
            // 清除导航的drawIcon和autoLayer内容
            clearAutoFeature: function() {
                this.autoTimeout = false;
                let arr = this.timeoutArr;
                this.timeoutArr = [];
                lmap.draw.clearFeaturesByName(this.layer, 'auto');
                lmap.draw.clear(this.autoLayer);
                this.autoData = null;
            },
            /* 添加ic
             * @param type 路线类别
             */
            drawIcon: function(type) {
                let style = {
                    anchor: [10, 0],
                    iconUrl: 'http://10.148.16.56/topic/little/toolbar/' + type + '.png',
                    iconSize: [20, 20],
                    scale: 1
                }
                let targetPoint = this.autoData.targetPoint[type];
                lmap.icon.addIcon(this.autoLayer, style, targetPoint.lon, targetPoint.lat);
            },
            // 清除自动导航结果、窗口
            clearAuto: function() {
                this.autoStatus = false; // 去掉导航列表
            },
            // pop回调方法
            popBack: function(feature, text) {
                let size = { 'o-size': '30px', 't-size': '40px', 'td-size': '50px' };
                this.popupFeature = null;
                let style = {
                    fontColor: this.selectColor,
                    fontSize: size[this.selectSize],
                    text: text,
                    outWidth: 6
                };
                feature.set('style', style);
                lmap.draw.setFeatureStyle(feature, style);
            },
            // 清除Popup
            clearPop: function() {
                if (!!this.popup) {
                    this.map.removeOverlay(this.popup);
                    this.popup = null;
                }
                if (!!this.popupFeature) {
                    lmap.draw.clearFeature(this.layer, this.popupFeature);
                    this.popupFeature = null;
                }
            },
            // 获取所画图层所有的wkt数据
            getAllWkt: function() {
                let arr = [];
                let feats = lmap.draw.getFeatures(this.layer);
                feats.forEach((it) => {
                    let type = it.get('name');
                    if (type == 'Circle') getCircle(it, type);
                    else getWkt(it, type);
                });

                function getWkt(it, type) {
                    let obj = {};
                    obj.type = type;
                    obj.wkt = lmap.draw.getWkt(it);
                    arr.push(obj);
                }

                function getCircle(it, type) {
                    let obj = {};
                    obj.type = type;
                    obj.wkt = lmap.draw.getCircleWkt(lmap.draw.getCircle(it));
                    arr.push(obj);
                }
                return arr;
            },
            /* 获取图层数据样式
             * return json字符串
             */
            getFeatureStyle: function() {
                let source = this.layer.getSource();
                let features = source.getFeatures();
                let arr = [];
                // 取出layer内的对象样式
                for (let key in features) {
                    let obj = {};
                    let fea = features[key];
                    let wkt = '';
                    let name = fea.get('name');
                    if (name == 'Circle') {
                        wkt = lmap.draw.getCircle(fea);
                    } else {
                        wkt = lmap.draw.getWkt(fea);
                    }
                    obj['name'] = name;
                    obj['style'] = fea.get('style');
                    obj['wkt'] = wkt;
                    arr.push(obj);
                }
                if (!!this.autoData) {
                    let obj = {};
                    obj['name'] = 'autoData';
                    obj['data'] = this.autoData;
                    arr.push(obj);
                }
                let mapObj = {};
                mapObj['name'] = 'map';
                mapObj['zoom'] = this.map.getView().getZoom();
                mapObj['center'] = this.map.getView().getCenter();
                mapObj['mapType'] = this.mapType;
                arr.push(mapObj);
                let str = JSON.stringify(arr);
                return str;
            },
            // 取消画图状态
            cancel: function() {
                if (!!this.drawHander) {
                    lmap.draw.cancel(this.map, this.drawHander);
                }
                this.clickMap(); // 使地图恢复点击
            },
            // 撤消上一次画图
            undo: function() {
                lmap.draw.undo(this.layer, this.undoBack, this.map);
            },
            // 撤消回调
            undoBack: function(name) {
                if (name == 'auto') {
                    lmap.draw.clear(this.autoLayer);
                    this.autoData = null;
                }
            },
            // 清除所有
            clear: function() {
                lmap.draw.clear(this.layer, this.map);
                lmap.draw.clear(this.autoLayer);
                this.autoData = null;
            },
            // 获取不同类型的样式
            getPanStyle: function(type) {
                let nStyle = {};
                let size = { 'o-size': 1, 't-size': 3, 'td-size': 5 };
                type = type.toLowerCase();
                if (type == 'point' || type == 'text') {
                    nStyle['anchor'] = [23, 0];
                    nStyle['iconUrl'] = 'http://10.148.16.56/topic/little/econtrol/' + this.selectColor.replace('#', '') + '.png';
                    nStyle['iconSize'] = [46, 70];
                    let scale = 1;
                    let ssize = this.selectSize;
                    if (ssize == 'o-size') scale = 0.5;
                    else if (ssize == 't-size') scale = 0.8;
                    nStyle['scale'] = scale;
                } else if (type.indexOf('string') != -1) {
                    nStyle['strokeColor'] = this.selectColor;
                    nStyle['strokeWidth'] = size[this.selectSize];
                } else if (type == 'auto') {
                    nStyle['anchor'] = [12.5, 0];
                    nStyle['iconUrl'] = 'http://10.148.16.56/topic/little/toolbar/demage.png';
                    nStyle['iconSize'] = [25, 41];
                    nStyle['scale'] = 1;
                } else {
                    nStyle['fill'] = this.selectColor;
                    nStyle['fillOpacity'] = 0.2;
                    nStyle['strokeColor'] = '#27303F';
                    nStyle['strokeWidth'] = size[this.selectSize];
                }
                return nStyle;
            },
            // 还原预案图层
            restore: function() {
                this.clear();
                let url = this.dss+'/emergency/emergency!findCommandInfoByCommandId.action';
                let qd = { 'commandId': this.commandId };
                $.getJSON(url, qd, (bd) => {
                    let obj = JSON.parse(bd[0].layerEle);
                    for (let key in obj) {
                        let data = obj[key];
                        let name = data.name;
                        if (name == 'map') {
                            let view = map.getView();
                            view.setCenter([data.center[0], data.center[1]]);
                            view.setZoom(data.zoom);
                            lmap.switchMap(this.map, data.mapType);
                        } else if (name == 'Circle') {
                            let center = data.wkt.center;
                            lmap.polygon.addFeatureFromCircle(this.layer, center[0], center[1], data.wkt.radius, data.style, data.name);
                        } else if (name == 'autoData') {
                            this.autoData = data.data;
                            this.drawAutoPath(); // 绘制导航路线
                        } else if (name == 'text') {
                            lmap.polygon.addFeatureText(this.layer, data.wkt, data.style, data.name);
                        } else if (name == 'dyString') { // 组件动态线
                            // console.log(data.wkt)
                            this.drawDyString(data.wkt, data.style, data.name);
                        } else {
                            lmap.polygon.addFeatureFromWkt(this.layer, data.wkt, data.style, data.name);
                        }
                    }
                })
            },
            // 关闭自动导航详情窗口
            closeAuto: function() {
                this.autoDetailStat = false;
            },
            // 使窗口支持拖动功能
            addWinDragEvt: function(elName) {
                let call = setInterval(() => {
                    let winObj = this.$els[elName];
                    if (!!winObj) WinDrag.drag(winObj, this.$els.econtrol, this.map);
                    clearInterval(call);
                }, 10);
            },
            // 还原动态线
            drawDyString: function(wkt, style, name) {
                let nwkt = wkt.replace('LINESTRING(', '').replace(')', '');
                nwkt = nwkt.split(',')
                let lineArr = [];
                for (let i = 0; i < nwkt.length - 1; i++) {
                    let str = 'LINESTRING(' + nwkt[i] + ',' + nwkt[i + 1] + ')';
                    lineArr.push(str);
                }
                let features = [];
                this.addDyString(lineArr, 0, style, name, callBack, features);
                let _ele = this;
                function callBack(fes) { // 完成画线后的回调
                    let source = _ele.layer.getSource();
                    for (let key in fes) {
                        source.removeFeature(fes[key]);
                    }
                    lmap.polygon.addFeatureFromWkt(_ele.layer, wkt, style, name);
                }
            },
            addDyString: function(arr, index, style, name, callBack, features) {
                setTimeout(() => {
                    if (index < arr.length - 1) {
                        features.push(lmap.polygon.addFeatureFromWkt(this.layer, arr[index], style, name));
                        ++index;
                        this.addDyString(arr, index, style, name, callBack, features);
                    } else {
                        if (!!callBack)
                            callBack(features);
                    }
                }, 200)
            }
        },
        ready: function() {
            let drawParam = lmap.draw.initDrawParam(this.map, 'draw');
            this.drawParam = drawParam;
            this.layer = drawParam.layer;
            this.modify = lmap.draw.modify(drawParam);
            this.autoLayer = lmap.polygon.draw.init(this.map, 'draw');
            if (this.commandId != '') { // 还原预案图层
                this.restore();
            }
            this.addWinDragEvt('moveBtn');
        },
        detached: function() {
            lmap.draw.cancel(this.map, this.modify);
            lmap.draw.cancel(this.map, this.drawHander);
            this.map.removeLayer(this.layer);
            this.autoTimeout = false;
            if (this.autoLayer) this.map.removeLayer(this.autoLayer);
            this.updateParam('econtrol', 'commandId', '')
            this.clickMap();
        }
    }
</script>

<style scoped lang="less">
@import "../../../assets/css/common.less";

.toolPop {
    position: absolute;
    top: 30px;
    right: 135px;
    width: 438px;
    z-index: 4;
}
.e-items {
    width: auto;
    height: 30px;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    background-color: #fff;

    ul li {
        width: 26px;
        height: 26px;
        line-height: 26px;
        margin: 2px 3px;
        float: left;

        div {
            width: 26px;
            height: 26px;
            -webkit-background-size: 100% 100% !important;
            background-size: 100% 100% !important;
        }
    }
}
.color-panel {
    width: 250px;
    height: 34px;
    background-color: #fff;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
}
.color-size {
    width: 80px;
    height: 30px;
    float: left;

    ul li {
        width: 25px;
        height: 25px;
        line-height: 25px;
        float: left;

        div {
            width: 25px;
            height: 25px;
        }
    }
}
.color-choose {
    width: auto;
    height: 30px;
    float: left;

    .background-color {
        width: 32px;
        height: 32px;
        float: left;
    }
}
.choose-list {
    width: 136px;
    height: 34px;
    float: left;

    ul li {
        width: 15px;
        height: 15px;
        float: left;
        margin: 1px 1px;
    }
}
.save-panel {
    width: 166px;
    height: 34px;
    background-color: #fff;
    position: absolute;
    right: 0px;
    top: 30px;
    z-index: 3;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);

    input.font-text {
        width: 106px;
        margin-top: 4px;
    }
    button.btnhover {
        height: 25px;
        vertical-align: middle;
        margin-top: -4px;
    }
}
.auto-panel {
    position: absolute;
    right: 60px;
    z-index: 2;
}
.auto-detail {
    position: absolute;
    right: 0px;
    width: 100%;
    background-color: #fff;
    margin-top: 5px;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);

    .auto-detail-title {
        border-bottom: 1px solid @bg;
    }
    .roadInfor {
        margin: 0 5px;
        text-align: left;

        ul {
            width: 100%;

            li {
                list-style: none;
                margin: 6px 0;
                height: auto;
                overflow: hidden;
                border-bottom: 1px solid #ecf2fc;

                div {
                    float: left;
                    height: 24px;
                    line-height: 24px;
                    margin-right: 10px;
                }
                div:first-child::before {
                    height: 4px;
                    width: 30px;
                    margin: 10px;
                    float: right;
                    content: "";
                }
                div.endRoad {
                    width: 312px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    margin-right: 0;
                }
                ul {
                    width: 100%;
                    margin-right: 0;

                    li {
                        float: left;
                        text-align: left;
                        border-bottom: 0;
                        color: @color;

                        img {
                            vertical-align: middle;
                            margin-top: -2px;
                            margin-right: 10px;
                        }
                    }
                    li:before {
                        content: "";
                        width: 1px;
                        height: 12px;
                        background: #ccc;
                        margin: 3px 10px;
                        float: left;
                    }
                    li:first-child::before {
                        width: 0;
                        margin: 3px 5px;
                    }
                }
            }
            li:last-child {
                border-bottom: 0;
            }
            li:first-child div:first-child::before {
                background: #828DDD;
            }
            li:nth-child(2) div:first-child::before {
                background: #FF6733;
            }
            li:nth-child(3) div:first-child::before {
                background: #2B32D6;
            }
        }
    }
}
.toolPop .e-items ul li:last-child {
    width: 16px;
}
.toolPop .e-items ul li div.drag {
    width: 16px;
    height: 16px;
    z-index: 10;
    cursor: move;
    background: url("../../../assets/img/common/drag.png") no-repeat center;
    background-size: auto !important;
}
.point {
    background: url("../../../assets/img/econtrol/point.png") no-repeat center center;
}
.s-point {
    background: url("../../../assets/img/econtrol/s-point.png") no-repeat center center;
}
.dyString {
    background: url("../../../assets/img/econtrol/line.png") no-repeat center center;
}
.s-dyString {
    background: url("../../../assets/img/econtrol/s-line.png") no-repeat center center;
}
.text {
    background: url("../../../assets/img/econtrol/text.png") no-repeat center center;
}
.s-text {
    background: url("../../../assets/img/econtrol/s-text.png") no-repeat center center;
}
.arrow {
    background: url("../../../assets/img/econtrol/arrow.png") no-repeat center center;
}
.s-arrow {
    background: url("../../../assets/img/econtrol/s-arrow.png") no-repeat center center;
}
.circle {
    background: url("../../../assets/img/econtrol/circle.png") no-repeat center center;
}
.s-circle {
    background: url("../../../assets/img/econtrol/s-circle.png") no-repeat center center;
}
.box {
    background: url("../../../assets/img/econtrol/rectangel.png") no-repeat center center;
}
.s-box {
    background: url("../../../assets/img/econtrol/s-rectangel.png") no-repeat center center;
}
.freePolygon {
    background: url("../../../assets/img/econtrol/quan.png") no-repeat center center;
}
.s-freePolygon {
    background: url("../../../assets/img/econtrol/s-quan.png") no-repeat center center;
}
.freeLine {
    background: url("../../../assets/img/econtrol/dline.png") no-repeat center center;
}
.s-freeLine {
    background: url("../../../assets/img/econtrol/s-dline.png") no-repeat center center;
}
.auto {
    background: url("../../../assets/img/econtrol/auto.png") no-repeat center center;
}
.s-auto {
    background: url("../../../assets/img/econtrol/s-auto.png") no-repeat center center;
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
.save {
    background: url("../../../assets/img/econtrol/save.png") no-repeat center center;
}
.s-save {
    background: url("../../../assets/img/econtrol/save.png") no-repeat center center;
}
.close {
    background: url("../../../assets/img/econtrol/close.png") no-repeat center center;
}
.s-close {
    background: url("../../../assets/img/econtrol/close.png") no-repeat center center;
}
.o-size {
    background: url("../../../assets/img/econtrol/o-size.png") no-repeat center center;
}
.t-size {
    background: url("../../../assets/img/econtrol/t-size.png") no-repeat center center;
}
.td-size {
    background: url("../../../assets/img/econtrol/td-size.png") no-repeat center center;
}
.size-c {
    background: url("../../../assets/img/econtrol/size-c.png") no-repeat center center;
}

/*big*/
.big .toolPop {
    top: 45px;
    right: 84px;
    width: 518px;
    height: 34px;

    .e-items {
        width: auto;
        height: 34px;

        ul li {
            width: 30px;
            height: 30px;
            line-height: 30px;
            margin: 2px 4px;
            float: left;

            div {
                width: 30px;
                height: 30px;
            }
        }
    }
    .auto-detail .roadInfor ul li {
        margin: 8px 0px;
    }
    .auto-detail .roadInfor ul li div.endRoad {
        width: 368px;
    }
    .auto-detail .roadInfor ul li ul li:before {
        margin: 6px 10px;
    }
    .auto-detail .roadInfor ul li ul li img {
        margin-top: -4px;
    }
    .color-panel {
        width: 282px;
        height: 42px;

        .color-size {
            margin-top: 7px;
        }
        .color-choose {
            .background-color {
                width: 40px;
                height: 40px
            }
        }
        .choose-list {
            width: 162px;

            li {
                width: 18px;
                height: 18px;
            }
        }
    }
    .save-panel {
        width: 213px;
        height: 42px;
        top: 34px;

        input.font-text {
            width: 140px;
            font-size: 18px;
        }
        button.btnhover {
            height: 33px;
            margin-top: 3px;
            font-size: 18px;
        }
    }
}
.big .toolPop .e-items ul li:last-child {
    width: 16px;
}
.big .toolPop .e-items ul li div.drag {
    width: 16px;
    height: 16px;
    background-size: auto !important;
}
</style>