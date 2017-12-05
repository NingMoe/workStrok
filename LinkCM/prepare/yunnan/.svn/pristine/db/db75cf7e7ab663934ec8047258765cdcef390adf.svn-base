<template>
    <div class="grid-rain-panel poiPop" v-if="hasRainData">
        <div class="title">雨量统计：{{item.address}}({{item.lonlat}})</div>
        <a class="Close" @click="close()"></a>
        <v-rain-charts :lonlat="lonlat" :cid="cid"></v-rain-charts>
    </div>
</template>

<script>
    import lmap from '../../../util/lmap/lmap'
    import config from '../../../config'
    import TimeUtil from '../../../util/tools/TimeUtil'
    import RainCharts from './RainCharts'
    import { updateParam } from '../../../vuex/store'

    export default {
        components: { 'v-rain-charts': RainCharts },
        data() {
            return {
                map: config.getParam('map'),
                layer: undefined,
                item: {
                    'address': '',
                    'lonlat': ''
                },
                hasRainData: false,
                cid: 'rain-charts',
                lonlat: [],
            }
        },
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
        methods: {
            close: function() {
                lmap.icon.clear(this.layer);
                this.hasRainData = false;
                this.updateParam('gridRain', 'status', false);
                this.$parent.list.gridRain.stat = false;
            },
            getAddress: function(lonlat) {
                let that = this;
                let reqParam = {
                    'type': 'village',
                    'lonlat': lonlat.join(' ')
                };
                $.ajax({
                    url: this.dss+'/topicRead/topic-read!getLocation.action',
                    dataType: 'json',
                    type: 'GET',
                    data: reqParam,
                    success: function(json) {
                        that.dot(lonlat, json[0].fullName);
                        that.item.address = json[0].fullName;
                        let lon = Number(lonlat[0]).toFixed(2);
                        let lat = Number(lonlat[1]).toFixed(2);
                        that.item.lonlat = lon + ', ' + lat;
                    }
                });
            },
            dot: function(lonlat, address) {
                lmap.icon.clear(this.layer);
                let style = {
                    anchor: [25, 0],
                    iconUrl: 'http://10.148.16.56/topic/little/poi/rain.png',
                    iconSize: [50, 50],
                    scale: 0.5,
                    fontColor: 'red',
                    fontSize: '12px',
                    outColor: 'white',
                    outWidth: 3,
                    offsetY: 5,
                    text: address,
                };
                lmap.icon.addIcon(this.layer, style, Number(lonlat[0]), Number(lonlat[1]));
            },
            clickEvt: function(evt) {
                let lonlat = lmap.controler.getEvtLonLat(evt);
                this.hasRainData = true;
                this.getAddress(lonlat);
                this.lonlat = lonlat;
            }
        },
        ready: function() {
            this.layer = lmap.icon.initLayer(this.map, 'point');
            this.map.on('singleclick', this.clickEvt);
        },
        detached: function() {
            this.map.un('singleclick', this.clickEvt);
            this.map.removeLayer(this.layer);
            delete this.map;
            delete this.layer;
            delete this.clickEvt;
        }
    }
</script>

<style scoped lang="less">
.poiPop {
    width: 427px;
    height: auto;
    position: absolute;
    z-index: 3;
    right: 0;
    top: 30px;
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
    background: url("../../../assets/img/toolsbar/rightIcon.png") no-repeat;
    background-position: -153px -60px !important;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
}
.rain-charts {
    height: 250px;
}

/*big*/
.big .poiPop {
    width: 600px;
    top: 45px;
}
</style>