<template>
   <div></div>
</template>

<script>
    
    import { updateParam } from '../../vuex/store'
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import TimeUtil from '../../util/tools/TimeUtil'

    export default {
        data () {
            return {
                map: config.getParam('map'),
                WMS: undefined
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                dateTime: state => state.thunder.dateTime,
                loadArr: state => state.time.loadArr,
                isPlaying: state => state.time.isPlaying
            },
            actions: { updateParam } 
        },
        watch: {
            dateTime: function(){
                this.refreshWMS();
            }
        },
        methods: {
            refreshWMS: function(){
                let timeStr = TimeUtil.format(this.dateTime, 'yyyyMMddHHmmss');
                let reqData = { 'REQUESTTIME': timeStr };
                lmap.image.updateImageWMS(this.WMS, reqData);
            },
            loadEndEvt: function(){
                if (this.isPlaying) {
                    let arr = this.loadArr;
                    arr = arr.replace('thunder,', '');
                    arr += 'thunder,';
                    this.updateParam('time', 'loadArr', arr);
                }
            },
            initWMS: function(){
                let timeStr = TimeUtil.format(this.dateTime, 'yyyyMMddHHmmss');
                let imageParam = {
                    'opacity': 1,
                    'url': this.dss+'/gd_image/image!loadThunderWMS.action',
                    'name': 'thunder',
                    'params': { 'REQUESTTIME': timeStr }
                }
                this.WMS = lmap.image.loadImageWMS(this.map, imageParam, lmap.getIndex('impact'));
                this.WMS.getSource().on('imageloadend', this.loadEndEvt);
            }
        },
        ready: function(){
            this.initWMS();
        },
        detached: function(){
            this.map.removeLayer(this.WMS);
            this.WMS.getSource().un('imageloadend', this.loadEndEvt);
            delete this.WMS;
            delete this.map;
        }
    }
</script>

<style scoped>
</style>