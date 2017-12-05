<template>
    <div v-el:poi-box>
        <div class="poiPop normal panelhover" v-if="normal.stat==true" id="normal" v-el:normal-win>
        	<a class="Close" @click="close('normal')"></a>
            <div class="title nullbg" v-el:normal-title>
            	<label>{{ normal.name }}</label>
           	</div>
            <div class="popTab popTaBorder">
                <div class="title">基本信息</div>
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
        <div class="poiPop emergencty panelhover" v-if="emergencty.stat==true" id="emergencty" v-el:emergencty-win>
        	<a class="Close" @click="close('emergencty')"></a>
            <div class="title nullbg" v-el:emergencty-title>
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
        <div class="reservoir panelhover" v-if="reservoir.stat==true" id="reservoir" v-el:reservoir-win>
        	<a class="Close" @click="close('reservoir')"></a>
            <div class="title" v-el:reservoir-title>
            	<label>{{ reservoir.list.reservoir_name}}&nbsp;&nbsp;&nbsp;&nbsp;{{charts.address}}({{charts.lonlat}})</label>
            </div>
            <div class="reservoirTop">
                <div class="reservoirLeft">
                    <div>更新时间：{{ reservoir.list.updatetime}}</div>
                    <div :class="reservoir.lowOver"><em></em>超警戒水位：{{ reservoir.over }}米</div>
                    <div :class="reservoir.overStat">
                    	<div class="Watered">
                    		<label>警戒<br>水位</label>
                    		<span>{{ reservoir.list.warn_water}}米</span>
                    	</div>
                    	<div class="inWater">
                    		<label class="inWater">当前<br>水位</label>
                    		<span>{{ reservoir.list.cur_water}}米</span>
                    	</div>
                    	<div class="fullWater">库容：{{ reservoir.list.storage}}万立方米</div>
                    </div>
                </div>
                <div class="reservoirRight">
                    <a><img :src="getSkPic" @error="getNullPic($event)"></a>
                </div>
            </div>
            <div class="reservoirBottom">
            	<!--<div class="reser-title">
            		<span>{{charts.address}}({{charts.lonlat}})</span>
            	</div>-->
            	<v-watercharts :lonlat="chartLonLat" :cid="cid" :reservoirid="reservoirId" :updatetime="reservoir.list.updatetime" :warnlevel="reservoir.list.warn_water"></v-watercharts>
            </div>
        </div>
		<div class="poiPop video-panel" v-if="video.stat==true" id="video" v-el:video-win>
			<div class="title">{{video.address}}</div>
			<a class="Close" @click="close('video')"></a>
			<v-videoframe :mrl="mrl"></v-videoframe>
		</div>
		<div class="poiPop normal panelhover" v-if="loud.stat==true" id="loud" v-el:loud-win>
			<a class="Close" @click="close('loud')"></a>
			<!--没有数据的弹窗-->
			<div class="popTab popTaBorder" v-if="loud.ndata==true">
				<label>暂无数据</label>
			</div>
			<!--有数据时的弹窗-->
			<div v-if="loud.ndata==false">
				<div class="title nullbg">
					<label> 设备所在地：{{ loud.name }}</label>
				</div>
				<div class="popTab popTaBorder">
					<div class="title">基本信息</div>
					<div class="popTab-box">
						<ul> 
							<li> 设备类型：{{ loud.list.termType }}</li>
							<li> 设备编号：{{ loud.list.termId }}</li>
							<li> 当前状态：{{ loud.list.status }}</li>
							<li> 经纬度：{{ loud.list.lon }} , {{loud.list.lat}}</li>
							<li> 维护人员：{{ loud.list.operator }}</li>
							<li> 联系电话：{{ loud.list.serviceTel }}</li>
							<li v-if="loud.list.termType != '大喇叭'">
								<label>最新信息：</label>
							</li>
						</ul>
						<ul v-if="loud.list.termType != '大喇叭'">
							<template v-for="it in loud.list" v-if="($key.indexOf('message') != -1)">
								<div v-if="it !== ''">
									{{it}}
								</div>
								
							</template>
							<div v-if="loud.nmsg==true">
								<label>暂无最新信息！</label>
							</div>
						</ul>
					</div>
				</div>
			</div>
		</div>
    </div>
</template>

<script>

    import { updateParam } from '../../vuex/store'
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import VideoFrame from '../layout/tools/VideoFrame'
    import waterCharts from '../layout/tools/WaterCharts'
	import WinDrag from 'util/tools/WinDrag'
    import TimeUtil from 'util/tools/TimeUtil'

    export default {
        components: { 'v-videoframe': VideoFrame, 'v-watercharts': waterCharts },
        data() {
            return {
                normal: {
                    stat: false,
                    list: '',
                    name: '',
					traffic:false // 客运站
                },
                emergencty: {
                    stat: false,
                    list: '',
                    name: '',
                    curType: '' // 当前显示类别
                },
                reservoir: {
                    stat: false,
                    list: '',
                    over: '--', // 超汛限水位
                    overStat: {
                    	'outwaterimg': false,
                    	'waterimg': true
                    },
                    lowOver:{
                    	'reservoirOver':false,
                    	'reservoirLow':true
                    }
                },
                video: {
                    address: '',
                    stat : false
                },
				loud: {   // 大喇叭
					stat: false,
					list: '',
					name:'',
					nmsg:false,
					ndata:false
				},
				name: '', // 记录当前所打开的窗口对应数据类型名称
                charts: {
                    lonlat: '',
                    address: ''
                },
                chartLonLat: [],
				activeStat: false, // 记录是否选中图标
                mrl: '',
                cid: 'water-charts',
                reservoirId: '',
                cachePoi:''
            }
        },
        vuex: {
            getters: {
                dss: state => state.dss,
                lonlat: state => state.poiBox.lonlat,
                types: state => state.poi.minTypes,
				pTypes: state => state.poi.allTypes,
                dType: state => state.dropzone.poiType,
                bType: state => state.poiBox.type,
                cityCode: state => state.cityCode,
                sysTime: state => state.time.sysTime,
                divIds: state => state.windows.divIds
            },
			actions: {
				updateParam
			}
        },
		computed: {
			// 水库图片
			getSkPic: function() {
                let picPath = this.reservoir.list.photo;
                if (picPath =='null' || picPath == '') { // 无图片
                    return 'http://10.148.16.56/danger/reservoir/now-inform-0.png';
                } else {
                    return 'http://10.148.16.56/danger/reservoir/' + picPath + '.jpg';
                }
            }
		},
        watch: {
            lonlat: function(lonlat) {
                this.getPoiData(lonlat);
            },
            // 取消选择，去掉窗口
            pTypes: function() {
                if (this.pTypes.indexOf(this.name) == -1) {
                    this.normal.stat = false;
                    this.emergencty.stat = false;
                    this.reservoir.stat = false;
                    this.video.stat = false;
                    this.loud.stat = false;
                    let tempIds = this.divIds;
                    tempIds = tempIds.replace('normal,','').replace('emergencty,','').replace('reservoir,','').replace('video,','').replace('loud,','');
                    this.updateParam('windows','divIds',tempIds);

                }
            },
            'reservoir.stat': function(state) {
                if (state) {
                    this.setReservoirTimer();
                } else {
                    if (this.reservoirTimer) {
                        window.clearTimeout(this.reservoirTimer);
                    }
                }
            },
            sysTime: function(){
               if(this.chartLonLat.length>0) {
                 this.getPoiData(this.chartLonLat);
               }
            }
        },
        methods: {
        	close: function(type) {
                if(type === ''){
                    return;
                }
                let tempIds = this.divIds;
                tempIds = tempIds.replace(type+',','');
                this.updateParam('windows','divIds',tempIds);
                this[type].stat = false;
                this.activeStat = false;
                this.controlActivePoint('');
                this.updateParam('poiBox', 'type', '');
                this.chartLonLat = [];
            },
            getNullPic: function(event){
                let target = event.target;
                target.src="http://10.148.16.56/danger/reservoir/now-inform-0.png";
            },
            // 控制选中图标
            controlActivePoint: function(val) {
                this.updateParam('activePoint', 'point', val); // 选中图标
            },

            getPoiData: function(lonlat) {
                var map = config.getParam('map');
                var zoom = map.getView().getZoom();
                let type = this.types;
                if (type == '') type = this.pTypes;
                if (this.bType) type = this.bType;
                if (this.dType) type = this.dType;
                var url = this.dss+'/poi/poi!getPoiByLonLat.action';
                var qdata = { areaCode: this.cityCode, zoom: zoom, lon: lonlat[0], lat: lonlat[1], type: type };
                $.getJSON(url, qdata, (bd) => {
                    this.name = bd.poiType;
                    let tempType = bd.poiType;
                    if (!!bd.id) {
                        if (!this.bType) {
                            this.activeStat = true;
                            this.controlActivePoint(tempType + "#" + bd.lon + "#" + bd.lat);
                        }
                        this.name = tempType;
                        this.getPoiDetail(bd.id, tempType, lonlat, bd.poiCode, bd.back_up_1);
                    }
                });
            },

            getPoiDetail: function(id, type, lonlat, poiCode, back_up_1){
				var url = '';
                var qdata;
                if (type === 'TYFON' || type === 'LCD_LED' || type === 'LCD_LED_TYFON') { // 大喇叭详情路径
                    url = this.dss_sj+'/area/area!getLoudDetai.action';
                    qdata = { poiCode: poiCode };
                } else if(type==='RESERVOIR'){
                    url = this.dss+'/area/area!getReservoirDetail.action';
                    qdata = { poiID: id,reservoirCode: back_up_1, queryTime:TimeUtil.format(this.sysTime,'yyyyMMddHH')};
                }else {
                    url = this.dss+'/area/area!getPoiDetail.action';
                    qdata = { poiID: id };
                }

                $.getJSON(url, qdata, (bd) => {
                    if (type.indexOf('EMERGENCY') != -1) { //需要分类的
                        for (let key in bd) {
                            var arr = bd[key][0];
                            for (let it in arr) {
                                if (arr[it].paramTitle == '名称') {
                                    this.emergencty.name = arr[it].paramVal;
                                    this.emergencty.curType = key;
                                    break;
                                }
                            }
                        }
                        this.emergencty.list = bd;
                        this.emergencty.stat = true;
                        let tempIds = this.divIds;
                        tempIds = tempIds.replace('emergencty,','');
                        tempIds += 'emergencty,';
                        this.updateParam('windows','divIds',tempIds);
                        this.addWinDragEvt('emergenctyTitle', 'emergenctyWin');
                    } else if (type === 'RESERVOIR') {

                        /* var arr = bd[type][0];
                        var obj = {};
                        for (let key in arr) {
                            var rec = arr[key];
                            obj[rec.paramTitle] = rec.paramVal;
                        }
                        this.reservoir.list = obj; */

                        if (!bd.updatetime) bd.updatetime = this.sysTime;
                        bd.updatetime = TimeUtil.format(bd.updatetime, 'yyyy-MM-dd HH:mm');
                        if (bd.reservoir_name.indexOf('水库名称') == -1) {
                            bd.reservoir_name = '水库名称-' + bd.reservoir_name;
                        }
                        this.reservoir.list = bd;
                        this.reservoir.list.cur_water = Number(this.reservoir.list.cur_water).toFixed(2);
                        this.reservoir.list.warn_water = Number(this.reservoir.list.warn_water).toFixed(2);
                        if (isNaN(this.reservoir.list.cur_water)) this.reservoir.list.cur_water = '--';
                        if (isNaN(this.reservoir.list.warn_water)) this.reservoir.list.warn_water = '--';
                        this.reservoir.id = id;
                        this.reservoirId = back_up_1;
                        this.reservoir.stat = true;
                        let tempIds = this.divIds;
                        tempIds = tempIds.replace('reservoir,', '');
                        tempIds += 'reservoir,';
                        this.updateParam('windows', 'divIds', tempIds);
                        let over = Number(this.reservoir.list.cur_water - this.reservoir.list.warn_water).toFixed(2);
                        if (isNaN(over)) {
                            over = '--';
                            this.reservoir.overStat.outwaterimg = false;
                            this.reservoir.overStat.waterimg = true;
                            this.reservoir.lowOver.reservoirOver = false;
                            this.reservoir.lowOver.reservoirLow = true;
                        } else if (over <= 0) {
                            this.reservoir.overStat.outwaterimg = false;
                            this.reservoir.overStat.waterimg = true;
                            this.reservoir.lowOver.reservoirOver = false;
                            this.reservoir.lowOver.reservoirLow = true;
                        } else if (over > 0) {
                            this.reservoir.overStat.outwaterimg = true;
                            this.reservoir.overStat.waterimg = false;
                            this.reservoir.lowOver.reservoirOver = true;
                            this.reservoir.lowOver.reservoirLow = false;
                        }
                        
                        this.reservoir.over = over;
                        this.chartLonLat = lonlat;
                        this.getAddress(lonlat);
                        this.addWinDragEvt('reservoirTitle', 'reservoirWin');
                    } else if (type === 'VIDEO_RESERVOIR') {
                        this.video.stat = true;
                        let tempIds = this.divIds;
                        tempIds = tempIds.replace('video,','');
                        tempIds += 'video,';
                        this.updateParam('windows','divIds',tempIds);
                        this.video.address = bd.VIDEO_RESERVOIR[0][0].paramVal;
                        this.mrl = 'rtsp://admin:admin@120.237.164.101/cam/realmonitor?channel=' + poiCode + '&subtype=1';
                        this.addWinDragEvt('videoWin', 'videoWin');
                    } else if (type === 'TYFON' || type === 'LCD_LED' || type === 'LCD_LED_TYFON') {
                        // console.info(bd);
                        this.loud.list = bd.loudDetail;
                        this.loud.name = bd.loudDetail.address;
                        this.loud.nmsg = false;
                        this.loud.ndata = false;
                        this.loud.stat = true;
                        let tempIds = this.divIds;
                        tempIds = tempIds.replace('loud,','');
                        tempIds += 'loud,';
                        this.updateParam('windows','divIds',tempIds);
                        var ttype = bd.loudDetail.termType;
                        if (!ttype) {
                            this.loud.ndata = true;
                            return;
                        }
                        if (type !== 'TYFON') {
                            let flag = false;
                            for (var em in bd.loudDetail) {
                                if (em.indexOf('message') !== -1) {
                                    var ms = bd.loudDetail[em];
                                    if (!!ms) {
                                        flag = true;
                                    }
                                }
                            }
                            if (!flag) {
                                this.loud.nmsg = true;
                            }
                        }
                        this.addWinDragEvt('loudWin', 'loudWin');
                    } else {
                        var temp = bd[type][0];
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
                        let tempIds = this.divIds;
                        tempIds = tempIds.replace('normal,','');
                        tempIds += 'normal,';
                        this.updateParam('windows','divIds',tempIds);
                        this.addWinDragEvt('normalTitle', 'normalWin');
                    }
                });

            },
			// 使窗口支持拖动功能
			addWinDragEvt: function(elName, contentName) {
                var map = config.getParam('map');
                let call = setInterval(() => {
                    let winObj = this.$els[elName];
                    let contentObj = this.$els[contentName];
                    if (!!winObj)
                        WinDrag.drag(winObj, contentObj, map);
                    clearInterval(call);
                }, 10);
            },

            getAddress: function(lonlat) {
                let reqParam = { 'type': 'village', 'lonlat': lonlat.join(' ') };
                $.ajax({
                    url: this.dss+'/topicRead/topic-read!getLocation.action',
                    dataType: 'json',
                    type: 'GET',
                    data: reqParam,
                    success: (json) => {
                        this.charts.lonlat = Number(lonlat[0]).toFixed(2) + 'E, ' + Number(lonlat[1]).toFixed(2) + 'N';
                        this.charts.address = json[0] ? json[0].fullName : '';
                    }
                });
            },

			// 改变应急物资的类型窗口
            exChangeType: function(type) {
                this.emergencty.curType = type;
            },
            // 改变应急物资类型的样式
            exChangeStyle: function(type) {
                var style = { 'color': '#fff', 'background-color': '#27303F' };
                if (this.emergencty.curType == type) return style;
            },
            setReservoirTimer: function() {
                let time = TimeUtil.getNextTimeLong(30) + 30000;
                if (this.reservoirTimer) {
                    window.clearTimeout(this.reservoirTimer);
                }
                this.reservoirTimer = window.setTimeout(() => {
                    this.getPoiData(this.chartLonLat);
                    return this.setReservoirTimer();
                }, time);
            }
        },
		detached: function() {
            if (this.activeStat) {
                this.activeStat = false;
                this.controlActivePoint('');
            }
            if (this.reservoirTimer) {
                window.clearTimeout(this.reservoirTimer);
            }
            let tempIds = this.divIds;
            tempIds = tempIds.replace('normal,','').replace('emergencty,','').replace('reservoir,','').replace('video,','').replace('loud,','');
            this.updateParam('windows','divIds',tempIds);
            this.chartLonLat = [];
        }

    }
</script>

<style scoped="scoped" lang="less">
@import "../../assets/css/common.less";
div.video-panel { width: 700px }
div.nullbg { background: 0; }
.poiPop { width: 427px; height: auto; position: absolute; z-index: 4; right: 0; top: 0px; background: #fff; -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); }
.Close { position: absolute; right: 0; top: 0; height: 20px; width: 20px; background: url("../../assets/img/toolsbar/rightIcon.png") no-repeat; background-position: -153px -60px !important; display: inline-block; zoom: 1; cursor: pointer; }
.popTab { margin: 3px;
    .popTab-box { width: 100%;
        ul { width: 98%; margin: auto; margin-top: 3px; margin-bottom: 3px; min-height: 30px; max-height: 300px; overflow-y: auto; }
        ul li { height: 22px; line-height: 22px; width: 49%; margin-right: 1%; text-align: left; float: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
    }
}
.popTaBorder { border: 1px solid #ccc }
.emergencty { height: auto; overflow: hidden;
    .emergencty-list { height: auto; overflow: hidden; padding: 0px 2px; background: @bg;
        ul li { margin: 2px; float: left; }
        ul li:hover { color: @color; }
    }
}
.reservoir { width:700px; z-index: 4; background: #fff; position: absolute; height:527px; bottom:50px; right:0px;
    .reservoirTop { height: auto; overflow: hidden; margin: 7px 2px 2px 2px;padding-bottom:3px; border-bottom: 1px dashed #ccc;
        .reservoirLeft { float: left; width: 271px; margin: 3px;
            div { line-height: 22px; text-align: left; clear: both;
                em { display: inline-block; width: 22px; height: 18px; vertical-align: middle; margin-top: -4px; }
            }
            .reservoirOver { color: rgb(216, 39, 28) }
            .reservoirLow em { background: url('../../assets/img/common/warn-icon.png') no-repeat center; }
            .reservoirOver em { background: url('../../assets/img/common/warn-icon_over.png') no-repeat center; }
            .waterimg { 
            	 width:100%;
   				 height: 202px;
            	 background: url("../../assets/img/common/sk.png") no-repeat 18px 5px; 
            	position: relative;
                div { position: absolute; line-height: 16px; }
                div.Watered { 
                	top: 21px;
   					 left: 46px;
                    label { position: absolute; top: -2px; left: -30px; }
                }
                div.inWater { 
                	    top: 68px;
   						 right: 39px;
                    label { position: absolute; top: -2px; right: -30px; }
                }
                div.fullWater { bottom: -19px; left: 0px; width: 100%; text-align: center; }
            }
            .outwaterimg { 
            	width:100%;
   				 height: 202px;
            	background: url("../../assets/img/common/sk_over.png") no-repeat 18px 5px; 
            	position: relative;
                div { position: absolute; line-height: 16px; }
                div.Watered { 
                	top: 21px;
    				left: 49px;
                    label { position: absolute; left: -30px; top: -2px; }
                }
                div.inWater { 
                	top: 6px;
    				right: 41px;
                    label { position: absolute; right: -30px; top: -3px; }
                }
                div.fullWater { bottom: -17px; left: 0px; width: 100%; text-align: center; }
            }
        }
        .reservoirRight { float: right; width:416px; height: auto;
            img { width: 99%; height: 270px; }
        }
    }
    .reservoirBottom { height: auto; overflow: hidden;
        .reser-title { height: 26px; line-height: 26px; position: relative;
            span { display: inline-block; background: url("../../assets/img/common/skplace.png") no-repeat 0px 7px; padding-left: 14px; position: absolute; left: 11px; }
        }
        .reser-chart { width: 100%; height: 200px; }
    }
}
.panelhover { -webkit-transition: box-shadow .3s; -moz-transition: box-shadow .3s; -o-transition: box-shadow .3s; transition: box-shadow .3s; }
.panelhover:hover { -webkit-box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.3); -moz-box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.3); box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.3); }
.popTab .popTab-box ul li.width-line { width: 100%; height: 10px; line-height: 10px; margin-bottom: 10px; border-bottom: 1px dashed #666; }
.popTab .popTab-box ul li.width-line:last-child { border-bottom: 0; }

/*big*/
.big .poiPop { 
	width: 600px;
    .popTab .popTab-box ul li { height: 34px; line-height: 34px; }
}
.big div.video-panel { width: 700px }
.big .popTab .popTab-box ul li.width-line { height: 10px; line-height: 10px; }
.big .reservoir{ 
	width: 800px; height: 615px; bottom:50px; right:0px;
	.reservoirTop{ margin: 8px 2px 2px 2px;
        .reservoirLeft { float: left; width: 286px; margin: 3px;
            div { line-height: 30px;
                em { 
                	display: inline-block; 
                	width: 22px; 
                	height: 18px; 
                	vertical-align: middle; 
                	margin-top: -4px; 
                	background-size: 100%;
                }
            }
            .waterimg { 
            	width: 296px; 
            	height: 227px; 
            	background-position: 34px 5px !important; 
            	background-size:70%;
                div { line-height: 20px; }
                div.Watered { 
                	top: 14px;
    			    left: 63px;
                    label { 
                    	top: -3px;
    					left: -44px;
                    }
                }
                div.inWater { 
                	    top: 60px;
    					right: 55px;
                    	label { top: 0px; right: -46px; }
                }
                div.fullWater { bottom: 0px; left: 0px; width: 100%; text-align: center; }
            }
            .outwaterimg { 
            	width: 296px; 
            	height: 227px; 
            	background-position: 34px 3px !important; 
            	background-size: 70%;
                div { line-height: 20px; }
                div.Watered {
                	top: 12px;
    				left: 65px;
                    label { left: -44px; top: -1px; }
                }
                div.inWater {     
                	top: -2px;
   					 right: 55px;
                    label { right: -48px; top: -1px; }
                }
                div.fullWater { bottom: 0px; left: 0px; width: 100%; text-align: center; }
            }
        }
        .reservoirRight { float: right;width: 490px; height: auto;
            img { width: 99%; height: 290px; }
        }
    }
    .reservoirBottom { height: auto; overflow: hidden;
        .reser-title { height: 26px; line-height: 26px; position: relative;
            span { display: inline-block; background: url("../../assets/img/common/skplace.png") no-repeat 0px 7px; padding-left: 14px; position: absolute; left: 11px; }
        }
        .reser-chart { width: 100%; height: 200px; }
    }
}
</style>