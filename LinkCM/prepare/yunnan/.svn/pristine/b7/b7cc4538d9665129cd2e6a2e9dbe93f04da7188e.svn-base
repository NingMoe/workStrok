<template>
    <div class="cases-panel" v-show="isCases" :class="boxsize" v-el:case>
    	<a :class="size" @click="isBig = !isBig"></a>
        <a class="Close" @click="isCases = !isCases"></a>
        <div class="title nullbg">
        	<div>{{item.title}}</div>
        	<span class="time">{{item.crTime}}</span>
        	<span class="source">{{item.articleSource}}</span>
        </div>
        <div class="cases-box">{{{item.content}}}</div>
    </div>
</template>

<script>
    import config from 'src/config'
    import WinDrag from 'util/tools/WinDrag'

    export default {
        data () {
            return {
                item: {},
                isBig: false,
                isCases: false
            }
        },
        computed: {
            size: function(){
                var size = this.isBig ? 'casesbig' : 'casesmall';
                return size;
            },
            boxsize: function(){
                var size = this.isBig ? 'casesPanelBig' : 'casesPanelSmall';
                return size;
            }
        },
        methods: {
            close: function() {
                this.isCases = false;
            },
			/**使窗口支持拖动功能 */
			addWinDragEvt: function(elName){
				var map = config.getParam('map');
				let call = setInterval(()=>{
					let winObj = this.$els[elName];
					if(!!winObj)
						WinDrag.drag(winObj,winObj,map);
						clearInterval(call);
				},10);		
			}
        },
        ready: function(){
            this.addWinDragEvt('case');
        },
        detached: function(){
            
        }
    }
</script>

<style scoped lang='less'>
@import "../../../assets/css/common.less";
.casesPanelSmall{
	width:800px;
    height:481px;
	margin-left:-400px;
	.cases-box{
		max-height:400px;
	}
}
.casesPanelBig{
	width:1000px;
	margin-left:-500px;
	.cases-box{
		max-height:500px;
	}
}
.cases-panel{
    position: absolute;
    height:481px;
    overflow: hidden;
    left:50%;
    /*margin-top:200px;*/
    top:200px;
    background:#fff;
    z-index: 4;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    .title{
    	height:60px;
    	line-height: 26px;
    	border-bottom:1px solid #ccc;
    	div{
    		font-size:24px;
    		margin-top: 5px;
    		color: @color;
    	}
    	span{
    		margin-right: 10px;
    		font-size: 12px;
    	}
    }
    .cases-box{
    	height:auto;
    	overflow-y: auto;
    	background: #fff;
    	padding: 10px;
    }
}
.Close{
	    position: absolute;
	    right: 0;
	    top: 0;
	    height: 20px;
	    width: 20px;
	    background: url("../../../assets/img/toolsbar/rightIcon.png") no-repeat;
	    background-position: -153px -60px!important;
	    display: inline-block;
	    zoom: 1;
	    cursor: pointer;
}
.casesmall,.casesbig{
	position: absolute;
    right:20px;
    top: 0;
    height: 20px;
    width: 20px;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
}
.casesmall:before{
	content: "";
	display: inline-block;
	width:8px;
	height:8px;
	margin-top:5px;
	border:1px solid #ED3F2B;
}
.casesbig:before{
	content: "";
    display: inline-block;
    width: 8px;
    height: 1px;
    margin-top: 2px;
    background: #ED3F2B;
    vertical-align: middle;
}
.big .casesmall:before{
	margin-top: -10px;
    vertical-align: middle;
}
.big .casesbig:before{
    margin-top: -8px;
    vertical-align: middle;
}
</style>