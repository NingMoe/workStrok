<!--靶向发布信息窗口-->
<template>
    <div class="minTarget">
        <a class="Close" @click="close()"></a>
        <a class="min-max" @click="showMessage()"></a>
        <div class="title">发布信息追踪</div>
        <div class="progress-bar">
            <img src="../../../../assets/img/common/320.png" />
        </div>
        <ul class="minTarget-ui">
            <li v-for="it in minMsg">
                <em></em>
                <div>
                    <ul>
                        <li>渠道：{{it.msgWay}}</li>
                        <li>灾害：{{it.demageType}}-{{it.demageKind}}-{{it.demageLevel}}</li>
                        <li>内容：{{it.wayContent}}</li>
                        <li>状态：<label style="color:red;">{{getStatMsg(it.result)}}</label></li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    import { updateParam } from '../../../../vuex/store'

    export default {
        props:['ids'],
        vuex: {
            getters: {
                dss: state => state.dss,
                message: state => state.status
            },
            actions: {updateParam}
        },
        data() {
            return {
                minMsg:[{areaCode:"44",
                    demageKind:"大风事件",
                    demageLevel:"其他预警",
                    demageType:"气象灾害",
                    msgWay:"短信",
                    result:"已送达发布系统",
                    wayContent:"测试信息"
                }],//发送成功后返回的消息窗口
                minCall: null//小窗口信息更新
            }
        },
        watch: {
            'ids': function(){
                this.getBackMsg();
            }
        },
        methods: {
             /**关闭小型靶向发布窗口 */
            close: function(){
                this.$parent.messageStat = false;
            },
            /**显示大的信息追踪 */
            showMessage: function(){
                this.close();
                this.updateParam('message','status',true);
            },
            /**获取返回靶向发布信息详情 */
            getBackMsg: function(){
                this.reCall();
                if(!!this.minCall) 
                    clearInterval(this.minCall);

                this.minCall = setInterval(()=>{
                    this.reCall();
                },5000);
                
            },
            reCall: function(){
                let url = this.dss+'/target/target!getTargetMsg.action';
                let idsArr = this.ids.toString();
                let qdata = {idsArray:idsArr};
                $.getJSON(url,qdata,(bd)=>{
                    // console.log(bd);
                    this.minMsg = bd;
                });
            },
            /**状态信息手动替换 */
            getStatMsg: function(msg){
                if(msg == ''){
                    return '正等待发布系统接收信息';
                }else{
                    return msg;
                }
            }
        },
        compiled: function(){
            // console.log('open the target min')
            this.getBackMsg();
        },
        detached: function(){
            if(!!this.minCall) 
                clearInterval(this.minCall);
                this.minCall = null;
        }
    }
</script>

<style scoped lang="less">
.minTarget { position: fixed; bottom: 0px; left: 0px; width: 336px; height: 170px; overflow-y: auto; background: #fff; -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); }
.Close { position: absolute; right: 0; top: 3px; height: 20px; width: 20px; background: url("../../../../assets/img/toolsbar/rightIcon.png") no-repeat; background-position: -153px -60px !important; display: inline-block; zoom: 1; cursor: pointer; }
.min-max { position: absolute; right: 25px; top: 3px; height: 20px; width: 20px; display: inline-block; zoom: 1; cursor: pointer; }
.min-max:before { content: ""; height: 7px; width: 10px; margin-top: -1px; margin-left: 6px; display: inline-block; border: 1px solid #ED3F2B; vertical-align: middle; }
.progress-bar { width: 96%; margin: 5px auto; }
.progress-bar img { width: 100%; }
.minTarget-ui { width: 96%; margin-left: 2%; height: auto; overflow: hidden; position: relative; cursor: pointer; }
.minTarget-ui>li { border: 1px solid #ccc; }
.minTarget-ui li ul li { margin: 3px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: left; }
.big .minTarget { width: 502px; height: 244px; }
.big .min-max { top: 2px; }
.big .min-max:before { margin-top: -9px; margin-left: 4px; }
</style>