<template>
<!-- 左侧边栏 -->
    <div class="panel " :class="{program_two:isA}">
        <v-time></v-time>
        <div v-el:panel-bar  class="item">
            <ul>
                <template v-for="item in list">
                    <li @click="initPanel(item.type,$event)">{{item.name}}</li>
                </template>
            </ul>
        </div>
        <div v-el:child-plane class="child-plane-box">
        <!-- 指挥调度 -->
            <div v-el:zh-panel class="child-panel hide  zh_panel poipanel collect-panel">
                <v-dispatch></v-dispatch>
            </div>
        <!-- 部门信息 -->
            <div v-el:bm-panel class="child-panel hide bm_panel">
                <ul>
                    <li v-for="item in bm_list" :class="[ly,item.isdata?'hdata':'ndata',item.iselect? 'selected' : '']" @click="toutchApart(item,$event)">
                        <div class={{item.logo}}></div>
                        <label>{{item.name}}</label>
                        <em class="emfocus"></em>
                    </li>
                </ul>
                <a class="all-select-btn" @click="selectAll('bm',$event)">全选>></a>
            </div>
        <!-- 基础数据 -->
            <div v-el:cl-panel class="child-panel hide jc_panel poipanel collect-panel">
                <v-basedata></v-basedata>
                <!-- <ul>
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
                </ul> -->
                <a class="all-select-btn" @click="selectAll('jc',$event)">全选>></a>
            </div>
        <!-- 实时数据 -->
            <div v-el:clss-panel class="child-panel hide ss_panel poipanel collect-panel">
                <ul>
                   <li v-for="item in ss_list" class="ss_item">
                       <div class={{item.logo}}></div>
                       <ul class="menu-list">
                           <li class="ss_content" v-for='i in ss_list[$index].child'>
                               {{ i.name }}
                           </li>
                       </ul>
                   </li>
                </ul>
            </div>
            <div class="showButton" @click="showHide"></div>
        </div>
    </div>
    <div class="popDiv-ndata" v-if="alert_pop">
        <div class="box">暂无数据！</div>
    </div>
</template>


<script>
    import { updateParam } from '../../vuex/store'
    import Time from '../time/Time.vue'
    import Dispatch from './base/Dispatch'
    import BaseData from './base/BaseData'

    export default {
        components:{
            'v-time': Time,
            'v-dispatch':Dispatch,
            'v-basedata':BaseData
        },
        data() {
            return {
                alert_pop: false,
                collectFlag: false, // 我的定制和返回图标的切换
                collectSSFlag: false, // 实时监测是否有定制
                collectData: '', // 基础数据定制
                collectSSData: '', // 实时监测的定制
                modelData: '', // 我的定制的模型和基础数据
                typeFlag: '',
                isA:true,
                list: [
                    { 'type': 'ss', 'name': '实时观测' },
                    { 'type': 'jc', 'name': '基础数据' }, 
                    { 'type': 'bm', 'name': '部门信息' },
                    { 'type': 'zh', 'name': '指挥调度' }
                ],
                ss_list: [
                    {
                        'line': 'hr_line',
                        'logo': 'child-logo direction ss_cloud',
                         'child': [
                            { 'type': 'typhoon', 'name': '自动监测站', 'iselect': false },
                            { 'type': 'radar', 'name': '雷达回波', 'iselect': false },
                            { 'type': 'cloud', 'name': '卫星云图', 'iselect': false },
                            { 'type': 'cloud', 'name': '地震监测', 'iselect': false },
                            { 'type': 'thunder', 'name': '实时人力热力图', 'iselect': false },
                            { 'type': 'agr', 'name': '交通拥堵', 'iselect': false },
                            { 'type': 'rainwarn', 'name': '地质灾害', 'iselect': false }
                        ]
                    }, {
                        'line': 'hr_line',
                        'logo': 'child-logo direction ss_river',
                        'child': [
                            { 'type': 'sk_sw', 'name': '水库水情', 'iselect': false, isdata: true }
                        ]
                    }, {
                        'line': 'hr_line',
                        'logo': 'child-logo direction ss_air',
                        'child': [
                            { 'type': 'airq', 'name': '空气质量', 'iselect': false }
                        ]
                    }, {
                        'line': 'hr_line',
                        'logo': 'child-logo direction ss_video',
                        'child': [
                            { 'type': 'poi_VIDEO_RESERVOIR', 'name': '实景视频', 'iselect': false }
                        ]
                    }
                ],    
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
                ],
                bm_list:[
                    { 'logo': 'bm_traffice_11', 'child': ['EMERGENCY_METEOROLOGICAL', 'TYFON', 'LCD_LED', 'LCD_LED_TYFON'], 'name': '气象', 'iselect': false },
                    { 'logo': 'bm_traffice_4', 'child': ['SJZX_ECONOMIC', 'demage_demage', 'SJZX_EMERGENCY_HOMELAND'], 'name': '国土', 'iselect': false },
                    { 'logo': 'bm_traffice_1', 'child': ['EMERGENCY_FORESTRY', 'FOREST_FIRE_PREVENT'], 'name': '林业', 'iselect': false },
                    { 'logo': 'bm_traffice_1', 'child': ['EMERGENCY_FORESTRY', 'FOREST_FIRE_PREVENT'], 'name': '林业', 'iselect': false },
                    { 'logo': 'bm_traffice_0', 'child': ['WATER_POINT', 'EMERGENCY_THREE'], 'name': '水利', 'iselect': false },
                    { 'logo': 'bm_traffice_0', 'child': ['WATER_POINT', 'EMERGENCY_THREE'], 'name': '水利', 'iselect': false },
                    { 'logo': 'bm_traffice_5', 'child': ['EDUCATION_SCHOOL'], 'name': '教育', 'iselect': false }, 
                    { 'logo': 'bm_traffice_9', 'child': ['SJZX_EMERGENCY_POLICE', 'SJZX_RESCUE_FIRE'], 'name': '公安', 'iselect': false }, 
                    { 'logo': 'bm_traffice_8', 'child': ['SJZX_EMERGENCY_ENVIRONMENTAL'], 'name': '环境', 'iselect': false }, 
                    { 'logo': 'bm_traffice_13', 'child': ['HZ_TRAFFIC_CAR', 'HZ_TRAFFIC_TRAIN', 'HZ_TRAFFIC_PLANE', 'SJZX_RESCUE_TRAFFIC', 'RESCUE_VILLAGE'], 'name': '交通', 'iselect': false }, 
                    { 'logo': 'bm_traffice_18', 'child': ['TOURIST_SPOT'], 'name': '旅游', 'iselect': false },
                    { 'logo': 'bm_traffice_6', 'child': ['EMERGENCY_COMM', 'RESCUE_COMM'], 'name': '通讯', 'iselect': false },
                    { 'logo': 'bm_traffice_12', 'child': ['EMERGENCY_CIVIL'], 'name': '民政', 'iselect': false },
                    { 'logo': 'bm_traffice_10', 'child': ['MEDICAL_HOSPITAL', 'RESCUE_MEDICAL'], 'name': '卫生', 'iselect': false },
                    { 'logo': 'bm_traffice_3', 'child': ['KEYPLACE_IMPORTANT', 'SJZX_EMERGENCY_SAFETY'], 'name': '安监', 'iselect': false },
                    { 'logo': 'bm_traffice_3', 'child': ['KEYPLACE_IMPORTANT', 'SJZX_EMERGENCY_SAFETY'], 'name': '安监', 'iselect': false }, 
                    { 'logo': 'bm_traffice_16', 'child': ['GDSYJB_SHUIKU', 'GDSYJB_SLECTER'], 'name': '应急办', 'iselect': false } 
                ],
                
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
                ],
                bm_type: {}, // 部门信息基础点与基础数据类型的对应关系
                poi: {
                    TOURIST_SPOT: false,
                    SJZX_DANGPOINT_CONSTRUCTION: false,
                    EMERGENCY_FORESTRY: false,
                    KEYPLACE_IMPORTANT: false,
                    SJZX_EMERGENCY_SAFETY: false,
                    EDUCATION_SCHOOL: false,
                    EMERGENCY_MSA: false,
                    SJZX_RESCUE_SEA: false,
                    SJZX_EMERGENCY_POLICE: false,
                    SJZX_RESCUE_FIRE: false,
                    EMERGENCY_METEOROLOGICAL: false,
                    TYFON: false,
                    LCD_LED: false,
                    LCD_LED_TYFON: false,
                    HZ_TRAFFIC_CAR: false,
                    HZ_TRAFFIC_TRAIN: false,
                    HZ_TRAFFIC_PLANE: false,
                    SJZX_RESCUE_TRAFFIC: false,
                    RESCUE_VILLAGE: false,
                    TORRENT_DITCH: false,
                    SJZX_KEYPLACE_REFUGES: false,
                    GDSYJB_SLECTER: false,
                    WATER_POINT: false,
                    EMERGENCY_THREE: false,
                    SJZX_EMERGENCY_ELECTRIC: false,
                    SJZX_RESCUE_ELECTRIC: false,
                    SJZX_ECONOMIC: false,
                    SJZX_EMERGENCY_HOMELAND: false,
                    EMERGENCY_COMM: false,
                    RESCUE_COMM: false,
                    SJZX_EMERGENCY_ENVIRONMENTAL: false,
                    MEDICAL_HOSPITAL: false,
                    RESCUE_MEDICAL: false,
                    EMERGENCY_CIVIL: false,
                    RESERVOIR: false,
                    GDSYJB_SHUIKU: false,
                    EMERGENCY_WATER: false,
                    demage_demage: false,
                    PILE: false,
                    FOREST_FIRE_PREVENT: false,
                    HOSPITAL_JK: false,
                    HOSPITAL_CAIXUE: false,
                    SZ_SHUIKU: false
                },
                relation: {
                    // 工地隐患: ['SJZX_DANGPOINT_CONSTRUCTION'],
                    '经济': ['SJZX_ECONOMIC'],
                    '医院': ['MEDICAL_HOSPITAL', 'HOSPITAL_JK', 'HOSPITAL_CAIXUE'],
                    '危化点': ['KEYPLACE_IMPORTANT'],
                    '水库': ['RESERVOIR', 'GDSYJB_SHUIKU', 'SZ_SHUIKU'],
                    '客运站': ['HZ_TRAFFIC_CAR', 'HZ_TRAFFIC_TRAIN', 'HZ_TRAFFIC_PLANE'],
                    '学校': ['EDUCATION_SCHOOL'],
                    '积水点': ['WATER_POINT'],
                    '地质灾害': ['demage_demage'],
                    '工地隐患': ['SJZX_DANGPOINT_CONSTRUCTION'],
                    '旅游景点': ['TOURIST_SPOT'],
                    '物资_民政': ['EMERGENCY_CIVIL'],
                    '物资_三防': ['EMERGENCY_THREE'],
                    '物资_水利': ['EMERGENCY_WATER'],
                    '物资_公安': ['SJZX_EMERGENCY_POLICE'],
                    '物资_国土': ['SJZX_EMERGENCY_HOMELAND'],
                    '物资_林业': ['EMERGENCY_FORESTRY'],
                    '物资_环保': ['SJZX_EMERGENCY_ENVIRONMENTAL'],
                    '物资_海事': ['EMERGENCY_MSA'],
                    '物资_安监': ['SJZX_EMERGENCY_SAFETY'],
                    '物资_电力': ['SJZX_EMERGENCY_ELECTRIC'],
                    '救援_电力': ['SJZX_RESCUE_ELECTRIC'],
                    '救援_通讯': ['RESCUE_COMM'], // 通讯
                    '救援_医疗': ['RESCUE_MEDICAL'], // 卫生
                    '救援_交通': ['SJZX_RESCUE_TRAFFIC'], // 交通
                    '救援_乡镇': ['RESCUE_VILLAGE'], // 交通
                    '救援_海上': ['SJZX_RESCUE_SEA'], // 海事
                    '救援_公安': ['SJZX_RESCUE_FIRE'], // 公安
                    '避难点': ['SJZX_KEYPLACE_REFUGES', 'GDSYJB_SLECTER'], // 三防
                    '堆场': ['PILE'],
                    '防火点': ['FOREST_FIRE_PREVENT']
                },
                logoMap: {
                    'ss_cloud': 'child-logo direction ss_cloud',
                    'ss_river': 'child-logo direction ss_river',
                    'ss_air': 'child-logo direction ss_air',
                    'ss_video': 'child-logo direction ss_video',
                    'ss_boat': 'child-logo direction ss_boat',
                    '基本信息': 'child-logo direction ss_dase',
                    '应急物资': 'child-logo direction ss_wuzi',
                    '救援力量': 'child-logo direction ss_power',
                    '避难场所': 'child-logo direction ss_place'
                },
                preModelPoi: [],
                libraryPoi:[]   // 六库最后点击的应急物资和救援队伍的类型
            }
        },
        computed: {
            ly: function() {
                // 计算部门信息节点是否有数据,赋值给isdata
                this.bm_list.forEach((item) => {
                    item.isdata = false;
                    for (let i in item.child) {
                        if (this.poi[item.child[i]] == true)
                            item.isdata = true;
                    }
                });
            },
            cus: function() {
                // 计算定制 -> 基础信息节点是否有数据,赋值给isdata
                for (let k in this.collectData) {
                    this.collectData[k].child.forEach((citem, index) => {
                        citem.isdata = false;
                        let types = citem.type.split(',');
                        for (let i in types) {
                            let tempType = types[i];
                            if (tempType === 'damage_damage') {
                                tempType = 'demage_demage';
                                this.collectData[k]['child'][index]['type'] = tempType;
                            }
                            if (this.poi[tempType] == true) citem.isdata = true;
                        }
                        if (citem.type === 'mountainTorrents') citem.isdata = true;
                    });
                }
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                allTypes: state => state.poi.allTypes,
                layer: state => state.poi.layer,
                controlTypes: state => state.poi.controlTypes,
                poiStatus: state => state.poi.status,
                cacheId: state => state.model.cacheId,
                pvStatus: state => state.publicVideo.status,
                pvTypes: state => state.publicVideo.types,
                mtImageStatus: state => state.mountainTorrents.model,
                code: state => state.cityCode,
                clickStat: state => state.poi.clickStat,
                userId: state => state.userId,
                modelTypeName: state => state.modelTypeName,
                isSelect: state => state.isSelect
            },
            actions: { updateParam }
        },
        watch: {
            // 切换地区时,更新面板状态
            code: function() {
                this.initcusPoiStat();
            },
            // 可从外部控制面板选项的选中状态
            controlTypes: function() {
                if (this.controlTypes.length != 0) {
                    let tempType = [], tempTypeStr = "";
                    this.poi_map(this.libraryPoi, false);
                    this.poi_css(this.libraryPoi, false);
                    this.libraryPoi = [];
                    for (let i in this.controlTypes) {
                        tempTypeStr += "poi_" + this.controlTypes[i] + ",";
                        for (let k in this.bm_list) {
                            if ($.inArray(this.controlTypes[i], this.bm_list[k].child) != -1) {
                                this.bm_list[k].iselect = true;
                            }
                        }
                    }
                    let tempPois = [];
                    let tempArr = this.controlTypes;
                    for (let k in tempArr) {
                        tempPois.push(tempArr[k])
                    }
                    this.libraryPoi = tempPois;
                    this.poi_css(tempPois, true);
                    this.poi_map(tempPois, true);
                    $(this.$els['jcPanel']).removeClass('status');
                    $(this.$els.panelBar).find('li').eq(1).addClass('on');
                } else {
                    if (this.libraryPoi[0]) {
                        this.poi_map(this.libraryPoi, false);
                        this.libraryPoi = [];
                    }
                    let list = this.collectData;
                    for (let key in list) {
                        let childs = list[key].child;
                        for (let ch in childs) {
                            if (childs[ch].iselect)
                                childs[ch].iselect = false;
                        }
                    }

                    // 取消定制的勾选的类型
                    let colData = this.collectData;
                    for (let k in colData) {
                        let childs = colData[k].child;
                        for (let n in childs) {
                            if (childs[n].iselect) {
                                childs[n].iselect = false;
                            }
                        }
                    }

                    let bmList = this.bm_list;
                    for (let key in bmList) {
                        if (bmList[key].iselect)
                            bmList[key].iselect = false;
                    }
                }
            },
            modelTypeName: function() {
                if (this.preModelPoi !== '') { //记录上一个模型的poi
                    this.model_poi(this.preModelPoi, false);  //取消上一次选中模型的poi打点记录
                }
                for (let k in this.modelData) {
                    let tempName = this.modelData[k].name;
                    if (tempName === this.modelTypeName) {
                        return this.selectBase(this.modelData[k], true); // 模型选择poi
                    }
                }
            },
            isSelect: function() {
                for (let k in this.modelData) {
                    let tempName = this.modelData[k].name;
                    if (tempName === this.modelTypeName) {
                        return this.selectBase(this.modelData[k], this.isSelect); // 模型选择poi
                    }
                }
            }
        },
        methods: {
            initPanel: function(type, _obj) {
                $(this.$els.childPlane).show().width("");
                if ($(_obj.target).hasClass('on')) {
                    $(_obj.target).removeClass('on');
                    $(this.$els['clPanel']).addClass('hide').siblings('.child-panel').addClass('hide');
                } else {

                    $(_obj.target).addClass('on').siblings().removeClass('on');
                    if (type === 'ss') {
                        $(this.$els['clssPanel']).removeClass('hide').siblings('.child-panel').addClass('hide');
                    } else if (type === 'jc') {
                        $(this.$els['clPanel']).removeClass('hide').siblings('.child-panel').addClass('hide');
                    } else if (type === 'bm'){
                       
                        $(this.$els[type + 'Panel']).removeClass('hide').siblings('.child-panel').addClass('hide');
                    }else if (type === 'zh'){
                      
                        $(this.$els[type + 'Panel']).removeClass('hide').siblings('.child-panel').addClass('hide');
                    }
                }

            },
            // 显示隐藏模型
            showHide: function() {
                console.log(this);
                $(this.$els.childPlane).animate({ "width": 0 }, function() {
                    $(this).find('.child-panel').addClass('hide');
                });
                $(this.$els.panelBar).find('li').removeClass('on');
            },
            // 在地图上打点，显示poi
            poi_map: function(poiArr, status) {
                if (this.clickStat == false) {
                    this.updateParam('poi', 'clickStat', true) // 为了使小面板关闭
                }
                let curTypes = this.allTypes;
                for (let i in poiArr) {
                    if (poiArr[i] === 'mountainTorrents') { // 山洪沟
                        //模型的山洪沟，面板的山洪沟 两者都关闭时才能关闭
                        if (status) {
                            this.updateParam('mountainTorrents', 'status', true);
                            this.updateParam('mountainTorrents', 'poi', true);
                        }else{
                            this.updateParam('mountainTorrents', 'poi', false);
                            if (this.mtImageStatus) {
                                this.updateParam('mountainTorrents', 'status', true);
                            }else{                           
                                this.updateParam('mountainTorrents', 'status', false);
                            }
                        }
                    }else if (poiArr[i] === 'demage_demage') { // 地质灾害
                        this.updateParam('damage', 'status', status);
                    }else{
                        if (status == true) {
                            if (curTypes.indexOf('poi_' + poiArr[i]) == -1) {
                                curTypes += 'poi_' + poiArr[i] + ',';
                            }
                        } else {
                            curTypes = curTypes.replace('poi_' + poiArr[i] + ',', '');
                        } 
                    }                
                }
                this.updateParam('poi', 'allTypes', curTypes);
                if (curTypes == '') {
                    this.updateParam('poi', 'status', false);
                } else {
                    let call = setInterval(() => {
                        if (this.poiStatus == false) {
                            this.updateParam('poi', 'status', true);
                        } else {
                            clearInterval(call);
                        }
                    }, 50);
                }
            },
            // poi的勾选样式（是否选中）
            poi_css: function(poiArr, status) {
                for (let k in this.collectData) {
                    this.collectData[k].child.forEach((item) => {
                        let typeVal = item.type;
                        if (typeVal.indexOf(',') !== -1) {
                            let tempType = typeVal.split(',');
                            for (let k in tempType) {
                                if (poiArr.includes(tempType[k])) {
                                    item.iselect = status;
                                }
                            }
                        } else {
                           if (poiArr.includes(typeVal)) {
                                item.iselect = status;
                            }
                        }
                    });
                }
            },
            // 知道poi,poiArr为基础数据的poi数组,反勾选部门信息
            poi_check_bm: function(poiArr, status) {
                let isd0 = 0;
                for (let i in poiArr) {
                    this.bm_list.forEach((item) => {
                        if (item.child.includes(poiArr[i])) {
                            if (status == false) {
                                for (let i in item.child) {
                                    for (let k in this.collectData) {
                                        for (let m in this.collectData[k].child) {
                                            let colType = this.collectData[k].child[m].type;
                                            let bmType = item.child[i];
                                            if (colType.indexOf(bmType) !== -1) {
                                                if (this.collectData[k].child[m].iselect == true) {
                                                    isd0 = 1;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            if (isd0 == 0) {
                                item.iselect = status;
                            }
                        }
                    });
                }
            },
            //模型绑定poi 在地图上打点
            model_poi: function(poiArr, status) { 
                let poiArrCopy = poiArr;
                //实时观测
                for (let k in this.collectSSData) {
                    this.collectSSData[k].child.forEach((em) => {

                        let tempName = em.type;
                        let index = $.inArray(tempName,poiArr);
                        if (index!=-1) {
                            poiArrCopy.splice(index, 1);
                            em.iselect = status;  //实时观测poi勾选样式
                            if (tempName !== 'typhoon') {
                                this.updateParam('baseInfo', 'status', status);
                                this.updateParam('baseInfo', 'type', tempName);
                            }
                            let isVideo = this.selectVideo(status, tempName);
                            if (!isVideo) {
                                this.updateParam(tempName, 'status', status);
                            }
                            if (tempName === 'damage' && !status) {
                                this.updateParam('damageBox', 'status', false);
                            }
                            if (tempName === 'site' && !status) {
                                this.updateParam('siteBox', 'status', false);
                            }
                            if (tempName === 'rainwarn' && !status) {
                                this.updateParam('rainwarnBox', 'showsate', false);
                            }
                        }
                    });
                }
                //基础数据
                this.poi_css(poiArrCopy, status);
                this.poi_map(poiArrCopy, status); //poiArrCopy已经过滤了上面实时监测的poi
            },
            // 没数据的弹出面板
            ndataPop: function() {
                this.alert_pop = true;
                setTimeout(() => {
                    this.alert_pop = false;
                }, 1000)
            },
            // 部门信息操作
            toutchApart: function(curchild,_obj) {
                let bool_data = true;
                let $target = $(_obj.target).parent();
                bool_data = $target.hasClass('ndata');
                if (bool_data && !$target.hasClass('selected')) this.ndataPop();

                curchild.iselect = !curchild.iselect;
                this.poi_map(curchild.child, curchild.iselect); //部门关联poi在地图上打点
                this.poi_css(curchild.child, curchild.iselect); //部门关联poi的选中样式
                this.updateParam('baseInfo', 'status', curchild.iselect);
                this.updateParam('baseInfo', 'name', curchild.name);
                this.updateParam('baseInfo', 'type', curchild.logo);
                
            },
            // 部门信息全选
            toutchApartAll: function(status) {
                let chooseArrPoi = [];
                this.bm_list.forEach((item) => {
                    item.iselect = status;
                    for (let i in item.child) {
                        chooseArrPoi.push(item.child[i]);
                    }

                })
                this.poi_css(chooseArrPoi, status);
                this.poi_map(chooseArrPoi, status);                
            },
            touchCollect: function(curlit, _obj) {
                    let bool_data = true;
                    let $target = $(_obj.target);
                    bool_data = $target.hasClass('ndata'); // 判断是否有数据
                    let type = curlit.type;
                    let status = curlit.iselect;
                    if (curlit.iselect == false) {
                        curlit.iselect = true;
                        status = true;
                    } else {
                        curlit.iselect = false;
                        status = false;
                    }
                    if (type == 'demage_demage')
                        type = 'damage';
                    let typeArr = ['typhoon', 'radar', 'cloud', 'site', 'ship', 'thunder', 'airq', 'damage', 'agr', 'VIDEO_MOBILE', 'VIDEO_TRAFFIC', 'poi_VIDEO_RESERVOIR', 'poi_VIDEO_FORESTRY', 'poi_VIDEO_POLICE', 'sk_sw', 'hl_sw', 'water', 'hfs', 'rainwarn','traffic'];
                    if (typeArr.includes(type)) {
                        if (type !== 'typhoon') {
                            this.updateParam('baseInfo', 'status', status);
                            this.updateParam('baseInfo', 'name', curlit.name);
                            this.updateParam('baseInfo', 'type', type);
                        }
                        let isVideo = this.selectVideo(status, type);
                        if (!isVideo) {
                            this.updateParam(type, 'status', status);
                        }
                        if (type === 'damage' && !status) {
                            this.updateParam('damageBox', 'status', false);
                        }
                        if (type === 'site' && !status) {
                            this.updateParam('siteBox', 'status', false);
                        }
                        if (type === 'rainwarn' && !status) {
                            this.updateParam('rainwarnBox', 'showsate', false);
                        }
                    } else {
                        let name = curlit.name;
                        let type = curlit.type;
                        let typeArr = type.split(',');
                        this.updateParam('baseInfo', 'status', status);
                        this.updateParam('baseInfo', 'name', name.replace('物资_', '').replace('救援_', ''));
                        this.updateParam('baseInfo', 'type', typeArr.join(','));

                        //关联部门
                        this.poi_check_bm(typeArr, status);

                        this.poi_map(typeArr, status);

                        if (bool_data && !$target.hasClass('selected')){
                            this.ndataPop();
                        }
                    }
                
            },
            // 基础信息定制全选功能
            touchCollectAll: function(status) {                 
                let tempTypes = [];
                this.collectData.forEach((item) => {
                    item.child.forEach((sitem) => {
                        sitem.iselect = status;   
                        tempTypes.push(sitem.type);
                    });
                });
                this.poi_check_bm(tempTypes, status);
                this.poi_map(tempTypes, status);            
            },
            //全选操作
            selectAll: function(index, _obj) {
                console.log(index);
                console.info($(_obj.target))
                if (index === 'jc') {
                    if ($(_obj.target).hasClass('on')) {
                        this.touchCollectAll(false);
                        $(_obj.target).removeClass('on');
                    } else {
                        this.touchCollectAll(true);
                        $(_obj.target).addClass('on');
                    }
                } else if (index === 'bm') {
                    if ($(_obj.target).hasClass('on')) {
                        this.toutchApartAll(false);
                        $(_obj.target).removeClass('on');
                    } else {
                        this.toutchApartAll(true);
                        $(_obj.target).addClass('on');
                    }
                }
            },
            selectChildLogo: function(childArr, _obj, bool) {
                let status = false;
                if ($(_obj.target).hasClass('on')) {
                    $(_obj.target).removeClass('on');
                    status = false;
                } else {
                    $(_obj.target).addClass('on');
                    status = true;
                }
                if (!bool) {
                    let typeArr = ['typhoon', 'radar', 'cloud', 'site', 'ship', 'thunder', 'airq', 'damage', 'agr', 'VIDEO_MOBILE', 'VIDEO_TRAFFIC', 'poi_VIDEO_RESERVOIR', 'poi_VIDEO_FORESTRY', 'poi_VIDEO_POLICE', 'sk_sw', 'hl_sw', 'water', 'hfs','traffic'];
                    childArr.forEach((item) => {
                        item.iselect = status;
                        if (typeArr.includes(item.type)) {
                            let isVideo = this.selectVideo(status, item.type);
                            if (!isVideo) {
                                this.updateParam(item.type, 'status', status);
                            }
                        }
                    });
                } else {
                    let typeArr = [];
                     childArr.forEach((item) => {
                        item.iselect = status;
                        let type = item.type;
                        if (type.indexOf(',') !== -1) {
                            let tempType = type.split(',');
                            tempType.forEach((it) => {
                              typeArr.push(it);  
                            });                           
                        }else{
                            typeArr.push(type);
                        }

                    });
                    this.poi_map(typeArr,status);
                    this.poi_check_bm(typeArr, status);
                }
            },
            selectVideo: function(status, type) {
                let poiVideo = ['poi_VIDEO_RESERVOIR', 'poi_VIDEO_FORESTRY', 'poi_VIDEO_POLICE'];
                let publicVideo = ['VIDEO_MOBILE', 'VIDEO_TRAFFIC'];
                let state = false;
                if (poiVideo.includes(type)) {
                    let tempType = this.allTypes;
                    if (status) {
                         if (tempType.indexOf(type) == -1) {
                            tempType += type + ',';
                         }
                    } else {
                        tempType = this.allTypes.replace(type + ',', '');
                    }
                    if (!this.poiStatus) {
                        this.updateParam('poi', 'status', true);
                    }
                    if (!tempType) {
                        this.updateParam('poi', 'status', false);
                    }
                    this.updateParam('poi', 'allTypes', tempType);
                    state = true;
                } else if (publicVideo.includes(type)) {
                    let tempType = this.pvTypes;
                    if (status) {
                        if (tempType.indexOf(type) == -1) {
                            tempType += type + ',';
                         }
                    } else {
                        tempType = this.pvTypes.replace(type + ',', '');
                    }
                    if (!this.pvStatus) {
                        this.updateParam('publicVideo', 'status', true);
                    }
                    if (!tempType) {
                        this.updateParam('publicVideo', 'status', false);
                    }
                    this.updateParam('publicVideo', 'types', tempType);
                    state = true;
                }
                return state;
            },

            // 初始化面板状态
            // initPoiStat: function() {
            //     // 获取poi状态
            //     // let data = ["EMERGENCY_FORESTRY","SJZX_EMERGENCY_POLICE","EDUCATION_SCHOOL"];
            //     let url = this.dss_sj+/gisInfo/gis-info!queryPoiTypeData.action';
            //     let qd = {
            //         'areaCode': this.code
            //     };
            //     $.getJSON(url, qd, (bd) => {
            //         let typeStr = '';
            //         let typeArr = this.poi;
            //         for (let key in typeArr) {
            //             let stat = false;
            //             if (bd.indexOf(key) != -1) {
            //                 stat = true;
            //             }
            //             this.poi[key] = stat;
            //         }
            //     });
            //     setTimeout(() => {
            //         this.getCollection();
            //     }, 500);
            //     this.updatePoistatus(data) 从path获取参数值
            //     if (this.controlTypes.length != 0) {
            //         let tempType = [],
            //             tempTypeStr = "";
            //         for (let i in this.controlTypes) {
            //             tempTypeStr += "poi_" + this.controlTypes[i] + ",";
            //             for (let k in this.bm_list) {
            //                 if ($.inArray(this.controlTypes[i], this.bm_list[k].child) != -1) {
            //                     this.bm_list[k].iselect = true;
            //                 }
            //             }
            //         }
            //         this.poi_apart(this.controlTypes, true);
            //         $(this.$els['jcPanel']).removeClass('status');
            //         $(this.$els.panelBar).find('li').eq(1).addClass('on');
            //     }
            // },
            // 初始化定制面板状态
            initcusPoiStat: function() {
                // 获取poi状态
                let url = this.dss+'/gisInfo/gis-info!queryPoiTypeData.action';
                let qd = { 'areaCode': this.code };
                $.getJSON(url, qd, (bd) => {
                    let typeStr = '';
                    let typeArr = this.poi;
                    for (let key in typeArr) {
                        let stat;
                        if (bd.indexOf(key) != -1) {
                            stat = true;
                        }else{
                            stat = false;
                        }
                        this.poi[key] = stat;
                    }
                });
            },
            getCollection: function() {
                let url = this.dss_sj+'/left-panel/left-panel!getCollectionData.action';
                let qd = { 'userId': this.userId };
                $.getJSON(url, qd, (bd) => {
                    for (let k in bd) {
                        if (k === '1') {
                            let tempData = bd[k];
                            this.collectData = tempData;
                            this.updateParam('poi','collectPoiType',tempData)
                            this.collectFlag = true;
                        } else if (k === '2') {
                            let tempSS = bd[k];
                            tempSS[0].child.push({"iselect":false,"name":"交通路况","type":"traffic"});
                            this.collectSSData = tempSS;
                            this.collectSSFlag = true;
                        } else if (k === '0') {  //模型绑定的poi
                            let tempData = bd[k];
                            this.modelData = tempData;
                            let cusModelData = tempData;
                            this.updateParam('model', 'cusModelData', cusModelData);
                        }
                    }
                    this.showHide();
                });
            },
            selectBase: function(data, status) {
                let a = [];
                for (let k in data.child) {
                    let t = data.child[k].type;
                    a.push(t)
                }
                this.preModelPoi = a;
                this.model_poi(a, status);

            }
        },
        ready: function() {
            
            this.getCollection();
            var call=setTimeout(() => {
                this.initcusPoiStat();
                clearTimeout(call);
            }, 500);
            this.bm_type = new Object();
            this.bm_list.forEach((item) => {
                for (let i in item.child) {;
                    for (let k in this.relation) {
                        if ($.inArray(item.child[i], this.relation[k]) != -1) {
                            this.bm_type[item.child[i]] = k;
                        }
                    }
                }
            });
        }
    }

</script>

<style scoped lang="less">
 @import "../../assets/css/common.less";

.ndata {
    color: silver
}
.hdata {
    color: #414e61;
}
.panel {
    height: auto;
    position: absolute;
    top: 50%;
    margin-top: -150px;
    left: 0;
    z-index: 2;
    display: block;
    border: 1px solid #ccc;
    border-right: 0;
    background-color: #fff;
    text-align:center;
    -moz-box-shadow: 0 0px 10px 0 rgba(0, 0, 0, .3);
    -webkit-box-shadow: 0 0px 10px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 0px 10px 0 rgba(0, 0, 0, .3);

    .item {
        width: 34px;
        height: auto;
        background-color: #fff;
        float: left;
        position: relative;
        z-index: 999;

        ul li {
            width: 33px;
            padding: 41.4px 0;
            display: block;
            border-bottom: 1px solid #ccc;
            border-right: 1px solid #ccc;
            background: #ecf2fc;
            clear: both;
            cursor: pointer;
            text-align: center;
            border-left: 0;
            transition: background 0.5s;
            -moz-transition: background 0.5s;
            -webkit-transition: background 0.5s;
            -o-transition: background 0.5s;
            transition: color 0.5s;
            -moz-transition: color 0.5s;
            -webkit-transition: color 0.5s;
            -o-transition: color 0.5s;
        }
        ul li:last-child {
            border-bottom: 0;
        }
        ul li:hover {
            background: #DEE7F7;
            color: @color;
        }
        ul li.on {
            background: #fff;
            border-right-color: #fff;
            color: #2D86D3;
        }
    }

}
.item ul li:last-child,.time{
    display: none;
}
// 第二种方案
.panel.program_two{
    .item ul li:last-child,.time{
        display: block;
    }
    .jc_panel,.ss_panel,.bm_panel{
        .child-logo{
            width:72px;
        }
        ul.menu-list{
            margin-left:72px;
        }
    }

    .item ul li{
        padding:27px 0;
    }
    .item ul li:last-child{
        display: block;
    }
    .child-panel{
        width:280px;
        overflow:hidden;
    }

    .jc_content,.ss_content{
        padding:0 16px;
    }

    .bm_panel{
        ul li{
            width:69px;
        }
    }
}

.hide {
    display: none;
}
.child-plane-box {
    float: left;
    overflow: hidden;

    .collect {
        position: absolute;
        height: 16px;
        width: 16px;
        bottom: 2px;
        right: 2px;
        cursor: pointer;
        background: url('../../assets/img/common/collect.png') no-repeat;
    }
    .back {
        position: absolute;
        height: 16px;
        width: 16px;
        bottom: 2px;
        right: 2px;
        cursor: pointer;
        background: url('../../assets/img/common/back.png') no-repeat;
    }
}
.child-panel {
    background-color: #fff;
    padding: 0 1px;
    width: 237px;
    height: auto;
    margin-left: 2px;

    ul li {
        float: left;
        list-style-type: none;
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
div.collect-panel ul li:last-child .hr_line {
    border-bottom: 0;
}
.child-logo {
    width: 50px;
    height: 30px;
    line-height:100%;
    box-sizing: border-box;
    // display: inline-block;
}

.child-logo:hover {
    color: @color;
}
// 图标样式
    .ss_cloud {
        background: url("../../assets/img/minbase/a5.png") no-repeat center center;
    }
    .ss_river {
        background: url("../../assets/img/minbase/a8.png") no-repeat center center;
    }
    .ss_air {
        background: url("../../assets/img/minbase/a6.png") no-repeat center center;
    }
    .ss_video {
        background: url("../../assets/img/minbase/a7.png") no-repeat center center;
    }
    .ss_boat {
        background: url("../../assets/img/minbase/a9.png") no-repeat center center;
    }
    .ss_dase {
        background: url("../../assets/img/minbase/a1.png") no-repeat center 2px;
    }
    .ss_wuzi {
        background: url("../../assets/img/minbase/a2.png") no-repeat center 2px;
    }
    .ss_power {
        background: url("../../assets/img/minbase/a3.png") no-repeat center 2px;
    }
    .ss_place {
        background: url("../../assets/img/minbase/a4.png") no-repeat center 2px;
    }
    .bm_traffice_0 {
        background: url("../../assets/img/minbase/07.png") no-repeat center;
    }
    .bm_traffice_1 {
        background: url("../../assets/img/minbase/04.png") no-repeat center;
    }
    .bm_traffice_2 {
        background: url("../../assets/img/minbase/03.png") no-repeat center;
    }
    .bm_traffice_3 {
        background: url("../../assets/img/minbase/16.png") no-repeat center;
    }
    .bm_traffice_4 {
        background: url("../../assets/img/minbase/06.png") no-repeat center;
    }
    .bm_traffice_5 {
        background: url("../../assets/img/minbase/11.png") no-repeat center;
    }
    .bm_traffice_6 {
        background: url("../../assets/img/minbase/13.png") no-repeat center;
    }
    .bm_traffice_7 {
        background: url("../../assets/img/minbase/09.png") no-repeat center;
    }
    .bm_traffice_8 {
        background: url("../../assets/img/minbase/05.png") no-repeat center;
    }
    .bm_traffice_9 {
        background: url("../../assets/img/minbase/15.png") no-repeat center;
    }
    .bm_traffice_10 {
        background: url("../../assets/img/minbase/14.png") no-repeat center;
    }
    .bm_traffice_11 {
        background: url("../../assets/img/minbase/08.png") no-repeat center;
    }
    .bm_traffice_12 {
        background: url("../../assets/img/minbase/02.png") no-repeat center;
    }
    .bm_traffice_13 {
        background: url("../../assets/img/minbase/12.png") no-repeat center;
    }
    .bm_traffice_14 {
        background: url("../../assets/img/minbase/07.png") no-repeat center;
    }
    .bm_traffice_15 {
        background: url("../../assets/img/minbase/01.png") no-repeat center;
    }
    .bm_traffice_16 {
        background: url("../../assets/img/minbase/office.png") no-repeat center;
    }
    .bm_traffice_17 {
        background: url("../../assets/img/minbase/build.png") no-repeat center;
    }
    .bm_traffice_18 {
        background: url("../../assets/img/minbase/lvyou.png") no-repeat center;
    }

.ss_list {
    ul li {
        margin: 4px 14px;
    }
}
.hr_line {
    width: 100%;
    height: 53px;
    border-bottom: 1px solid #E5E8EC;
}
.jc_list {
    width: 187px;

    ul li {
        margin: 6px 6px;
    }
}
.zh_panel{
    text-align:left;
    // display: block;

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
}
.bm_panel {
    ul{
        overflow:hidden;
    }
    ul li {
        padding-top: 10px;
        cursor: pointer;
        width: 56px;
        text-align: center;
        position: relative;

        label {
            line-height:24px;
            cursor: pointer;
        }
        div {
            width: 32px;
            height: 32px;
            text-align: center;
            margin: auto;
        }
    }
    ul li:hover label {
        color: @color
    }
}

.jc_panel,.ss_panel{
    ul{
        overflow:hidden;
    }
    li{
        position: relative;

        &>div{
            position: absolute;
            top: 50%;
            
        }
        & ul{
            float:left;
            margin-left:50px;
        }
    }
    .ss_content:hover,.jc_content:hover{
        color:#1f7ed0;
    }
}
.jc_panel{
    line-height: 25px;
    
    li>div{
        transform:translateY(-28px);
    }
    .jc_content{
        line-height:28px;
        padding:0 10px;
    }
    .jc_item:not(:last-child){
        border-bottom:1px solid #e5e8ec;
    }

    .menu-list{
        padding-top:12px;
        padding-bottom:6px;
    }
}

.ss_panel{
    li>div{
        transform:translateY(-15px);
    }
    .ss_content{
        line-height:28px;
        padding:0 10px;
    }
    .ss_item{
        padding-top:16px;
        padding-bottom:12px;
    }
    .ss_item:not(:last-child){
        border-bottom:1px solid #e5e8ec;
    }
    .ss_item:not(:first-child) .ss_content{
        height:38px;
        line-height:38px;
    }
}
.poipanel ul li.selected em.emfocus, .bm_panel ul li.selected em.emfocus {
    position: absolute;
    z-index:999;
    display: block;
}
.poipanel ul li.selected em.emfocus {
    right: -10px;
    top: -5px;
}
.bm_panel ul li.selected {
    background: @bg;
}
.bm_panel ul li.selected em.emfocus {
    top: -6px;
    right: -5px;
}
.all-select-btn {
    position: absolute;
    bottom: 3px;
    right: 28px;
    cursor: pointer;
    color: #1f7ed0;
    font-weight: normal;
    height: 16px;
    line-height: 16px;
}
.all-select-btn:hover {
    color: #414E61
}
.popDiv-ndata {
    position: absolute;
    width: 250px;
    height: 90px;
    background: #fff;
    left: 50%;
    top: 50%;
    margin-left: -125px;
    margin-top: -45px;
    box-shadow: 3px 0px 8px 0 rgba(0, 0, 0, 0.3);
}
.popDiv-ndata .box {
    line-height: 90px;
    font-size: 16px;
    text-align: center;
}
.table-layout {
    display: table;
    width: 100%;
}
.table-cell {
    display: table-cell;
    vertical-align: middle;
    padding: 4px 0;
}
.table-cell:first-child {
    width: 48px;
    text-align: center;
}
.expend-transition {
    overflow: hidden;
}
.expend-leave {
    animation: expend-out .8s;
}
@keyframes expend-in {
    0% {
        width: 0px
    }
    ;

    100% {
        width: 340px
    }
    ;
}
@keyframes expend-out {
    0% {
        width: 340px
    }
    100% {
        width: 0px
    }
}
.showButton {
    position: absolute;
    right: 0;
    display: inline-block;
    width: 12px;
    height: 50px;
    top: 50%;
    margin-top: -25px;
    cursor: pointer;
    background: #ecf2fc url("../../assets/img/model/toggle.png") no-repeat center center;
}
div.collect-panel {
    .hr_line {

        /*height: 63px;*/
    }
    .ss_list ul li {
        margin: 5px 9px;
    }
    .collect-title {
        font-weight: bold;
    }
}

/*big*/
.big .panel {
    margin-top: -234px;

    .item {
        width: 45px;

        ul li {
            width: 45px;
            padding: 52.1px 0;
        }
    }
}
.big .child-panel {
    width: 330px;
}
.big .table-cell:first-child {
    width: 84px;
}
.big .jc_list {
    width: 250px;

    ul li {
        margin: 5px 10px;
    }
}
.big .child-logo, .big .bm_panel ul li div {
    -webkit-background-size: auto 80% !important;
    -moz-background-size: auto 80% !important;
    background-size: auto 80% !important;
}
.big .bm_panel {
    ul li {
        width: 72px;
        margin-bottom: 3px;

        div {
            width: 48px;
            height: 48px;
        }
    }
}
.big .hr_line {
    height: 87px;
}
.big div.collect-panel {
    .hr_line {
        height: 78px;
    }
}
.big .all-select-btn {
    font-size: 16px;
}
</style>