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
                    model: 'heavyRainfall',
                    currModel: 'heavyRainfall',
                    currName: '格点',
                    currIndex: 7,
                    baseItems: [
                        { dateTime: '-24', code: 'heavyRainfall24', name: '过去24小时', type: 'grid' },
                        { dateTime: '-3', code: 'heavyRainfall3', name: '过去3小时', type: 'grid' },
                        { dateTime: '-1', code: 'heavyRainfall', name: '过去1小时', type: 'grid' },
                        { dateTime: '+1', code: 'heavyRainfall_qpf', name: '格点', type: 'grid' },
                        { dateTime: '+3', code: 'heavyRainfall3_qpf', name: '格点', type: 'grid' },
                        { dateTime: '+6', code: 'heavyRainfall6_2d', name: '格点', type: 'grid' },
                        { dateTime: '+12', code: 'heavyRainfall12_2d', name: '格点', type: 'grid' },
                        { dateTime: '+24', code: 'heavyRainfall24_2d', name: '格点', both: true, type: 'grid', timeName: '未来24小时' },
                        { dateTime: '+48', code: 'heavyRainfall48_2d', name: '格点', both: true, type: 'grid', timeName: '未来48小时' },
                        { dateTime: '+72', code: 'heavyRainfall72lj_2d', name: '格点72小时累计', both: true, type: 'sum', timeName: '未来72小时' }
                    ],
                    childModel: {
                        heavyRainfall24_2d: {
                            heavyRainfall24_2d: { name: '格点', type: 'grid' },
                            r24h_024: { name: '落区(≥25mm)', type: 'dropzone' }
                        },
                        heavyRainfall48_2d: {
                            heavyRainfall48_2d: { name: '格点', type: 'grid' },
                            r24h_048: { name: '落区(≥25mm)', type: 'dropzone' },
                            heavyRainfall48lj_2d: { name: '格点累计', type: 'sum' }
                        },
                        heavyRainfall72lj_2d: {
                            heavyRainfall72lj_2d: { name: '格点累计', type: 'sum' },
                            r24h_072: { name: '落区(≥25mm)', type: 'dropzone' },
                        }
                    }
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