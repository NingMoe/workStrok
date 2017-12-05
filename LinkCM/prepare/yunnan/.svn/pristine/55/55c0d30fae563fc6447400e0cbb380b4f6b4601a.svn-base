<!--靶向发布-->
<template>
    <div>
        <div class="target">
            <div class="count_div marTpad">
                <label class="infoCC-lable">统计分析：</label>
                <div class="infoCC-box">
                    <ul class="infoCC-ul">
                        <li v-for="item in count">{{item.text}}-<label>{{item.val}}<label v-if="item.val!='分析中...'">{{item.unit}}</label></label></li>
                    </ul>
                </div>
            </div>
            <div class="msg_div marTpad">
                <label class="infoCC-lable">消息渠道：</label>
                <div class="infoCC-box">
                    <ul class="infoCC-ul">
                        <li v-for="item in msg_way">
                        	<input class="checkbox" type="checkbox" id="{{item.id}}" value={{item.text}} v-model="ways"/>
                        	<label for="{{item.id}}">{{item.text}}</label>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="dis_div marTpad">
                <label class="infoCC-lable">灾害类型：</label>
                <div class="infoCC-box">
                    <v-select :defname="'type_value'" :def="type_value" :list="demage_type"></v-select>
                    <v-select :defname="'kind_value'" :def="kind_value" :list="demage_kind"></v-select>
                </div>
            </div>
            <div class="msg_level marTpad">
                <label class="infoCC-lable">灾害等级：</label>
                <div class="infoCC-box">
                    <ul>
                        <template v-for="item in demage_levels">
                            <li v-bind:style="{backgroundColor:item.color}" :class="item.classObj" @click="exlevel(item.lev)"></li>
                        </template>
                    </ul>
                </div>
            </div>
            <div class="msg_effect marTpad">
                <label class="infoCC-lable">影响区域：</label>
                <div class="effect-con">
                    <label v-if="loadTown==true">分析加载中...</label>
                    <ul><li v-for="it in town"><p title="{{ it }}">{{ it }}</p><em @click="delTown($key)">x</em></li></ul>
                </div>
            </div>
            <div class="msg_div marTpad">
                <label class="infoCC-lable">正文描述：</label>
                <textarea class="msg_text" v-model="sendMsg"></textarea>
            </div>
            <div class="msg_send marTpad">
                <label>{{warnMsg}}</label>
                <span style="float:right">
                    <label @click="reset" class="btnhover">重置</label>
                    <label @click="send" class="btnhover">发送</label>
                </span>
            </div>
        </div>
    </div>
</template>

<script>

    import { updateParam } from '../../../../vuex/store'
    import ModelTime from '../../../common/model'
    import Select from 'components/common/Select'

    export default {
        props:['ifcache'],
        components: {
            'v-select': Select
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                levels: state => state.dropzone.levels,
                geoIds: state => state.dropzone.geoIds,
                code: state => state.cityCode                
            },
            actions: {updateParam}
        },
        data () {
            return {
                count: {
                    // ECONOMIC: { text: '经济', val: '243'},
                    LCD_LED: { text: 'LED显示屏', val: '分析中...', unit: '个' },
                    SMS_USER: { text: '责任人', val: '分析中...', unit: '人' },
                    TYFON: { text: '大喇叭', val: '分析中...', unit: '个' }
                },
                msg_way: [{text:'短信','id':'mess'},
                		  {text:'大喇叭','id':'dlb'},
                		  {text:'LED显示屏','id':'led'},
                		  {text:'传真','id':'zc'},
                		  {text:'外呼','id':'wh'}
                	  ],
                ways: ['短信'],
                type_value: '请选择类型',
                kind_value: '请选择种类',
                demage_type: [],
                demage_kind: [],
                demage_levels: [
                    { lev: 1, color: '#FF0000', classObj: { 'selectli': false } }, 
                    { lev: 2, color: '#FFA500', classObj: { 'selectli': false } }, 
                    { lev: 3, color: '#FFFF00', classObj: { 'selectli': false } }, 
                    { lev: 4, color: '#0000FF', classObj: { 'selectli': false } }, 
                    { lev: 9, color: '#808080', classObj: { 'selectli': true } }
                ],
                town: {},
                sendMsg: '',
                warnMsg: '',
                level: '9',
                sourceTime: '',
                loadTown: true // 控制镇列表加载提示
            }
        },
        watch: {
            'type_value': function() {
                this.kind_value = '请选择种类';
                this.demage_kind = [];
                if (this.type_value !== '请选择类型') this.getAllKinds();
            },
            levels: function() {
                this.getAtwillCount();
                this.getAtwillTowns();
            }
        },
        methods: {
            getAllTypes: function() {
                let url = this.dss_sj+'/target/target!getDemagesType.action';
                $.getJSON(url, null, (bdata) => {
                    this.demage_type = bdata;
                });
            },
            getAllKinds: function() {
                let value = '';
                this.demage_type.forEach((it) => {
                    if (it.text == this.type_value) value = it.value;
                })
                let url = this.dss_sj+'/target/target!getDemagesKindByType.action';
                let qdata = { typeCode: value };
                $.getJSON(url, qdata, (bdata) => {
                    this.demage_kind = bdata;
                });
            },
            // 获取靶向发布人口、责任人等统计信息
            getAtwillCount: function() {
                let url = this.dss_sj+'/poi/poi!getPoiCountDropzone.action';
                let qdata = { areaCode: this.code, model: this.geoIds };
                $.getJSON(url, qdata, (bd) => {
                    let count = this.count;
                    for (let key in count) {
                        if (!!bd[key]) this.count[key].val = bd[key];
                        else this.count[key].val = '0';
                    }
                });
            },

            // 选择灾害等级
            exlevel: function(lev) {
                let levs = this.demage_levels;
                levs.forEach((it) => {
                    if (it.lev != lev) {
                        it.classObj['selectli'] = false;
                    } else {
                        it.classObj['selectli'] = true;
                        this.level = lev;
                    }
                })
            },

            // 影响镇名列表
            getAtwillTowns: function() {
                let url = this.dss_sj+'/atwill/atwill!getAtwillTownsDropzone.action';
                let qdata = {
                    cacheId: this.geoIds,
                    code: this.code
                };
                $.getJSON(url, qdata, (bd) => {
                    this.loadTown = false;
                    this.town = bd;
                });
            },
            
            // 删除个别影响城镇
            delTown: function(code) {
                let towns = this.town;
                let obj = {};
                for (let key in towns) {
                    if (key !== code) {
                        obj[key] = towns[key];
                    }
                }
                this.town = obj;
            },
            // 发送信息
            send: function() {
                let msg = '';
                if (this.sendMsg == '') msg = '正文不能为空';
                else if (this.town.length == 0) msg = '影响区域不能为空';
                else if (this.type_value == '请选择类型') msg = '请选择灾害类型';
                else if (this.kind_value == '请选择种类') msg = '请选择灾害种类';
                else if (this.ways.length == 0) msg = '请选择渠道';
                if (msg != '') this.warnMsg = msg;
                else this.warnMsg = '';
                if (this.warnMsg) {
                    return;
                } else {
                    let url = this.dss_sj+'/target/target!sendMsg.action';
                    let towns = this.town;
                    let effectCods = '';
                    for (let key in towns) {
                        effectCods += key + ','
                    }
                    let typeCode = '';
                    let knidCode = '';
                    this.demage_type.forEach((it) => {
                        if (it.text == this.type_value) typeCode = it.value;
                    })
                    this.demage_kind.forEach((it) => {
                        if (it.text == this.kind_value) knidCode = it.value;
                    })
                    let qdata = {
                        'wayContent': encodeURI(this.sendMsg),
                        'msgWay': encodeURI(this.ways),
                        'typeName': encodeURI(this.type_value),
                        'kindName': encodeURI(this.kind_value),
                        'demageLevel': this.level,
                        'effectArea': effectCods,
                        'areaCode': this.code,
                        'demageType': typeCode,
                        'demageKind': knidCode
                    };
                    $.ajax({
                        url: url,
                        data: qdata,
                        type: 'POST',
                        success: (bd) => {
                            this.$parent.messageIds = bd;
                            this.$parent.messageStat = true;
                            this.$parent.item.target.status = false;
                        }
                    });
                }
            },
            // 重置
            reset: function() {
                this.warnMsg = '';
                this.sendMsg = '';
                this.ways = ['短信'];
                this.type_value = '请选择类型';
                this.kind_value = '请选择种类';
                this.level = '9';
                let levels = this.demage_levels;
                levels.forEach((it) => {
                    let bol = false;
                    if (it.lev == 9) bol = true;
                    it.classObj.selectli = bol;
                })
                this.getAtwillTowns();
            }
        },
        ready: function(){
            this.getAllTypes();
            this.getAtwillCount();
            this.getAtwillTowns();
        },
        detached: function(){
            this.minStat = false;
            if(!!this.minCall) clearInterval(this.minCall);
        }
    }
</script>

<style scoped lang="less">
@import "../../../../assets/css/common.less";
.target { height: 240px; width: 100%; background: #fff; margin: 8px 0px; padding: 5px 0px; position: relative; -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); }
.count_div { width: 100%; height: auto; }
.marTpad { width: auto; clear: both; padding: 0px 10px; }
.infoCC-box { display: inline-block; width: 338px; vertical-align: top; text-align: left; float: left; }
.infoCC-ul { height: auto; width: auto; margin-top: 7px;
    li { float: left; list-style: none; margin-right: 12px; margin-bottom: 3px; }
}
.count_div .infoCC-ul li label { color: red; }
.infoCC-lable { display: inline-block; line-height: 25px; margin-top: 3px; float: left; }
.msg_div { ul li { float: left; margin-right: 10px;
        input { width: 16px; height: 16px; vertical-align: middle; margin-top: 0px; }
    }
}
.dis_div .infoCC-box { margin-top: 4px; }
.msg_effect { width: 100%; height: auto; display: inline-block;
    ul li { float: left; margin-right: 5px; margin-bottom: 3px; height: 20px; line-height: 20px; width: 84px; padding-left: 3px; text-align: center; background: #edf0f3;
        p { display: inline-block; width: 82%; margin: 0; padding: 0; height: 20px; line-height: 20px; float: left; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        em { float: left; vertical-align: middle; }
    }
}
.effect-con { width: 338px; height: 40px; border: 1px solid #ccc; float: left; overflow-y: auto;
    em { font-weight: 700; cursor: pointer; font-style: normal; margin-left: 4px; }
}
.msg_text { width: 334px; height: 40px; float: left; border: 1px solid #ccc; background: 0; }
.msg_level { width: 100%; height: auto; display: inline-block;
    .infoCC-box { margin-top: 5px; }
    ul li { float: left; overflow: hidden; width: 30px; height: 16px; position: relative; }
    li.selectli:before { content: ""; display: inline-block; position: absolute; top: 5px; left: 10px; background: #414e61; width: 2px; height: 8px; transform: rotate(-45deg); -ms-transform: rotate(-45deg);   /* IE 9 */ -moz-transform: rotate(-45deg);  /* Firefox */ -webkit-transform: rotate(-45deg); /* Safari 和 Chrome */ -o-transform: rotate(-45deg); }
    li.selectli:after { content: ""; display: inline-block; position: absolute; top: 2px; left: 17px; background: #414e61; width: 2px; height: 12px; transform: rotate(45deg); -ms-transform: rotate(45deg);    /* IE 9 */ -moz-transform: rotate(45deg);   /* Firefox */ -webkit-transform: rotate(45deg); /* Safari 和 Chrome */ -o-transform: rotate(45deg); }
}
.msg_send { clear: both; padding-top: 5px;
    span label { padding: 0px 8px; margin-left: 10px; }
}
.minTarget { position: fixed; bottom: 0px; left: 0px; width: 336px; height: 170px; overflow-y: auto; background: #fff; -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); }
.Close { position: absolute; right: 0; top: 3px; height: 20px; width: 20px; background: url("../../../../assets/img/toolsbar/rightIcon.png") no-repeat; background-position: -153px -60px !important; display: inline-block; zoom: 1; cursor: pointer; }
.min-max { position: absolute; right: 25px; top: 3px; height: 20px; width: 20px; display: inline-block; zoom: 1; cursor: pointer; }
.min-max:before { content: ""; height: 7px; width: 10px; margin-top: -1px; margin-left: 6px; display: inline-block; border: 1px solid #ED3F2B; vertical-align: middle; }
.progress-bar { width: 96%; margin: 5px auto; }
.progress-bar img { width: 100%; }
.minTarget-ui { width: 96%; margin-left: 2%; height: auto; overflow: hidden; position: relative; cursor: pointer; }
.minTarget-ui>li { border: 1px solid #ccc; }
.minTarget-ui li ul li { margin: 3px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: left; }

/*big*/
.big .target { height: 360px; }
.big .infoCC-box { width: 500px; }
.big .infoCC-lable { margin-top: 7px }
.big .infoCC-ul li { margin-right: 10px; }
.big .msg_level { .infoCC-box { margin-top: 12px; }
    ul li { width: 100px; height: 18px; }
    li.selectli:before { left: 47px; height: 14px; top: 4px; }
    li.selectli:after { left: 58px; height: 18px; top: 0px; }
}
.big .effect-con { width: 500px; height: 80px;
    em { margin-left: 4px; }
}
.big .msg_text { width: 496px; height: 80px; }
.big .msg_send span label { margin-left: 7px; margin-right: 3px; }
.big .minTarget { width: 502px; height: 244px; }
.big .min-max { top: 2px; }
.big .min-max:before { margin-top: -9px; margin-left: 4px; }
.big .msg_effect ul li { height: 26px; line-height: 26px; width: 133px;
p { width: 85%; height: 26px; line-height: 26px; }}
</style>