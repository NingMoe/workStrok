<!--poi分析列表-->
<template>
    <div class="poi_tatble" v-el:poi-table>
    	<a class="Close" @click="close()"></a>
        <div class="count" v-el:poi-title>
            <ul>
                <li v-for="it in datas">{{it.name}}<label>{{it.num}}</label></li>
            </ul>
        </div>
        <div class="export">
            <ul>
                <li>
                    <v-select :defname="'poiSelected'" :valname="'selectName'" :def="poiSelected" :list="list" :width="80"></v-select>
                </li>
                <li>导出模板：</li>
                <li>
                	<input id="poi" class="packed form-radio" type="radio" value="all" v-model="picked"/>
                	<label for="poi">POI汇总</label>
                </li>
                <li>
                	<input id="single" class="packed form-radio" type="radio" value="single" v-model="picked"/>
                	<label for="single">POI单行</label>
                </li>
                <li><a class="btnhover" @click="exportFile()">全部导出</a></li>
            </ul>
        </div>
        <div class="townList">
            <table cellpadding="0" cellspacing="0" id="cityTable" border="1 solid #eee">
                {{{cityHtml}}}
            </table>
        </div>
    </div>
</template>

<script>
    import { updateParam } from '../../../../vuex/store'
    import config from 'src/config'
    import WinDrag from 'util/tools/WinDrag'
    import Select from 'components/common/Select'

    export default {
        props: ['datas', 'curtypes', 'ifcache'],
        components: {
            'v-select': Select
        },
        data() {
            return {
                list: [],
                picked: 'single',
                types: [],
                poiSelected: '',
                selectName: '', // 选中的value值
                totalList: '', // 所有的数据
                curList: [], // 当前选中类型
                cityHtml: '',
                spNameArr: { '客运站': 1, '避难点': 1 }
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                code: state => state.cityCode,
                dss: state => state.dss,
                cacheId: state => state.model.cacheId
            },
            actions: {
                updateParam
            }
        },
        watch: {
            selectName: function(name) {
                this.formatList(name);
            }
        },
        computed: {
            curList: function() {
                return this.formatList(this.selectName);
            },
            // 下拉框列表
            list: function() {
                let types = this.types;
                let arr = [];
                for (let key in types) {
                    let name = types[key];
                    const cname = this.getPoiCNName(name);
                    let suffix = this.spNameArr[cname];
                    let text = '';
                    if (suffix) {
                        text = `${cname}-批次${suffix}`;
                        this.spNameArr[cname] = suffix + 1;
                    } else {
                        text = cname;
                    }
                    let _obj = {
                        'text': text,
                        'value': name
                    };
                    arr.push(_obj);
                }
                return arr;
            }
        },
        methods: {
            close: function() {
                this.$parent.poiStat = false;
            },
            exportFile: function() {
                let flag = false;
                if (this.picked == 'single') flag = true;
                let url = this.dss+'/export/export!exportPoiListByCachedId.action';
                let reqData = 'cacheId=' + this.cacheId + '&type=' + this.types.toString() + '&areaCode=' + this.code + '&flag=' + flag + '&ifcache=' + this.ifcache;
                this.download(url, reqData, "post");
            },
            download: function(url, data, method) {
                if (url && data) { // 获取url和data
                    data = typeof data == 'string' ? data : $.param(data); // data 是 string 或者 array/object
                    let inputs = ''; // 把参数组装成 form的 input
                    $.each(data.split('&'), function() {
                        let pair = this.split('=');
                        inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
                    });
                    $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>').appendTo('body').submit().remove(); // request发送请求
                }
            },
            // 获取POI中文名称
            getPoiCNName: function(type) {
                let list = this.$parent.list;
                for (let key in list) {
                    let temp = list[key];
                    for (let par in temp) {
                        let curType = temp[par].type;
                        if (curType.indexOf(type) != -1) {
                            return temp[par].name;
                        }
                    }
                }
            },
            formatList: function(type) {
                let cityObj = this.totalList[type];
                let cityHtml = '';
                for (let city in cityObj) {
                    let countyArr = Object.keys(cityObj[city]).sort();
                    let countyHtml = '';
                    let firstCountyHtml = '';
                    let cityRowspan = 0;
                    for (let county in countyArr) {
                        let villageHtml = '';
                        let firstVillageHtml = '';
                        let villageArr = Object.keys(cityObj[city][countyArr[county]]).sort();
                        let countyRowspan = villageArr.length;
                        for (let village in villageArr) {
                            let townHtml = '';
                            let townArr = cityObj[city][countyArr[county]][villageArr[village]];
                            let villageRowspan = townArr.length;
                            for (let town in townArr) {
                                let townName = townArr[town] ? townArr[town] : '&nbsp;';
                                townHtml += (Number(town) + 1) + '. ' + townName + '</br>';
                            }
                            if (Number(village) === 0) {
                                firstVillageHtml = '<td>' + villageArr[village] + '</td><td>' + townHtml + '</td>';
                            } else {
                                villageHtml += '<tr><td>' + villageArr[village] + '</td><td>' + townHtml + '</td></tr>';
                            }
                            cityRowspan++;
                        }
                        if (Number(county) === 0) {
                            if (countyRowspan === 1) {
                                firstCountyHtml = '<td>' + countyArr[county] + firstVillageHtml + '</td>' + villageHtml;
                            } else {
                                firstCountyHtml = '<td rowspan="' + countyRowspan + '">' + countyArr[county] + firstVillageHtml + '</td>' + villageHtml;
                            }
                        } else {
                            if (countyRowspan === 1) {
                                countyHtml += '<tr><td>' + countyArr[county] + firstVillageHtml + '</td>' + villageHtml + '</tr>';
                            } else {
                                countyHtml += '<tr><td rowspan="' + countyRowspan + '">' + countyArr[county] + firstVillageHtml + '</td></tr>' + villageHtml;
                            }
                        }
                    }
                    cityHtml += '<tr><td rowspan="' + (Number(cityRowspan)) + '">' + city + '</td>' + firstCountyHtml + '</tr>' + countyHtml;
                }
                $('#cityTable').html(cityHtml);
                // this.cityHtml = cityHtml;
            },
            // 使窗口支持拖动功能
            addWinDragEvt: function(elName) {
                let map = config.getParam('map');
                let call = setInterval(() => {
                    let winObj = this.$els[elName];
                    if (!!winObj)
                        WinDrag.drag(winObj, this.$els.poiTable, map);
                    clearInterval(call);
                }, 10);
            }
        },
        compiled: function() {
            let url = this.dss+'/gdmodel/model!getPoiTableByCacheId.action';
            let qd = {
                PARAM: {
                    "code": this.code,
                    "cacheId": this.cacheId,
                    "poiTypes": this.curtypes,
                    "ifcache": this.ifcache
                }
            };
            qd.PARAM = JSON.stringify(qd.PARAM);
            $.getJSON(url, qd, (bd) => {
                this.totalList = bd;
                let types = [];
                for (let t in bd) {
                    types.push(t);
                }
                this.types = types;
                this.selectName = types[0];
                this.formatList(this.selectName);
                this.poiSelected = this.getPoiCNName(types[0]);
            });
            this.addWinDragEvt('poiTitle');
        }
    }
</script>

<style scoped lang="less">
@import "../../../../assets/css/common.less";
.poi_tatble { position: fixed; top: 30px; right: 0px; z-index: 3; background: #fff; width: 502px; -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); }
.Close { position: absolute; right: 0; top: 0; height: 20px; width: 20px; background: url("../../../../assets/img/toolsbar/rightIcon.png") no-repeat; background-position: -153px -60px !important; display: inline-block; zoom: 1; cursor: pointer; }
div.export-select { margin-top: 3px; width: 150px; }
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
.big div.export-select { width: 146px; }
.big .export ul li a { height: 30px; line-height: 30px; }
.big .poi_tatble { top: 45px; width: 627px;
    .export { height: 40px; line-height: 40px; }
}
.big .count { ul li { margin-right: 10px; height: 30px; line-height: 30px; min-width: 100px;
        label { color: #1f7ed0; font-size: 20px; font-weight: 700; margin-left: 2px; }
    }
}
.big .townList { height: 440px;
    td:first-child,
    td:nth-child(2) { width: 50px }
}
.big input.packed:checked + label:after{
	top: 18px;
}
</style>