<template>
    <div class="video-panel">
        <div class="title">视频/微信动态</div>
        <a class="close" @click="close()"></a>
        <v-videoframe v-if="!isWeChat" :mrl="mrl"></v-videoframe>
        <v-wechat v-if="isWeChat"></v-wechat>
        <div class="footer-video">
            <ul>
                <li v-for="item in videoItems" @click="changeType($key)">{{item.text}}</li>
                <li v-if="currType==='UAV'" class="wrjVideoUl">
                	<span>视频选择：</span>
                	<div class=" videoSelect">
                        <v-select :defname="'videoId'" :def="videoId" :initvalue="uavItems[0].text" :list="uavItems"></v-select>
	                </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

    import VideoFrame from './VideoFrame'
    import WeChat from './WeChat'
    import lmap from '../../../util/lmap/lmap'
    import config from '../../../config'
    import Select from '../../common/Select'
    import { updateParam } from '../../../vuex/store'

    export default {
        components: { 'v-videoframe': VideoFrame, 'v-wechat': WeChat, 'v-select': Select },
        data() {
            return {
                map: config.getParam('map'),
                layer: undefined,
                uavItems: [],
                videoItems: {
                    '4G': { 'text': '4G直播', 'url': 'http://10.148.101.203:1935/live/live101/800k/tzwj_main.m3u8', 'isSelect': false },
                    '3G': { 'text': '3/4G视频', 'url': 'http://10.148.16.56/video/2015TFZJ3G4G.wmv', 'isSelect': false },
                    'UAV': { 'text': '无人机', 'isSelect': false },
                    'NEWS': { 'text': '新闻', 'url': 'http://10.148.16.56/video/2015ZJDH.mpg', 'isSelect': false },
                    'WeChat': { 'text': '微信', 'isSelect': false }
                },
                currType: '4G',
                videoId: '1',
                isWeChat: false,
                mrl: ''
            }
        },
        watch: {
            'videoId': function() {
                lmap.icon.clear(this.layer);
                let video = this.uavItems[this.videoId];
                let style = {
                    anchor: [8, 8],
                    iconUrl: 'http://10.148.16.56/topic/little/toolbar/uav.png',
                    iconSize: [16, 16],
                    text: video.address,
                    fontColor: 'red',
                    fontSize: '12px',
                    outColor: 'white',
                    offsetY: 20,
                    offsetX: 10
                };
                lmap.icon.addIcon(this.layer, style, Number(video.lon), Number(video.lat));
                this.mrl = video.url;
            }
        },
        vuex: {
             getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss,
            },
            actions: { updateParam }
        },
        methods: {
            getUavItems: function() {
                let that = this;
                $.ajax({
                    url: this.dss+'/readExcel/read-excel!readExcel2Map.action',
                    type: 'GET',
                    data: { 'fileName': 'D:/ftp/put/video/wrj_video_list.xls' },
                    dataType: 'json',
                    success: function(json) {
                        let result = [];
                        for (let i = 0; i < json.length; i++) {
                            let obj = {
                                text: json[i].address,
                                value: i,
                                lon: json[i].lon,
                                lat: json[i].lat,
                                url: json[i].url
                            };
                            result[i] = obj;
                        }
                        that.uavItems = result;
                    }
                });
            },
            changeType: function(type) {
                lmap.icon.clear(this.layer);
                this.videoItems[this.currType].isSelect = false;
                this.videoItems[type].isSelect = true;
                this.currType = type;
                this.isWeChat = false;
                if (type === 'UAV') {
                    this.video = this.uavItems[0];
                } else if ('4G,3G,NEWS'.indexOf(type) !== -1) {
                    let video = this.videoItems[type];
                    this.$children[0].mrl = video.url;
                } else if (type === 'WeChat') {
                    this.isWeChat = true;
                }
            },
            close: function() {
                this.updateParam('video', 'status', false);
                this.$parent.list.video.stat = false;
            }
        },
        ready: function() {
            this.layer = lmap.icon.initLayer(this.map, 'poitop');
            this.changeType('4G');
            this.getUavItems();
        },
        detached: function() {
            this.map.removeLayer(this.layer);
            delete this.layer;
            delete this.map;
            let frame = document.getElementById('video-frame');
            if (frame) {
                let vlc = frame.contentWindow.document.getElementById('VLC');
                vlc.playlist.stop();
                vlc.playlist.clear();
            }
        }
    }
</script>

<style scoped lang="less">
.wrjVideoUl {
    width: 305px;
    height: 22px;
    line-height: 22px;
    padding-left: 5px;
    position: absolute;
    right: 2px;
    bottom: -3px;
    border-left: 1px solid #ccc;
}
.wrjVideoUl span {
    float: left;
}
div.videoSelect {
    border: 0;
    width: 230px;
    float: left
}
.footer-video {
    height: 22px;
    line-height: 22px;
    background: #ecf2fc;
}
.footer-video ul li {
    float: left;
    padding: 0 8px;
    text-align: center;
    border-left: 1px solid #dadada;
}
.video-panel {
    height: 480px;
    position: absolute;
    right: 0;
    top: 30px;
    width: 700px;
    z-index: 3;
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
    background: url("../../../assets/img/toolsbar/rightIcon.png") no-repeat;
    background-position: -153px -60px !important;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
}

/*big*/
.big .video-panel {
    top: 45px;
    height: 500px;
    .footer-video {
        height: 30px;
        line-height: 30px;

        li {
            padding: 0px 5px;
        }
    }
    .wrjVideoUl {
        width: 338px;
        height: 30px;
        line-height: 30px;
        bottom: 0;
    }
    div.videoSelect {
        width: 226px
    }
}
</style>