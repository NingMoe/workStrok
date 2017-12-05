 <template>
        <div class="site-min-panel poiPop popTab popTaBorder" :style="getPosition" v-show="showState" v-el:rainwarn-box>
            <div class="title" v-el:rain-title>{{townName}}</div>
            <div class="site-min-ui">
                <div class="title nullbg">
                    <span>站点号：{{siteCode}}</span><span>&nbsp;&nbsp;&nbsp;&nbsp;更新：{{time}}</span>
                </div>
                <div class="info">
                    <span>累计雨量</span>
                    <table cellpadding="0" cellspacing="0">
                        <tr><td>过去1小时</td><td>过去3小时</td><td>过去24小时</td></tr>
                        <tr><td>{{warnData.last1}}mm<span v-if="overState.last1">(超{{overData.last1}}mm)</span></td><td>{{warnData.last3}}mm<span v-if="overState.last3">(超{{overData.last3}}mm)</span></td><td>{{warnData.last24}}mm<span v-if="overState.last24">(超{{overData.last24}}mm)</span></td></tr>
                    </table>
                </div>
            </div>
    </div>
</template>


<script>
    import { updateParam } from '../../vuex/store'
    import TimeUtil from 'util/tools/TimeUtil'
    import config from '../../config'
    import WinDrag from 'util/tools/WinDrag'

     export default {
        data() {
            return {
                townName: '',
                time: '',
                warnData: {
                    last1: '--',
                    last3: '--',
                    last24: '--'
                },
                overData:{
                    last1: '',
                    last3: '',
                    last24: ''
                },
                siteCode: '',
                showState: false,
                overState:{
                    last1: false,
                    last3: false,
                    last24: false
                }
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                areaCode: state => state.rainwarnBox.areaCode,
                dateTime: state => state.rainwarn.dateTime,
                pix: state => state.rainwarnBox.pix,
                showsate: state => state.rainwarnBox.showsate
            },
            actions: {
                updateParam
            }
        },
        watch: {
           /* pix: function() {
                this.showState = false;
               
                 this.showState = true;
            },*/
            showsate: function(){
                this.showState = this.showsate;
                if(this.showState)
                    this.getWarnList(this.areaCode);
                this.addWinDragEvt('rainTitle','rainwarnBox');
            },
            areaCode: function(){
                this.warnData={
                    last1: '--',
                    last3: '--',
                    last24: '--'
                },
                this.overState={
                    last1: false,
                    last3: false,
                    last24: false
                }
                this.getWarnList(this.areaCode);
            }
        },
        computed: {
            /**改变窗口位置 */
            getPosition: function(){
                let obj = {};
                let pix = this.pix;
                obj['left'] = pix[0] + 10 + 'px';
                obj['top'] = pix[1] + 10 + 'px';
                return obj;
            }
        },
        methods: {
            getWarnList: function(areaCode){
                let url = this.dss_sj+'/warn/warn!getWarnList.action';
                let qData = {'dateTime':this.dateTime,'areaCode': areaCode};
                $.getJSON(url, qData, (bd) => {
                    this.townName = bd.townName;
                    this.siteCode = bd.siteCode;
                    this.time = bd.updateTime;
                    if(!!bd.warnData.last1)
                         this.warnData.last1 = bd.warnData.last1;
                    if(!!bd.warnData.last3)
                         this.warnData.last3 = bd.warnData.last3;
                    if(!!bd.warnData.last24)
                         this.warnData.last24 = bd.warnData.last24;
                    this.overData = {
                        last1: bd.overData.last1,
                        last3: bd.overData.last3,
                        last24: bd.overData.last24
                    }
                    if(!!bd.overData.last1){
                        this.overState.last1 = true;
                    }
                    if(!!bd.overData.last3){
                        this.overState.last3 = true;
                    }
                    if(!!bd.overData.last24){
                        this.overState.last24 = true;
                    }
                });
            },
            // 使窗口支持拖动功能
            addWinDragEvt: function(elName, contentName) {
                var map = config.getParam('map');
                let call = setInterval(() => {
                    let winObj = this.$els[elName];
                    let contentObj = this.$els[contentName];
                    if (!!winObj)
                        WinDrag.drag(winObj, contentObj, map);
                    clearInterval(call);
                }, 10);
            }
        }
    }
</script>

<style scoped="scoped" lang="less">
@import "../../assets/css/common.less";

.poiPop{
    height: auto;
    position: absolute;
    z-index:4;
    background:#fff;
    -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
}

div.site-min-panel{
    top: 300px; 
    right: 250px; 
    width:300px;
}

.site-min-ui{
    margin: 5px;
}
.info{
    overflow: hidden;
    height: auto;
    span{
        color:@color;
        font-weight: bold;
    }
    table{
        width: 100%;
        border-top:1px solid #E5E8EC;
        border-left:1px solid #E5E8EC;
        td{
            border: 0;
            height: 22px;
            line-height: 22px;
            text-align: center;
            width: 72px;
            border-bottom:1px solid #E5E8EC;
            border-right:1px solid #E5E8EC;
        }
        td span{
            color: red;
        }
        tr:first-child{background:@bg;}
    }
}
.nodata{
    height:400px;
}

</style>