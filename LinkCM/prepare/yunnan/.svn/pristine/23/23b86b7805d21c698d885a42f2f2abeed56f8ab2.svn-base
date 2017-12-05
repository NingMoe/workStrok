<template>
    <div class="typhoon" v-if="winStatus==true">
    	<a class="Close" @click="close()"></a>
        <div class="list-table">
            <div class="list-title">
                <table cellpadding="0" cellspacing="0">
                    <tr>
                        <td>台风</td>
                        <td>编号</td>
                        <td>中文名</td>
                        <td>英文名</td>
                        <td>定位 <div  @click="changeTable()" :class="this.flag? 'show':'hide'"></div></td>
                    </tr>
                </table>
            </div>
            <div class="list-content">
                <table cellpadding="0" cellspacing="0">
					<tbody v-for="item in list">
						<tr v-if="item.status==true">
							<td><input type="checkbox" checked="checked" @click="getObs(item.tsid,item.tscname,$event,item.inilid)"/></td>
							<td>{{ item.inilid }}</td>
							<td>{{ item.tscname }}</td>
							<td>{{ item.tsename }}</td>
							<td><label @click="setPosition(item.tsid)" class="location">定位</label></td>
						</tr>
						<tr v-show="flag" v-if="item.status==false">
							<td v-else><input type="checkbox" @click="getObs(item.tsid,item.tscname,$event,item.inilid)"/></td>
							<td>{{ item.inilid }}</td>
							<td>{{ item.tscname }}</td>
							<td>{{ item.tsename }}</td>
							<td><label @click="setPosition(item.tsid)" class="location">定位</label></td>
						</tr>
					</tbody>
                </table>
            </div>
            <div class="list-path">
                <div class="list-path-tl">
                	<a>路径信息</a><span>({{ inilid }}{{ typhoonName }})</span>
                	<label>*红色表示预报路径*</label>
                	<div @click="showMorePath()" :class="this.tfTime? 'show':'hide'"></div>
                </div>
                <div class="list-path-title">
                    <table cellpadding="0" cellspacing="0">
                        <tr>
                            <td>时间</td>
                            <td>气压(pa)</td>
                            <td>风速(m/s)</td>
                        </tr>
                    </table>
                </div>
                <div :class="[tfTime?'list-path-contentTime':'list-path-content']" v-el:path>
                    <table cellpadding="0" cellspacing="0" v-el:path-list>
                    	<tbody v-for="it in fst" >
							<tr v-if="it.id!=null" style="background-color:#F5E7E6" @click="drawTcCircle(it), autoScroolPathList(it.id)" point={{it.id}} type="fst">
	                            <td> {{ it.bjdatetime }} </td>
	                            <td> {{ it.pressure }} </td>
	                            <td> {{ it.windspeed }} </td>
	                        </tr>
                        </tbody>
                        <tr v-for="item in path" @click="drawTcCircle(item), autoScroolPathList(item.id)" point={{item.id}} type="obs">
                            <td> {{ item.bjdatetime }} </td>
                            <td> {{ item.pressure }} </td>
                            <td> {{ item.windspeed }} </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="inCity">
            	<div class="list-path-tl">
            		<a>影响范围</a>
            		<em class="loada"></em>
            		<div @click="showtfcity()" :class="this.tcity? 'show':'hide'"></div>
            	</div>
	            <div class="inCity-title">
	                <table cellpadding="0" cellspacing="0">
	                    <tr>
	                        <td>序号</td>
	                        <td>影响区域
	                        	<!--<ul>
	                        		<li name="city">城市</li>
	                        		<li name="county">县城</li>
	                        		<li name="town">城镇</li>
	                        		<li name="all">全部区域</li>
	                        	</ul>-->
	                        </td>
	                        <td>归属区域</td>
	                        <td class="tc-select">{{ circleLevel }}
	                        	<ul>
	                        		<li name="q6" @click="filterLevel('06')">6级风圈</li>
									<li name="q7" @click="filterLevel('07')">7级风圈</li>
	                        		<li name="q8" @click="filterLevel('08')">8级风圈</li>
	                        		<li name="q10" @click="filterLevel('10')">10级风圈</li>
	                        		<li name="q12" @click="filterLevel('12')">12级风圈</li>
	                        		<li name="all" @click="filterLevel('all')">全部风圈</li>
	                        	</ul>
	                        </td>
	                    </tr>
	                </table>
					<span v-if="filterCitys.length==0" class="no-effect">暂无影响区域</span>
	            </div>
	            <div class="inCity-content" :class="[tcity?'inCity-contentTf':'inCity-content-show']">
	            	<table cellpadding="0" cellspacing="0">
	            		<tbody v-for="it in filterCitys">
            				<tr v-if="it.parentAreaCode==code">
		                        <td>{{ $index+1 }}</td>
		                        <td>{{ it.areaName }}</td>
		                        <td>{{ it.parentAreaName }}</td>
		                        <td :style="getECityColor(it.rr)">{{ getCircleLev(it.rr) }}</td>
		                    </tr>
	            		</tbody>
	                </table>
	            </div>
	        </div>
			<div>
				<div class="title">城市测距（千米）</div>
				<div class="city-distance">
					<label v-if="disCitys.length==0">暂无测距信息</label>
					<ul>
						<template v-for="it in disCitys">
							<li v-if="it.parentAreaCode==code">{{ it.areaName }}：{{ it.distance }}</li>
						</template>
					</ul>
				</div>
			</div>
        </div>
    </div>
    <div class="typhoonInfo" :style="getPathPosition" v-if="winStat==true">
    	<div class="title">{{inilid}}{{winData.tsName}}</div> <!-- (实况路径) -->
    	<div class="InfoPanle">
    		<ul>
    			<li><label>时</label>间：<a><span>{{ winData.time }}</span></a></li>
    			<li style="line-height:18px;">中心位置：<a><span>{{winData.lon}}<sup>°</sup>E, {{winData.lat}}<sup>°</sup>N</span></a></li>
    			<li v-if="!winData.windspeed" class="two" style="border-left:0">最大风速：</li>
				<li v-else class="two" style="border-left:0">最大风速：<a><span>{{winData.windspeed}}</span>米/秒</a></li>
    			<li v-if="!winData.pressure" class="two">中心气压：</li>
				<li v-else class="two">中心气压：<a><span>{{winData.pressure}}</span>百帕</a></li>
    			<li v-if="!winData.rr07" class="two" style="border-left:0">七级风圈：</li>
				<li v-else class="two" style="border-left:0">七级风圈：<span>{{winData.rr07}}</span><a>千米</a></li>
    			<li v-if="!winData.rr08" class="two">八级风圈：</li>
				<li v-else class="two">八级风圈：<span>{{winData.rr08}}</span><a>千米</a></li>
    			<li v-if="!winData.rr010" class="two" style="border-left:0">十级风圈：</li>
				<li v-else class="two" style="border-left:0">十级风圈：<span>{{winData.rr010}}</span><a>千米</a></li>
    			<li v-if="!winData.rr012" class="two">十二风圈：</li>
				<li v-else class="two">十二风圈：<span>{{winData.rr012}}</span><a>千米</a></li>
    		</ul>
    	</div>
    </div>
</template>

<script>

    import config from '../../config'
    import lmap from '../../util/lmap/lmap'
	import { updateParam } from '../../vuex/store'

    export default {
        data() {
		    return {
		    	map: config.getParam('map'),
		    	WMS: null, // 台风预报路径图层
		        inilid: '',
		        list: [],
		        path: [], // 实况路径
		        fst: [], // 预报路径
		        typhoonName: '',
		        tsIdTime: {}, // 记录当前选中台风的ID和最新时间，用于请求预报路径
		        pathLayer: {}, // 实况路径图层记录
		        pix: [0, 0], // 详细窗口位置
		        circle: {}, // 风圈feature记录
		        eCitys: [], // 影响城市列表
		        circleLevel: '风圈选择',
		        showLevels: '06,07,08,09,10,12',
		        disCitys: [], // 城市测距列表
		        flag: false, // 是否隐藏历史台风
		        tfTime: false, // 是否展示台风路径的时间
		        tcity: false,
		        winStat: false, // 详细窗口状态
		        winData: {
		            tsid: '',
		            tsName: '',
		            time: '',
		            lon: '',
		            lat: '',
		            windspeed: '', // 最大风速
		            pressure: '', // 气压
		            rr07: '',
		            rr08: '',
		            rr010: '',
		            rr012: ''
		        },
		        typhoon: {
			        top: {
			            url: this.dss_sj+'/tc/tc!top.action?dateTime=_dateTime&limit=500'
			        },
			        obs: {
			            url: this.dss_sj+'/tc/tc!obs.action?BBOX=_BBOX&tsId=_tsId&dateTime=_dateTime&is_distance=0&width=_width&height=_height'
			        },
			        fimg: {
			            url: this.dss_sj+'/gd_image/image!loadPythoonWMS.action',
			            name: 'tf',
			            opacity: '1',
			            extent: [100, 0, 180, 50],
			            params: {
			                bjDateTime: '2016-05-27 17:00:00',
			                tsId: '449'
			            }
			        }
			    }
		    }
		},
		vuex: {
		    getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
		        dateTime: state => state.typhoon.dateTime,
		        winStatus: state => state.typhoon.winStatus,
		        tyInfo: state => state.typhoon.info,
		        code: state => state.cityCode,
		        loadArr: state => state.time.loadArr,
		        isPlaying: state => state.time.isPlaying
		    },
		    actions: {
		        updateParam
		    }
		},
		computed: {
		    // 改变台风信息窗口位置
		    getPathPosition: function() {
		        let obj = {};
		        let pix = this.pix;
		        obj['left'] = pix[0] + 10 + 'px';
		        obj['top'] = pix[1] + 10 + 'px';
		        return obj;
		    },
		    // 过滤的城市列表
		    filterCitys: function() {
		        let list = this.eCitys;
		        let levels = this.showLevels;
		        let arr = [];
		        list.forEach((it) => {
		            if (levels.indexOf(it.rr) != -1) {
		                arr.push(it);
		            }
		        })
		        return arr;
		    }
		},
		watch: {
		    dateTime: function() { // 时间变化，更新台风
		        this.getActiveTyphoon('run');
		    }
		},
		methods: {
		    // 台风定位
		    setPosition: function(tsid) {
		        let pathLayers = config.getParam('pathLayers');
		        let layer = pathLayers[tsid];
		        if (!!layer == false) {
		            return;
		        }
		        let arr = lmap.draw.getFeatures(layer);
		        if (arr.length > 0) {
		            let len = arr.length;
		            let index = parseInt(len / 2);
		            let wkt = lmap.draw.getWkt(arr[index]);
		            if (wkt.indexOf('POINT') == -1) {
		                wkt = lmap.draw.getWkt(arr[index + 1]);
		            }
		            let lonlat = wkt.replace('POINT(', '').replace(')', '').split(' ');
		            lmap.controler.setCenter(this.map, lonlat[0], lonlat[1], 6);
		        }
		    },
		    close: function() {
		        // this.winStatus = false
		        this.updateParam('typhoon', 'winStatus', false);
		    },
		    changeTable: function() {
		        if (this.flag) {
		            this.flag = false;
		        } else {
		            this.flag = true;
		        }
		    },
		    showMorePath: function() {
		        if (this.tfTime) {
		            this.tfTime = false;
		        } else {
		            this.tfTime = true;
		        }
		    },
		    showtfcity: function() {
		        if (this.tcity) {
		            this.tcity = false;
		        } else {
		            this.tcity = true;
		        }
		    },
		    /**
		     * 获取实况预报 
		     * @param tsId 台风ID
		     * @param tsName 台风名称
		     * @param obj 标签对象
		     * @param inilid 台风国际ID
		     * @param type 类型用于区分渲染台风是否需要动态效果,为null/undefined时,使用动态效果
		     */
		    getObs: function(tsId, tsName, obj, inilid, type) {
		        let flg = false;
		        let temp = [];
		        let typhoon_time = null;
		        // 台风动画延迟50ms
		        if (!!type == false) typhoon_time = 50;
		        let _ele = this;
		        let checked;
		        if (!!obj) {
		            checked = obj.srcElement.checked;
		        } else {
		            checked = true;
		        }
		        let mapSize = this.map.getSize();
		        let extent = lmap.getExtent(this.map);
		        if (checked) {
		            flg = true;
		        } else {
		            flg = false;
		        }
		        for (let k in this.list) {
		            if (this.list[k].tsid === tsId) {
		                this.list[k].status = flg;
		            }
		            temp.push(this.list[k]);
		        }
		        this.list = temp;
		        if (checked) { // 表示选中
		            _ele.typhoonName = tsName;
		            this.inilid = inilid;
		            let url = this.typhoon.obs.url;
		            let _CRS = lmap.SYSTEM_PROJECTION;
		            url = url.replace('_BBOX', extent[0] + ',' + extent[1] + ',' + extent[2] + ',' + extent[3]).replace('_tsId', tsId).replace('_dateTime', this.dateTime).replace('_width', mapSize[0]).replace('_height', mapSize[1]).replace('_CRS', _CRS);
		            $.getJSON(url, null, (bdatas) => {
		                _ele.path = bdatas.obs;
		                this.tcTipWin(bdatas.obs[0]); // 加载标签小窗口数据内容
		                this.fst = bdatas.fst;
		                let pathLayers = config.getParam('pathLayers');
		                if (!!pathLayers == false) pathLayers = {};
		                let layer = lmap.typhoon.run(this.map, bdatas.obs, tsName, tsId, this.finishCallBack, typhoon_time);
		                if (!!type) { // 切换时间时候的重画，不需要动态效果
		                    let tmepLayer = pathLayers[tsId];
		                    if (!!tmepLayer) {
		                        setTimeout(() => {
		                            // 删除风圈，避免原风圈与新图层不相同报错
		                            // this.delCircleWithCallBack(tmepLayer,tsId);
		                            this.map.removeLayer(tmepLayer);
		                        }, 10)
		                    }
		                }
		                pathLayers[tsId] = layer;
		                config.addParam('pathLayers', pathLayers);
		            });
		        } else {
		            // 取消选择的时候，将对应的路径信息菜单清空
		            if (inilid == this.inilid) {
		                this.path = [];
		                this.fst = [];
		                this.typhoonName = '';
		                this.inilid = '';
		                this.eCitys = [];
		                this.disCitys = [];
		                this.circleLevel = '风圈选择';
		            }
		            delete this.circle[tsId];
		            // 格式化小标签内容
		            this.tcTipWin(null, tsId);
		            this.removeTsId(tsId);
		            let pathLayers = config.getParam('pathLayers');
		            // let fimgLayers = config.getParam('fimgLayers');
		            this.map.removeLayer(pathLayers[tsId]);
		            // map.removeLayer(fimgLayers[tsId]);
		            delete pathLayers[tsId];
		            // delete fimgLayers[tsId];
		            config.setParam('pathLayers', pathLayers);
		            this.eCitys = [];
		            this.disCitys = [];
		            // config.setParam('fimgLayers',fimgLayers);
		        }
		    },
		    /**
		     * 完成一条台风后的回调 
		     * @param tcPoint 实况路径的最新一个点数据信息
		     * @param type 渲染实况路径的类型，null或undefined表示为动态渲染,'run'为一次性全部渲染
		     */
		    finishCallBack: function(tcPoint, type) {
		        this.drawTcCircle(tcPoint, type);
		        if (!!tcPoint) {
		            this.tsIdTime[tcPoint.tsid] = tcPoint.bjdatetime;
		        }
		        this.refreshLayer();
		        this.getECitys(tcPoint.id); // 影响城市列表
		        this.getEDistance(tcPoint.id); // 城市测距
		    },
		    // 切换时间重画台风的，在删除原图层的同时清除风圈
		    delCircleWithCallBack: function(pathLayers, tsId) {
		        let layer = pathLayers[tsId];
		        if (!!layer) {
		            let source = layer.getSource();
		            if (!!this.circle[tsId]) { // 存在风圈，先删除
		                let tempCircles = this.circle[tsId];
		                if (!!tempCircles) {
		                    tempCircles.forEach((it) => {
		                        source.removeFeature(it);
		                    })
		                }
		            }
		            this.circle[tsId] = [];
		        }
		    },
		    // 初始化预报路径图层
		    initFstLayer: function() {
		        if (!!this.WMS == false) {
		            this.WMS = lmap.image.loadImageWMS(this.map, this.typhoon.fimg, 'impact');
		            this.WMS.getSource().on('imageloadend', this.loadEndEvt);
		        }
		    },
		    // 刷新图层
		    refreshLayer: function() {
		        this.initFstLayer();
		        let tsIdTime = this.tsIdTime;
		        let tsids = '',
		            times = '';
		        for (let key in tsIdTime) {
		            tsids += key + ',';
		            times += tsIdTime[key] + ',';
		        }
		        this.typhoon.fimg.params.tsId = tsids;
		        this.typhoon.fimg.params.bjDateTime = times;
		        lmap.image.updateImageWMS(this.WMS, this.typhoon.fimg.params);
		    },
		    // 预报图层加载完成后回调
		    loadEndEvt: function() {
		        if (this.isPlaying) {
		            let arr = this.loadArr;
		            arr = arr.replace('typhoon,', '');
		            arr += 'typhoon,';
		            this.updateParam('time', 'loadArr', arr);
		        }
		    },
		    // 移除ID记录
		    removeTsId: function(tsid) {
		        let tsIdTime = this.tsIdTime;
		        let newOne = {};
		        for (let key in tsIdTime) {
		            if (key != tsid) {
		                newOne[key] = tsIdTime[key];
		            }
		        }
		        this.tsIdTime = newOne;
		        this.refreshLayer();
		    },
		    // 鼠标移动事件
		    moveEvt: function(evt) {
		        // let lonlat = lmap.controler.getEvtLonLat(evt);
		        if (this.winStat) this.winStat = false;
		        this.pix = evt.pixel;

		        let feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
		            return feature;
		        });
		        if (!!feature) {
		            if (!!feature.type) {
		                let type = feature.type;
		                if (type == 'tcPoint') { // 台风实况点
		                    this.initWinData(feature.obs);
		                    if (this.winStat == false) this.winStat = true;
		                } else if (type == 'tcCircle') {
		                    this.getFstCircleAndData(evt);
		                }
		            }
		        } else {
		            this.getFstCircleAndData(evt);
		        }
		    },
		    /**
		     * 预报路径部分功能实现 
		     * @param evt地图移动对象
		     */
		    getFstCircleAndData: function(evt) {
		        let lonlat = lmap.controler.getEvtLonLat(evt);
		        let fst = this.fst;
		        let dist = 99;
		        let point = null;
		        let plon = lonlat[0];
		        let plat = lonlat[1];
		        fst.forEach((it) => {
		            // if(!!it.id){
		            let lon = it.lon;
		            let lat = it.lat;
		            let len = Math.sqrt(Math.pow(lon - plon, 2) + Math.pow(lat - plat, 2));
		            if (len < dist) {
		                dist = len;
		                point = it;
		            }
		            // }
		        })
		        if (dist <= 0.055) {
		            this.initWinData(point);
		            if (this.winStat == false) this.winStat = true;
		            this.updateCircle(point, point.id, 'fst');
		            this.autoScroolPathList(point.id);
		        }
		    },
		    // 设置台风详情窗口信息
		    initWinData: function(tcPoint) {
		        let winData = {
		            tsid: tcPoint.tsid,
		            tsName: this.getTsNameById(tcPoint.tsid),
		            time: tcPoint.bjdatetime,
		            lon: tcPoint.lon,
		            lat: tcPoint.lat,
		            windspeed: tcPoint.windspeed, // 最大风速
		            pressure: tcPoint.pressure, // 气压
		            rr07: tcPoint.rr07,
		            rr08: tcPoint.rr08,
		            rr010: tcPoint.rr010,
		            rr012: tcPoint.rr012
		        }
		        this.winData = winData;
		    },
		    // 通过id获取台风名称
		    getTsNameById: function(tsid) {
		        let list = this.list;
		        for (let key in list) {
		            if (list[key].tsid == tsid) {
		                return list[key].tscname;
		            }
		        }
		        return '';
		    },
		    // 通过id获取台风名称
		    getTsENameById: function(tsid) {
		        let list = this.list;
		        for (let key in list) {
		            if (list[key].tsid == tsid) {
		                return list[key].tsename;
		            }
		        }
		        return '';
		    },
		    // 画风圈
		    drawTcCircle: function(tcPoint, type) {
		        let circles = lmap.typhoon.createCircle(tcPoint);
		        let pathLayers = config.getParam('pathLayers');
		        let tsId = tcPoint.tsid;
		        let layer = pathLayers[tsId];
		        if (!!layer) {
		            let source = layer.getSource();
		            if (!!type == false) { // 如果是切换时间一次性渲染时，不清除该部分风圈（其他部分已处理，会导致报错）
		                if (!!this.circle[tsId]) { // 存在风圈，先删除
		                    let tempCircles = this.circle[tsId];
		                    if (!!tempCircles) {
		                        tempCircles.forEach((it) => {
		                            source.removeFeature(it);
		                        })
		                    }
		                }
		            }

		            this.circle[tsId] = circles;
		            source.addFeatures(circles);
		        }
		    },
		    // 点击事件
		    tcSingalClick: function(evt) {
		        let feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
		            return feature;
		        });
		        if (!!feature) {
		            if (!!feature.type) {
		                let type = feature.type;
		                if (type == 'tcPoint') { // 台风实况点
		                    this.updateCircle(feature.obs, feature.obs.id, 'obs');
		                    this.autoScroolPathList(feature.obs.id);
		                    // this.drawTcCircle(feature.obs);
		                    // this.getECitys(feature.obs.id); // 影响城市
		                    // this.getEDistance(feature.obs.id); // 城市测距
		                }
		            }
		        }
		    },
		    // 自动滚动台风路径列表
		    autoScroolPathList: function(id) {
		        let _trList = $(this.$els.pathList);
		        let tempTr = null;
		        if (!!_trList) {
		            $(_trList).find('tr').each(function() {
		                if ($(this).attr('point') == id) {
		                    tempTr = this;
		                    $(this).css({
		                        'background-color': '#6CAFE9'
		                    })
		                } else {
		                    let courceColor = $(this).css('background-color');
		                    if (courceColor == 'rgb(108, 175, 233)') {
		                        let type = $(this).attr('type');
		                        let color = '#fff';
		                        if (type == 'fst')
		                            color = '#F5E7E6';
		                        $(this).css({
		                            'background-color': color
		                        });
		                    }
		                }
		            });
		        }

		        if (!!tempTr) { // 
		            let parentEl = this.$els.path;
		            $(parentEl).animate({
		                scrollTop: $(tempTr).offset().top - $(parentEl).offset().top + $(parentEl).scrollTop()
		            }, 100);
		        }
		    },
		    /**
		     * 更新台风风圈位置以及影响城市列表及测距列表 
		     * @point 点数据对象
		     * @id 台风实况或预报点id
		     * @type 实况或预报(obs/fst)
		     */
		    updateCircle: function(point, id, type) {
		        this.drawTcCircle(point);
		        if (!!id) {
		            this.getECitys(id, type); // 影响城市
		            this.getEDistance(id, type); // 城市测距
		        }
		    },
		    // 台风小标签信息
		    tcTipWin: function(tcPoint, tsId) {
		        let info = {};
		        if (!!tcPoint) {
		            let reg = /([0-9]+\.[0-9]{2})[0-9]*/;
		            info = {
		                type: this.getCircleName(tcPoint.trank),
		                code: tcPoint.trank,
		                name: this.getTsNameById(tcPoint.tsid),
		                ename: this.getTsENameById(tcPoint.tsid),
		                dateTime: tcPoint.bjdatetime,
		                lonlat: '<span>' + tcPoint.lon.replace(reg, "$1") + '<sup>°</sup>E, ' + tcPoint.lat.replace(reg, "$1") + '<sup>°</sup>N</span>',
		                windPressure: tcPoint.windspeed + '米/秒 ' + tcPoint.pressure + '百帕',
		                radius: '',
		                tsid: tcPoint.tsid
		            }
		        } else { // 如果不存在，清空
		            if (this.tyInfo.tsid == tsId) {
		                info = {
		                    type: '',
		                    code: '',
		                    name: '',
		                    ename: '',
		                    dateTime: '',
		                    lonlat: '',
		                    windPressure: '',
		                    radius: '',
		                    tsid: ''
		                }
		            }
		        }
		        this.updateParam('typhoon', 'info', info);
		    },

		    // 获取风圈类型名称
		    getCircleName: function(rate) {
		        let level = {
		            'TD': '热带低压',
		            'TS': '热带风暴',
		            'STS': '强热带风暴',
		            'TY': '台风',
		            'STY': '强台风'
		        }
		        let levelStr = level[rate];
		        if (!levelStr) levelStr = '超强台风';
		        return levelStr;
		    },
		    // 获取风圈影响城市列表
		    getECitys: function(id, type) {
		        let url = this.dss+'/tc/tc!city.action';
		        let qd = {
		            'id': id,
		            'rr': '',
		            'tyObject': type
		        };
		        this.eCitys = [];
		        $.getJSON(url, qd, (bd) => {
		            let type = 'city';
		            if (this.code.length == 4) type = 'county';
		            else if (this.code.length == 6) type = 'town';
		            this.eCitys = bd[type];
		        })
		    },
		    // 获取风圈等级名称
		    getCircleLev: function(lev) {
		        let obj = {
		            '06': '6级风圈',
		            '07': '7级风圈',
		            '08': '8级风圈',
		            '10': '10级风圈',
		            '12': '12级风圈'
		        };
		        return obj[lev];
		    },
		    // 获取影响城市列表风圈颜色
		    getECityColor: function(lev) {
		        let obj = {
		            '06': '#49DF2E',
		            '07': '#fff',
		            '08': '#FFFF99',
		            '10': '#FF9999',
		            '12': '#fff'
		        }
		        let color = {
		            'background-color': obj[lev]
		        };
		        return color;
		    },
		    // 获取城市测距数据
		    getEDistance: function(id, type) {
		        let url = this.dss+'/tc/tc!cityDistance.action';
		        let qd = {
		            'id': id,
		            'tyObject': type
		        };
		        this.disCitys = [];
		        $.getJSON(url, qd, (it) => {
		            this.disCitys = it;
		        })
		    },
		    // 影响区域风圈等级过滤筛选
		    filterLevel: function(lev) {
		        if (lev == 'all') {
		            this.showLevels = '06,07,08,10,12';
		            this.circleLevel = '风圈选择';
		        } else {
		            let name = this.getCircleLev(lev);
		            this.circleLevel = name;
		            this.showLevels = lev + ',';
		        }
		    },
		    // 获取台风列表及生效台风
		    getActiveTyphoon: function(type) {
		        let url = this.typhoon.top.url;
		        url = url.replace('_dateTime', this.dateTime);
		        $.getJSON(url, null, (bdatas) => {
		            this.list = bdatas;
		            let activeArr = [];
		            for (let key in bdatas) {
		                if (bdatas[key].status) {
		                    let tsId = bdatas[key].tsid;
		                    if (tsId.indexOf('*') == -1) {
		                        this.getObs(bdatas[key].tsid, bdatas[key].tscname, null, bdatas[key].inilid, type);
		                    }
		                    activeArr.push(tsId);
		                }
		            }
		            // 清除因切换时间取消已选择的（示生效)的台风
		            this.clearUnActiveTY(activeArr);
		        });
		        this.map.on('pointermove', this.moveEvt);
		        this.map.on('singleclick', this.tcSingalClick);
		    },
		    /**
		     * when update time,clear the unActive layer 
		     * @param {array}tsIdArr
		     */
		    clearUnActiveTY: function(tsIdArr) {
		        let pathLayers = config.getParam('pathLayers');
		        for (let pkey in pathLayers) {
		            if (tsIdArr.indexOf(pkey) == -1) {
		                this.map.removeLayer(pathLayers[pkey]);
		                delete pathLayers[pkey];
		                delete this.tsIdTime[pkey]
		            }
		        }
		    }
		},
		ready: function() {
		    this.getActiveTyphoon();
		    config.addParam('typhoonStatus', true);
		},
		detached: function() { // 销毁时调用
		    config.setParam('typhoonStatus', false);
		    let pathLayers = config.getParam('pathLayers');
		    for (let pkey in pathLayers) {
		        this.map.removeLayer(pathLayers[pkey]);
		        delete pathLayers[pkey];
		    }
		    config.setParam('pathLayers', pathLayers);
		    this.map.removeLayer(this.WMS);
		    this.tsIdTime = {}; // 记录当前选中台风的ID和最新时间，用于请求预报路径
		    this.WMS = null;
		    this.map.un('pointermove', this.moveEvt);
		    this.map.un('singleclick', this.tcSingalClick);
		}
    }
</script>

<style scoped lang="less">
@import "../../assets/css/common.less";

.typhoon, .typhoonInfo {
	width: 310px;
	position: absolute;
	right: 0px;
	top: 0px;
	z-index: 4;
	background-color: #fff;
	-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	-moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
div.typhoonInfo {
	width: 280px;

	.InfoPanle {
		height: auto;
		margin: 3px;
		overflow: hidden;
		padding: 0 2px;
		max-height: 400px;
		overflow-y: auto;

		li {
			width: 100%;
			height: 26px;
			line-height: 26px;
			padding-left: 3px;
			float: left;
			text-align: left;
			border-bottom: 1px solid #f2f2f2;

			label {
				margin-right: 25px;
			}
		}
		li.two {
			width: 48%;
			border-left: 1px solid #f2f2f2;
		}
	}
}
.location {
	cursor: pointer;
	color: #1E7AC9;
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
	z-index: 2;
}
.list-table {
	height: auto;

	.list-title, .inCity-title {
		background: @bg;
		position: relative;
	}
	table {
		width: 100%;
		position: relative;

		td {
			border: 0;
			position: relative;
			height: 26px;
			line-height: 26px;
			text-align: center;
			border-bottom: 1px solid #E5E8EC;
			border-right: 1px solid #E5E8EC;

			input {
				width: 16px;
				height: 16px;
				cursor: pointer;
			}
		}
	}
}
.no-effect {
	background-color: #fff;
	display: inline-block;
	width: 100%;
	min-height: 50px;
}
.inCity-title {
	td {
		position: relative;
		z-index: 2;

		ul {
			background: @bg;
			height: auto;
			overflow: hidden;
			left: 0;
			position: absolute;
			top: 22px;
			width: 100%;
			z-index: 2;
			text-align: center;
			display: none;
		}
	}
	td:hover ul {
		display: block;
	}
	td.tc-select:after {
		content: "";
		display: inline-block;
		width: 0px;
		height: 0;
		border-left: 5px solid transparent;
		border-right: 5px solid transparent;
		border-top: 5px solid #aaa;
		transform: rotate(-45deg);
		-ms-transform: rotate(-45deg); 	/* IE 9 */
		-moz-transform: rotate(-45deg); 	/* Firefox */
		-webkit-transform: rotate(-45deg); /* Safari 和 Chrome */
		-o-transform: rotate(-45deg);
	}
}
.show, .hide {
	width: 16px;
	height: 16px;
	position: absolute;
	vertical-align: middle;
	line-height: 6px;
	text-align: center;
	cursor: pointer;
	top: 5px;
	right: 18px;
}
.show:before, .hide:before {
	content: "»";
	display: inline-block;
	font-size: 20px;
	color: @color;
	letter-spacing: 2px;
	position: absolute;
	top: 0px;
	left: -1px;
	text-align: center;
	transform: rotate(-90deg);
	-ms-transform: rotate(-90deg); 	/* IE 9 */
	-moz-transform: rotate(-90deg); 	/* Firefox */
	-webkit-transform: rotate(-90deg); /* Safari 和 Chrome */
	-o-transform: rotate(-90deg);
}
.show:before {
	top: 5px;
}
.hide:before {
	top: 6px;
}
.hide:before, .hide:after {
	left: 4px;
	transform: rotate(90deg);
	-ms-transform: rotate(90deg); 	/* IE 9 */
	-moz-transform: rotate(90deg); 	/* Firefox */
	-webkit-transform: rotate(90deg); /* Safari 和 Chrome */
	-o-transform: rotate(90deg);
}
.list-title tr td:first-child, .list-content tr td:first-child {
	width: 30px
}
.list-title tr td:nth-child(2), .list-content tr td:nth-child(2) {
	width: 68px
}
.list-title tr td:nth-child(3), .list-content tr td:nth-child(3) {
	width: 70px
}
.list-title tr td:nth-child(4), .list-content tr td:nth-child(4) {
	width: 68px
}
.list-title tr td:nth-child(5), .list-content tr td:nth-child(5) {
	text-align: left;
	padding-left: 6px;
}
.inCity-title tr td:first-child, .inCity-content tr td:first-child {
	width: 30px;
}
.inCity-title tr td:nth-child(2), .inCity-content tr td:nth-child(2) {
	width: 89px
}
.inCity-title tr td:nth-child(3), .inCity-content tr td:nth-child(3) {
	width: 70px
}
.inCity-title tr td:nth-child(4), .inCity-content tr td:nth-child(4) {
	text-align: left;
	padding-left: 33px;

	ul {
		padding-left: 40px;
		text-align: left;
	}
}
.list-content {
	max-height: 83px;    /*min-height:83px;*/
	height: auto;
	overflow-y: scroll;
	border-bottom: 1px solid #E5E8EC;
}
.inCity-content-show {
	max-height: 162px;
	height: auto;
	overflow-y: scroll;
	border-bottom: 1px solid #E5E8EC;
}
.inCity-contentTf {
	max-height: 83px;
	height: auto;
	overflow-y: scroll;
	border-bottom: 1px solid #E5E8EC;
}
.list-path {
	padding-top: 10px;
}
.list-path-tl {
	line-height: 24px;
	padding: 0px 5px;
	position: relative;

	a {
		font-weight: bold;
	}
	span {
		color: @color;
	}
	label {
		color: #F6B4B2;
	}
	.loada {
		position: absolute;
		top: 5px;
		right: 36px;
		cursor: pointer;
		z-index: 3;
		width: 16px;
		height: 16px;
		background: url('../../assets/img/common/load.png') no-repeat center;
	}
	.loada:hover {
		color: @color;
	}
}
.list-path-title {
	background: @bg;
}
.list-path-title tr td:first-child, .list-path-content tr td:first-child, .list-path-contentTime tr td:first-child {
	width: 120px
}
.list-path-title tr td:nth-child(2), .list-path-content tr td:nth-child(2), .list-path-contentTime tr td:nth-child(2) {
	width: 70px
}
.list-path-content tr:hover {
	background: #b1d9fc;
	cursor: pointer;
}
.list-path-content {
	max-height: 83px;
	overflow-y: scroll;
	border-bottom: 1px solid #E5E8EC;
}
.list-path-contentTime {
	max-height: 300px;
	overflow-y: scroll;
	border-bottom: 1px solid #E5E8EC;
}
.title {
	border-bottom: 1px solid #E5E8EC;
}
.city-distance {
	height: auto;
	max-height: 83px;
	min-height: 50px;
	overflow-y: scroll;

	ul li {
		float: left;
		height: 26px;
		line-height: 26px;
		width: 46%;
		margin-left: 2%;
		margin-right: 2%;
		border-bottom: 1px solid #E5E8EC;
	}
}

/*big*/
.big  .typhoon {
	width: 428px;

	.list-table table td {
		height: 32px;
		line-height: 32px;
	}
	.list-title tr td:first-child, .list-content tr td:first-child {
		width: 50px
	}
	.list-title tr td:nth-child(2), .list-content tr td:nth-child(2) {
		width: 98px
	}
	.list-title tr td:nth-child(3), .list-content tr td:nth-child(3) {
		width: 90px
	}
	.list-title tr td:nth-child(4), .list-content tr td:nth-child(4) {
		width: 103px
	}
	.list-content, .inCity-content {
		max-height: 98px;		/*height:98px;*/
		height: auto;
	}
	.list-path-title tr td:first-child, .list-path-content tr td:first-child, .list-path-contentTime tr td:first-child {
		width: 206px
	}
	.list-path-title tr td:nth-child(2), .list-path-content tr td:nth-child(2), .list-path-contentTime tr td:nth-child(2) {
		width: 90px
	}
	.list-path-content {
		height: 98px;
		max-height: 98px;
	}
	.inCity-title tr td:first-child, .inCity-content tr td:first-child {
		width: 50px;
	}
	.inCity-title tr td:nth-child(2), .inCity-content tr td:nth-child(2) {
		width: 120px
	}
	.inCity-title tr td:nth-child(3), .inCity-content tr td:nth-child(3) {
		width: 100px
	}
	.inCity-title tr td:nth-child(4), .inCity-content tr td:nth-child(4) {
		text-align: left;
		padding-left: 32px;

		ul {
			padding-left: 38px;
			text-align: left;
		}
	}
}
.big div.typhoonInfo {
	width: 410px;

	.InfoPanle {
		li {
			height: 34px;
			line-height: 34px;

			label {
				margin-right: 40px;
			}
		}
	}
}
.big .city-distance {
	max-height: 98px;

	ul li {
		height: 32px;
		line-height: 32px;
	}
}
.big .list-path-tl {
	line-height: 34px;

	.loada {
		top: 8px;
		right: 36px;
	}
}
.big .show, .big .hide {
	top: 8px;
}
.big .show:before, .big .hide:before {
	font-size: 22px;
}
</style>