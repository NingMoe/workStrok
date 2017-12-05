<template>
    <div class="picplay">
        <div class="picbox">
            <!--农情的图片展示 大图片-->
            <div class="picshow">
                <label @click="prePic()" class="prepic"></label>
                <label @click="nextPic()" class="nextpic"></label>
                <img :src="showPic" class="picimg" :class="picPlay" @click="showBigPic()">
            </div>
            <div class="picList">
                <ul class="pic-list">
                    <li class="smallPre" @click="prePic()"></li>
                    <!--农情的图片展示 小图片-->
                    <template v-for="it in list.picList">
                        <li v-if="$index >= minindex && $index <= maxindex" @click="exchange($index)" @mouseover.stop.prevent="stopPlay()" @mouseout.stop.prevent="autoPlay()" :style="outLine($index)" track-by="$index">
                            <img :src="getPicList(it)" style="width:70px;">
                        </li>
                    </template>
                    <li class="smallNext" @click="nextPic()"></li>
                </ul>
            </div>
        </div>
        <div class="big_pic" v-if="bigStat==true" v-el:bigpic>
            <a class="big_pic_close" @click="closeBigPic"></a>
            <img :src="getBigPic()" class="picimg">
        </div>
    </div>
</template>

<script>
    import config from '../../config'
    import WinDrag from 'util/tools/WinDrag'

    export default {
        props: ['list','count'],
        data() {
            return {
                num: 0,min: 0, max: 0,call: null,
                isPrev: false,
                isNext: false,
                page: {
                    min: 0,
                    max: 4
                },
                exchangeStat: false,//用于控制图片动画状态
                bigStat: false,//放大图片
                bigNum: 0//大图片索引
            }
        },
        computed: {
            showPic: function(){
                var url = (this.list.picList)[this.num];
                this.isNext = true;
                this.isPrev = false;
                return url;
            },
            minindex: function(){
                let num = this.num - this.page.max;
                if(num>0){
                    return this.page.min + num;
                }else{
                    return this.page.min;
                }
            },
            maxindex: function(){
                let num = this.num - this.page.max;
                if(num>0){
                    return this.page.max + num;
                }else{
                    return this.page.max;
                }
            },
            picPlay: function(){
                if(this.exchangeStat)
                    return "";
                else
                    return {'out':this.isPrev,'in':this.isNext};
            }
        },
        watch: {
            list: function(){
                this.max = (this.list.picList).length;
                if(this.max < 4)
                    this.page.max = this.max -1;
                this.num = 0;
            }
        },
        methods: {
            /**小图片的边框颜色
             * @param index 数组索引
            */
            outLine: function(index){
                var style = { border: '2px solid #fff' }
                if(this.num == index)
                    style.border = '2px solid red';
                return style;
            },
            getPicList: function(name){
                return name;
            },
            /**切换图片 */
            exchange: function(index){
                this.num = index;
                this.autoPlay();
                this.exchangeStat = true;
                // this.isPrev = false; 
                // this.isNext = true;
            },
            prePic: function(){
                // -- this.num;
                if(this.num<=this.minindex) this.num = this.maxindex;
                else -- this.num;
                this.isPrev = true; 
                this.isNext = false;
            },
            nextPic: function(){
                if(this.num < this.max-1) ++ this.num;
                else this.num = 0;

                if(this.max == 1)
                    this.exchangeStat = true;
                else
                    this.exchangeStat = false;
                // this.isPrev = true; 
                // this.isNext = false;
            },
            autoPlay: function(){
                this.clearCall();
                this.call = setInterval(()=>{
                    this.nextPic();
                },6000);
            },
            stopPlay: function(){
                this.clearCall();
            },
            clearCall: function(){
                if(!!this.call){
                    clearInterval(this.call);
                    this.call = null;
                }
            },
            /**显示大图 */
            showBigPic: function(){
                this.bigNum = this.num;
                this.bigStat = true;
                this.addWinDragEvt('bigpic');
            },
            /**关闭大图 */
            closeBigPic: function(){
                this.bigStat = false;
            },
            /**获取大图 */
            getBigPic: function(){
                return (this.list.picList)[this.bigNum];
            },
			/**使窗口支持拖动功能 */
			addWinDragEvt: function(elName){
				var map = config.getParam('map');
				let call = setInterval(()=>{
					let winObj = this.$els[elName];
					if(!!winObj)
						WinDrag.drag(winObj,this.$els[elName],map);
						clearInterval(call);
				},10);		
			}
        },
        compiled: function(){
            if(!!this.count)
                this.page.max = this.count;

            this.max = (this.list.picList).length;
            if(this.max > 0){
                if(this.max < 4)
                    this.page.max = this.max -1;
                // this.clearCall();
                this.autoPlay();
            }
        },
        detached: function(){
            this.clearCall();
            this.num = 0;
            this.closeBigPic();
        }
    }
</script>

<style scoped lang="less">
    .picplay {
        width:100%;
        height:auto;
        background-color:#fff;
    }
    .picshow{
    	position: relative;
    	height: auto;
    }
    .pic-list {
        width: auto;
        height: 63px;
        overflow-y: hidden;
    }
    .prepic,.nextpic{
    	position: absolute;
    	top: 50%;
    	margin-top: -13px;
    	height:26px;
    	width: 26px;
    	cursor: pointer;
    	z-index: 1;
    	background: rgba(0,0,0,0.5);
    	-webkit-border-radius: 100%;
    	-moz-border-radius: 100%;
    	border-radius: 100%;
    	-webkit-transition: box-shadow .3s;
		-moz-transition: box-shadow .3s;
		-o-transition: box-shadow .3s;
		transition: box-shadow .3s;
    }
    .prepic:hover,.nextpic:hover{
    	background: rgba(0,0,0,0.8);
    	-webkit-box-shadow:0 0px 15px 0 rgba(255, 255, 255, 1);
		-moz-box-shadow:0 0px 15px 0 rgba(255, 255, 255, 1);
		box-shadow:0 0px 15px 0 rgba(255, 255, 255, 1);
    }
    .prepic:before,.nextpic:before{
    	position: absolute;
    	display: inline-block;
    	top: 0;
    	left: 0;
    	width: 26px;
    	height: 26px;
    	line-height:26px;
    	text-align: center;
    	color:#FFFFFF;
    	-webkit-border-radius: 100%;
    	-moz-border-radius: 100%;
    	border-radius: 100%;
    }
    .prepic:before{
    	content: "＜";	
    }
    .nextpic:before{
    	content: "＞";	
    }
    .prepic{
    	left: 5px;
    }
    .nextpic{
    	right:5px;
    }
    .picimg{
    	width: 100%;
    	position:relative;
    }
    .wechat-pic .picimg{height:432px;}
    .wechat-pic .big_pic .picimg{height:100%;}
    .disBasicRight .picimg{height:312px;}
    .disBasicRight .big_pic .picimg{height: 100%;}
    .agr .picimg{height:330px;}
    .agr .big_pic .picimg{height:100%;}
    .picList {
    	width: 100%;
    	height: auto;
    	overflow: hidden;
        ul li {
            float:left; 
            margin-right:2px;
            height: 55px;
            img{
            	height: 55px;
            }
        }
        .smallPre,.smallNext{
        	height: 60px;
        	line-height: 60px;
        	cursor: pointer;
        	position: relative;
        	width: 14px;
        }
        .smallPre:before,.smallPre:after,.smallNext:before,.smallNext:after{
        	content: "";
			display: inline-block;
			position: absolute;
			background:#ADAEB1;
			width:12px;
			height:2px;
			left:1px;
        }
        .smallPre:before{
			top:28px;
			transform:rotate(-45deg);
			-ms-transform:rotate(-45deg); 	/* IE 9 */
			-moz-transform:rotate(-45deg); 	/* Firefox */
			-webkit-transform:rotate(-45deg); /* Safari 和 Chrome */
			-o-transform:rotate(-45deg); 
        }
        .smallPre:after{
			top:36px;
			transform:rotate(45deg);
			-ms-transform:rotate(45deg); 	/* IE 9 */
			-moz-transform:rotate(45deg); 	/* Firefox */
			-webkit-transform:rotate(45deg); /* Safari 和 Chrome */
			-o-transform:rotate(45deg); 
        }
        .smallNext:before{
			top:28px;
			transform:rotate(-135deg);
			-ms-transform:rotate(-135deg); 	/* IE 9 */
			-moz-transform:rotate(-135deg); 	/* Firefox */
			-webkit-transform:rotate(-135deg); /* Safari 和 Chrome */
			-o-transform:rotate(-135deg); 
        }
        .smallNext:after{
			top:36px;
			transform:rotate(-45deg);
			-ms-transform:rotate(-45deg); 	/* IE 9 */
			-moz-transform:rotate(-45deg); 	/* Firefox */
			-webkit-transform:rotate(-45deg); /* Safari 和 Chrome */
			-o-transform:rotate(-45deg); 
        }
}
 .out{
        animation:out 0.5s infinite;
		-webkit-animation:out 0.5s infinite; /*Safari and Chrome*/
		-moz-animation:out 0.5s infinite; /*Safari and Chrome*/
		-webkit-animation-delay:6s;
		-moz-animation-delay:6s;
		animation-delay:6s;
    }
.in{
     animation:in 3s alternate infinite;
      -webkit-animation:in 3s alternate infinite;
      -moz-animation:in 3s alternate infinite;
    }
   @-webkit-keyframes out{
        0% {opacity: 1;}
        100% {opacity: 0;}
    }
    @keyframes out{
        0% {opacity: 1;}
        100% {opacity: 0;}
    }
    @-weblit-keyframes in{
        0% {opacity: 0;}
        100% {opacity: 1;}
    }
    @keyframes in{
        0% {opacity: 0;}
        100% {opacity: 1;}
    }
    .big_pic {
        position: fixed;
        width:800px;
        height:600px;
        padding:10px;
        left: 50%;
        margin-left:-400px;
        top: 130px;
        /*margin-top:-250px;*/
        background-color:#fff;
        border:1px solid #ccc;
        z-index: 6;
        .big_pic_close{
        	position: absolute;
        	display: inline-block;
        	right: -10px;
        	top: -10px;
        	width: 26px;
        	height: 26px;
        	background: #FFFFFF;
        	z-index: 1;
        	cursor: pointer;
        	-webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
       		 box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
       		 -webkit-border-radius: 100%;
       		 -moz-border-radius: 100%;
       		 border-radius: 100%;
        }
        .big_pic_close:before{
        	content: "×";
        	display: inline-block;
        	width: 26px;
        	height: 26px;
        	font-weight: bold;
        	text-align: center;
        	line-height: 26px;
        	color: red;
        	font-size:20px;
        }
        .big_pic_close:hover{
        	-webkit-box-shadow: 0 2px 8px 0 rgba(0,0,0,.5);
       		 box-shadow: 0 2px 8px 0 rgba(0,0,0,.5);
        }
    }

.big .disBasicRight .picimg{height:421px;}
.big .disBasicRight .big_pic .picimg{height: 100%;}
.big .agr .picimg{height:410px;}
.big .agr .big_pic .picimg{height:100%;}
</style>