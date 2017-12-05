<template>
    <ul @click = "getDate">
       <li v-for="item in zh_list" class="zh_item">
            <h2>{{item.name}}</h2>
           <ul class="menu-list">
               <li class="zh_content" v-for='i in zh_list[$index].child'>
                   <em class="{{ i.logo }}"></em>
                   <em>{{ i.name }}</em>
               </li>
           </ul>
       </li>
    </ul>
</template>

<script>
	export default {
		data() {
			return {
                zh_list:[
                    {
                        'line': 'hr_line',
                        'height': '90px',
                        'logo': 'child-logo direction ss_dase',
                        'name': '应急预案',
                        'child': [
                            { 'type': '标注', 'name': '标注', 'iselect': false,'logo':'zh_label zh_icon' }, 
                            { 'type': '动态线', 'name': '动态线', 'iselect': false,'logo':'zh_lineString zh_icon' },
                            { 'type': '文字', 'name': '文字', 'iselect': false ,'logo':'zh_text zh_icon'},
                            { 'type': '箭头', 'name': '箭头', 'iselect': false,'logo':'zh_arrow zh_icon ' }, 
                            { 'type': '画矩形', 'name': '画矩形', 'iselect': false,'logo':'zh_box zh_icon' }, 
                            { 'type': '画圆', 'name': '画圆', 'iselect': false,'logo':'zh_circle zh_icon' }, 
                            { 'type': '自动导航', 'name': '自动导航', 'iselect': false,'logo':'zh_navigation zh_icon' },
                            { 'type': '画任意面', 'name': '画任意面', 'iselect': false,'logo':'zh_freepolygon zh_icon' },
                            { 'type': '画任意线', 'name': '画任意线', 'iselect': false,'logo':'zh_freelinestring zh_icon'},
                            { 'type': '撤销', 'name': '撤销', 'iselect': false,'logo':'zh_undo zh_icon'},
                            { 'type': '删除', 'name': '删除', 'iselect': false,'logo':'zh_icon zh_delete'},
                            { 'type': '标注', 'name': '标注', 'iselect': false,'logo':'zh_icon zh_save'}
                        ]
                    }, {
                        'line': 'hr_line',
                        'height': '78px',
                        'logo': 'child-logo direction ss_wuzi',
                        'name': '靶向预警',
                        'child': [
                            { 'type': '画矩形', 'name': '画矩形', 'iselect': false,'logo':'zh_box zh_icon' }, 
                            { 'type': '画圆', 'name': '画圆', 'iselect': false,'logo':'zh_circle zh_icon' }, 
                            { 'type': '画任意面', 'name': '画任意面', 'iselect': false,'logo':'zh_freepolygon zh_icon' },
                            { 'type': '画任意线', 'name': '画任意线', 'iselect': false,'logo':'zh_freelinestring zh_icon'},
                            { 'type': '撤销', 'name': '撤销', 'iselect': false,'logo':'zh_undo zh_icon'},
                            { 'type': '删除', 'name': '删除', 'iselect': false,'logo':'zh_icon zh_delete'}
                        ]
                    }, {
                        'line': 'hr_line',
                        'height': '74px',
                        'logo': 'child-logo direction ss_power',
                        'name': '其他工具',
                        'child': [
                            { 'type': '测距', 'name': '测距', 'iselect': false,'logo':'zh_range zh_icon' }, 
                            { 'type': '经纬线', 'name': '经纬线', 'iselect': false,'logo':'zh_quadrillage zh_icon' }
                            , 
                            { 'type': '透明度', 'name': '透明度', 'iselect': false,'logo':'zh_opacity zh_icon' }
                            ,
                            { 'type': '视频回传', 'name': '视频回传', 'iselect': false,'logo':'zh_video zh_icon'}
                            ,
                            { 'type': '决策服务', 'name': '决策服务', 'iselect': false,'logo':'zh_decisionServe zh_icon'}
                        ]
                    }                
                ]
            }
		},
        // props: ['zh_list'],
        methods: {
            getDate: function () {
                console.log(this.props)
            }
        }	
	}
</script>

<style scoped lang="less">
.zh_panel{
    text-align:left;

    ul{
        overflow:hidden;
    }

    h2{
        margin: 0;
        font-size: 16px;
        line-height:30px;       
    }
    li.zh_content{
        width: 90px;
        float:left;
        line-height:28px;
        font-size: 0;
    }
    li.zh_content:hover{
        color:#1f7ed0;
    }
    li.zh_item{
        padding-left:10px;
        padding-top:4px;
        padding-bottom:5px;
    }
    li.zh_item:not(:last-child) {
        padding-left:10px;
        padding-top:6px;
        border-bottom:1px solid #e5e8ec;
    }
    em{ 
        display: inline-block;   
        float:left;   
        font-style: normal;
        font-size: 13px;
    } 
    .zh_logo{   
        width: 24px;
    }


    .zh_icon{
        width: 24px;
        height: 20px;
        margin-top:4px;
        // line-height:28px;
        box-sizing: border-box;
    }

    .zh_label{
        background: url("../../../assets/img/contingency-plan/point.png") no-repeat center;
    }
    .zh_lineString{
        background: url("../../../assets/img/contingency-plan/lineString.png") no-repeat center;
    }
      .zh_text{
         background: url("../../../assets/img/contingency-plan/text.png") no-repeat center;
    }
    .zh_arrow{
         background: url("../../../assets/img/contingency-plan/arrow.png") no-repeat center;
    }
    .zh_box{
      background: url("../../../assets/img/contingency-plan/box.png") no-repeat center;   
    }
    .zh_circle{
      background: url("../../../assets/img/contingency-plan/circle.png") no-repeat center;   
    }
    .zh_navigation{
        background: url("../../../assets/img/contingency-plan/navigation.png") no-repeat center;
    }
    .zh_freepolygon{
        background: url("../../../assets/img/contingency-plan/freepolygon.png") no-repeat center;
    }
    .zh_freelinestring{
        background: url("../../../assets/img/contingency-plan/freelinestring.png") no-repeat center;
    }
    .zh_undo{
         background: url("../../../assets/img/contingency-plan/undo.png") no-repeat center;
    }
    .zh_delete{
        background: url("../../../assets/img/contingency-plan/delete.png") no-repeat center;
    }
    .zh_save{
        background: url("../../../assets/img/contingency-plan/save.png") no-repeat center;
    }

    .zh_range{
        background: url("../../../assets/img/contingency-plan/rightIcon.png") no-repeat -40px -18px;
    }
    .zh_quadrillage{
        background: url("../../../assets/img/contingency-plan/rightIcon.png") no-repeat 4px 0;
    }
    .zh_opacity{
        background: url("../../../assets/img/contingency-plan/rightIcon.png") no-repeat -42px -38px; 
    }
    .zh_video{
        background: url("../../../assets/img/contingency-plan/rightIcon.png") no-repeat 4px -114px; 
    }
    .zh_decisionServe{
        background: url("../../../assets/img/contingency-plan/rightIcon.png") no-repeat 4px -148px; 
    }

    li.zh_content:hover{
        .zh_label{
            background: url("../../../assets/img/contingency-plan/point-selected.png") no-repeat center;
        }
        .zh_lineString{
            background: url("../../../assets/img/contingency-plan/lineString-selected.png") no-repeat center;
        }
        .zh_text{
             background: url("../../../assets/img/contingency-plan/text-selected.png") no-repeat center;
        }
        .zh_arrow{
             background: url("../../../assets/img/contingency-plan/arrow-selected.png") no-repeat center;
        }
        .zh_box{
          background: url("../../../assets/img/contingency-plan/box-selected.png") no-repeat center;   
        }
        .zh_circle{
          background: url("../../../assets/img/contingency-plan/circle-selected.png") no-repeat center;   
        }
        .zh_navigation{
            background: url("../../../assets/img/contingency-plan/navigation-selected.png") no-repeat center;
        }
        .zh_freepolygon{
            background: url("../../../assets/img/contingency-plan/freepolygon-selected.png") no-repeat center;
        }
        .zh_freelinestring{
            background: url("../../../assets/img/contingency-plan/freelinestring-selected.png") no-repeat center;
        }
        .zh_undo{
             background: url("../../../assets/img/contingency-plan/undo.png") no-repeat center;
        }
        .zh_delete{
            background: url("../../../assets/img/contingency-plan/delete.png") no-repeat center;
        }
        .zh_save{
            background: url("../../../assets/img/contingency-plan/save.png") no-repeat center;
        }
        .zh_range{
            background: url("../../../assets/img/contingency-plan/rightIcon.png") no-repeat -64px -18px;
        }
        .zh_quadrillage{
            background: url("../../../assets/img/contingency-plan/rightIcon.png") no-repeat -17px 0;
        }
        .zh_opacity{
            background: url("../../../assets/img/contingency-plan/rightIcon.png") no-repeat -66px -38px;
        }
        .zh_video{
        background: url("../../../assets/img/contingency-plan/rightIcon.png") no-repeat -17px -114px; 
        }
        .zh_decisionServe{
            background: url("../../../assets/img/contingency-plan/rightIcon.png") no-repeat -18px -148px; 
        }
    }
}


</style>
