<!--地图经纬线网格-->
<template>
    <div></div>
</template>

<script>
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'

    export default {
        data() {
            return {
                grat: null//组件记录
            }
        },
        methods: {
            /**初始化网格图层 */
            initLayer: function(){
                let map = config.getParam('map');
                this.grat = lmap.controler.addGraticule(map);
            }
        },
        compiled: function(){
            this.initLayer();
        },
        detached: function(){
            lmap.controler.removeGraticule(this.grat);
            this.grat = null;
        }
    }
</script>

<style></style>