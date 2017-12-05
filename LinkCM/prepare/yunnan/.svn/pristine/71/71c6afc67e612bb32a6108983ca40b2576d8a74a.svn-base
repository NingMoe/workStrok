<!--圈选任意面操作工具-->
<template>
    <div class="toolPop">
        <div class="e-items">
            <ul>
                <template v-for="item in list">
                    <li @click="selectButton($key)"><div :class="item.co" title={{item.name}}></div></li>
                </template>
            </ul>
        </div>
        <div class="circle-box" v-if="circleState">
            <ul>
                <li v-for="item in circleRadius" @click="selectRadius(item)">
                    <input class="form-radio" value="{{item}}" name="radius" type="radio" :checked="item === '自定义'" :id="$index"></input>
                    <label :for="$index">{{typeof item === 'number' ? item + '公里' : item }}</label>
                </li>
            </ul>
        </div>
        <div class="panel" v-if="panelStat==true">
            <a class="Close" @click="close()"></a>
            <div class="panel_0">
                <div class="count">
                    <ul><li v-for="it in count">{{it.name}}<label>{{it.num}}</label></li></ul>
                </div>
                <div class="lpanel">
                    <ul><li @click="showPanel($key)" v-for="it in item" :class="{'s-item':it.status}"><em></em><label>{{it.name}}</label></li></ul>
                </div>
            </div>
            <v-target v-if="item.target.status==true" ifcache="cache"></v-target>
            <v-ecase v-if="item.ecase.status==true"></v-ecase>
            <v-quantown v-if="item.quantown.status==true"></v-quantown>
            <v-minbase v-if="item.minbase.status==true" ifcache="cache" :datas="count"></v-minbase>
            <v-avoid v-if="item.avoid.status==true"></v-avoid>
            <v-towntable v-if="townTable==true" :datas="count"></v-towntable>
            <v-messagemin v-if="messageStat==true" :ids="messageIds"></v-messagemin>
        </div>
    </div>
</template>

<script>

    import lmap from '../../../util/lmap/lmap'
    import config from '../../../config'
    import Target from '../../model/mainLegend/legendItems/Target';
    import Ecase from '../../model/mainLegend/legendItems/Ecase';
    import MinBase from '../../model/mainLegend/legendItems/MinBase';
    import QuanTown from '../../model/mainLegend/legendItems/QuanTown';
    import TownTable from '../../model/mainLegend/legendItems/TownTable';
    import MessageMin from '../../model/mainLegend/legendItems/MessageMin';
    import Avoid from '../../model/mainLegend/legendItems/Avoid';
    import { updateParam } from '../../../vuex/store';

    export default {
        components : {
            'v-target':　Target, 'v-ecase': Ecase, 'v-minbase': MinBase,
            'v-quantown': QuanTown,'v-avoid': Avoid,'v-towntable': TownTable,
            'v-messagemin': MessageMin
        },
        vuex: {
            getters: {
                dss: state => state.dss,
                code: state => state.cityCode,
                cacheId: state => state.model.cacheId,
                clickStat: state => state.poi.clickStat,
                userName: state => state.userName,
            },
            actions: { updateParam }
        },
        data() {
            return {
                map: config.getParam('map'),
                layer: null,
                hander: null,
                drawParam: null,
                modify: null,
                list: {
                    circle: { name: '画圆', co: { 's-circle': false, 'circle': true } },
                    box: { name: '画矩形', co: { 's-box': false, 'box': true } },
                    freePolygon: { name: '画任意面', co: { 's-freePolygon': false, 'freePolygon': true } },
                    undo: { name: '撤销', co: { 's-undo': false, 'undo': true } },
                    delete: { name: '删除', co: { 's-delete': false, 'delete': true } }
                },
                count: {
                    town: { name: '行政镇', num: '分析中'},
                    pop: { name: '人口', num: '分析中'},
                    area: { name: '面积', num: '分析中'},
                    gdp: { name: 'GDP', num: '分析中'}
                },
                item: {
                    target: { name: '靶向预警', status: false },
                    avoid: { name: '避灾导航', status: false },
                    ecase: { name: '应急预案', status: false },
                    quantown: { name: '圈选镇名', status: false },
                    minbase: { name: '基础数据', status: false }
                },
                circleRadius: ['自定义', 100, 300, 500],
                panelStat: false, // 菜单面板状态
                townTable: false,
                messageStat: false, // 信息发送小窗口状态
                messageIds: '',
                circleState: false,
                totalPop: 0,
                totalGdp: 0
            }
        },
        computed: {
            finStat: function() {
                let stat = false;
                let list = this.list;
                for (let key in list) {
                    let type = 's-' + key;
                    if (list[key].co[type]) {
                        stat = true;
                        break;
                    }
                }
                return stat;
            }
        },
        watch: {
            clickStat: function(){
                if(this.clickStat) this.item.minbase.status = false;
            }
        },
        methods: {
            close: function() {
                this.panelStat = false;
            },

            selectRadius: function(radius){
                if (this.timer) window.clearTimeout(this.timer);
                this.timer = window.setTimeout(() => {
                    this.cancel();
                    let param = $.extend({}, this.drawParam);
                    if (radius === '自定义'){
                        this.hander = lmap.draw['circle'](param, this.drawendCB, false);
                    } else {
                        let extent = this.map.getView().calculateExtent(this.map.getSize());
                        let mapW = ol.extent.getWidth(extent);
                        let domW = $(document).width();
                        let unit = lmap.unit;
                        let scale =  (radius / ol.proj.METERS_PER_UNIT[unit] * 1000) / mapW;
                        let nRadius = scale * domW;
                        param.cRadius = nRadius;
                        param.radius = radius / ol.proj.METERS_PER_UNIT[unit] * 1000;
                        param.putdown = true;
                        param.tipText = '鼠标点击放下圆'
                        param.lmap = lmap;
                        this.hander = lmap.draw['circle'](param, this.drawendCB, false);
                    }
                }, 80);
            },

            selectButton: function(type) {
                if (type == 'delete') {
                    if (this.panelStat) this.panelStat = false;
                    this.clear();
                } else if (type == 'undo') {
                    this.undo();
                } else {
                    let list = this.list;
                    let newItem = 's-' + type;
                    for (let key in list) {
                        if (key != type) {
                            let tempItem = 's-' + key;
                            if (list[key].co[tempItem]) {
                                let temobj = {};
                                temobj[tempItem] = false;
                                temobj[key] = true;
                                list[key].co = temobj;
                            }
                        }
                    }
                    let obj = {};
                    obj[newItem] = true;
                    obj[type] = false;
                    let stat = true; // 判断当前按钮是否选中
                    this.circleState = newItem === 's-circle' ? true : false;
                    if (this.list[type].co[newItem]) {
                        obj[newItem] = false;
                        obj[type] = true;
                        stat = false;
                        this.circleState = false;
                    } 
                    this.list[type].co = obj;
                    if (stat){
                      this.initDraw(type);  
                    } else {
                        this.cancel();
                    }
                }
            },
            finish: function() {
                if (!this.panelStat){
                  this.panelStat = true;  
                } 
                this.refreshPanel(this.getAllWkt());
            },
            // 刷新加载数据
            refreshPanel: function(wkts) {
                let content = '';
                wkts.forEach((it) => {
                    content += it.wkt + '#';
                });

                let count = this.count;
                for (let key in count) {
                    count[key].num = '分析中';
                }

                if(content){
                    let url = 'http://localhost:8080/dss-data/atwill/atwill!addPolygon.action';
                    let qdata = { wkt: content, code:this.code};
                    $.ajax({
                        type: 'POST',
                        data: qdata,
                        url: url,
                        success: (bd) => {                         
                            let polygons= bd[0];
                             //面积和行政镇
                            this.getAreaTown(polygons);
                            //人口和gdp 访问省局信息中心
                            this.queryPopGdp(polygons);


                            this.clear();
                            let style = {
                                fill: '#E04C38',
                                fillOpacity: 0.2,
                                strokeColor: '#27303F',
                                strokeWidth: 1,
                            };
                            lmap.polygon.addFeatureFromWkt(this.layer, polygons, style, 'freePolygon');     
                        }                         
                    });
                } else {
                    this.panelStat = false;
                }                
            },
            getAreaTown: function(polygons){
                let qdata = { wkt: polygons, code: this.code };
                let url = this.dss+'/atwill/atwill!refreshAtwill.action';
                $.ajax({
                    type: 'POST',
                    data: qdata,
                    url: url,
                    success: (bd) => {
                        this.updateParam('model', 'cacheId', bd.id);
                        this.count['town'].num = bd['town'];
                        this.count['area'].num = bd['area'];
                    }
                });
           },
           queryPopGdp: function(polygons){
                let qdata = { Polygon: polygons, code: this.code };
                let peourl = 'http://localhost:8080/dss-data/atwill/atwill!queryPopGdp.action';
                $.ajax({
                    type: 'post',
                    data: qdata,
                    url: peourl,
                    success: (bd) => {
                        this.count['pop'].num = bd.pop;
                        this.count['gdp'].num = bd.gdp;
                    }
                });          
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
                this.unClickMap();
                this.cancel();
                let param = this.drawParam;
                param.putdown = false;
                param.tipText = undefined;
                this.hander = lmap.draw[type](param, this.drawendCB, false);
            },

            dblclickEvt: function(){
                this.hander.finishDrawing();
            },

            // 画笔结束回调函数
            drawendCB: function(type, feature) {
                let style = {
                    fill: '#E04C38',
                    fillOpacity: 0.2,
                    strokeColor: '#27303F',
                    strokeWidth: 1,
                };
                feature.set('name', type);
                feature.set('style', style);
                if (type == 'Circle') {
                    feature.set('conTip', this.hander.get('conTip'));
                }
                window.setTimeout(() => {
                    this.finish();
                }, 150);

            },
            // 获取所画图层所有的wkt数据
            getAllWkt: function() {
                let arr = [];
                let feats = lmap.draw.getFeatures(this.layer);
                feats.forEach((it) => {
                    let type = it.get('name');
                    if (type == 'Circle') {
                        getCircle(it, type);
                    } else {
                        getWkt(it, type);
                    }
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
            // 取消画图状态
            cancel: function() {
                if (!!this.hander) {
                    this.clickMap(); // 使地图恢复点击
                    lmap.draw.cancel(this.map, this.hander);
                }
            },
            // 撤消上一次画图
            undo: function() {
                let features = lmap.draw.undo(this.layer, null, this.map);
                if (!features[0]) {
                    if (this.panelStat) this.panelStat = false;
                    this.clear();
                } else {
                    this.finish();
                }
                this.item.target.status = false;
                this.item.avoid.status = false;
                this.item.ecase.status = false;
                this.item.quantown.status = false;
                this.item.minbase.status = false;
            },
            // 清除所有
            clear: function() {
                lmap.draw.clear(this.layer, this.map);
                this.item.target.status = false;
                this.item.avoid.status = false;
                this.item.ecase.status = false;
                this.item.quantown.status = false;
                this.item.minbase.status = false;
            },
            // 切换子菜单
            showPanel: function(type) {
                if (this.userName !== 'test' || type !== 'target') {
                    let status = true;
                    let itemArr = this.item;
                    if (this.item[type].status) {
                        status = false;
                    } else {
                        for (let key in itemArr) {
                            if (itemArr[key].status) this.item[key].status = false;
                        }
                    }
                    this.item[type].status = status;
                }
            },
            modifyEvt: function(feats){
                this.finish();
            }
        },
        ready: function() {
            let drawParam = lmap.draw.initDrawParam(this.map, 'draw');
            this.drawParam = drawParam;
            this.layer = drawParam.layer;
            this.modify = lmap.draw.modify(drawParam, this.modifyEvt);
            this.selectButton('freePolygon');
        },
        detached: function() {
            lmap.draw.cancel(this.map, this.modify);
            lmap.draw.cancel(this.map, this.hander);
            this.map.removeLayer(this.layer);
            this.clickMap();
        }
    }
</script>

<style scoped lang="less">
@import "../../../assets/css/common.less";

.toolPop {
    position: absolute;
    top: 30px;
    right: 180px;
    width: 160px;
    height: 30px;
    background-color: #fff;
    z-index: 4;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
.e-items {
    width: auto;
    height: 30px;
    position: absolute;

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
.panel {
    width: auto;
    height: auto;
    position: absolute;
    right: 0px;
    top: 32px;
}
.panel_0 {
    background: #FFFFFF;
    height: auto;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
.Close {
    position: absolute;
    right: 0;
    top: 0;
    height: 20px;
    width: 20px;
    background: url("../../../assets/img/toolsbar/rightIcon.png") no-repeat;
    background-position: -153px -60px !important;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
}
.count {
    display: inline-block;
    width: 416px;
    height: auto;
    text-align: left;
    padding: 2px;
    border-bottom: 1px solid #ccc;

    ul li {
        width: auto;
        margin-right: 5px;
        height: 22px;
        line-height: 22px;
        float: left;
        min-width: 80px;

        label {
            color: #1f7ed0;
            font-weight: 700;
            margin-left: 2px;
            display: inline-block;
        }
    }
    ul li label:after {
        content: "";
        display: inline-block;
    }
    ul li:first-child label:after {
        content: "个";
    }
    ul li:nth-child(2) label:after {
        content: "万";
    }
    ul li:nth-child(3) label:after {
        content: "km²";
    }
    ul li:nth-child(4) label:after {
        content: "亿";
    }
}
.lpanel {
    width: 100%;
    margin: auto;
    height: 23px;
    line-height: 23px;

    ul {
        li {
            list-style-type: none;
            float: left;
            margin-right: 10px;
            cursor: pointer;
            position: relative;
        }
        label {
            cursor: pointer;
            position: relative;
        }
        em {
            display: inline-block;
            width: 18px;
            height: 18px;
            margin-top: -2px;
            vertical-align: middle;
            -webkit-background-size: 100% auto !important;
            background-size: 100% auto !important;
        }
        li.s-item:before {
            content: "";
            display: inline-block;
            position: absolute;
            bottom: -10px;
            left: 33px;
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-bottom: 10px solid #fff;
        }
        .s-item {
            color: @color;
        }
        li:hover {
            color: @color
        }
        li:first-child em {
            background: url("../../../assets/img/toolsbar/bx.png") no-repeat;
        }
        li:nth-child(2) em {
            background: url("../../../assets/img/toolsbar/dh.png") no-repeat;
        }
        li:nth-child(3) em {
            background: url("../../../assets/img/toolsbar/ya.png") no-repeat;
        }
        li:nth-child(4) em {
            background: url("../../../assets/img/toolsbar/zm.png") no-repeat;
        }
        li:nth-child(5) em {
            background: url("../../../assets/img/toolsbar/sj.png") no-repeat;
        }
        li.s-item:first-child em {
            background: url("../../../assets/img/toolsbar/s_bx.png") no-repeat;
        }
        li.s-item:nth-child(2) em {
            background: url("../../../assets/img/toolsbar/s_dh.png") no-repeat;
        }
        li.s-item:nth-child(3) em {
            background: url("../../../assets/img/toolsbar/s_ya.png") no-repeat 1px 0px;
        }
        li.s-item:nth-child(4) em {
            background: url("../../../assets/img/toolsbar/s_zm.png") no-repeat;
        }
        li.s-item:nth-child(5) em {
            background: url("../../../assets/img/toolsbar/s_sj.png") no-repeat;
        }
    }
}
.e-items ul li.finish {
    width: auto;
    padding: 0px 2px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    float: left;
    position: absolute;
    right: -60px;
    cursor: pointer;
    margin: 0;
    -webkit-box-shadow: 1px 3px 5px -1px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 1px 3px 5px -1px rgba(0, 0, 0, 0.3);
    box-shadow: 1px 3px 5px -1px rgba(0, 0, 0, 0.3);

    div {
        width: 52px;
        height: 22px;
        line-height: 22px;
        border: 1px solid #D6D6D6;
        margin-top: 3px;
        position: relative;
        margin-left: 5px;
        cursor: pointer;
        background: -webkit-linear-gradient(#FEFEFE, #EEEEEE);
        background: -o-linear-gradient(#FEFEFE, #EEEEEE);
        background: -moz-linear-gradient(#FEFEFE, #EEEEEE);
        background: linear-gradient(#FEFEFE, #EEEEEE);
    }
    div:before {
        content: "";
        display: inline-block;
        position: absolute;
        top: 9px;
        left: 6px;
        background: #666F7D;
        width: 2px;
        height: 9px;
        transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);  /* IE 9 */
        -moz-transform: rotate(-45deg);     /* Firefox */
        -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
        -o-transform: rotate(-45deg);
    }
    div:after {
        content: "";
        display: inline-block;
        position: absolute;
        top: 4px;
        left: 14px;
        background: #666F7D;
        width: 2px;
        height: 14px;
        transform: rotate(45deg);
        -ms-transform: rotate(45deg);   /* IE 9 */
        -moz-transform: rotate(45deg);  /* Firefox */
        -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
        -o-transform: rotate(45deg);
    }
    div label {
        margin-left: 16px;
        cursor: pointer;
    }
    div:hover {
        background: @bg;
    }
}
.circle-box {
    background: #FFF;
    position: relative;
    width: 158px;
    top: 32px;
    right:0;
    border: 1px solid #eee;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    ul {
        li {
            display: inline-block;
            width:45%;
            margin-bottom:4px;
            text-align:left;
        }
    }
}

/*big*/
.big .toolPop {
    width: 180px;
    top: 45px;
    height: 34px;

    .e-items {
        height: 36px;

        ul li {
            width: 30px;
            height: 30px;
            line-height: 30px;

            div {
                width: 30px;
                height: 30px;
            }
        }
    }
}
.big .e-items ul li.finish {
    right: -82px;
}
.big .e-items ul li.finish div {
    width: 72px;
}
.big .count {
    width: 616px;
    padding: 6px 5px;

    ul li {
        height: 22px;
        line-height: 22px;
        min-width: 110px;
        margin-right: 10px;

        label {
            color: #1f7ed0;
            font-weight: 700;
            margin-left: 2px;
            display: inline-block;
        }
    }
}
.big .lpanel {
    height: 30px;
    line-height: 23px;

    ul {
        li {
            margin-right: 12px;
            margin-left: 2px;
        }
        em {
            width: 22px;
            height: 22px;
            margin-top: -4px;
        }
        li.s-item:before {
            left: 55px;
            bottom: -17px;
        }
    }
}
.big .circle-box {
    width: 178px;
    top: 36px;
    ul {
        li {width:100%;margin-left:10px;}   
    }
}
</style>