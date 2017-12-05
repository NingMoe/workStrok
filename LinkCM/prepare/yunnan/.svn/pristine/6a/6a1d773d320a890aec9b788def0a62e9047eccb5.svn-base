<template>
    <div class="param-panel">
        <template v-for="item in list">
            <div class="min-rectangle" v-if="actives($key)" @click="showPanel($key)">{{ item.name }}</div>
        </template>
        <!-- <v-heavyrainfall v-if="list.heavyRainfall.status==true"></v-heavyrainfall> -->
        <!-- <v-gale v-if="list.gale.status==true"></v-gale> -->
        <!-- <v-temp v-if="list.temp.status==true"></v-temp> -->
        <!-- <v-waterlogging v-if="list.waterLogging.status==true"></v-waterlogging> -->
        <!-- <v-firedanger v-if="list.fireDanger.status==true"></v-firedanger> -->
        <v-pollutantdispersion v-if="list.pollutantDispersion.status==true"></v-pollutantdispersion>
        <v-mt v-if="list.mt.status==true"></v-mt>
    </div>
</template>

<script>

    import { updateParam } from '../../../vuex/store'
    // import HeavyRainfall from './HeavyRainfall'
    // import Gale from './Gale'
    // import Temp from './Temp'
    // import WaterLogging from './WaterLogging'
    // import FireDanger from './FireDanger'
    import PollutantDispersion from './PollutantDispersion'
    import Mt from './Mt'

    export default {
        components: {
            // 'v-heavyrainfall': HeavyRainfall, 'v-gale': Gale, 'v-temp': Temp,
            // 'v-waterlogging': WaterLogging, 'v-firedanger': FireDanger,
            'v-pollutantdispersion': PollutantDispersion, 'v-mt': Mt
        },
        data() {
            return {
                list: {
                    // gale: { name: "大风", status: false} ,
                    // heavyRainfall: { name: "强降水", status: false },
                    // temp: { name: "温度", status: false },
                    // waterLogging: { name: "内涝", status: false },
                    // fireDanger: { name: "森林火点", status: false },
                    mt: { name: "漫滩", status: false },
                    pollutantDispersion: { name: "污染扩散", status: false },
                    typhoon: { name: "台风", status: false },
                    site: { name: "监测站", status: false }
                }
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                pType: state => state.model.pType,
                typhoon: state => state.typhoon.status,
                site: state => state.site.status
            },
            actions: { updateParam }
        },
        methods: {
            actives: function(type) {
                var status = false;
                if (type != 'typhoon' && type != 'site') {
                    if (type == this.pType) {
                        status = true;
                        if (type === 'pollutantDispersion') {
                            window.setTimeout(() => {
                                this.list.pollutantDispersion.status = true;
                            }, 10);
                        }
                    }
                } else {
                    if (type == 'typhoon') {
                        if (this.typhoon) status = true;
                    } else if (type == 'site') {
                        if (this.site) status = true;
                    } else {
                        // if(this.typhoon) return true;
                        // else return false;
                        return false;
                    }
                }
                return status;
            },
            // 展示操作面板
            showPanel: function(type) {
                var item = this.list[type].status;
                if (item) item = false;
                else item = true;
                this.canncelAllPanel();
                if (type == 'typhoon' || type == 'site') {
                    if (type == 'typhoon') {
                        this.updateParam('typhoon', 'winStatus', item);
                    } else {
                        this.updateParam('site', 'winStatus', item);
                    }
                } else {
                    this.list[type].status = item;
                }
            },
            canncelAllPanel: function() {
                var list = this.list;
                for (var key in list) {
                    if (list[key].status) list[key].status = false;
                }
            }

        },
        watch: {
            pType: function(){
                this.canncelAllPanel();
            }
        },
        detached: function(){ // 销毁时调用
            this.canncelAllPanel();
        }
    }
</script>

<style scoped lang="less">
@import "../../../assets/css/common.less";
.param-panel { position: absolute; right: 0px; top: 0px; z-index: 2; width: 40px; height: auto; }
.min-rectangle { cursor: pointer; width: 29px; margin-bottom: 5px; padding: 0 5px; height: 30px; line-height: 15px; letter-spacing: 1px; cursor: pointer; background: #fff; -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3); text-align: center; display: -webkit-box; display: -moz-box;/*Firefox (buggy)*/ display: -ms-flexbox;/*IE 10*/ display: -webkit-flex;/*Chrome 21+*/ display: flex;/*Opera 12.1, Firefox 22+*/ -webkit-box-align: center; -moz-box-align: center; -ms-flex-align: center; -webkit-align-items: center;/**/ align-items: center;        /**/ -webkit-box-pack: center; -moz-box-pack: center; -ms-flex-pack: center;/**/ -webkit-justify-content: center;/**/ justify-content: center; }
.min-rectangle:hover { background: @color; color: #fff; }
.s-item { display: block; }
.un-item { display: none; }

/*big*/
.big .param-panel { width: 58px; height: 56px;
    .min-rectangle { width: 56px; height: 56px; line-height: 23px; }
}
</style>