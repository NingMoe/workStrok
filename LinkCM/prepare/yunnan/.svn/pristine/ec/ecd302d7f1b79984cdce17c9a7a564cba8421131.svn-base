<template>
    <div></div>
</template>

<script>

    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import { updateParam } from '../../vuex/store'

    export default {
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dateTime: state => state.radar.dateTime,
                checkTime: state => state.radar.checkTime,
                layer: state => state.radar.layer,
                loadArr: state => state.time.loadArr,
                isPlaying: state => state.time.isPlaying,
                opacity: state => state.opacity.value
            },
            actions: { updateParam }
        },
        data() {
            return {
                map: config.getParam('map'),
                WMS: null,
                reqParam: {
                    url: this.dss_sj+'/gd_image/image!loadRadarWMS.action',
                    name: 'ref',
                    opacity: '1',
                    extent: [107.2, 18.17, 119.98, 27.7],
                    params: { dateTime: '', checkTime: '' }
                }
            }
        },
        methods: {
            initWMS: function() {
                this.reqParam.params.dateTime = this.dateTime;
                this.reqParam.params.checkTime = this.checkTime;
                this.WMS = lmap.image.loadImageWMS(this.map, this.reqParam, 'impact');
                this.WMS.setOpacity(this.opacity / 100);
                this.WMS.getSource().on('imageloadend', this.loadEndEvt);
                this.WMS.getSource().on('imageloaderror', this.loadEndEvt);
                this.updateParam('radar', 'layer', this.WMS);
            },
            refreshWMS: function() {
                this.reqParam.params.dateTime = this.dateTime;
                this.reqParam.params.checkTime = this.checkTime;
                lmap.image.updateImageWMS(this.WMS, this.reqParam.params);
            },
            loadEndEvt: function() {
                if (this.isPlaying) {
                    let arr = this.loadArr;
                    arr = arr.replace('radar,', '');
                    arr += 'radar,';
                    this.updateParam('time', 'loadArr', arr);
                }
            }
        },
        watch: {
            dateTime: function() {
                this.refreshWMS();
            }
        },
        ready: function() {
            this.initWMS();
        },
        detached: function() { //销毁时调用
            this.WMS.getSource().un('imageloadend', this.loadEndEvt);
            this.WMS.getSource().un('imageloaderror', this.loadEndEvt);
            this.map.removeLayer(this.WMS);
            this.updateParam('radar', 'layer', null);
        }
    }
</script>

<style></style>