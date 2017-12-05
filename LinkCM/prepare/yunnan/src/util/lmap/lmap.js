import polygon from './polygon/polygon';
import image from './image/image';
import controler from './controler/controler';
import draw from './draw/draw'
import icon from './icon/icon'
import custom from './custom/custom'
import config from './config'
import typhoon from './typhoon/typhoon'

var lmap = {

    is84: config.is84(),
    unit: config.getUnit(),
    transform: config.transform,
    transform_meter: config.transform_meter,
    SOURCE_PROJECTION: config.SOURCE_PROJECTION,
    SYSTEM_PROJECTION: config.SYSTEM_PROJECTION,
    MERCATOR_PROJECTION: config.MERCATOR_PROJECTION,
    cityCenter: '113,23', // 地图放大缩小之后点击还原按钮所在的中心点和等级
    zoom: 8,

    /* 
     * 初始化地图
     * @param targetId： 需要承载地图的DIV id值
     */
    initMap: function(targetId) {
        let projection = config.SYSTEM_PROJECTION;
        let mapUrl = 'http://120.26.220.66:8090/web_static/dt/{z}/{x}/{y}.png';
        //let mapUrl = 'http://10.148.16.56:8081/dt/{z}/{x}/{y}.png';
        // let mapUrl = 'http://t0.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}';
        let tileLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                projection: projection,
                tileSize: 256,
                wrapX: false,
                tileUrlFunction: function(tileCoord) {
                    return mapUrl.replace('{z}', (tileCoord[0]).toString()).replace('{x}', tileCoord[1].toString()).replace('{y}', (-tileCoord[2] - 1).toString());
                },
            })
        });
        let dxTile = new ol.layer.Group({ layers: [tileLayer] });
        let map = new ol.Map({
            target: targetId,
            view: new ol.View({
                projection: projection,
                zoom: 8,
                minZoom: 5,
                maxZoom: 16
            })
        });
        map.setLayerGroup(dxTile);

        this.view = map.getView();
        this.view.setCenter(config.transform([113, 23]));
        this.map = map;
        return map;
    },
    // 切换地图
    switchMap: function(map, type) {
        let projection = config.SYSTEM_PROJECTION;
        let mapUrl = 'http://120.26.220.66:8090/web_static/' + type + '/{z}/{x}/{y}.png';
        //let mapUrl = 'http://10.148.16.56:8081/' + type + '/{z}/{x}/{y}.png';
        let tileLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                projection: projection,
                tileSize: 256,
                wrapX: false,
                tileUrlFunction: function(tileCoord) {
                    return mapUrl.replace('{z}', (tileCoord[0]).toString()).replace('{x}', tileCoord[1].toString()).replace('{y}', (-tileCoord[2] - 1).toString());
                },
            })
        });
        let layers = map.getLayers();
        let arr = [];
        layers.forEach(function(item, index) {
            if (index != 0) arr.push(item);
            else arr.push(tileLayer);
        });
        let dtTile = new ol.layer.Group({ layers: arr });
        map.setLayerGroup(dtTile);
    },
    // 使用备选地图
    switchBackMap: function(map, type = 'DT') {
        let kind = { 'WX': 'WX', 'DT': 'DT', 'DX': 'DX', 'Dem': 'GoogleDem' };
        let catalog = '/WebMkt/' + kind[type];
        let mapUrl = 'http://10.148.8.229:9080/zs/data/tile/map?name=' + catalog + '&id={z};{y};{x}';
        let tileLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                projection: config.SYSTEM_PROJECTION,
                tileSize: 256,
                tileUrlFunction: function(tileCoord, ratio, project) {
                    let extent = map.getView().calculateExtent(map.getSize());
                    let res = map.getView().getResolution();
                    let maxExtent = project.getExtent();
                    let nx = tileCoord[1];
                    let sourceY = (-tileCoord[2] - 1);
                    let ny = Math.round((extent[1] - maxExtent[1]) / (res * 256));
                    let z = tileCoord[0];
                    let limit = Math.pow(2, z);
                    nx = ((nx % limit) + limit) % limit;
                    return mapUrl.replace('{z}', z.toString()).replace('{x}', nx.toString()).replace('{y}', ny.toString());
                },
                wrapX: false
            })
        });
        let layers = map.getLayers();
        let arr = [];
        layers.forEach(function(item, index) {
            if (index != 0) arr.push(item);
            else arr.push(tileLayer);
        });
        let dtTile = new ol.layer.Group({ layers: arr });
        map.setLayerGroup(dtTile);
    },

    initWMTS() {
        let extent = config.projection().getExtent();
        let size = ol.extent.getWidth(extent) / 256; // 512
        let resolutions = [];
        let matrixIds = [];
        for (let z = 0; z < 14; ++z) {
            resolutions[z] = size / Math.pow(2, z);
            matrixIds[z] = z;
        }
        let layer = new ol.layer.Tile({
            source: new ol.source.WMTS({
                url: 'http://10.148.8.205/zs/catalogws/data/Tdt/TdtDem/wmts',
                layer: 'img',
                matrixSet: 'default028mm',
                format: 'image/png',
                style: 'default',
                wrapX: true,
                projection: config.SYSTEM_PROJECTION,
                tileGrid: new ol.tilegrid.WMTS({
                    origin: [-180, 90], // ol.extent.getTopLeft(extent)
                    resolutions: resolutions,
                    matrixIds: matrixIds
                })
            })
        });
        return layer;
    },

    // 获取地图对象
    getMap: function() {
        if (!!this.map) {
            return this.map;
        } else {
            console.log('map is not exits!');
        }
    },
    // 获取地图视图
    getView: function() {
        if (!!this.view) {
            return this.view;
        } else {
            console.log('not view!');
        }
    },
    /* 
     * 选择行政区域覆盖面
     * @param code:区域编码
     */
    selectArea: function(map, code, type, out) {
        let outPath = '';
        let fillOpacity = 0;
        if (!!out) {
            outPath = 'out/';
            fillOpacity = 0.5;
        }
        let opacity = 0.9;
        let stroke = 'rgba(182, 213, 249, 0.9)';
        let width = 4;
        if (code == '44') {
            opacity = 0;
            stroke = 'rgba(136, 168, 212, 1)';
            width = 2.25;
        }
        let style = [
            new ol.style.Style({
                stroke: new ol.style.Stroke({ color: stroke, width: width }),
                fill: new ol.style.Fill({ color: 'rgba(235, 235, 235, ' + fillOpacity + ')' })
            }),
            new ol.style.Style({
                stroke: new ol.style.Stroke({ color: 'rgba(46, 46, 46, ' + opacity + ')', width: 2.25 })
            })
        ];

        let format = {
            'json': new ol.format.TopoJSON({ defaultProjection: config.SOURCE_PROJECTION }),
            'wkt': new ol.format.WKT()
        };

        let formatRead = format[type];
        let layer = new ol.layer.Vector({ style: style });
        let source;
        let url = 'http://10.148.16.56/topic/mapjson/' + outPath + code + '.' + type;
        if (type === 'json') {
            source = new ol.source.Vector({
                format: formatRead,
                projection: config.SYSTEM_PROJECTION,
                url: url
            });
        } else if (type === 'wkt') {
            $.ajax({
                type: 'get',
                url: url,
                async: false,
                success: (wktStr) => {
                    let feature = formatRead.readFeature(wktStr);
                    feature.getGeometry().transform(config.SOURCE_PROJECTION, config.SYSTEM_PROJECTION);
                    source = new ol.source.Vector({ features: [feature] });
                }
            });
        }
        layer.setSource(source);
        layer.setZIndex(this.getIndex('basic'));
        map.addLayer(layer);

        if (code !== '44' && !!out == false) {
            lmap.extendToLayer(layer);
        } else if (code == '44') {
            let view = map.getView();
            view.setCenter(config.transform([113, 23]));
            view.setZoom(8);
        }
        setTimeout(() => { // 获取切换地市时，点击还原按钮所要设置的中心点和地图层级
            let center = map.getView().getCenter();
            let zoom = map.getView().getZoom();
            let [lon, lat] = config.transform(center, true);
            this.cityCenter = `${lon},${lat}`;
            this.zoom = zoom;
        }, 500);
        
        return layer;
    },
    /* 
     * 取消区域选择
     * @param geoJson:区域对象
     */
    unSelectArea: function(geoJson) {
        if (!!geoJson) {
            this.map.removeLayer(geoJson);
        }
    },
    /* 
     * 将地图视角放大至layer可拓展的最大范围
     */
    extendToLayer: function(layer) {
        let teMap = this.map;
        layer.addEventListener("change", function(event) {
            teMap.getView().fit(layer.getSource().getExtent(), (teMap.getSize()));
        });
    },
    /* 
     * 通过WKT对地图进行行政区域渲染
     */
    selectCityByWKT: function(code) {
        let format = new ol.format.WKT();
        let style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(136,168,212,0.9)',
                lineDash: [4],
                width: 4
            }),
            fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.1)' })
        });
        let feature = format.readFeature(wkt, {
            dataProjection: config.SOURCE_PROJECTION,
            featureProjection: config.SYSTEM_PROJECTION
        });
        let vector = new ol.layer.Vector({
            source: new ol.source.Vector({ features: [feature] }),
            style: style
        });
        this.map.addLayer(vector);
    },
    removeLayer: function(map, layer) {
        if (!!map && !!layer) map.removeLayer(layer);
    },
    getExtent: function(map) {
        let extent = map.getView().calculateExtent(map.getSize());
        extent = ol.proj.transformExtent(extent, config.SYSTEM_PROJECTION, config.SOURCE_PROJECTION);
        return extent;
    },
    getIndex: function(type){
        return config.getIndex(type);
    }
}

lmap.polygon = polygon;
lmap.image = image;
lmap.controler = controler;
lmap.draw = draw;
lmap.icon = icon;
lmap.typhoon = typhoon;
lmap.custom = custom;

module.exports = lmap;