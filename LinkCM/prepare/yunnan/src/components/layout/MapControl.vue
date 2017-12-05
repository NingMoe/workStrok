<template>
    <div class="map_control">
        <ul>
            <li @click="zoomIn()" class="mapBig"><a download="map.png" v-el:export-map><a></li>
            <li @click="reset()" class="mapReset"></li>
            <li @click="zoomOut()" class="mapSmall"></li>
        </ul>
    </div>
</template>

<script>
    import config from '../../config'
    import lmap from '../../util/lmap/lmap'
    
    export default {
        data () {
            return {
                
            }  
        },
        methods: {
            zoomIn: function() {
                var map = config.getParam('map');
                lmap.controler.zoomIn(map);
            },
            zoomOut: function() {
                var map = config.getParam('map');
                lmap.controler.zoomOut(map);
            },
            reset: function() {
                var map = config.getParam('map');
                let [lon, lat] = lmap.cityCenter.split(',');
                let zoom = lmap.zoom;
                if (typeof(lon) == 'string') {
                    lon = parseFloat(lon);
                }
                if (typeof(lat) == 'string') {
                    lat = parseFloat(lat);
                }
                lmap.controler.panTo(map, lon, lat, zoom);
            }
        }
    }
</script>

<style scoped lang='less'>
.map_control { 
    position: absolute;
    right: 0px;
    top: 300px;

    ul li {
        border: 1px solid #ccc;
        margin-top: 1px;
        width: 24px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        cursor: pointer;
        background: #fff url("../../assets/img/common/icon.png") no-repeat;
    }
}
.mapBig {
    background-position: -55px 4px !important;
}
.mapReset {
    background-position: -28px 4px !important;
}
.mapSmall {
    background-position: -1px 4px !important;
}
 
</style>