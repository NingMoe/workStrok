<template>
   <!--  <div class="opacity-panel">
        <div class="layer-slider" id="layer-slider"></div>
        <div style="text-align: center;"><span v-for="item in opacityItems">{{item.text}}、</span>透明度：{{value}}%</div>
    </div> -->
</template>

<script>
    import { updateParam } from '../../../vuex/store'

    import 'jquery-ui/ui/widgets/slider'
    import 'jquery-ui/themes/base/slider.css'
    import 'jquery-ui/themes/base/theme.css'

    export default {
        data () {
            return {
                opacityItems: {
                    'model':{'text':'模型'},
                    'radar':{'text':'雷达'},
                    'cloud':{'text':'云图'},
                },
                value: 100,
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                model : state => state.model.layer,
                dropzone : state => state.dropzone.layer,
                radar : state => state.radar.layer,
                cloud : state => state.cloud.layer,
                opacity : state => state.opacity.value
            },
            actions: {
                updateParam
            }
        },
        methods: {
            close: function() {
                this.$parent.list.opacity.stat = false;
            }
        },
        ready: function(){
            this.value = this.opacity;
            $('#layer-slider').slider({
                step : 5,
                min : 0,    
                max : 100,
                value : this.value,
                slide : (event, ui) => {
                    var value = ui.value;
                    this.value = value;
                    this.updateParam('opacity', 'value', value);
                    if (this.model) {
                        this.model.setOpacity(value / 100);
                    }
                    if (this.dropzone) {
                        this.dropzone.setOpacity(value / 100);   
                    }
                    if (this.radar) {
                        this.radar.setOpacity(value / 100);
                    }
                    if (this.cloud) {
                        this.cloud.setOpacity(value / 100);
                    }
                }
            });
        }
    }
</script>

<style scoped lang="less">
 @import "../../../assets/css/common.less";
.opacity-panel{
    width: 240px;
    height: 45px;
    position: absolute;
    right: 23px;
    top: 38px;
    margin-right: -120px;
    padding-top: 5px;
    background: #FFF;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
}
.opacity-panel span:hover{color:@colorH;}
.opacity-panel:before{
	content: "";
	display: inline-block;
	position: absolute;
	top: -7px;
	left: 50%;
	margin-left: -5px;
	width: 0;
	height: 0;
	border-left: 10px solid transparent;
	border-right:10px solid transparent;
	border-bottom: 10px solid #fff;
}
.ui-widget-content{
	width: 87%;
	margin: 5px 5%;
	height: 6px;
	border: 1px solid #ccc;
	background: @color;
}
/*big*/
.big .opacity-panel{
    width: 326px;
    height: 45px;
}
.big .opacity-panel:before{
	margin-left: 18px;
}
</style>