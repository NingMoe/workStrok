<template>
    <div></div>
</template>

<script>
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import { updateParam } from '../../vuex/store'

    export default {
        data() {
            return {
                layer: null,
                call: null,
                map: config.getParam('map'),
                layer: undefined
            }
        },
        vuex: {
            getters: {
                code: state => state.cityCode,
                out: state => state.areaPolygon.out
            }
        },
        watch: {
            // 系统区域编码改变时更新图层
            code: function() {
                this.initLayer();
            },
            // 遮罩功能
            out: function() {
                if (this.out) {
                    this.initLayer('out');
                } else {
                    this.initLayer();
                }
            }
        },
        methods: {
            // 生成区域边界图层
            initLayer: function(out) {
                this.clearLayer();
                let type = 'json';
                if (this.code === '44' && !!out == false) type = 'wkt';
                let layer;
                if (!!out) layer = lmap.selectArea(this.map, this.code, type, 'out');
                else layer = lmap.selectArea(this.map, this.code, type);
                this.layer = layer;
            },
            // 清除图层
            clearLayer: function() {
                if (!!this.layer) {
                    this.map.removeLayer(this.layer);
                    this.layer = undefined;
                }
            }
        },
        ready: function() {
            let call = setInterval(() => {
                if (!!this.map) {
                    this.initLayer();
                    clearInterval(call);
                }
            }, 50);
            this.call = call;
        },
        detached: function() {
            if (!!this.layer) {
                this.map.removeLayer(this.layer);
                this.layer = undefined;
            }
            if (!!this.call) clearInterval(this.call);
            this.call = null;
        }
    }
</script>

<style></style>