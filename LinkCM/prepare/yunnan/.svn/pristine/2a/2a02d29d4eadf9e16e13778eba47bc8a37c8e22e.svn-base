<template>
    <div>
    </div>
</template>

<script>

    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import { updateParam } from '../../vuex/store'
    import TimeUtil from '../../util/tools/TimeUtil'

    export default {
        data() {
            return {
                WMS: undefined,
                map: config.getParam('map'),
                poi: {
                    url: this.dss+'/gd_image/image!loadPoiWMS.action',
                    name: 'poi',
                    opacity: '1',
                    extent: [109.6, 20, 117.2, 25.5],
                    params: {
                        dateTime: '',
                        type: 'poi_RESERVOIR,poi_GDSYJB_SHUIKU,poi_KEYPLACE_IMPORTANT',
                        code: '44',
                        status: 'province',
                        poiType: '',
                        mapType: '',
                        poiPolygon: '',
                        random: '',
                        model: '',
                        cacheId: ''
                    }
                },
            }
        },
        vuex: {
            getters: {
                dss: state => state.dss,
                allTypes: state => state.poi.allTypes,
                layer: state => state.poi.layer,
                cityCode: state => state.cityCode,
                cacheId: state => state.model.cacheId,
                minBase: state => state.poi.minBase,
                minTypes: state => state.poi.minTypes,
                unClick: state => state.poi.unClick,
                sysTime: state => state.time.sysTime
            },
            actions: { updateParam }
        },
        methods: {
            close: function(type) {
                this[type].stat = false;
            },
            initLayer: function() {
                let tempAllTypes = this.allTypes.replace('poi_demage_demage,', '');
                this.poi.params.type = tempAllTypes;
                this.poi.params.code = this.cityCode;
                this.poi.params.cacheId = '';
                this.poi.params.random = Math.random();
                this.poi.params.dateTime = TimeUtil.format(this.sysTime, 'yyyyMMddHH');
                if (this.minBase != '') {
                    this.poi.params.cacheId = this.cacheId;
                    this.poi.params.type = this.minTypes;
                    this.poi.params.model = this.minBase;
                }
                if (this.minBase !== 'dropzone') {
                    this.WMS = lmap.image.loadImageWMS(this.map, this.poi, 'poi');
                    this.updateParam('poi', 'layer', this.WMS);
                }
            },
            // 地图点击事件
            clickPoi: function(evt) {
                if (!this.unClick) this.updateParam('poiBox', 'lonlat', lmap.controler.getEvtLonLat(evt));
            }
        },
        watch: {
            allTypes: function() {
                if (this.minBase !== 'dropzone') {
                    let tempAllTypes = this.allTypes.replace('poi_demage_demage,', '');
                    this.poi.params.type = tempAllTypes;
                    this.poi.params.dateTime = TimeUtil.format(new Date(), 'yyyyMMddHH');
                    this.poi.params.random = Math.random();
                    lmap.image.updateImageWMS(this.layer, this.poi.params);
                }
            },
            'minBase': function(minBase) {
                if (minBase !== 'dropzone') {
                    this.poi.params.cacheId = this.cacheId;
                    this.poi.params.type = this.minTypes;
                    this.poi.params.code = this.cityCode;
                    this.poi.params.model = this.minBase;
                    this.poi.params.dateTime = TimeUtil.format(new Date(), 'yyyyMMddHH');
                    this.poi.params.random = Math.random();
                    lmap.image.updateImageWMS(this.layer, this.poi.params);
                }
            },
            'minTypes': function() {
                this.poi.params.type = this.minTypes;
                this.poi.params.model = this.minBase;
                this.poi.params.dateTime = TimeUtil.format(new Date(), 'yyyyMMddHH');
                this.poi.params.random = Math.random();
                lmap.image.updateImageWMS(this.layer, this.poi.params);
            },
            'cityCode': function() {
                this.poi.params.code = this.cityCode;
                this.poi.params.random = Math.random();
                lmap.image.updateImageWMS(this.layer, this.poi.params);
            },
            'sysTime': function() {
                this.poi.params.dateTime = TimeUtil.format(this.sysTime, 'yyyyMMddHH');
                lmap.image.updateImageWMS(this.layer, this.poi.params);
            }
        },
        ready: function() {
            this.initLayer();
            this.map.on('singleclick', this.clickPoi);
        },
        detached: function() { // 销毁时调用
            this.map.removeLayer(this.layer);
            this.map.un('singleclick', this.clickPoi);
        }
    }
</script>

<style></style>