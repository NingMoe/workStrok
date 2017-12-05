<template>
    <div></div>
</template>

<script>

    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import TimeUtil from '../../util/tools/TimeUtil'
    import { updateParam } from '../../vuex/store'

    export default {
        data() {
            return {
                demage: {
                    url: this.dss+'/demage/demage!queryDemageImage.action',
                    name: 'demage',
                    opacity: '1',
                    extent: [109.6, 20, 117.2, 25.5],
                    params: {
                        code: this.code
                    }
                },
                map: config.getParam('map'),
                WMS: null
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                code: state => state.cityCode },
            actions: { updateParam }
        },
        methods: {
            initLayer: function() {
                this.demage.params.code = this.code;
                this.WMS = lmap.image.loadImageWMS(this.map, this.demage, 'poitop');
            },
            // 点击事件
            clickEvt: function(evt) {
                this.updateParam('damageBox', 'lonlat', lmap.controler.getEvtLonLat(evt));
                this.updateParam('damageBox', 'status', true);
            }
        },
        ready: function() {
            this.initLayer();
            this.map.on('singleclick', this.clickEvt);
        },
        detached: function() {
            this.map.removeLayer(this.WMS);
            this.map.un('singleclick', this.clickEvt);
            this.stat = false;
        }
    }
</script>

<style scoped="scoped" lang="less">

</style>