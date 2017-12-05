<!--意见箱-->
<template>
    <div class="suggestion" v-el:suggestion>
        <div class="title" v-el:title>
            <span>意见反馈</span>
            <a class="Close" @click="close()"></a>
        </div>
        <div class="suggestion-box" id="Suggestion-scroll">
	        <p class="explain">感谢您使用{{ areaName }}应急指挥决策辅助系统！请告诉我们您对本站的意见和建议，我们会参考您的反馈不断优化我们的产品和服务。
	            <br>值班电话：18818401760&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;QQ800：2853098227</p>
	        <div class="question">
	            <div class="dialog">
	                <textarea id="text-plugin-main" placeholder="请输入您要反馈的意见"></textarea>
	            </div>
	            <div class="submit-btn">
	            	<!-- <div class="word-prompt"><span>最多数字1000，已输入字符</span><em>0</em>，剩余字符数<em>1000</em></div> -->
		            <a class="btn btnhover" @click="saveQ(1)">提交</a>
		            <a class="btn btnhover" @click="clearQ()">清空</a>
		        </div>
	        </div>
	        <div class="reply">
	            <div class="title">
	                <span>历史意见：</span>
	                <a class="btn" @click="localList()">{{localText}}</a>
	            </div>
	            <div class="mainreply">
	                <ul>
	                    <li v-for="item in questionItems | orderBy 'id' -1">
	                        <div class="questionBox">
	                            <div class="asker">
	                            	<span>{{item.fromUser}}：</span>
	                           		<label>{{{item.content}}}</label>
	                            </div>
	                            <div class="answer">
		                            <span>{{item.time}}</span>
		                            <a v-if="item.fromUser !== userName" @click="replyQ(item)">{{item.replyText}}</a>
		                        </div>
	                            <ul>
	                                <li v-for="reply in item.reply | orderBy 'id' -1">
	                                    <div class="replyBox" v-if="reply.fromUser !== userName">
	                                        <span>{{reply.fromUser}}</span> 回复 <span>{{reply.toUser}}</span>
	                                        <label>{{{reply.content}}}</label>
	                                        <div class="answer">
	                                        	<span class="replyTime">{{reply.time}}</span>
	                                      	    <a class="" v-if="reply.fromUser !== userName" @click="replyQ(item, reply)">{{reply.replyText}}</a>
	                                      	</div>
	                                   </div>
	                                </li>
	                            </ul>
	                            <div :id="'text-plugin-'+item.id" style="display: none;">
	                                <textarea placeholder="请输入您要反馈的意见" style="display: none;"></textarea>
	                                <div class="submit-btn">
		                                <a class="btn btnhover" @click="saveQ(0, item.id)">提交</a>
		                                <a class="btn btnhover" @click="clearQ(item.id)">清空</a>
		                            </div>
	                            </div>
	                        </div>
	                    </li>
	                </ul>
	            </div>
	        </div>
	     </div>
    </div>
</template>

<script>

    
    import { updateParam } from '../../../vuex/store'
    import config from 'src/config'
    import WinDrag from 'util/tools/WinDrag'
    import { EditorInit } from '../../../util/wysiwyg/js/wysiwyg-editor'

    export default {
        data () {
            return {
                questionItems: [],
                localText: '只看本市县',
                localState: false,
                userName: '省局用户',
                tempData: {}
            }
        },
        vuex: {
            getters: {
                dss: state => state.dss,
                code: state => state.cityCode,
                areaName: state => state.areaName
            },
            actions: {
                updateParam
            }
        },
        methods: {
            replyQ: function(parent, child, to) {
                var $main = $('#text-plugin-' + parent.id);
                var $textarea = $main.find('textarea');
                var $div = $textarea.parent().parent();
                var css = $div.attr('class');
                var id = parent.id;
                this.tempData[id] = {};
                if (!child) {
                    if (parent.replyText === '取消') {
                        parent.replyText = '回复';
                        $main.hide();
                        this.tempData[id] = {};
                    } else {
                        $main.show();
                        if (this.tempData[id].id != parent.id) {
                            this.tempData[id].replyText = '回复';
                        }
                        parent.replyText = '取消';
                        this.tempData[id] = parent;
                    }
                } else {
                    if (child.replyText === '取消') {
                        child.replyText = '回复';
                        parent.replyText = '回复';
                        $main.hide();
                        this.tempData[id] = {};
                    } else {
                        $main.show();
                        if (this.tempData[id].id != child.id) {
                            this.tempData[id].replyText = '回复';
                        }
                        child.replyText = '取消';
                        this.tempData[id] = child;
                    }
                }
                if (css) {
                    EditorInit($textarea);
                }
            },
            clearQ: function(id) {
                if (id) {
                    $('#text-plugin-' + id).find('textarea').wysiwyg("shell").setHTML('');
                } else {
                    $('#text-plugin-main').wysiwyg("shell").setHTML('');
                }
            },
            saveQ: function(state, id) {
                var pid, from, to, content, $el;
                if (state) {
                    pid = 0;
                    from = this.userName;
                    to = '';
                    $el = $('#text-plugin-main').wysiwyg("shell");
                    content = $el.getHTML();
                } else {
                    pid = this.tempData[id].id;
                    from = this.userName;
                    to = this.tempData[id].fromUser;
                    $el = $('#text-plugin-' + id).find('textarea').wysiwyg("shell");
                    content = $el.getHTML();
                }
                $.ajax({
                    url: this.dss+'/feedBack/feed-back!sendMsg.action',
                    type: "post",
                    data: {
                        pid: pid,
                        from: encodeURIComponent(from),
                        to: encodeURIComponent(to),
                        content: encodeURIComponent(content)
                    },
                    success: () => {
                        this.getList();
                        this.localState = false;
                        $el.setHTML('');
                    }
                });
            },
            localList: function(){
                this.tempData = {};
                var userName;
                if (this.localState) {
                    userName = this.userName;
                    this.localText = '返回';
                } else {
                    this.localText = '只看本市县';
                }
                this.localState = !this.localState;
                this.getList(userName);
            },
            getList: function(userName) {
                $.ajax({
                    url: this.dss+'/feedBack/feed-back!getMsg.action',
                    data: { 'from': userName },
                    type: 'POST',
                    dataType: 'json',
                    success: (data) => {
                        var temp = data;
                        temp.forEach(function(data) {
                            data.isTextBox = false;
                            data.replyText = '回复';
                            data.reply.forEach(function(temp) {
                                temp.replyText = '回复';
                            });
                        });
                        this.questionItems = temp;
                    }
                });
            },
            close: function(){
                this.updateParam('suggestion', 'status', false);
                this.$parent.secondList.suggestion.stat = false;
            },
			/**使窗口支持拖动功能 */
			addWinDragEvt: function(elName){
				var map = config.getParam('map');
				let call = setInterval(()=>{
					let winObj = this.$els[elName];
					if(!!winObj)
						WinDrag.drag(winObj,this.$els.suggestion,map);
						clearInterval(call);
				},10);		
			}
        },
        ready: function(){
            if (this.code === '44') {
                this.userName = '省局用户'
            } else {
                let that = this;
                $.ajax({
                    url: this.dss+'/AreaTab/area-tab!getFullNameByCode.action',
                    async: false,
                    dataType: 'text',
                    type: 'GET',
                    data: { code: this.code },
                    success: function(userName){
                        that.userName = userName + '用户';
                    }
                });
            }
            EditorInit($('#text-plugin-main'));
            this.getList();
            this.addWinDragEvt('title');
            
        }
    }

</script>

<style scoped lang="less">
@import '../../../util/wysiwyg/css/wysiwyg-editor.css';
@import '../../../util/wysiwyg/font-awesome-4.6.3/css/font-awesome.min.css';
@import "../../../assets/css/common.less";
.suggestion{
	position:absolute;
	/*left: 340px;*/
    left: 50%;
    margin-left: -400px;
    top: 98px;
	width:800px;
	background:#fff;
	z-index:4;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
    -moz-box-shadow: 0 2px 4px 0 rgba(0,0,0,.3);
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
.suggestion-box{
	margin: 0px 0 10px 10px;
    padding-right: 10px;
    height: 650px;
    overflow: auto;
}
.explain{
	text-align: left;
	line-height: 24px;
}
.question{
	margin-top: 10px;
    text-align: left;
}
.submit-btn{
	padding:5px 0px 20px 0px;
}
.submit-btn a{
	float: right;
    padding: 0px 8px;
    margin-left: 10px;
}
.word-prompt{
	float: left;
}
.reply{
	overflow:hidden;
	clear: both;
	margin-top:20px;
	border: 1px solid #ecf2fc;
	.title{
		cursor: pointer;
		border-bottom: 1px solid #ccc;
		a:hover{
			color: @color;
		}
	}
}
.reply .mainreply{
	ul li{
		width:96%;
		height: auto;
		overflow: hidden;
		margin:10px 2%;
		/*border-top:1px solid #C3D5F2;*/
	}
}
.questionBox{
	padding:10px;
	height: auto;
	overflow: hidden;
	background-color: #ECF2FC;
    text-align: left;
}
.asker{
	text-align: left;
	line-height: 24px;
}
.asker span{
	color:@color;
	font-size: 14px;
}
.asker img{width: 100%;}
.answer{
	text-align: right;
	line-height: 30px;
}
.answer a{
	cursor: pointer;
}
.answer a:hover{color:@color;}
.replyBox{
	padding: 5px;
	text-align: left;
	border-top:1px solid #fff;
	span{
		color:@color;
	}
	span.replyTime{
		color: @colorH;
	}
}
/*big*/
.big .suggestion{
	top:80px;
	left:500px;
	.explain{
		line-height: 30px;
	}
	.asker{line-height: 30px;}
	.asker span{font-size: 20px;}
	.answer a{color:@color;}
}
</style>