<template>
    <div></div>
</template>

<script>
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import TimeUtil from '../../util/tools/TimeUtil'

    export default {
        data() {
            return {
                map: config.getParam('map'),
                WMS: undefined,
                hideWMS: false,
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                code: state => state.cityCode,
                areaName: state => state.areaName,
                dateTime: state => state.site.dateTime
            },
        },
        watch: {
            dateTime: function() {
                this.rerefreshWMS();
            },
            code: function() {
                this.rerefreshWMS();
            }
        },
        methods: {
            selectElement: function() {
                this.rerefreshWMS();
            },
            rerefreshWMS: function() {
                let code = this.code;
                let citeName = '';
                let countryName = '';
                if (code.length === 4) {
                    citeName = this.areaName;
                } else if (code.length === 6) {
                    countryName = this.areaName;
                }
                let reqParam = { 'DATETIME': TimeUtil.format(this.dateTime, 'yyyyMMddHH'), 'SITETYPE': 'gj,qy,sw', 'AREACODE': this.code, 'CITYNAME': citeName, 'COUNTRYNAME': countryName };
                lmap.image.updateImageWMS(this.WMS, reqParam);
            },
            initWMS: function() {
                let code = this.code;
                let citeName = '';
                let countryName = '';
                if (code.length === 4) {
                    citeName = this.areaName;
                } else if (code.length === 6) {
                    countryName = this.areaName;
                }
                let reqParam = { 'DATETIME': TimeUtil.format(this.dateTime, 'yyyyMMddHH'), 'SITETYPE': 'gj,qy,sw', 'AREACODE': this.code, 'CITYNAME': citeName, 'COUNTRYNAME': countryName };
                this.reqParam = reqParam;
                let imageParam = { 'opacity': 1, 'url': this.dss+'/site/site!loadSiteWarnWMS.action', 'name': 'siteWarn', 'params': reqParam };
                this.WMS = lmap.image.loadImageWMS(this.map, imageParam, 'poitop');
                this.refreshWMS();
            },
            refreshWMS: function() {
                this.refreshTimer = window.setInterval(() => {
                    this.WMS.setVisible(this.hideWMS);
                    this.hideWMS = !this.hideWMS;
                }, 500);
            }
        },
        ready: function() {
            this.initWMS();
        },
        detached: function() {
            this.map.removeLayer(this.WMS);
            window.clearInterval(this.refreshTimer);
            delete this.WMS;
            delete this.map;
        }
    }
</script>

<style>
</style>