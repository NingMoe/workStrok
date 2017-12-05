<template>
    <div class="modelPop">
    	<v-scaleslider :slider="slider"></v-scaleslider>
    </div>
</template>

<script>
	import ScaleSlider from '../../common/ScaleSlider'
    export default {
        components: { 'v-scaleslider': ScaleSlider },
        data() {
            return {
                slider: {
                    model: 'mountainTorrents',
                    currModel: 'mountainTorrents',
                    currName: '当前时刻',
                    currIndex: 0,
                    baseItems: [
                        {dateTime:'now',code:'mountainTorrents',name:'当前时刻'},
                        {dateTime:'+1',code:'mountainTorrents1',name:'未来1小时'},
                        {dateTime:'+2',code:'mountainTorrents2',name:'未来2小时'},
                        {dateTime:'+3',code:'mountainTorrents3',name:'未来3小时'}
                    ]
                }
            }
        }
    }
</script>

<style scoped lang="less">
@import "../../../assets/css/common.less";
.modelPop{
    width:266px;
    padding: 5px;
    height:auto;
    clear: both;
    position: absolute;
    z-index:4;
    left: 0;
    top: 65px;
    background:#fff;
    -webkit-box-shadow:0 1px 4px 0 rgba(0, 0, 0, 0.3);
    box-shadow:0 1px 4px 0 rgba(0, 0, 0, 0.3);
}
.big .modelPop{
	width: 374px;
    top: 97px;
}
</style>