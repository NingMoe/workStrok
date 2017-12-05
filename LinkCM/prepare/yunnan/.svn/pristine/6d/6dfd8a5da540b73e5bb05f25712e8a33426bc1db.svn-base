<template>
    <div class="avoid">
        <ul>
            <li @click="panIcon('start')">
            	<a class="btnhover">
            		<em class="route-0"></em>
            		<span>点击</span>
            		<input type="text" title="{{address.start}}" value="{{address.start}}" vat="起点" name="" disabled="disabled">
            	</a>
            </li>
            <li><em class="route-fx"></em></li>
            <li @click="panIcon('end')">
				<a class="btnhover">
            		<em class="route-0"></em>
            		<span>点击</span>
            		<input type="text" title="{{address.end}}" value="{{address.end}}" vat="终点" name="" disabled="disabled">
            	</a>
           	</li>
            <li class="route-start" @click="drawRoad()">
            	<a class="btnhover">
            		<em class="route-1"></em>
            		<span>路线规划</span>
            	</a>
            </li>
        </ul>
		<div class="avoid-detail" v-if="avoidDetail.stat==true">
			<div class="select-line">
				<ul>
					<li>
						<input id="duan" class="radio_line form-radio" type="radio" checked>
						<label for="duan">最短路线</label>
					</li>
					<li class="move">
						<input id="bei" type="radio_line radio" class="form-radio" disabled>
						<label for="bei">备选路线</label>
					</li>
				</ul>
			</div>
			<div class="line-info">
				<ul>
					<li><label>{{avoidDetail.data.time}}</label></li>
					<li><label>{{avoidDetail.data.totalLength}}</label></li>
					<li><label>途经:{{avoidDetail.data.pathName}}</label></li>
				</ul>
				<label>交通实况气象条件：暂无</label>
			</div>
		</div>
    </div>
</template>

<script>
	import lmap from '../../../../util/lmap/lmap'
	import config from '../../../../config'
	import { updateParam } from '../../../../vuex/store'
    export default {
        data() {
	        return {
	            hander: null,
	            layer: null,
	            layer: null,
	            modify: null,
	            btnType: '', //类型
	            exType: {
	                'start': 'end',  
	                'end': 'start'
	            },
	            features: {},
	            address: {
	                'start': '在地图选择起点',
	                'end': '在地图选择终点'
	            },
	            avoidDetail: {
	                stat: false,
	                data: {
	                    'time': '未知',
	                    'totalLength': '未知',
	                    'pathName': '未知'
	                }
	            }, //导航详情
	            roadLayer: null,
	            map: config.getParam('map')
	        }
	    },
	    vuex: {
            getters: {
                dss_sj: state => state.dss_sj,
                dss: state => state.dss
            },
            actions: { updateParam }
        },
	    methods: {
	        // 画笔
	        panIcon: function(btnType) {
	            if (this.features[btnType]) {
	                this.count = 1;
	                this.delFeature(btnType);
	            }
	            this.btnType = btnType;
	            this.cancel();
	            let url = 'http://10.148.16.56/topic/little/toolbar/' + btnType + '.png'
	            let style = {
	                anchor: [12.5, 0],
	                iconUrl: url,
	                iconSize: [25, 41]
	            }
	            this.hander = lmap.draw.point(this.drawParam, this.drawEndEvt, style);
	        },
	        drawEndEvt: function(type, feature) {
	            let wkt = lmap.draw.getWkt(feature);
	            wkt = wkt.replace('POINT(', '').replace(')', '').replace(' ', ',');
	            this.getAddress(wkt, this.btnType);
	            let style = {
	                anchor: [12.5, 0],
	                iconUrl: 'http://10.148.16.56/topic/little/toolbar/' + this.btnType + '.png',
	                iconSize: [25, 41]
	            };
	            feature.set('style', style);
	            feature.set('name', this.btnType);
	            this.features[this.btnType] = feature;
	            if (this.features['start'] && this.features['end']) this.cancel();
	            else this.panIcon(this.exType[this.btnType]);
	        },
	        cancel: function() {
	            if (!!this.hander) {
	                lmap.draw.cancel(this.map, this.hander);
	            }
	        },
	        // 删除图层中起点/终点
	        delFeature: function(type) {
	            let source = (this.layer).getSource();
	            source.removeFeature(this.features[type]);
	            let features = this.features;
	            let obj = {};
	            // 删除记录
	            for (let key in features) {
	                if (key != type) {
	                    obj[key] = features[key];
	                }
	            }
	            this.features = obj;
	            this.avoidDetail.stat = false; //不显示详情
	        },
	        getAddress: function(lonlat, type) {
	            let url = this.dss_sj+'/lucene/lucene!getRoadName.action';
	            let qd = { 'areaCode': '440000', 'lonlat': lonlat };
	            $.getJSON(url, qd, (bd) => {
	                let str = '未知';
	                if (!!bd) str = bd.fullAddress;
	                this.address[type] = str;
	            })
	        },
	        // 渲染导航结果
	        drawRoad: function() {
	            let wkt = this.getAllWkt(this.layer);
	            let obj = {};
	            wkt.forEach((it) => {
	                let str = it.wkt.replace('POINT(', '').replace(')', '').replace(' ', ',');
	                obj[it.type] = str;
	            })
	            let lonlat = obj['start'] + ',' + obj['end'];
	            let url = this.dss+'/gisInfo/gis-info!getShortPath.action';
	            let qd = {
	                'lonlat': lonlat
	            };
	            lmap.draw.clear(this.roadLayer); //清除道路结果
	            $.getJSON(url, qd, (bd) => {
                    let data = {};
                    data['time'] = bd.time;
                    data['pathName'] = bd.pathName;
                    data['totalLength'] = bd.totalLength;
                    this.avoidDetail.data = data;
                    this.avoidDetail.stat = true;
                    let lines = bd.datas;
                    this.drawLine(bd.datas, 0);
                });
	        },
	        drawLine: function(data, index) {
	            setTimeout(() => {
	                let style = {
	                    strokeColor: '#00A8FF',
	                    strokeWidth: 5
	                }
	                if (index === (data.length - 1)) {
	                    style['lineDash'] = [10, 10];
	                }
	                lmap.polygon.draw.lineString(this.roadLayer, data[index]['multiLineString'], style);
	                index++;
	                if (index < data.length) {
	                    this.drawLine(data, index)
	                }
	            }, 30);
	        },
	        // 获取所有wkt
	        getAllWkt: function() {
	            let arr = [];
	            let feats = lmap.draw.getFeatures(this.layer);
	            feats.forEach((it) => {
	                let type = it.get('name');
	                getWkt(it, type);
	            });

	            function getWkt(it, type) {
	                let obj = {};
	                obj.type = type;
	                obj.wkt = lmap.draw.getWkt(it);
	                arr.push(obj);
	            }
	            return arr;
	        },
	        // 修改点后
	        modifyEvt: function(feature) {
	            let feat = feature[0];
	            let type = feat.get('name');
	            let wkt = lmap.draw.getWkt(feat);
	            wkt = wkt.replace('POINT(', '').replace(')', '').replace(' ', ',');
	            this.getAddress(wkt, type);
	        }
	    },
	    ready: function() {
	        this.drawParam = lmap.draw.initDrawParam(this.map, 'draw');
	        this.layer = this.drawParam.layer;
	        this.modify = lmap.draw.modify(this.drawParam, this.modifyEvt);
	        this.roadLayer = lmap.icon.initLayer(this.map, 'draw');
	    },
	    detached: function() {
	        lmap.draw.cancel(this.map, this.modify);
	        lmap.draw.cancel(this.map, this.hander);
	        this.map.removeLayer(this.layer);
	        this.map.removeLayer(this.roadLayer);
	    }
    }
</script>

<style scoped lang="less">
@import "../../../../assets/css/common.less";

.avoid {
	width: 100%;
	height: 30px;
	line-height: 30px;
	background-color: #fff;
	margin: 8px 0px;
	position: relative;
	-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);

	ul {
		height: 100%;
		overflow: hidden;

		li {
			float: left;
			margin-left: 2px;

			a {
				width: 150px;
				padding: 0;
				margin-top: 3px;

				em {
					display: inline-block;
					width: 20px;
					height: 20px;
					background: url("../../../../assets/img/toolsbar/rightIcon.png") no-repeat;
					vertical-align: middle;
					float: left;
					margin-top: 3px;
				}
				span {
					color: #707070;
					float: left;
				}
				input {
					height: 20px;
					width: 96px;
					float: left;
					margin-left: 2px;
					border: 0;
					background: 0;
					font-family: "Microsoft Yahei";
					color: @colorH;
					cursor: pointer;
					font-size: 12px;
				}
			}
		}
	}
	.avoid-detail {
		width: 100%;
		height: auto;
		overflow: hidden;
		background: #fff;
		position: absolute;
		top: -66px;
		width: 100%;

		.select-line {
			float: left;
			width: 80px;
			margin: 2px 0px;

			li {
				width: 76px;
				cursor: pointer;

				input {
					width: 16px;
					height: 16px;
					vertical-align: middle;
					margin-right: 2px;
					margin-top: -2px;
					margin-left: 3px;
					cursor: pointer;
				}
			}
			li:hover {
				color: @color
			}
		}
		.line-info {
			margin-left: 5px;
			float: left;
			width: 330px;
			text-align: left;

			ul li {
				margin-right: 5px;
				color: @color;
			}
			ul li:after {
				content: "";
				display: inline-block;
				width: 1px;
				height: 12px;
				background: #ccc;
				margin-left: 5px;
				vertical-align: middle;
				margin-top: -2px;
			}
		}
	}
}
.toolPop .avoid .avoid-detail {
	position: static;
	-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
}
div.tool-avoid {
	width: 416px;
	position: absolute;
	right: 0px;
	top: 30px;
	z-index: 4;
	margin: 0;

	ul li {
		height: 30px;
	}
	.avoid-detail {
		position: static;
		-webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
		box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .3);
	}
}
.avoid em.route-0 {
	background-position: -46px -98px !important;
}
.avoid em.route-fx {
	display: inline-block;
	background: url("../../../../assets/img/toolsbar/rightIcon.png") no-repeat;
	vertical-align: middle;
	background-position: -93px -79px !important;
	height: 22px;
	width: 25px;
}
.avoid em.route-1 {
	display: inline-block;
	background: url("../../../../assets/img/toolsbar/rightIcon.png") no-repeat;
	vertical-align: middle;
	background-position: -99px -100px !important;
}
.avoid li.route-start a {
	width: 75px;
}
.move {
	border: 1px solid #ccc;
	background: #ecf2fc;
}
input.radio_line:checked + label:after {
	top: 13px;
}

/*big*/
.big .avoid {
	height: 42px;
	line-height: 42px;

	ul {
		li {
			a {
				width: 234px;
				margin-top: 6px;

				em {
					width: 24px;
					height: 24px;
					margin-top: 5px;
					-webkit-background-size: 14em;
					-moz-background-size: 14em;
					background-size: 14em;
				}
				input {
					height: 30px;
					width: 164px;
					font-size: 20px;
				}
			}
		}
		li.route-start a {
			width: 115px
		}
	}
	.avoid-detail {
		top: -94px;
		width: 100%;

		.select-line {
			width: 116px;
			margin: 2px 0px;

			li {
				width: 110px;
			}
		}
		.line-info {
			width: 503px;

			ul li:after {
				height: 16px;
				margin-top: -3px;
			}
		}
	}
}
.big .avoid em.route-0 {
	background-position: -53px -117px !important;
}
.big .avoid em.route-fx {
	background-position: -96px -78px !important;
	height: 24px;
	width: 25px;
}
.big .avoid em.route-1 {
	background-position: -120px -120px !important;
}
.big div.tool-avoid {
	width: 624px;
	top: 45px;

	ul li {
		height: 42px;
	}
	.avoid-detail {
		position: static;
	}
}
.big .toolPop .avoid .avoid-detail {
	position: static;
}
.big input.radio_line:checked + label:after {
	top: 19px;
}
</style>