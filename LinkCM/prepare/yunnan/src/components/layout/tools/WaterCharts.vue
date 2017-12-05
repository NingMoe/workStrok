<template>
    <div class="waterRain">
        <ul class="waterRainLegend">
            <li>
                <label style="margin-right: 10px;">水位(米)</label>
                <label>累计雨量：</label>
                <span class="gust">过去</span>
                <span class="for">未来</span>
            </li>
            <li>
                <span class="ww">水库水位</span>
                <span class="outy">超警戒</span>
            </li>
        </ul>
        <div class="rain-charts" :id="cid"></div>
    </div>
</template>

<script>
    import TimeUtil from '../../../util/tools/TimeUtil'
    import { updateParam } from '../../../vuex/store'
    import Highcharts from 'highcharts'

    export default {
        props: ['lonlat', 'cid', 'reservoirid', 'updatetime', 'warnlevel'],
        data() {
            return {
                max:20,
                fontSize: '12px',
                buttomMargin: 165,
                min: 0,
                intervel: 0.01,
                rainMax:10,
                zone: 0
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                big: state => state.big.status
            },
            actions: {
                updateParam
            }
        },
        watch: {
            updatetime: function(){
                 this.getRainData(this.reservoirid);
            },
            reservoirid: function(){
                this.getRainData(this.reservoirid);
            },
            big: function(status){
                this.fontSize = status ? '16px': '12px';
                this.buttomMargin = status ? 210 : 165;
                this.getRainData(this.reservoirid);
            }
        },
        methods: {
            initChart: function(pastArr, futureArr, levelArr) {
                Highcharts.chart(this.cid, {
                    credits: { enabled: false }, // 水印隐藏
                    title: { text: '' },
                    xAxis: {
                        plotLines: [{
                            color: '#FF0000',
                            width: 1,
                            value: 4.5,
                            zIndex: 5,
                            label: {
                                x: -35,
                                y: this.buttomMargin,
                                text: TimeUtil.format(this.updatetime, 'MM-dd HH:mm'),
                                rotation: 0,
                                staggerLines: 5,
                                align: 'left',
                                style: {
                                    color: 'black',
                                    fontSize: this.fontSize - 2,
                                    fontFamily: 'Microsoft yahei',
                                    fontWeight: 'bold'
                                }
                            }
                        }],
                        categories: ['-24h', '-12h', '-6h', '-3h', '-1h', '1h', '3h', '24h', '48h', '72h'],
                        gridLineColor: '#e9e9e9',
                        gridLineWidth: 1,
                        labels: {
                            align: 'center',
                            rotation: 0,
                            y: 15,
                            style: {
                                color: '#414e61',
                                fontSize: this.fontSize,
                                fontFamily: 'Microsoft yahei'
                            },
                            // formatter: function() {
                            //     var labelVal = this.value; // 获取到刻度值
                            //     var reallyVal = labelVal; // 实际返回的刻度值
                            //     if (labelVal.length > 10) {// 判断刻度值的长度
                            //         reallyVal = labelVal.substring(0, 6) + '<br/>' + labelVal.substring(6); // 截取刻度值
                            //     }
                            //     return `${this.value}<br/>`;
                            // }
                        }
                    },
                    yAxis: [{
                        min: this.min,
                        max: this.max,
                        gridLineWidth: 1,
                        gridLineDashStyle: 'dash',
                        zIndex: 3,
                        // tickInterval: this.intervel,
                        title: { text: '', rotation: 0, align: 'high', x: 20, y: 0 },
                        labels: {
                            style: {
                                fontSize: this.fontSize
                            },
                            formatter: function() {
                                return this.value.toFixed(2);
                            }
                        },
                        plotLines: [{
                            zIndex: 5,
                            width: 1, // 标示线的宽度，2px
                            color: 'red', // 线的颜色，定义为红色
                            dashStyle: 'dash', // 标示线的样式，默认是solid（实线），这里定义为长虚线
                            value: this.warnlevel, // 定义在哪个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                            label: {
                                // text: `警戒<br>水位${this.warnlevel}`,
                                x: this.big ? 334.3 : 295,
                                staggerLines: 5,
                                text: this.warnlevel,
                                align: 'left',
                                style: {
                                    color: 'red',
                                    fontWeight: 'bold',
                                    fontSize: this.fontSize
                                }
                            },

                        }]
                    }, {
                        title: { text: '' },
                        gridLineWidth: 0,
                        labels: { enabled: false },
                        opposite: true
                    }],
                    legend: {
                        align: 'left',
                        verticalAlign: 'top',
                        borderWidth: 0,
                        x: 80,
                        y: -8,
                        enabled: false, // 隐藏图例的属性
                        symbolWidth: 9,
                        itemStyle: {
                            color: '#414e61',
                            fontFamily: 'Microsoft yahei'
                        }
                    },
                    series: [{
                        name: '过去累计雨量',
                        type: 'column',
                        color: '#2F7ED8',
                        pointWidth: 18,
                        yAxis: 1,
                        margin: [0, 10, 35, 45],
                        data: pastArr,
                        dataLabels: {
                            x: -2,
                            y: 5,
                            enabled: true,
                            rotation: 0,
                            color: '#414e61',
                            align: 'center',
                            fontSize: '7px',
                            fontFamily: 'Microsoft yahei',
                            formatter: function() {
                                if (this.y > 0) {
                                    return `${this.y}mm`;
                                } else {
                                    return this.y
                                }
                            }
                        }
                    }, {
                        type: 'column',
                        name: '未来累计雨量',
                        color: '#BCBCBC',
                        yAxis: 1,
                        margin: [60, 10, 35, 45],
                        pointWidth: 18,
                        data: futureArr,
                        dataLabels: {
                            x: -2,
                            y: 5,
                            enabled: true,
                            rotation: 0,
                            color: '#414e61',
                            align: 'center',
                            fontSize: '7px',
                            fontFamily: 'Microsoft yahei',
                            formatter: function() {
                                if (this.y > 0) {
                                    return `${this.y}mm`;
                                } else {
                                    return this.y
                                }
                            }
                        }
                    }, {
                        name: '水库水位',
                        type: 'spline',
                        dashStyle: 'solid',
                        color: null,
                        yAxis: 0,
                        lineWidth: 2,
                        data: levelArr,
                        marker: {
                            symbol: 'circle',
                            fillColor: '#FFFFFF',
                            radius: 3.5, // 曲线点半径，默认是4
                            lineWidth: 1.5,
                            lineColor: null, // inherit from series
                            states: {
                                hover: {
                                    fillColor: '#FFFFFF',
                                    // lineColor: "#FFFFFF",
                                    // radius: 3.5,
                                    // radiusPlus: 5
                                }
                            }
                        },
                        tooltip: {
                            valueSuffix: '米'
                        },
                        zones: [{
                            value: this.zone
                        }, {
                            color: 'red'
                        }]
                    }]
                });
            },
            getRainData: function(reservoirid) {
                $.ajax({
                    url: this.dss_sj+'/warn/warn!getData.action',
                    dataType: 'json',
                    type: 'GET',
                    data: {
                        'reservoirId': reservoirid,
                        'queryTime': TimeUtil.format(this.updatetime, 'yyyyMMddHH')
                    },
                    success: (data) => {
                        this.createData(data);
                    }
                });
            },
            createData: function(res) {
                let pastArr = [];
                let futureArr = [];
                let levelArr = [];
                let jiange = 0.1;
                let warn = parseFloat(this.warnlevel);
                let warnHigh = Number((warn + jiange).toFixed(2));
                let warnLow = Number((warn - jiange).toFixed(2));
                this.max = 20;
                this.min = 0;
                if (res.length > 0) {
                    for (let i = 0; i < 5; i++) {
                        let resIndex = res[i];
                        let rainVal = parseFloat(resIndex.rainfall);
                        rainVal = (rainVal == '0' || rainVal == '9999') ? '' : rainVal;
                        pastArr.push(rainVal);
                        let waterVal = parseFloat(res[i].waterlevel);
                        waterVal = waterVal ? waterVal : '';
                        levelArr.push(waterVal);
                        futureArr.push('');
                    }
                    for (let i = 5; i < res.length; i++) {
                        let resIndex = res[i];
                        let rainVal = parseFloat(resIndex.rainfall);
                        rainVal = (rainVal == '0' || rainVal == '9999') ? '' : rainVal;
                        futureArr.push(rainVal);
                        let waterVal = parseFloat(res[i].waterlevel);
                        waterVal = waterVal ? waterVal : '';
                        levelArr.push(waterVal);
                        pastArr.push('');
                    }
                    let copy = [...levelArr];
                    copy = copy.filter((a, b) => {
                        return Object.prototype.toString.call(a) === '[object Number]';
                    }).sort((a, b) => {
                        return b - a;
                    });
                    let maxmax = Number((copy[0] + jiange).toFixed(2));
                    let minin = Number((copy[copy.length - 1] - jiange).toFixed(2));
                    this.max = maxmax > warnHigh ? maxmax : warnHigh; // y轴最大值
                    this.min = minin < warnLow ? minin : warnLow;
                } else {
                    pastArr = ['', '', '', '', '', '', '', '', '', ''];
                    futureArr = ['', '', '', '', '', '', '', '', '', ''];
                    levelArr = ['', '', '', '', '', '', '', '', '', ''];
                    this.max = warnHigh;
                    this.min = warnLow;
                }
                if (isNaN(this.max)) this.max = 10.0;
                if (isNaN(this.min)) this.min = 0;
                this.zone = this.warnlevel === '--' ? this.max : this.warnlevel;
                this.initChart(pastArr, futureArr, levelArr);
            }
        },
        ready: function(){
            this.getRainData(this.reservoirid);
        }
    }
</script>

<style scoped lang="less">
.waterRain {
    width: 100%;
    height: auto;
    overflow: hidden;
    position: relative;

    .waterRainLegend {
        height: auto;
        display: block;

        li {
            float: left;
            padding: 10px 0;
            margin-left: 10px;

            span {
                margin-right: 15px;
                position: relative;
            }
            span:before {
                content: "";
                display: inline-block;
                vertical-align: middle;
                width: 9px;
                height: 12px;
                vertical-align: middle;
                margin-right: 3px;
                margin-top: -1px;
                position: relative;
                z-index: 2;
            }
            span.gust:before {
                background: #2F7ED8;
            }
            span.for:before {
                background: #BCBCBC;
            }
            span.ww:before, span.outy:before {
                background: #FFFFFF;
                width: 6px;
                height: 6px;
                margin-right: 8px;
                -webkit-border-radius: 100%;
                -moz-border-radius: 100%;
                border-radius: 100%;
            }
            span.ww:before {
                border: 2px solid #56abe4;
            }
            span.outy:before {
                border: 2px solid red;
            }
            span.ww:after, span.outy:after {
                content: "";
                display: inline-block;
                height: 2px;
                width: 18px;
                position: absolute;
                left: -4px;
                top: 8px;
            }
            span.ww:after {
                background: #56abe4;
            }
            span.outy:after {
                background: red;
            }
        }
    }
    .rain-charts {
        height: 180px;
        margin-bottom: 35px;
        margin-left: 2px;
        margin-right: 0px;
    }
}
.highcharts-xaxis-grid .highcharts-grid-line {
    stroke-width: 1px;
    stroke: #d8d8d8;
}
.highcharts-xaxis .highcharts-tick {
    stroke-width: 2px;
    stroke: #d8d8d8;
}
.highcharts-minor-grid-line {
    stroke-dasharray: 2, 2;
}

/*big*/
.big .poiPop {
    width: 600px;
    top: 45px;
}
.big .waterRainLegend {
    li {
        margin-left: 20px;

        span {
            margin-right: 15px;
        }
        span:before {
            width: 12px;
            height: 16px;
            margin-top: -3px;
        }
        span.ww:before, span.outy:before {
            width: 8px;
            height: 8px;
        }
        span.ww:after, span.outy:after {
            width: 20px;
            top: 13px;
        }
    }
}
.big .rain-charts{
        height:225px;
        margin-bottom:45px;
        margin-left: 2px;
        margin-right:0px;
    }
</style>