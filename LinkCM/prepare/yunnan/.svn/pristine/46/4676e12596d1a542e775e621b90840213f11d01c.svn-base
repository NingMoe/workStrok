<template>
    <div>
        <div class="airq poiPop panelhover" v-if="stat==true" id="air" v-el:air-win>
        	<a class="Close" @click="close('normal')"></a>
        	<div class="title">
            	<label>空气质量检测-{{list.position}}</label>
           </div>
           <div class="popIcon">
	            <ul>
	                <li class="icon-before bf_3">
	                	<label>城市名称</label>
	                	<span>{{list.area}}</span>
	                </li>
	                <li class="icon-before bf_2">
	                	<label>空气质量指数</label>
	                	<span>{{list.aqi}}</span>
	                </li>
	                <li class="icon-before bf_1">
	                	<label>首要污染物</label>
	                	<span>{{list.primaryPollutant}}</span>
	                </li>
	                <li class="icon-before bf_0">
	                	<label>指数类别</label>
	                	<span>{{list.quality}}</span>
	                </li>
	            </ul>
	            <ul>
	                <li class="popIconW">监测点编码：{{list.stationCode}}</li>
	                <li class="popIconW">经纬度：{{list.lon}},{{list.lat}}</li>
	                <li class="popIconW">监测点名称：{{list.position}}</li>
	                <li class="popIconW">发布时间：{{list.time}}</li>
	            </ul>
	            <ul>
	                <li class="popIconW popIconT"><span>一氧化碳<font>(ug/m3)</font></span>
		                <ul>
		                	<li><label>1小时平均：</label><a>{{list.co}}</a></li>
		                	<li><label>24小时滑动平均：</label><a>{{list.co24h}}</a></li>
		                </ul>
	                </li>
	                <li class="popIconW popIconT"><span>二氧化硫<font>(ug/m3)</font></span>
		                <ul>
		                	<li><label>1小时平均：</label><a>{{list.so2}}</a></li>
	                		<li><label>24小时滑动平均：</label><a>{{list.so2_24h}}</a></li>
		                </ul>
	                </li>
	                <li class="popIconW popIconT"><span>二氧化氮<font>(ug/m3)</font></span>
		                <ul>
		                	<li><label>1小时平均：</label><a>{{list.no2}}</a></li>
	               			 <li><label>24小时滑动平均：</label><a>{{list.no2_24h}}</a></li>
		                </ul>
	                </li>
	                <li class="popIconW popIconT"><span>臭氧<font>(ug/m3)</font></span>
		                <ul>
		                	<li><label>1小时平均：</label><a>{{list.o3}}</a></li>
			                <li><label>8小时滑动平均：</label><a>{{list.o3_8h}}</a></li>
			                <li><label>日最大8小时滑动平均：</label><a>{{list.o3_8h_24h}}</a></li>
		                </ul>
	                </li>
					<li class="popIconW popIconT" style="width: 100%;"><span>颗粒物<font>(ug/m3)</font></span>
		                <ul>
		                	<li><label>（粒径≤2.5μm）1小时平均：</label><a>{{list.pm2_5}}</a></li>
			                <li><label>（粒径≤2.5μm）24小时滑动平均：</label><a>{{list.pm2_5_24h}}</a></li>
			                <li><label>（粒径≤10μm）1小时平均：</label><a>{{list.pm10}}</a></li>
			                <li><label>（粒径≤10μm）24小时滑动平均：</label><a>{{list.pm10_24h}}</a></li>
		                </ul>
	                </li>
	            </ul>
	        </div>
        </div>
    </div>
</template>

<script>

    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import { updateParam } from '../../vuex/store'
	import WinDrag from 'util/tools/WinDrag'

    export default {
        data() {
		    return {
		        airq: {
		            url: this.dss+'/airq/airq!queryAirqImage.action',
		            name: 'airq',
		            opacity: '1',
		            extent: [109.6, 20, 117.2, 25.5],
		            params: {
		                dateTime: '2016-07-24 14:00:00',
		                code: '440000'
		            }
		        },
		        list: '',
		        stat: false,
		        activeStat: false, //记录图标选中状态
		        map: config.getParam('map'),
		        WMS: undefined
		    }
		},
		vuex: {
		    getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
		        dateTime: state => state.airq.dateTime,
		        code: state => state.cityCode,
		        divIds: state => state.windows.divIds
		    },
		    actions: {
		        updateParam
		    }
		},
		computed: {
		    // 发布时间截取
		    publishTime: function() {
		        if (!!this.list.time) return this.list.time.substring(0, 16) }
		},
		methods: {
		    close: function() {
		        let tempIds = this.divIds;
		        tempIds = tempIds.replace('air,', '');
		        this.updateParam('windows', 'divIds', tempIds);
		        this.stat = false;
		        this.activeStat = false;
		        this.controlActivePoint('');
		    },
		    // 显示空气质量图层
		    initLayer: function() {
		        this.airq.params.dateTime = this.dateTime;
		        this.airq.params.code = this.code;
		        this.WMS = lmap.image.loadImageWMS(this.map, this.airq, 'poitop');
		    },
		    // 点击事件
		    clickEvt: function(evt) {
		        this.getAirqData(lmap.controler.getEvtLonLat(evt));
		    },
		    getAirqData: function(lonlat) {
		        let zoom = this.map.getView().getZoom() + '';
		        let url = this.dss+'/airq/airq!queryAirqDataByClick.action';
		        let qdata = { PARAM: { dateTime: this.dateTime, code: this.code, lon: lonlat[0], lat: lonlat[1], zoom: zoom } };
		        qdata.PARAM = JSON.stringify(qdata.PARAM);
		        $.getJSON(url, qdata, (bd) => {
		            if (bd.length > 0) {
		                this.list = bd[0];
		                this.stat = true;
		                this.activeStat = true;
		                this.controlActivePoint('air#' + bd[0].lon + '#' + bd[0].lat);
		                let tempIds = this.divIds;
		                tempIds = tempIds.replace('air,', '');
		                tempIds += 'air,';
		                this.updateParam('windows', 'divIds', tempIds);
		                this.addWinDragEvt('airWin');
		            }
		        });
		    },
		    // 图标选中
		    controlActivePoint: function(val) {
		        this.updateParam('activePoint', 'point', val)
		    },
		    // 使窗口支持拖动功能
		    addWinDragEvt: function(elName) {
		        let call = setInterval(() => {
		            let winObj = this.$els[elName];
		            if (!!winObj)
		                WinDrag.drag(winObj, winObj, this.map);
		            clearInterval(call);
		        }, 10);
		    }
		},
		compiled: function() {
		    this.initLayer();
		    this.map.on('singleclick', this.clickEvt);
		},
		detached: function() {
		    let tempIds = this.divIds;
		    tempIds = tempIds.replace('air,', '');
		    this.updateParam('windows', 'divIds', tempIds);
		    this.map.removeLayer(this.WMS);
		    this.map.un('singleclick', this.clickEvt);
		    this.stat = false;
		    if (this.activeStat) {
		        this.activeStat = false;
		        this.controlActivePoint('');
		    }
		}
    }
</script>

<style scoped lang='less'>
@import "../../assets/css/common.less";

.poiPop {
	width: 427px;
	height: auto;
	position: absolute;
	z-index: 3;
	right: 0;
	top: 0px;
	background: #fff;
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
.popIcon ul {
	width: 100%;
}
.popIcon ul li {
	line-height: 26px;
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	float: left;
}
.popIcon ul li label {
	display: block;
}
.popIcon ul li span {
	display: block;
	color: @color;
	font-size: 13px;
	font-weight: bold;
}
.popIcon ul li.li-before {
	width: 50%;
	text-align: center;
	margin: 8px 0px 10px 0px;
	line-height: 22px;
	float: left;
}
.popIcon ul li.bf_0:before {
	content: "";
	background: url('../../assets/img/dis/05.png') no-repeat center 8px;
	display: block;
	height: 40px;
}
.popIcon ul li.bf_1:before {
	content: "";
	background: url('../../assets/img/dis/06.png') no-repeat center 8px;
	display: block;
	height: 40px;
}
.popIcon ul li.bf_2:before {
	content: "";
	background: url('../../assets/img/dis/07.png') no-repeat center 8px;
	display: block;
	height: 40px;
}
.popIcon ul li.bf_3:before {
	content: "";
	background: url('../../assets/img/dis/08.png') no-repeat center 8px;
	display: block;
	height: 40px;
}
.popIcon ul li.icon-before {
	width: 23%;
	text-align: center;
	margin: 8px 0px 10px 0px;
	line-height: 22px;
	font-size: 16px;
	float: left;
}
.popIcon ul li.bf_1 {
	width: 30%
}
.popIcon ul li.popIconW {
	width: 49%;
	margin-left: 1%;
	line-height: 22px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	position: relative;
	float: left;
}
.popIcon ul li.popIconT {
	margin-top: 15px;
}
.popIcon ul li.popIconW label, .popIcon ul li.popIconW a {
	font-weight: normal;
	float: left;
}
.popIcon ul li.popIconW span {
	font-size: 14px;
	font-weight: bold;
	display: block;
}
.popIcon ul li.popIconW span font {
	font-weight: normal;
	font-size: 12px;
	margin-left: 5px;
}
.popIcon ul li.popIconW ul li {
	width: 100%;
	margin-left: 0;
}
.popIcon ul li.popIconW ul li label {
	font-weight: normal;
	float: left;
}
.popIcon ul li.popIconW ul li a {
	font-weight: bold;
	float: left;
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

/*big*/
.big .poiPop {
	width: 600px;

	.popIcon ul li.icon-before {
		line-height: 30px;
		font-size: 20px;
	}
	.popIcon ul li.popIconW {
		line-height: 30px;

		span {
			font-size: 20px;

			font {
				font-size: 16px;
			}
		}
	}
	.popIcon ul li.popIconW ul li {
		line-height: 30px;
	}
	.popIcon ul li span {
		font-size: 20px
	}
	.popIcon ul li label {
		font-size: 18px;
	}
}
</style>