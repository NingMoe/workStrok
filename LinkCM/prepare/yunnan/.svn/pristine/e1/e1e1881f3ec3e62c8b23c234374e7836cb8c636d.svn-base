<template>
    <div></div>
</template>

<script>

    import { updateParam } from '../../vuex/store'
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import TimeUtil from '../../util/tools/TimeUtil'

    export default {
        data() {
            return {
                map: config.getParam('map')
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                code: state => state.cityCode,
                areaName: state => state.areaName,
                dateTime: state => state.site.dateTime,
                feature: state => state.siteBox.feature,
                style: state => state.siteBox.style,
                isPlaying: state => state.time.isPlaying,
                loadArr: state => state.time.loadArr,
                elements: state => state.site.elements
            },
            actions: { updateParam }
        },
        watch: {
            dateTime: function() {
                this.refreshWMS();
            },
            code: function() {
                this.refreshWMS();
            },
            elements: function() {
                this.refreshWMS();
            }
        },
        methods: {
            getReqParam: function(){
                return {
                    'DATETIME': TimeUtil.format(this.dateTime, 'yyyy-MM-dd HH:mm:ss'),
                    'STARTTIME': TimeUtil.format(this.$parent.startTime, 'yyyyMMddHHmmss'),
                    'ENDTIME': TimeUtil.format(this.$parent.endTime, 'yyyyMMddHHmmss'),
                    'QSELECTTIME': '0',
                    'RAINRANGESTART': this.$parent.rainMin + '',
                    'RAINRANGEEND': this.$parent.rainMax + '',
                    'SITETYPE': 'gj,qy,sw',
                    'ELEMENT': this.$parent.elements.join(';'),
                    'AREACODE': this.code
                }
            },
            refreshWMS: function() {
                lmap.image.updateImageWMS(this.WMS, this.getReqParam());
            },
            initWMS: function() {
                let reqParam = this.getReqParam();
                let imageParam = { 'opacity': 1, 'url': this.dss+'/site/site!loadSiteWMS.action', 'name': 'sitePoint', 'params': reqParam };
                this.WMS = lmap.image.loadImageWMS(this.map, imageParam, 'poi');
                this.WMS.getSource().on('imageloadend', this.loadEndEvt);
                this.map.on('singleclick', this.clickEvt);
            },
            loadEndEvt: function() {
                let random = Math.random();
                this.updateParam('site', 'siteFlag', random);
                if (this.isPlaying) {
                    let arr = this.loadArr;
                    arr = arr.replace('site,', '');
                    arr += 'site,';
                    this.updateParam('time', 'loadArr', arr);
                }
            },
            clickEvt: function(evt) {
                let lonlat = lmap.controler.getEvtLonLat(evt);
                this.updateParam('siteBox', 'lon', lonlat[0]);
                this.updateParam('siteBox', 'lat', lonlat[1]);
                this.updateParam('siteBox', 'siteId', '');
                if (this.feature && this.style) {
                    lmap.icon.setStyle(this.feature, this.style);
                }
            }
        },
        ready: function() {
            this.initWMS();
        },
        detached: function() {
            this.map.removeLayer(this.WMS);
            this.WMS.getSource().un('imageloadend', this.loadEndEvt);
            this.map.un('singleclick', this.clickEvt);
            this.updateParam('site', 'data', '');
            delete this.WMS;
            delete this.map;
        }
    }
</script>

<style scoped>

</style>