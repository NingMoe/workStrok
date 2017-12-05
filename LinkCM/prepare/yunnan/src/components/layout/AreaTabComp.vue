<template>

    <div class="areaComp">
        <label v-if="cityCode.length === 2" @mouseover.stop.prevent="showCityPanel(false,$event)" @mouseout.stop.prevent="showCityPanel(true,$event)" @click="updateArea(lastName,lastCode), clearProvince(lastCode)">{{ lastName }}</label>
        <label @mouseover.stop.prevent="showCityPanel(false,$event)" @mouseout.stop.prevent="showCityPanel(true,$event)" v-if="parentName!=''" @click="updateArea(parentName,parentCode)">{{ parentName }}</label>
        <div v-el:city-child class="at_area_list list_left_max"  v-show="false">
            <ul> <!--城镇横向列表-->
                <li v-for="item in childList" @click="selectChildArea(item.code,item.lon,item.lat,item.name)">{{item.name}}</li>
            </ul>
        </div>
        <div v-el:city-panel class="cityPanel cityPanel-status" @mouseover.stop.prevent="showCityPanel(false,$event)" @mouseout.stop.prevent="showCityPanel(true,$event)"> <!--城市纵向列表-->
            <ul><li v-for="item in cityList" @click="selectCity(item, $event)">{{item.name}}</li></ul>
        </div>
        <div class="town_List" v-if="townListStat==true" @mouseover.stop.prevent="showCityPanel(false,$event)" @mouseout.stop.prevent="showCityPanel(true,$event)">
            <ul>
                <li v-for="it of townList" @click="selectChildArea(it.code,it.lon,it.lat,it.name)">{{ it.name }}</li>            
            </ul>
        </div>
    </div>
</template>

<script>
    import { updateArea, updateUserId, updateUserName } from '../../vuex/store'
    import location from '../../util/tools/location'
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    
    export default {
        data() {
            return {
                map: config.getParam('map'),
                userName: '',   // 用来存放登录的用户名，如果是test这个用户名，则移动左上角时，地市不展开，只显示广东省
                cityList: [],
                childList: [],
                userId: '',
                layer: null,
                icon: null,
                lastCode: '44', 
                lastName: '广东省',
                townListStat: false,
                townList: [],
                parentName: '', // 保存点击的城市名
                parentCode: '', // 保存点击的城市编码,
                childSystem: {
                    '440113': 'http://10.148.136.101:10080',
                    '4403': 'http://10.153.121.5'
                },
                area_list: {
                    url: this.dss_sj+'/AreaTab/area-tab!getAreaList.action',
                    data: {
                        code: '',
                        type: ''
                    }
                }
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                areaName: state => state.areaName,
                cityCode: state => state.cityCode,
                cityList: state => state.cityList
            },
            actions: { updateArea, updateUserId, updateUserName }
        },
        computed: {
            // parentStyle: function() {
            //     let obj = {};
            //     if (this.parentName != '') {
            //         obj['list_left_max'] = true;
            //         obj['list_left_min'] = false;
            //     } else {
            //         obj['list_left_max'] = false;
            //         obj['list_left_min'] = true;
            //     }
            //     return obj;
            // }
        },
        methods: {
            // 显示二级区域名称广东省 广州市
            showParentName: function(name, code) {
                if (code == '44') {
                    this.parentName = '';
                    this.parentCode = '';
                } else {
                    this.parentName = name;
                    this.parentCode = code;
                }
            },
            // 当选择通过外部标签选择广东省时，清除其他地区内容
            clearProvince: function(code) {
                if (code.length == 2) {
                    // 清除二级名称
                    this.showParentName(null, code);
                    let $childlist = $(this.$els.cityChild); //横向城市列表
                    $childlist.hide();
                    if (!!this.icon) lmap.icon.remove(this.icon);
                    this.icon = null;
                }
            },
            // 城市展开列表
            showCityPanel: function(status, evt) {
                if (this.lastCode.length == 6) { // 显示镇列表
                    if (!!this.timeout) {
                        window.clearTimeout(this.timeout);
                        this.timeout = null;
                    }
                    if (status) {
                        this.timeout = setTimeout(() => {
                            this.townListStat = false;
                        }, 150);
                    } else {
                        this.townListStat = true;
                    }
                } else {
                    window.event ? window.event.cancelBubble = true : evt.stopPropagation();
                    let $cityPanel = $(this.$els.cityPanel);
                    if (!!this.timeout) {
                        window.clearTimeout(this.timeout);
                        this.timeout = null;
                    }
                    if (status) {
                        this.timeout = setTimeout(function() {
                            $cityPanel.addClass('cityPanel-status');
                        }, 150);
                    } else {
                        $cityPanel.removeClass('cityPanel-status');
                    }
                }
            },
            // 横向城市列表
            showChilds: function(code) {
                let type = 'county';
                if (code.length == 6) type = 'town';
                else if (code.length == 2) type = 'city';
                let qdata = { 'code': code, 'type': type };
                let childpoint = this;
                let $childlist = $(this.$els.cityChild);
                $childlist.hide();
                $.ajax({
                    type: 'get',
                    url: this.area_list.url,
                    data: qdata,
                    success: (bdata) => {
                        if (type == 'town') {
                            this.townList = bdata;
                        } else {
                            if (code.length != 2) {
                                bdata = this.removeUnit(bdata);
                                if (code === '4401') {
                                    this.childList = this.sortGZArea(bdata);
                                } else {
                                    this.childList = bdata;
                                }
                                $childlist.show();
                            }
                        }
                    }
                });
            },

            removeUnit: function(data) {
                data.forEach((area, index) => {
                    let state = true;
                    let stateNum = 0;
                    for (let i of area.name){
                        if ('区市县'.indexOf(i) !== -1) {
                            stateNum++;
                        }
                    }
                    if (stateNum !== (area.name.length - 1)) {
                        area.name = area.name.replace('区', '').replace('市', '').replace('县', '');
                    }
                });
                return data;
            },

            sortGZArea: function(data) {
                let sortArea = [];
                let areaObj = {};
                let sotrArr = ['440104', '440113', '440106', '440103', '440105', '440111', '440112', '440114', '440115', '440183', '440184'];
                data.forEach((area, index) => {
                    areaObj[area.code] = area;
                });
                sotrArr.forEach((sort) => {
                    sortArea.push(areaObj[sort]);
                });
                return sortArea;
            },

            // 选择区域
            selectArea: function(code, lon, lat, name) {
                if (!!this.icon) lmap.icon.remove(this.icon);
                this.icon = null;
            },
            selectChildArea: function(code, lon, lat, name) {
                // this.selectArea(code, lon, lat, name);
                if (code.length <= 6) {
                    let url = this.childSystem[code];
                    if (url) {
                        window.open(url);
                    } else {
                        this.updateArea(name, code);
                        if (this.layer) {
                            this.map.removeLayer(this.layer);
                            this.layer = undefined;
                        }
                    }
                } else {
                    if (!this.layer) {
                        this.layer = lmap.icon.initLayer(this.map, 'basic');
                    } else {
                        lmap.icon.clear(this.layer);
                    }
                    let style = {
                        fill: 'rgba(224, 76, 56, 0.5',
                        strokeColor: '#1A1A1A',
                        strokeWidth: 1.5,
                        text: name,
                        fontColor: '#000',
                        outColor: '#eee',
                        outWidth: '2',
                        fontSize: '20px'
                    };
                    $.ajax({
                        url: this.dss_sj+'/gisInfo/gis-info!getAreaBounds.action',
                        data: { areaCode: code },
                        dataType: 'json',
                        type: 'get',
                        success: (data) => {
                            lmap.polygon.addFeatureFromWkt(this.layer, data.areaGeom, style);
                        }
                    })
                }
            },
            // 根据区域编码获取名称
            getNameByCode: function(code) {
                let url = this.dss+'/AreaTab/area-tab!getNameByCode.action';
                let qd = {
                    code: code
                };
                $.getJSON(url, qd, (bd) => {
                    if (!!bd) {
                        this.selectChildArea(code, bd.lon, bd.lat, bd.name);
                        this.showChilds(code);
                        this.lastCode = code;
                        this.lastName = bd.name;
                        this.parentName = bd.name;
                        this.parentCode = bd.code;
                    } else {
                        this.enterMain();
                    }
                });
            },
            // 根据拼音获取名称
            getNameByPinYin: function(pinyin) {
                let url = this.dss+'/AreaTab/area-tab!getNameByPinYin.action';
                let qd = {
                    pinyin: pinyin
                };
                $.getJSON(url, qd, (bd) => {
                    if (!!bd.name) {
                        this.selectChildArea(bd.code, bd.lon, bd.lat, bd.name);
                        this.showChilds(bd.code);
                        this.lastCode = bd.code;
                        this.lastName = bd.name;
                    } else {
                        this.enterMain();
                    }
                });
            },
            // 进入广东省
            enterMain: function() {
                if (this.userName === 'test'){   //如果用户名为test,则左上角的地市鼠标移上去的时候不展开
                    return;
                }
                this.updateArea('广东省', '44');
                let qdata = { 'code': '44', 'type': 'city' };
                let childpoint = this;
                $.ajax({
                    type: 'post',
                    url: this.area_list.url,
                    data: qdata,
                    success: function(bdata) {
                        let obj = {
                            code: "44",
                            lat: 23.422825,
                            lon: 113.30765,
                            name: "广东省"
                        };
                        bdata.splice(0, 0, obj);
                        childpoint.cityList = bdata;
                    }
                });
            },
            selectCity: function(item, event) {
                let code = item.code;
                let url = this.childSystem[code];
                if (url) {
                    window.open(url);
                } else {
                    this.updateArea(item.name, code);
                    this.showCityPanel(true, event);
                    this.showChilds(code);
                    this.selectArea(code, item.lon, item.lat);
                    this.showParentName(item.name, code);
                }
            },
            getUserId: function() {
                $.ajax({
                    type: 'post',
                    async: false,  
                    url: this.dss_sj+'/login/login!findUser.action',
                    success: (bd) => {
                        // this.userId = bd.userId;
                        // this.updateUserId(bd.userId);
                        // this.lastName = bd.region_name;
                        // this.lastCode = bd.code;
                        // this.updateArea(this.lastName, this.lastCode);
                        this.userId = 19; 
                        this.lastName = '广东省';
                        this.lastCode = '44';
                        this.updateUserId(19);
                        this.updateArea('广东省', '44');

                        // this.userName = bd.name
                        // this.userId = bd.userId;
                        // this.updateUserId(bd.userId);
                        // this.lastName = bd.region_name;
                        // this.lastCode = bd.code;
                        // this.updateArea(this.lastName, this.lastCode);
                        console.log(this.userId);
                       // this.updateUserName('test');

                       // this.userName = 'test';
                        this.userName = '广东省';
                        this.userId = 19;
                        this.lastName = '广东省';
                        this.lastCode = '44';
                        this.updateUserId(19);
                        this.updateArea('广东省', '44');

                    }
                });
            }
        },
        ready: function() {
            this.getUserId();
            // 获取地址栏参数
            let hrefArr = location.getLocationParam();
            if (!!hrefArr) {
                if (!!hrefArr.code) this.getNameByCode(hrefArr.code);
                else this.getNameByPinYin(hrefArr.city);
            } else if (this.cityCode.length != 2) {
                this.getNameByCode(this.cityCode);
            } else {
                this.enterMain();
            }
        }

    }
</script>

<style scoped lang="less">
@import "../../assets/css/common.less";

.areaComp {
    position: absolute;
    top: 0px;
    left: 0px;
    width: auto;
    height: 30px;
    line-height: 30px;

    label {
        cursor: pointer;
        color: #DFDFDF;
        margin-left: 5px;
        display: inline-block;
        width: auto;
        height: 30px;
    }
}
.cityPanel-status {
    display: none;
}
.cityPanel {
    position: absolute;
    z-index: 5;
    left: 0;
    background-color: #fff;
    width: 335px;
    height: auto;
    -webkit-box-shadow: 0 2px 9px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 9px 0 rgba(0, 0, 0, .3);

    ul {
        width: 100%;
        height: auto;

        li {
            float: left;
            height: 25px;
            line-height: 25px;
            width: 45px;
            text-align: center;
            margin-right: 10px;
            list-style: none;
            cursor: pointer;
        }
    }
}
li:hover {
    color: @color;
}
.list_left_max {
    left: 50px;
}
.list_left_min {
    left: 50px;
}
.at_area_list {
    position: absolute;
    top: 0px;
    width: 600px;
    height: 30px;

    ul li {
        float: left;
        margin-right: 8px;
        color: #ddd;
    }
}
.town_List {
    position: absolute;
    top: 30px;
    left: 0px;
    width: 420px;
    background-color: #fff;
    border: 1px solid #ccc;
    z-index: 5;

    li {
        float: left;
        min-width: 80px;
        text-align: left;
        margin-left: 3px;
    }
}

/*big*/
.big .areaComp {
    height: 45px;
    line-height: 45px;
}
.big .cityPanel {
    width: 468px;

    ul {
        li {
            height: 38px;
            line-height: 38px;
            width: 68px;
        }
    }
}
.big .list_left_max {
    left: 80px;
}
.big .list_left_min {
    left: 80px;
}
</style>