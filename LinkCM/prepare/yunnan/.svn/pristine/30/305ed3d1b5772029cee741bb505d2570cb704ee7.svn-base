<template>
    <div>
        <v-sitelayer></v-sitelayer>
        <v-sitewarn></v-sitewarn>
        <div class="qxj-rain-list" v-if="isQxjRainPanel">
        	<a class="Close" @click="isQxjRainPanel = false"></a>
            <table cellpadding="0" cellspacing="0">
                <thead>
                    <tr><td>序号</td><td>站点</td><td>名称</td><td>过去1小时</td><td>过去3小时</td><td>过去6小时</td><td>过去12小时</td><td>过去24小时</td><td>未来1小时</td><td>未来2小时</td><td>未来3小时</td><td>未来1天</td><td>未来3天</td></tr>
                </thead>
                <tbody v-for="item in qxjRainItems">
                    <tr v-if="($index >= qxjStartPage && $index < qxjEndPage)"><td>{{$index + 1}}</td><td>{{item.no}}</td><td>{{item.site.title}}</td><td>{{item.rain1hour}}</td><td>{{item.rain3hour}}</td><td>{{item.rain6hour}}</td><td>{{item.rain12hour}}</td><td>{{item.rain24hour}}</td><td>{{item.rain4feature1hour}}</td><td>{{item.rain4feature2hour}}</td><td>{{item.rain4feature3hour}}</td><td>{{item.rain4feature3day}}</td><td>{{item.rain4feature3day}}</td></tr>
                </tbody>
            </table>
            <div class="sitepage">
            	<span>{{qxjStartPage / 20 + 1}}页/共{{qxjCountPage}}页</span>
            	<span>共{{qxjRainItemsLen}}条数据</span>
            	<a @click="qxjRainPage('start')" class="btnhover">首页</a>
            	<a @click="qxjRainPage('prev')" class="btnhover">上页</a>
            	<a @click="qxjRainPage('next')" class="btnhover">下页</a>
            	<a @click="qxjRainPage('end')" class="btnhover">尾页</a>
                <div class="loading" v-show="isQxjLoading"></div>
            </div>                
        </div>
        <div class="site" v-show="winStatus">
        	<a class="Close" @click="close()"></a>
            <div class="elements title">
            	<label class="name">要素：</label>
                <ul>
                    <li v-for="item in elementItems">
                        <label class="inputlabel"><input type="checkbox" v-model="elements" :value="$key" />{{item}}</label>
                    </li>
                </ul>
            </div>
            <div class="panel">
                <div class="nav">
                    <div class="element-tab">
                        <ul>
                            <li :class="isRainPanel ? 'on' : ''" @click="(isRainPanel = true)">雨量</li>
                            <li :class="!isRainPanel ? 'on' : ''" @click="(isRainPanel = false)">水位</li>
                            <li v-show="!isRainPanel" class="setRight" @click="waterItemsPage(true)">>></li>
                            <li v-show="!isRainPanel" class="setRight" @click="waterItemsPage(false)"><<</li>
                        </ul>
                    </div>
                </div>
                <div class="main margin05">
                    <div class="rain-panel" v-show="isRainPanel">
                    	<div class="rainif">
	                        <div class="time-select">
	                            <label>选择时间：</label>
	                            <v-select :defname="'beforeTime'" :def="beforeTime" :initvalue="beforeItems[0].text" :list="beforeItems"></v-select>
	                            <a @click="getQxjRainList()" class="btnhover">详细列表</a>
	                        </div>
	                        <div class="time-chose">
	                            <label>时间范围：</label>
	                            <div class="inline-block">
	                                <ul class="time-list">
		                                <li class="timedate">
		                                	<span>从</span>
		                                	<input type="text" :value="startTime" :time-val="startTimeStr" id="site-start-time" @click="selectStartTime()" readonly="readonly" />
		                                </li>
		                                <li class="timedate">
		                                	<span>至</span>
		                                	<input type="text" :value="endTime" :time-val="endTimeStr" id="site-end-time" @click="selectEndTime()" readonly="readonly" />
		                                </li>
	                                </ul>
	                            </div>
	                        </div>
	                        <div class="rain-scope">
	                        	<label class="rain-chose-title">雨量范围：</label>
	                        	<div class="rain-chose">
		                            <div class="slider">
		                                <span class="num">{{rainMin}}</span>
		                                <div id="rain-slider" class="rain-slider inline-block"></div>
		                                <span class="num">{{rainMax}}</span>
		                            </div>
		                            <div class="except">
		                                <label class="inputlabel"><input type="checkbox" v-model="rainExcept" />
		                                <span>250以上</span></label>
		                            	<a class="btnhover" @click="getRainList()" class="inline-block">查询</a>
		                            </div>
		                        </div>
	                        </div>
	                    </div>
                        <div class="rain-list">
                        	<div class="table-title">雨量信息（单位：mm）</div>
	                        <div class="rainlist-panel">
	                            <div class="city">
	                                <table cellpadding="0" cellspacing="0">
	                                    <thead>
	                                        <tr><td>地区</td><td>站点数量</td><td>最高降雨</td><td>平均降雨</td></tr>
	                                    </thead>
	                                </table>
	                                <div class="tbody">
		                                <table cellpadding="0" cellspacing="0">
		                                	 <tbody>
		                                        <tr v-for="item in cityItems" :class="{'area-select':item.isSelect}" @click="showArea(item, 'county')" @mouseenter="showDetail('county', $key)" @mouseleave="hideDetail('county')"><td>{{$key}}</td><td>{{item.siteCount}}</td><td>{{item.maxRain}}</td><td>{{item.avgRain}}</td></tr>
		                                    </tbody>
		                                </table>
		                            </div>
	                            </div>
	                            <div class="county" v-show="isCounty">
	                                <table cellpadding="0" cellspacing="0">
	                                    <thead>
	                                        <tr><td>地区</td><td>站点数量</td><td>最高降雨</td><td>平均降雨</td></tr>
	                                    </thead>
	                                </table>
	                                <div class="tbody">
		                                <table cellpadding="0" cellspacing="0">
		                                	<tbody>
		                                        <tr v-for="item in countyItems" :class="{'area-select':item.isSelect}" @click="showArea(item, 'town')" @mouseenter="showDetail('town', $key)" @mouseleave="hideDetail('town')"><td>{{$key}}</td><td>{{item.siteCount}}</td><td>{{item.maxRain}}</td><td>{{item.avgRain}}</td></tr>
		                                    </tbody>
		                                </table>
		                            </div>
	                            </div>
	                            <div class="town" v-show="isTown">
	                                <table cellpadding="0" cellspacing="0">
	                                    <thead>
	                                        <tr><td>地区</td><td>站点数量</td><td>最高降雨</td><td>平均降雨</td></tr>
	                                    </thead> 
	                                </table>
	                                <div class="tbody">
		                                <table cellpadding="0" cellspacing="0">
		                                	<tbody>
		                                        <tr v-for="item in townItems" :class="{'area-select':item.isSelect}" @click="showArea(item)" @mouseenter="showDetail('area')" @mouseleave="hideDetail('area')"><td>{{$key}}</td><td>{{item.siteCount}}</td><td>{{item.maxRain}}</td><td>{{item.avgRain}}</td></tr>
		                                    </tbody>
		                                </table>
		                            </div>
	                            </div>
	                        </div>
                        </div>
                        <div class="rain-list">
	                        <div class="table-title">量级统计（单位：mm）</div>
	                        <div class="range-list">
	                            <div class="range">
	                                <table cellpadding="0" cellspacing="0">
	                                    <thead>
	                                        <tr><td>雨量范围</td><td>站点数量</td><td>所占百分比</td></tr>
	                                    </thead>
	                                </table>
	                                <div class="rain_tbody">
		                                <table cellpadding="0" cellspacing="0">
		                                	<tbody>
		                                        <tr v-for="item in rainRangeItems" :class="{'area-select':item.isSelect}" @click="getRangeDetail($key)"><td>{{$key}}</td><td>{{item.siteCount}}</td><td>{{item.percent}}</td></tr>
		                                    </tbody>
		                                </table>
		                            </div>
	                            </div>
	                            <div class="range-detail" v-if="rangeDetailItems[0] !== undefined">
	                                <a class="Close" @click="closeRainRange()"></a>
	                                <table cellpadding="0" cellspacing="0">
	                                    <thead>
	                                        <tr><td>站点号</td><td>站点名称</td><td>雨量</td></tr>
	                                    </thead>
	                                </table>
	                                <div class="rain_tbody">
		                                <table cellpadding="0" cellspacing="0">
		                                	<tbody>
		                                        <tr v-for="item in rangeDetailItems" :class="{'area-select':item.isSelect}" @click="selectSite(item)"><td>{{item.siteCode}}</td><td title="{{item.siteName}}">{{item.siteName}}</td><td>{{item.rainValue}}</td></tr>
		                                    </tbody>
		                            	</table>
		                           	</div>
	                            </div>
	                        </div>
                    	</div>
                    </div>
                    
                    <div class="water-panel" v-show="!isRainPanel">
                        <div class="">
                            <table cellpadding="0" cellspacing="0">
                                <thead>
                                    <tr><td>站点号</td><td>站点名称</td><td>水位</td></tr>
                                </thead>
                                <tbody v-for="item in waterItems">
	                                <tr v-if="($index >= startPage && $index < endPage)"><td>{{item.no}}</td><td>{{item.site.title}}</td><td>{{item.waterLevel}}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

     <!--鼠标移上弹出框-->
    <div class="siteInfo" :style="getPathPosition" v-if="moveWinStatus">
        <div v-if="curPoint.type==='sw'||curPoint.type==='swen'">
            <div class="title nullbg">{{curPoint.name}}(水位信息)</div>
            <div class="popTab popTaBorder">
                <ul class="site-water-ui">
                    <li>站点号：{{curPoint.siteID}}</li>
                    <li>类型：水位站</li>
                    <li>经度：{{curPoint.lon}}</li>
                    <li>纬度：{{curPoint.lat}}</li>
                    <li>水位：--</li>
                </ul>
            </div>
        </div>
        <div class="site-min-panel poiPop" v-if="curPoint.type==='gj'||curPoint.type==='qy'">
            <div class="title nullbg">{{curPoint.name}}(雨量信息)</div>
            <div class="popTab popTaBorder">
                <div class="title">站点信息</div>
                <div class="site-min-ui">
                    <div class="title nullbg">
                        <span>站点号：{{curPoint.siteID}}</span>
                        <span v-if="curPoint.type==='qy'">    类型：区域站</span>
                        <span v-if="curPoint.type==='gj'">    类型：国家站</span>
                    </div>
                    <div class="info">
                        <span>过去雨量</span>
                        <table cellpadding="0" cellspacing="0">
                            <tr><td>1小时</td><td>6小时</td><td>12小时</td><td>24小时</td></tr>
                      		<tr><td>{{siteCurRain.rain1hour}}</td><td>{{siteCurRain.rain6hour}}</td><td>{{siteCurRain.rain12hour}}</td><td>{{siteCurRain.rain24hour}}</td></tr>
                        </table>
                        <span>未来雨量</span>
                        <table cellpadding="0" cellspacing="0">
                            <tr><td>1小时</td><td>6小时</td><td>24小时</td><td>72小时</td></tr>
                            <tr><td>{{siteFutureRain.rain1hour}}</td><td>{{siteFutureRain.rain6hour}}</td><td>{{siteFutureRain.rain1day}}</td><td>{{siteFutureRain.rain3day}}</td></tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import { updateParam } from '../../vuex/store'
    import TimeUtil from '../../util/tools/TimeUtil'
    import '../../util/timepicker/timepicker'
    import Select from '../common/Select'

    import lmap from '../../util/lmap/lmap'
    import config from '../../config'

    import 'jquery-ui/ui/widgets/slider'
    import 'jquery-ui/themes/base/slider.css'
    import 'jquery-ui/themes/base/theme.css'

    import SiteLayer from './SiteLayer'
    import SiteWarn from './SiteWarn'

    export default {

        components: { 'v-sitelayer': SiteLayer, 'v-sitewarn': SiteWarn, 'v-select':Select},

        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                cityCode: state => state.cityCode,
                areaName: state => state.areaName,
                dateTime: state => state.site.dateTime,
                winStatus: state => state.site.winStatus,
                sysTime: state => state.time.sysTime,
                siteData: state => state.site.data,
                siteFlag: state => state.site.siteFlag
            },
            actions:{
            	updateParam
            }
        },

        data () {
            return {
            	map: config.getParam('map'),
            	layer: undefined,
                elementItems: { 'wind': '风', 'temp': '温度', 'rain': '雨量' }, // ,'province':'全省观测站'
				elements: ['wind', 'rain', 'temp'],
				beforeItems: [
					{ 'value': '-15', 'text': '过去15分钟' }, 
					{ 'value': '-30', 'text': '过去30分钟' }, 
					{ 'value': '-60', 'text': '过去1小时' }, 
					{ 'value': '-180', 'text': '过去3小时' }, 
					{ 'value': '-360', 'text': '过去6小时' }, 
					{ 'value': '-720', 'text': '过去12小时' }, 
					{ 'value': '-1440', 'text': '过去24小时' }
				],
				cityItems: {},
				countyItems: {},
				townItems: {},
				rainRangeItems: {},
				rangeDetailItems: [],
				qxjRainItems: [],
				waterItems: [],
				startTime: TimeUtil.format(TimeUtil.clearMMSS(TimeUtil.addTime(this.sysTime, -1, 'dd')), 'yyyy-MM-dd HH:mm'),
				endTime: TimeUtil.format(TimeUtil.clearMMSS(this.sysTime), 'yyyy-MM-dd HH:mm'),
				startTimeStr: TimeUtil.format(TimeUtil.clearMMSS(TimeUtil.addTime(this.sysTime, -1, 'dd')), 'yyyyMMddHHmmss'),
				endTimeStr: TimeUtil.format(TimeUtil.clearMMSS(this.sysTime), 'yyyyMMddHHmmss'),
				beforeTime: '-1440',
				isCounty: false,
				isTown: false,
				rainMin: 0,
				rainMax: 250,
				isRainPanel: true,
				startPage: 0,
				endPage: 10,
				qxjStartPage: 0,
				qxjEndPage: 20,
				qxjCountPage: 0,
				qxjRainItemsLen: 0,
				rainExcept: false,
				isQxjRainPanel: false,
				isQxjLoading: false,
				tempCountyCode: '', // 用于鼠标移到镇时获取县级编码并且和镇级编码组合请求数据
				moveWinStatus: false,
				pix: [0, 0], // 详细窗口位置
				curPoint: '', // 当前点的信息
				siteRainData: '', // 站点过去雨量信息
				siteFutureRain: '', // 站点未来雨量
				width: '', // 屏幕的宽
				height: '', // 屏幕的高
				siteCurRain: { rain1hour: '--', rain6hour: '--', rain12hour: '--', rain24hour: '--' }, // 站点过去雨量
            }
        },
        computed: {
		    // 改变信息窗口位置
		    getPathPosition: function() {
		        let obj = {};
		        let pix = this.pix;
                let tleft = pix[0];
                let ttop = pix[1];
                // let minWidth = $('.siteInfo').width();
                // let minHeight = $('.siteInfo').height();
                // if(minWidth===undefined){
                //     return
                // }
                let minWidth = 330;
                let minHeight = 221;
                if(tleft < this.width / 2){   
                    obj['left'] = tleft + 10 + 'px';
                }else{
                    obj['left'] = tleft - minWidth + 30  + 'px';
                }
                if(ttop < this.height / 2){
		            obj['top'] = ttop + 10 + 'px';
                }else{
                    obj['top'] = ttop - minHeight + 'px';
                }
		        return obj;
		    }
		},
        watch: {
            dateTime: function(){
                this.endTime = TimeUtil.format(TimeUtil.clearMMSS(this.dateTime), 'yyyy-MM-dd HH:mm');
                this.startTime = TimeUtil.format(TimeUtil.addTime(this.endTime, this.beforeTime, 'mm' ), 'yyyy-MM-dd HH:mm');
                this.getWaterList();
                this.getRainList();
                this.getSiteRainData();  // 获取站点雨量
                // this.getRangeDetail(this.rainMin + '-' + this.rainMax);
            },
            elements: function(e) {
                this.updateParam('site', 'elements', e.join(','));
            },
            beforeTime: function() {
                this.startTime = TimeUtil.format(TimeUtil.addTime(this.endTime, this.beforeTime, 'mm'), 'yyyy-MM-dd HH:mm');
                this.getRainList();
            },
            siteFlag: function(){
                this.getSiteData();
            }
        },
        methods: {
            qxjRainPage: function(type) {
                var startPage = this.qxjStartPage;
                var endPage = this.qxjEndPage;
                var len = this.qxjRainItems.length;
                var countPage = Math.round(len / 20);
                this.qxjCountPage = countPage;
                this.qxjRainItemsLen = len;
                if (type === 'next') {
                    startPage += 20;
                    endPage += 20;
                    if (((len - endPage) % 20) >= 0 && ((len - endPage) % 20) < 1) {
                        endPage = len;
                    }
                    if (startPage >= len) {
                        return;
                    }
                } else if (type === 'prev') {
                    if (startPage <= 0) {
                        return;
                    }
                    startPage -= 20;
                    endPage -= 20;
                } else if (type === 'start') {
                    startPage = 0;
                    endPage = 20;
                } else if (type === 'end') {
                    startPage = (countPage - 1) * 20;
                    endPage = countPage * 20;
                }
                this.qxjStartPage = startPage;
                this.qxjEndPage = endPage;
                this.getQxjFutureRainList();
            },
            waterItemsPage: function(state) {
                var startPage = this.startPage;
                var endPage = this.endPage;
                var len = this.waterItems.length;
                if (state) {
                    startPage += 10;
                    endPage += 10;
                    if (((len - endPage) % 10) >= 0 && ((len - endPage) % 10) < 1) {
                        endPage = len;
                    }
                    if (startPage >= len) {
                        return;
                    }
                } else {
                    if (startPage <= 0) {
                        return;
                    }
                    startPage -= 10;
                    endPage -= 10;
                }
                this.startPage = startPage;
                this.endPage = endPage;
            },
            selectStartTime: function() {
                var timeStr = this.startTime;
                timeStr = TimeUtil.format(timeStr, 'yyyy,MM,dd,HH,mm');
                var that = this;
                $('#site-start-time').unbind().timepicker({
                    date: timeStr,
                    format: 'yyyy-MM-dd HH:mm',
                    secondLock: true,
                    maxTime: 'site-end-time'
                }).on({
                    'console.timepicker': (e) => {
                        that.startTime = TimeUtil.format(e.date, 'yyyy-MM-dd HH:mm');
                    }
                });
            },
            selectEndTime: function() {
                var timeStr = this.endTime;
                timeStr = TimeUtil.format(timeStr, 'yyyy,MM,dd,HH,mm');
                var that = this;
                $('#site-end-time').unbind().timepicker({
                    date: timeStr,
                    format: 'yyyy-MM-dd HH:mm',
                    secondLock: true,
                    minTime: 'site-start-time'
                }).on({
                    'console.timepicker': (e) => {
                        that.endTime = TimeUtil.format(e.date, 'yyyy-MM-dd HH:mm');
                    }
                });
            },
            showDetail: function(code, key) {
                if (code === 'county') {
                    if (this.hideCountyTimer) {
                        window.clearTimeout(this.hideCountyTimer);
                    }
                    this.isCounty = true;
                    let countyItems = this.cityItems[key].areaList;
                    for (let key in countyItems) {
                        countyItems[key].isSelect = false;
                    }
                    this.countyItems = countyItems;
                } else if (code === 'town') {
                    if (this.hideTownTimer) {
                        window.clearTimeout(this.hideTownTimer);
                    }
                    if (this.hideCountyTimer) {
                        window.clearTimeout(this.hideCountyTimer);
                    }
                    this.isTown = true;
                    let townItems = this.countyItems[key].areaList;
                    this.tempCountyCode = this.countyItems[key].areaCode;
                    for (let key in townItems) {
                        townItems[key].isSelect = false;
                    }
                    this.townItems = townItems;
                } else if (code === 'area') {
                    if (this.hideTownTimer) {
                        window.clearTimeout(this.hideTownTimer);
                    }
                    if (this.hideCountyTimer) {
                        window.clearTimeout(this.hideCountyTimer);
                    }
                }
            },
            hideDetail: function(code) {
                var that = this;
                if (code === 'county') {
                    this.hideCountyTimer = window.setTimeout(() => {
                        that.isCounty = false;
                    }, 250);
                } else if (code === 'town') {
                    this.hideTownTimer = window.setTimeout(() => {
                        that.isTown = false;
                    }, 250);
                    this.hideCountyTimer = window.setTimeout(() => {
                        that.isCounty = false;
                    }, 250);
                } else if (code === 'area') {
                    this.hideTownTimer = window.setTimeout(() => {
                        that.isTown = false;
                    }, 250);
                }
            },
            showArea: function(item, type) {
            	console.log('showArea');
                if (this.layer) {
                	console.log('this.layer');
                    this.map.removeLayer(this.layer);
                    this.layer = undefined;
                }
                if (!item.isSelect) {
                	console.log('item is not selectE');
                    if (type === 'county') {
                        let cityItems = this.cityItems;
                        for (let key in cityItems) {
                            cityItems[key].isSelect = false;
                        }
                        this.cityItems = cityItems;
                    } else if (type === 'town') {
                        let countyItems = this.countyItems;

                        for (let key in countyItems) {
                            countyItems[key].isSelect = false;
                        }
                        this.countyItems = countyItems;
                    }
                    let code = item.areaCode;
                    if(type === undefined){
                        code = this.tempCountyCode + '_' + code;
                    }
                    let rainRang = this.rainMin+'-'+this.rainMax;
                    this.getRangeDetail(rainRang,code);
                    if (Number(code) !== 'NaN') {
                    	console.log('final');
                        code = code.replace('00', '').replace('00', '');
                        this.layer = lmap.polygon.selectArea(this.map, code, { fillColor: '#000' });
                        this.layer.setZIndex(lmap.getIndex('impact'));
                        this.map.addLayer(this.layer);
                    }
                }
                item.isSelect = !item.isSelect;
            },
            selectSite: function(item){
                this.updateParam('siteBox', 'siteId', item.siteCode);
                this.updateParam('siteBox', 'lon', item.lon);
                this.updateParam('siteBox', 'lat', item.lat);
                let view = this.map.getView();
                view.setCenter(lmap.transform([Number(item.lon), Number(item.lat)]));
            },
            closeRainRange: function() {
                this.rangeDetailItems = [];
            },
            getRangeDetail: function(range,type) {
                range = range.split('-');
                var that = this;
                var cityCode = this.cityCode;
                if(type !== undefined){
                    cityCode = type;
                }
                if (cityCode.length < 6) {
                    cityCode += '0000';
                } else if (cityCode.length < 4) {
                    cityCode += '00';
                }
                $.ajax({
                    url: this.dss_sj+'/rain/rain!getRainDetail.action',
                    type: 'GET',
                    data: {
                        'areaCode': cityCode,
                        'startTime': TimeUtil.format(this.startTime, 'yyyyMMddHHmmss'),
                        'endTime': TimeUtil.format(this.endTime, 'yyyyMMddHHmmss'),
                        'queSelectTime': 0,
                        'rainRangeStart': range[0],
                        'rainRangeEnd': range[1]
                    },
                    dataType: 'json',
                    success: function(json) {
                        that.rangeDetailItems = json;
                    }
                });
            },
            getRainList: function() {
                var rainMin = this.rainMin;
                var rainMax = this.rainMax;
                if (this.rainExcept) {
                    rainMin = 250;
                    rainMax = 9999;
                }
                var cityCode = this.cityCode;
                if (cityCode.length < 6) {
                    cityCode += '0000';
                } else if (cityCode.length < 4) {
                    cityCode += '00';
                }
                var that = this;
                $.ajax({
                    url: this.dss_sj+'/rain/rain!getRainCount.action',
                    type: 'GET',
                    data: {
                        'areaCode': cityCode,
                        'startTime': TimeUtil.format(this.startTime, 'yyyyMMddHHmmss'),
                        'endTime': TimeUtil.format(this.endTime, 'yyyyMMddHHmmss'),
                        'queSelectTime': 0,
                        'rainRangeStart': rainMin,
                        'rainRangeEnd': rainMax
                    },
                    dataType: 'json',
                    success: function(json) {
                        let cityItems = json['雨量信息'];
                        for (let key in cityItems) {
                            cityItems[key].isSelect = false;
                        }
                        that.cityItems = cityItems;
                        let rainRangeItems = json['量级统计'];
                        for (let key in rainRangeItems) {
                            rainRangeItems[key].isSelect = false;
                        }
                        that.rainRangeItems = rainRangeItems;
                    }
                });
            },
            getWaterList: function() {
                var that = this;
                $.ajax({
                    url: this.dss+'/gis/gis!map.action',
                    type: 'GET',
                    data: {
                        'LAYERS': 'swList',
                        'DATETIME': TimeUtil.format(this.dateTime, 'yyyyMMddHHmm')
                    },
                    dataType: 'json',
                    success: function(json) {
                        that.waterItems = json;
                    }
                });
            },
            getQxjRainList: function() {
                this.isQxjLoading = true;
                this.qxjRainItems = [];
                this.isQxjRainPanel = true;
                var cityCode = this.cityCode;
                if (cityCode.length < 6) {
                    cityCode += '0000';
                } else if (cityCode.length < 4) {
                    cityCode += '00';
                }
                var status = 'province';
                if (cityCode !== '440000') {
                    status = '';
                }
                var areaName = encodeURI(this.areaName);
                $.ajax({
                    url: this.dss+'/gis/gis!map.action',
                    type: 'GET',
                    data: {
                        'LAYERS': 'sitelist',
                        'TYPE': 'site_gj,site_qy,site_sw',
                        'DATETIME': TimeUtil.format(this.dateTime, 'yyyyMMddHHmm'),
                        'STATUS': status,
                        'CITYNAME': areaName,
                        'COUNTRYNAME': '',
                        'AREACODE': cityCode
                    },
                    dataType: 'json',
                    success: (json) => {
                        this.qxjRainItems = json['rainlist'];
                        this.qxjRainPage('start');
                        this.isQxjLoading = false;
                    }
                });
            },
            getQxjFutureRainList: function() {
                var QxjRainList = this.qxjRainItems;
                var lonStr = '';
                var latStr = '';
                var numStr = '';
                for (var i = this.qxjStartPage; i < this.qxjEndPage; i++) {
                    lonStr += QxjRainList[i].site.lon + ',';
                    latStr += QxjRainList[i].site.lat + ',';
                    numStr += i + ',';
                }
                var that = this;
                $.ajax({
                    url: this.dss_sj+'/topicRead/topic-read!sitesfutureRain.action',
                    type: 'GET',
                    data: {
                        'lon': lonStr,
                        'lat': latStr,
                        'num': numStr,
                        'dataTime': TimeUtil.format(this.dateTime, 'yyyy-MM-dd HH:mm:ss')
                    },
                    dataType: 'json',
                    success: function(json) {
                        var data = json['sitesFuture'];
                        for (var index in data) {
                            var obj = that.qxjRainItems[index];
                            obj.rain4feature1hour = data[index].rain1hour;
                            obj.rain4feature2hour = data[index].rain2hour;
                            obj.rain4feature3hour = data[index].rain3hour;
                        }
                    }
                });
            },
            close: function(){
                this.updateParam('site', 'winStatus', false);
            },
            getSiteData: function(){   // 获取站点信息
               
                let topHeight = $('.top').height();
                var cityCode = this.cityCode;
                if (cityCode.length < 6) {
                    cityCode += '0000';
                } else if (cityCode.length < 4) {
                    cityCode += '00';
                }
                var status = 'province';
                if (cityCode !== '440000') {
                    status = '';
                }
                var areaName = encodeURI(this.areaName);
                $.ajax({
                    url: this.dss_sj+'/gis/gis!map.action',
                    type: 'GET',
                    data: {
                        'LAYERS': 'qxsite',
                        'TYPE': 'site_gj,site_qy,site_sw',
                        'DATETIME': TimeUtil.format(this.dateTime, 'yyyyMMddHHmm'),
                        'STATUS': status,
                        'CITYNAME': areaName,
                        'COUNTRYNAME': '',
                        'AREACODE': cityCode,
                        'BBOX': lmap.getExtent(this.map).join(','),
                        'WIDTH': this.width,
                        'HEIGHT': this.height - topHeight
                    },
                    dataType: 'json',
                    success: (json) => {
                        this.updateParam('site','data',json);
                    }
                });
            },
            // 鼠标移动事件
		    moveEvt: function(evt) {
		        this.moveWinStatus = false;
		        this.siteCurRain = {
		        	rain1hour: '--',
					rain6hour: '--',
					rain12hour: '--',
					rain24hour: '--'
		        };
		        this.pix = evt.pixel;
		        var pageXY = lmap.controler.MousePageXY(evt);
		        let topHeight = $('.top').height();
		        let pageX = pageXY[0];
		        let pageY = pageXY[1] + topHeight;
		        let point = null;
		        let json = this.siteData;
		        for (var key in json) {
		            let obj = json[key].qxSite;
		            for (let k in obj) {
		                let data = obj[k];
		                let siteX = data.siteX;
		                let siteY = data.siteY;
		                if (siteX - 5 < pageX && siteX + 5 > pageX && siteY - 5 < pageY && siteY + 5 > pageY) {
		                    this.moveWinStatus = true;
		                    this.curPoint = data;
		                    // 请求未来雨量
		                    let lon = data.lon;
		                    let lat = data.lat;
		                    this.requestFutureRain(lon, lat); // 根据经纬请求未来雨量
		                    if (this.siteRainData.length > 0) {
		                        this.siteRainData.forEach((it) => {
		                            if (it.no === data.siteID) {
		                                this.siteCurRain = it;
		                                return false;
		                            }
		                        });
		                    }
		                    break;	
		                }
		            }
		        }
		    },
            getSiteRainData: function(){   // 获取站点雨量信息
                var cityCode = this.cityCode;
                if (cityCode.length < 6) {
                    cityCode += '0000';
                } else if (cityCode.length < 4) {
                    cityCode += '00';
                }
                var status = 'province';
                if (cityCode !== '440000') {
                    status = '';
                }
                var areaName = encodeURI(this.areaName);
                $.ajax({
                    url: this.dss_sj+'/gis/gis!map.action',
                    type: 'GET',
                    data: {
                        'LAYERS': 'sitelist',
                        'TYPE': 'site_gj,site_qy,site_sw',
                        'DATETIME': TimeUtil.format(this.dateTime, 'yyyyMMddHHmm'),
                        'STATUS': status,
                        'CITYNAME': areaName,
                        'COUNTRYNAME': '',
                        'AREACODE': cityCode
                    },
                    dataType: 'json',
                    success: (json) => {
                        this.siteRainData = json.rainlist;
                    }
                });
            },
            requestFutureRain: function(lon,lat){
                $.ajax({
                    url: this.dss_sj+'/topicRead/topic-read!futureRainData.action',
                    type: 'GET',
                    data: {
                        'lon': lon,
                        'lat': lat,
                        'dataTime': TimeUtil.format(this.dateTime, 'yyyy-MM-dd HH:mm:ss')
                    },
                    dataType: 'json',
                    success: (json) => {
                        this.siteFutureRain = json.futureRainChar;
                    }
                });
            }
        },
        ready: function(){
            let width = $(window).width();
            let height = $(window).height();
            this.width = width;
            this.height = height;
            var that = this;
            $('#rain-slider').slider({
                range: true,
                min: 0,
                max: 250,
                value: 5,
                values: [0, 250],
                slide : function(event, ui) {
                    that.rainMin = ui.values[0];
                    that.rainMax = ui.values[1];
                }
            });
            this.getRainList();
            this.getWaterList();
            this.getSiteData();
            this.getSiteRainData();
            this.close();

            this.map.on('pointermove', this.moveEvt);
        },
        detached: function(){
            if (this.layer) {
                this.map.removeLayer(this.layer);
                this.layer = undefined;
                this.updateParam('site','moveWinStatus',false);
            }
        }
    }
</script>

<style scoped lang="less">
@import '../../util/timepicker/timepicker.css';
@import "../../assets/css/common.less";

.site {
	position: absolute;
	right: 0px;
	top: 0px;
	width: 320px;
	background: #fff;
	z-index: 3;
	line-height: 20px;
	-moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
.Close {
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
.elements {
	li:first-child {
		color: #018000;
	}
	li:nth-child(2) {
		color: red;
	}
	li:nth-child(3) {
		color: #3e42ce;
	}
	label input {
		width: 16px;
		height: 16px;
		vertical-align: middle;
		margin-top: 0px;
		cursor: pointer;
	}
	label:hover {
		color: @color;
	}
}
.site ul li {
	display: inline-block;
}
.site .element-tab .setRight {
	float: right;
	padding: 0 5px;
	cursor: pointer;
	margin-left: 5px;
	margin-bottom: 2px;
	text-align: center;
	border: 1px solid #ccc;
	height: 20px;
	line-height: 18px;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
	border-radius: 3px;
}
.site .element-tab .setRight:hover {
	color: @color;
}
.rain-chose-title {
	display: inline-block;
	float: left;
	height: 22px;
	line-height: 22px;
}
.rain-chose {
	float: left;
	height: 22px;
	line-height: 22px;
}
.rain-slider {
	width: 80px;
	margin: 6px 0px 4px 5px;
	height: 6px;
	border: 1px solid #ccc;
	float: left;
}
.slider {
	position: relative;
	float: left;
	margin-left: 5px;
	margin-top: 2px;

	.num {
		display: inline-block;
		text-align: left;
		width: 20px;
		position: absolute;
		bottom: -15px;
		left: 75px;
	}
	.num:first-child {
		left: 1px;
	}
}
.rain-list {
	padding: 15px 0px 0px 0px;
	clear: both;

	.table-title {
		color: @color;
	}
	table {
		table-layout: fixed;
		width: 318px;
		background: #fff;

		thead {
			background: @bg;
		}
		tbody {
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
			width: 72px;
			border-bottom: 1px solid #E5E8EC;
			border-right: 1px solid #E5E8EC;
		}
		td:first-child {
			width: 74px
		}
	}
	.rainlist-panel {
		position: relative;

		.county {
			position: absolute;
			left: -320px;
			top: 0;
			width: auto;
			overflow: hidden;
			height: auto;
		}
		.town {
			position: absolute;
			left: -634px;
			top: 0;
			width: auto;
			overflow: hidden;
			height: auto;
		}
	}
	.range-list td:first-child, .range-list td:nth-child(3) {
		width: 78px;
	}
	.range-list td:nth-child(2) {
		width: 135px;
		word-break: keep-all;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.range-list tbody {
		height: auto;
	}
	.range-list {
		position: relative;

		.range-detail {
			position: absolute;
			left: -320px;
			top: 0;
			background-color: #fff;
		}
	}
}
.tbody {
	overflow-y: scroll;
	overflow-x: hidden;
	height: 120px;
	width: 318px;
	background: #fff;
	border-bottom: 1px solid #E5E8EC;
}
div.rain_tbody {
	overflow-y: scroll;
	overflow-x: hidden;
	height: 70px;
	width: 318px;
	border-bottom: 1px solid #E5E8EC;
}
.qxj-rain-list {
	position: absolute;
	right: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
	background: #fff;
	z-index: 2015;

	table {
		width: 100%;		/*height: 100%;*/
		background: #fff;
		table-layout: fixed;

		thead {
			background: @bg;
			table-layout: fixed;
		}
		tbody {
			overflow-y: scroll;
			overflow-x: hidden;
			max-height: 90%;
			height: auto;
			width: 100%;
			table-layout: fixed;
			border-bottom: 1px solid #E5E8EC;
			display: table-footer-group;

			tr:hover {
				background: @bg;
				cursor: pointer;
			}
		}
		td {
			border: 0;
			height: 26px;
			line-height: 26px;
			text-align: center;
			word-break: break-all;
			border-bottom: 1px solid #E5E8EC;
			border-right: 1px solid #E5E8EC;
		}
		td:first-child {
			width: 5%
		}
		td:nth-child(2) {
			width: 5%
		}
		td:nth-child(3) {
			width: 20%
		}
		td:nth-child(4) {
			width: 7%
		}
		td:nth-child(5) {
			width: 7%
		}
		td:nth-child(6) {
			width: 7%
		}
		td:nth-child(7) {
			width: 7%
		}
		td:nth-child(8) {
			width: 7%
		}
		td:nth-child(9) {
			width: 7%
		}
		td:nth-child(10) {
			width: 7%
		}
		td:nth-child(11) {
			width: 7%
		}
		td:nth-child(12) {
			width: 7%
		}
		td:nth-child(13) {
			width: 7%
		}
	}
}
label.name {
	float: left;
}
.margin05 {
	margin: 0px 2px;
}
.inputlabel {
	cursor: pointer;
	margin-right: 10px;
}
.input label input {
	vertical-align: middle;
	margin: 0 4px 0 0;
}
.except {
	margin-left: 10px;
	float: left;

	input {
		width: 16px;
		height: 16px;
		vertical-align: middle;
		margin: 0;
		margin-top: -2px;
		margin-left: 10px;
	}
}
.element-tab {
	height: 22px;
	margin: 5px 0 0 2px;

	li {
		padding: 0px 8px;
		height: 22px;
		line-height: 22px;
		cursor: pointer;
		float: left;
		background: #ecf2fc;
	}
	li:hover {
		color: @color
	}
	li.on {
		color: @color;
		font-weight: bold;
	}
}
.rain-panel {
	padding-top: 5px 0px;
}
.rainif {
	padding: 10px 5px;
}
.time-select {
	height: 24px;
	line-height: 24px;

	.selectCss {
		width: 150px;
	}
	label {
		float: left;
	}
}
.time-chose {
	margin: 5px 0px;

	ul li.timedate {
		width: 220px;

		input {
			width: 196px;
			color: @colorH;
		}
		span {
			margin-right: 5px;
		}
	}
}
.inline-block {
	display: inline-block;
	vertical-align: top;
}
.water-panel table {
	border-bottom: 1px solid #E5E8EC;
	border-right: 1px solid #E5E8EC;
	width: 100%;

	thead {
		background: @bg;
	}
	td {
		border-left: 1px solid #E5E8EC;
		border-top: 1px solid #E5E8EC;
		text-align: center;
	}
}
.sitepage {
	margin-top: 5px;
	height: 30px;
	line-height: 30px;

	span {
		margin-right: 2px;
	}
}
.loading {
	display: inline-block;
	background: url("../../assets/img/common/loading.gif") no-repeat;
	width: 16px;
	height: 16px;
	margin-top: 2px;
}
.area-select {
	background: #c4e4ff;
}
div.site-water-panel {
	top: 400px;
	right: 450px;
	width: 300px;
}
.poiPop {
	width: 616px;
	height: auto;
	position: absolute;
	z-index: 4;    /*right: 0;
	    top: 0px;*/
	background: #fff;
	-moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
div.site-min-panel {

	/*top: 300px; 
	right: 250px; */
	width: 300px;
}
.site-min-ui {
	margin: 5px;
}
.info {
	overflow: hidden;
	height: auto;

	span {
		color: @color;
		font-weight: bold;
	}
	table {
		width: 100%;
		border-top: 1px solid #E5E8EC;
		border-left: 1px solid #E5E8EC;

		td {
			border: 0;
			height: 22px;
			line-height: 22px;
			text-align: center;
			width: 72px;
			border-bottom: 1px solid #E5E8EC;
			border-right: 1px solid #E5E8EC;
		}
		tr:first-child {
			background: @bg;
		}
	}
}
.siteInfo {
	width: 300px;
	height: 221px;
	position: absolute;
	right: 0px;
	top: 0px;
	z-index: 4;
	background-color: #fff;
	-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	-moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	box-shadow: 0 2px 4px 0 
	rgba(0, 0, 0, .3);
}

.site-water-ui {
	height: 180px;
	li {
		margin: 5px;
	}
}

/*big*/
.big .site {
	width: 428px;
}
.big .element-tab {
	height: 30px;

	li {
		height: 30px;
		line-height: 30px;
	}
}
.big .time-select {
	height: 32px;
	line-height: 32px;

	.selectCss {
		width: 200px;
	}
}
.big .time-chose {
	line-height: 32px;

	ul li.timedate {
		width: 303px;
		height: 30px;
		line-height: 30px;
		margin-left: -6px;

		input {
			width: 270px;
			font-size: 20px;
		}
		span {
			margin-right: 5px;
		}
	}
	.timedate:after {
		top: 6px
	}
}
.big .rain-scope {
	height: 32px;
	line-height: 32px;

	.rain-chose-title {
		height: 30px;
		line-height: 30px;
	}
	.rain-chose {
		height: 30px;
		line-height: 30px;
	}
	.slider {
		margin-top: 7px;

		.rain-slider {
			width: 107px;
			margin-top: 5px;
		}
		.num:first-child {
			left: -5px;
		}
		.num {
			bottom: -22px;
			left: 90px;
		}
	}
}
.big .water-panel table {
	td {
		height: 30px;
		line-height: 30px;
	}
}
.big .rain-list {
	padding: 8px 0px 0px 0px;

	.table-title {
		height: 30px;
		line-height: 30px;
	}
	table {
		width: 424px;

		tbody {
			height: 120px;
		}
		td {
			height: 30px;
			line-height: 30px;
			width: 98px;
		}
		td:first-child {
			width: 102px
		}
	}
	.rainlist-panel {
		.county {
			left: -425px;
		}
		.town {
			left: -849px;
		}
	}
	.range-list td:first-child {
		width: 100px;
	}
	.range-list td:nth-child(2) {
		width: 175px;
	}
	.range-list td:nth-child(3) {
		width: 121px;
	}
	.range-list tbody {
		height: 95px;
	}
	.range-list {
		.range-detail {
			left: -425px;
		}
	}
}

/*big*/
.big .qxj-rain-list table td {
	height: 32px;
	line-height: 32px;
}
.big .tbody {
	width: 424px;
}
.big .rain_tbody {
	width: 424px;
	height: 93px;
}
.big .rain_tbody tr {
	height: 31px;
}
.big .tbody tr {
	height: 31px;
}
</style>