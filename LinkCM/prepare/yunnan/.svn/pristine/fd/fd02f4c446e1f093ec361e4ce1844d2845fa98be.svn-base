<template>
	<div class="panel modelPop">
		<!-- <a class="Close" @click="close()"></a> -->
		<ul class="model-ui">
			<li v-for="item in modelItems" :class="{'select-model':item.isSelect}" @click="selectModel($key, item)"><a>{{item.text}}</a><em class="emfocus"></em></li>
		</ul>
		<div class="int-sim-panel" v-if="model==='int-sim'">
			<ul>
				<li>
					<label>&nbsp;&nbsp;&nbsp;污染点：</label>
					<div class="div-place add-point" @click="selectPoint()">{{pointText}}</div>
					<a href="javascript:void(0)" @click="newIntSim()" v-if="isSubmit">新建模拟</a>
				</li>
				<li>
					<label>&nbsp;&nbsp;&nbsp;污染源：</label>
					<div class=" div-margin">
						<!--<select v-model="factoryVal"><option selected="selected">选择工厂类型</option><option v-for="item in factoryItems" :value="$key">{{item}}</option></select>-->
						<v-select :defname="'factoryVal'" :def="factoryVal" :initvalue="'选择工厂类型'" :list="factoryItems"></v-select>
					</div>
					<div class=" div-width-1">
						<!--<select v-model="pollcodeVal"><option selected="selected">选择污染物</option><option v-for="item in pollItems" :value="item.value">{{item.text}}</option></select>-->
						<v-select :defname="'pollcodeVal'" :def="pollcodeVal" :initvalue="'选择污染物'" :list="pollItems"></v-select>
					</div>
				</li>
				<li class="li-double">
					<label>爆炸时间：</label>
					<div class="div-width-2 div-color">
						<input type="text" v-model="timeVal" :value="timeVal" id="poll-time" @click="selectTimeVal()" readonly="true" />
					</div>
				</li>
				<li class="li-double">
					<label>污染源高度：</label>
					<div class="div-width-2 div-color">
						<input class="input-width" type="number" v-model="heightVal" :value="heightVal" min="1" max="30" />
						<span>m</span>
					</div>
				</li>
				<li class="li-double">
					<label>泄漏时长：</label>
					<div class="div-width-2 div-color">
						<input class="input-width" type="number" v-model="keepTimeVal" :value="keepTimeVal" min="1" max="48" />
						<span>h</span>
					</div>
				</li>
				<li class="li-double">
					<label>泄&nbsp;漏&nbsp;速&nbsp;率：</label>
					<div class="div-width-2 div-color">
						<input class="input-width" type="number" v-model="rateVal" :value="rateVal" min="1" max="48" />
						<span>{{{rateUnit}}}</span>
					</div>

				</li>
			</ul>
		</div>
		<div class="public-panel">
			<div class="int-line" v-if="model!=='sim'">
				<ul>
					<li v-for="item in recordItems" :class="{'li-line-start':item.isSuccess}"><em></em>
						<a @click="submit(model)" :class="{ 'yet': isSubmit, 'submit': ($index === 0 && model !== 'int') }">{{item.text}}</a>
					</li>
				</ul>
			</div>
			<div class="param-panel" v-if="model!=='int-sim'">
				<div class=" poll-select">
					<span>浓度:</span>
					<!--<select class="strength" v-model="strengthVal"><option v-for="item in strengthItems" :value="item.value">{{item.text}}</option></select>-->
					<v-select :defname="'strengthVal'" :def="strengthVal" :initvalue="strengthItems[0].text" :list="strengthItems"></v-select>
				</div>
				<div class=" nd-select">
					<span>浓度均值:</span>
					<!--<select class="mean" v-model="meanVal"><option v-for="item in meanItems" :value="item.value">{{item.text}}</option></select>-->
					<v-select :defname="'meanVal'" :def="meanVal" :initvalue="meanItems[0].text" :list="meanItems"></v-select>
				</div>
				<span class="spanbtn goback btnhover" v-if="model==='sim'" @click="goback()">返回</span>
				<span class="spanbtn btnhover" v-if="model==='int'" @click="getIntItems(true)">全部记录</span>
				<span class="btnhover" @click="isPlaying = !isPlaying" :class="{'playing': isPlaying, 'reset': !isPlaying}">{{playText}}</span>
			</div>
		</div>
		<div class="Pollute-table sim-list" v-if="model==='sim'">
			<table v-if="simItems[0] !== undefined" cellpadding="0" cellspacing="0">
				<thead>
					<tr> <th>选择</th> <th>污染源</th> <th>预报时间</th> </tr>
				</thead>
				<tbody>
					<tr @click="selectSim(item)" v-for="item in simItems" :class="{'select-line':item.isSelect}">
						<td> <input type="radio" name="simLine" v-model="selectSimLine" :value="item.id"></input> </td> <td>{{item.pollName}}</td> <td>{{item.boomTime}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="Pollute-table int-list" v-if="model==='int'">
			<table v-if="intItems[0] !== undefined" cellpadding="0" cellspacing="0">
				<thead>
					<tr> <th>选择</th> <th>污染源</th> <th>爆炸时间</th> <th>高度</th> <th>泄漏<br>速率</th> <th>泄漏<br>时长</th> </tr>
				</thead>
				<tbody>
					<tr @click="selectInt(item)" v-for="item in intItems" :class="{'select-line':item.isSelect}">
						<td> <input type="radio" name="intLine" v-model="selectIntLine" :value="item.id"></input> </td> <td>{{item.pollName}}</td> <td>{{item.boomTime}}</td> <td>{{item.height}}</td> <td>{{item.rate}}</td> <td>{{item.sustainTime}}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- <div v-if="loading" class="loading">loading</div> -->
		<div v-if="nodata" class="nodata">暂无数据</div>
	</div>
</template>

<script>
	import lmap from '../../../util/lmap/lmap'
	import config from '../../../config'
	import TimeUtil from '../../../util/tools/TimeUtil'
	import { updateParam } from '../../../vuex/store'
	import Select from '../../common/Select'

	import '../../../util/timepicker/timepicker'

	export default {
		components: { 'v-select': Select },
		data() {
		    return {
		        model: 'sim',
		        strengthVal: 'ks',
		        meanVal: 24,
		        heightVal: 10,
		        keepTimeVal: 12,
		        rateVal: 2,
		        isSubmit: false,
		        loading: false,
		        nodata: false,
		        factoryVal: '',
		        pollcodeVal: '',
		        selectSimLine: '',
		        selectIntLine: '',
		        rateUnit: 'kg/h',
		        pointText: '添加污染点',
		        timeVal: TimeUtil.format(TimeUtil.clearMMSS(new Date(), true), 'yyyy-MM-dd HH:mm'),
		        recordItems: [
		        	{ 'text': '确认提交', 'isSuccess': false }, 
		        	{ 'text': '提交成功', 'isSuccess': false }, 
		        	{ 'text': '模型运算', 'isSuccess': false }, 
		        	{ 'text': '结果反馈', 'isSuccess': false }
		        ],
		        modelItems: {
		            'sim': { 'text': '定时模拟', 'isSelect': true },
		            'int-sim': { 'text': '交互模拟', 'isSelect': false },
		            'int': { 'text': '交互记录', 'isSelect': false }
		        },
		        strengthItems: [
		        	{ 'text': '扩散', 'value': 'ks', 'isSelect': true }, 
		        	{ 'text': '沉降', 'value': 'cj', 'isSelect': false }
		        ],
		        meanItems: [
		        	{ 'text': '24小时', 'value': '24', 'isSelect': true }, 
		        	{ 'text': '3小时', 'value': '3', 'isSelect': false }
		        ],
		        factoryItems: [
			        { value: 'sy', text: '石油厂' }, 
			        { value: 'hd', text: '核电厂' }, 
			        { value: 'gt', text: '钢铁厂' }, 
			        { value: 'tl', text: '涂料厂' }, 
			        { value: 'hg', text: '化工厂' }, 
			        { value: 'rq', text: '燃气厂' }, 
			        { value: 'mq', text: '煤气厂' }, 
			        { value: 'dz', text: '电子厂' }, 
			        { value: 'zy', text: '炸药厂' }, 
			        { value: 'tc', text: '陶瓷厂' }, 
			        { value: 'dd', text: '机械电镀厂' }, 
			        { value: 'sk', text: '石矿厂' }, 
			        { value: 'sj', text: '塑胶厂' }, 
			        { value: 'sn', text: '水泥厂' }, 
			        { value: 'od', text: '火电厂' }, 
			        { value: 'qt', text: '其他' }
			    ],
		        factoryPollItems: {
		            'sy': [
		            	{ 'text': '苯', 'value': 'C6H6' }, 
		            	{ 'text': '二氧化硫', 'value': 'XSO2' }, 
		            	{ 'text': '苯酚', 'value': 'C6HO' }, 
		            	{ 'text': '乙烯', 'value': 'C2H4' }
		            ],
		            'hd': [
		            	{ 'text': '铯137', 'value': 'C137' }, 
		            	{ 'text': '碘131', 'value': 'I131' }
		            ],
		            'gt': [
		            	{ 'text': '三氧化二铁', 'value': 'Fe2O' }, 
		            	{ 'text': '苯', 'value': 'C6H6' }, 
		            	{ 'text': '炭', 'value': 'XXXC' }
		            ],
		            'tl': [
		            	{ 'text': '苯', 'value': 'C6H6' }, 
		            	{ 'text': '苯酚', 'value': 'C6HO' }
		            ],
		            'hg': [
		            	{ 'text': '苯', 'value': 'C6H6' }, 
		            	{ 'text': '苯酚', 'value': 'C6HO' }
		            ],
		            'rq': [
		            	{ 'text': '一氧化碳', 'value': 'XXCO' }, 
		            	{ 'text': '甲烷', 'value': 'XCH4' }
		            ],
		            'mq': [
		            	{ 'text': '氢气', 'value': 'XXH2' }, 
		            	{ 'text': '一氧化碳', 'value': 'XXCO' }, 
		            	{ 'text': '甲烷', 'value': 'XCH4' }
		            ],
		            'dz': [
		            	{ 'text': '氧化铅', 'value': 'XPbO' }, 
		            	{ 'text': '镍', 'value': 'XXNi' }, 
		            	{ 'text': '苯', 'value': 'C6H6' }
		            ],
		            'zy': [
		            	{ 'text': '雷汞', 'value': 'HgON' }, 
		            	{ 'text': '苯酚', 'value': 'C6HO' }
		            ],
		            'tc': [
		            	{ 'text': '镍', 'value': 'XXNi' }, 
		            	{ 'text': '氧化铍', 'value': 'XBeO' }, 
		            	{ 'text': '氟化氢', 'value': 'XXHF' }
		            ],
		            'dd': [
		            	{ 'text': '氧化铅', 'value': 'XPbO' }, 
		            	{ 'text': '镍', 'value': 'XXNi' }, 
		            	{ 'text': '苯', 'value': 'C6H6' }
		            ],
		            'sk': [
		            	{ 'text': '二氧化硅', 'value': 'SiO2' }, 
		            	{ 'text': '重晶石', 'value': 'BaSO' }
		            ],
		            'sj': [
		            	{ 'text': '苯', 'value': 'C6H6' }, 
		            	{ 'text': '苯酚', 'value': 'C6HO' }
		            ],
		            'sn': [
		            	{ 'text': '三氧化二铝', 'value': 'Al2O' }, 
		            	{ 'text': '三氧化二铁', 'value': 'Fe2O' }, 
		            	{ 'text': '氧化钙', 'value': 'XCaO' }, 
		            	{ 'text': '二氧化硅', 'value': 'SiO2' }
		            ],
		            'od': [
		            	{ 'text': '二氧化硫', 'value': 'XSO2' }, 
		            	{ 'text': '炭', 'value': 'XXXC' }
		            ],
		            'qt': [
			            { 'value': 'XSO2', 'text': '二氧化硫' }, 
			            { 'value': 'C137', 'text': '铯137' }, 
			            { 'value': 'I131', 'text': '碘131' }, 
			            { 'value': 'XXXC', 'text': '炭' }, 
			            { 'value': 'C6H6', 'text': '苯' }, 
			            { 'value': 'XXCO', 'text': '一氧化碳' }, 
			            { 'value': 'XPbO', 'text': '氧化铅' }, 
			            { 'value': 'HgON', 'text': '雷汞' }, 
			            { 'value': 'C6HO', 'text': '苯酚' }, 
			            { 'value': 'XCH4', 'text': '甲烷' }, 
			            { 'value': 'C2H4', 'text': '乙烯' }, 
			            { 'value': 'XXNi', 'text': '镍' }, 
			            { 'value': 'XBeO', 'text': '氧化铍' }, 
			            { 'value': 'XXHF', 'text': '氟化氢' }, 
			            { 'value': 'SiO2', 'text': '二氧化硅' }, 
			            { 'value': 'Fe2O', 'text': '三氧化二铁' }, 
			            { 'value': 'BaSO', 'text': '重晶石' }, 
			            { 'value': 'XCaO', 'text': '氧化钙' }, 
			            { 'value': 'Al2O', 'text': '三氧化二铝' }, 
			            { 'value': 'XXH2', 'text': '氢气 '}
		         	]
		        },
		        factoryArr: [
					{ 'lon': '113.55', 'lat': '22.84', 'address': '广州南沙泰山石化发展有限公司' },
					{ 'lon': '113.57', 'lat': '22.65', 'address': '东方国际集装箱（广州）有限公司' }, 
					{ 'lon': '116.61', 'lat': '23.69', 'address': '潮州丹木涂料有限公司' }, 
					{ 'lon': '116.62', 'lat': '23.61', 'address': '潮安县浮洋镇豪全陶瓷制作厂' }, 
					{ 'lon': '113.96', 'lat': '22.91', 'address': '东莞市政欣化工科技有限公司' }, 
					{ 'lon': '114.14', 'lat': '22.79', 'address': '群光电子（东莞）有限公司' }, 
					{ 'lon': '113.59', 'lat': '22.90', 'address': '石东油库' }, 
					{ 'lon': '113.03', 'lat': '22.98', 'address': '广东能强陶瓷有限公司' }, 
					{ 'lon': '113.04', 'lat': '22.96', 'address': '佛山市粤祥陶瓷有限公司' }, 
					{ 'lon': '113.41', 'lat': '23.08', 'address': '广州中船黄埔造船有限公司' }, 
					{ 'lon': '113.33', 'lat': '22.90', 'address': '广州市番禺富邦粘胶有限公司' }, 
					{ 'lon': '113.30', 'lat': '23.37', 'address': '华南蓝天航空油料有限公司广东分公司' }, 
					{ 'lon': '114.71', 'lat': '23.74', 'address': '河源市友利德化工有限公司' }, 
					{ 'lon': '114.28', 'lat': '23.05', 'address': '惠州市庆广化工有限公司' }, 
					{ 'lon': '114.34', 'lat': '23.03', 'address': '惠州市金山电子有限公司' }, 
					{ 'lon': '114.61', 'lat': '22.75', 'address': '惠州市东达石化有限公司' }, 
					{ 'lon': '113.03', 'lat': '22.50', 'address': '江门市彩信化工有限公司' }, 
					{ 'lon': '113.13', 'lat': '22.60', 'address': '江门市广悦电化有限公司' }, 
					{ 'lon': '112.98', 'lat': '21.92', 'address': '台山核电' }, 
					{ 'lon': '116.43', 'lat': '23.56', 'address': '揭阳市泰鸿化工有限公司' }, 
					{ 'lon': '116.50', 'lat': '23.45', 'address': '揭东县通辉石化有限公司' }, 
					{ 'lon': '110.96', 'lat': '21.58', 'address': '茂名华粤华源气体有限公司' }, 
					{ 'lon': '110.89', 'lat': '21.67', 'address': '茂名市供气总公司' }, 
					{ 'lon': '115.73', 'lat': '24.17', 'address': '中石化广东梅州石油分公司' }, 
					{ 'lon': '116.15', 'lat': '24.28', 'address': '梅州中燃城市燃气发展有限公司' }, 
					{ 'lon': '113.11', 'lat': '23.56', 'address': '清远市泛太化工实业有限公司' }, 
					{ 'lon': '113.67', 'lat': '24.19', 'address': '英德市高远通新材料科技有限公司' }, 
					{ 'lon': '116.66', 'lat': '23.41', 'address': '汕头市俊昌化工有限公司' }, 
					{ 'lon': '116.74', 'lat': '23.35', 'address': '广东石油分公司汉汕油库' }, 
					{ 'lon': '115.35', 'lat': '22.83', 'address': '汕尾市城区德昌电子有限公司' }, 
					{ 'lon': '114.27', 'lat': '25.10', 'address': '南雄市科鼎化工有限公司' }, 
					{ 'lon': '113.58', 'lat': '24.59', 'address': '乌石火电站' }, 
					{ 'lon': '114.03', 'lat': '22.71', 'address': '深圳市燃气集团股份有限公司.' }, 
					{ 'lon': '114.33', 'lat': '22.79', 'address': '深圳市宇鹏化工有限公司' }, 
					{ 'lon': '114.53', 'lat': '22.60', 'address': '大亚湾核电' }, 
					{ 'lon': '112.03', 'lat': '21.89', 'address': '阳东县生晖金属涂料有限公司' }, 
					{ 'lon': '112.26', 'lat': '21.71', 'address': '阳江核电' }, 
					{ 'lon': '112.04', 'lat': '22.97', 'address': '云硫矿业分公司' }, 
					{ 'lon': '112.38', 'lat': '22.69', 'address': '新兴县金玛利陶瓷有限公司' }, 
					{ 'lon': '110.37', 'lat': '21.21', 'address': '中石化管道储运分公司湛江输油处' }, 
					{ 'lon': '112.50', 'lat': '23.05', 'address': '肇庆星岩制漆有限公司' }, 
					{ 'lon': '112.73', 'lat': '23.22', 'address': '肇庆市国美陶瓷有限公司' }, 
					{ 'lon': '113.30', 'lat': '22.72', 'address': '中山市三森汉诺威化工涂料有限公司' }, 
					{ 'lon': '113.30', 'lat': '22.61', 'address': '中山市威勇电子有限公司' }, 
					{ 'lon': '113.43', 'lat': '22.57', 'address': '中山台光电子材料有限公司' }, 
					{ 'lon': '113.58', 'lat': '22.24', 'address': '九州港' }, 
					{ 'lon': '113.20', 'lat': '22.03', 'address': '珠海金成田化工有限公司' }
		        ],
		        pollItems: [],
		        simItems: [],
		        intItems: [],
		        playTimerArr: [],
		        isPlaying: false,
		        playText: '播放',
		        lonlat: '',
		        map: config.getParam('map'),
		        locationLayer: undefined,
		        layer: undefined,
		    }
		},
		vuex: {
		    getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
		        dateTime: state => state.model.dateTime
		    },
		    actions: { updateParam }
		},
		watch: {
		    strengthVal: function() {
		        if (this.model === 'sim') this.selectSim(this.currItem);
		        if (this.model === 'int') this.selectInt(this.currItem);
		    },
		    meanVal: function(mean) {
		        if (this.model === 'sim') this.selectSim(this.currItem);
		        if (this.model === 'int') this.selectInt(this.currItem);
		    },
		    factoryVal: function(factoryVal) {
		        if (factoryVal === 0) return;
		        let arr = this.factoryPollItems[factoryVal];
		        this.pollItems = arr;
		    },
		    pollcodeVal: function(pollcodeVal) {
		        if ('C137,I131'.indexOf(pollcodeVal) !== -1) {
		            this.rateUnit = '10<sup>14</sup>Bq/h';
		        } else {
		            this.rateUnit = 'kg/h';
		        }
		    },
		    dateTime: function(time) {
		        let state = true;

		        let dateTime = TimeUtil.format(time, 'yyyy-MM-dd');
		        let hour = TimeUtil.format(time, 'HH');

		        let index = ['02', '05', '08', '11', '14', '17', '20', '23'].indexOf(hour);

		        if (index === -1) {
		        	if (this.model === 'sim') this.getSimItems();
	            	if (this.model === 'int') this.getIntItems();
		        	return;
		        } else {
		        	// this.selectSimLine = this.simItems[index * 2]['id'];
		        }

				// if (!$.isEmptyObject(this.currItem)) {
				// 	let currTime = TimeUtil.format(this.currItem.boomTime, 'yyyy-MM-dd');
				// 	state = !(currTime === dateTime);
				// }
				// if (state) {
				// 	if (this.model === 'sim') this.getSimItems();
				// 	if (this.model === 'int') this.getIntItems();
				// }
		    },
		    isPlaying: function(state) {
		        if (!state) {
		            this.playText = '播放';
		            this.playTimerArr.forEach((data) => {
		                window.clearTimeout(data);
		            });
		            this.playTimerArr = [];
		        } else {
		            if (!$.isEmptyObject(this.currItem)) {
		                this.playText = '停止';
		                let oneArr = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48];
		                let twoArr = [24, 48];
		                let playArr = Number(this.meanVal) === 3 ? oneArr : twoArr;
		                playArr.forEach((data, index) => {
		                    this.playTimerArr.push(window.setTimeout(() => {
		                        this.setModel(data);
		                        if (Number(data) === 48) {
		                            this.isPlaying = false;
		                            this.playText = '播放';
		                        }
		                    }, 350 * index));
		                });
		            }
		        }
		    }
		},
		methods: {
		    close: function() {
		        this.goback();
		        this.$parent.list.pollutantDispersion.status = false;
		    },
		    goback: function() {
		        this.dot('sim');
		        this.simItems = [];
		        this.currItem = {};
		        this.lonlat = '';
		        this.nodata = false;
		        this.loading = false;
		        this.setTipInfo({
		            address: '',
		            chemicals: ''
		        });
		        this.updateParam('model', 'respTime', '');
		        this.updateParam('model', 'cType', '');
		    },
		    selectTimeVal: function() {
		        let date = TimeUtil.convertToDate(this.timeVal);
		        let timeStr = TimeUtil.format(date, 'yyyy,MM,dd,HH,mm');
		        let that = this;
		        $('#poll-time').unbind().timepicker({
		            date: timeStr,
		            format: 'yyyy-MM-dd HH:mm',
		            secondLock: true
		        }).on({
		            'console.timepicker': (e) => {
		                that.timeVal = TimeUtil.format(e.date, 'yyyy-MM-dd HH:mm');
		            }
		        });
		    },
		    newIntSim: function() {
		        if (this.lastTimer) window.clearTimeout(this.lastTimer);
		        this.heightVal = 10;
		        this.keepTimeVal = 12;
		        this.rateVal = 2;
		        this.timeVal = TimeUtil.format(TimeUtil.clearMMSS(new Date(), true), 'yyyy-MM-dd HH:mm');
		        this.factoryVal = '选择工厂类型';
		        this.pollcodeVal = '选择污染物';
		        this.isSubmit = false;
		        for (let i = 0; i < 4; i++) {
		            this.recordItems[i].isSuccess = false;
		        }
		    },
		    selectModel: function(model, data) {
		        if (this.lastTimer) window.clearTimeout(this.lastTimer);
		        lmap.draw.clear(this.locationLayer);
		        this.isPlaying = false;
		        this.updateParam('model', 'respTime', '');
		        this.updateParam('model', 'cType', '');
		        this.setTipInfo({
		            address: '',
		            chemicals: ''
		        });
		        this.pointText = '添加污染点';
		        this.nodata = false;
		        this.loading = false;
		        this.simItems = [];
		        this.intItems = [];
		        this.currItem = [];
		        this.modelItems[this.model].isSelect = false;
		        data.isSelect = true;
		        if (model === 'int') {
		            this.isSubmit = true;
		            this.getIntItems();
		        } else if (model === 'int-sim') {
		            this.newIntSim();
		        }
		        this.dot(model);
		        this.model = model;
		        this.meanVal = 24;
		        this.strengthVal = 'ks';
		    },
		    selectInt: function(item) {
		        this.isPlaying = false;
		        if (!$.isEmptyObject(item)) {
		            this.selectIntLine = item.id;
		            this.currItem = item;
		            let param = {
		                'lon': Number(item.lon),
		                'lat': Number(item.lat),
		                'address': item.areaName
		            };
		            this.getDataState(3, 'guangdong' + item.fileName + 'respond.txt', 'HI');
		            this.dot('int', param);
		            let dateTimeStr = TimeUtil.format(TimeUtil.clearMMSS(item.boomTime), 'yyyyMMddHHmm');
		            this.updateParam('model', 'dateTime', dateTimeStr);
		            this.setModel(this.meanVal);
		            this.setTipInfo({
		                address: item.areaName,
		                chemicals: item.pollName
		            });
		        }
		    },
		    selectSim: function(item) {
		        this.isPlaying = false;
		        if (!$.isEmptyObject(item)) {
		            this.selectSimLine = item.id;
		            this.currItem = item;
		            let dateTimeStr = TimeUtil.format(TimeUtil.clearMMSS(item.boomTime), 'yyyyMMddHHmm');
		            this.updateParam('model', 'dateTime', dateTimeStr);
		            this.setModel(this.meanVal);
		            this.setTipInfo({
		                chemicals: item.pollName,
		                address: this.simPoint.address
		            });
		        }
		    },
		    setModel: function(timeNum) {
		        let item = this.currItem;
		        if (!$.isEmptyObject(item)) {
		            let dateTime = TimeUtil.convertToDate(this.dateTime);
		            let boomTime = TimeUtil.clearMMSS(item.boomTime);
		            let pfmtype;
		            let respTime = '';
		            if (this.model === 'sim') {
		                pfmtype = 'pollutantDispersion' + this.meanVal + '_' + item.lon.replace('.', '') + '_' + item.lat.replace('.', '') + '_' + this.strengthVal + item.pollutant + '_' + timeNum;
		            } else if (this.model === 'int') {
		                respTime = item.fileName.substring(2, 14);
		                pfmtype = 'pollutantDispersion' + this.meanVal + '_' + respTime + 'jh' + '_' + this.strengthVal + item.pollutant + '_' + timeNum;
		            }
		            this.updateParam('model', 'respTime', respTime);
		            this.updateParam('model', 'cType', pfmtype);
		            this.updateParam('model', 'pType', 'pollutantDispersion');
		        }
		    },
		    setTipInfo: function(data) {
		        this.updateParam('pollutantDispersion', 'chemicals', data.chemicals);
		        this.updateParam('pollutantDispersion', 'address', data.address);
		    },

		    /**********************************读取数据************************************/
		    getSimItems: function() {
		        this.loading = true;
		        this.nodata = false;
		        this.simItems = [];
		        let timeStr = TimeUtil.format(this.dateTime, 'yyyy-MM-dd');
		        let lonlat = this.lonlat;
		        let pollType = this.strengthVal;
		        if (lonlat) {
		            $.ajax({
		                url: this.dss+'/diffusion/diffusion!getSimulationInfoNew.action',
		                type: 'GET',
		                data: {
		                    'pollType': pollType,
		                    'lonlat': lonlat,
		                    'timeStr': timeStr
		                },
		                dataType: 'json',
		                success: (json) => {
		                    this.loading = false;
		                    if (json[0] !== undefined) {
		                        this.simItems = json;
		                        this.selectSim(json[0]);
		                    } else {
		                        this.currItem = {};
		                        this.simItems = [];
		                        this.nodata = true;
		                    }
		                }
		            });
		        }
		    },
		    getIntItems: function(state) {
		        this.loading = true;
		        this.nodata = false;
		        this.intItems = [];
		        let timeStr;
		        if (!state) timeStr = TimeUtil.format(this.dateTime, 'yyyyMMdd').substring(2, 8);
		        let that = this;
		        $.ajax({
		            url: this.dss+'/diffusion/diffusion!getInteractionInfoNew.action',
		            type: 'GET',
		            data: { 'timeStr': timeStr },
		            dataType: 'json',
		            success: function(json) {
		                that.loading = false;
		                if (json[0] !== undefined) {
		                    that.intItems = json;
		                    that.selectInt(json[0]);
		                } else {
		                    that.currItem = {};
		                    that.intItems = [];
		                    that.nodata = true;
		                }
		            }
		        });
		    },
		    submit: function(model) {
		        if (this.isSubmit) return;
		        	let keepTimeVal = this.keepTimeVal;
		            let timeVal = this.timeVal;
		            let rateVal = this.rateVal;
		            let pollcodeVal = this.pollcodeVal;
		            let heightVal = this.heightVal;
		            let lon = this.lon;
		            let lat = this.lat;
		            let areaName = 'guangdong';
		        if (model === 'int-sim') {
		            if (pollcodeVal === '选择污染物') return;
		            if (!keepTimeVal) return;
		            if (!rateVal) return;
		            if (!pollcodeVal) return;
		            if (!heightVal) return;
		        }
		        if ("C137,I131".indexOf(pollcodeVal) !== -1) {
		            rateVal = rateVal * Math.pow(10, 14);
		        } else {
		            rateVal = rateVal * Math.pow(10, 9);
		        }
		        rateVal = Number(rateVal).toExponential(1);
		        rateVal = rateVal.toUpperCase();
		        let rateArr = rateVal.split('+');
		        if (rateArr[1].length === 1) rateArr[1] = "0" + rateArr[1];
		        rateVal = rateArr[0] + '+' + rateArr[1];
		        heightVal = Number(heightVal).toFixed(1);
		        timeVal = TimeUtil.format(timeVal, 'yyyyMMddHHmm');
		        timeVal = timeVal.substring(2, 12);
		        let lonlat = this.reqLonlat.split(',');
		        let str = 'guangdong,' + timeVal + ',' + lonlat[0] + ',' + lonlat[1] + ',' + heightVal + ',' + rateVal + ',' + keepTimeVal + ',' + pollcodeVal;
		        this.recordItems[0].isSuccess = true;
		        let that = this;
		        $.ajax({
		            url: this.dss+'/diffusion/diffusion!saveDiffusionInfoNew.action',
		            type: 'GET',
		            data: {
		                'strInfo': str
		            },
		            dataType: 'json',
		            success: function(json) {
		                if (json.state) that.recordItems[1].isSuccess = true;
		                let fileName = json.fileName;
		                that.lastTimer = window.setTimeout(() => {
		                    that.getDataState(2, fileName);
		                }, 10000);
		            }
		        });
		        this.isSubmit = true;
		    },
		    getDataState: function(index, fileName, model) {
		        if (this.lastTimer) window.clearTimeout(this.lastTimer);
		        if (model) {
		            this.recordItems[0].isSuccess = false;
		            this.recordItems[1].isSuccess = false;
		            this.recordItems[2].isSuccess = false;
		            this.recordItems[3].isSuccess = false;
		        }
		        let url = '';
		        if (index === 2) {
		            url = this.dss+'/diffusion/diffusion!getInteractionState.action';
		        } else if (index === 3) {
		            url = this.dss+'/diffusion/diffusion!getFeedback.action';
		        }
		        let that = this;
		        $.ajax({
		            url: url,
		            type: 'GET',
		            data: {
		                'fileName': fileName
		            },
		            dataType: 'json',
		            success: function(json) {
		                if (json.state) {
		                    if (model) {
		                        that.recordItems[0].isSuccess = true;
		                        that.recordItems[1].isSuccess = true;
		                        that.recordItems[2].isSuccess = true;
		                    }
		                    that.recordItems[index].isSuccess = true;
		                    if (index === 3) {
		                        window.clearTimeout(that.lastTimer);
		                    } else {
		                        that.lastTimer = window.setTimeout(() => {
		                            that.getDataState(index + 1, fileName);
		                        }, 10000);
		                    }
		                } else {
		                    if (model) {
		                        that.recordItems[0].isSuccess = true;
		                        that.recordItems[1].isSuccess = true;
		                        that.recordItems[2].isSuccess = true;
		                    }
		                    that.lastTimer = window.setTimeout(() => {
		                        that.getDataState(index, fileName);
		                    }, 10000);
		                }
		            }
		        });
		    },
		    getRoadName: function(lonlat) {
		        let that = this;
		        lonlat[0] = Number(lonlat[0]).toFixed(2);
		        lonlat[1] = Number(lonlat[1]).toFixed(2);
		        lonlat = lonlat.join(',');
		        let reqParam = {
		            'areaCode': '440000',
		            'lonlat': lonlat
		        };
		        this.reqLonlat = lonlat;
		        $.ajax({
		            url: this.dss_sj+'/lucene/lucene!getRoadName.action',
		            type: 'GET',
		            dataType: 'json',
		            data: reqParam,
		            success: function(json) {
		                if (json !== 'null') {
		                    that.pointText = json.fullAddress;
		                } else {
		                    that.pointText = '暂无匹配地点';
		                }
		            }
		        });
		    },

		    /**********************************地图方法************************************/
		    dot: function(model, param) {
		        lmap.icon.clear(this.layer);
		        let style = {
		            anchor: [17.5, 17.5],
		            iconUrl: 'http://10.148.16.56/topic/little/toolbar/pollute.png',
		            iconSize: [35, 35],
		            scale: 0.85,
		            fontColor: 'red',
		            fontSize: '12px',
		            outColor: 'white',
		            outWidth: 3,
		            text: '',
		            offsetY: 30,
		            offsetX: 10
		        };
		        if (model === 'sim') {
		            this.factoryArr.forEach((data) => {
		                let feature = lmap.icon.addIcon(this.layer, style, data.lon, data.lat, 'simPoint');
		                feature.set('pointInfo', {
		                    lon: data.lon,
		                    lat: data.lat,
		                    address: data.address
		                })
		            });
		        } else if (model === 'sim-select') {
		            style.text = param.address;
		            lmap.icon.addIcon(this.layer, style, param.lon, param.lat);
		            this.lonlat = param.lon + ',' + param.lat;
		            this.getSimItems();
		        } else if (model === 'int') {
		            if (param !== undefined) {
		                style.text = param.address;
		                lmap.icon.addIcon(this.layer, style, param.lon, param.lat);
		            }
		        }
		    },
		    selectPoint: function() {
		        this.cancel();
		        lmap.draw.clear(this.locationLayer);
		        let style = {
		            anchor: [14, 0],
		            iconUrl: 'http://10.148.16.56/topic/little/pollutant/pollpoint.png',
		            iconSize: [28, 40]
		        }
		        this.drawHander = lmap.draw.point(this.drawParam, this.callbackEvt, style);
		    },
		    cancel: function() {
		        if (!!this.drawHander) {
		            lmap.draw.cancel(this.map, this.drawHander);
		        }
		    },
		    initDotLayer: function() {
		        this.layer = lmap.icon.initLayer(this.map, 'point');
		    },
		    initLocationLayer: function() {
		        this.drawParam = lmap.draw.initDrawParam(this.map, 'draw');
		        this.locationLayer = this.drawParam.layer;
		        this.modify = lmap.draw.modify(this.drawParam, this.modifyEvt);
		    },
		    modifyEvt: function(feature) {
		        let feat = feature[0];
		        let type = feat.get('name');
		        let wkt = lmap.draw.getWkt(feat);
		        let lonlat = wkt.replace('POINT(', '').replace(')', '').split(' ');
		        this.getRoadName(lonlat);
		    },
		    clickEvt: function(evt) {
		        if (this.model === 'sim') {
		            let feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
		                return feature;
		            });
		            if (!!feature) {
		                let type = feature.get('name');
		                if (type == 'simPoint') {
		                    let pointInfo = feature.get('pointInfo');
		                    let param = {
		                        'lon': pointInfo.lon,
		                        'lat': pointInfo.lat,
		                        'address': pointInfo.address
		                    };
		                    this.simPoint = param;
		                    this.dot('sim-select', param);
		                }
		            }

		        }
		    },
		    callbackEvt: function(type, feature) {
		        let style = {
		            fill: '#E04C38',
		            fillOpacity: 0.2,
		            strokeColor: '#27303F',
		            strokeWidth: 2,
		            anchor: [14, 0],
		            iconUrl: 'http://10.148.16.56/topic/little/pollutant/pollpoint.png',
		            iconSize: [28, 40],
		            fontColor: '',
		            fontSize: '8px',
		            outColor: 'white',
		            outWidth: 3,
		            text: '',
		            offsetY: -25,
		            offsetX: 10
		        };
		        feature.set('name', type);
		        feature.set('style', style);
		        let lonlat = lmap.draw.getWkt(feature).replace('POINT(', '').replace(')', '').split(' ');
		        this.cancel();
		        this.pointText = '搜索中...';
		        this.getRoadName(lonlat);
		    }
		},
		ready: function() {
		    this.map.on('singleclick', this.clickEvt);
		    this.initDotLayer();
		    this.initLocationLayer();
		    this.dot('sim');
		},

		detached: function() {
		    this.map.un('singleclick', this.clickEvt);
		    this.map.removeLayer(this.layer);
		    this.map.removeLayer(this.locationLayer);
		    if (this.drawHander) {
		        lmap.draw.cancel(this.map, this.drawHander);
		    }
		    delete this.layer;
		    delete this.locationLayer;
		    delete this.drawParam;
		    delete this.modify;
		    delete this.map;
		}
	}
</script>

<style scoped lang='less'>
@import '../../../util/timepicker/timepicker.css';
@import "../../../assets/css/common.less";

div.panel {
	width: 412px;
}
div.sim-list table th:first-child, div.sim-list table td:first-child {
	width: 32px;
}
div.sim-list table th:nth-child(2), div.sim-list table td:nth-child(2) {
	width: 160px;
}
div.sim-list table th:nth-child(3), div.sim-list table td:nth-child(3) {
	width: 179px;
}
div.int-list table th {
	height: 36px;
	line-height: 14px;
}
div.int-list table th:first-child, div.int-list table td:first-child {
	width: 30px;
}
div.int-list table th:nth-child(2), div.int-list table td:nth-child(2) {
	width: 88px;
}
div.int-list table th:nth-child(3), div.int-list table td:nth-child(3) {
	width: 123px;
}
div.int-list table th:nth-child(4), div.int-list table td:nth-child(4) {
	width: 30px;
}
div.int-list table th:nth-child(5), div.int-list table td:nth-child(5) {
	width: 45px;
}
div.int-list table th:nth-child(6), div.int-list table td:nth-child(6) {
	width: 45px;
}
ul.new-Pollute-other li div.div-width {
	background: url("../../../assets/img/common/Polluteplace0.png") no-repeat 1px 4px;
	color: #414e61;
}
ul.new-Pollute-other li div.div-color input, ul.new-Pollute-other li div.div-color select, ul.new-Pollute-other li div.div-color span {
	color: #1f7ed0;
}
.modelPop {
	width: 318px;
	padding: 1px;
	height: auto;
	border: 1px solid @borderColor;
	clear: both;
	position: absolute;
	z-index: 2;
	right: 0;
	top: 0px;
	background: #fff;
	-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	-moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
.Close {
	position: absolute;
	right: 0;
	top: 0;
	height: 20px;
	width: 20px;
	background: url("../../../assets/img/toolsbar/rightIcon.png") no-repeat;
	background-position: -153px -60px !important;
	display: inline-block;
	zoom: 1;
	cursor: pointer;
}
.model-ui {
	margin: 2px;
	height: auto;
	overflow: hidden;

	li {
		height: 18px;
		line-height: 18px;
		margin: 3px 0 6px;
		text-align: center;
		width: 33%;
		float: left;
		cursor: pointer;
	}
	li.select-model em {
		display: inline-block;
		position: relative;
		margin-left: 3px;
		margin-top: -15px;
	}
}
.model-ui li:first-child, .model-ui li:nth-child(2) {
	border-right: 1px solid @borderColor;
}
.param-panel {
	margin-bottom: 5px;
	height: 24px;

	div.nd-select {
		width: 130px;
	}
	div.nd-select {
		float: left;
		position: relative;
		height: 22px;
		line-height: 22px;

		select {
			padding-left: 60px;
		}
		line-height: 22px;

		span {
			position: absolute;
			left: 6px;
			padding-top: 1px
		}
	}
	div.poll-select {
		float: left;
		margin-left: 5px;
		margin-right: 10px;
		position: relative;
		height: 22px;
		line-height: 22px;

		span {
			position: absolute;
			left: 6px;
			padding-top: 1px
		}
		select {
			padding-left: 40px;
		}
	}
}
.goback {
	padding-left: 25px;
	background: url("../../../assets/img/common/back.png") no-repeat 5px 3px;
}
.spanbtn {
	margin-right: 5px
}
.int-all-btn:hover {
	background-color: #ECF2FC;
}
.Pollute-table {
	height: auto;
	margin: 0px 1px;

	table {
		width: 100%;
		color: #414e61;
		table-layout: fixed;

		thead {
			background: #ecf2fc;
			width: 100%;
			display: block;

			tr {
				display: block;

				th {
					font-style: normal;
					line-height: 12px;
					height: 22px;
					vertical-align: middle;
					text-align: center;
					border-left: 1px solid #E0EAF5;
					border-bottom: 1px solid #E0EAF5;
					padding: 2px;
					word-break: break-all;
					font-weight: 400;
				}
			}
		}
		tbody {
			height: 180px;
			overflow-y: scroll;
			overflow-x: hidden;
			display: block;
			width: 100%;

			tr {
				width: 100%;
				border-bottom: 1px solid #E0EAF5;
				height: 25px;
				cursor: pointer;

				td {
					vertical-align: middle;
					text-align: center;
					border-left: 1px solid #E0EAF5;
					border-bottom: 1px solid #E0EAF5;
					line-height: 16px;
					padding: 2px;
					word-break: break-all;

					input {
						cursor: pointer;
						margin-left: -3px;
						margin-right: -3px;
						width: 16px;
						height: 16px;
					}
				}
			}
			tr:nth-child(even) {
				background: #ecf2fc;
			}
		}
	}
}
.int-line {
	width: 80%;
	margin: auto;
	height: 40px;
	padding: 10px 0px;

	li {
		float: left;
		height: 1px;
		background: #707070;
		position: relative;
		width: 32%;

		em {
			display: inline-block;
			display: -moz-inline-stack;
			zoom: 1;
			*display: inline;
			position: absolute;
			width: 21px;
			height: 21px;
			right: -9px;
			top: -10px;
			background: url("../../../assets/img/common/line0.png") no-repeat 5px 5px;
			z-index: 9;
		}
		a {
			display: inline-block;
			display: -moz-inline-stack;
			zoom: 1;
			*display: inline;
			position: absolute;
			cursor: default;
			width: 54px;
			text-align: center;
			height: 20px;
			line-height: 20px;
			right: -27px;
			top: 10px;
			color: #707070;
			z-index: 9;
		}
	}
	li.li-line-start {
		background: #96cb00;

		em {
			background: url("../../../assets/img/common/line.png") no-repeat 1px 2px;
		}
	}
	li:first-child {
		width: 5px;
		border: none;

		em {
			left: -9px;
		}
		a {
			left: -28px;
			cursor: pointer;
			border: 1px solid #ccc;
		}
		a:hover {
			color: #1f7ed0;
		}
		a.submit {
			cursor: pointer;
			border: 1px solid #ccc;
		}
		a.yet {
			cursor: default;
			border: none;
		}
	}
}
.int-sim-panel ul {
	height: 116px;
	margin: 0px 2px;
	margin-bottom: 15px;

	li {
		width: 100%;
		margin-left: 0px;
		float: left;
		margin-bottom: 7px;

		label {
			display: inline-block;
			display: -moz-inline-stack;
			zoom: 1;
			*display: inline;
			cursor: pointer;
			float: left;
			margin-right: 3px;
			height: 22px;
			line-height: 22px;
			color: #414e61;
		}
		div {
			height: 22px;
			line-height: 22px;
			position: relative;
			cursor: pointer;
			float: left;
			border: 0px;
			width: 146px;

			select {
				border: 0;
				height: 22px;
				background: none;
				font-family: "Microsoft Yahei";
				color: @color;
				position: absolute;
				width: 160%;
				text-align: right;
				left: 0px;
				top: 0px;
				cursor: pointer;
				list-style-type: none;
				-webkit-text-size-adjust: none;
				outline: none;
			}
		}
		a {  
			    cursor: pointer;
			    border: 1px solid #ccc;
			    display: inline-block;
			    display: -moz-inline-stack;
			    zoom: 1;
			    text-decoration: none;
			    width: 55px;
			    text-align: center;
			    height: 22px;
			    line-height: 22px;
			    color: #707070;
			    z-index: 9;
		}
		.div-width-1 {
			width: 124px;
			margin-left: 28px;
		}
		.div-width-2 {
			width: 125px;
			background: #ecf2fc;

			input {
				width: 100%;
				height: 22px;
				background: 0;
				border: 0;
				font-family: "Microsoft Yahei";
				list-style-type: none;
				-webkit-text-size-adjust: none;
				outline: none;
				color: @colorH;
			}
			input.input-width {
				width: 44%;
				margin-left: 3%;
			}
			span {
				float: right;
			}
		}
		div.div-margin {
			margin-left: 0px;
			width: 166px;
		}
		.new-simulate {
			display: inline-block;
			display: -moz-inline-stack;
			zoom: 1;
			*display: inline;
			float: right;
			width: 76px;
			padding: 0px 2px;
			height: 22px;
			line-height: 22px;
			border: 1px solid #ccc;
			cursor: pointer;
			color: #414e61;

			em {
				display: inline-block;
				display: -moz-inline-stack;
				zoom: 1;
				*display: inline;
				height: 14px;
				line-height: 11px;
				margin-top: -3px;
				width: 14px;
				background: #BBBDC3;
				text-align: center;
				font-weight: bold;
				color: #fff;
				font-size: 15px;
				cursor: pointer;
				font-style: normal;
				vertical-align: middle;
				border-radius: 14px;
				-webkit-border-radius: 14px;
				-ms-border-radius: 14px;
				-moz-border-radius: 14px;
			}
		}
		.new-simulate:hover {
			background-color: #E0EAF5;
		}
		.div-place {
			white-space: nowrap;
			text-overflow: ellipsis;
			-o-text-overflow: ellipsis;
			overflow: hidden;
			width: 225px;
			padding-left: 16px;
		}
		div-place:hover {
			background-color: #E0EAF5;
		}
		div.add-point {
			background: url("../../../assets/img/common/Polluteplace0.png") no-repeat 1px 4px;
			width: 233px;
		}
	}
	li.li-double {
		width: 50%;
	}
	.select select {
		padding-left: 0;
	}
}
.loading {
	width: 100%;
	padding: 30px 0;
	text-align: center;
}
.nodata {
	width: 100%;
	padding: 30px 0;
	text-align: center;
}

/*big*/
.big .modelPop {
	width: 600px;
}
.big .modelPop-title {
	font-size: 20px;

	label {
		font-size: 18px
	}
}
.big .modelPop-ui {
	margin-bottom: 10px;

	li {
		height: 30px;
		line-height: 30px;
	}
}
.big .model-ui li {
	height: 26px;
	line-height: 26px;
}
.big .param-panel {
	height: 30px;

	div.nd-select {
		width: 200px;
		margin-right: 10px;

		span {
			padding-top: 5px;
		}
		select {
			padding-left: 92px;
		}
	}
	div.poll-select {
		width: 145px;
		margin-left: 10px;
		margin-right: 20px;

		span {
			padding-top: 5px;
		}
		select {
			padding-left: 55px;
		}
	}
}
.big .goback {
	background-position: 5px 8px !important;
}
.big .int-sim-panel ul li label, .big .Pollute-table table thead tr th, .big .Pollute-table table tbody tr td {
	height: 36px;
	line-height: 36px;
}
.big  .Pollute-table table tbody {
	height: 200px;
}
.big div.sim-list table th:first-child, .big div.sim-list table td:first-child {
	width: 56px;
}
.big div.sim-list table th:nth-child(2), .big div.sim-list table td:nth-child(2) {
	width: 283px;
}
.big div.sim-list table th:nth-child(3), .big div.sim-list table td:nth-child(3) {
	width: 220px;
}
.big .int-sim-panel ul {
	height: 160px;

	li {
		label {
			height: 30px;
			line-height: 30px;
		}
		div {
			height: 30px;
			line-height: 30px;
			width: 225px;

			select {
				height: 30px;
			}
		}
		a {
			width:88px;
			height: 28px;
			line-height: 28px;
		}
		.div-width-1 {
			width: 210px;
		}
		.div-width-2 {
			width: 174px;

			input {
				height: 30px;
				line-height: 30px;
				font-size: 20px;
			}
		}
		div.div-margin {
			width: 235px;
		}
		.new-simulate {
			width: 76px;
			padding: 0px 2px;
			height: 22px;
			line-height: 22px;
			color: #414e61;

			em {
				height: 14px;
				line-height: 11px;
				margin-top: -3px;
				width: 14px;
				font-size: 15px;
			}
		}
		.div-place {
			width: 225px;
			padding-left: 28px;
		}
		div.add-point {
			background-position: 5px 7px !important;
			-webkit-background-size: 16px;
			-moz-background-size: 16px;
			background-size: 16px;
			width: 320px;
		}
	}
}
.big .int-line {
	height: 46px;
	width: 86%;

	li {
		a {
			width: 88px;
			height: 28px;
			line-height: 28px;
			right: -42px;
		}
	}
	li:first-child {
		em {
			left: -6px;
		}
		a {
			left: -41px;
		}
	}
}
.big div.int-list table thead tr th {
	height: 46px;
	line-height: 24px;
}
.big div.int-list table th:first-child, .big div.int-list table td:first-child {
	width: 50px;
}
.big div.int-list table th:nth-child(2), .big div.int-list table td:nth-child(2) {
	width: 130px;
}
.big div.int-list table th:nth-child(3), .big div.int-list table td:nth-child(3) {
	width: 133px;
}
.big div.int-list table th:nth-child(4), .big div.int-list table td:nth-child(4) {
	width: 60px;
}
.big div.int-list table th:nth-child(5), .big div.int-list table td:nth-child(5) {
	width: 85px;
}
.big div.int-list table th:nth-child(6), .big div.int-list table td:nth-child(6) {
	width: 85px;
}
</style>