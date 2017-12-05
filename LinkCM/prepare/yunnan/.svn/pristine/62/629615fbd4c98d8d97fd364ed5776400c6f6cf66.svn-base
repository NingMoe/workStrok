import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    ip: 'http://10.148.16.56',//ip地址 
    dss: 'http://10.148.16.56/dss',//本地
    dss_sj: 'http://10.148.16.56/dss',//省局 

    userName: '',
    areaName: '',
    cityCode: '',
    version: 'V4.0',
    userId: '',
    modelTypeName: '',
    isSelect: true,
    big: {
        status: false,
    },
    map: {
        layer: null,
        mapType: 'dt' // 默认为业务图
    },
    poi: {
        status: false,
        allTypes: '',
        layer: null,
        controlTypes: [],
        minBase: '', // 判断是否需要过滤点
        minTypes: '',
        clickStat: false, // 判断用户是否点击了poi类型面板，用于处理与圈选或模型“基础数据"功能互斥
        unClick: false, // 使地图无法点击
        collectPoiType:''  // 定制的基础信息的poi类型，用于查询六库中应急物资和救援力量的数量
    },
    typhoon: {
        status: false,
        winStatus: false,
        dateTime: '2016-05-27_12_00',
        info: {
            type: '热带低压',
            code: 'TN',
            name: '尼伯特',
            ename: 'nepartak',
            dateTime: '2016-07-10 11:00',
            lonlat: '<span>116.5<sup>°</sup>E, 26.7<sup>°</sup>N</span>',
            windPressure: '13米/秒 998百帕',
            radius: '',
            tsid: ''
        }
    },
    radar: {
        status: false,
        dateTime: '2016-05-27_12_00',
        checkTime: '2016-05-27_12_00',
        layer: null
    },
    cloud: {
        status: false,
        dateTime: '2016-05-27_12_00',
        layer: null
    },
    model: {
        status: false,
        pType: '',
        cType: '',
        layer: null,
        levels: '',
        dateTime: '201606121300',
        respTime: '201606121300',
        cacheId: '',
        cusModelData: '', // 用户定制的模型
        cusModelStat: true, // 默认使用用户定制的模型
        tempCacheId: '', // 当小面板关闭时，用于临时记录cacheId
        cTime: '' // 子时间
    },
    atwill: {
        status: false
    },
    message: {
        text:'',
        status: false
    },
    distance: {
        status: false,
        draw: null,
        helpTooltip: null,
        layer: null
    },
    globalSearch: { // 全局搜索
        status: false
    },
    econtrol: { // 指挥工具
        status: false,
        commandId: ''
    },
    about: {
        status: false
    },
    suggesion: {
        status: false
    },
    time: {
        lifeTime: null,
        sysTime: null,
        sysMinTime: null,
        isPlaying: false,
        loadArr: ''
    },
    suggestion: {
        status: false
    },
    decisionServe: {
        status: false
    },
    site: { // 监测站点
        status: false,
        winStatus: false,
        dateTime: '',
        elements: '',
        data:'',  // 记录观测站的信息
        siteFlag:''   // 是否要从新请求站点信息和雨量信息，当地图拖动时，从新请求，从新匹配像素
    },
    townName: { // 圈选镇名
        status: false,
        layer: null,
        fontSize: '14',
        fontStreet: false,
        highlight: true   // 是否高亮显示镇名（描边）
    },
    ship: { // 船舶
        status: false,
        dateTime: ''
    },
    thunder: { // 雷电
        status: false,
        dateTime: ''
    },
    opacity: { // 透明度
        status: false,
        value: 100,
    },
    video: { // 右上角视频
        status: false
    },
    tab: {
        status: false
    },
    airq: { // 空气质量
        status: false,
        layer: null,
        dateTime: '2016-07-24 14:00:00'
    },
    agr: { // 农情调查
        status: false,
        layer: null,
        dateTime: '2016072417'
    },
    traffic: { // 交通路况
        status: false
    },
    rainwarn: {
        status: false,
        dateTime: ''
    },
    damage: { // 地质灾害
        status: false,
        lonlat: '',
    },
    gridRain: { // 格点雨量
        status: false
    },
    publicVideo: { // 天气实景、公共视频
        status: false,
        types: ''
    },
    areaPolygon: {
        out: false
    },
    mountainTorrents: { // 山洪沟图层
        status: false,
        poi: false,
        model: false
    },
    wechat: { // 微信
        dateTime: false
    },
    pollutantDispersion: { // 污染扩散
        address: '',
        chemicals: ''
    },
    baseInfo: {
        name: '',
        type: '',
        status: false
    },
    siteBox: {
        status: false,
        siteId: null,
        lon: '',
        lat: '',
        feature: null,
        style: {}
    },
    poiBox: {
        lonlat: [],
        type: ''
    },
    damageBox: {
        status: false,
        lonlat: []
    },
    rainwarnBox: {
        status: false,
        pix: [0, 0],
        areaCode: '',
        showsate: false
    },
    activePoint: { // 图标选中展示组件
        // name:'',// 需要选中的图标名称
        stat: false, // 状态记录
        point: 'poi,120,23' // 图标名称 经度 纬度
    },
    sk_sw: { // 水库水位
        status: false
    },
    hl_sw: { // 河流水位
        status: false
    },
    water: { // 水质监控
        status: false
    },
    hfs: { // 核辐射
        status: false
    },
    dropzone: { // 灾害落区
        status: false,
        pType: '',
        cType: '',
        layer: null,
        dateTime: '2016-10-31 13:00:00',
        poiType: '',
        levels: '',
        geoIds: '',
        rowKey: '',
        minDatas: ''
    },
    townNameDropzone: { // 圈选镇名
        status: false,
        layer: null,
        fontSize: '14',
        fontStreet: false,
        highlight:true
    },
    windows: {
        divIds:''   // 用于存放弹窗的DIV的id
    },
    fourlibrary: {
        status: false
    },
}

const mutations = {
    UPDATEAREA(state, areaName, cityCode) {
        if (cityCode.length <= 6) {
            state.areaName = areaName;
            state.cityCode = cityCode;
            mutations.UPDATETITLE(state);
        }
    },
    GETCODE() {
        return state.cityCode;
    },
    UPDATEPARAM(state, type, param, bool) {
        state[type][param] = bool;
    },
    UPDATETITLE(state) {
        $(document).attr("title", state.areaName + "应急指挥决策辅助系统" + state.version);
    },
    UPDATEPOISTATUS(poi) {
        // 地址栏传递的poi值，数组类型，无poi_前缀
        state.poi.controlTypes = poi;
    },
    UPDATEVALUE(state, type, value) {
        // value = {status:false};
        for (let key in value) {
            state[type][key] = value[key];
        }
    },
    UPDATEUSERID(state, val) {
        state.userId = val;
    },
    UPDATEUSERNAME(state, val) {
        state.userName = val;
    },
    UPDATEMODELSTATE(state, typeName, bool) {
        state.modelTypeName = typeName;
        state.isSelect = bool;
    }
}

export default new Vuex.Store({ state, mutations })

export const updateArea = makeAction('UPDATEAREA')
export const updateParam = makeAction('UPDATEPARAM')
export const updateValue = makeAction('UPDATEVALUE')
export const getCode = makeAction('GETCODE')
export const updateTitle = makeAction('UPDATETITLE')
export const updatePoistatus = makeAction('UPDATEPOISTATUS')
export const updateUserId = makeAction('UPDATEUSERID')
export const updateUserName = makeAction('UPDATEUSERNAME')
export const updateModelState = makeAction('UPDATEMODELSTATE')

function makeAction(type) {
    return ({ dispatch }, ...args) => dispatch(type, ...args)
}
