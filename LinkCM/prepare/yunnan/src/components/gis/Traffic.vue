<template>
    <div class="poiPop normal panelhover" v-if="state==true" v-el:traffic-win>
        <div class="popTab popTaBorder">
            <a class="close" @click="close('normal');"></a>
            <div class="title">事件信息-{{ showData.eventTitle }}</div>
            <div class="popTab-box">
                <ul>
                    <li>事件发生时间：{{showData.happenTime}}</li>
                    <li class="short">起始出入口：{{showData.startNodeName}}</li>
                    <li>路况等级：
                        <ul>   
                        <li v-for='(index,item) in roadStatus' :class="['road','road'+index,showData.roStatus==index?'selected' : '']">{{item}}<em class="emfocus"></em></li>
                        </ul>
                    </li>
                    <li class="short">结束出入口：{{showData.endNodeName}}</li>
                    <li>事件类型：
                        <ul>   
                        <li v-for='(index,item) in eventType' :class="['event','event'+(index+14),showData.eventType==(index+14)?'selected' : '']">{{item}}<em class="emfocus"></em>
                        </li>
                        </ul>
                    </li>
                    <li class="short">方向：{{showData.roadDirection}}</li>
                </ul>
                <div class="lineContent">
                    <span>事件详情:</span>
                    <span>{{showData.messageContent}}</span>
                </div>
            </div>


        </div>
</div>
</template>

<script>

    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import TimeUtil from '../../util/tools/TimeUtil'
    // import WinDrag from '../../util/tools/WinDrag'
    export default {
        data() {
            return {
                simpleTime: 2000, // 下一个冒泡等待时间
                stayTime: 10000, // 每个冒泡停留时间 
                totalTime: 18000, // 整个流程持续时间 stayTime + simpleTime * (maopao - 1)
                maopaoNum: 10, // 冒泡个数
                currData: {},
                overlayData: [],
                state: false,
                showData: {},
                moveData: {},
                interval: '',
                pausedArr: [],
                upArr: [],
                downArr: [],
                stopArr: [],
                move: {state:false},
                pix:[],
                type:'',
                // roadStatus:[
                // {'color':'#B90000','name':'拥堵'},
                // {'color':'#F23030','name':'阻塞'},
                // {'color':'#FF9E17','name':'缓慢'},
                // {'color':'#18BF00','name':'畅通'}
                // ],
                roadStatus:['拥堵','阻塞','缓慢','畅通'],
                eventType:['事故','天气','管制','维修','其他'],
                // {'color':'#F23030','name':'事故'},
                // {'color':'#00ad9d','name':'天气'},
                // {'color':'#ff9800','name':'管制'},
                // {'color':'#2196f3','name':'维修'},
                // {'color':'#ccc','name':'其他'},
                // ],
                //图片背景色
                colors:{'14':'#F23030','15':'#00ad9d','16':'#ff9800','17':'#2196f3','18':'#ccc'}
            }
        },
        computed:{
             /**改变悬停框窗口位置 */
            getPointPosition: function() {
                let obj = {};
                let pix = this.pix;
                obj['left'] = pix[0] + 10 + 'px';
                obj['top'] = pix[1] + 10 + 'px';
                return obj;
            }
        },
        methods: {
            close: function(){
                this.state = false;
            },
            /**使窗口支持拖动功能 */
            addWinDragEvt: function(elName){
                var map = config.getParam('map');
                let call = setInterval(()=>{
                    let winObj = this.$els[elName];
                    if(!!winObj)WinDrag.drag(winObj,winObj,map);
                        clearInterval(call);
                },10);      
            },
            getData: function(){
                this.clear();
                let date = new Date();
                let startTime = TimeUtil.format(TimeUtil.addTime(date, -1, 'hh'), 'yyyy-MM-dd HH:mm:ss');
                let endTime = TimeUtil.format(date, 'yyyy-MM-dd HH:mm:ss');
                $.ajax({
                    url: 'http://10.148.16.57:9999/dss/traffic/traffic!getTrafficList.action',
                    data: { startTime: startTime, endTime: endTime},
                    success: (json) => {
                        if (json.length >= this.maopaoNum) {
                            json=this.sortJsonByDate(json);
                            this.mergeData(json);
                            this.dataTimer = window.setTimeout(()=>{
                                this.getData();
                            }, (this.maopaoNum * this.simpleTime) + 23000);
                        } else {
                            this.ReserveGetData();
                        }
                    }
                });
            },
            /* 按事件发生时间由小到大排序数组 */
            sortJsonByDate: function(data){
                data.sort(function(a,b){
                    return Date.parse(b.happenTime) - Date.parse(a.happenTime);//时间正序
                });
                return data.slice(0,this.maopaoNum);
            },
            /*当得到的数据少于要冒泡的个数时，改变开始时间*/
            ReserveGetData: function(){
                this.clear();
                let date = new Date();
                let startTime = TimeUtil.format(date, 'yyyy-MM-dd 00:00:00');
                // let startTime = TimeUtil.format(TimeUtil.addTime(date, -1, 'dd'), 'yyyy-MM-dd HH:mm:ss');
                let endTime = TimeUtil.format(date, 'yyyy-MM-dd HH:mm:ss');
                $.ajax({
                    url: 'http://10.148.16.57:9999/dss/traffic/traffic!getTrafficList.action',
                    data: { startTime: startTime, endTime: endTime}, 
                    success: (json) => {
                        json=this.sortJsonByDate(json);
                        this.mergeData(json);
                        this.dataTimer = window.setTimeout(()=>{
                                this.ReserveGetData();
                            }, (this.maopaoNum * this.simpleTime) + 23000);
                    }
                });
            },
            mergeData: function(mainData){                
                let tempData = {};
                let endTime = TimeUtil.format(new Date(), 'yyyy-MM-dd HH:mm:ss');

                mainData.forEach((data, index) => {
                    // console.log(data.roadName+";"+data.eventTypeName+";"+data.roStatusName+";");
                let ele = document.createElement('div');
                    ele.className = 'traffic';
                let img = document.createElement('img');
                this.type=data.eventType;
                //事件类型图片URL
                img.src='http://10.148.16.56/topic/little/traffic/'+this.type+'.png';

                let first = document.createElement('span');
                    first.className = 'first';
                let model = document.createElement('span');
                    model.className = 'model';
                let text = document.createElement('div');
                let timeObj = TimeUtil.getTimeObj(data.happenTime,'Object');
                    text.innerHTML = timeObj.hour + ":" + timeObj.min + ":" + timeObj.second;
                let container= document.createElement('div');
                    container.className = 'traf_container';
                    container.style.backgroundColor=this.colors[this.type];
                    container.appendChild(img);
                ele.appendChild(container);
                ele.appendChild(first);
                ele.appendChild(model);
                ele.appendChild(text);
                data.id_event="traf"+index;
                data.id = data.id_event;
                ele.id = data.id_event;
                data.positioning = 'bottom-right';
                data.offset = [27, -2];
                // data.offset=[33,0];
                data.ele = ele;
                tempData['A' + data.id_event] = data;
                });
                let count = 0;
                for (let id in tempData) {                  
                    if(count<this.maopaoNum){
                        let overlay = lmap.draw.overlay(tempData[id]);
                        this.overlayData.push(overlay);
                        this.addIcon(tempData[id]);
                    }
                    count++;
                }
                this.currData = tempData;
                this.overlayTimer();
            },
            overlayTimer: function(){
                this.overlayData.forEach((ol, index) => {
                    let upTimer = window.setTimeout(() => {
                        this.map.addOverlay(ol);
                        let id = ol.get('olId');
                        $(ol.getElement()).unbind().hover(function() {
                            $(this).addClass('hover');
                        }).mouseleave(function() {
                            $(this).removeClass('hover');
                        }).click(() => {
                            this.showData = this.currData['A' + id];
                            this.state = true;
                        }).on('webkitAnimationEnd', animationEnd)
                          .on('animationend', animationEnd);
                        // let downTimer = window.setTimeout(() => {
                        //     $('#' + id).removeClass('traffic-show').addClass('traffic-hide');
                        // }, 20000);
                        // this.downArr.push(downTimer);
                        function animationEnd(){
                            $(this).removeClass('traffic').addClass('traffic-show');
                        }
                    }, this.simpleTime * index);
                    this.upArr.push(upTimer);
                });
            },
            addIcon: function(item){
                let zoom = this.map.getView().getZoom() + '';
                let status=item.roStatus;
                
                var style = {
                    anchor: [10, 10],
                    iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAb0lEQVR42mNgAIEZdqoMM5zWMsxw/gjBIDZQDAymOaozzHJ8z35Z9j/3D1YwBrFBYmA5kGr2y3L/ef4zoGC28wr/wSaBjATpQlcAEgPKfSZGAQ4rLshDrZjsoIHTkSA5uE9Aqqc7fwJjEBvsAwYGAI26ai8cRwi/AAAAAElFTkSuQmCC",
                    iconSize: [10, 10],
                    scale: 1
                };
                let icontemp = lmap.icon.addIcon(this.vector, style, item.lon, item.lat, 'traffic'); 
                let iconData = {
                    eventTitle: item.eventTitle,
                    happenTime: item.happenTime,
                    roStatusName: item.roStatusName,
                    eventTypeName: item.eventTypeName,
                    startNodeName: item.startNodeName,
                    endNodeName: item.endNodeName,
                    roadDirection: item.roadDirection,
                    messageContent: item.messageContent
                };
                icontemp.set('icondata',iconData);
            },
            clickEvt: function(evt){
                let iconData = this.getFeatureData(evt);
                if(!$.isEmptyObject(iconData)){
                    this.showData = iconData;
                    this.state = true;
                }               
            },
            getFeatureData: function(evt){
                let feature = this.map.forEachFeatureAtPixel(evt.pixel, function(feature, layer){
                    return feature;
                });
                let icondata = {};
                 if(!!feature){
                    let type = feature.get('name');               
                    if(type == 'traffic'){
                        icondata = feature.get('icondata');
                    }
                }
                return icondata;
            },
            clear: function(){
                lmap.icon.clear(this.vector);
                this.overlayData.forEach((data) => { this.map.removeOverlay(data); });
                this.overlayData = [];
                // this.pausedArr.forEach((data)=>{ window.clearTimeout(data); });
                this.upArr.forEach((data)=>{ window.clearTimeout(data); });
                this.downArr.forEach((data)=>{ window.clearTimeout(data); });
                this.stopArr.forEach((data)=>{ window.clearTimeout(data); });
            }
        },
        ready: function(){
            let map = config.getParam('map');
            let vector = lmap.icon.initLayer(map, 'active');
            this.map = map;
            this.vector = vector;
            this.getData();
            // map.on('singleclick', this.clickEvt);
        },
        detached: function(){  
             this.map.un('singleclick', this.clickEvt);
             this.state = false;
             this.clear();
             window.clearTimeout(this.dataTimer);
        }
    }
</script>

<style scoped="scoped" lang='less'>
@import "../../assets/css/common.less";
.lineContent {
    width: 98%;
    margin: auto;
    margin-top: 3px;
    margin-bottom: 3px;
    min-height: 30px;
    max-height: 300px;
    line-height: 30px;
    overflow-y: auto; 
}
.lineContent span:first-child {
    width: 10%;
}

.poiPop {
    width: 483px;
    height: auto;
    position: absolute;
    z-index: 4;
    right: 0;
    top: 0px;
    background: #fff;
    -moz-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
div.nullbg {
    background: 0;
}

.close {
    position: absolute;
    right: 3px;
    top: 3px;
    height: 20px;
    width: 20px;
    background: url(../../assets/img/toolsbar/rightIcon.png) no-repeat;
    background-position: -153px -60px !important;
    display: inline-block;
    zoom: 1;
    cursor: pointer;
}

.popTab {
    margin: 0px;

    .popTab-box {
        width: 100%;

        > ul {
            width: 98%;
            border-bottom:1px solid #ecf2fc;
            margin: auto;
            margin-top: 5px;
            margin-bottom: 5px;
            min-height: 30px;
            max-height: 300px;
            overflow-y: auto;
            ul{
            display: inline-block;
            width: 100%;
            vertical-align: -3px;
            padding: 0px;
            }
        }
        .short{width:200px;}
        ul li {
            height: 30px;
            line-height: 30px;
            width: 53%;
            margin-right: 1%;
            text-align: left;
            float: left;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .road,.event{ 
        display: inline-block;
        width: 30px;
        height: 18px;
        position:relative;
        line-height: 18px;
        text-align: center;
        color:white;
        }
        .road0{background-color:#B90000;}
        .road1{background-color:#F23030;}
        .road2{background-color:#FF9E17;}
        .road3{background-color:#18BF00;}
        .event14{background-color:#F23030;}
        .event15{background-color:#00ad9d;}
        .event16{background-color:#ff9800;}
        .event17{background-color:#2196f3;}
        .event18{background-color:#ccc;}
        .road em.emfocus,.event em.emfocus {
        width: 10px;
        height: 10px;
        display:none;
        vertical-align: middle;
        background: #d65601;
        border-radius: 100%;
        right: -4px;
        top: -4px;
        }
        .road.selected em.emfocus,.event.selected em.emfocus {
            display:block;
            position: absolute;
        }
    }
}
.big .poiPop{
    width:753px;
    .lineContent {
            line-height: 35px;
    }
     ul li {
            height: 35px;
            line-height: 35px;
    }
    .short{width:250px;}
    .road,.event{
        width:55px;
        height:25px;
        line-height:25px;
    }
    ul li {
            width: 64%;
    }
}
</style>