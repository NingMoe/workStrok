<template>
    <div>
        <div class="model" v-el:cusmodel-bar>
            <ul>
                <template v-for="item in cusList">
                    <li @click="showModel(item, 'cusPrepare', $index)" :class="cusPrepare[item].classObj">
                        <div class="{{item}}"></div>
                        <label :class="cusPrepare[item].classObj">{{cusPrepare[item].name}}</label>
                        <em class="emfocus"></em>
                    </li>
                    <i :class="cusPrepare[item].slider" :style="sliderLeft" v-if="cusPrepare[item].classObj.selected && 'mt,stormTide,pollutantDispersion'.indexOf(item) === -1" @click="showModelSlider(item, 'cusPrepare')"></i>
                </template>
            </ul>
            <div class="hide_list" :style="hideWidth" v-if="hideStat" transition="expend">
                <ul>
                    <template v-for="item in cushidelist">
                        <li @click="showModel(item, 'cusPrepare', ($index + 4))" :class="cusPrepare[item].classObj">
                            <div class="{{item}}"></div>
                            <label :class="cusPrepare[item].classObj">{{cusPrepare[item].name}}</label>
                            <em class="emfocus"></em>
                        </li>
                        <i :class="cusPrepare[item].slider" :style="sliderLeft" v-if="cusPrepare[item].classObj.selected && 'mt,stormTide,pollutantDispersion'.indexOf(item) === -1" @click="showModelSlider(item, 'cusPrepare')"></i>
                    </template>
                </ul>
            </div>
            <div v-if="cushidelist.length>0" :class="{showButton:!hideStat,hideButton:hideStat}" @click="showHide"></div>
        </div>

        <div v-el:legend class="mlegend" v-if="!dzStatus">
            <v-main-legend-panel v-if="levels.length > 0 && pType !== 'waterLogging' && pType !== 'fireDanger'" :datas="count.datas"></v-main-legend-panel>
            <v-main-legend v-if="status === true" :model="pType"></v-main-legend>
        </div>

        <div v-el:legend class="mlegend" v-if="dzStatus">
            <v-dz-legend-panel v-if="dzLevels.length > 0" :datas="count.datas" :mindatas="count.mindatas"></v-dz-legend-panel>
            <v-dz-legend :model="pType"></v-dz-legend>
        </div>

        <div v-if="pType=='gale'" class="windModel" @click="openWind()">动态模型</div>
        <v-parampanel></v-parampanel>

        <v-heavyrainfall v-if="pType==='heavyRainfall' && cusPrepare[pType].slider.selected"></v-heavyrainfall>
        <v-firedanger v-if="pType==='fireDanger' && cusPrepare[pType].slider.selected"></v-firedanger>
        <v-gale v-if="pType==='gale' && cusPrepare[pType].slider.selected"></v-gale>
        <v-mountaintorrents v-if="pType==='mountainTorrents' && cusPrepare[pType].slider.selected"></v-mountaintorrents>
        <v-temp v-if="pType==='temp' && cusPrepare[pType].slider.selected"></v-temp>
        <v-waterlogging v-if="pType==='waterLogging' && cusPrepare[pType].slider.selected"></v-waterlogging>

    </div>
</template>

<script>

    import MainLegend from './mainLegend/Legend'
    import MainLegendPanel from './mainLegend/LegendPanel'

    import DzLegend from './dropzoneLegend/Legend'
    import DzLegendPanel from './dropzoneLegend/LegendPanel'

    import { updateParam, updateValue, updateModelState } from '../../vuex/store'
    import ParamPanel from './panels/ParamPanel'
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import TimeUtil from '../../util/tools/TimeUtil'
    import ModelInfo from '../common/model'

    import HeavyRainfall from './sliderPanels/HeavyRainfall'
    import FireDanger from './sliderPanels/FireDanger'
    import Gale from './sliderPanels/Gale'
    import MountainTorrents from './sliderPanels/MountainTorrents'
    import Temp from './sliderPanels/Temp'
    import WaterLogging from './sliderPanels/WaterLogging'
    
    export default {
        components: {
            'v-main-legend': MainLegend, 'v-main-legend-panel': MainLegendPanel, 'v-parampanel': ParamPanel,
            'v-heavyrainfall': HeavyRainfall,
            'v-firedanger': FireDanger,
            'v-gale': Gale,
            'v-mountaintorrents': MountainTorrents,
            'v-temp': Temp,
            'v-waterlogging': WaterLogging,
            'v-dz-legend': DzLegend, 'v-dz-legend-panel': DzLegendPanel, 
        },
        data () {
            return {
                type: '',
               /* list: {
                    gale: { name: '大风', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'galeInstant' },
                    heavyRainfall: { name: '强降水', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'heavyRainfall24_2d' },
                    temp: { name: '温度', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'pastMaxTemperature24' },
                    mountainTorrents: { name: '山洪', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'mountainTorrents' }
                },
                hideList: {
                    waterLogging: { name: '内涝', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'past12' },
                    mt: { name: '漫滩', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'mtzj' },
                    stormTide: { name: '风暴潮', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'stormTide' },
                    pollutantDispersion: { name: '污染扩散', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'pollutantDispersion' },
                    fireDanger: { name: '森林火点', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'past12' }
                },*/
                hideStat: false,
                count: {
                    status: false,
                    datas: {
                        townCount: { name: '行政镇', num: '' },
                        pop: { name: '人口', num: '' },
                        area: { name: '面积', num: '' },
                        gdp: { name: 'GDP', num: '' }
                    },
                    mindatas: {}
                },
                level: '',
                cusList: {},
                cushidelist: {},
                cusPrepare: {
                    gale: { name: '大风', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'futureGaleInstant24' },
                    heavyRainfall: { name: '强降水', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'heavyRainfall24_2d' },
                    temp: { name: '温度', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'pastMaxTemperature24' },
                    mountainTorrents: { name: '山洪', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'mountainTorrents' },
                    waterLogging: { name: '内涝', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'past12' },
                    mt: { name: '漫滩', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'mtzj' },
                    stormTide: { name: '风暴潮', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'stormTide' },
                    pollutantDispersion: { name: '污染扩散', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'pollutantDispersion' },
                    fireDanger: { name: '森林火点', classObj: { 'selected': false }, slider: { 'selected': false }, def: 'past12' }
                },
                dzStatus: false,
                hideWidth: 0,
                sliderLeft: { left: '51px' }
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                status: state => state.model.status,
                pType: state => state.model.pType,
                cType: state => state.model.cType,
                layer: state => state.model.layer,
                levels: state => state.model.levels,
                mtImageStatus: state => state.mountainTorrents.poi,
                time: state => state.time.sysMinTime,
                isSelect: state => state.model.isSelect,
                cusModelData: state => state.model.cusModelData,
                cusModelStat: state => state.model.cusModelStat,
                dzType: state => state.dropzone.cType,
                dzLevels: state => state.dropzone.levels,
                allTypes: state => state.poi.allTypes,
                poiStatus: state => state.poi.status,
                modelTypeName: state => state.modelTypeName,
                big: state => state.big.status
            },
            actions: { updateParam, updateValue, updateModelState }
        },
        computed: {
            hideWidth: function() {
                let obj = {};
                let wh = $('.hide_list li').width();
                obj['width'] = this.cushidelist.length * wh + 'px';
                return obj;
            }
        },
        watch:{
        	big: function(status){
                let left = {};
                let width = status ? 93 : 66;
                let $li = $('.model ul li label.selected');
                let $liArr = $('.model ul li label');
                let index = $liArr.index($li);
                left['left'] = (index + 1) * width - 15 + 'px';
                this.sliderLeft = left;
            },
            cusModelData: function(cusModelData) {
                // this.cusStatus = true;
                let cusName = [];
                let cushideName = [];
                for (let k in cusModelData) {
                    if (k < 4) {
                        cusName.push(cusModelData[k].name);
                    } else {
                        cushideName.push(cusModelData[k].name);
                    }
                    this.cusList = cusName;
                    this.cushidelist = cushideName;
                }
                if (this.cusList.length > 0) {
                    setTimeout(() => {
                        this.showModel(this.cusList[0], 'cusPrepare');
                    }, 500);
                }
            },
            // cusModelStat: function(cusModelStat){
            //     this.cusStatus = false;
            // },
            dzType: function(type) {
                this.dzStatus = ModelInfo.dropzone[type] ? true : false;
            }

        },
        methods: {
            showModelSlider: function(typeName, kind){
                let state = this.cusPrepare[typeName].slider.selected;
                this.cusPrepare[typeName].slider.selected = !state;
            },
            // 选择模型
            showModel: function(typeName, kind, index){
                var stat = true;
                var first = this.cusList;
                var second = this.cushidelist;
                for (let key in first) {
                    if (this.cusPrepare[first[key]].classObj.selected && first[key] != typeName){
                        this.cusPrepare[first[key]].classObj.selected = false;
                        // this.updateModelState(first[key], false);
                    }
                }
                for (let key in second) {
                    if (this.cusPrepare[second[key]].classObj.selected && second[key] != typeName){
                        this.cusPrepare[second[key]].classObj.selected = false;
                        // this.updateModelState(first[key], false);
                    }
                }
                if (this[kind][typeName].classObj.selected) {
                    stat = false;
                }

                let left = {};
                let width = $('.model ul li').width();
                left['left'] = (index + 1) * width - 15 + 'px';
                this.sliderLeft = left;

                this.updateModelState(typeName, stat);
                this[kind][typeName].classObj.selected = stat;
                this.cusPrepare[typeName].slider.selected = true;

                var childName = this[kind][typeName].def;
                if ('gale,heavyRainfall,temp'.indexOf(typeName) === -1) {
                    this.dzStatus = false;
                }
                var obj = { 'status': true, 'pType': typeName, 'cType': childName, 'levels': '' };
                if (this.status && typeName == this.pType) {
                    obj.status = false;
                    obj.pType = '';
                    this.dzStatus = false;
                    this.updateParam('dropzone', 'pType', '');
                    this.updateParam('dropzone', 'cType', '');
                }
                this.updateValue('model', obj);
                if (childName === 'mountainTorrents' && this.status) {
                    this.updateParam('mountainTorrents', 'status', true);
                    this.updateParam('mountainTorrents', 'model', true);
                } else {
                    this.updateParam('mountainTorrents', 'model', false);
                    if (!this.mtImageStatus) {
                        this.updateParam('mountainTorrents', 'status', false);
                    }
                }
            },
            // 显示隐藏模型
            showHide: function(){
                var stat = true;
                if(this.hideStat) stat = false;
                this.hideStat = stat;
            },
            // 动态风模型
            openWind: function(){
                window.open("http://10.148.16.42:8081/gd_air/index.html?"+TimeUtil.convertToStr(this.time));
            }
        },
        ready: function(){
            this.sliderLeft = { left : '51px' };
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/common.less";
.unselect { color: black; }
.model { position: absolute; top: 0px; left: 0px; width: auto; height: 62px; background-color: #FFFFFF; -webkit-box-shadow: 0 0px 5px 0 rgba(0, 0, 0, .3); box-shadow: 0 0px 5px 0 rgba(0, 0, 0, .3); z-index: 4;
    ul { float: left; }
    ul li { float: left; list-style-type: none; width: 66px; height: 62px; text-align: center; cursor: pointer; position: relative; transition: background 0.5s; -moz-transition: background 0.5s; -webkit-transition: background 0.5s; -o-transition: background 0.5s;
        label { cursor: pointer; }
    }
    ul li.selected { background: @bg; }
    ul li:hover { background: @bg; }
    ul li div { width: 100%; height: 41px; }
    ul li.selected em { display: block; position: absolute; top: 2px; right: 2px; }
    ul i { background: url("../../assets/img/model/unslider.png") no-repeat center center; position: absolute; bottom: 0; left: 51px; display: block; width: 15px; height: 15px; }
    ul i.selected { background: url("../../assets/img/model/slider.png") no-repeat center center; }
}
.showButton { width: 12px; height: 100%; background: url("../../assets/img/model/toggled.png") no-repeat center center; float: left; cursor: pointer; }
.hideButton { width: 12px; height: 100%; background: url("../../assets/img/model/toggle.png") no-repeat center center; float: left; cursor: pointer; }
.showButton:hover,
.hideButton:hover { background-color: @bg; }
.gale { background: url("../../assets/img/model/gale.png") no-repeat center center; }
.heavyRainfall { background: url("../../assets/img/model/heavyRainfall.png") no-repeat center center; }
.temp { background: url("../../assets/img/model/weather.png") no-repeat center center; }
.mountainTorrents { background: url("../../assets/img/model/mountainTorrents.png") no-repeat center center; }
.mt { background: url("../../assets/img/model/mt.png") no-repeat center center; }
.stormTide { background: url("../../assets/img/model/stormTide.png") no-repeat center center; }
.pollutantDispersion { background: url("../../assets/img/model/pollutantDispersion.png") no-repeat center center; }
.waterLogging { background: url("../../assets/img/model/waterLogging.png") no-repeat center center; }
.fireDanger { background: url("../../assets/img/model/fireDanger.png") no-repeat center center; }
.mlegend { width: 420px; height: auto; position: absolute; bottom: 54px; right: 0; z-index: 3;          /*overflow: hidden;*/ }
.hide_list { height: 100%; float: left; overflow: hidden; }
.expend-transition { display: inline-block; /* 否则 scale 动画不起作用 */ }
.expend-enter { animation: expend-in .3s linear; }
.expend-leave { animation: expend-out .6s linear; }
@keyframes expend-in {
    0% { width: 0px }
    100% { width: 0px }
}
@keyframes expend-out {
    0% { width: 0px }
    100% { width: 0px }
}
.windModel { position: absolute; top: 2px; right: 2px; background-color: #fff; border: 1px solid #ccc; width: 58px; height: 27px; line-height: 27px; text-align: center; -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3); }

/*big*/
.big .mlegend { width: 627px; }
.big .model { height: 93px;
    ul li { width: 93px; height: 93px; }
    ul li.selected em { top: 2px; right: 2px; }
    ul li div { height: 57px; -webkit-background-size: auto 74% !important; -moz-background-size: auto 74% !important; background-size: auto 74% !important; }
    ul i { left: 78px; }
}
.big .hide_list { width: 466px }
.big .windModel { width: 90px; top: 1px }
</style>