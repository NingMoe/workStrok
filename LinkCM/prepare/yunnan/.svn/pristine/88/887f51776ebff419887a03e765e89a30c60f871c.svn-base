<template>
	<div :class="modelClass">
		<div class="modelInfo dataModel" v-if="closeBase">
			<a class="Close" @click="closeBase = false"></a>
			<div class="table-layout flex">
				<div class="table-cell bluecolor fontSize">{{areaName}}{{tipBase.name}}{{tipBase.radarType}}分布图</div>
				<div class="radarTime" v-if="tipBase.dateTime">{{tipBase.dateTime}}</div>
				<div class="">{{tipBase.nameEng}}</div>
			</div>
		</div>
		<div class="modelInfo areaInfo" v-if="closeTyphoon">
			<a class="Close" @click="closeTyphoon = false"></a>
			<div class="table-layout">
				<div class="table-cell">
					<div class="detail">
						<span class="bluecolor ztitle">{{tyInfo.type}}({{tyInfo.code}}) : {{tyInfo.name}}({{tyInfo.ename}})</span>
						<ul>
							<li><label>最新时间：</label><span>{{typhoonTime}}</span></li>
							<li class="lineHeight"><label>中心位置：</label><span>{{{tyInfo.lonlat}}}</span></li>
							<li><label>风速气压：</label><span>{{tyInfo.windPressure}}</span></li>
							<li><label>风圈半径：</label><span>{{tyInfo.radius}}</span></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="modelInfo model" v-if="closeModel">
			<a class="Close" @click="closeModel = false"></a>
			<div class="table-layout">
				<div class="table-cell">
					<div class="detail">
						<span class="bluecolor ztitle">{{areaName}}{{tipModel.modelName}}分布图</span>
						<ul>
							<li class="datatime"><span>{{tipModel.dateTime}}</span></li>
							<li class="wrdata">
								<span class="mian-info" :title="tipModel.mainInfo">{{tipModel.mainInfo}}</span>
								<span class="minor-info" v-if="tipModel.minorInfo" :title="tipModel.minorInfo">{{tipModel.minorInfo}}</span>
							</li>
						</ul>
						<div class="CaptionTopicEn">{{tipModel.modelNameEng}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { updateParam } from '../../vuex/store'
	import TimeUtil from '../../util/tools/TimeUtil'
	import lmap from '../../util/lmap/lmap'
	import config from '../../config'
	import ModelInfo from '../common/model'

	export default {
		data() {
		    return {

		    	map: config.getParam('map'),
		    	layer: undefined,

		        closeBase: false,
		        closeTyphoon: false,
		        closeModel: false,

		        tipBase: { type: '', name: '地质灾害', dateTime: '2016年7月29日 15时50分', nameEng: '' },
		        tipBaseEng: {
		            'radar': 'RADAR MOSAIC', // 雷达图 英文
		            'site': 'WEATHER AUTOMATIC STATIONS', // 监测站
		            'cloud': 'FY-2 SATELLITE CLOUD IMAGES ', // 云图
		            'thunder': 'LIGHTNING', // 雷电
		            'agr': ' AGRICULTURAL SURVEY', // 农情调查
		            'sk_sw': 'RESERVOIR WATER LEVELS', // 水库水位
		            'hl_sw': 'RIVER LEVELS', // 河流水位
		            'airq': 'AIR QUALITY MONITORING', // 空气质量
		            'water': 'WATER QUALITY MONITORING', // 水质监测
		            'hfs': 'NUCLEAR RADIATION MONITORING', // 核辐射监测
		            'poi_VIDEO_RESERVOIR': 'RESERVOIR VIDEOS', // 水库视频
		            'poi_VIDEO_FORESTRY': 'FOREST FIRE VIDEOS', // 林火视频
		            'poi_VIDEO_POLICE': 'PUBLIC SECURITY VIDEOS', // 公安视频
		            'VIDEO_MOBILE': 'PUBLIC VIDEOS', // 公共视频
		            'VIDEO_TRAFFIC': 'REALTIME WEATHER  MONITORING', // 天气实景
		            'ship': 'SHIPS', // 船舶
		            'rainwarn': 'RAIN DISASTER WARNING', //雨量报警
		            'traffic': 'TRAFFIC ', //交通路况
		            'SJZX_ECONOMIC': 'ECONOMGS', // 经济
		            'demage_demage': 'GEOLOGIC HAZARD', // 地质灾害
		            'HZ_TRAFFIC_CAR,HZ_TRAFFIC_TRAIN,HZ_TRAFFIC_PLANE': 'PASSENGER STATIONS', // 客运站
		            'MEDICAL_HOSPITAL,HOSPITAL_JK,HOSPITAL_CAIXUE': 'HOSPITALS', // 医院
		            'SJZX_DANGPOINT_CONSTRUCTION': 'SITE RISKS', // 工地隐患
		            'RESERVOIR,GDSYJB_SHUIKU,SZ_SHUIKU': 'RESEVOIRS', // 水库
		            'EDUCATION_SCHOOL': 'SHCOOLS', // 学校
		            'WATER_POINT': 'WATERLOGGING-PRONE LOCATIONS', // 积水点
		            'mountainTorrents': 'MOUNTAIN WATERSHEDS', // 山洪沟
		            'PILE': 'YARDS', // 堆场
		            'KEYPLACE_IMPORTANT': 'DANGEROUS CHEMICAL STORAGES', // 危化点
		            'FOREST_FIRE_PREVENT': 'FIRE POINTS', // 防火点
		            'TOURIST_SPOT': 'TOURIST SPOTS', // 旅游景点
		            'EMERGENCY_CIVIL': 'CIVIL AFFAIRS BUREAUS', // 民政
		            'EMERGENCY_THREE': 'THREE ANTI', // 三防
		            'EMERGENCY_WATER': 'WATER-CONTROL BUREAUS', // 水利
		            'SJZX_EMERGENCY_POLICE': 'PUBLIC SECURITY BUREAUS', // 公安
		            'SJZX_EMERGENCY_HOMELAND': 'HOMELAND BUREAUS', // 国土
		            'EMERGENCY_FORESTRY': 'FORESTRY ORGANIZATIONS', // 林业
		            'SJZX_EMERGENCY_ENVIRONMENTAL': 'ENVIRONMENTAL PROTECTION AGENCY', // 环保
		            'EMERGENCY_MSA': 'MARITIME BUREAUS', // 海事
		            'SJZX_EMERGENCY_SAFETY': 'SAFETY SUPERVISION BUREAUS', // 安监
		            'SJZX_EMERGENCY_ELECTRIC': 'ELECTRIC POWER BUREAUS', // 电力
		            'SJZX_RESCUE_ELECTRIC': 'POWER RESCUE TEAMS', // 电力
		            'RESCUE_COMM': 'COMMUNICATIONS RESCUE TEAMS', // 通信
		            'RESCUE_MEDICAL': 'MEDICAL RESCUE TEAMS', // 医疗
		            'SJZX_RESCUE_TRAFFIC': 'TRAFFIC RESCUE TEAMS', // 交通
		            'RESCUE_VILLAGE': 'TOWNSHIP RESCUE TEAMS', // 乡镇
		            'SJZX_RESCUE_SEA': 'MARITIME RESCUE TEAMS', // 海上
		            'SJZX_RESCUE_FIRE': 'POLICE RESCUE TEAMS', // 公安
		            'SJZX_KEYPLACE_REFUGES,GDSYJB_SLECTER': 'EVACUATION POINTS', // 避难点
		            'bm_traffice_0': 'WATER AFFAIRS DEPARTMENTS', // 水务部门
		            'bm_traffice_1': 'FORESTRY DEPARTMENTS', // 林业部门
		            'bm_traffice_2': 'POWER SUPPLY DEPARTMENTS', // 供电部门
		            'bm_traffice_3': 'SAFETY SUPERVISION DEPARTMENTS', // 安监部门
		            'bm_traffice_4': 'HOMELANDS DEPARTMENTS', // 国土部门
		            'bm_traffice_5': 'EDUCATION DEPARTMENTS', // 教育部门
		            'bm_traffice_6': 'COMMUNICATIONS SECTORS', // 通讯部门
		            'bm_traffice_7': 'MARITIME SECTORS', // 海事部门
		            'bm_traffice_8': 'ENVIRONMENTAL PROTECTIONS', // 环保部门
		            'bm_traffice_9': 'POLICE DEPARTMENTS', // 公安部门
		            'bm_traffice_10': 'HEALTH DEPARTMENTS', // 卫生部门
		            'bm_traffice_11': 'METEOROLOGICAL DEPARTMENTS', // 气象部门
		            'bm_traffice_12': 'CIVIL AFFAIRS DEPARTMENTS', // 民政部门
		            'bm_traffice_13': 'TRAFFIC UNITS', // 交通部门
		            'bm_traffice_14': 'WATER DEPARTMENTS', // 水利部门
		            'bm_traffice_15': 'DEFENSE DEPARTMENTS', // 三防部门
		            'bm_traffice_16': 'EMERGENCY DEPARTMENTS', // 应急办
		            'bm_traffice_17': 'RESIDENTIAL CONSTRUCTION DEPARTMENTS', // 住建
		            'bm_traffice_18': 'TOURISM BUREAUS' // 旅游局
		        },
		        tipTyphoon: {},
		        tipModel: {
		            modelName: '过去1小时强降水',
		            dateTime: TimeUtil.format(TimeUtil.addTime(new Date(), -2, 'HH'), 'yyyy年MM月dd日HH时') + ' - ' + TimeUtil.format(TimeUtil.addTime(new Date(), -1, 'HH'), 'yyyy年MM月dd日HH时')
		        },
		        modelName: {
		            pollutantDispersion: '污染扩散',
		            stormTide: '风暴潮',
		            waterLogging: '内涝',
		            fireDanger: '森林火点',
		            mountainTorrents: '山洪',
		            mt: '漫滩'
		        },
		        modelNameEng: {
		            pollutantDispersion: 'POLLUTION DIFFUSION STATUS',
		            stormTide: 'STORM SURGE FORECASTING',
		            waterLogging: 'WATERLOGGING ',
		            fireDanger: 'FOREST FIRE ',
		            mountainTorrents: '',
		            mt: 'STORM SURGE INUNDATION FORECASTING'
		        },
		        modelInfo: {
		            past24: { dateTime: -24, text: '过去24小时', texteng: 'IN THE LAST 24 HOURS' },
		            past12: { dateTime: -12, text: '过去12小时', texteng: 'IN THE LAST 12 HOURS' },
		            past6: { dateTime: -6, texteng: 'IN THE LAST 6 HOURS' }, 
		            past0: { dateTime: 0, text: '当前时刻', texteng: 'IN NOW' },
		            future1: { dateTime: 1, text: '未来1小时', texteng: 'IN THE NEXT 1 HOUR' },
		            future2: { dateTime: 2, text: '未来2小时', texteng: 'IN THE NEXT 2 HOURS' },
		            future3: { dateTime: 3, text: '未来3小时', texteng: 'IN THE NEXT 6 HOURS' },
		            heavyRainfall: { dateTime: -1, text: '过去1小时强降水', texteng: 'RAINSTORM IN THE LAST 1 HOUR' },
		            heavyRainfall3: { dateTime: -3, text: '过去3小时强降水', texteng: 'RAINSTORM IN THE LAST 3 HOURS' },
		            heavyRainfall24: { dateTime: -24, text: '过去24小时强降水', texteng: 'RAINSTORM IN THE LAST 24 HOURS' },
		            heavyRainfall_qpf: { dateTime: 1, text: '未来1小时强降水', texteng: 'RAINSTORM IN THE NEXT 1 HOUR' },
		            heavyRainfall3_qpf: { dateTime: 3, text: '未来3小时强降水', texteng: 'RAINSTORM IN THE NEXT 3 HOURS' },
		            heavyRainfall6_2d: { dateTime: 6, text: '未来6小时强降水', texteng: 'RAINSTORM IN THE NEXT 6 HOURS' },
		            heavyRainfall12_2d: { dateTime: 12, text: '未来12小时强降水', texteng: 'RAINSTORM IN THE NEXT 12 HOURS' },
		            heavyRainfall24_2d: { dateTime: 24, text: '未来24小时强降水', texteng: 'RAINSTORM IN THE NEXT 24 HOURS' },
		            heavyRainfall48_2d: { dateTime: 48, text: '未来48小时强降水', texteng: 'RAINSTORM IN THE NEXT 48 HOURS' },
		            heavyRainfall48lj_2d: { dateTime: 48, text: '格点48小时累计强降水', texteng: 'RAINSTORM CUMULATIVE IN THE NEXT 48 HOURS' },
		            heavyRainfall72lj_2d: { dateTime: 72, text: '格点72小时累计强降水', texteng: 'RAINSTORM CUMULATIVE IN THE NEXT 72 HOURS' },
		            galeInstant24: { dateTime: -24, text: '过去24小时瞬时风(格点)', texteng: 'GUST WIND IN THE LAST 24 HOURS' },
		            galeInstant: { dateTime: -1, text: '过去1小时瞬时风(格点)', texteng: 'GUST WIND IN THE LAST 1 HOUR' },
		            futureGaleInstant24: { dateTime: 24, text: '未来24时瞬时风(格点)', texteng: 'GUST WIND IN THE NEXT 24 HOURS' },
		            futureGaleInstant48: { dateTime: 48, text: '未来48小时瞬时风(格点)', texteng: 'GUST WIND IN THE NEXT 48 HOURS' },
		            galeAverage24: { dateTime: -24, text: '过去24小时平均风(格点)', texteng: 'MEAN WIND IN THE LAST 24 HOURS' },
		            galeAverage: { dateTime: -1, text: '过去1小时平均风(格点)', texteng: 'MEAN WIND IN THE LAST 1 HOUR' },
		            futureGaleAverage24: { dateTime: 24, text: '未来24时平均风(格点)', texteng: 'MEAN WIND IN THE NEXT 24 HOURS' },
		            futureGaleAverage48: { dateTime: 48, text: '未来48小时平均风(格点)', texteng: 'MEAN WIND IN THE NEXT 48 HOURS' },
		            pastMaxTemperature24: { dateTime: -24, text: '过去24小时高温(格点)', texteng: 'MAXIMUM TEMPERATURE IN THE LAST 24 HOURS' },
		            futureMaxTemperature24: { dateTime: 24, text: '未来24小时高温(格点)', texteng: 'MAXIMUM TEMPERATURE IN THE NEXT 24 HOURS' },
		            futureMaxTemperature48: { dateTime: 48, text: '未来48小时高温(格点)', texteng: 'MAXIMUM TEMPERATURE IN THE NEXT 48 HOURS' },
		            futureMaxTemperature72: { dateTime: 72, text: '未来72小时高温(格点)', texteng: 'MAXIMUM TEMPERATURE IN THE NEXT 72 HOURS' },
		            pastMinTemperature24: { dateTime: -24, text: '过去24小时低温(格点)', texteng: 'MINIMUM TEMPERATURE IN THE LAST 24 HOURS' },
		            futureMinTemperature24: { dateTime: 24, text: '未来24小时低温(格点)', texteng: 'MINIMUM TEMPERATURE IN THE NEXT 24 HOURS' },
		            futureMinTemperature48: { dateTime: 48, text: '未来48小时低温(格点)', texteng: 'MINIMUM TEMPERATURE IN THE NEXT 48 HOURS' },
		            futureMinTemperature72: { dateTime: 72, text: '未来72小时低温(格点)', texteng: 'MINIMUM TEMPERATURE IN THE NEXT 72 HOURS' },
		            mountainTorrents: { dateTime: 0, text: '当前时刻山洪', texteng: 'MOUNTAIN TORRENTS IN NOW' },
		            mountainTorrents1: { dateTime: 1, text: '未来1小时山洪', texteng: 'MOUNTAIN TORRENTS IN THE NEXT 1 HOUR' },
		            mountainTorrents2: { dateTime: 2, text: '未来2小时山洪', texteng: 'MOUNTAIN TORRENTS IN THE NEXT 2 HOURS' },
		            mountainTorrents3: { dateTime: 3, text: '未来3小时山洪', texteng: 'MOUNTAIN TORRENTS IN THE NEXT 3 HOURS' },
		            r24h_024: { dateTime: 24, text: '未来24小时降水(≥25mm)', texteng: 'RAINSTORM IN THE NEXT 24 HOURS(≥25mm)' },
		            r24h_048: { dateTime: 48, text: '未来48小时降水(≥25mm)', texteng: 'RAINSTORM IN THE NEXT 48 HOURS(≥25mm)' },
		            r24h_072: { dateTime: 72, text: '未来72小时降水(≥25mm)', texteng: 'RAINSTORM IN THE NEXT 72 HOURS(≥25mm)' },
		            w10m_024: { dateTime: 24, text: '未来24小时平均风(落区)', texteng: 'MEAN WIND IN THE NEXT 24 HOURS' },
		            w10m_048: { dateTime: 48, text: '未来48小时平均风(落区)', texteng: 'MEAN WIND IN THE NEXT 48 HOURS' },
		            w10m_072: { dateTime: 72, text: '未来72小时平均风(落区)', texteng: 'MEAN WIND IN THE NEXT 72 HOURS' },
		            tmin_024: { dateTime: 24, text: '未来24小时低温(≤5℃落区)', texteng: 'MINIMUM TEMPERATURE IN THE NEXT 24 HOURS' },
		            tmax_024: { dateTime: 24, text: '未来24小时高温(>35℃落区)', texteng: 'MAXIMUM TEMPERATURE IN THE NEXT 24 HOURS' },
		            tmin_048: { dateTime: 48, text: '未来48小时低温(≤5℃落区)', texteng: 'MINIMUM TEMPERATURE IN THE NEXT 48 HOURS' },
		            tmax_048: { dateTime: 48, text: '未来48小时高温(>35℃落区)', texteng: 'MAXIMUM TEMPERATURE IN THE NEXT 48 HOURS' },
		            tmin_072: { dateTime: 72, text: '未来72小时低温(≤5℃落区)', texteng: 'MINIMUM TEMPERATURE IN THE NEXT 72 HOURS' },
		            tmax_072: { dateTime: 72, text: '未来72小时高温(>35℃落区)', texteng: 'MAXIMUM TEMPERATURE IN THE NEXT 72 HOURS' }
		        }
		    }
		},
		vuex: {
	        getters: {
                dss_sj: state => state.dss_sj,
	            areaName: state => state.areaName,
	            code: state => state.cityCode,
	            typhoon: state => state.typhoon,
	            model: state => state.model,
	            dropzone: state => state.dropzone,
	            poi: state => state.poi,
	            pdModel: state => state.pollutantDispersion,
	            baseInfo: state => state.baseInfo,
	            radarTime: state => state.radar.dateTime,
	            checkTime: state => state.radar.checkTime,
	            sysMinTime: state => state.time.sysMinTime,
	            tyInfo: state => state.typhoon.info
	        },
	        actions: { updateParam }
	    },
	    computed: {
	        modelClass: function() {
	            let num = 0;
	            if (this.closeModel) num++;
	            if (this.closeTyphoon) num++;
	            if (this.closeBase) num++;
	            if (num === 1) {
	                return 'modelBan oneWin';
	            } else if (num === 2) {
	                return 'modelBan twoWin';
	            } else if (num === 3) {
	                return 'modelBan thrWin';
	            }
	        },
	        // 台风时间
	        typhoonTime: function() {
	            if (!!this.tyInfo.dateTime) return this.tyInfo.dateTime.substring(0, 16);
	            else return '--';
	        }
	    },
	    watch: {
	        'typhoon.status': function() {
	            this.closeTyphoon = this.typhoon.status;
	        },
	        'model.status': function() {
	            if (!this.model.status) {
	                if (this.layer) {
	                    lmap.icon.clear(this.layer);
	                    this.tipModel = {
	                        'modelName': this.tipModel.modelName,
	                        'dateTime': this.tipModel.dateTime,
	                        'mainInfo': '',
	                        'minorInfo': '',
	                        'modelNameEng': modelNameEng
	                    };
	                }
	            }
	            this.closeModel = this.model.status;
	        },
	        'model.pType': function() {
	            if (!this.closeModel && this.model.status) {
	                this.closeModel = true;
	            }
	        },
	        'dropzone.cType': function() {
	            this.changeModelInfo();
	        },
	        'dropzone.dateTime': function() {
	            this.changeModelInfo();
	            this.changeBaseInfo();
	        },
	        'model.cType': function() {
	            this.changeModelInfo();
	        },
	        'model.dateTime': function() {
	            this.changeModelInfo();
	            this.changeBaseInfo();
	        },
	        'pdModel.address': function() {
	            this.changeModelInfo();
	        },
	        'pdModel.chemicals': function() {
	            this.changeModelInfo();
	        },
	        'baseInfo.type': function() {
	            this.changeBaseInfo();
	        },
	        'baseInfo.status': function() {
	            this.closeBase = this.baseInfo.status;
	        },
	        'radarTime': function() {
	            this.changeBaseInfo();
	        },
	        'tyInfo.name': function(name) {
	            this.closeTyphoon = !!name;
	        }
	    },
	    methods: {
	        clearPDModelInfo: function() {
	            let dataModel = this.model;
	            if (dataModel.pType === 'pollutantDispersion') {
	                let modelName = dataModel.cType.split('_')[0].replace('pollutantDispersion', '');
	                modelName = modelName ? modelName + '小时' : '';
	                modelName = modelName + this.modelName[dataModel.pType];
	                let dateTime = TimeUtil.format(dataModel.dateTime, 'yyyy年MM月dd日HH时');
	                this.tipModel = {
	                    'modelName': modelName,
	                    'dateTime': dateTime,
	                    'mainInfo': '',
	                    'minorInfo': '',
	                    'modelNameEng': this.modelNameEng['pollutantDispersion']
	                };
	            }
	        },
	        changeModelInfo: function() {
	            if (this.modelInfoTimer) window.clearTimeout(this.modelInfoTimer);
	            this.modelInfoTimer = window.setTimeout(() => {
	                let dzcType = this.dropzone.cType;
	                let dataModel = this.model;
	                if (ModelInfo.dropzone[dzcType]) {
	                    dataModel = this.dropzone;
	                }
	                if (!dataModel.cType) {
	                    this.clearPDModelInfo();
	                    return;
	                }
	                let modelInfo = this.modelInfo;
	                let modelName = '';
	                let modelNameEng = '';
	                let dateTime = '';
	                let mainInfo = '';
	                let minorInfo = '';
	                if ('heavyRainfall,gale,temp'.indexOf(dataModel.pType) !== -1) {
	                    this.clearPDModelInfo();
	                    modelName = modelInfo[dataModel.cType].text;
	                    modelNameEng = modelInfo[dataModel.cType].texteng;
	                    let count = Number(modelInfo[dataModel.cType].dateTime);
	                    let isPast = count > 0 ? 1 : 0;
	                    let startTime = TimeUtil.addTime(dataModel.dateTime, isPast, 'HH');
	                    let startTimeStr = TimeUtil.format(startTime, 'yyyy年MM月dd日HH时');
	                    let endTime = TimeUtil.addTime(startTime, count, 'HH');
	                    let endTimeStr = TimeUtil.format(endTime, 'yyyy年MM月dd日HH时');
	                    if (startTime.getTime() > endTime.getTime()) {
	                        dateTime = endTimeStr + ' - ' + startTimeStr;
	                    } else {
	                        dateTime = startTimeStr + ' - ' + endTimeStr;
	                    }
	                    if ('gale' === dataModel.pType && ((dataModel.cType.indexOf('tmin') !== -1) && (dataModel.cType.indexOf('tmax') !== -1))) {
	                        let that = this;
	                        let levels = dataModel.levels;
	                        levels = levels === '' ? '1,2,3,4,5,6,7' : levels;
	                        let dataTime = TimeUtil.format(TimeUtil.addTime(dataModel.dateTime, -1, 'HH'), 'yyyyMMddHHmm');
	                        let code = this.code;
	                        code = code.length < 4 ? code + '00' : code;
	                        code = code.length < 6 ? code + '00' : code;
	                        let reqParam = {
	                            dateTime: dataTime,
	                            modelType: dataModel.cType,
	                            levels: levels,
	                            areaCode: this.code
	                        };
	                        $.ajax({
	                            url: this.dss_sj+'/gisInfo/gis-info!queryModelMaxValue.action',
	                            dataType: 'json',
	                            type: 'GET',
	                            data: reqParam,
	                            success: (json) => {
	                                if (json.value) {
	                                    if (!this.map) {
	                                        this.initSiteBox();
	                                    }
	                                    this.siteId = json.value.siteId;
	                                    this.dot(Number(json.value.lon), Number(json.value.lat), json.value.siteName);
	                                    this.tipModel = {
	                                        'modelName': modelName,
	                                        'dateTime': dateTime,
	                                        'mainInfo': '最大风：' + json.value.siteName + ' (' + json.value.siteId + ') ' + json.value.maxValue + 'm/s',
	                                        'minorInfo': minorInfo,
	                                        'modelNameEng': ' '
	                                    };
	                                } else {
	                                    this.tipModel = {
	                                        'modelName': modelName,
	                                        'dateTime': dateTime,
	                                        'mainInfo': '',
	                                        'minorInfo': '',
	                                        'modelNameEng': modelNameEng
	                                    };
	                                    if (this.layer) {
	                                        lmap.icon.clear(this.layer);
	                                    }
	                                }
	                            },
	                            error: function() {
	                                this.tipModel = {
	                                    'modelName': modelName,
	                                    'dateTime': dateTime,
	                                    'mainInfo': '',
	                                    'minorInfo': '',
	                                    'modelNameEng': modelNameEng
	                                };
	                                if (this.layer) {
	                                    lmap.icon.clear(this.layer);
	                                }
	                            }
	                        });
	                        return;
	                    } else {
	                        if (this.layer) {
	                            lmap.icon.clear(this.layer);
	                        }
	                    }
	                } else {
	                    if (this.layer) {
	                        lmap.icon.clear(this.layer);
	                    }
	                    if ('waterLogging,fireDanger,mountainTorrents'.indexOf(dataModel.pType) !== -1) {
	                        modelName = modelInfo[dataModel.cType].text + this.modelName[dataModel.pType];
	                        modelNameEng = this.modelNameEng[dataModel.pType] + modelInfo[dataModel.cType].texteng;
	                    } else {
	                        modelName = this.modelName[dataModel.pType];
	                        modelNameEng = this.modelNameEng[dataModel.pType];
	                    }
	                    if (dataModel.pType === 'pollutantDispersion') {
	                        mainInfo = this.pdModel.address ? '污染源：' + this.pdModel.address : '';
	                        minorInfo = this.pdModel.chemicals ? '污染物：' + this.pdModel.chemicals : '';
	                        modelName = dataModel.cType.split('_')[0].replace('pollutantDispersion', '');
	                        modelName = modelName ? modelName + '小时' : '';
	                        modelName = modelName + this.modelName[dataModel.pType];
	                        if (mainInfo) {
	                            modelNameEng = ' ';
	                        } else {
	                            modelNameEng = this.modelNameEng[dataModel.pType];
	                        }
	                    } else {
	                        this.clearPDModelInfo();
	                    }
	                    dateTime = TimeUtil.format(dataModel.dateTime, 'yyyy年MM月dd日HH时');
	                }
	                this.tipModel = {
	                    'modelName': modelName,
	                    'dateTime': dateTime,
	                    'mainInfo': mainInfo,
	                    'minorInfo': minorInfo,
	                    'modelNameEng': modelNameEng
	                };
	            }, 80);
	        },
	        changeBaseInfo: function() {
	            if (this.baseInfo.type === 'radar') {
	                let radarTime = TimeUtil.convertToDate(this.radarTime);
	                let currTime = TimeUtil.convertToDate(this.checkTime);
	                let radarType = '';
	                if (radarTime.getTime() > currTime.getTime()) {
	                    radarType = '外推';
	                } else {
	                    radarType = '实况';
	                }
	                let dateTime = TimeUtil.format(this.sysMinTime, 'yyyy年MM月dd日HH时mm分');
	                this.tipBase = {
	                    name: this.baseInfo.name,
	                    dateTime: dateTime,
	                    radarType: radarType,
	                    nameEng: this.tipBaseEng[this.baseInfo.type]
	                };
	            } else {
	                this.tipBase = {
	                    name: this.baseInfo.name,
	                    nameEng: this.tipBaseEng[this.baseInfo.type]
	                }
	            }
	        },
	        dot: function(lon, lat, address) {
	            if (this.layer) {
	                lmap.icon.clear(this.layer);
	            }
	            let style = {
	                anchor: [14, 0],
	                iconUrl: 'http://10.148.16.56/topic/little/toolbar/gale.png',
	                iconSize: [28, 40],
	                fontColor: 'red',
	                fontSize: '12px',
	                outColor: 'white',
	                outWidth: 3,
	                text: address,
	                offsetY: 10,
	                offsetX: 10
	            };
	            this.style = style;
	            lmap.icon.addIcon(this.layer, style, lon, lat, 'maxWindSite');
	        },
	        clickEvt: function(evt) {
	            let feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
	                return feature;
	            });
	            if (!!feature) {
	                let type = feature.get('name');
	                if (type == 'maxWindSite') {
	                    let tempStyle = $.extend({}, this.style);
	                    tempStyle.iconUrl = 'http://10.148.16.56/topic/little/toolbar/sgale.png';
	                    lmap.icon.setStyle(feature, tempStyle);
	                    let wkt = lmap.draw.getWkt(feature);
	                    let lonlat = wkt.replace('POINT(', '').replace(')', '').split(' ');
	                    let lon = Number(Number(lonlat[0]).toFixed(2));
	                    let lat = Number(Number(lonlat[1]).toFixed(2));
	                    this.updateParam('siteBox', 'lon', lon);
	                    this.updateParam('siteBox', 'lat', lat);
	                    this.updateParam('siteBox', 'siteId', this.siteId);
	                    this.updateParam('siteBox', 'feature', feature);
	                    this.updateParam('siteBox', 'style', this.style);
	                }
	            }
	        },
	        initSiteBox: function() {
	            this.layer = lmap.icon.initLayer(this.map, 'point');
	            this.map.on('singleclick', this.clickEvt);
	        }
	    },
	    ready: function() {
	        this.tipTyphoon = this.typhoon.info;
	    },
	    detached: function() {
	    	this.map.removeLayer(this.layer);
	        this.map.un('singleclick', this.clickEvt);
	    }
	}
</script>

<style scoped lang="less">
@import "../../assets/css/common.less";
.oneWin {
	margin-left: -177px;
}

.twoWin {
	margin-left: -390px;
}

.thrWin {
	margin-left: -580px;
}

.modelBan {
	position: absolute;
	top: 0px;
	z-index: 2;
	left: 50%;
}

.table-layout {
	width: 100%;
	height: 100%;
	div{
		font-family: "Microsoft Yahei";
	}
}

.table-cell {
	vertical-align: middle;
	text-align: center;
}

.bluecolor {
	color: @color;
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

.flex {
	display: -webkit-box;
	display: -moz-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	
	align-items: center;
	-webkit-align-items: center;
	
	-webkit-box-align: center;
	-moz-box-align: center;
	-ms-flex-align: center;
	
	-webkit-box-pack: center;
	-moz-box-pack: center;
	-ms-flex-pack: center;

	justify-content: center;
	-webkit-justify-content: center;
	
	flex-direction: column;
	-webkit-flex-direction: column;
	-moz-flex-direction: column;
	-ms-flex-direction: column;
}

div.areaInfo {
	width: 435px;
}

.modelInfo {
	padding: 0 2px;
	width: 342px;
	float: left;
	margin-left: 5px;
	height: 62px;
	position: relative;
	background: #fff;
	-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
	-moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
	.detail {
		.ztitle {
			font-size: 14px;
			display: inline-block;
			height: 24px;
			line-height: 24px;
			width: 100%;
		}
		li {
			float: left;
			width: 49%;
			text-align: left;
			margin-left: 1%;
			line-height:16px;
			height:16px;
		}
		li.lineHeight {
			line-height: 12px
		}
		li.datatime {
			width: 100%;
			text-align: center;
		}
		li.wrdata {
			width: 99%;
			text-align: center;
			color: red;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			position: relative;
			z-index: 2;
			.mian-info {
				display: inline-block;
				overflow: hidden;
				min-width: 60%;
			    text-align: left; 
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-right: 5px;
			}
			.minor-info {
				display: inline-block;
				text-align: left;
				margin-right: 5px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
	.CaptionTopicEn {
		position: absolute;
		z-index: 1;
		width: 100%;
		height: 24px;
		line-height: 24px;
		bottom: 0;
		left: 0;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		background: #fff;
		font-family: "Microsoft Yahei";
	}
}

.fontSize {
	font-size: 16px;
	line-height: 20px;
}

.radarTime {
	width: 100%;
	line-height: 20px;
	text-align: center;
}

.hothour {
	margin-left: 165px;
	.detail li {
		float: none;
		width: 100%;
		text-align: center;
	}
}
/*big*/

.big div.areaInfo {
	width: 557px;
}

.big div.dataModel {
	width: 502px;
}

.big .modelInfo {
	width: 502px;
	height: 93px;
	.detail {
		.ztitle {
			line-height: 36px;
			font-size: 24px;
		}
		li {
			line-height: 28px;
			height: 28px;
		}
		li.lineHeight {
			line-height: 14px
		}
	}
	.fontSize {
		font-size: 24px;
		margin-bottom: 5px;
	}
	.radarTime {
		width: 100%;
		line-height: 20px;
		text-align: center;
	}
	.CaptionTopicEn {
		height: 34px;
		line-height: 34px;
	}
}

.big .oneWin {
	margin-left: -264px;
}

.big .twoWin {
	margin-left: -516px;
}

.big .thrWin {
	margin-left: -790px;
}
</style>