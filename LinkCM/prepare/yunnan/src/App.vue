<template>
    <div id="app" class="{{bigClass}}">
        <div class="top">
            <span class="city">云南省</span>
            <span class="top-title">{{areaName}}应急指挥决策辅助系统<small>(EAGLE)</small><label @click="openAbout">{{version}}</label></span>
            <v-areacomp></v-areacomp>
            <!-- 右侧功能栏 -->
            <v-toolsbar></v-toolsbar>
            <!-- 地图切换 -->
            <v-maptab></v-maptab>
        </div>
        <div class="content">
            <div id="lmap" class="lmap"></div>
            <v-map></v-map>
            <v-model></v-model>
            <v-panel></v-panel>
            <v-mapcontrol></v-mapcontrol>
            <v-typhoon v-if="typhoon==true"></v-typhoon>
            <v-radar v-if="radar==true"></v-radar>
            <v-cloud v-if="cloud==true"></v-cloud>
            <v-poi v-if="poi==true"></v-poi>
            <v-modelpic v-if="model==true"></v-modelpic>
            <!-- <v-time></v-time> -->
            <v-site v-if="site==true"></v-site>
            <v-ship v-if="ship==true"></v-ship>
            <v-thunder v-if="thunder==true"></v-thunder>
            <v-townname v-if="townName==true"></v-townname>
            <v-legendpic></v-legendpic>
            <v-damage v-if="damage==true"></v-damage>
            <v-publicvideo v-if="publicVideo==true"></v-publicvideo>
            <v-reservoirvideo v-if="reservoirVideo==true"></v-reservoirvideo>
            <v-agr v-if="agr==true"></v-agr>
            <v-traffic v-if="traffic==true"></v-traffic>
            <v-airq v-if="airq==true"></v-airq>
            <v-areapolygon v-if="areaPolygon==true"></v-areapolygon>
            <v-mountaintorrents v-if="mountainTorrents==true"></v-mountaintorrents>
            <v-areatipplane></v-areatipplane>
            <v-sitebox></v-sitebox>
            <v-rainwarn v-if="rainwarn"></v-rainwarn>
            <v-rainwarnbox></v-rainwarnbox>
            <v-poibox></v-poibox>
            <v-damagebox v-if="damageBox==true"></v-damagebox>
            <!--图标选中展示图层-->
            <v-activepoint v-if="activePoint==true"></v-activepoint>
            <v-townnamedropzone v-if="townNameDropzone==true"></v-townnamedropzone>
            <!--控制弹窗的窗口位置-->
            <v-windowcontrol></v-windowcontrol>
        </div>
    </div>
</template>

<script>

    import { updateTitle, updateParam } from './vuex/store'

    import lmap from './util/lmap/lmap'

    import Map from './components/gis/Map'
    import AreaTabComp from './components/layout/AreaTabComp'
    import ToolsBar from './components/layout/ToolsBar'
    import MapTab from './components/layout/tools/MapTab'
    import BasePanel from './components/layout/BasePanel'
    import Model from './components/model/Model'
    import MapControl from './components/layout/MapControl'
    import config from './config'
    import Poi from './components/gis/Poi'
    import Typhoon from './components/gis/Typhoon'
    import Radar from './components/gis/Radar'
    import Cloud from './components/gis/Cloud'
    import ModelPic from './components/gis/Model'
    // import Time from './components/time/Time'
    import Site from './components/gis/Site'
    import Ship from './components/gis/Ship'
    import Thunder from './components/gis/Thunder'
    import TownName from './components/gis/TownName'
    import LegendPic from './components/layout/LegendPic'
    import Damage from './components/gis/Damage'
    import Agr from './components/gis/Agr'
    import Traffic from './components/gis/Traffic'
    import AirQ from './components/gis/AirQ'
    import PublicVideo from './components/gis/PublicVideo'
    import AreaPolygon from './components/gis/AreaPolygon'
    import MountainTorrents from './components/gis/MountainTorrents'
    import AreaTipPlane from './components/layout/AreaTipPlane'
    import SiteBox from './components/gis/SiteBox'
    import PoiBox from './components/gis/PoiBox'
    import DamageBox from './components/gis/DamageBox'
    import ActivePoint from './components/gis/ActivePoint'
    import TownNameDropzone from './components/gis/TownNameDropzone'
    import RainWarn from './components/gis/RainWarn'
    import RainWarnBox from './components/gis/RainWarnBox'
    import ControlWindow from './components/common/ControlWindow'

    export default {
        components: {
            'v-areacomp': AreaTabComp,
            'v-toolsbar': ToolsBar,
            'v-panel': BasePanel,
            'v-model': Model,
            'v-mapcontrol': MapControl,
            'v-typhoon': Typhoon,
            'v-radar': Radar,
            'v-cloud': Cloud,
            'v-poi': Poi,
            'v-modelpic': ModelPic,
            'v-maptab': MapTab,
            // 'v-time': Time,
            'v-site': Site,
            'v-townname': TownName,
            'v-ship': Ship,
            'v-thunder': Thunder,
            'v-legendpic': LegendPic,
            'v-publicvideo': PublicVideo,
            'v-airq': AirQ,
            'v-damage': Damage,
            'v-agr': Agr,
            'v-traffic': Traffic,
            'v-areapolygon': AreaPolygon,
            'v-map': Map,
            'v-mountaintorrents': MountainTorrents,
            'v-areatipplane': AreaTipPlane,
            'v-sitebox': SiteBox,
            'v-poibox': PoiBox,
            'v-damagebox': DamageBox,
            'v-activepoint': ActivePoint,
            'v-rainwarn': RainWarn,
            'v-rainwarnbox': RainWarnBox,
            'v-townnamedropzone': TownNameDropzone,
            'v-windowcontrol': ControlWindow
        },
        data() {
            return {
                areaPolygon: false,
                activePoint: false,
                bigClass: ''
            }
        },
        vuex: {
            getters: {
                areaName: state => state.areaName,
                version: state => state.version,
                typhoon: state => state.typhoon.status,
                radar: state => state.radar.status,
                cloud: state => state.cloud.status,
                poi: state => state.poi.status,
                model: state => state.model.status,
                site: state => state.site.status,
                townName: state => state.townName.status,
                ship: state => state.ship.status,
                thunder: state => state.thunder.status,
                airq: state => state.airq.status,
                damage: state => state.damage.status,
                agr: state => state.agr.status,
                traffic: state => state.traffic.status,
                publicVideo: state => state.publicVideo.status,
                mountainTorrents: state => state.mountainTorrents.status,
                damageBox: state => state.damageBox.status,
                townNameDropzone: state => state.townNameDropzone.status,
                rainwarn: state => state.rainwarn.status,
                big: state => state.big.status
            },
            actions: {
                updateTitle,
                updateParam
            }
        },
        watch: {
            big: function() {
                this.bigClass = this.big ? 'big' : '';
                let oDate = new Date();
                oDate.setDate(oDate.getDate() + 7);
                document.cookie = 'bigClass=' + this.bigClass + ';expires=' + oDate;
            }
        },
        methods: {
            openAbout: function() {
                this.updateParam('about', 'status', true);
            },
            setCookie: function() {
                let bigClass = getCookie('bigClass');
                if (bigClass === 'big') {
                    this.updateParam('big', 'status', true);
                }
                this.bigClass = bigClass;

                function getCookie(name) {
                    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                    if (arr = document.cookie.match(reg)) {
                        return unescape(arr[2]);
                    } else {
                        return null;
                    }
                }
            }
        },
        ready: function() {

            let map = lmap.initMap('lmap');
            config.addParam('map', map);
            // 添加鼠标所在经纬度控件
            lmap.controler.mousePosition(map, 'mousePosition');

            // 更新title
            this.updateTitle();
            this.setCookie();
            this.areaPolygon = true;
            this.activePoint = true;
        }
    }
</script>

<style lang='less'>
@import "assets/css/common.less";

.ol-zoom, .ol-rotate, .ol-attribution {
    display: none;
}
div#normal-slider.time-slider {
    display: inline-block;
    width: 275px;
    height: 6px;
    background: #6d82a1;
    margin-bottom: 3px;
    margin-left: 10px;
    margin-right: 11px;
    border: 0;
}
div#special-slider.time-slider {
    display: inline-block;
    width: 275px;
    height: 6px;
    background: #6d82a1;
    margin-bottom: 3px;
    margin-left: 10px;
    margin-right: 11px;
    border: 0;
}
div.model-slider span.ui-slider-handle, div.time-slider span.ui-slider-handle, div.opacity-panel span.ui-slider-handle, div.rain-slider span.ui-slider-handle, div.marker-slider span.ui-slider-handle {
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background: #fff;
    border: 1px solid #aaa;
    list-style-type: none;
    -webkit-text-size-adjust: none;
    outline: none;
    cursor: pointer;
}
div.model-slider span.ui-slider-handle {
    width: 10px;
    height: 10px;
}
div.marker-slider span.ui-slider-handle {
    top: -3px
}
div.model-slider span.ui-slider-handle:before, div.time-slider span.ui-slider-handle:before, div.opacity-panel span.ui-slider-handle:before, div.rain-slider span.ui-slider-handle:before, div.marker-slider span.ui-slider-handle:before {
    content: "";
    display: inline-block;
    position: absolute;
    width: 4px;
    height: 4px;
    background: #aaa;
    top: 50%;
    left: 50%;
    margin-left: -2px;
    margin-top: -2px;
    border-radius: 100%;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
}
div.time-slider .ui-widget-header {
    background: @color;
}
div.rain-slider {
    display: inline-block;
    width: 275px;
    height: 5px;
    background: #eee;
    margin-bottom: 5px;
    margin-left: 19px;
    margin-right: 11px;
}
div.rain-slider .ui-widget-header {
    background: #1f7ed0;
}
body, div, ul, li {
    margin: 0;
    padding: 0;
    list-style-type: none;
    -webkit-text-size-adjust: none;
    outline: none;
    font-weight: inherit;
    font-style: inherit;
    font-family: "Microsoft Yahei";
    vertical-align: baseline;
    color: @colorH;
}
html, body, div {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
}
img {
    border: 0;
}
body {
    overflow: hidden;
}
font {
    font-size: inherit;
}
b {
    font-weight: 400;
}
button, input {
    font-family: "Microsoft Yahei";
}
#app {
    height: 100%;
    font-family: "Microsoft Yahei";
    min-width: 1200px;
    cursor: default !important;
    color: @colorH;
    font-size: 12px;
}
ul li {
    list-style-type: none;
    cursor: pointer;
}
.top {
    width: 100%;
    height: 30px;
    text-align: center;
    background: @topbg;
}
.city{
    color: #fff;
    position:absolute;
    left:14px;
    top: 0;
    display: block;
    line-height:30px;
}
.top-title {
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    height: 30px;
    line-height: 30px;
    letter-spacing: 2px;
    width: auto;

    small {
        font-weight: 400;
        font-size: 16px;
        font-family: "Microsoft Yahei";
    }
    label {
        letter-spacing: 0;
        margin-left: 5px;
        font-weight: 400;
        cursor: pointer;
        font-size: 12px;
    }
}
.content {
    width: 100%;
    position: absolute;
    top: 30px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow: hidden;
}
.lmap {
    width: 100%;
    height: 100%;
    overfloat: hidden;
}

/*input*/
input.font-text {
    width: 85px;
    padding-left: 3px;
    display: inline-block;
    height: 22px;
    line-height: 22px;
    border: 1px solid #ccc;
    background: #fff;
    color: @colorH;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -ms-border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-transition: box-shadow .2s;
    -moz-transition: box-shadow .2s;
    -o-transition: box-shadow .2s;
    transition: box-shadow .2s;
    list-style-type: none;
    -webkit-text-size-adjust: none;
    outline: none;
}
input.font-text:hover {
    -webkit-box-shadow: 0 0px 6px 0 rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 0 0px 6px 0 rgba(0, 0, 0, 0.2);
    box-shadow: 0 0px 6px 0 rgba(0, 0, 0, 0.2);
}
select::-ms-expand {
    display: none;
}
input[type="text"]::-ms-clear {
    display: none;
}

/*select*/
.selectCss {
    display: inline-block; /* 1 */
    position: relative; /* 2 */
    vertical-align: middle; /* 3 */
    padding: 0; /* 4 */
    overflow: hidden; /* 5 */
    float: left;
    width: 100px;
    margin-right: 10px;
    height: 22px;
    line-height: 22px;
    border: 1px solid #ccc;
    text-shadow: none;
    -webkit-transition: box-shadow .4s;
    -moz-transition: box-shadow .4s;
    -o-transition: box-shadow .4s;
    transition: box-shadow .4s;

    select {
        cursor: pointer;
        padding: 0em 0.1em;
        padding-right: 32px;
        width: 160%;
        border: 0;
        background: transparent;
        background-image: none;
        appearance: none;
        -moz-appearance: none;
        -webkit-appearance: none;
        -ms-appearance: none;
        text-indent: 0.01px;
        text-overflow: '';
        width: 160% \9;
        font-family: 'MicroSoft YaHei';
        position: relative;
        z-index: 1;
        color: @colorH;
        outline: none;

        option {
            border: 0;
        }
    }
    select:focus {
        outline: none;
    }
    span {
        position: absolute;
        left: 6px;
    }
}
.selectCss:after {
    content: "";
    position: absolute;
    top: 10px;
    right: 5px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #C0C0C0;
}

/*checkbox*/
.checkbox {
    display: none;
}
.checkbox + label {
    display: inline-block;
    position: relative;
    cursor: pointer;
}
.checkbox + label:before {
    content: "";
    display: inline-block;
    background-color: #f7f7f7;
    width: 14px;
    height: 14px;
    border: 1px solid #aeaeae;
    border-radius: 3px;
    vertical-align: middle;
    margin-top: -3px;
    margin-right: 3px;
}
.checkbox:checked + label:before {
    border: 1px solid #aeaeae;
    background-color: #f7f7f7;
}
.checkbox:checked + label:after {
    content: '';
    width: 3px;
    height: 6px;
    border-bottom: 3px solid #676767;
    border-right: 3px solid #676767;
    position: absolute;
    top: 3px;
    left: 5px;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);  /* IE 9 */
    -moz-transform: rotate(45deg);     /* Firefox */
    -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
    -o-transform: rotate(45deg);
}
.checkbox + label:hover {
    color: #499ff2;
}

/*radio*/
.form-radio {
    display: none;
}
.form-radio + label {
    display: inline-block;
    position: relative;
    cursor: pointer;
}
.form-radio + label:before {
    content: "";
    display: inline-block;
    background-color: #f7f7f7;
    width: 12px;
    height: 12px;
    border: 1px solid #aeaeae;
    vertical-align: middle;
    margin-top: -1px;
    margin-right: 3px;
    -webkit-border-radius: 100%;
    border-radius: 100%;
}
.form-radio:checked + label:after {
    content: '';
    position: absolute;
    top: 6px;
    left: 4px;
    width: 6px;
    height: 6px;
    background: #949494;
    border-radius: 100%;
    -webkit-border-radius: 100%;
    border-radius: 100%;
}
.form-radio + label:hover {
    color: #499ff2;
}

/**/
.checkbox-btn {
    display: none;
}
.checkbox-btn + label {
    float: left;
    cursor: pointer;
    margin-right: 8px;
    height: 22px;
    line-height: 22px;
    padding: 0px 8px;
    border: 1px solid #ccc;
    background: #fff;
    position: relative;
    display: inline-block;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
    -webkit-transition: box-shadow .4s;
    -moz-transition: box-shadow .4s;
    -o-transition: box-shadow .4s;
    transition: box-shadow .4s;
}
.checkbox-btn:checked + label {
    background-color: @color;
    border: 1px solid @color;
    color: #fff;
}
.checkbox-btn + label:hover {
    color: @color;
    -webkit-box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.3);
}
.checkbox-btn:checked + label:hover {
    background-color: @color;
    color: #fff;
}

/*input[type="checkbox"]{
   -webkit-appearance: none;
   -moz-appearance: none;
   appearance: none;
   width:16px;
   height:16px;
   background:url('assets/img/common/checkbox-checked.png') no-repeat 0px -20px;
}
input[type="checkbox"]:focus{
   outline:none;
}
input[type="checkbox"]:checked{
   background-position:0px 0px;
}*/

/*icon*/
em.emfocus {
    display: inline-block;
    position: relative;
    width: 10px;
    height: 10px;
    display: none;
    vertical-align: middle;
    background: @activebg;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
}
em.emfocus:before {
    content: "";
    display: inline-block;
    position: absolute;
    top: 4px;
    left: 3px;
    background: #FFFFFF;
    width: 1px;
    height: 4px;
    transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);  /* IE 9 */
    -moz-transform: rotate(-45deg);     /* Firefox */
    -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
    -o-transform: rotate(-45deg);
}
em.emfocus:after {
    content: "";
    display: inline-block;
    position: absolute;
    top: 2px;
    left: 6px;
    background: #FFFFFF;
    width: 1px;
    height: 6px;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);   /* IE 9 */
    -moz-transform: rotate(45deg);  /* Firefox */
    -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
    -o-transform: rotate(45deg);
}
.title {
    background: #ecf2fc;
    cursor: move;
    height: 26px;
    line-height: 26px;
    text-align: left;
    padding-left: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

/*btton*/
.btnhover {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    padding: 0px 8px;
    border: 1px solid #ccc;
    cursor: pointer;
    background: #fff;
    color: @colorH;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -ms-border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-transition: box-shadow .4s;
    -moz-transition: box-shadow .4s;
    -o-transition: box-shadow .4s;
    transition: box-shadow .4s;
}
.btnhover:hover, .selectCss:hover {
    -webkit-box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.3);
}

/**/
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

/**/
.timedate {
    border: 1px solid #ccc;
    float: left;
    height: 22px;
    line-height: 22px;
    display: block;
    clear: both;
    margin-left: -3px;
    margin-bottom: 5px;
    padding-left: 5px;
    width: 220px;
    position: relative;

    input {
        border: none;
        background: none;
        width: 100%;
        position: relative;
        z-index: 1;
        cursor: pointer;
        list-style-type: none;
        -webkit-text-size-adjust: none;
        outline: none;
    }
    span {
        margin-right: 5px;
    }
}
.timedate:after {
    content: "";
    display: inline-block;
    position: absolute;
    width: 16px;
    height: 16px;
    top: 3px;
    right: 2px;
    background: url("assets/img/common/date.png");
}
div.nullbg {
    background: 0;
}
.popTab {
    margin: 3px;
    height: auto;
    overflow: hidden;
}
.popTaBorder {
    border: 1px solid #ccc
}

/*画图工具统一样式start*/
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
.sceneName {
    background: #fff;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    padding: 2px 0 2px 2px;
}
.sceneName input {
    margin-right: 2px;
}

/*画图工具统一样式end*/
.cricle-box-panel {
    background: #fff;
    width: auto;
    height: auto;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);

    
    
    .cricle-box-title {
        background: #ecf2fc;
        cursor: move;
        height: 26px;
        line-height: 26px;
        text-align: left;
        padding-left: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .cricle-box-radio {
        ul {
            margin:0 10px;

            li {
                float: left;
                padding: 5px;

                input {
                    width: 16px;
                    height: 16px;
                    vertical-align: middle;
                    margin-top: -2px;
                }
            }
        }
        .close {
            position: absolute;
            right: 0;
            top: 0;
            height: 20px;
            width: 20px;
            background: url("assets/img/toolsbar/rightIcon.png") no-repeat;
            background-position: -153px -60px !important;
            display: inline-block;
            zoom: 1;
            cursor: pointer;
        }
    }
    .div_btn {
        text-align: center;

        a {
            display: inline-block;
            height: 22px;
            line-height: 22px;
            margin: 5px;
            padding: 0px 8px;
            border: 1px solid #ccc;
            text-decoration: none;
            cursor: pointer;
            background: #fff;
            color: #414e61;
            border-radius: 3px;
            -webkit-border-radius: 3px;
            -ms-border-radius: 3px;
            -moz-border-radius: 3px;
            -webkit-transition: box-shadow 0.4s;
            transition: box-shadow 0.4s;
        }
        a:hover {
            -webkit-box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.3);
            -moz-box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.3);
            box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 0.3);
        }
    }
}
.traffic, .traffic-show, .traffic-hide { 
    background:#fff; 
    width: auto; 
    height: auto; 
    text-align: center; 
    padding: 2px; 
    font-size: 12px;
    border-radius: 5px; 
    -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
}
.traffic { animation: traffic-show 1s; opacity: 1; transform: translate(0px, 0px); }


.traffic-show { opacity: 1; }
.traffic-hide { animation: traffic-hide 1s; opacity: 0; }
@keyframes traffic-show {
    0% { 
        transform: translate(0px, 10px); 
        opacity: 0; 
        }
    100% {
         transform: translate(0px, 0px); 
         opacity: 1;
         }
}
@keyframes traffic-hide {
    0% { 
        transform: translate(0px, 0px);
         opacity: 1;
       }
    100% { 
        transform: translate(0px, 10px); 
        opacity: 0; 
        }
}
.traffic-show.hover { 
    transform: translate(2px, -5px) scale(1.2, 1.2); 
    border: 1px solid #1f7ed0; 
    cursor: pointer;
    }


.traffic .traf_container, .traffic-show .traf_container, .traffic-hide .traf_container { 
    width: 63px; height: 38px; }

.traffic img, .traffic-show img, .traffic-hide img { display: inline; width: auto; height: 38px; }
.traffic span.first, .traffic-show span.first, .traffic-hide span.first { position: absolute; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid white; bottom: -5px; left: 30px; }
.traffic span.model, .traffic-show span.model, .traffic-hide span.model { position: absolute; border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 5px solid white; bottom: -5px; left: 30px; }

/*big*/
#app.big {
    font-size: 20px;
}
.big .top {
    height: 45px;
}
.big .content {
    top: 45px;
}

/*title*/
.big .top-title {
    font-size: 24px;
    height: 45px;
    line-height: 45px;

    small {
        font-size: 24px;
    }
}

/*input*/
.big input.font-text {
    height: 30px;
    line-height: 30px;
    margin-left: 3px;
    vertical-align: middle;
    margin-top: -4px;
    font-size: 20px;
}

/*select*/
.big .selectCss {
    width: 190px;
    height: 30px;
    line-height: 30px;

    select {
        font-size: 20px;
    }
}
.big .selectCss:after {
    top: 12px;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-top: 7px solid #C0C0C0;
}
.big .btnhover {
    height: 30px;
    line-height: 30px;
}

/**/
.big em.emfocus {
    width: 12px;
    height: 12px;
}
.big em.emfocus:before {
    top: 4px;
    left: 3px;
    width: 1px;
    height: 6px;
}
.big em.emfocus:after {
    top: 2px;
    left: 7px;
    width: 1px;
    height: 8px;
}
.big .title {
    height: 32px;
    line-height: 32px;
}
.big div.rain-slider a.ui-slider-handle {
    top: -5px;
}
.big div.marker-slider a.ui-slider-handle {
    width: 16px;
    height: 16px;
    top: -5px;
}
.big .save-panel {
    width: 245px;
    top: 34px;
}
.big div.model-slider span.ui-slider-handle {
    height: 14px;
    width: 14px;
    margin-left: -6px;
}
.big {
    .checkbox + label:before {
        width: 16px;
        height: 16px;
    }
    .checkbox:checked + label:after {
        width: 4px;
        height: 8px;
        top: 7px;
        left: 6px
    }
    .form-radio + label:before {
        width: 16px;
        height: 16px;
        margin-top: -1px;
        margin-right: 3px;
    }
    .form-radio:checked + label:after {
        top: 10px;
        left: 5px;
        width: 8px;
        height: 8px;
    }
}
</style>