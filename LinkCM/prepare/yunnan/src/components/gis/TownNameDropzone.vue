<!--显示镇名图层-->
<template>
    <div></div>
</template>

<script>
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import { updateParam, updateValue } from '../../vuex/store'

    export default {
        data() {
            return {
                townName: {
                    url: this.dss_sj+'/gdmodel/model!showTownNameDropzone.action',
                    name: 'townname',
                    opacity: '1',
                    extent: [109.6, 20, 117.2, 25.5],
                    params: { fontSize: '14', fontStreet: false, areaCode: '440000', ids: '',highlight:true }
                },
                map: config.getParam('map'),
                WMS: undefined
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                allTypes: state => state.townNameDropzone.status,
                fontSize: state => state.townNameDropzone.fontSize,
                fontStreet: state => state.townNameDropzone.fontStreet,
                geoIds: state => state.dropzone.geoIds,
                code: state => state.cityCode,
                highlight: state => state.townNameDropzone.highlight
            },
            actions: {
                updateParam, updateValue
            }
        },
        watch: {
            fontSize: function() {
                this.townName.params.fontSize = this.fontSize;
                this.refreshTown();
            },
            fontStreet: function() {
                this.townName.params.fontStreet = this.fontStreet;
                this.refreshTown();
            },
            cacheId: function() {
                this.townName.params.ids = this.geoIds;
                this.refreshTown();
            },
            highlight: function(){
                this.townName.params.highlight = this.highlight;
                this.refreshTown();
            }
        },
        methods: {
            initTown: function() {
                let data = this.townName.params;
                data.ids = this.geoIds;
                data.fontSize = this.fontSize;
                data.fontStreet = this.fontStreet;
                data.areaCode = this.code;
                data.highlight = this.highlight;
                this.townName.params = data;
                this.WMS = lmap.image.loadImageWMS(this.map, this.townName, 'drawImpact');
                this.updateParam('townNameDropzone', 'layer', this.WMS);
            },
            refreshTown: function() {
                lmap.image.updateImageWMS(this.layer, this.townName.params);
            }
        },
        ready: function() {
            this.initTown();
        },
        detached: function() { // 销毁时调用
            this.map.removeLayer(this.WMS);
            this.updateValue('townNameDropzone', { fontSize: '14', fontStreet: false });
        }
    }
</script>

<style></style>