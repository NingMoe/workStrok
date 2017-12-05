<template>
    <div class="modelPop">
    	<a class="Close" @click="close()"></a>
        <div class="modelPop-title"><span>{{ title }}</span><label>{{ picked }}</label></div>
        <ul class="modelPop-ui">
            <li v-for="item in list">
                <label><input type="radio" value={{item.name}} v-model="picked" @click="exchange(item.code)">{{ item.name }}</label>
            </li>
        </ul>
    </div>
</template>

<script>
	import { updateParam } from '../../../vuex/store'
    export default {
    	vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                cType: state => state.model.cType
            },
            actions: {
                updateParam
            }
        },
        data() {
            return {
                title: '内涝',
                picked: '过去12小时',
                list: [
                    {name:'过去24小时',code:'past24'},
                    {name:'过去12小时',code:'past12'},
                    {name:'过去6小时',code:'past6'},
                    {name:'当前时刻',code:'past0'}
                ]
            }
        },
        methods: {
        	close:function(){
        	 	this.$parent.list.waterLogging.status = false;
	        },
	        exchange: function(type){
                this.updateParam('model','cType',type);
            }
        }
    }
</script>

<style scoped lang="less">
    @import "../../../assets/css/common.less";
    .modelPop{
        width: 318px;
        padding: 5px;
	    height: auto;
	    border: 1px solid @borderColor;
	    clear: both;
	    position: absolute;
	    z-index:2;
	    right: 0;
	    top:0px;
	    background: rgba(255,255,255,.9);
	    box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    }
    .Close{
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
.modelPop-title{
	font-size: 14px;
    line-height: 20px;
    text-align: left;
    font-weight: 700;
}
.modelPop-title label{
    font-size: 12px;
    margin-left: 5px;
    font-weight: 400;
    color:@color;
    cursor: pointer;
}
.modelPop-ui{
	height: auto;
    overflow: hidden;
    margin-top: 5px;	   
}
.modelPop-ui li{
	    width: 31%;
	    float: left;
	    margin-right: 2%;
	    margin-bottom: 5px;
	    cursor: pointer;
}
.modelPop-ui li:hover{
	color:@color;
}
.modelPop-ui li input{
	width: 16px;
	height: 16px;
	vertical-align: middle;
	margin-top: 0px;
	margin-right: 4px;
}
/*big*/
.big .modelPop{
	width:500px;
}
.big .modelPop-title{
	font-size:20px;
	label{font-size:18px}
}
.big .modelPop-ui{
	margin-bottom: 10px;
	li{
		height:30px;
		line-height: 30px;
	}
}
</style>