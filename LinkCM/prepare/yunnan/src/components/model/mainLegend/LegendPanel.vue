<template>
    <div>
        <div class="total">
            <v-target v-if="item.target.status==true"></v-target>
            <v-ecase v-if="item.ecase.status==true"></v-ecase>
            <v-quantown v-if="item.townName.status==true"></v-quantown>
            <v-minbase v-if="item.minbase.status==true" ifcache="lenged" :datas="datas"></v-minbase>
            <v-avoid v-if="item.avoid.status==true"></v-avoid>
            <div class="panel_0">
                <div class="lpanel">
                    <ul>
                        <li @click="showPanel($key)" v-for="it in item" :class="{'s-item':it.status}">
                            <em></em>
                            <label>{{it.name}}</label>
                        </li>
                    </ul>
                </div>
                <div class="count">
                    <ul>
                        <li v-for="it in datas">{{it.name}}<label>{{it.num}}</label></li>
                    </ul>
                </div>
            </div>
        </div>
        <v-towntable v-if="townTable==true" :datas="datas"></v-towntable>
        <v-messagemin v-if="messageStat==true" :ids="messageIds"></v-messagemin>
    </div>
</template>

<script>

    import { updateParam } from '../../../vuex/store'

    import Target from './legendItems/Target';
    import Ecase from './legendItems/Ecase';
    import MinBase from './legendItems/MinBase';
    import QuanTown from './legendItems/QuanTown';
    import Avoid from './legendItems/Avoid';
    import TownTable from './legendItems/TownTable';
    import MessageMin from './legendItems/MessageMin';

    export default {
        props:['datas'],
        components : {
            'v-target':　Target, 'v-ecase': Ecase, 'v-minbase': MinBase,
            'v-quantown': QuanTown,'v-avoid': Avoid, 'v-towntable': TownTable,
            'v-messagemin': MessageMin
        },
        data () {
            return {
                item: {
                    target: {
                        name: '靶向预警',
                        status: false
                    },
                    avoid: {
                        name: '避灾导航',
                        status: false
                    },
                    ecase: {
                        name: '应急预案',
                        status: false
                    },
                    townName: {
                        name: '圈选镇名',
                        status: false
                    },
                    minbase: {
                        name: '基础数据',
                        status: false
                    }
                },
                townTable: false,
                messageStat: false,//信息发送小窗口状态
                messageIds:''
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                townName: state => state.townName.status,
                clickStat: state => state.poi.clickStat
            },
            actions: {
                updateParam
            }
        },
        watch: {
            clickStat: function(){
                if(this.clickStat)
                    this.item.minbase.status = false;
            }
        },
        methods: {
            //弹出操作面板
            showPanel: function(type){
                let status = true;
                let itemArr = this.item;
                if(this.item[type].status){
                    status = false;
                }else{ 
                    for(let key in itemArr){
                        if(itemArr[key].status) this.item[key].status = false;
                    }
                }
                this.item[type].status = status;
                // if(!!this.item[type]) this.updateParam(type,'status',status);
            },
            refreshPanel: function(boolean){
                return boolean;
            }
        }
    }
</script>

<style scoped lang="less">
@import "../../../assets/css/common.less";
.total { margin-bottom: 5px; }
.panel_0 { background: #FFFFFF; height: auto; -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); }
.lpanel { width: 100%; margin: auto; height: 23px; line-height: 23px; clear: both;
    ul { 
    	li{ 
    		list-style-type: none; 
    		float: left;
    		margin-right:13px; 
    		cursor: pointer; 
    		position: relative;
    		}
        label { cursor: pointer; position: relative; }
        em { 
        	display: inline-block; 
        	width:18px; 
        	height:18px; 
        	margin-top: -2px; 
        	vertical-align: middle; 
        	-webkit-background-size: 100% auto !important;
        	background-size: 100% auto !important;
        }
    }
    li.s-item:before { 
    	content: ""; 
    	display: inline-block; 
    	position: absolute; 
    	top: -12px;
    	left: 31px;
    	width: 0; 
    	height: 0; 
    	border-left: 10px solid transparent; 
    	border-right: 10px solid transparent; 
    	border-top: 10px solid #fff; 
    	}
    li:hover { color: @color }
    li:first-child em {background: url("../../../assets/img/toolsbar/bx.png") no-repeat;}
    li:nth-child(2) em {background: url("../../../assets/img/toolsbar/dh.png") no-repeat;}
    li:nth-child(3) em {background: url("../../../assets/img/toolsbar/ya.png") no-repeat;}
    li:nth-child(4) em {background: url("../../../assets/img/toolsbar/zm.png") no-repeat;}
    li:nth-child(5) em {background: url("../../../assets/img/toolsbar/sj.png") no-repeat;}
    
    li.s-item:first-child em {background: url("../../../assets/img/toolsbar/s_bx.png") no-repeat;}
    li.s-item:nth-child(2) em {background: url("../../../assets/img/toolsbar/s_dh.png") no-repeat;}
    li.s-item:nth-child(3) em {background: url("../../../assets/img/toolsbar/s_ya.png") no-repeat 1px 0px;}
    li.s-item:nth-child(4) em {background: url("../../../assets/img/toolsbar/s_zm.png") no-repeat;}
    li.s-item:nth-child(5) em {background: url("../../../assets/img/toolsbar/s_sj.png") no-repeat;}
}
.count { display: inline-block; width: 100%; height: auto; text-align: left; padding: 2px; border-top: 1px solid #ccc;
    ul li { width: auto; margin-right: 5px; height: 22px; line-height: 22px; float: left; min-width: 80px;
        label { color: #1f7ed0; font-weight: 700; margin-left: 2px; display: inline-block; }
    }
    ul li label:after { content: ""; display: inline-block; }
    ul li:first-child label:after { content: "个"; }
    ul li:nth-child(2) label:after { content: "万"; }
    ul li:nth-child(3) label:after { content: "km²"; }
    ul li:nth-child(4) label:after { content: "亿"; }
}
.s-item { color: @color; }

/*big*/
.big .count { width: 100%; padding: 6px 5px;
    ul li { min-width: 114px; margin-right: 10px; }
}
.big .lpanel { height: 30px; line-height: 30px;
    ul { li { margin-right: 17px;
            em { 
            	width: 22px; 
            	height: 22px; 
            	margin-top: -4px;
            	 }
        }
        li.s-item:before { left: 55px; }
    }
}
</style>