<template>
    <div class="massage-line">
    	<div class="message-top">
	        <span>应急指挥决策辅助系统</span>
	        <span class="status">突发事件预警发布平台（{{msgText}}）</span>
	    </div>
        <ul>
            <li v-for="item in msgItems" :class="{'li-line-start':item.isSuccess}"><em></em><a>{{item.text}}</a></li>
        </ul>
    </div>
</template>

<script>
    import { updateParam } from '../../../vuex/store'
    
    export default {
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                text: state => state.message.text
            },
            actions: { updateParam }
        },
        data() {
            return {
                msgItems: [
                    { 'text': '推送', 'isSuccess': false },
                    { 'text': '确认', 'isSuccess': false },
                    { 'text': '审核', 'isSuccess': false },
                    { 'text': '发布', 'isSuccess': false },
                    { 'text': '发布完成', 'isSuccess': false }
                ],
                msgText: '发布完成'
            }
        },
        computed: {

        },
        watch: {
            text: function(text){
                this.changeLineStatus(text);
            }
        },
        methods: {
            changeLineStatus: function(msgText) {
                var stateNum = 0;
                var state = true;
                var stateName = '发布完成';
                msgText = msgText.trim();
                if (msgText === '已成功发至省突，并确认！') {
                    stateNum = 1;
                } else if ('已在省突建立草稿,待确认'.indexOf(msgText) !== -1) {
                    stateNum = 2;
                } else if (msgText === '待审批') {
                    stateNum = 3;
                } else if ('待发布,正在发布'.indexOf(msgText) !== -1) {
                    stateNum = 4;
                } else if (msgText === '发布完成') {
                    stateNum = 5;
                } else if ('信息发送失败,暂停,终止,确认不通过,审批不通过,发布不通过,已撤回,已过有效期,已解除'.indexOf(msgText) !== -1) {
                    state = false;
                    stateName = '失败';
                    if (msgText === '已过有效期') {
                        stateName = '已失效';
                    } else if (msgText === '已解除') {
                        stateName = '已解除';
                    }
                }
                this.msgText = msgText;
                if (state) {
                    for (var i = 0; i < 5; i++) {
                        this.msgItems[i].isSuccess = false;
                    }
                    for (var i = 0; i < stateNum; i++) {
                        this.msgItems[i].isSuccess = true;
                    }
                    this.msgItems[4].text = stateName;
                } else {
                    for (var i = 1; i < 4; i++) {
                        this.msgItems[i].isSuccess = false;
                    }
                    this.msgItems[0].isSuccess = true;
                    this.msgItems[4].isSuccess = true;
                    this.msgItems[4].text = stateName;
                }
            }
        },
        ready: function() {

        },
        detached: function() {

        }
    }
</script>

<style scoped lang="less">
.massage-line { 
	width: 98%; margin: auto; height: 70px;border:1px solid #707070; clear: both; margin-top: 8px;
    ul { width: 90%; margin: auto;
        li { float: left; height: 1px; background: #707070; position: relative; margin-top: 18px; width: 104px }
        li:first-child { width: 6px }
        li:nth-child(2) { width: 276px }
        li:first-child em { left: -9px }
        li:first-child a { left: -28px; cursor: pointer }
        li:first-child a:hover { color: #1f7ed0 }
        li em { display: inline-block; display: -moz-inline-stack; zoom: 1; *display: inline; position: absolute; width: 21px; height: 21px; right: -9px; top: -10px; background: url("../../../assets/img/common/line0.png") no-repeat 5px 5px; z-index: 9 }
        li a { display: inline-block; display: -moz-inline-stack; zoom: 1; *display: inline; position: absolute; width: 54px; text-align: center; height: 20px; line-height: 20px; right: -27px; top: 10px; color: #707070; z-index: 9 }
        li.li-line-start { background: #96cb00 }
        li.li-line-start em { background: url("../../../assets/img/common/line.png") no-repeat 1px 2px }
    }
}
.message-top { text-align: left; width: 96%; margin: auto; margin-top: 3px }
.message-top .status { float: right }
.big .massage-line { width: 98%; height: 84px;
    ul { li { width: 120px }
        li:first-child { width: 6px }
        li:nth-child(2) { width: 308px }
        li:first-child em { left: -9px }
        li:first-child a { left: -37px }
        li a { width: 80px; right: -38px }
    }
}
</style>