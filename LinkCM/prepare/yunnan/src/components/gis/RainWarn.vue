<template>
    <div></div>
</template>

<script>

	import { updateParam } from '../../vuex/store'
    import config from '../../config'
    import lmap from '../../util/lmap/lmap'

     export default {
        data() {
            return {
                layer: null,
                map: config.getParam('map')
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                cityCode: state => state.cityCode,
                dateTime: state => state.rainwarn.dateTime
            },
            actions: {
                updateParam
            }
        },
        watch: {
            dateTime: function() {
                this.initWMS();
            },
            cityCode: function() {
                this.initWMS();
            }
        },
        methods: {
            initWMS: function() {
                /*if (!!this.layer) {
                    this.map.removeLayer(this.layer);
                    this.updateParam('rainwarnBox', 'showsate', false);
                }*/
                this.clear();

                let qData = { 'dateTime': this.dateTime, 'areaCode': this.cityCode };
                let url = this.dss_sj+'/warn/warn!loadRainWarnGeomgry.action';
                let tempWKT = [];
                let codes = [];
                $.ajaxSettings.async = false;
                $.getJSON(url, qData, (bd) => {
                    bd.forEach((data, index) => {
                        tempWKT.push(data.geom);
                        codes.push(data.code);
                    });
                });
              
                let style = new ol.style.Style({
                    fill: new ol.style.Fill({ color: 'red' }),
                    stroke: new ol.style.Stroke({
                        color: 'black',
                        width: 1
                    })
                });
                for (let i = 0; i < tempWKT.length; i++) {
                    let feature = lmap.polygon.addFeatureFromWkt(this.layer, tempWKT[i], style, 'rainwarn');
                    feature.set('areaCode', codes[i]);
                }
            },
            clear: function(){
                lmap.draw.clear(this.layer, this.map);
                this.updateParam('rainwarnBox', 'showsate', false);
            },
            clickEvt: function(evt) {
                var feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                    return feature;
                });
                if (!!feature && feature.get("name") === 'rainwarn') {
                    this.updateParam('rainwarnBox', 'pix', evt.pixel);
                    this.updateParam('rainwarnBox', 'areaCode', feature.get("areaCode"));
                    this.updateParam('rainwarnBox', 'showsate', true);
                } else {
                    this.updateParam('rainwarnBox', 'showsate', false);
                }
            }
        },
        ready: function() {
            this.layer = lmap.icon.initLayer(this.map, 'impact');
            this.initWMS();
            this.map.on('singleclick', this.clickEvt);
        },
        detached: function() {
            this.map.removeLayer(this.layer);
            this.map.un('singleclick', this.clickEvt);
            delete this.map;
        }
    }
</script>