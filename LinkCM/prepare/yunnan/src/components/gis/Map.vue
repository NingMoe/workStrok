<!--地图组件-->
<template>
    <div>
        <!--鼠标经纬度显示窗口-->
        <div id="mousePosition" class="mouse"></div>
    </div>
</template>

<script>

    // import lmap from '../../util/lmap/lmap'
    // import config from '../../config'
    // import { updateParam } from '../../vuex/store'

    export default {
        data() {
            return { }
        },
        vuex: {
            getters: {
                code: state => state.cityCode
            }
        },
        ready: function() {
            // let map = lmap.initMap('lmap');
            // config.addParam('map', map);
            // // 添加鼠标所在经纬度控件
            // lmap.controler.mousePosition(map, 'mousePosition');
        }
    }
</script>

<style>
.mouse {
    position: absolute;
    bottom: 0px;
    left: 50%;
    margin-left: -70px;
    z-index: 2;
    width: 140px;
    height: 25px;
    color: #fff;
    font-weight: bold;
    font-size: 14px;
    text-shadow: #76a6fd 1px 0 0, #76a6fd 0 1px 0, #76a6fd -1px 0 0, #76a6fd 0 -1px 0;
    -webkit-text-shadow: #76a6fd 1px 0 0, #76a6fd 0 1px 0, #76a6fd -1px 0 0, #76a6fd 0 -1px 0;
    -moz-text-shadow: #76a6fd 1px 0 0, #76a6fd 0 1px 0, #76a6fd -1px 0 0, #76a6fd 0 -1px 0;
    *filter: Glow(Color=#1F7ED0, Strength=1);
}
.mouse div {
    color: #fff;
}
</style>