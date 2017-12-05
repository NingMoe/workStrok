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
                    model: 'temp',
                    currModel: 'futureMaxTemperature24',
                    currName: '过去24小时高温(格点)',
                    currIndex: 1,
                    baseItems: [
                        {dateTime: '-24', code: 'pastMaxTemperature24', name: '过去24小时高温(格点)', both: true, timeName: '过去24小时', type: 'max' },
                        {dateTime: '+24', code: 'futureMaxTemperature24', name: '未来24小时高温(格点)', both: true, timeName: '未来24小时', type: 'max' },
                        {dateTime: '+48', code: 'futureMaxTemperature48', name: '未来48小时高温(格点)', both: true, timeName: '未来48小时', type: 'max' },
                        {dateTime: '+72', code: 'futureMaxTemperature72', name: '未来72小时高温(格点)', both: true, timeName: '未来72小时', type: 'max' }
                    ],

                    childModel: {
                        pastMaxTemperature24: {
                            pastMaxTemperature24: { name: '高温(格点)', type: 'max' },
                            pastMinTemperature24: { name: '低温(格点)', type: 'min' }
                        },
                        futureMaxTemperature24: {
                            futureMaxTemperature24: { name: '高温(格点)', type: 'max' },
                            tmax_024: { name: '高温(>35℃落区)', type: 'minD' },
                            futureMinTemperature24: { name: '低温(格点)', type: 'min' },
                            tmin_024: { name: '低温(≤5℃落区)', type: 'maxD' }
                        },
                        futureMaxTemperature48: {
                            futureMaxTemperature48: { name: '高温(格点)', type: 'max' },
                            tmin_048: { name: '高温(>35℃落区)', type: 'minD' },
                            futureMinTemperature48: { name: '低温(格点)', type: 'min' },
                            tmax_048: { name: '低温(≤5℃落区)', type: 'maxD' }
                        },
                        futureMaxTemperature72: {
                            futureMaxTemperature72: { name: '高温(格点)', type: 'max' }, 
                            tmin_072: { name: '高温(>35℃落区)', type: 'minD' },
                            futureMinTemperature72: { name: '低温(格点)', type: 'min' },
                            tmax_072: { name: '低温(≤5℃落区)', type: 'maxD' }
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