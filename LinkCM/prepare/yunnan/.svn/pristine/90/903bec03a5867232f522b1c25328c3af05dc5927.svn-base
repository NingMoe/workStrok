<template>
    <div class="rain-charts" :id="cid"></div>
</template>

<script>
    import TimeUtil from '../../../util/tools/TimeUtil'
    import { updateParam } from '../../../vuex/store'
    import Highcharts from 'highcharts'

    export default {
        props: ['lonlat', 'cid'],
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                sysTime: state => state.time.sysTime
            },
            actions: {
                updateParam
            }
        },
        watch: {
            lonlat: function(){
                this.getRainData(this.lonlat);
            }
        },
        methods: {
            initChart: function(pastArr, futureArr){
                Highcharts.chart(this.cid,{
                    chart: { type: 'column', margin: [60, 10, 35, 45] },
                    credits: {
					    enabled: false
					},
                    title: { text: '' },
                    xAxis: {
                    	plotLines: [
                    		{ 
                    			color: '#FF0000',
                    			width: 2, 
                    			value: 5 
                    		}
                    	],
                    	categories: ['-24h', '-12h', '-6h', '-3h', '-1h', '现在', '1h', '3h', '24h', '48h', '72h'], 
                    	labels: {
                    		align: 'center', 
                    		rotation:0,
                    		y: 25, 
                    		style: {
                    			color:'#414e61',
                    			fontSize: '12px', 
                    			fontFamily: 'Microsoft yahei'
                    		} 
                    	} 
                    },
                    yAxis: { 
                    	min: 0, 
                    	title: {text: ''} 
                    },
                    legend: { 
                    	align: 'left',
                    	verticalAlign: 'top', 
                    	borderWidth: 0, 
                    	x: 30, 
                    	y: -8, 
                    	itemStyle: {
                    		color: '#414e61', 
                    		fontFamily: 'Microsoft yahei'
                    	} 
                    },
                    series: [{
                        name: '过去累计雨量',
                        color: '#2F7ED8',
                        pointWidth: 18,
                        data: pastArr,
                        dataLabels: {
                            enabled: true,
                            rotation: -90,
                            align: 'center',
                            formatter: function() {
                                if (this.y === 0) {
                                    return;
                                } else {
                                    return this.y
                                }
                            },
                            x: 4,
                            y: -15,
                            color: '#414e61', 
                    		fontFamily: 'Microsoft yahei'
                        }
                    }, {
                        name: '未来累计雨量',
                        color: '#BCBCBC',
                        pointWidth: 18,
                        data: futureArr,
                        dataLabels: {
                            enabled: true,
                            rotation: -90,
                            align: 'center',
                            formatter: function() {
                                if (this.y === 0) {
                                    return;
                                } else {
                                    return this.y
                                }
                            },
                            x: 4,
                            y: -15,
                            color: '#414e61', 
                    		fontFamily: 'Microsoft yahei'
                        }
                    }]
                });
            },
            getRainData: function(lonlat){
                var that = this;
                let reqParam = {
                    'type': 'all',
                    'lon': lonlat[0],
                    'lat': lonlat[1],
                    'isLevel': 1,
                    'isLive': 1,
                    'dateTime': TimeUtil.format(this.sysTime, 'yyyy-MM-dd HH:mm:ss')
                };
                $.ajax({
                    url: this.dss+'/allRain/rain!get.action',
                    dataType: 'json',
                    type: 'GET',
                    data: reqParam,
                    success: function(json){
                        that.hasRainData = true;
                        that.createData(json);
                    }
                });
            },
            createData: function(data){
                
                let past1hour = data['QPE'].rain1hour === 0 || data['QPE'].rain1hour === 9999 ? '' : data['QPE'].rain1hour;
                let past3hour = data['QPE'].rain3hourSum === 0 || data['QPE'].rain3hourSum === 9999 ? '' : data['QPE'].rain3hourSum;
                let past6hour = data['QPE'].rain6hourSum === 0 || data['QPE'].rain6hourSum === 9999 ? '' : data['QPE'].rain6hourSum;
                let past12hour = data['QPE'].rain12hourSum === 0 || data['QPE'].rain12hourSum === 9999 ? '' : data['QPE'].rain12hourSum;
                let past24hour = data['QPE'].rain24hourSum === 0 || data['QPE'].rain24hourSum === 9999 ? '' : data['QPE'].rain24hourSum;

                let future1hour = data['QPF'].rain1hour === 0 || data['QPF'].rain1hour === 9999 ? '' : data['QPF'].rain1hour;
                let future3hour = data['QPF'].rain3hour === 0 || data['QPF'].rain3hour === 9999 ? '' : data['QPF'].rain3hour;
                let future24hour = data['DAY'].rain24hour === 0 || data['DAY'].rain24hour === 9999 ? '' : data['DAY'].rain24hour;
                let future48hour = data['DAY'].rain48hour === 0 || data['DAY'].rain48hour === 9999 ? '' : data['DAY'].rain48hour;
                let future72hour = data['DAY'].rain72hour === 0 || data['DAY'].rain72hour === 9999 ? '' : data['DAY'].rain72hour;    

                let pastArr = [parseFloat(past24hour), parseFloat(past12hour), parseFloat(past6hour), parseFloat(past3hour), parseFloat(past1hour), '', '', '', '', '', ''];
                let futureArr = [0, '', '', '', '', '', parseFloat(future1hour), parseFloat(future3hour), parseFloat(future24hour), parseFloat(future48hour), parseFloat(future72hour)];

                this.initChart(pastArr, futureArr);

            }
        },
        ready: function(){
            this.getRainData(this.lonlat);
        }
    }
</script>

<style scoped lang="less">
.poiPop{
    width:427px;
    height: auto;
    position: absolute;
    z-index:3;
    right: 0;
    top: 30px;
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
    background: url("../../../assets/img/toolsbar/rightIcon.png") no-repeat;
    background-position: -153px -60px!important;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
}
.rain-charts{
	height: 250px;
}
/*big*/
.big .poiPop{
    width:600px;
    top: 45px;
}
</style>