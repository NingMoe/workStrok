<template>
<!-- 注释隐藏的功能, 不删 -->
    <div class="legendpic-panel">
        <div class="legendship" v-if="isShip">
            <img class="sp" src="../../assets/img/common/ship.png"/>
            <img class="sp1" src="../../assets/img/common/ship1.png"/>
        </div>
        <div class="legendpoi" v-if="state">
        	<img src="../../assets/img/common/tf.png"/>
            <img src="../../assets/img/common/radar_photo.png" />
            <img src="../../assets/img/common/maptl.png"/>
        </div>
         <span @click="hide(state)">{{text}}</span>
    </div>
</template>

<script>

    export default {
        data () {
            return {
                text: '图例',
                state: false
            }
        },
        vuex: {
            getters: {
                isShip: state => state.ship.status
            }
        },
        methods: {
            hide: function(state){
                this.state = !this.state;
            }
        }
    }
</script>

<style scoped lang="less">
.legendpic-panel{
    position: absolute;
    width:auto;
    height:auto;
    min-width: 30px;
    min-height: 20px;
    left: 0px;
    bottom: 0px;
    font-size: 14px;
    padding-right: 2px;
    background: #FFF;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
	box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
}
.legendpic-panel span{
    float: left;
    width: 32px;
    line-height: 20px;
    background:#27303F;
    color: #FFFFFF;
    cursor: pointer;
    text-align: center;
    position:absolute;
    top:0px;
    right:0px;
}
.legendpic-panel span:hover{background:#344157;}
.legendpoi{
	float: left;
}
.legendpoi img{
	display: block;
	margin-top:10px;
}
.legendship{float: left;}
.sp1{display: none;}
/*big*/
.big .sp{display: none;}
.big .sp1{display: block;}
</style>