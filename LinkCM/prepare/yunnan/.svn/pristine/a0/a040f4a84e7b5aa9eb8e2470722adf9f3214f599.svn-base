<template>
    <div id="video-frame">
        <iframe :src="dss+'/video.html?mrl='+mrl" class="video-frame" scrolling="no" allowtransparency="true"></iframe>
    </div>
</template>

<script>
    export default {
        props: ['mrl'],
        detached: function(){
        	let frame = document.getElementById('video-frame');
        	if (frame) {
				let vlc = frame.contentWindow.document.getElementById('VLC');
	            vlc.playlist.stop();
	            vlc.playlist.clear();
        	}
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss
            }
        }
    }
</script>

<style scoped lang="less">
.video-frame{
    border: medium none; width: 700px; height: 432px
}
</style>    