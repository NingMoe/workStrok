<template>
	<ul>
       <li v-for="item in jc_list" class="jc_item">
            <div>
                <div class={{item.logo}}></div>
                <div class="jc_name">{{item.name}}</div>
            </div>
           
           <ul class="menu-list">
               <li class="jc_content" v-for='i in jc_list[$index].child'>
                   {{ i.name }}
               </li>
           </ul>
       </li>
    </ul>
</template>

<script>
	export default {
		data() {
			return {
				jc_list: [
	                {
	                    'line': 'hr_line',
	                    'height': '90px',
	                    'logo': 'child-logo direction ss_dase',
	                    'name': '基本信息',
	                    'child': [
	                        { 'type': '人口经济', 'name': '人口经济', 'iselect': false }, 
	                        { 'type': '医院', 'name': '医院', 'iselect': false },
	                        { 'type': '学校', 'name': '学校', 'iselect': false },
	                        { 'type': '历史地震', 'name': '历史地震', 'iselect': false }, 
	                        { 'type': '历史化学品存储点', 'name': '历史化学品存储点', 'iselect': false }, 
	                        { 'type': '旅游景点', 'name': '旅游景点', 'iselect': false }, 
	                        { 'type': '农作物种', 'name': '农作物种', 'iselect': false }
	                    ]
	                }, {
	                    'line': 'hr_line',
	                    'height': '78px',
	                    'logo': 'child-logo direction ss_wuzi',
	                    'name': '应急物资',
	                    'child': [
	                        { 'type': '物资_民政', 'name': '民政', 'iselect': false }, 
	                        { 'type': '物资_三防', 'name': '安监', 'iselect': false }, 
	                        { 'type': '物资_水利', 'name': '应急办', 'iselect': false }, 
	                        { 'type': '物资_公安', 'name': '公安', 'iselect': false }, 
	                        { 'type': '物资_国土', 'name': '地震', 'iselect': false }, 
	                        { 'type': '物资_林业', 'name': '林业', 'iselect': false }
	                    ]
	                }, {
	                    'line': 'hr_line',
	                    'height': '74px',
	                    'logo': 'child-logo direction ss_power',
	                    'name': '救援力量',
	                    'child': [
	                        { 'type': '救援_民政', 'name': '民政', 'iselect': false }, 
	                        { 'type': '救援_安监', 'name': '安监', 'iselect': false }, 
	                        { 'type': '救援_应急办', 'name': '应急办', 'iselect': false }, 
	                        { 'type': '救援_地震', 'name': '地震', 'iselect': false }, 
	                        { 'type': '救援_林业', 'name': '林业', 'iselect': false }
	                    ]
	                }, {
	                    'line': '',
	                    'height': '60px',
	                    'logo': 'child-logo direction ss_place',
	                    'name': '避难场所',
	                    'child': [
	                        { 'type': '民政', 'name': '民政', 'iselect': false },
	                        { 'type': '安监', 'name': '安监', 'iselect': false },
	                        { 'type': '应急办', 'name': '应急办', 'iselect': false },
	                        { 'type': '公安', 'name': '公安', 'iselect': false }
	                    ]
	                }
	            ]
            }
		}
	}
</script>
	
<style scoped lang="less">
@import "../../../assets/css/common.less";



.jc_panel{
	line-height: 25px;

    ul{
        overflow:hidden;
    }
    li{
        position: relative;

        &>div{
            position: absolute;
            top: 50%;
            transform:translateY(-28px);
        }
        & ul{
            float:left;
            margin-left:70px;
        }
    }

    .jc_content{
        line-height:28px;
        padding:0 10px;
    }
    .jc_content:hover{
        color:#1f7ed0;
    }

    .jc_item:not(:last-child){
        border-bottom:1px solid #e5e8ec;
    }
    .menu-list{
        padding-top:12px;
        padding-bottom:6px;
    }
	.jc_content{
	        line-height:28px;
	        padding:0 16px;
	}
	.jc_list {
	    width: 187px;

	    ul li {
	        margin: 6px 6px;
	    }
	}

	.ss_dase {
	    background: url("../../../assets/img/minbase/a1.png") no-repeat center 2px;
	}
	.ss_wuzi {
	    background: url("../../../assets/img/minbase/a2.png") no-repeat center 2px;
	}
	.ss_power {
	    background: url("../../../assets/img/minbase/a3.png") no-repeat center 2px;
	}
	.ss_place {
	    background: url("../../../assets/img/minbase/a4.png") no-repeat center 2px;
	}
}

.child-logo {
    width: 70px;
    height: 30px;
    line-height: 100%;
    box-sizing: border-box;
}
.child-panel {
	width: 280px;
    background-color: #fff; 
    height: auto;
    margin-left: 3px;

    ul li {
        float: left;
        list-style: none;
        cursor: pointer;
        width: 100%;

        li {
            width: auto;
            position: relative;
        }
    }
    .table-cell ul li:hover {
        color: @color;
    }
}
</style>
