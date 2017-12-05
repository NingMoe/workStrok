<!--全局搜索组件-->
<template>
    <div>
        <div class="global-search">
            <div class="search-top">
                <div class="search-tab">
                    <ul>
                        <li v-for="item in list" :class="{'s-item':item.s}" @click="selectTab(item.name,item.s)">{{ item.name }}</li>
                    </ul>
                </div>
                <div class="search-hd">
                    <div class="search-bg"></div>
                    <input type="text" v-model="ivalue" class="search-input">
                    <em class="pholder"></em>
                    <span class="warn-msg" v-if='ivalue==""'>{{warnMsg}}</span>
                    <button v-if="content.length>0" class="search-button" @click="clearContent">清除</button>
                    <button class="search-button" :class="{'two-button':content.length>0,'only-search':content.length==0}" @click="search()">搜索</button>
                </div>
            </div>

            <v-location-search v-if="poiPanel" :id="cacheId" :obj="obj" @close="closePoiPanel"></v-location-search>

            <div v-if='!poiPanel && content.length>0'>
                <div class="search-content">
                    <ul>
                        <template v-for="item in content">
                            <li v-if="$index >= minindex && $index < maxindex" @click="selectItem(item)" @mouseenter="showPoint(item, $index, 'mouse')" @mouseleave="clearPoint('mouse')"><span><label>{{ getNum($index) }}</label></span>{{ item.paramVal }}</li>
                        </template>
                    </ul>
                </div>
                <ul class="page-control">
                    <li>第{{page.tp}}页/共{{maxpage}}页 {{content.length}}条记录</li>
                    <li @click="exchange(1)" class="pageNext">下一页</li>
                    <li @click="exchange(-1)" class="pagePre">上一页</li>
                </ul>
            </div>
        </div>
        
        <v-cases></v-cases>
    </div>
</template>

<script>

    import lmap from '../../../util/lmap/lmap'
    import config from '../../../config'
    import Cases from './Cases'
    import { updateParam } from '../../../vuex/store'
    import locationSearch from './LocationSearch'

    export default {
        components: { 'v-cases': Cases, 'v-location-search': locationSearch },
        data() {
            return {
                map: config.getParam('map'),
                layer: undefined,
                dragCircle: lmap.custom.init('dragCircle'),
                list: [
                    { name: 'POI', s: true }, 
                    { name: '观测站', s: false }, 
                    { name: '灾害点', s: false }, 
                    { name: '经纬度', s: false }, 
                    { name: '案例库', s: false }
                ], // { name: '地址检索', s: false }
                ivalue: '',
                content: [],
                page: { showc: 8, tp: 1 },
                reqType: 'poi',
                selectStatus: false,
                poiPanel: false,
                cacheId: undefined,
                obj: { },
                feature: undefined,
            }
        },
        vuex: {
            getters: {
                code: state => state.cityCode,
                dss_sj: state => state.dss_sj,
                dss: state => state.dss
            },
            actions: { updateParam }
        },
        computed: {
            warnMsg() {
                let msg = {
                    'POI': '请输入POI名称',
                    '观测站': '请输入站点编号或名称',
                    '灾害点': '请输入灾害点名称或地址',
                    '经纬度': '请输入经纬度值,如: 113.22, 23.22 以","号分隔',
                    '案例库': '请输入案例标题关键字',
                }; // '地址检索': '请输入地址关键字'
                let list = this.list;
                let showMsg = '';
                list.forEach((item) => {
                    if (item.s) showMsg = msg[item.name];
                });
                return showMsg;
            },
            minindex() {
                return (this.page.tp - 1) * this.page.showc;
            },
            maxindex() {
                return this.page.tp * this.page.showc;
            },
            maxpage() {
                let mod = this.content.length % this.page.showc;
                let page = parseInt(this.content.length / this.page.showc);
                if (mod != 0) page += 1;
                return page;
            }
        },
        watch: {
            ivalue() {
                let url;
                let qdata;
                if (this.reqType === 'address') {
                    // url = this.dss_sj+'/lucene/lucene!getRoadName.action';
                    // qdata = { address: this.ivalue, areaCode: '440000', limit: 100 };
                    url = 'http://api.map.baidu.com/place/v2/suggestion';
                    qdata = { 'query': encodeURIComponent(this.ivalue), 'output': 'json', 'region': '44', 'ak': 'XPqsMnpmoAjEu2hHUKlPPH3fVY7plOXI', 'callback': 'cb' };
                    $.ajax({
                        url: url,
                        type: 'get',
                        data: qdata,
                        dataType: 'jsonp',
                        jsonpCallback: 'cb',
                        success: (json) => {
                            this.changeData(json.result);
                        }
                    })
                } else if (this.reqType !== 'lonlat' && this.reqType !== 'address') {
                    url = this.dss+'/lucene/lucene!queryDataIndex.action';
                    qdata = {
                        type: this.reqType,
                        keyWord: this.ivalue,
                        areaCode: '440000',
                        limit: 100
                    };
                    $.getJSON(url, qdata, (bdata) => {
                        this.changeData(bdata);
                    });
                }
            }
        },
        methods: {
            changeData(data) {
                data.forEach((obj) => {
                    if (this.reqType === 'site') {
                        obj.paramVal = obj.siteName;
                    } else if (this.reqType === 'demage') {
                        obj.paramVal = '(' + obj.level + ') ' + obj.address;
                    } else if (this.reqType === 'cases') {
                        obj.paramVal = obj.title;
                    } else if (this.reqType === 'address') {
                        obj.paramVal = obj.name;
                        obj.lon = obj.location.lng;
                        obj.lat = obj.location.lat;
                        delete obj.location.lng;
                        delete obj.location.lat;
                    }
                });
                this.content = data;
            },
            // 点击切换
            selectTab(name, s) {
                this.selectStatus = false;
                this.closePoiPanel();
                if (!s) {
                    let list = this.list;
                    list.forEach((item) => {
                        if (item.name != name) item.s = false;
                        else item.s = true;
                    });
                    this.content = [];
                    this.ivalue = '';
                }
                let reqTypeObj = {
                    'POI': 'poi',
                    '观测站': 'site',
                    '灾害点': 'demage',
                    '案例库': 'cases',
                    '经纬度': 'lonlat',
                    '地址检索': 'address'
                };
                let reqType = reqTypeObj[name];
                if (reqType) {
                    this.reqType = reqType;
                }
                this.clearPoint();
            },
            getNum(index) {
                return index % this.page.showc + 1;
            },
            // 获取焦点
            onfocus() {
                this.warnMsg = '';
            },
            onblur() {
                this.warnMsg = '请输入搜索内容';
            },
            exchange(num) {
                if (this.page.tp == 1 && num < 0) return;
                if (this.page.tp == this.maxpage && num > 0) return;
                this.page.tp += num;
            },
            // 清空所有数据
            clearContent() {
                this.ivalue = '';
                this.content = [];
                this.clearPoint();
                this.selectStatus = false;
            },
            selectItem(item) {
                this.clearPoint();
                if (!this.selectStatus) {
                    this.selectStatus = true;
                }
                if (this.reqType === 'poi') {
                    this.removeDragCircle();

                    this.obj = { lon: item.lon, lat: item.lat, type: item.poiType };
                    this.cacheId = null;
                    this.poiPanel = true;

                    // this.updateParam('poiBox', 'type', item.poiType);
                    // this.updateParam('poiBox', 'lonlat', [item.lon, item.lat]);
                } else if (this.reqType === 'site') {
                    this.updateParam('siteBox', 'siteId', item.siteId);
                    this.updateParam('siteBox', 'lon', item.lon);
                    this.updateParam('siteBox', 'lat', item.lat);
                } else if (this.reqType === 'demage') {
                    this.updateParam('damageBox', 'lonlat', [ item.lon, item.lat ]);
                    this.updateParam('damageBox', 'status', true);
                } else if (this.reqType === 'cases') {
                    this.$children[0].isCases = true;
                    this.$children[0].item = item;
                } else if (this.reqType === 'address') {
                    // let view = this.map.getView();
                    // view.setCenter(lmap.transform([ item.lon, item.lat ]));
                }
                if (this.reqType !== 'cases') {
                    this.showPoint(item, 'lonlat');
                    lmap.controler.panTo(this.map, item.lon, item.lat, 12);
                }
            },
            search() {
                if (this.reqType === 'lonlat') {
                    let obj = {};
                    let [ lon, lat ] = this.ivalue.split(',');
                    if (!lat) {
                        this.warnMsg = '格式错误，经纬度不正确';
                    } else {
                        obj.lon = Number(lon).toFixed(2);
                        obj.lat = Number(lat).toFixed(2);
                        obj.paramVal = '经纬度点：' + obj.lon + ', ' + obj.lat;

                        console.info('------------------A');

                        let view = this.map.getView();
                        view.setCenter(lmap.transform([ lon , lat ]));
                        this.showPoint(obj, 'lonlat');
                    }
                }
            },
            showPoint(item, index, type) {
                if (this.selectStatus && type === 'mouse') {
                    return;
                }
                if (item.lon && item.lat) {
                    this.clearPoint();
                    let iconUrl;
                    
                    if (index === 'lonlat') {
                        iconUrl = 'http://10.148.16.56/topic/little/search/point.png';
                    } else if (Object.prototype.toString.call(index) === '[object Number]') {
                        iconUrl = 'http://10.148.16.56/topic/little/search/point' + (parseInt(index % 8) + 1) + '.png';
                    }

                    let style = {
                        iconUrl: iconUrl,
                        anchor: [9, 0],
                        iconSize: [18, 28],
                        fontColor: 'red',
                        fontSize: '12px',
                        outColor: 'white',
                        outWidth: 3,
                        text: item.paramVal,
                        offsetY: 15,
                        offsetX: 10
                    };
                    
                    let tempStyle = Object.assign({}, style);
                    tempStyle.iconUrl = 'http://10.148.16.56/topic/little/search/spoint.png';
                    let selectStyle = lmap.icon.getStyle(tempStyle);

                    let feature = lmap.icon.addIcon(this.layer, style, Number(item.lon), Number(item.lat), this.reqType);
                    feature.set('selectStyle', selectStyle);
                    feature.set('defaultStyle', feature.getStyle());
                    this.feature = feature;

                }
            },

            clearPoint(type) {
                // if (this.selectStatus) {
                //     return;
                // }
                if (type !== 'mouse' || !this.selectStatus) {
                    lmap.icon.clear(this.layer);
                }
            },

            clickEvt(evt) {
                if (this.selectStatus) {
                    let feature = evt.map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                        return feature;
                    });

                    if (!!feature && feature.get('name') === 'poi') {

                        feature.setStyle(feature.get('selectStyle'));

                        let lonlat = feature.getGeometry().getCoordinates();
                        let [ lon, lat ] = lmap.transform(lonlat, true);

                        let ele = document.createElement('div');
                        let $box = $('<div class="cricle-box-panel"><div class="cricle-box-radio"><ul id="radius-box"><li><label>定点POI搜索:</li><li><label><input type="radio" name="radius" value="1000"></input>1公里</label></li><li><label><input type="radio" name="radius" value="5000"></input>5公里</label></li><li><label><input type="radio" name="radius" value="10000"></input>10公里</label></li></ul><a href="javascript: void(0);" class="close" id="cricle-box-cancel"></a></div></div>');
                        ele.appendChild($box[0]);
                        let overlay = new ol.Overlay({
                            element: ele,
                            offset: [147, -30],
                            positioning: 'bottom-right'
                        });
                        overlay.setPosition(lonlat);
                        this.overlay = overlay;
                        evt.map.addOverlay(overlay);

                        let _that = this;

                        $box.find('#radius-box input').unbind().click(function() {
                            let radius = $(this).val();
                            if (radius) {
                                if (!!_that.overlay && _that.map) _that.map.removeOverlay(_that.overlay);
                                _that.overlay = null;
                                _that.initDragCircle(lon, lat, radius);
                            }
                        });

                        $box.find('#cricle-box-cancel').unbind().click(function() {
                            if (!!_that.overlay && _that.map) _that.map.removeOverlay(_that.overlay);
                            _that.overlay = null;
                            _that.feature.setStyle(_that.feature.get('defaultStyle'));
                        });

                        // $box.find('#cricle-box-confirm').unbind().click(function() {
                        //     let radius = $('#radius-box input:checked').val();
                        //     if (radius) {
                        //         if (!!_that.overlay && _that.map) _that.map.removeOverlay(_that.overlay);
                        //         _that.overlay = null;
                        //         _that.initDragCircle(lon, lat, radius);
                        //     }
                        // });

                    }

                }
            },

            initDragCircle(lon, lat, radius = 1000) {

                this.removeDragCircle();

                let pointA = {
                    lonlat: [ parseFloat(lon), parseFloat(lat) ],
                    style: {
                        iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR42mP8DwABAwEBnHxMcgAAAABJRU5ErkJggg==',
                        anchor: [0.5, 0.5],
                        iconSize: [1, 1],
                        scale: 1,
                    },
                    code: 'A'
                };

                let lonlatB = this.dragCircle.getPointB(pointA.lonlat, radius);

                let pointB = {
                    lonlat: lonlatB,
                    style: {
                        iconUrl: 'http://10.148.16.56/topic/little/dragCircle/02.png',
                        anchor: [6, 6],
                        iconSize: [12, 12],
                        scale: 1,
                    },
                    code: 'B'
                };
                
                let param = { pointA, pointB, map: lmap.map };
                this.dcParam = this.dragCircle.init(param, this.dragEndEvt);

            },

            removeDragCircle(){
                if (!!this.dcParam) {
                    this.dragCircle.remove(this.dcParam);
                }
                if (!!this.overlay && !!this.map) {
                    this.map.removeOverlay(this.overlay);
                    this.overlay = null;
                }
            },

            dragEndEvt(circle) {
                let wkt = lmap.draw.getCircleWkt(circle);
                let url = 'http://10.148.16.57:9999/dss/atwill/atwill!refreshAtwill.action';
                let qdata = { wkt: wkt, code: this.code };
                let count = this.count;
                for (let key in count) {
                    count[key].num = '分析中';
                }
                $.ajax({
                    type: 'POST',
                    data: qdata,
                    url: url,
                    success: (bd) => {
                        this.cacheId = bd.id;
                        this.obj = null;
                        this.poiPanel = true;
                    }
                });
            },

            closePoiPanel(){
                if (!!this.feature) {
                    this.feature.setStyle(this.feature.get('defaultStyle'));
                    this.feature = undefined;
                }
                this.poiPanel = false;
                this.removeDragCircle();
            }

        },
        ready() {
            this.map.on('singleclick', this.clickEvt);
            this.layer = lmap.icon.initLayer(this.map, 'point');
        },
        detached() {
            this.map.un('singleclick', this.clickEvt);
            lmap.icon.clear(this.layer);
            this.map.removeLayer(this.layer);
            this.removeDragCircle();
            delete this.layer;
            delete this.map;
        }
    }
</script>

<style scoped lang='less'>
 @import "../../../assets/css/common.less";

.global-search {
    position: absolute;
    right: 0px;
    top: 30px;
    z-index: 4;
    width: 380px;
    height: auto;
    padding: 2px;
    background-color: #fff;
    -webkit-box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .3);
    -moz-box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .3);
}
.search-tab {
    height: 22px;

    ul li {
        width: 60px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        float: left;
        cursor: pointer;
        border-radius: 5px 5px 0 0;
        -webkit-border-radius: 5px 5px 0 0;
        -moz-border-radius: 5px 5px 0 0;
    }
    ul li:hover {
        color: @color;
    }
}
.search-hd {
    height: 32px;
    background-color: #ecf2fc;
    padding: 2px;
    position: relative;

    .search-bg {
        width: 300px;
        height: 32px;
        background-color: #fff;
        position: absolute;
        left: 2px;
        top: 2px;
        z-index: 1;
    }
    .search-input {
        width: 82%;
        height: 32px;
        text-indent: 20px;
        z-index: 3;
        border: 0;
        float: left;
        color: @colorH;
        position: relative;
        z-index: 2;
        background: 0;
        margin-left: 10px;
        list-style-type: none;
        -webkit-text-size-adjust: none;
        outline: none;
    }
    .search-button {
        height: 34px;
        line-height: 34px;
        right: 2px;
        top: 2px;
        border: 0;
        z-index: 6;
        color: #414e61;
        background: 0 0;
        outline: 0;
        position: absolute;
        cursor: pointer;
        z-index: 1;
        text-align: center;
    }
    .search-button:hover {
        color: #1F7ED0;
    }
    .two-button {
        width: 40px;
        right: 38px;
    }
    .only-search {
        width: 75px;
    }
    .pholder {
        display: inline-block;
        height: 30px;
        width: 25px;
        position: absolute;
        left: 8px;
        background: url("../../../assets/img/common/search.png") 0 8px no-repeat;
        z-index: 1;
    }
    .warn-msg {
        display: inline-block;
        padding: 2px 0 2px 0px;
        color: #999;
        position: absolute;
        left: 30px;
        top: 8px;
        z-index: 1;
        height: 16px;
    }
}
.s-item {
    background-color: #ecf2fc;
    font-weight: 700;
}
.un-itetm {
    background-color: #fff;
}
.page-control {
    height: 24px;
    line-height: 24px;

    li {
        float: left;
    }
    li.pagePre {
        float: right;
        cursor: pointer;
    }
    li.pageNext {
        float: right;
        margin-left: 5px;
        cursor: pointer;
    }
    li.pagePre:hover, li.pageNext:hover {
        color: #1F7ED0;
    }
}
.search-content li {
    padding: 5px 0px 8px 30px;
    text-align: left;
    border-bottom: 1px solid #ECF2FC;
    position: relative;
    min-height: 22px;
    line-height: 22px;

    span {
        position: absolute;
        display: inline-block;
        width: 20px;
        height: 20px;
        left: 4px;
        top: 5px;
    }
    span label {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        width: 20px;
        color: #FFFFFF;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
    }
    span:before {
        content: "";
        position: absolute;
        display: inline-block;
        width: 20px;
        height: 20px;
        -webkit-border-radius: 100% 100% 100% 0;
        -moz-border-radius: 100% 100% 100% 0;
        border-radius: 100% 100% 100% 0;
        background: red;
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        transform: rotate(-45deg);
    }
    span:after {
        content: "";
        display: inline-block;
        width: 2px;
        height: 5px;
        position: absolute;
        left: 9px;
        bottom: -6px;
        background: red;
    }
}
.search-content li:hover {
    background: #c3d5de;
}

/*big*/
.big .global-search {
    top: 45px;
    width: 550px;

    .search-tab {
        height: 30px;

        ul li {
            width: 100px;
            height: 30px;
            line-height: 30px;
        }
    }
    .search-hd {
        height: 40px;

        .search-bg {
            width: 434px;
            height: 40px;
        }
        .search-input {
            width: 80%;
            height: 40px;
            font-size: 20px;
        }
        .search-button {
            height: 40px;
            line-height: 40px;
            font-size: 20px;
        }
        .two-button {
            width: 54px;
            right: 54px;
        }
        .only-search {
            width: 107px;
        }
        .pholder {
            height: 40px;
            background-position: 0 14px !important;
        }
    }
}
.big .search-content li {
    padding: 5px 0px 8px 40px;
    min-height: 28px;
    line-height: 28px;

    span {
        width: 24px;
        height: 24px;
        left: 8px;
        top: 6px;
    }
    span label {
        height: 24px;
        line-height: 24px;
        width: 24px;
    }
    span:before {
        width: 24px;
        height: 24px;
    }
    span:after {
        height: 7px;
        left: 11px;
        bottom: -7px;
    }
}
.big .page-control {
    height: 32px;
    line-height: 32px;
    padding-left: 5px;
}
</style>