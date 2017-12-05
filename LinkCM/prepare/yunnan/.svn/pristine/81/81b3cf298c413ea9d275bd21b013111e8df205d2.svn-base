<template>
    <div class="ecase">
    	<div class="ecasemain">
	        <div class="ecaseif">
				<v-select :defname="'citys.proname'" :valname="'curCode'" :def="citys.proname" :list="citys.province" :width="60"></v-select>
				<v-select :defname="'citys.cityname'" :valname="'curCode'" :def="citys.cityname" :list="citys.city" :width="80"></v-select>
				<v-select :defname="'citys.countyname'" :valname="'curCode'" :def="citys.countyname" :list="citys.county" :width="70"></v-select>
				<v-select :defname="'citys.townname'" :valname="'curCode'" :def="citys.townname" :list="citys.town" :width="70"></v-select>
	        </div>
	        <div class="ecasetable ecase-title">
		        <table cellpadding="0" cellspacing="0">
		            <tr>
		                <td>序号</td>
		                <td>预案名称(点击选择)</td>
		                <td>版本</td>
		                <td>附件</td>
		            </tr>
		        </table>
		    </div>
	        <div class="ecasetable list" @scroll="showList($event)">
	             <table cellpadding="0" cellspacing="0">
	             	<tbody v-for="item in list">
		                <tr v-if="$index < count" @click="restore(item.value)">
		                    <td>{{ $index+1 }}</td>
		                    <td>{{ item.text }}</td>
		                    <td>暂无版本</td>
		                    <td>--</td>
		                </tr>
	                </tbody>
	            </table>
	        </div>
	    </div>
    </div>
</template>

<script>
	import { updateParam } from '../../../../vuex/store';
	import Select from 'components/common/Select'

    export default {
		components: {
            'v-select':Select
        },
        data() {
            return {
                citys: {
					proname:'广东省',
                    provinceModel:'',
                    province: [{text: '广东省',value: '440000'}],
					cityname:'选择市',
                    cityModel:'default',
                    city: [{text: '选择市',value: 'default'}],
					countyname:'选择县',
                    countyModel:'default',
                    county: [{text: '选择县',value: 'default'}],
					townname:'选择镇',
                    townModel:'default',
                    town: [{text: '选择镇',value: 'default'}]
                },
				curCode:'',
                list:[],
                count: 10
            }
        },
		vuex: {
			getters: {
                dss: state => state.dss,
                cityCode: state => state.cityCode
            },
			actions: {
				updateParam
			}
		},
        watch: {
			'curCode': function(){
				var code = this.curCode.replace('00','').replace('00','');
				var len = code.length;
				if(len == 2)
					this.clearCityList();
				else if(len == 4)
					this.clearCountyList();
				else if(len == 6)
					this.clearTownList();
				this.changeCitys(this.curCode);
				this.loadTableDatas(this.curCode);
			}
        },
        methods: {
			/**选择省时，清除县和镇数据 */
			clearCityList: function(){
				this.citys.cityname = '选择市';
				// this.citys.cityModel = 'default';
				// this.citys.city = [{text: '选择市',value: 'default'}];
				this.clearCountyList();
				this.clearTownList();
				// this.changeCitys(this.cityCode);
			},
			/**选择市时，清除县和镇数据 */
			clearCountyList: function(){
				this.citys.countyname = '选择县';
				this.citys.countyModel = 'default';
				this.citys.county = [{text: '选择县',value: 'default'}];
				this.clearTownList();
			},
			/**选择市时，清除县和镇数据 */
			clearTownList: function(){
				this.citys.townname = '选择镇';
				this.citys.townModel = 'default';
				this.citys.town = [{text: '选择镇',value: 'default'}];
			},
            showList: function(_ele){
                var scrollTop = $(_ele.target).scrollTop();
                var contentHeight = $(_ele.target).get(0).scrollHeight;
                var divHeight = $(_ele.target).height();
                if(contentHeight - divHeight - scrollTop <= 20) this.count += 5;
            },
            changeCitys: function(code){
                // console.info(code);
                var url = this.dss+'/emergency/emergency!findNameByAreaCode.action';
                var rdata = {'areaCode':code};
                $.getJSON(url,rdata,(bdata) =>{
                    // console.info(bdata);
                    var areaType = '';
                    if(bdata.length>0) 
                        areaType = bdata[0].type;
                        if(!!this.citys[areaType]){
                            var resArr = this.citys[areaType][0];
                            var citysArr = [];
                            citysArr.push(resArr);
                            bdata.forEach((item) => {
                                var itemObj = {};
                                itemObj.text = item.text;
                                itemObj.value = item.value;
                                citysArr.push(itemObj);
                            });
                            // this.citys[areaType+'Model'] = citysArr[0].value;
                            this.citys[areaType] = citysArr;
                        }
                });
            },
			/**还原预案图层
			 * @param commandId 预案ID
			 */
			restore: function(commandId){
				this.updateParam('econtrol','status',true);
				this.updateParam('econtrol','commandId',commandId);
			},
			/**更新预案列表 */
			loadTableDatas: function(code){
				var url = this.dss+'/emergency/emergency!findCommandInfoByAreaCode.action?areaCode='+code;
				$.getJSON(url,null,(bdata) =>{
					this.list = bdata;
				});
			}
        },
        ready: function(){
			this.loadTableDatas(this.cityCode);
            this.changeCitys(this.cityCode);
        },
		detached: function(){
			this.updateParam('econtrol','status',false);
			this.updateParam('econtrol','commandId','');
		}
    }
</script>

<style scoped lang="less">
@import "../../../../assets/css/common.less";
.ecase { height: auto; width: 100%; background: #fff; margin: 8px 0px; position: relative; -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3); -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3); }
.ecasemain { clear: both; }
.ecaseif { padding: 2px; text-align: left; height: 24px;
    div { margin-right: 2px; padding: 0; }
}
.ecasetable { width: 100%;
    table { width: 100%;
        tr td { border: 0; height: 22px; line-height: 22px; text-align: center; border-bottom: 1px solid #E5E8EC; border-right: 1px solid #E5E8EC; }
        tr:hover { background: @bg; cursor: pointer; }
        tr td:first-child { width: 50px }
        tr td:nth-child(2) { width: 220px }
        tr td:nth-child(3) { width: 80px }
        tr td:nth-child(4) { text-align: left; padding-left: 10px; }
    }
}
.ecase-title tr { background: @bg; }
.list { clear: both; height: 160px; overflow-y: auto; cursor: pointer; }
.list tr td:nth-child(4) { text-align: left; padding-left: 18px; }

/*big*/
.big .ecaseif div.selectCss { width: 151px; margin-bottom: 2px; }
.big .ecasetable { table { tr td { height: 30px; line-height: 30px; }
        tr td:first-child { width: 50px }
        tr td:nth-child(2) { width: 360px }
        tr td:nth-child(3) { width: 130px }
        tr td:nth-child(4) { text-align: left; padding-left: 10px; }
    }
}
</style>