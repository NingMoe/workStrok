<!-- 四库 -->
<template>
    <div class="toolFourLibrary">
        <div class="fourLibraryList">
            <ul>
                <li v-for="item in fourLibraryData" :class="[item.type==curLibrary?'activeLibrary':'']" @click="selectTab(item)">
                    <i :class="item.style"></i>
                    <label>{{item.text}}</label>
                    <span class="quantity">({{item.quantity}})</span>
                </li>
            </ul>
        </div>
        <div class="libraryContent  panelhover" v-show="searchWind">
            <!--<span class="triangle" :style="leftOf"></span><span class="triangle cover" :style="leftCover"></span>-->
            <div class="search-hd">
                <div class="search-bg"></div>
                <input type="text" v-model="searchvalue" class="search-input" placeholder="{{warnMsg}}">
                <em class="pholder"></em>
                <button v-if="searchvalue.length>0" class="search-button_clear" @click="clearContent()">清除</button>
                <button class="search-button" :class="{'two-button':searchvalue.length>0,'only-search':searchvalue.length==0}" @click="search()">搜索</button>
            </div>
            <div class="libraryList">
                <div class="ecaseif">
                    <ul>
                        <li><v-select :defname="'citys.proname'" :valname="'curCode'" :def="citys.proname" :list="citys.province" :width="99"></v-select></li>
                        <li><v-select :defname="'citys.cityname'" :valname="'curCode'" :def="citys.cityname" :list="citys.city" :width="99"></v-select></li>
                        <li><v-select :defname="'citys.countyname'" :valname="'curCode'" :def="citys.countyname" :list="citys.county" :width="99"></v-select></li>
                        <li><v-select :defname="'Types.typename'" :valname="'selectType'" :def="Types.typename" :list="Types.type" :width="99"></v-select></li>
                    </ul>
                </div>
                <div v-show="curLibrary=='plan'">
                    <!--<div class="ecaseif">
                        <ul>
                            <li><v-select :defname="'citys.proname'" :valname="'curCode'" :def="citys.proname" :list="citys.province" :width="99"></v-select></li>
                            <li><v-select :defname="'citys.cityname'" :valname="'curCode'" :def="citys.cityname" :list="citys.city" :width="99"></v-select></li>
                            <li><v-select :defname="'citys.countyname'" :valname="'curCode'" :def="citys.countyname" :list="citys.county" :width="99"></v-select></li>
                            <li><v-select :defname="'Types.typename'" :valname="'selectType'" :def="Types.typename" :list="Types.type" :width="99"></v-select></li>
                        </ul>
                    </div>-->
                    <table cellpadding="0" cellspacing="0">
                        <thead>
                            <tr>
                                <td v-for="item in fourLibraryData.plan.dataTitle">{{item}}</td>
                            </tr>
                        </thead>
                        <tbody v-for="item in fourLibraryData.plan.data">
                            <tr v-if="($index >= qxjStartPage && $index < qxjEndPage)" @click="selectItem(item)" @mouseenter="showPoint(item, $index)" @mouseleave="clearPoint()">
                                <td>{{item.title}}</td>
                                <td>{{typeMap[item.type]}}</td>
                                <td v-if="item.full_name===null">广东省</td>
                                <td v-else>{{item.full_name}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-show="curLibrary=='case'">
                    <!--<div class="ecaseif">
                        <ul>
                            <li><v-select :defname="'citys.proname'" :valname="'curCode'" :def="citys.proname" :list="citys.province" :width="99"></v-select></li>
                            <li><v-select :defname="'citys.cityname'" :valname="'curCode'" :def="citys.cityname" :list="citys.city" :width="99"></v-select></li>
                            <li><v-select :defname="'citys.countyname'" :valname="'curCode'" :def="citys.countyname" :list="citys.county" :width="99"></v-select></li>
                            <li><v-select :defname="'Types.typename'" :valname="'selectType'" :def="Types.typename" :list="Types.type" :width="90"></v-select></li>
                        </ul>
                    </div>-->
                    <table cellpadding="0" cellspacing="0">
                        <thead>
                            <tr>
                                <td v-for="item in fourLibraryData.case.dataTitle">{{item}}</td>
                            </tr>
                        </thead>
                        <tbody v-for="item in fourLibraryData.case.data">
                            <tr v-if="($index >= qxjStartPage && $index < qxjEndPage)" @click="selectItem(item)" @mouseenter="showPoint(item, $index)" @mouseleave="clearPoint()">
                                <td>{{item.title}}</td>
                                <td>{{item.type}}</td>
                                 <td v-if="item.full_name===null">广东省</td>
                                <td v-else>{{item.full_name}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-show="curLibrary=='laws'">
                    <!--<div class="ecaseif">
                        <ul>
                            <li><v-select :defname="'citys.proname'" :valname="'curCode'" :def="citys.proname" :list="citys.province" :width="99"></v-select></li>
                            <li><v-select :defname="'citys.cityname'" :valname="'curCode'" :def="citys.cityname" :list="citys.city" :width="99"></v-select></li>
                            <li><v-select :defname="'citys.countyname'" :valname="'curCode'" :def="citys.countyname" :list="citys.county" :width="99"></v-select></li>
                        </ul>
                    </div>-->
                    <table cellpadding="0" cellspacing="0">
                        <thead>
                            <tr>
                                <td v-for="item in fourLibraryData.laws.dataTitle">{{item}}</td>
                            </tr>
                        </thead>
                        <tbody v-for="item in fourLibraryData.laws.data" >
                            <tr v-if="($index >= qxjStartPage && $index < qxjEndPage)" @click="selectItem(item)" @mouseenter="showPoint(item, $index)" @mouseleave="clearPoint()"> 
                                <td>{{item.title}}</td>
                                <td v-if="item.full_name===null">广东省</td>
                                <td v-else>{{item.full_name}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-show="curLibrary=='expert'">
                    <!--<div class="ecaseif">
                        <ul>
                            <li><v-select :defname="'citys.proname'" :valname="'curCode'" :def="citys.proname" :list="citys.province" :width="99"></v-select></li>
                            <li><v-select :defname="'citys.cityname'" :valname="'curCode'" :def="citys.cityname" :list="citys.city" :width="99"></v-select></li>
                            <li><v-select :defname="'citys.countyname'" :valname="'curCode'" :def="citys.countyname" :list="citys.county" :width="99"></v-select></li>
                        </ul>
                    </div>-->
                    <table cellpadding="0" cellspacing="0">
                        <thead>
                            <tr>
                                <td style="width:100px" v-for="item in fourLibraryData.expert.dataTitle">{{item}}</td>
                            </tr>
                        </thead>
                        <tbody v-for="item in fourLibraryData.expert.data">
                            <tr v-if="($index >= qxjStartPage && $index < qxjEndPage)" @click="selectItem(item)" @mouseenter="showPoint(item, $index)" @mouseleave="clearPoint()">
                                <td>{{item.name}}</td>
                                <td>{{item.level}}</td>
                                <td>{{item.position_type}}</td>
                                <td>{{item.type}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="sitepage">
                    <span>{{curPage}}页/共{{qxjCountPage}}页</span>
                    <span>共{{qxjTotal}}条数据</span>
                    <a @click="qxjRainPage('next')" class="btnCur">下页</a>
                    <a @click="qxjRainPage('prev')" class="btnCur">上页</a>
                    <div class="loading" v-show="isQxjLoading"></div>
                </div>
            </div>
        </div>
    </div>
    <v-library v-if="hasCase" :filename="fileName" :filetitle="fileTitle"></v-library>
</template>

<script>

    import Select from '../../common/Select'
    import lmap from '../../../util/lmap/lmap'
    import LibrarySwf from '../../layout/tools/LibrarySwf'
    import config from '../../../config'
    import { updateParam } from '../../../vuex/store';

    export default {
        components: { 'v-select': Select, 'v-library': LibrarySwf },
        data() {
            return {
                citys: {
                    proname:'广东省',
                    provinceModel:'',
                    province: [{text: '广东省',value: '440000'}],
					cityname:'选择市',
                    cityModel:'default',
                    city: [{text: '选择市',value: 'default'}],
					countyname:'选择县',
                    countyModel:'default',
                    county: [{text: '选择县',value: 'default'}],
					townname:'选择镇',
                    townModel:'default',
                    town: [{text: '选择镇',value: 'default'}]
                },
                curCode: '',
                selectType: '',
                typeMap: { '10000': '突发事件', '11000': '自然灾害', '12000': '事故灾难', '14000': '安全事件', '19000': '其它突发事件', '13000': '公共卫生事件' },
                Types: {
                    typename: '事件类型',
                    typemodel: 'default',
                    type: [
                        { text: '事件类型', value: '' }, 
                        { text: '自然灾害', value: '11000' }, 
                        { text: '事故灾难', value: '12000' }, 
                        { text: '安全事件', value: '14000' }, 
                        { text: '其它突发事件', value: '19000' }, 
                        { text: '公共卫生事件', value: '13000' }
                    ]
                },
                fourLibraryData: {
                    plan: {
                        text: '预案库',
                        type: 'plan',
                        quantity: 0,
                        style: "",
                        data: [],
                        dataTitle: ['标题', '类型', '行政级别']
                    },
                    case: {
                        text: '案例库',
                        type: 'case',
                        quantity: 0,
                        style: "",
                        data: [],
                        dataTitle: ['标题', '类型', '行政级别']
                    },
                    laws: {
                        text: '法规库',
                        type: 'laws',
                        quantity: 0,
                        style: "",
                        data: [],
                        dataTitle: ['标题', '行政区划']
                    },
                    expert: {
                        text: '专家库',
                        type: 'expert',
                        quantity: 0,
                        style: "",
                        data: [],
                        dataTitle: ['专家名称', '专家级别','职称类型','应急类型']
                    },
                    materials: {
                        text: '救援物资库',
                        type: 'materials',
                        quantity: 0,
                        style: "",
                        data: [],
                        dataTitle: ['序号', '标题']
                    },
                    team: {
                        text: '救援队伍库',
                        type: 'team',
                        quantity: 0,
                        style: "",
                        data: [],
                        dataTitle: ['序号', '标题']
                    }
                },
                searchvalue: "",
                content: [],
                curLibrary: 'plan',
                warnMsg: "请输入标题关键字",
                provinceDefault: "广东省",
                curPage: 1,
                qxjCountPage: 0,
                qxjTotal: 0,
                fenye: 10,
                qxjStartPage: 0,
                qxjEndPage: 10,
                fileName: '',
                fileTitle: '',
                hasCase: false,
                typeFlag:'',  // 记录点击了应急物资还是救援队伍
                searchWind: true,  // 应急物资和救援队伍不弹查询框
                materialsType:[],   // 应急物资的POI类型
                teamType:[]     // 救援力量的POI类型
            }
        },
        computed: {
            leftOf: function() {
                let obj = {};
                if (this.curLibrary === 'plan') obj['left'] = '30px';
                else if (this.curLibrary === 'case') obj['left'] = 30 + 59 + 'px';
                else if (this.curLibrary === 'laws') obj['left'] = 30 + 59 * 2 + 'px';
                else if (this.curLibrary === 'expert') obj['left'] = 30 + 59 * 3 + 'px';
                else if (this.curLibrary === 'materials') obj['left'] = 30 + 64 * 4 + 'px';
                else if (this.curLibrary === 'team') obj['left'] = 30 + 68 * 5 + 'px';
                return obj;
            },
            leftCover: function() {
                let obj = {};
                if (this.curLibrary === 'plan') obj['left'] = '31px';
                else if (this.curLibrary === 'case') obj['left'] = 31 + 59 + 'px';
                else if (this.curLibrary === 'laws') obj['left'] = 31 + 59 * 2 + 'px';
                else if (this.curLibrary === 'expert') obj['left'] = 31 + 59 * 3 + 'px';
                // else if (this.curLibrary === 'materials') obj['left'] = 31 + 64 * 4 + 'px';
                // else if (this.curLibrary === 'team') obj['left'] = 31 + 68 * 5 + 'px';
                return obj;
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                cityCode: state => state.cityCode,
                collectPoiType: state => state.poi.collectPoiType
            },
            actions: {
				updateParam
			}
        },
        watch: {
            curCode: function() {
                if(this.curCode==='default')
                    this.curCode = '44';
                var code = this.curCode.replace('00', '').replace('00', '');
                var len = code.length;
                if (len == 2) this.clearCityList();
                else if (len == 4) this.clearCountyList();
                else if (len == 6) this.clearTownList();
                this.changeCitys(this.curCode);
                this.search();
            },
            curLibrary: function() {
                this.returnReset();
                if(this.curLibrary !== 'materials' || this.curLibrary !== 'team'){
                    this.changeCitys(this.cityCode);
                    this.search();
                }
            },
            selectType: function() {
                this.search();
            }
        },
        methods: {
            selectTab: function(item) {
                let arr = [];
                this.updateParam('poi','controlTypes',arr);
                if(item.type === 'materials'  || item.type === 'team'){
                    this.searchWind = false;
                    if(item.type !== this.typeFlag){
                        this.typeFlag = item.type;
                        this.curLibrary = item.type;
                        if(item.type === 'materials'){
                            arr = this.materialsType;
                        }else{
                            arr = this.teamType;
                        }
                        this.updateParam('poi','controlTypes',arr);
                    }else{
                        this.typeFlag = '';
                        this.curLibrary = '';
                        arr = [];
                        this.updateParam('poi','controlTypes',arr);
                    }
                    return;
                }
                this.searchWind = true;
                this.curLibrary = item.type;
                if (item.type == "expert") this.warnMsg = "请输入专家名称关键字";
                else this.warnMsg = "请输入标题关键字";
                this.search();
            },
            clearContent: function() {
                this.searchvalue = '';
            },
            changeCitys: function(code) {
                var url = this.dss+'/emergency/emergency!findNameByAreaCode.action';
                var rdata = { 'areaCode': code };
                $.getJSON(url, rdata, (bdata) => {
                    var areaType = '';
                    if (bdata.length > 0)
                        areaType = bdata[0].type;
                    if (!!this.citys[areaType]) {
                        var resArr = this.citys[areaType][0];
                        var citysArr = [];
                        citysArr.push(resArr);
                        bdata.forEach((item) => {
                            var itemObj = {};
                            itemObj.text = item.text;
                            itemObj.value = item.value;
                            citysArr.push(itemObj);
                        });
                        this.citys[areaType] = citysArr;
                    }
                });
            },
            /**选择省时，清除市和县数据 */
            clearCityList: function() {
                this.citys.cityname = '选择市';
                this.citys.cityModel = 'default';
                this.citys.city = [{ text: '选择市', value: 'default' }];
                this.clearCountyList();
                // this.clearTownList();
                // this.changeCitys(this.cityCode);
            },
            /**选择市时，清除县数据 */
            clearCountyList: function() {
                this.citys.countyname = '选择县';
                this.citys.countyModel = 'default';
                this.citys.county = [{ text: '选择县', value: 'default' }];
                // this.clearTownList();
            },
            /**选择市时，清除县和镇数据 */
            clearTownList: function() {
                this.citys.townname = '选择镇街';
                this.citys.townModel = 'default';
                this.citys.town = [{ text: '选择镇街', value: 'default' }];
            },
            /**切换回预案和案例,法规、专家库时，重置查询条件*/
            returnReset: function() {
                   this.citys.proname = '广东省';
                   this.citys.provinceModel = '';
                   this.citys.province = [{text: '广东省',value: '440000'}];
				   this.citys.cityname = '选择市';
                   this.citys.cityModel = 'default';
                   this.citys.city = [{text: '选择市',value: 'default'}];
				   this.citys.countyname = '选择县';
                   this.citys.countyModel = 'default';
                   this.citys.county = [{text: '选择县',value: 'default'}];
                // this.citys.county = [{ text: '选择区', value: '440605' }];
                this.clearTownList();
            },
            selectItem: function(item) {
                this.fileTitle = item.title;
                this.fileName = item.file_name;
                this.hasCase = true;
            },
            showPoint: function(item, index) {
                if (item.lon && item.lat) {
                    this.clearPoint();
                    let iconUrl;
                    if (index === 'lonlat') {
                        iconUrl = 'http://10.148.16.56/topic/little/search/point.png';
                    } else if (Object.prototype.toString.call(index) === '[object Number]') {
                        iconUrl = 'http://10.148.16.56/topic/little/search/point' + (parseInt(index % 8) + 1) + '.png';
                    }
                    var style = {
                        anchor: [9, 0],
                        iconUrl: iconUrl,
                        iconSize: [18, 28],
                        fontColor: 'red',
                        fontSize: '12px',
                        outColor: 'white',
                        outWidth: 3,
                        text: item.paramVal,
                        offsetY: 15,
                        offsetX: 10
                    };
                    lmap.icon.addIcon(this.iconVector, style, Number(item.lon), Number(item.lat));
                }
            },
            clearPoint: function() {
                lmap.icon.clear(this.iconVector);
            },
            search: function() {
                if (!this.curCode) this.curCode = this.cityCode;
                if (this.curLibrary === 'plan') this.initPlan();
                else if (this.curLibrary === 'case') this.initCase();
                else if (this.curLibrary === 'laws') this.initLaws();
                else if (this.curLibrary === 'expert') this.initExpert();
            },
            initPlan: function() {
                let reqParam = { 'areaCode': this.curCode, 'libraryClassify': this.selectType, 'searchValue': '%' + this.searchvalue + '%'};
                $.ajax({
                    url: this.dss+'/library/library!getPlanLibraryList.action',
                    type: 'post',
                    dataType: 'json',
                    data: reqParam,
                    success: (json) => {
                        this.fourLibraryData.plan.data = json;
                        // this.fourLibraryData.plan.quantity = json.length;
                        this.qxjTotal = json.length;
                        this.qxjCountPage = Math.ceil(this.qxjTotal / this.fenye);
                    }
                });
            },
            initCase: function() {
                let reqParam = {
                    'areaCode': this.curCode+'%',
                    'libraryClassify': '%'+this.selectType+'%',
                    'searchValue': '%' + this.searchvalue + '%'
                };
                $.ajax({
                    url: this.dss+'/library/library!getCaseLibraryList.action',
                    type: 'post',
                    dataType: 'json',
                    data: reqParam,
                    success: (json) => {
                        this.fourLibraryData.case.data = json;
                        // this.fourLibraryData.case.quantity = json.length;
                        this.qxjTotal = json.length;
                        this.qxjCountPage = Math.ceil(this.qxjTotal / this.fenye);
                    }
                });
            },
            initLaws: function() {
                let reqParam = {
                    'areaCode': this.curCode,
                    'searchValue': '%' + this.searchvalue + '%'
                };
                $.ajax({
                    url: this.dss+'/library/library!getLawLibraryList.action',
                    type: 'POST',
                    dataType: 'json',
                    data: reqParam,
                    success: (json) => {
                        this.fourLibraryData.laws.data = json;
                        // this.fourLibraryData.laws.quantity = json.length;
                        this.qxjTotal = json.length;
                        this.qxjCountPage = Math.ceil(this.qxjTotal / this.fenye);
                    }
                });
            },
            initExpert: function() {
                let reqParam = {
                    'areaCode': this.curCode,
                    'searchValue': '%' + this.searchvalue + '%'
                };
                $.ajax({
                    url: this.dss+'/library/library!getExpertLibraryList.action',
                    type: 'POST',
                    dataType: 'json',
                    data: reqParam,
                    success: (json) => {
                        this.fourLibraryData.expert.data = json;
                        // this.fourLibraryData.expert.quantity = json.length;
                        this.qxjTotal = json.length;
                        this.qxjCountPage = Math.ceil(this.qxjTotal / this.fenye);
                    }
                });
            },
            initQuality: function() {
                let poiType = this.collectPoiType;
                poiType.forEach((it) =>{
                    let name = it.name;
                    if(name === '应急物资'){
                        this.materialsType = this.getPoiType(it.child);
                    }
                    if(name === '救援力量'){
                        this.teamType = this.getPoiType(it.child);
                    }
                });
                $.ajax({
                    url: this.dss+'/library/library!initQuality.action',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        'areaCode': this.curCode,
                        'materials': this.materialsType.toString(),
                        'team': this.teamType.toString()
                    },
                    success: (json) => {
                        this.fourLibraryData.plan.quantity = json[0].count;
                        this.fourLibraryData.case.quantity = json[1].count;
                        this.fourLibraryData.laws.quantity = json[2].count;
                        this.fourLibraryData.expert.quantity = json[3].count;
                        this.fourLibraryData.materials.quantity = json[4].count;
                        this.fourLibraryData.team.quantity = json[5].count;
                        this.initPlan();
                    }
                });
            },
            qxjRainPage: function(type) {
                let startPage = this.qxjStartPage;
                let endPage = this.qxjEndPage;
                let countPage = this.qxjCountPage;
                let len = this.qxjTotal;
                if (type === 'next') {
                    startPage += this.fenye;
                    endPage += this.fenye;
                    if (((len - endPage) % this.fenye) >= 0 && ((len - endPage) % this.fenye) < 1) {
                        endPage = len;
                    }
                    if (startPage >= len) {
                        return;
                    }
                } else if (type === 'prev') {
                    if (startPage <= 0) {
                        return;
                    }
                    startPage -= 10;
                    endPage -= 10;
                } else if (type === 'start') {
                    startPage = 0;
                    endPage = 10;
                }
                this.qxjStartPage = startPage;
                this.qxjEndPage = endPage;
                this.curPage = startPage / this.fenye + 1;
            },
            getPoiType: function(data){
                let typeArr = [];
                for(var k in data){
                    typeArr.push(data[k].type)
                }
                return typeArr;
            }
        },
        ready: function() {
            this.curCode = this.cityCode;
            this.initQuality(); //初始化面板内容
            var map = config.getParam('map');
            var iconVector = lmap.icon.initVector(map);
            this.map = map;
            this.iconVector = iconVector;
        },
        detached: function() {
            lmap.icon.clear(this.iconVector);
            this.map.removeLayer(this.iconVector);
            delete this.iconVector;
            delete this.map;
        }
    }
</script>
<style>
    .toolFourLibrary {
    width: 383px;
    position: absolute;
    right: 0px;
    top: 30px;
    z-index: 4;
    height: 300px;
}
.fourLibraryList {
    background-color: #fff;
    height: 60px;
    line-height: 30px;
    padding-left: 0px;
    -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
.fourLibraryList ul li {
    float: left;
    /* margin-right: -5px; */
    width: 33%;
    text-align: left;
    cursor:pointer;
}
.fourLibraryList ul li label{cursor:pointer}
.fourLibraryList ul li i {
    display: inline-block;
    width: 16px;
    height: 16px;
    float: left;
    margin-right: -2px;
    margin-top: 6px;
    background-size: 100% auto !important;
}
.fourLibraryList ul li .plan {
    background: url("../../../assets/img/fourlibrary/n1.png") no-repeat;
}
.fourLibraryList ul li .case {
    background: url("../../../assets/img/fourlibrary/n2.png") no-repeat;
}
.fourLibraryList ul li .laws {
    background: url("../../../assets/img/fourlibrary/n3.png") no-repeat;
}
.fourLibraryList ul li .emergencyKnowledge {
    background: url("../../../assets/img/fourlibrary/n4.png") no-repeat;
}
span.quantity {
    color: red;
}
.fourLibraryList ul li:hover label {
    color: rgb(24, 132, 207);
}
.fourLibraryList ul li:hover .plan {
    background: url("../../../assets/img/fourlibrary/a1.png") no-repeat;
}
.fourLibraryList ul li:hover .case {
    background: url("../../../assets/img/fourlibrary/a2.png") no-repeat;
}
.fourLibraryList ul li:hover .laws {
    background: url("../../../assets/img/fourlibrary/a3.png") no-repeat;
}
.fourLibraryList ul li:hover .emergencyKnowledge {
    background: url("../../../assets/img/fourlibrary/a4.png") no-repeat;
}
.libraryContent {
    background-color: #fff;
    margin-top: 3px;
    -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
.search-hd {
    background-color: #ecf2fc;
    padding: 2px;
    position: relative;        /*overflow:hidden;*/
    height: 31px;
    z-index: 5;
}
.search-hd .search-bg {
    width: 298px;
    height: 32px;
    background-color: #fff;
    position: absolute;
    left: 2px;
    top: 2px;
}

.search-hd .search-input {
    width: 82%;
    height: 32px;
    text-indent: 20px;
    z-index: 3;
    border: 0;
    float: left;
    color: @colorH;
    position: relative;
    z-index: 2;
    background: 0;
    margin-left: 10px;
    list-style-type: none;
    -webkit-text-size-adjust: none;
    outline: none;
}
input[type="text"]::-ms-clear {
    display: none;
}
.search-hd .search-button {
    height: 34px;
    line-height: 34px;
    right: 2px;
    top: 2px;
    border: 0;
    z-index: 6;
    color: #414e61;
    background: 0 0;
    outline: 0;
    position: absolute;
    cursor: pointer;
    z-index: 1;
    text-align: center;
}
.search-hd .search-button:hover {
    color: #1F7ED0;
}
.search-hd .two-button {
    width: 40px;
    right: 4px;
}
.search-hd .only-search {
    width: 75px;
}
.search-hd .pholder {
    display: inline-block;
    height: 30px;
    width: 25px;
    position: absolute;
    left: 8px;
    background: url("../../../assets/img/common/search.png") 0 8px no-repeat;
    z-index: 1;
}
.search-hd .warn-msg {
    display: inline-block;
    padding: 2px 0 2px 0px;
    color: #999;
    position: absolute;
    top: 8px;
    z-index: 1;
    height: 16px;
    left: 30px;
}
.search-hd .warn-msgright {
    display: inline-block;
    padding: 2px 0 2px 0px;
    color: #999;
    position: absolute;
    top: 8px;
    z-index: 9;
    height: 16px;
    right: 90px;
}
.search-hd .divselect {
    margin-right: 2px !important;
    width: 80px !important;
    background: #fff;
    margin-top: 1px;
}
.search-hd .divselect cite {
    border: 0;
}
.search-hd ul li {
    float: left;
}
.search-hd ul li:last-child {
    background: #fff !important;
    height: 22px;
    width: 39.31%;
    margin-top: 1px;
    margin-left: 1px;
}
.search-button_clear {
        height: 34px;
        line-height: 34px;
        right: 15px;
        top: 2px;
        border: 0;
        z-index: 6;
        color: #27303f;
        background: 0 0;
        outline: 0;
        position: absolute;
        cursor: pointer;
        z-index: 1;
        text-align: center;
        width:89px;
}
.search-button_clear:hover{
    color:#1F7ED0;
}
.activeLibrary label {
    color: rgb(24, 132, 207);
}
.activeLibrary .plan {
    background: url("../../../assets/img/fourlibrary/a1.png") no-repeat;
}
.activeLibrary .case {
    background: url("../../../assets/img/fourlibrary/a2.png") no-repeat;
}
.activeLibrary .laws {
    background: url("../../../assets/img/fourlibrary/a3.png") no-repeat;
}
.activeLibrary .emergencyKnowledge {
    background: url("../../../assets/img/fourlibrary/a4.png") no-repeat;
}
.libraryList table {
    width: 100%;
    background: #fff;
    z-index: 4;
    table-layout:fixed;
}
.libraryList table thead {
    background: #ecf2fc;
}
.libraryList table td {
    height: 22px;
    line-height: 22px;
    text-align: center;
    border: 1px solid #E5E8EC;
    white-space:nowrap; 
    overflow:hidden;
    text-overflow:ellipsis;
}
.libraryList table td:first-child{width:200px}
.libraryList table thead td {
    border-top: 0;
}
.sitepage {
    margin-top: 5px;
    height: 30px;
    line-height: 30px;
}
.sitepage span {
    margin-right: 2px;
    float: left;
}
.loading {
    display: inline-block;
    background: url("../../../assets/img/common/loading.gif") no-repeat;
    width: 16px;
    height: 16px;
    margin-top: 2px;
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
.btnCur {
    display: inline-block;
    height: 22px;
    line-height: 22px;
    padding: 0px 8px;
    cursor: pointer;
    margin-right: 3px;
    color: #414e61;
    float: right;
}
.btnCur:hover {
    color: #E5E8EC;
    border-radius: 3px;
    -webkit-border-radius: 3px;
    -ms-border-radius: 3px;
    -moz-border-radius: 3px;
    -webkit-transition: box-shadow 0.4s;
    transition: box-shadow 0.4s;
}
.triangle {
    position: absolute;
    width: 0px;
    height: 0px;
    line-height: 0px;/*为了防止ie下出现题型*/
    border-bottom: 10px solid #ecf2fc;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    top: 30px;
    z-index: 10;
}
.cover {
    border-bottom: 10px solid #fff;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    top: 33px;
    z-index: 11;
}
.libraryList .ecaseif .divselect{
    width:90px
}
.big .toolFourLibrary{
		top:45px;
		width:554px;
	}
.big .search-hd .search-input{
	font-size:18px;
	height:40px;
}
.big .search-hd{
	height:40px;
}
.big .search-hd .search-bg{
	height:40px;
	width:450px;
}
.big .search-hd .pholder{
	height:40px;
	background-position: 0px 14px !important;
}
.big .search-hd .only-search{
	font-size:18px;
	height:42px;
	line-height:42px;
}
.big .libraryList .ecaseif .divselect{
	width:133px;
}
.big .search-hd .warn-msgright{right:110px;}
.big .libraryList table td{
	height: 30px;
	line-height: 30px;
}
</style>