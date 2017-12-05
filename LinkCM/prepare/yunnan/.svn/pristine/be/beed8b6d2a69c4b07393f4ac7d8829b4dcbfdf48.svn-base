<template>
    <div class="quan-town">
        <ul>
            <li>字体大小<input type="text" v-model="fontSize" class="font-text"></li>
            <li>
            	<input id="highlight" type="checkbox" v-model="highlight" class="checkbox font-light">
            	<label for="highlight">高亮显示</label>
            </li>
            <li>
            	<input id="streetName" type="checkbox" v-model="streetName" class="checkbox font-light">
            	<label for="streetName">显示街道名称</label>
            </li>
            <li><a class="list-button btnhover" @click="showList()">{{ btnMsg }}</a></li>
        </ul>
    </div>
</template>

<script>
    import { updateParam } from '../../../../vuex/store'
    export default {
         vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                params: state => state.townName.params,
                cityCode: state => state.cityCode
            },
            actions: {updateParam}
        },
        data() {
            return {
                fontSize: '14',
                highlight: true,
                streetName: false,
                btnMsg: '显示列表'
            }
        },
        watch: {
            fontSize: function(){
                this.updateParam('townName','fontSize',this.fontSize);
            },
            streetName: function(){
                this.updateParam('townName','fontStreet',this.streetName);
            },
            highlight: function(){
                this.updateParam('townName','highlight',this.highlight);
            }
        },
        methods: {
            /**显示镇名列表 */
            showList: function(){
                // this.btnMsg = '加载中...';
                this.$parent.townTable = true;
            },
            /**隐藏镇名列表 */
            closeList: function(){
                this.btnMsg = '显示列表';
                this.$parent.townTable = true;
            }
        },
        ready: function(){
            this.updateParam('townName','status',true);
        },
        detached: function(){
            this.btnMsg = '显示列表';
            this.updateParam('townName','status',false);
        }
    }
</script>

<style scoped lang="less">
@import "../../../../assets/css/common.less";
.quan-town { width: 100%; height: 36px; line-height: 36px; margin: 8px 0px; position: relative; background: #FFFFFF; -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    ul li { padding-right: 7px; float: left; line-height: 36px; margin-left: 5px; }
}
.font-light { width: 16px; height: 16px; vertical-align: middle; margin-top: 0px; }
.list-button { padding: 0 8px; background: none; }
input.font-light:checked + label:after{
	top:12px;
}
/*big*/
.big .quan-town { height: 42px; line-height: 42px; }
.big .quan-town ul li { margin-top: 3px; margin-right: 15px; }
</style>