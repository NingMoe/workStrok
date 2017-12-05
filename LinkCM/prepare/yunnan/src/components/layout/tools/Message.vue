<template>
    <div class="message" v-el:message>
        <div class="title" v-el:drag>
            <span>发布信息追踪</span>
            <a class="Close" @click="close"></a>
        </div>
        <div class="message-box">
            <div class="message-chose">
                <label>信息筛选：</label>
                <v-select :defname="'waysDefault'" :def="waysDefault" :list="waysList" :width="120"></v-select>
                <v-select :defname="'conDefault'" :def="conDefault" :list="conList" :width="120"></v-select>
                <a class="btnhover" @click="filterData()">确定</a>
                <label v-if="warnInfo == true">数据查询加载中...</label>
            </div>
            <v-messageline></v-messageline>
            <div class="message-content">
                <ul>
                    <template v-for="item in list">
                        <li class="messageSelect" v-if="$index >= minindex && $index < maxindex" @click="changeLineStatus(item.msg, item.id)">
                            <em class="emfocus" v-if="activeId == item.id"></em>
                            <div class="little">
                                <ul>
                                    <li v-for="it in item.list">{{it.text}}{{it.value}}</li>
                                    <li>状态：<label style="color:red;">{{ item.msg }}</label></li>
                                </ul>
                            </div>
                        </li>
                    </template>
                </ul>
            </div>
            <div class="control">
                <label>第{{ page.tp }}页/共{{ maxpage }}页 {{ list.length }}条记录</label>
                <font style="float:right">
                    <label class="btnhover" @click="exchange(-1)">上一页</label>
                    <label class="btnhover" @click="exchange(1)">下一页</label>
                </font>
            </div>
        </div>
    </div>
</template>

<script>

    import { updateParam } from '../../../vuex/store'
    import MessageLine from './MessageLine'
    import config from 'src/config'
    import WinDrag from 'util/tools/WinDrag'
    import Select from 'components/common/Select'

    export default {
        components: { 'v-messageline': MessageLine, 'v-select':Select },
        vuex: {
            getters: {
                dss: state => state.dss,
                cityCode: state => state.cityCode
            },
            actions: {
                updateParam
            }
        },
        data() {
            return {
                list: [],
                page: { showc: 6, tp: 1 },
                waysDefault: '请选择类型',
                waysList: [
                    { text: '请选择类型', value: 'def' },
                    { text: '渠道', value: '渠道' },
                    { text: '灾害', value: '灾害' },
                    // { text: '内容', value: '内容' }
                ],
                conDefault: '请选择内容',
                conList: [ { text: '请选择内容', value: 'def' } ],
                showIds: [],
                call: null,
                warnInfo: false,
                activeId: ''
            }
        },
        computed: {
            minindex: function() {
                return (this.page.tp - 1) * this.page.showc;
            },
            maxindex: function() {
                return this.page.tp * this.page.showc;
            },
            maxpage: function() {
                var mod = this.list.length % this.page.showc;
                var page = parseInt(this.list.length / this.page.showc);
                if (mod != 0) page += 1;
                return page;
            }
        },
        watch: {
            'waysDefault': function() {
                if (this.waysDefault != '请选择类型') {
                    var url = this.dss+'/target/target!getTypeByFilter.action';
                    var rdata = { filter: encodeURI(this.waysDefault) };
                    $.getJSON(url, rdata, (bdata) => {
                        this.conDefault = '请选择内容';
                        var arr = [];
                        arr.push(this.conList[0]);
                        bdata.forEach((item) => {
                            if (item.text != '') arr.push(item);
                        });
                        this.conList = arr;
                    });
                }
            },
            'page.tp': function() {
                var list = this.list;
                var ids = [];
                for (var i = this.minindex; i < this.maxindex; i++) {
                    if (!!list[i]) ids.push(list[i].id);
                }
                this.showIds = ids;
            }
        },
        methods: {
            changeLineStatus: function(msgText, msgId) {
                this.updateParam('message', 'text', msgText);
                this.activeId = msgId;
            }, 
            exchange: function(num) {
                if (this.page.tp == 1 && num < 0) return;
                if (this.page.tp == this.maxpage && num > 0) return;
                this.page.tp += num;
            },
            // 更新信息状态
            updateStat: function() {
                if (this.call) window.clearTimeout(this.call);
                this.call = setInterval(() => {
                    var allIds = this.showIds;
                    var url = this.dss+'/track/track!getTrackMsgById.action';
                    var ids = '';
                    allIds.forEach((item) => {
                        ids += item + ',';
                    });
                    ids = ids.substring(0, ids.length - 1);
                    ids = ids.trim();
                    if (ids) {
                        var qdata = { idArray: ids };
                        var list = this.list;
                        $.getJSON(url, qdata, (bdata) => {
                            let num = 0;
                            for (var key in list) {
                                var lId = list[key].id;
                                for (var idKey in bdata) {
                                    if (lId == bdata[idKey].id) {
                                        list[key].msg = bdata[idKey].msg;
                                    }
                                }
                            }
                        });
                    } else {
                        window.clearTimeout(this.call);
                    }
                }, 5000);
            },
            close: function() {
                this.updateParam('message', 'status', false);
                this.$parent.secondList.message.stat = false;
            },
            // 过滤信息
            filterData: function() {
                var obj = { '渠道': 'receiver', '灾害': 'kind_name', '内容': 'content' };
                var url = this.dss+'/track/track!getTrackMsgByFilter.action';
                let sql = '';
                if (this.conDefault !== '请选择内容') {
                    sql = obj[this.waysDefault] + " like " + "'%" + this.conDefault + "%' and main_code like '%" + this.cityCode + "%'";
                } else {
                    sql = "main_code like '%" + this.cityCode + "%'";
                }
                sql = encodeURI(sql);
                let qdata = { 'sql': sql };
                this.warnInfo = true;
                $.getJSON(url, qdata, (bd) => {
                    this.page.tp = 1;
                    this.warnInfo = false;
                    this.getUpdateIds(bd);
                    this.updateStat();
                });
            },
            // 获取需要更新的记录ID
            getUpdateIds: function(bd) {
                this.list = bd;
                let ids = [];
                let lenNum = bd.length;
                let showc = this.page.showc;
                lenNum = lenNum < showc ? lenNum : showc;
                for (var i = 0; i < lenNum; i++) {
                    ids.push(bd[i].id);
                }
                this.showIds = ids;
            },
            // 使窗口支持拖动功能
            addWinDragEvt: function(elName) {
                var map = config.getParam('map');
                let call = setInterval(() => {
                    let winObj = this.$els[elName];
                    if (!!winObj) WinDrag.drag(winObj, this.$els.message, map);
                    clearInterval(call);
                }, 10);
            }

        },
        ready: function() {
            var url = this.dss+'/track/track!getAllTrackMsgByCode.action';
            var qdata = { areaCode: this.cityCode };
            $.getJSON(url, qdata, (bd) => {
                if (bd.length > 0) {
                    this.activeId = bd[0].id;
                    this.changeLineStatus(bd[0].msg, bd[0].id);
                }
                this.getUpdateIds(bd);
                this.updateStat();
            });
            this.addWinDragEvt('drag');
        },
        detached: function() {
            if (!!this.call) clearInterval(this.call);
        }
    }
</script>

<style scoped lang="less">
.message { position: absolute; top: 200px; left: 50%; width: 700px; margin-left: -350px; height: auto; background-color: #fff; -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); z-index: 4; }
.Close { position: absolute; right: 0; top: 0; height: 20px; width: 20px; background: url("../../../assets/img/toolsbar/rightIcon.png") no-repeat; background-position: -153px -60px !important; display: inline-block; zoom: 1; cursor: pointer; }
.message-box { margin: 5px; }
.message-chose { padding: 8px 0px; height: 22px; line-height: 22px; }
.message-chose label { float: left; }
.message-chose a { padding: 0px 8px; margin-left: 10px; float: left; background: none; }
.message-content { width: auto; height: auto; overflow: hidden; clear: both;
    ul { width: 100%; height: auto; overflow: hidden;
        li { float: left; width: 48%; margin: 5px 1%; position: relative;
            .little { width: 100%; height: 112px; border: 1px solid #ccc; float: left;
                ul li { float: left; width: 100%; margin: 3px; text-align: left; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
            }
        }
        li.messageSelect em.emfocus { position: absolute; top: 2px; right: 0px; display: block; }
    }
}
.control { margin: 0px 1%; line-height: 24px; text-align: left; }

/*big*/
.big .message { position: absolute; top: 140px; width: 800px; margin-left: -400px; }
.big .message-chose { height: 30px; line-height: 30px; }
.big .message-content ul li .little { height: 164px }
.big .Close { top: 6px }
.big .control { height: 32px; }
</style>