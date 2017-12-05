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
                    model: 'waterLogging',
                    currModel: 'past12',
                    currName: '过去12小时',
                    currIndex: 1,
                    baseItems: [
                        {dateTime:'-24',code:'past24',name:'过去24小时'},
                        {dateTime:'-12',code:'past12',name:'过去12小时'},
                        {dateTime:'-6',code:'past6',name:'过去6小时'},
                        {dateTime:'now',code:'past0',name:'当前时刻'},
                        {dateTime:'+1',code:'future1',name:'未来1小时'},
                        {dateTime:'+2',code:'future2',name:'未来2小时'},
                        {dateTime:'+3',code:'future3',name:'未来3小时'}
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