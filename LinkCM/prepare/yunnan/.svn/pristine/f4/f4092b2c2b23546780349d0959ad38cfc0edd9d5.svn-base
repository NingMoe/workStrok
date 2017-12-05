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
                    model: 'gale',
                    currModel: 'futureGaleInstant24',
                    currName: '过去1小时瞬时风(格点)',
                    currIndex: 2,
                    baseItems: [
                        { dateTime: '-24', code: 'galeInstant24', name: '过去24小时瞬时风(格点)', both: true, timeName: '过去24小时', type: 'instant' },
                        { dateTime: '-1', code: 'galeInstant', name: '过去1小时瞬时风(格点)', both: true, timeName: '过去1小时', type: 'instant' },
                        { dateTime: '+24', code: 'futureGaleInstant24', name: '未来24小时瞬时风(格点)', both: true, timeName: '未来24小时', type: 'instant' },
                        { dateTime: '+48', code: 'futureGaleInstant48', name: '未来48小时瞬时风(格点)', both: true, timeName: '未来48小时', type: 'instant' },
                        { dateTime: '+72', code: 'w10m_072', name: '未来72小时平均风(落区)', type: 'dropzone' }
                    ], 
                    childModel: {
                        galeInstant24: {
                            galeInstant24: { name: '瞬时风(格点)', type: 'instant' },
                            galeAverage24: { name: '平均风(格点)', type: 'average' }
                        },
                        galeInstant: {
                            galeInstant: { name: '瞬时风(格点)', type: 'instant' },
                            galeAverage: { name: '平均风(格点)', type: 'average' }
                        },
                        futureGaleInstant24: {
                            futureGaleInstant24: { name: '瞬时风(格点)', type: 'instant' },
                            futureGaleAverage24: { name: '平均风(格点)', type: 'average' },
                            w10m_024: { name: '平均风(落区)', type: 'dropzone' }
                        },
                        futureGaleInstant48: {
                            futureGaleInstant48: { name: '瞬时风(格点)', type: 'instant' },
                            futureGaleAverage48: { name: '平均风(格点)', type: 'average' },
                            w10m_048: { name: '平均风(落区)', type: 'dropzone' }
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