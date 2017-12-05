<template>
    <div class="video-panel" v-if="hasVideo" v-el:video>
        <div class="title">{{text}}</div>
        <a class="close" @click="close()"></a>
        <v-videoframe :mrl="mrl"></v-videoframe>
    </div>
</template>

<script>

    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import VideoFrame from '../layout/tools/VideoFrame'
    import WinDrag from 'util/tools/WinDrag'
    import { updateParam } from '../../vuex/store'

    export default {
        components: { 'v-videoframe': VideoFrame },
        data() {
            return {
                map: config.getParam('map'),
                mrl: '',
                text: '',
                hasVideo: false,
                activeStat: false //记录是否选中图标
            }
        },
        vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
                code: state => state.cityCode,
                types: state => state.publicVideo.types
            },
            actions: { updateParam }
        },
        watch: {
            types: function() {
                this.refreshWMS(this.types);
            }
        },
        methods: {
            close: function() {
                this.hasVideo = false;
                this.activeStat = false;
                this.controlActivePoint('');
            },
            videoClick: function(evt) {
                let lonlat = lmap.controler.getEvtLonLat(evt);
                let reqParam = { 'fileName': 'D:/FTP/put/video/video_list.xlsx' };
                let that = this;
                $.ajax({
                    url: this.dss+'/readExcel/read-excel!readExcel2Map.action',
                    type: 'GET',
                    dataType: 'json',
                    data: reqParam,
                    success: function(json) {
                        that.getVideoPoint(json, lonlat);
                    }
                });
            },
            getVideoPoint: function(data, lonlat) {
                let tempVideo = {};
                let zoom = this.map.getView().getZoom();
                let activeDistance = 0.08;
                let rel = {
                    '19': 0.000040233135,
                    '18': 0.000080466270,
                    '17': 0.000160932540,
                    '16': 0.000321865081,
                    '15': 0.000643730163,
                    '14': 0.001287460327,
                    '13': 0.002574920654,
                    '12': 0.005149841309,
                    '11': 0.010299682617,
                    '10': 0.020599365235,
                    '9': 0.041198730468,
                    '8': 0.076904296875,
                    '7': 0.142822265625,
                    '6': 0.24169921875,
                    '5': 0.439453125,
                    '4': 0.87890625,
                    '3': 1.7578125,
                    '2': 3.515625,
                    '1': 7.03125,
                }
                if (rel[zoom + '']) activeDistance = rel[zoom + ''];
                data.forEach((video) => {
                    if (Number(video.lat)) {
                        let distanceLon = Math.abs(Number(video.lon) - Number(lonlat[0]));
                        let distanceLat = Math.abs(Number(video.lat) - Number(lonlat[1]));
                        let tempDistance = (distanceLon + distanceLat).toFixed(8);
                        if (tempDistance <= activeDistance) {
                            tempVideo = video;
                        }
                    }
                });
                if (tempVideo.url) {
                    this.activeStat = true;
                    this.controlActivePoint('VIDEO_POLICE#' + tempVideo.lon + '#' + tempVideo.lat);
                    this.hasVideo = true;
                    this.text = tempVideo.address;
                    this.mrl = tempVideo.url;
                    this.addWinDragEvt('video');
                }
            },
            initWMS: function() {
                let types = this.types;
                let reqParam = {
                    'AREACODE': this.code,
                    'TYPE': types,
                    'FILENAME': 'D:/FTP/put/video/video_list.xlsx'
                };
                let WMSParam = {
                    'opacity': 1,
                    'url': this.dss+'/gd_image/image!loadVideoWMS.action',
                    'name': 'video',
                    'params': reqParam
                }
                this.WMS = lmap.image.loadImageWMS(this.map, WMSParam, 'poitop');
                this.map.on('singleclick', this.videoClick);
            },
            refreshWMS: function(types) {
                let reqParam = {
                    'AREACODE': this.code,
                    'TYPE': types,
                    'FILENAME': 'D:/FTP/put/video/video_list.xlsx'
                };
                lmap.image.updateImageWMS(this.WMS, reqParam);
            },
            // 图标选中
            controlActivePoint: function(val) {
                this.updateParam('activePoint', 'point', val);
            },
            // 使窗口支持拖动功能
            addWinDragEvt: function(elName) {
                let call = setInterval(() => {
                    let winObj = this.$els[elName];
                    if (!!winObj)
                        WinDrag.drag(winObj, winObj, this.map);
                    clearInterval(call);
                }, 10);
            }
        },
        ready: function() {
            this.initWMS();
        },
        detached: function() {
            this.map.un('singleclick', this.videoClick);
            this.map.removeLayer(this.WMS);
            delete this.WMS;
            delete this.map;
            if (this.activeStat) {
                this.activeStat = false;
                this.controlActivePoint('');
            }
        }
    }
</script>

<style scoped lang="less">
.video-panel {
    height: auto;
    position: absolute;
    right: 0;
    width: 700px;
    z-index: 3;
    top: 0px;
    cursor: pointer;
    background: rgba(255, 255, 255, .9);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
.close {
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
</style>