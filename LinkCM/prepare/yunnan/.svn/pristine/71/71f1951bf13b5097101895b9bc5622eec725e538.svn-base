<template>
    <div>
        <div class="damage-panel poiPop panelhover" v-if="stat==true" v-el:demage>
            <a class="Close" @click="close()"></a>
            <div class="title" v-el:title>地址灾害风险隐患点：{{list.address}}</div>
            <div class="disBasicLeft popIcon">
                <ul>
                    <li class="li-before bf_4">
                        <label>人员伤亡</label>
                        <span>{{list.dpop}}死{{list.hpop}}伤</span>
                    </li>
                    <li class="li-before bf_5">
                        <label>影响群众</label>
                        <span>{{list.epop}}人</span>
                    </li>
                    <li class="li-before bf_6">
                        <label>经济损失</label>
                        <span>{{list.loss}}(万元)</span>
                    </li>
                    <li class="li-before bf_7">
                        <label>灾害等级</label>
                        <span>{{list.level}}</span>
                    </li>
                    <li title="{{list.address}}">行政区域：{{list.address}}</li>
                    <li title="{{list.principal}}">责任人：{{list.principal}}</li>
                    <li title="{{list.tele}}">电话：{{list.tele}}</li>
                    <li title="{{list.code  + '' + list.id}}">事件编号：{{list.code + '' + list.id}}</li>
                    <li title="{{list.ctTime}}">调查时间：{{pubTime}}</li>
                    <li title="{{list.lon}}, {{list.lat}}">经纬度：{{list.lon}}, {{list.lat}}</li>
                    <li title="{{list.detail}}">防治对策：{{list.detail}}</li>
                </ul>
            </div>
            <div class="disBasicRight">
                <div class="img-null">
                    <img src="../../assets/img/common/now-inform-0.png" v-if="list.picList.length==0 || !!list.picList==false" />
                    <v-picplay v-else :list="list"></v-picplay>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import lmap from '../../util/lmap/lmap'
import config from '../../config'
import TimeUtil from '../../util/tools/TimeUtil'
import {
    updateParam
} from '../../vuex/store'
import PicPlay from '../common/PicPlay'
import WinDrag from 'util/tools/WinDrag'

export default {
    components: {
        'v-picplay': PicPlay
    },
    data() {
        return {
            list: '',
            stat: false,
            activeStat: false //记录图标选中状态
        }
    },
    vuex: {
        getters: {
            dss_sj: state => state.dss_sj,
            dss: state => state.dss,
            code: state => state.cityCode,
            lonlat: state => state.damageBox.lonlat
        },
        actions: {
            updateParam
        }
    },
    computed: {
        pubTime: function() {
            var time = this.list.ctTime;
            if (time.indexOf('----') != -1) {
                return TimeUtil.format(time, 'yyyy年');
            } else {
                return TimeUtil.format(time, 'yyyy年MM月dd日');
            }
        }
    },
    watch: {
        lonlat: function(lonlat) {
            this.getDemageData(lonlat);
        }
    },
    methods: {
        close: function() {
            this.activeStat = false;
            this.controlActivePoint('');
            this.updateParam('damageBox', 'status', false);
        },
        getDemageData: function(lonlat) {
            var map = config.getParam('map');
            var zoom = map.getView().getZoom() + '';
            var url = this.dss+'/demage/demage!queryDemageDataByClick.action';
            var qdata = {
                PARAM: {
                    code: this.code,
                    lon: lonlat[0],
                    lat: lonlat[1],
                    zoom: zoom
                }
            };
            qdata.PARAM = JSON.stringify(qdata.PARAM);
            $.getJSON(url, qdata, (bd) => {
                if (!!bd.id) {
                    bd.dpop = bd.dpop == '' ? 0 : bd.dpop;
                    bd.hpop = bd.hpop == '' ? 0 : bd.hpop;
                    this.list = bd;
                    this.stat = true;
                    this.activeStat = true;
                    this.controlActivePoint('demage#' + bd.lon + "#" + bd.lat);
                    this.addWinDragEvt('title');
                }
            });
        },
        /**图标选中 */
        controlActivePoint: function(val) {
            this.updateParam('activePoint', 'point', val)
        },
		/**使窗口支持拖动功能 */
        addWinDragEvt: function(elName) {
            var map = config.getParam('map');
            let call = setInterval(() => {
                let winObj = this.$els[elName];
                if (!!winObj)
                    WinDrag.drag(winObj, this.$els.demage, map);
                clearInterval(call);
            }, 10);
        }
    },
    ready: function(){
        this.getDemageData(this.lonlat);
    },
    detached: function(){
        this.stat = false;
        if(this.activeStat){
            this.activeStat = false;
            this.controlActivePoint('');
        }
    }
}
</script>
<style scoped="scoped" lang="less">
@import "../../assets/css/common.less";
.poiPop {
    width: 616px;
    height: auto;
    position: absolute;
    z-index: 3;
    right: 0;
    top: 0px;
    background: #fff;
    -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}

.Close {
    position: absolute;
    right: 0;
    top: 0;
    height: 20px;
    width: 20px;
    background: url("../../assets/img/toolsbar/rightIcon.png") no-repeat;
    background-position: -153px -60px!important;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
}

.disBasicLeft {
    float: left;
    width: 159px;
    height: auto;
    overflow: hidden;
    margin-left: 5px;
}

.popIcon ul {
    width: 100%;
}

.popIcon ul li {
    line-height: 26px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.popIcon ul li.li-before {
    width: 50%;
    text-align: center;
    margin: 8px 0px 10px 0px;
    line-height: 22px;
    float: left;
}

.popIcon ul li.li-before:before {
    content: "";
    display: block;
    height: 40px;
}

.popIcon ul li.bf_4:before {
    background: url('../../assets/img/dis/04.png') no-repeat center 8px;
}

.popIcon ul li.bf_5:before {
    background: url('../../assets/img/dis/03.png') no-repeat center 8px;
}

.popIcon ul li.bf_6:before {
    background: url('../../assets/img/dis/01.png') no-repeat center 8px;
}

.popIcon ul li.bf_7:before {
    background: url('../../assets/img/dis/02.png') no-repeat center 8px;
}

.popIcon ul li label {
    display: block;
}

.popIcon ul li span {
    display: block;
    color: @color;
    font-size: 14px;
    font-weight: 700;
}

.disBasicRight {
    float: right;
    width: 438px;
    height: auto;
    overflow: hidden;
    margin-right: 3px;
    margin-bottom: 0;
}

.img-null img {
    width: 438px;
    height: 374px;
    margin-top: 7px;
}

.panelhover {
    -webkit-transition: box-shadow .3s;
    -moz-transition: box-shadow .3s;
    -o-transition: box-shadow .3s;
    transition: box-shadow .3s;
}

.panelhover:hover {
    -webkit-box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.3);
    box-shadow: 0 0px 15px 0 rgba(0, 0, 0, 0.3);
}


/*big*/

.big .poiPop {
    width: 786px;
    .disBasicLeft {
        width: 256px;
        ul li {
            line-height: 34px;
        }
    }
    .popIcon ul li span {
        font-size: 20px;
    }
    .disBasicRight {
        width: 520px;
    }
    .img-null img {
        width: 520px;
        height: 475px;
    }
}
</style>
