<template>
    <div class="town_tatble" v-el:town-table>
    	<a class="Close" @click="close()"></a>
        <div class="count" v-el:town-title>
            <ul>
                <li v-for="it in datas">{{it.name}}<label>{{it.num}}</label></li>
            </ul>
        </div>
        <div class="export">
            <ul>
                <li>区（镇）列表导出模板：</li>
                <li>
                	<input id="town_all_0" class="packed form-radio" type="radio" value="all" v-model="picked"/>
                	<label for="town_all_0">镇名汇总</label>
                </li>
                <li>
                	<input id="town_single_0" class="packed form-radio" type="radio" value="single" v-model="picked"/>
                	<label for="town_single_0">镇名单行</label>
                </li>
                <li><a class="btnhover" @click="exportFile()">导出</a></li>
            </ul>
        </div>
        <div class="townList">
            <table cellpadding="0" cellspacing="0">
                <tbody v-for="it in list">
                    <tr>
                        <td rowspan="{{it.rows}}">{{ it.city }}</td>
                        <td>{{ it.county }}</td>
                        <td>{{ it.town }}</td>
                    </tr>
                    <tr v-for="em in it.other">
                        <td>{{ em.county }}</td>
                        <td>{{ em.town }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { updateParam } from '../../../../vuex/store'
    import config from 'src/config'
    import WinDrag from 'util/tools/WinDrag'

    export default {
        props: ['datas'],
        data() {
            return {
                list: '',
                picked: 'all'
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                cacheId: state => state.model.cacheId,
                fontStreet: state => state.townName.fontStreet
            },
            actions: {updateParam}
        },
        methods: {
        	close:function(){
                this.$parent.townTable = false;
        		// this.updateParam('town_tatble','status',false);
        	},
            getTownList: function(){

            },
            exportFile: function(){
                var url = this.dss_sj+'/export/export!exportTownNameList.action';
				var reqData = 'cacheId=' + this.cacheId + '&type=' + this.picked;
				this.download(url,reqData,"post");
            },
            download: function(url, data, method){
                // 获取url和data
                if (url && data) {
                    // data 是 string 或者 array/object
                    data = typeof data == 'string' ? data : $.param(data);
                    // 把参数组装成 form的 input
                    var inputs = '';
                    $.each(data.split('&'), function() {
                        var pair = this.split('=');
                        inputs += '<input type="hidden" name="' + pair[0] + '" value="'+ pair[1] + '" />';
                    });
                    // request发送请求
                    $('<form action="' + url + '" method="' + (method || 'post')+ '">' + inputs + '</form>').appendTo('body').submit().remove();
                }
            },
			/**使窗口支持拖动功能 */
			addWinDragEvt: function(elName,titleName){
				var map = config.getParam('map');
				let call = setInterval(()=>{
					let winObj = this.$els[elName];
                    let winTitle = this.$els[titleName];
					if(!!winObj)
						WinDrag.drag(winTitle,winObj,map);
						clearInterval(call);
				},10);		
			}
        },
        compiled: function(){
            var url = this.dss_sj+'/gdmodel/model!getTownList.action';
            var qdata = {cacheId:this.cacheId,streetName:this.fontStreet};
            $.getJSON(url,qdata,(bd)=>{
                var arr = [];

                for(let key in bd){
                    var temp = bd[key];
                    var rows = 0;
                    var obj = {};
                    var county = '',town='';
                    var otherArr = [];
                    for(let it in temp){
                        if(rows==0){
                            county = it;
                            town = temp[it];
                        }else{
                            var ele = {};
                            ele.county = it;
                            ele.town = temp[it];
                            otherArr.push(ele);
                        }
                        rows ++;
                    }
                    obj.rows = rows;
                    obj.city = key;
                    obj.county = county;
                    obj.town = town;
                    obj.other = otherArr;
                    arr.push(obj);
                }
                this.list = arr;
            });
            this.addWinDragEvt('townTable','townTitle');
        }
    }
</script>

<style scoped lang="less">
@import "../../../../assets/css/common.less";
.town_tatble { position: fixed; top: 30px; right: 0px; z-index: 3; background: #fff; width: 502px; -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); }
.Close { position: absolute; right: 0; top: 0; height: 20px; width: 20px; background: url("../../../../assets/img/toolsbar/rightIcon.png") no-repeat; background-position: -153px -60px !important; display: inline-block; zoom: 1; cursor: pointer; }
.export { width: 100%; height: 30px; line-height: 30px; background: @bg;
    ul li { float: left; margin-left: 5px; margin-right: 5px; cursor: pointer;
        input { width: 16px; height: 16px; vertical-align: middle; margin-top: -2px; cursor: pointer; }
        a { height: 22px; line-height: 22px; padding: 0px 8px; }
    }
    ul li:hover { color: @color; }
    ul li:first-child { cursor: default; color: @colorH; }
}
.count { display: inline-block; width: 100%; height: auto; text-align: left; padding: 2px;
    ul li { width: auto; margin-right: 5px; height: 22px; line-height: 22px; float: left; min-width: 80px;
        label { color: #1f7ed0; font-size: 13px; font-weight: 700; margin-left: 1px; display: inline-block; }
    }
    ul li label:after { content: ""; display: inline-block; }
    ul li:first-child label:after { content: "个"; }
    ul li:nth-child(2) label:after { content: "万"; }
    ul li:nth-child(3) label:after { content: "km²"; }
    ul li:nth-child(4) label:after { content: "亿"; }
}
.townList { clear: both; max-height: 340px; overflow-y: scroll;
    table { width: 100%; position: relative;
        td { padding: 5px; border-top: 2px solid #ccc; border-right: 2px solid #ccc; vertical-align: middle; text-align: left; width: 12%;
            ul li { text-align: left; }
        }
        td:last-child { width: 76% }
    }
}
input.packed:checked + label:after{
	top: 13px;
}
/*big*/
.big .town_tatble { top: 45px; width: 627px;
    .export { height: 40px; line-height: 40px; }
}
.big .count { ul li { margin-right: 10px; height: 30px; line-height: 30px; min-width: 100px;
        label { color: #1f7ed0; font-size: 20px; font-weight: 700; margin-left: 2px; }
    }
}
.big .townList { 
	height: 440px;
    td:first-child,
    td:nth-child(2) { width: 50px }
}
.big input.packed:checked + label:after{
	top: 18px;
}
.big .export ul li a{
	height: 30px;
	line-height:30px;
}
</style>