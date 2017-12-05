<!--关于系统-->
<template>
    <div class="about" v-el:about>
    	<a class="Close" @click="close()"></a>
        <div class="title">
            <span>应急指挥决策辅助系统</span>
        </div>
        <div class="version-con">
            <div class="version-option">
                <ul>
                    <li>当前版本：
                        <label style="color:#757575;margin-right:75px;">V4.0</label>
                        值班电话：<label style="color:#757575;">188 1840 1760</label>
                    </li>
                    <li>技术支持：
                        <label style="color:#757575;margin-right:18px;">数鹏通（LinkCM）科技</label>
                        企业QQ800：<label style="color:#757575">2853098227</label>
                    </li>
                    <li class="loadingrt">
                        <label>视频插件下载VLC：</label>
                        <a href="http://10.148.16.56/soft/VLC-x86.exe">VLC下载</a>
                    </li>
                    <li class="loadingrt">
                        <label>推荐的浏览器IE11：</label>
                        <a href="http://10.148.16.56/soft/IE11-x86.exe">32位下载</a>
                        <a href="http://10.148.16.56/soft/IE11-x64.exe">64位下载</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { updateParam } from '../../../vuex/store'
    import config from 'src/config'
    import WinDrag from 'util/tools/WinDrag'

    export default {
        vuex: {
            actions: { updateParam }
        },
        methods: {
            close: function(){
            	this.updateParam('about','status',false);
                this.$parent.secondList.about.stat = false;
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
        compiled: function(){
            this.addWinDragEvt('about');
        }
    }
</script>

<style scoped lang="less">
 @import "../../../assets/css/common.less";
    .about{
        position: absolute;
        top: 200px;
        width: 400px;
        left: 50%;
        margin-left: -200px;
        background: #fff;
        z-index: 2;
        -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
        -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
	    box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
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
    .version-con{
        background: #fff;
        margin:10px;
        height: auto;
        overflow: hidden;
        ul li{
        	height:26px;
        	line-height:26px;
        	text-align: left;
        }
        .loadingrt{
        	margin-top:10px;
        	a{
        		display: inline-block;
        		padding-left: 20px;
        		background: url("../../../assets/img/common/version-option-a.png") no-repeat left center;
        		color: @color;
        		margin-right: 20px;
        	}
        }
    }
    
/*big*/
.big .about{
	width:608px;
	margin-left: -304px;
}
.big .version-con ul li{height:36px;line-height: 36px;}
.big .loadingrt{
        	a{
        		padding-left: 30px;
        		-webkit-background-size:22px;
        		-moz-background-size:22px;
        		background-size:22px;
        	}
        }
</style>