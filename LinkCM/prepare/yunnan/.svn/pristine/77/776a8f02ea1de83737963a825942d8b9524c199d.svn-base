<template>
    <div></div>
</template>

<script>
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
	
    export default {
        data() {
            return {
                layer: undefined,
                map: config.getParam('map')
            }
        },
        methods: {
            initLayer: function(){
                let imageParam = {
                    url: 'http://10.148.16.56/topic/flood.png',
                    name: 'mountainTorrents',
                    opacity: 1,
                    extent: [106.89, 14.72, 121.11, 25.98],
                    params: {  }
                };
                this.layer = lmap.image.loadImageStatic(imageParam, 'model');    
                this.map.addLayer(this.layer);
            }
        },
        ready: function(){
            this.initLayer();
        },
        detached: function(){
            this.map.removeLayer(this.layer);
        }
    }
</script>

<style></style>