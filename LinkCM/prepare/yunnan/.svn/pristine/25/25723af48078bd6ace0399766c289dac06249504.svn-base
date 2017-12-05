<template>
    <div class="cases-panel" v-el:case-win>
        <a class="close" @click="close"></a>
        <div class="title" v-el:case-title>{{filetitle}}</div>
        <div id="caseView" class="flexpaper_viewer"></div>
    </div>
</template>


<script>
    import { updateParam } from '../../../vuex/store'
    import config from '../../../config'
    import WinDrag from '../../../util/tools/WinDrag'
    import '../../../util/flexpaper/flexpaper'

    export default {
        props: ['filename', 'filetitle'],
        watch: {
            filename: function(){
                this.show();
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss
            },
            actions: { updateParam }
        },
        methods: {
            close: function(){
                this.$parent.hasCase = false;
            },
            show: function() {
                var fp = $('#caseView').FlexPaperViewer({
                    config: {  
                        SwfFile: 'http://10.148.16.56/topic/little/swfFilePath/'+this.filename,  
                        Scale: 0.6,  
                        ZoomTransition: 'easeOut',  
                        ZoomTime: 0.5,  
                        ZoomInterval: 0.2,  
                        FitPageOnLoad: true,  
                        FitWidthOnLoad: true,  
                        FullScreenAsMaxWindow: true,  
                        ProgressiveLoading: true,  
                        MinZoomSize: 0.2,  
                        MaxZoomSize: 5,  
                        SearchMatchAll: false,  
                        InitViewMode: 'Portrait',  
                        ViewModeToolsVisible: true,  
                        ZoomToolsVisible: true,  
                        NavToolsVisible: true,  
                        CursorToolsVisible: true,  
                        SearchToolsVisible: true,  
                        localeChain: 'zh_CN',  
                        FullScreenAsMaxWindow:false,
                        jsDirectory: this.dss+'/swfFilePath/plugin/'
                    }}  
                );
                    
            },
            addWinDragEvt: function(elName, contentName) {
                var map = config.getParam('map');
                let call = setInterval(() => {
                    let winObj = this.$els[elName];
                    let contentObj = this.$els[contentName];
                    if (!!winObj) WinDrag.drag(winObj, contentObj, map);
                    clearInterval(call);
                }, 10);
            }
        },
        ready: function() {
            this.show();
            this.addWinDragEvt('caseTitle', 'caseWin');
        }
    }
</script>
 

<style scoped lang='less'>
@import "../../../assets/css/common.less";

.flexpaper_viewer {
    height: 480px;
    width: 720px;
}
.cases-panel {
    margin: 0 auto;
    position: absolute;
    top: 30px;
    left: 25%;
    overflow: hidden;
    background: #fff;
    z-index: 4;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);

    .close {
        position: absolute;
        right: 0;
        top: 0;
        height: 20px;
        width: 20px;
        background: url("../../../assets/img/toolsbar/rightIcon.png") no-repeat;
        background-position: -153px -60px!important;
        display: inline-block;
        zoom: 1;
        cursor: pointer;
    }

    .title {
        height: 26px;
        line-height: 26px;
        border-bottom: 1px solid #ccc;
        div {
            font-size: 24px;
            margin-top: 5px;
            color: @color;
        }
        span {
            margin-right: 10px;
            font-size: 12px;
        }
    }
    .cases-box {
        height: auto;
        overflow-y: auto;
        background: #fff;
        padding: 10px;
    }
}
</style>