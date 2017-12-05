<!--主题设置-->
<template>
    <div class="topicSet" 
		:style="{width:centainVal.wi+15+'px',marginLeft:-(centainVal.wi+15)/2+'px'}" 
		v-el:topic-win
		@mouseenter="drag()" @mouseleave="drag()">
		<div class="drag" v-show="isDrag" v-el:topic-set></div>
        <div class="topic-box">
        	<div v-el:input-box :style="{color:centainVal.color , fontSize:centainVal.fontsize+'px'}" class="inputwei">{{centainVal.val}}</div>
        	<input type="text" v-model="centainVal.val" @keyup="inputLenSet" placeholder="请输入主题" @focus=(centainVal.status=true)  :style="{color:centainVal.color , fontSize:centainVal.fontsize+'px'}"/>
        </div>
        <div class="topic-tools" v-if="centainVal.status">
        	<ul>
        		<li style="position: relative"><a class="font-color-box" @click=(colorplane.status=!colorplane.status) :style="{background:centainVal.color}"></a>
        			<ul class="color-selectbox" v-if="colorplane.status">
        				<li v-for="item in colorItems" :style="{background:item.color}" @click=(centainVal.color=item.color)></li>
        			</ul>
        		</li>
        		<li><span class="font"></span>
        			<div class=" font-select">
	        			<!--<select v-el:font-sizeop v-model="centainVal.fontsize" @change="inputLenSet">
	        				<option v-for="item in fontSizeItem") :value="item.value">{{item.value+'px'}}</option>
	        			</select>-->
	        			<v-select :defname="'centainVal.fontsize'" :def="centainVal.fontsize" :initvalue="centainVal.fontsize+'px'" :list="fontSizeItem"></v-select>
	        		</div>
        		</li>
        		<li><a class="btn delete" @click=(centainVal.val="",centainVal.wi=338) title="删除"></a></li>
        		<li><a class="btn close" @click="close" title="关闭"></a></li>
        		<li><a class="btn complete" @click="compeleteSet">完成</a></li>
        	</ul>
        </div>
    </div>
</template>

<script>
    import { updateParam } from '../../../vuex/store'
	import config from 'src/config'
    import WinDrag from 'util/tools/WinDrag'
    import Select from '../../common/Select'

    export default {
    	components:{'v-select':Select},
    	data(){
    		return {
    			centainVal:{'color':'#ED3F2B',"fontsize":"48",'status':false,"wi":338,"val":""},
    			colorplane:{'status':false,'color':'#ED3F2B','fontsize':"48"},
    			colorItems:[{'color':'#000000','class':'black','code':'16'},
                            {'color':'#6f706b','class':'dark-gray','code':'10'},
                            {'color':'#6f180e','class':'drak-red','code':'11'},
                            {'color':'#f28837','class':'orange','code':'02'},
                            {'color':'#266d28','class':'dark-green','code':'08'},
                            {'color':'#0e37b8','class':'deep-blue','code':'14'},
                            {'color':'#6d0b62','class':'deep-purple','code':'12'},
                            {'color':'#13807f','class':'dark-cyan','code':'06'},
                            {'color':'#ffffff','class':'white','code':'01'},
                            {'color':'#b3b5ae','class':'gray','code':'05'},
                            {'color':'#ed3f2b','class':'tomato','code':'03'},
                            {'color':'#ebde37','class':'khaki','code':'07'},
                            {'color':'#96c130','class':'lime-green','code':'09'},
                            {'color':'#0a78c8','class':'royal-blue','code':'15'},
                            {'color':'#d523c8','class':'orchid','code':'04'},
                            {'color':'#1ac1ca','class':'turquoise','code':'13'}],
                /*fontSizeItem:[{"value":"12"},{"value":"13"},{"value":"14"},
                			  {"value":"16"},{"value":"18"},{"value":"24"},
                			  {"value":"32"},{"value":"36"},{"value":"42"},
                			  {"value":"48"},{"value":"60"},{"value":"72"}],*/
               	fontSizeItem:[{"text":"12px","value":"12"},{"text":"13px","value":"13"},{"text":"14px","value":"14"},{"text":"16px","value":"16"},{"text":"18px","value":"18"},{"text":"24px","value":"24"},{"text":"32px","value":"32"},{"text":"36px","value":"36"},{"text":"42px","value":"42"},{"text":"48px","value":"48"},{"text":"60px","value":"60"},{"text":"72px","value":"72"}],
				isDrag: false,
    		}
    	},
    	props:['statusPop'],
        vuex: {
            actions: { updateParam }
        },
        methods: {
            close: function(){
                this.updateParam('tab','status',false);
                this.statusPop = false;
            },
            compeleteSet:function(){
            //	this.centainVal.fontsize = this.colorplane.fontsize;
            //	this.centainVal.color = this.colorplane.color;
            	this.colorplane.status = false;
            	this.centainVal.status = false;
            //	this.inputLenSet();
            },
            inputLenSet:function(){
            	var test = this;
            	setTimeout(function(){
            		var curwi = $(test.$els.inputBox).width();
            		// console.log(curwi);
            		test.centainVal.wi=(curwi>338?curwi:338);
            	},50);
            },
			drag: function() {
                this.isDrag = !this.isDrag;
            },
			/**使窗口支持拖动功能 */
			addWinDragEvt: function(elName){
				var map = config.getParam('map');
				let call = setInterval(()=>{
					let winObj = this.$els[elName];
					if(!!winObj)
						WinDrag.drag(winObj,this.$els.topicWin,map);
						clearInterval(call);
				},10);		
			}
        },
		compiled: function(){
			this.addWinDragEvt('topicSet');
		}
    }
</script>

<style scoped lang="less">
:-moz-placeholder {color:#ed3f2b;  }
::-moz-placeholder { color:#ed3f2b;}
input:-ms-input-placeholder,textarea:-ms-input-placeholder {color:#ed3f2b;}
input::-webkit-input-placeholder,textarea::-webkit-input-placeholder {color:#ed3f2b;}
    .topicSet{
    	position: absolute;
	    width: 300px;
	    left: 50%;
	    margin-left: -150px;
	    top:30px;
	    height:auto;
	    z-index:4;
	    background: #fff;
	    box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.3);
	    padding: 5px 0;
	}
	.topic-box{
		margin:0 5px;
		height: 100%;
		box-sizing: border-box;
	}
	.topic-box input{ 
		    min-width: 348px;
		    padding: 15px 0;
		    width: 100%;
		    height: auto;
		    border: 0;
		    font-size: 48px;
		    color: #ed3f2b;
		    text-align: center;
		    cursor: pointer;
		    background: 0;
		    font-family: "Microsoft Yahei";
		    list-style-type: none;
		    -webkit-text-size-adjust: none;
		    outline: 0;
	}
	.topic-tools{
		position: absolute;
		background: #fff;
		box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.3);
		right:0;
		border-bottom: 5px;
    	height: 26px;
    	padding:4px 0;
    	width: 260px;
    	bottom: -35px;
	}
	.topic-tools li{ float: left;cursor: default;}
	.font{
		background: url("../../../assets/img/common/A.png") no-repeat 4px 6px;
		display: inline-block;
		width: 25px;
    	height: 28px;
    	vertical-align: middle;
    	margin-right: 3px;
    	float: left;
	}
	.drag {
		width: 16px;
		height: 16px;
		z-index: 3;
		position: absolute;
		right: 2px;
		top: 2px;
		z-index: 10;
		cursor: move;
		background: url("../../../assets/img/common/drag.png") no-repeat center;
	}
	div.font-select{
		width:60px;
		float:left;
		margin-right:10px;
	}

	.btn{
		display: inline-block;vertical-align: middle;
		width:24px;height:24px;
		margin-left: 5px;
		cursor: pointer;
	}
	.delete{background:url("../../../assets/img/econtrol/delete.png") no-repeat center center;}
	.close{background:url("../../../assets/img/econtrol/close.png") no-repeat center center;}
	.complete{
		width:34px;
     	height: 22px;
     	line-height: 22px;
     	padding-left: 19px;
     	border: 1px solid #D6D6D6;
     	position: relative;
     	margin-left: 5px;
     	cursor: pointer;
     	background: -webkit-linear-gradient(#FEFEFE, #EEEEEE);
	    background: -o-linear-gradient(#FEFEFE, #EEEEEE); 
	    background: -moz-linear-gradient(#FEFEFE, #EEEEEE);
	    background: linear-gradient(#FEFEFE, #EEEEEE);
	}
.complete:before{
		content: "";
		display: inline-block;
		position: absolute;
		top:9px;
		left:6px;
		background:#666F7D;
		width: 2px;
		height: 9px;
		transform:rotate(-45deg);
		-ms-transform:rotate(-45deg); 	/* IE 9 */
		-moz-transform:rotate(-45deg); 	/* Firefox */
		-webkit-transform:rotate(-45deg); /* Safari 和 Chrome */
		-o-transform:rotate(-45deg); 
}
.complete:after{
	content: "";
	display: inline-block;
	position: absolute;
	top: 4px;
    left: 14px;
    background: #666F7D;
    width: 2px;
    height: 14px;
	transform:rotate(45deg);
	-ms-transform:rotate(45deg); 	/* IE 9 */
	-moz-transform:rotate(45deg); 	/* Firefox */
	-webkit-transform:rotate(45deg); /* Safari 和 Chrome */
		-o-transform:rotate(45deg); 
}
	.font-color-box{
		width:25px;
		height: 25px;
		border:1px solid #ddd;
		background: #ff0000;
		display: inline-block;
		margin:0 5px;
		cursor: pointer;
	}
	.color-selectbox{
		position:absolute;
		background: #F7F7F7;
		box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.3);
		top: 32px;
    	padding: 3px;
    	width:120px
	}
	.color-selectbox li{
		width:13px;
		height: 13px;
		background: #000;
		border: 1px solid #F7F7F7;
		cursor: pointer;
	}
	.inputwei{
		position: absolute;
		white-space: nowrap;
		overflow: hidden;
		height:0;
	}
/*big*/
.big .topicSet{top:45px}
.big .topic-tools{
	height:30px;
	line-height: 30px;
	width: 350px;
	bottom: -39px;
	.font-color-box{
		height:30px;
		width:30px;
	}
	.font{
		width:30px;
		height: 32px;
		background-position: center center !important;
	}
	div.font-select{
		width:90px;
	}
	.delete,.close{
		width:32px;
		height: 32px;
		margin-top:-3px;
		-webkit-background-size: 30px !important;
		-moz-background-size: 30px !important;
		background-size: 30px !important;
	}
	.complete{
		width:70px;
		height:30px;
		line-height: 30px;
		vertical-align: middle;
		margin-top:-3px;
	}
	.complete:before{
	    top: 12px;
	    left: 7px;
	    height: 15px;
	}
	.complete:after{
	    left: 20px;
	    height: 24px;
	}
}
</style>