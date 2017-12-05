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
                dateTime: state => state.cloud.dateTime,
                layer: state => state.cloud.layer,
                loadArr: state => state.time.loadArr,
                isPlaying: state => state.time.isPlaying,
                opacity: state => state.opacity.value
            },
            actions: { updateParam }
        },
        data() {
            return {
                map: config.getParam('map'),
                layer: null,
                cloud: {
                    url: this.dss_sj+'/gd_image/image!loadCloundStatic.action',
                    name: 'gpf',
                    opacity: '1',
                    extent: lmap.SYSTEM_PROJECTION === 'EPSG:4326'? [89.9230999874719, 0.7283, 139.8744499805186, 40.694894995342595] : [89.9999999874719, 0, 139.9513499805186, 39.947494995342595],
                    imageSize: [1028, 898],
                    params: {
                        dateTime: ''
                    }
                }
            }
        },
        methods: {
            initLayer: function() {
                this.cloud.params.dateTime = this.dateTime;
                this.layer = lmap.image.loadImageStatic(this.cloud, 'impact');
                this.map.addLayer(this.layer);
                this.layer.setOpacity(this.opacity / 100);
                this.updateParam('cloud', 'layer', this.layer);
            },
            // 随时间更新云图
            updateLayer: function() {
                this.cloud.params.dateTime = this.dateTime;
                let source = lmap.image.updateImageStatic(this.layer, this.cloud, 'impact');
                source.on('imageloadend', this.loadEndEvt);
                source.on('imageloaderror', this.loadEndEvt);
            },
            loadEndEvt: function() {
                if (this.isPlaying) {
                    let arr = this.loadArr;
                    arr = arr.replace('cloud,', '');
                    arr += 'cloud,';
                    this.updateParam('time', 'loadArr', arr);
                }
            }
        },
        watch: {
            dateTime: function() {
                this.updateLayer();
            }
        },
        ready: function() {
            this.initLayer();
        },
        detached: function() { //销毁时调用
            this.map.removeLayer(this.layer);
            this.updateParam('cloud', 'layer', null);
            this.layer.getSource().un('imageloadend', this.loadEndEvt);
            this.layer.getSource().un('imageloaderror', this.loadEndEvt);
        }
    }
</script>

<style></style>