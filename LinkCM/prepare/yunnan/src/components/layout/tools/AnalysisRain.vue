<!--雨量研判组件-->
<template>
    <div class="rain" v-el:rain>
        <div class="title" v-el:title>
            <label>雨量研判</label>
            <label class="close" @click="close()"></label>
        </div>
        <div class="list">
            <table class="table" cellspacing="0" cellpadding="0">
                <tr>
                    <td rowspan="2" class="td_0">城镇名</td>
                    <td rowspan="2">面积<small>(平方米)</small></td>
                    <td>过去雨量<small>(mm)</small></td>
                    <td colspan="5">未来雨量<small>(mm)</small></td>
                </tr>
                <tr>
                    <td>1小时</td>
                    <td>1小时</td>
                    <td>3小时</td>
                    <td>24小时</td>
                    <td>48小时</td>
                    <td>72小时</td>
                </tr>
                <tr v-for="it in list">
                    <td class="td_0">{{ it.name }}</td>
                    <td>{{ it.area }}</td>
                    <td>{{ it.p1 }}</td>
                    <td>{{ it.f1 }}</td>
                    <td>{{ it.f3 }}</td>
                    <td>{{ it.f24 }}</td>
                    <td>{{ it.f48 }}</td>
                    <td>{{ it.f72 }}</td>
                </tr>
            </table>
            <label style="color:red" v-if="list.length==0">数据分析中，请稍候...</label>
        </div>
        <div class="detail">
            <label>总面积：{{ count.area }} 平方千米</label>
            <label>总雨量：{{ count.rain }} 立方米</label>
            <label>1小时QPE平均雨量：{{ count.avgrain }} 毫米</label>
            <label style="color:red">统计公式：总雨量=总面积*平均雨量(小时QPE平均雨量)</label>
        </div>
    </div>
</template>

<script>
    import { updateParam } from 'src/vuex/store';
    import config from 'src/config'
    import WinDrag from 'util/tools/WinDrag'

    export default {
        props:['polygon'],
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                code: state => state.cityCode,
                dateTime: state => state.model.dateTime
            }
        },
        data() {
            return {
                list: {
                    // '440102193': {'name':'江林镇','area':'21.76','p1':'3.7','f1':'0','f3':'0','f24':'0','f48':'0','f72':'0','lon':'0','lat':'0'}
                }
            }
        },
        computed:{
            count: function(){
                var area = 0;
                var rain = 0;
                var avgrain = 0;
                var list = this.list;
                for(let key in list){
                    var child = list[key];
                    for(let it in child){
                        let temp = child[it];
                        if(temp == '--')
                            continue;

                        if(it == 'area')
                            area += parseFloat(temp);
                        else if(it != 'name' && it !='lon' && it != 'lat')
                            rain += parseFloat(temp);
                        
                        if(it == 'p1')
                            avgrain += parseFloat(temp);
                    }
                }
                area = area.toFixed(2);
                avgrain = avgrain.toFixed(2);
                return {'area':area,'rain':rain.toFixed(2),'avgrain':(avgrain/area).toFixed(2)};
            }
        },
        watch: {
            'polygon': function(){
                this.loadTownData();
            }
        },
        methods: {
            /**关闭窗口 */
            close: function(){
                this.$parent.analysisStat = false;
            },
            /** 更新数据*/
            loadTownData: function(){
                var url = this.dss+'/atwill/atwill!getTownByWkt.action';
                var qdata = {wkt:this.polygon,code:this.code,date:this.dateTime};
                $.ajax({url: url,dataType: 'json',type: 'POST',data: qdata,
                    success: (bd) => {
                        this.list = bd;
                    }
                });
            },
            /**使窗口支持拖动功能 */
			addWinDragEvt: function(elName,contentName){
				var map = config.getParam('map');
				let call = setInterval(()=>{
					let winObj = this.$els[elName];
					let contentObj = this.$els[contentName];
					if(!!winObj)
						WinDrag.drag(winObj,contentObj,map);
						clearInterval(call);
				},10);		
			},
        },
        compiled: function(){
            this.loadTownData();
            this.addWinDragEvt('title','rain');
        }
    }
</script>

<style scoped lang="less">
    .title {
        text-align: left;
    }
    .close {
        right: 10px;
        font-size: 14px;
        position: absolute;
        cursor: pointer;
    }
    .list {
        height: auto;
        max-height: 320px;
        border-bottom: 1px solid #ccc;
        overflow-y: scroll;
    }
    .rain {
        position: absolute;
        top:65px;
        right:0px;
        background-color:#fff;
        width:560px;
        height: auto;
        max-height: 420px;
        z-index: 3;
        overflow-y: hidden;
        -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
        .close{
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
        .table {
	        width:100%;
	        align:center;
	        tr td{
	            border-bottom:1px solid #E5E8EC;
	            border-right: 1px solid #E5E8EC;
	            margin:0px;
	            line-height: 22px;
	            padding: 0px 5px;
	            small{display: block;}
	        }
	        tr td.td_0{
	        	width:22%;
	        	padding-left: 2%;
	        	text-align: left;
	        }
	    }
    }
    
    .detail {
        label{
            display:inline-block;
            width:31%;
            float: left;
            text-align: left;
            margin-left: 2%;
            line-height: 22px;
        }
        label:last-child{width: 98%;}
    }
	.big .rain {
        top:78px;
        width:700px;
        max-height:520px;
        .table {
	        tr td{
	            line-height:32px;
	            small{
	            	font-size: 14px;
	            }
	        }
	    }
    }
    .big .detail {
        label{
            width:48%;
            line-height:32px;
        }
        label:last-child{width: 98%;}
    }
</style>