<!-- 定位查询 -->
<template>
    <div class="location-search">
        <div v-if="panelStatus === 'info'">

            <div class="close back-to-integrated" @click="back()"> <span class="info"> {{ backinfo }} </span> </div>
            <div class="poiPop normal" v-if="normal.stat==true">
                <div class="title nullbg nocursor">
                    <label>{{ normal.name }}</label>
                </div>
                <div class="popTab popTaBorder">
                    <div class="title nocursor">基本信息</div>
                    <div class="popTab-box">
                        <ul>
                            <!--其他的poi-->
                            <template v-for="it of normal.list">
                                <li v-if="it.paramTitle !== '名称' && normal.traffic === false" title="{{ it.paramVal }}">{{ it.paramTitle}}：{{ it.paramVal }}</li>
                            </template>
                            <!--客运站-->
                            <template v-for="it of normal.list">
                                <div v-if="it.paramTitle !== '名称' && normal.traffic === true">{{{ it.paramVal }}}</div>
                            </template>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="poiPop emergencty" v-if="emergencty.stat==true">
                <div class="title nullbg nocursor">
                    <label>{{ emergencty.name }}</label>
                </div>
                <div class="popTab popTaBorder">
                    <div class="emergencty-list">
                        <ul>
                            <template v-for="it of emergencty.list">
                                <li class="btnhover" @click="exChangeType($key)" :style="exChangeStyle($key)">{{ $key }}</li>
                            </template>
                        </ul>
                    </div>
                    <div class="popTab-box">
                        <template v-for="it in emergencty.list">
                            <ul v-if="emergencty.curType==$key">
                                <template v-for="em in it">
                                    <template v-for="e in em">
                                        <li title="{{ e.paramVal }}">{{ e.paramTitle }}：{{ e.paramVal }}</li>
                                    </template>
                                    <li class="width-line"></li>
                                </template>
                            </ul>
                        </template>
                    </div>
                </div>
            </div>

        </div>
        <div class="poi-select" v-if="panelStatus === 'panel'">
            <div class="close back-to-integrated" @click="close()"> <span class="info"> {{ backinfo }} </span> </div>
            <div class="base-list">
                <div class="imgInfor img_0" @click="selectAll('baseInfo')" :class="{'s-item':baseInfo}">
                    <label>基本信息</label>
                </div>
                <div class="base-item base_0">
                    <ul>
                        <li v-for="item in pois.baseInfo">
                            <span :class="{'s-item':item.isSelect}" @click="select(item)"><label>{{item.name}}</label><em class="emfocus"></em></span>
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
                        <li v-for="item in pois.esource">
                            <span :class="{'s-item':item.isSelect}" @click="select(item)"><label>{{item.name}}</label><em class="emfocus"></em></span>
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
                        <li v-for="item in pois.spower">
                            <span :class="{'s-item':item.isSelect}" @click="select(item)"><label>{{item.name}}</label><em class="emfocus"></em></span>
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
                        <li v-for="item in pois.avoid">
                            <span :class="{'s-item':item.isSelect}" @click="select(item)"><label>{{item.name}}</label><em class="emfocus"></em></span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import lmap from '../../../util/lmap/lmap'
    import config from '../../../config'
    import { updateParam } from '../../../vuex/store'

    export default {
        props: [ 'id', 'obj' ], 
        data() {
            return {
                pois: {
                    baseInfo: [
                        { name: '经济', type: 'SJZX_ECONOMIC', isSelect: false }, 
                        { name: '医院', type: 'MEDICAL_HOSPITAL', isSelect: false }, 
                        { name: '学校', type: 'EDUCATION_SCHOOL', isSelect: false }, 
                        { name: '危化点', type: 'KEYPLACE_IMPORTANT', isSelect: false }, 
                        { name: '客运站', type: 'HZ_TRAFFIC_CAR,HZ_TRAFFIC_TRAIN,HZ_TRAFFIC_PLANE', isSelect: false }
                    ],
                    esource: [
                        { name: '民政', type: 'EMERGENCY_CIVIL', isSelect: false }, 
                        { name: '三防', type: 'EMERGENCY_THREE', isSelect: false }, 
                        { name: '水利', type: 'EMERGENCY_WATER', isSelect: false }, 
                        { name: '公安', type: 'SJZX_EMERGENCY_POLICE', isSelect: false }, 
                        { name: '国土', type: 'SJZX_EMERGENCY_HOMELAND', isSelect: false }, 
                        { name: '林业', type: 'EMERGENCY_FORESTRY', isSelect: false }, 
                        { name: '环保', type: 'SJZX_EMERGENCY_ENVIRONMENTAL', isSelect: false }, 
                        { name: '海事', type: 'EMERGENCY_MSA', isSelect: false }, 
                        { name: '安监', type: 'SJZX_EMERGENCY_SAFETY', isSelect: false }, 
                        { name: '电力', type: 'SJZX_EMERGENCY_ELECTRIC', isSelect: false }
                    ],
                    spower: [
                        { name: '电力', type: 'SJZX_RESCUE_ELECTRIC', isSelect: false }, 
                        { name: '通讯', type: 'RESCUE_COMM', isSelect: false }, 
                        { name: '医疗', type: 'RESCUE_MEDICAL', isSelect: false }, 
                        { name: '交通', type: 'SJZX_RESCUE_TRAFFIC', isSelect: false }, 
                        { name: '乡镇', type: 'RESCUE_VILLAGE', isSelect: false }, 
                        { name: '海上', type: 'SJZX_RESCUE_SEA', isSelect: false }, 
                        { name: '公安', type: 'SJZX_RESCUE_FIRE', isSelect: false }
                    ],
                    avoid: [{ name: '避难点', type: 'SJZX_KEYPLACE_REFUGES,GDSYJB_SLECTER', isSelect: false }]
                },
                baseInfo: false,
                esource: false,
                spower: false,
                avoid: false,

                normal: {
                    stat: false,
                    list: '',
                    name: '',
                    traffic: false
                },
                emergencty: {
                    stat: false,
                    list: '',
                    name: '',
                    curType: ''
                },

                panelStatus: 'hide',
                selectType: '',
                searchPois: [],
                poiIn: false,
                backinfo: '返回',

                WMS: undefined,
                map: config.getParam('map'),
                poi: {
                    url: 'http://10.148.16.57:9999/dss/gd_image/image!loadPoiWMS.action',
                    name: 'poi',
                    opacity: '1',
                    params: {
                        dateTime: '',
                        type: '',
                        code: '44',
                        status: 'province',
                        poiType: '',
                        mapType: '',
                        poiPolygon: '',
                        random: '',
                        model: 'cache',
                        cacheId: ''
                    }
                },
            }
        },
        vuex: {
            getters: {
                code: state => state.cityCode
            },
            actions: { updateParam }
        },
        computed: {
            
        },
        watch: {
            searchPois() {
                this.refreshLayer();
            },
            id() {
                if (!!this.id) this.panelStatus = 'panel';
                this.poi.params.cacheId = this.id;
                this.refreshLayer();
            }
        },
        methods: {
            selectAll: function(tem) {
                var list = this.pois[tem];
                var status = true;
                if (this[tem]) status = false;
                list.forEach((item) => {
                    item.isSelect = status;
                    if (status) {
                        this.searchPois.push(item.type);
                    } else {
                        let index = this.searchPois.indexOf(item.type);
                        this.searchPois.splice(index, 1);
                        this.controlActivePoint('');
                    }
                });
                this[tem] = status;
            },
            select(item) {
                item.isSelect = !item.isSelect;
                if (item.isSelect) {
                    this.searchPois.push(item.type);
                } else {
                    let index = this.searchPois.indexOf(item.type);
                    this.searchPois.splice(index, 1);
                    if (this.selectType === item.type) {
                        this.controlActivePoint('');
                        this.selectType = '';
                    }
                }
            },
            initLayer() {
                this.poi.params.cacheId = this.id;
                this.WMS = lmap.image.loadImageWMS(this.map, this.poi, 'poi');
            },

            refreshLayer() {
                let arr = this.searchPois.map(function(data){
                    return `poi_${data}`;
                });
                this.poi.params.type = arr.join(',') + ',';

                if (!this.WMS) {
                    this.initLayer();
                }
                lmap.image.updateImageWMS(this.WMS, this.poi.params);
            },

            clickEvt(evt) {
                let [lon, lat] = lmap.controler.getEvtLonLat(evt);
                this.getPoiData(lon, lat);
            },

            controlActivePoint: function(val) {
                this.updateParam('activePoint', 'point', val); // 选中图标
            },

            getPoiData(lon, lat, stype) {

                var zoom = this.map.getView().getZoom();
                let types = stype ? stype : this.searchPois.join(',') + ',';
                var url = 'http://10.148.16.57:9999/dss/poi/poi!getPoiByLonLat.action';
                var qdata = {
                    areaCode: this.code,
                    zoom: zoom,
                    lon: lon,
                    lat: lat,
                    type: types
                };
                $.getJSON(url, qdata, (data) => {
                    if (data.id) {
                        let type = data.poiType;
                        if (!this.obj) {
                            this.activeStat = true;
                            this.controlActivePoint(type + "#" + data.lon + "#" + data.lat);
                        }
                        this.getPoiDetail(data.id, type);
                        this.selectType = type;
                    }
                });
            },

            getPoiDetail(id, type) {
                var url = '';
                var reqData = { poiID: id };
                url = 'http://10.148.16.57:9999/dss/area/area!getPoiDetail.action';
                $.getJSON(url, reqData, (data) => {
                    if (type.indexOf('EMERGENCY') != -1) { // 需要分类的
                        for (let key in data) {
                            var arr = data[key][0];
                            for (let it in arr) {
                                if (arr[it].paramTitle == '名称') {
                                    this.emergencty.name = arr[it].paramVal;
                                    this.emergencty.curType = key;
                                    break;
                                }
                            }
                        }
                        this.emergencty.list = data;
                        this.emergencty.stat = true;
                    } else {
                        var temp = data[type][0];
                        for (let key in temp) {
                            if (temp[key].paramTitle == '名称' || temp[key].paramTitle == '景区名称') {
                                this.normal.name = temp[key].paramVal;
                                break;
                            }
                        }
                        this.normal.traffic = false;
                        if (type.indexOf('HZ_TRAFFIC') !== -1) {
                            this.normal.traffic = true;
                        }
                        this.normal.list = temp;
                        this.normal.stat = true;
                    }
                    this.panelStatus = 'info';
                });

            },

            exChangeStyle (type) {
                var style = { 'color': '#fff', 'background-color': '#27303F' };
                if (this.emergencty.curType == type) return style;
            },

            exChangeType(type) {
                this.emergencty.curType = type;
            },

            close(){
                this.$emit('close');
            },

            back(){
                if (this.poiIn) {
                    this.$emit('close');
                    this.poiIn = false;
                    return;
                } else if (this.panelStatus === 'info') {
                    this.panelStatus = 'panel';
                    this.controlActivePoint('');
                }
                this.controlActivePoint('');
            }
        },
        created () {

        },
        ready: function() {

            if (!this.id && !!this.obj) {
                this.poiIn = true;
                let { lon, lat, type } = this.obj;
                this.getPoiData(lon, lat, type);
            } else if (!!this.id && !this.obj) {
                this.poiIn = false;
                this.initLayer();
                this.panelStatus = 'panel';
            }
            this.map.on('singleclick', this.clickEvt);
        },
        detached: function() {
            this.controlActivePoint('');
            this.map.removeLayer(this.WMS);
            this.map.un('singleclick', this.clickEvt);
        }
    }
</script>

<style scoped lang='less'>
.location-search {
    z-index: 4;
    width: auto;
    height: auto;
    padding: 2px;
    background-color: #fff;
    ul {

        li {
            width: 60px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            float: left;
            cursor: pointer;
            border-radius: 5px 5px 0 0;
            -webkit-border-radius: 5px 5px 0 0;
            -moz-border-radius: 5px 5px 0 0;
        }
    }
}



@import "../../../assets/css/common.less";
.min-base {
    height: auto;
    padding-bottom: 5px;
    position: relative;
    width: 100%;
    background: #fff;
    margin: 8px 0px;
}

.imgInfor {
    width: 60px;
    float: left;
    cursor: pointer;
    text-align: center;
    margin: 0 5px;
}

.imgInfor:hover {
    color: @color
}

.imgInfor:before {
    content: "";
    width: 36px;
    height: 36px;
    display: block;
    margin: auto;
}

.img_0:before {
    background: url("../../../assets/img/minbase/a1.png") no-repeat center;
}

.img_1:before {
    background: url("../../../assets/img/minbase/a2.png") no-repeat center;
}

.img_2:before {
    background: url("../../../assets/img/minbase/a3.png") no-repeat center;
}

.img_3:before {
    background: url("../../../assets/img/minbase/a4.png") no-repeat center;
}

.base-list {
    height: auto;
    border-top: 1px solid #E5E8EC;
    padding-top: 3px;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    align-items: center;
    justify-content: center;
    label {
        cursor: pointer;
    }
}

.base-item {
    float: left;
    margin-left: 3px;
    width: 346px;
    height: auto;
    ul {
        clear: both;
        height: auto;
        li {
            float: left;
            margin-left: 2px;
            line-height: 24px;
            cursor: pointer;
            background: 0;
            width: 78px;
            text-align: left;
            border: 0;
            padding: 0;
            clear: none;
        }
    }
}

.base_0 {
    margin: 10px;
    ul li {
        width: 55px
    }
    ul li:hover {
        color: @color
    }
}

.base-item ul li span.s-item em.emfocus {
    position: relative;
    margin-left: 0px;
    margin-top: -21px;
    display: inline-block;
    vertical-align: middle;
}

.list-button {
    position: absolute;
    padding: 0 8px;
    bottom: 5px;
    right: 5px;
    background: none;
}

.close {
    height: 24px;
    width: 60px;
    cursor: pointer;
    z-index: 999;
    color: #1f7ed0;
}

.close.info {
    margin-left: 3px;
}

.close.back-to-integrated:before {
    content: '\21A9';
}

.close:before {
    content: '\D7';
    
    font-size: 18px;
    font-weight: 700;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%, -50%);
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
            width: 49%;
            margin-right: 1%;
            text-align: left;
            float: left;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
.poiPop {
    width: auto;
    height: auto;
    z-index: 4;
    background: #fff;
}

.emergencty { height: auto; overflow: hidden;
    .emergencty-list { height: auto; overflow: hidden; padding: 0px 2px; background: @bg;
        ul li { margin: 2px; float: left; }
        ul li:hover { color: @color; }
    }
}

.nocursor {
    cursor: default;
}

/*big*/

.big .imgInfor {
    width: 98px;
}

.big .base-item {
    width: 510px;
}

.big .base-item ul li {
    line-height: 30px;
}

.big .base_0 ul li {
    width: 82px;
}

</style>