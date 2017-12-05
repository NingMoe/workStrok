<!--基本信息面板-->
<template>
    <div class="min-base">
        <div class="base-list">
            <div class="imgInfor img_0" @click="selectAll('baseInfo')" :class="{'s-item':baseInfo}">
                <label>基本信息</label>
            </div>
            <div class="base-item base_0">
                <ul>
                    <li v-for="item in list.baseInfo">
                        <span :class="{'s-item':item.status}" @click="touchFun('baseInfo', item.type)">
                        	<label>{{item.name}}</label>                       	
                        	<a class="count">{{sumDatas[item.type]}}</a>
                        	<em class="emfocus"></em>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="base-list">
            <div class="imgInfor img_1" @click="selectAll('esource')" :class="{'s-item':esource}">
                <label>应急物资</label>
            </div>
            <div class="base-item base_0">
                <ul>
                    <li v-for="item in list.esource">
                        <span :class="{'s-item':item.status}" @click="touchFun('esource', item.type)"><label>{{item.name}}</label><em class="emfocus"></em></span><span class="count">{{sumDatas[item.type]}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="base-list">
            <div class="imgInfor img_2" @click="selectAll('spower')" :class="{'s-item':spower}">
                <label>救援力量</label>
            </div>
            <div class="base-item base_0">
                <ul>
                    <li v-for="item in list.spower">
                        <span :class="{'s-item':item.status}" @click="touchFun('spower', item.type)"><label>{{item.name}}</label><em class="emfocus"></em></span><span class="count">{{sumDatas[item.type]}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="base-list">
            <div class="imgInfor img_3" @click="selectAll('avoid')" :class="{'s-item':avoid}">
                <label>避难场所</label>
            </div>
            <div class="base-item base_0">
                <ul>
                    <li v-for="item in list.avoid">
                        <span :class="{'s-item':item.status}" @click="touchFun('avoid', item.type)"><label>{{item.name}}</label><em class="emfocus"></em></span><span class="count">{{sumDatas[item.type]}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!-- <a class="list-button btnhover" @click="getPoiTableList()">显示列表</a> -->
        <!-- <v-poitable v-if="poiStat==true" :curtypes="curTypes" :ifcache="ifcache" :datas="datas"></v-poitable> -->
    </div>
</template>

<script>

    import { updateParam } from '../../../../vuex/store'
    import lmap from '../../../../util/lmap/lmap'
    import config from '../../../../config'
    import TimeUtil from '../../../../util/tools/TimeUtil'
    // import PoiTable from './PoiTable'

    export default {
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                allTypes: state => state.poi.allTypes,
                // layer: state => state.poi.layer,
                code: state => state.cityCode,
                minBase: state => state.poi.minBase,
                cType: state => state.dropzone.cType,
                dateTime: state => state.dropzone.dateTime,
                levels: state => state.dropzone.levels,
                rowKey: state => state.dropzone.rowKey,
                layer: state => state.dropzone.layer,
                poiType: state => state.dropzone.poiType,
                minDatas: state => state.dropzone.minDatas
            },
            actions: { updateParam }
        },
        components: {
            // 'v-poitable': PoiTable
        },
        data() {
            return {
                list: {
                    baseInfo: [
                        { name: '经济', type: 'SJZX_ECONOMIC', status: false },
                        { name: '医院', type: 'MEDICAL_HOSPITAL', status: false },
                        { name: '学校', type: 'EDUCATION_SCHOOL', status: false },
                        { name: '水库', type: 'RESERVOIR', status: false },
                        { name: '危化点', type: 'KEYPLACE_IMPORTANT', status: false },
                        { name: '客运站', type: 'HZ_TRAFFIC_CAR,HZ_TRAFFIC_TRAIN,HZ_TRAFFIC_PLANE', status: false }
                    ],

                    esource: [ 
                        { name: '民政', type: 'EMERGENCY_CIVIL', status: false },
                        { name: '三防', type: 'EMERGENCY_THREE', status: false },
                        { name: '水利', type: 'EMERGENCY_WATER', status: false },
                        { name: '公安', type: 'SJZX_EMERGENCY_POLICE', status: false },
                        { name: '国土', type: 'SJZX_EMERGENCY_HOMELAND', status: false },
                        { name: '林业', type: 'EMERGENCY_FORESTRY', status: false },
                        { name: '环保', type: 'SJZX_EMERGENCY_ENVIRONMENTAL', status: false },
                        { name: '海事', type: 'EMERGENCY_MSA', status: false },
                        { name: '安监', type: 'SJZX_EMERGENCY_SAFETY', status: false },
                        { name: '电力', type: 'SJZX_EMERGENCY_ELECTRIC', status: false }
                    ],
                    spower: [
                        { name: '电力', type: 'SJZX_RESCUE_ELECTRIC', status: false },
                        { name: '通讯', type: 'RESCUE_COMM', status: false },
                        { name: '医疗', type: 'RESCUE_MEDICAL', status: false },
                        { name: '交通', type: 'SJZX_RESCUE_TRAFFIC', status: false },
                        { name: '乡镇', type: 'RESCUE_VILLAGE', status: false },
                        { name: '海上', type: 'SJZX_RESCUE_SEA', status: false },
                        { name: '公安', type: 'SJZX_RESCUE_FIRE', status: false }
                    ],
                    avoid: [ { name: '避难点', type: 'SJZX_KEYPLACE_REFUGES,GDSYJB_SLECTER', status: false } ]

                },

                matchDatas: {
                    'HZ_TRAFFIC_CAR': 'HZ_TRAFFIC_CAR,HZ_TRAFFIC_TRAIN,HZ_TRAFFIC_PLANE',
                    'HZ_TRAFFIC_TRAIN': 'HZ_TRAFFIC_CAR,HZ_TRAFFIC_TRAIN,HZ_TRAFFIC_PLANE',
                    'HZ_TRAFFIC_PLANE': 'HZ_TRAFFIC_CAR,HZ_TRAFFIC_TRAIN,HZ_TRAFFIC_PLANE'
                },

                sumDatas: {
                    'SJZX_ECONOMIC': '',
                    'MEDICAL_HOSPITAL': '',
                    'EDUCATION_SCHOOL': '',
                    'RESERVOIR': '',
                    'KEYPLACE_IMPORTANT': '',
                    'HZ_TRAFFIC_CAR,HZ_TRAFFIC_TRAIN,HZ_TRAFFIC_PLANE': '',
                    'EMERGENCY_CIVIL': '',
                    'EMERGENCY_THREE': '',
                    'EMERGENCY_WATER': '',
                    'SJZX_EMERGENCY_POLICE': '',
                    'SJZX_EMERGENCY_HOMELAND': '',
                    'EMERGENCY_FORESTRY': '',
                    'SJZX_EMERGENCY_ENVIRONMENTAL': '',
                    'EMERGENCY_MSA': '',
                    'SJZX_EMERGENCY_SAFETY': '',
                    'SJZX_EMERGENCY_ELECTRIC': '',
                    'SJZX_RESCUE_ELECTRIC': '',
                    'RESCUE_COMM': '',
                    'RESCUE_MEDICAL': '',
                    'SJZX_RESCUE_TRAFFIC': '',
                    'RESCUE_VILLAGE': '',
                    'SJZX_RESCUE_SEA': '',
                    'SJZX_RESCUE_FIRE': '',
                    'SJZX_KEYPLACE_REFUGES': ''
                },

                baseInfo: false,
                esource: false,
                spower: false,
                avoid: false,
                curTypes: '', // 小面板选中类型记录
                poiStat: false,
                curRowkey: '',
                WMS: undefined
            }
        },
        watch: {
            curTypes: function(){
                // this.refreshWMS();
            },
            levels: function(levels){
                if (levels) {
                    let level = levels.join(',');
                    if (level && this.poiType) {
                        this.refreshWMS();
                    }
                    window.setTimeout(() => {
                        this.setSumData(this.minDatas);
                    }, 150);
                }
            }
        },
        methods: {

            setSumData: function(data) {

                for (let type in this.sumDatas) {
                    this.sumDatas[type] = '';
                }

                for (let key in data) {
                    let value = Number(data[key].count);
                    let sum = this.sumDatas[key];
                    if (sum === '') {
                        this.sumDatas[key] = Number(value);
                    } else if (sum === undefined) {
                        let count = Number(this.sumDatas[this.matchDatas[key]]);
                        if (count) {
                            this.sumDatas[this.matchDatas[key]] = count + value;
                        } else {
                            this.sumDatas[this.matchDatas[key]] = value;
                        }
                    }
                }
            },

            touchFun: function(tem, type) {
                let typeArr = type.split(',');
                let list = this.list[tem];
                list.forEach((item) => {
                    if (item.type == type) {
                        if (item.status) {
                            item.status = false;
                            this.curTypes = this.curTypes.replace(type + ',', '');
                        } else {
                            item.status = true;
                            this.curTypes += type + ',';
                        }
                    }
                });
                this.showMinBase();
            },

            selectAll: function(tem) {
                let list = this.list[tem];
                let status = true;
                if (this[tem]) status = false;
                list.forEach((item) => {
                    item.status = status;
                    this.curTypes = this.curTypes.replace( item.type + ',', '');
                    if (status) { 
                        this.curTypes +=  item.type + ','
                    }
                });
                this[tem] = status;
                this.showMinBase();
            },

            // 基础数据小面板
            showMinBase: function() {
                let call = setInterval(() => {
                    if (this.allTypes != '') {
                        this.updateParam('poi', 'allTypes', '');
                    } else {
                        clearInterval(call);
                        this.updateParam('dropzone', 'poiType', this.curTypes);
                        this.updateParam('poi', 'minBase', 'dropzone');
                        if(this.curTypes != ''){
                            this.updateParam('poi', 'status', false);
                        }
                        this.updateParam('poi', 'controlTypes', []);
                    }
                }, 50);
                this.refreshWMS();
            },

            initWMS: function(){
                let timeStr = TimeUtil.format(this.dateTime, 'yyyy-MM-dd HH:mm:ss');
                let typeArr = this.cType.split('_');
                let imageParam = {
                    name: 'dropzone',
                    url: 'http://10.148.16.56/server/image/poi',
                    params: '',
                    productCode: typeArr[0],
                    prediction: typeArr[1],
                    level: this.levels.join(','),
                    time: timeStr,
                    type: this.curTypes,
                    rowKey: this.rowKey
                };
                this.WMS = lmap.image.loadImageWMS(this.map, imageParam, 'poi', 'param');
            },

            refreshWMS: function(){
                let timeStr = TimeUtil.format(this.dateTime, 'yyyy-MM-dd HH:mm:ss');
                let ttype = this.cType;
                ttype = ttype.substring(0,ttype.indexOf('_'));
                let typeArr = this.cType.split('_'); 
                let imageParam = {
                    name: 'dropzone',
                    url: 'http://10.148.16.56/server/image/poi',
                    params: '',
                    productCode: typeArr[0],
                    prediction: typeArr[1],
                    level: this.levels.join(','),
                    time: timeStr,
                    type: this.curTypes,
                    rowKey: this.rowKey
                };
                lmap.image.updateImageWMS(this.WMS, imageParam, 'param');
            },

            clickEvt: function(evt){
                if (this.poiType) {
                    this.updateParam('poiBox', 'lonlat', lmap.controler.getEvtLonLat(evt));
                }
            }

            // 通过cacheId获取POI列表
            // getPoiTableList: function() {
            //     this.poiStat = true;
            // }
        },
        ready: function(){
            window.setTimeout(()=>{
                this.setSumData(this.minDatas);
                let map = config.getParam('map');
                map.on('singleclick', this.clickEvt);
                this.map = map;
                this.initWMS();
            }, 150);
            this.updateParam('poi', 'clickStat', false);
        },
        detached: function(){
            this.curTypes = '';
            this.updateParam('dropzone', 'poiType', '');
            this.updateParam('dropzone','layer',null);
            this.map.un('singleclick', this.clickEvt);
            this.map.removeLayer(this.WMS);
            this.updateParam('poi', 'clickStat', false)

            // this.updateParam('model', 'tempCacheId', this.cacheId || this.tempCacheId);
            // this.updateParam('model', 'cacheId', '');
            // this.updateParam('poi', 'status', false);
            // this.updateParam('poi', 'minBase', '');
            // this.updateParam('poi', 'minTypes', this.curTypes);
            // this.updateParam('poi', 'clickStat', false)
        }

    }
</script>

<style scoped lang="less">
@import "../../../../assets/css/common.less";
.min-base { height: auto; padding-bottom: 5px; position: relative; width: 100%; background: #fff; margin: 8px 0px; -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); }
.imgInfor { width: 48px; float: left; cursor: pointer; text-align: center; margin: 0 5px; }
.imgInfor:hover { color: @color }
.imgInfor:before { content: ""; width: 36px; height: 36px; display: block; margin: auto; }
.img_0:before { background: url("../../../../assets/img/minbase/a1.png") no-repeat center; }
.img_1:before { background: url("../../../../assets/img/minbase/a2.png") no-repeat center; }
.img_2:before { background: url("../../../../assets/img/minbase/a3.png") no-repeat center; }
.img_3:before { background: url("../../../../assets/img/minbase/a4.png") no-repeat center; }
.base-list { height: auto; border-top: 1px solid #E5E8EC; padding-top: 3px; display: -webkit-box; display: -moz-box;/*Firefox (buggy)*/ display: -ms-flexbox;/*IE 10*/ display: -webkit-flex;/*Chrome 21+*/ display: flex;/*Opera 12.1, Firefox 22+*/ -webkit-box-align: center; -moz-box-align: center; -ms-flex-align: center;/**/ -webkit-align-items: center;/**/ align-items: center;    /**/ -webkit-box-pack: center; -moz-box-pack: center; -ms-flex-pack: center;/**/ -webkit-justify-content: center;/**/ justify-content: center;
    label { cursor: pointer; }
}
.base-item { float: left; margin-left: 3px; width: 346px; height: auto;
    ul { clear: both; height: auto;
        li { float: left; margin-left: 2px; line-height: 24px; cursor: pointer; background: 0; width: 78px; text-align: left; border: 0; padding: 0; clear: none; }
    }
}
.base_0 { margin-top: 10px;
    ul li { min-width: 55px;width: auto;margin-right: 5px; }
    ul li:hover { color: @color }
}
.base-item ul li span.s-item em.emfocus { position: relative; margin-left: -2px; margin-top: -21px; display: inline-block; vertical-align: middle; }
.list-button { position: absolute; padding: 0 8px; bottom: 5px; right: 5px; background: none; }
.count { color: red; }

/*big*/
.big .imgInfor { width: 98px; }
.big .base-item { width: 510px; }
.big .base-item ul li { line-height: 30px; }
.big .base_0 ul li { width: 82px; }
</style>