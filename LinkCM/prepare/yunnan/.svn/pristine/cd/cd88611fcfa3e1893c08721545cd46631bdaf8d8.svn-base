<template>
    <div class="site-point-panel poiPop" v-show="hasSiteData" id="site" v-el:site-win>
    	<a class="Close" @click="close()"></a>
        <div class="title">{{address}} (过去24小时雨量和风速变化图)</div>
        <div  class="siteIf">
            <span>时间：</span>
            <div class="timedate">
            	<input id="site-point-time" type="text" :value="siteTime" @click="selectSiteTime()"/>
            </div>
           	<a class="btn btnhover" @click="getRainTimeData()">刷新</a>
            <span class="textair">部分时段雨量、风速数据缺失，原因待查。</span>
        </div>
        <div class="site-charts nodata" v-if="noData==true">
           <span> 此站无雨量数据 </span>
        </div>
        <div v-show="noData==false" class="site-charts" id="site-charts"></div>
    </div>
</template>

<script>
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import TimeUtil from '../../util/tools/TimeUtil'
    import Timepicker from '../../util/timepicker/timepicker'
    import { updateParam } from '../../vuex/store'
    import Highcharts from 'highcharts'
    import WinDrag from 'util/tools/WinDrag'

    export default {
        data (){
            return {
                item: { 'address': '' },
                siteTime: '',
                hasSiteData: false,
                address: '',
                noData: false  //此站无雨量数据
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                dateTime: state => state.site.dateTime,
                status: state => state.site.status,
                siteId: state => state.siteBox.siteId,
                lon: state => state.siteBox.lon,
                lat: state => state.siteBox.lat,
                feature: state => state.siteBox.feature,
                style: state => state.siteBox.style,
                activeStat: false,//记录是否选中图标
                areaCode: state => state.cityCode,
                elements: state => state.site.elements,
                divIds: state => state.windows.divIds
            },
            actions: {
                updateParam
            }
        },
        watch: {
            lon: function(){
                this.lonlat = [this.lon, this.lat];
                this.getRainTimeData();
                this.addWinDragEvt('siteWin');
            },
            status: function(){
                if(this.status == false)
                    this.hasSiteData = false;
                    this.clearActivePoint();
            }
        },
        methods: {
            initChart: function(rainData, windData, timeData) {
                this.hasSiteData = true;
                Highcharts.chart('site-charts', {
                    title: {
                    	text: '过去24小时雨量、风速变化图',
                    	style:{
					        color:"#414e61",
					        fontFamily:"Microsoft Yahei"
					    },
					    x:17
                    },
                    credits: {enabled: false},
                    xAxis: [{categories: timeData, title: {enabled: true, text: '时间（时）'}}],
                    yAxis: [{labels: {format: '{value}mm', style: {color: '#4572A7'}, lineWidth: 1 }, title: {text: '雨量(mm)', style: {color: '#4572A7'} } }, {title: {text: '风速(m/s)', style: {color: '#89A54E'} }, labels: {format: '{value} m/s', style: {color: '#89A54E'} }, opposite: true}],
                    tooltip: {headerFormat: '时间：{point.key}时<br/>', shared: true, useHTML: true},
                    legend: {
                    	align: 'left', 
                    	verticalAlign: 'top', 
                    	x:-3, 
                    	y: -5, 
                    	floating: true, 
                    	backgroundColor: '#FFFFFF',
                    	fontFamily:'Microsoft Yahei',
                    },
                    series: [ {
                        name: '风速(m/s)',
                        color: '#89A54E',
                        type: 'spline',
                        yAxis: 1,
                        data: windData,
                        tooltip: {valueSuffix: 'm/s'},
                        dataLabels: {enabled: true, rotation: -15, color: '#000', align: 'center', x: 0, y: -6, style: {fontSize: '12px'}}
                    }, {
                        name: '雨量(mm)',
                        color: '#4572A7',
                        type: 'column',
                        yAxis: 0,
                        data: rainData,
                        tooltip: {valueSuffix: ' mm'},
                        dataLabels: {enabled: true, color: '#4572A7', align: 'center', x: 5, y: -7, rotation: -50, crop: false, overflow: "none", padding: 0, style: {fontSize: '13px'}, zIndex: 9999}
                    }]
                });
                this.addWinDragEvt('siteWin');
            },
            getRainTimeData: function() {
                var lonlat = this.lonlat;
                var siteId = this.siteId;
                if ((lonlat[0] && lonlat[1]) || siteId){
                    var timeStr = "";
                    if (!this.hasSiteData) {
                        timeStr = TimeUtil.format(this.dateTime, 'yyyy-MM-dd_HH_mm_ss');
                        this.siteTime = TimeUtil.format(this.dateTime, 'yyyy-MM-dd HH:mm');
                    } else {
                        timeStr = TimeUtil.format(this.siteTime, 'yyyy-MM-dd_HH_mm_ss');
                    }
                    var map = config.getParam('map');
                    var zoom = map.getView().getZoom() + '';
                    var reqParam = {};
                    reqParam.PARAM = JSON.stringify({'LAYERS': 'sitePoint', 'DATETIME': timeStr, 'LON': lonlat[0], 'LAT': lonlat[1], 'ZOOM': zoom, 'SITEID': siteId, 'AREACODE': this.areaCode,'ELEMENT':this.elements});
                    $.ajax({
                        url: this.dss+'/site/site!getSitePointData.action',
                        dataType: 'json',
                        type: 'GET',
                        data: reqParam,
                        success: (json) => {
                            if (json.address) {
                                let tempIds = this.divIds;
                                tempIds = tempIds.replace('site,','');
                                tempIds += 'site,';
                                this.updateParam('windows','divIds',tempIds);
                                this.address = json.address;
                                if(!json.data.rain){
                                    this.hasSiteData = true;
                                    this.noData = true;
                                    this.activeStat = true;
                                    this.controlActivePoint("site#"+json.lon+"#"+json.lat);
                                    this.addWinDragEvt('siteWin');
                                }else{
                                    this.noData = false;
                                    this.initChart(json.data.rain, json.data.wind, json.data.time);

                                    if (!!json.lon) {
                                        this.activeStat = true;
                                        this.controlActivePoint("site#"+json.lon+"#"+json.lat);
                                    }
                                }
                            }
                        }
                    });
                }
            },
            close: function() {
                let tempIds = this.divIds;
                tempIds = tempIds.replace('site,','');
                this.updateParam('windows','divIds',tempIds);
                this.hasSiteData = false;
                this.updateParam('siteBox', 'siteId', '');
                this.updateParam('siteBox', 'lon', '');
                this.updateParam('siteBox', 'lat', '');
                if (this.feature && this.style) {
                    lmap.icon.setStyle(this.feature, this.style);
                }
                this.clearActivePoint();
            },
            selectSiteTime: function() {
                var that = this;
                var timeStr = TimeUtil.format(this.siteTime, 'yyyy-MM-dd HH:mm');
                $('#site-point-time').unbind().timepicker({date: timeStr, format: 'yyyy-MM-dd HH:mm', secondLock: true}).on({
                    'console.timepicker': (e) => {
                        that.siteTime = TimeUtil.format(e.date, 'yyyy-MM-dd HH:mm');
                    }
                });
            },
			/**使窗口支持拖动功能 */
			addWinDragEvt: function(elName){
				var map = config.getParam('map');
				let call = setInterval(()=>{
					let winObj = this.$els[elName];
					if(!!winObj)
						WinDrag.drag(winObj,winObj,map);
						clearInterval(call);
				},10);		
			},
            /**控制选中图标 */
			controlActivePoint: function(val){
				this.updateParam('activePoint','point',val);//选中图标
			},
            /**清除选中的图标 */
            clearActivePoint: function(){
                if(this.activeStat){//清除图标选中
                    this.activeStat = false;
                    this.controlActivePoint('');
                }
            }
        }
    }
</script>

<style scoped lang="less">
@import '../../util/timepicker/timepicker.css';
@import "../../assets/css/common.less";
.poiPop{
    width:616px;
    height: auto;
    position: absolute;
    z-index:4;
    right: 0;
    top: 0px;
    background:#fff;
    -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
}
.Close{
    position: absolute;
    right: 0;
    top: 0;
    height: 20px;
    width: 20px;
    background: url("../../assets/img/toolsbar/rightIcon.png") no-repeat;
    background-position: -153px -60px!important;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
}
.siteIf{
	height: 22px;
	line-height: 22px;
	padding:8px 8px 8px 15px;
	.timedate{
		margin-left: 3px;
		display: inline-block;
		float: inherit;
		width: 160px;
		input[type="text"]::-ms-clear{
		    display:none;
		}
		::-ms-clear{display: none;}
		::-ms-reveal{display: none;}
	}
}
div.site-water-panel{
	 top: 400px; 
	 right: 450px; 
	 width:300px;
}
.site-water-ui{
	margin: 5px;
	li{
		float: left;
		margin-right:15px;
		line-height: 26px;
	}
}
div.site-min-panel{
	top: 300px; 
	right: 250px; 
	width:300px;
}
.site-min-ui{
	margin: 5px;
}
.info{
	overflow: hidden;
	height: auto;
	span{
		color:@color;
		font-weight: bold;
	}
	table{
		width: 100%;
		border-top:1px solid #E5E8EC;
		border-left:1px solid #E5E8EC;
		td{
			border: 0;
		    height: 22px;
		    line-height: 22px;
		    text-align: center;
		    width: 72px;
		    border-bottom:1px solid #E5E8EC;
		    border-right:1px solid #E5E8EC;
		}
		tr:first-child{background:@bg;}
	}
}
.nodata{
    height:400px;
}
/*big*/
.big .siteIf{
	height:64px;
	line-height:32px;
	.timedate{
		height: 30px;
    	line-height: 30px;
		width: 260px;
		input{
			font-size: 20px;
			color: @colorH;
		}
	}
	.timedate:after{top:8px}
	.textair{display: block;}
}
</style>