<template>
    <div class="modelPop">
    	<a class="Close" @click="close()"></a>
        {{ picked }}
        <div class="modelPop-title"><span>{{ title1 }}</span><label>{{ pickedi }}</label></div>
        <ul class="modelPop-ui">
            <li v-for="item in listi">
                <label><input type="radio" value={{item.name}} v-model="pickedi" @click="exchange(item.code)">{{ item.name }}</label>
            </li>
        </ul>
        <div class="modelPop-title"><span>{{ title2 }}</span><label>{{ pickeda }}</label></div>
        <ul class="modelPop-ui">
            <li v-for="item in lista">
                <label><input type="radio" value={{item.name}} v-model="pickeda" @click="exchange(item.code)">{{ item.name }}</label>
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
                title1: '瞬时风',
                pickedi: '过去1小时',
                listi: [
                    {name:'过去24小时',code:'galeInstant24'},
                    {name:'过去1小时',code:'galeInstant'},
                    {name:'未来24时',code:'futureGaleInstant24'},
                    {name:'未来48小时',code:'futureGaleInstant48'}
                ],
                title2: '平均风',
                pickeda: '',
                lista: [
                    {name:'过去24小时',code:'galeAverage24'},
                    {name:'过去1小时',code:'galeAverage'},
                    {name:'未来24时',code:'futureGaleAverage24'},
                    {name:'未来48小时',code:'futureGaleAverage48'}
                ]
            }
        },
        watch: {
            pickedi: function(){
                if(this.pickedi!='') this.pickeda = '';
            },
            pickeda: function(){
                if(this.pickeda!='') this.pickedi = '';
            }
        },
        methods:{
        	close:function(){
        		this.$parent.list.gale.status=false;
        	},
            /**面板类型切换 */
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
	    border: 1px solid #ccc;
	    clear: both;
	    position: absolute;
	    z-index:2;
	    right: 0;
	    top:0px;
	    background: rgba(255,255,255,.9);
	    box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
        input {
            cursor: pointer;
        }
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