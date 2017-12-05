<template>
    <div class="ship" v-show="hasShip" id="ship">
        <div class="title">
            <span>船名：{{item.ename}}</span>
            <a class="Close" @click="close()"></a>
        </div>
        <div class="ship-table">
            <table cellpadding="0" cellspacing="0">
                <tr><td>呼号</td><td>{{item.callSign}}</td><td>船类型</td><td>{{item.vesselType}}</td></tr>
                <tr><td>船长</td><td>{{item.length}}</td><td>船宽</td><td>{{item.width}}</td></tr>
                <tr><td>纬度</td><td>{{item.lat}}</td><td>经度</td><td>{{item.lon}}</td></tr>
                <tr><td>航向</td><td>{{item.course}}</td><td>航速</td><td>{{item.sog}}</td></tr>
                <tr><td>目的地</td><td>{{item.dest}}</td><td>时间</td><td>{{item.dDateTime}}</td></tr>
                <tr><td>ETA</td><td>{{item.eta}}</td><td>MMSI</td><td>{{item.mmsi}}</td></tr>
                <tr><td>最大吃水</td><td>{{item.draught}}</td><td>AIS类型</td><td>{{item.aisClass}}</td></tr>
                <tr><td>IMO</td><td>{{item.imo}}</td><td>船首向</td><td>{{item.cog}}</td></tr>
                <tr><td>导航设备</td><td>{{item.deviceType}}</td><td>导航状态</td><td>{{item.state}}</td></tr>
                <tr class="null-data">
                    <td colspan="4" v-show="isLost">上次同步时间：{{item.dDateTime}}，此船舶缺少最新上传数据。</td>
                </tr>
            </table>
        </div>
    </div>
</template>


<script>
    import Vue from 'Vue'
    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import { updateParam } from '../../vuex/store'
    import TimeUtil from '../../util/tools/TimeUtil'

    export default {
        data() {
            return {
                item: {},
                isLost: false,
                hasShip: false,
                map: config.getParam('map')
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                dateTime: state => state.ship.dateTime,
                loadArr: state => state.time.loadArr,
                isPlaying: state => state.time.isPlaying,
                divIds: state => state.windows.divIds
            },
            actions: {
                updateParam
            }
        },
        watch: {
            dateTime: function() {
                this.refreshWMS();
            }
        },
        methods: {
            close: function() {
                let tempIds = this.divIds;
                tempIds = tempIds.replace('ship,', '');
                this.updateParam('windows', 'divIds', tempIds);
                this.item = {};
                this.hasShip = false;
                lmap.icon.clear(this.layer);
            },
            setShipTimer: function() {
                let time = TimeUtil.getNextTimeLong(10) + 30000;
                let that = this;
                if (this.shipLayerTimer) {
                    window.clearTimeout(this.shipLayerTimer);
                }
                this.shipLayerTimer = window.setTimeout(function() {
                    that.refreshWMS();
                    return that.setShipTimer();
                }, time);
            },
            refreshWMS: function() {
                let reqData = {
                    'REQUESTTIME': TimeUtil.format(this.dateTime, 'yyyy-MM-dd HH')
                };
                lmap.image.updateImageWMS(this.WMS, reqData);
                this.selectShip([this.item.lon, this.item.lat]);
            },
            selectShip: function(lonlat, action) {
                if (!lonlat[0]) {
                    return;
                }
                let zoom = this.map.getView().getZoom() + '';
                let timeStr = TimeUtil.format(this.dateTime, 'yyyy-MM-dd HH');
                $.ajax({
                    url: this.dss+'/gis/gis!map.action',
                    type: 'GET',
                    dataType: 'json',
                    data: {
                        'REQUESTTIME': timeStr,
                        'LAYERS': 'shipPoint',
                        'LON': lonlat[0],
                        'LAT': lonlat[1],
                        'ZOOM': zoom
                    },
                    success: (json) => {
                        let tempIds = this.divIds;
                        tempIds = tempIds.replace('ship,', '');
                        tempIds += 'ship,';
                        this.updateParam('windows', 'divIds', tempIds);
                        this.dotShip(json, action);
                    }
                });
            },
            dotShip: function(item, action) {
                lmap.icon.clear(this.layer);
                let style = {
                    anchor: [16, 16],
                    iconUrl: 'http://10.148.16.56/topic/little/poi/ship.png',
                    iconSize: [32, 32],
                    scale: 1
                };
                let zoom = this.map.getView().getZoom();
                if (zoom < 9) {
                    style.iconSize = [32, 32];
                    style.scale = 0.3;
                }
                if (!item.mmsi && action === 'click') {
                    lmap.icon.addIcon(this.layer, style, Number(this.item.lon), Number(this.item.lat));
                } else if (!item.mmsi && this.item.mmsi) {
                    this.isLost = true;
                } else {
                    if (item.lon) {
                        this.isLost = false;
                        this.hasShip = true;
                        this.item = item;
                        lmap.icon.addIcon(this.layer, style, Number(item.lon), Number(item.lat));
                    }
                }
            },
            clickEvt: function(evt) {
                let lonlat = lmap.controler.getEvtLonLat(evt);
                this.selectShip(lonlat, 'click');
            },
            initWMS: function() {
                let timeStr = TimeUtil.format(this.dateTime, 'yyyy-MM-dd HH');
                let imageParam = {
                    'opacity': 1,
                    'url': this.dss+'/gd_image/image!loadShipWMS.action',
                    'name': 'ship',
                    'params': { 'REQUESTTIME': timeStr }
                }
                this.WMS = lmap.image.loadImageWMS(this.map, imageParam, 'poi');
                this.WMS.getSource().on('imageloadend', this.loadEndEvt);
                // let engineer = { name: 'Joe Sixpack', salary: 50 };
                // let interceptor = {
                //     set(target, property, value, receiver) {
                //         console.log(property, 'is changed to', value);
                //         return true;
                //     }
                // };
                // engineer = new Proxy(engineer, interceptor);
                // engineer.salary = 70;
            },
            loadEndEvt: function() {
                if (this.isPlaying) {
                    let arr = this.loadArr;
                    arr = arr.replace('ship,', '');
                    arr += 'ship,';
                    this.updateParam('time', 'loadArr', arr);
                }
            },
            zoomEvt: function() {
                this.dotShip(this.item);
            }
        },
        ready: function() {
            this.initWMS();
            this.setShipTimer();
            this.layer = lmap.icon.initLayer(this.map, 'poitop');
            this.map.on('singleclick', this.clickEvt);
            this.map.on('moveend', this.zoomEvt);
        },
        detached: function() {
            let tempIds = this.divIds;
            tempIds = tempIds.replace('ship,', '');
            lmap.icon.clear(this.layer);
            this.updateParam('windows', 'divIds', tempIds);
            this.WMS.getSource().un('imageloadend', this.loadEndEvt);
            this.map.un('singleclick', this.clickEvt);
            this.map.un('moveend', this.zoomEvt);
            this.map.removeLayer(this.WMS);
            delete this.WMS;
            delete this.map;
        }
    }
</script>

<style scoped lang='less'>
.ship {
    position: absolute;
    top: 0px;
    right: 0px;
    background: #fff;
    z-index: 3;
    width: 427px;
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
.Close {
    position: absolute;
    right: 0;
    top: 0;
    height: 20px;
    width: 20px;
    background: url("../../assets/img/toolsbar/rightIcon.png") no-repeat;
    background-position: -153px -60px !important;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
}
.ship table {
    width: 100%;

    td {
        padding: 4px;
        border-left: 1px solid #ecf2fc;
        border-bottom: 1px solid #ecf2fc;
    }
    td:first-child {
        border-left: 0;
    }
    td:first-child, td:nth-child(3) {
        width: 54px;
        text-align: right;
    }
    td:nth-child(2), td:nth-child(4) {
        font-weight: bold;
    }
    tr.null-data td:first-child {
        width: 100%;
        text-align: center;
    }
}

/*big*/
.big .ship {
    width: 600px;
}
.big .ship table {
    td {
        padding: 4px;
        border-left: 1px solid #ecf2fc;
        border-bottom: 1px solid #ecf2fc;
    }
    td:first-child, td:nth-child(3) {
        width: 100px;
    }
    td:nth-child(2), td:nth-child(4) {
        font-weight: bold;
    }
    tr.null-data td:first-child {
        width: 100%
    }
}
</style>