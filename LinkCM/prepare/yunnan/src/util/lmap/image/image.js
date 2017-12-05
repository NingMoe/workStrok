import config from '../config'

var image = {

    /**
     * 生成wms对象
     */
    loadImageWMS: function(map, imageParam, index, model = 'json') {
        let param = {
            url: imageParam.url,
            ratio: 1,
            projection: config.SYSTEM_PROJECTION,
            params: {
                LAYERS: imageParam.name
            },
            imageLoadFunction: (feature, src) => {
                let url = src;
                let zoom = Math.ceil(map.getView().getZoom());
                let extent = config.transform(map.getView().calculateExtent(map.getSize()), true);
                url += `&ZOOM=${zoom}&EXTENT=${extent}`;
                feature.getImage().src = url;
            }
        };

        let paramKeyArr = Object.keys(imageParam.params);
        let reqParam = {};
        for (let key of paramKeyArr) {
            reqParam[key] = imageParam.params[key];
        }

        reqParam['_UUID'] = config.getUUID();

        if (model === 'json') {
            param.params = Object.assign(param.params, {
                PARAM: JSON.stringify(reqParam)
            });
        } else if (model === 'param') {
            let temp = Object.assign(param.params, reqParam);
            param.params = temp;
        }

        let WMS = new ol.layer.Image({
            opacity: imageParam.opacity,
            source: new ol.source.ImageWMS(param)
        });
        WMS.setZIndex(config.getIndex(index));
        map.addLayer(WMS);
        return WMS;
    },
    updateImageWMS: function(layer, _obj, model = 'json') {

        let paramKeyArr;
        let paramArr = _obj.params;
        if (!paramArr) {
            paramArr = _obj;
        }

        paramKeyArr = Object.keys(paramArr);

        let reqParam = {};
        for (let key of paramKeyArr) {
            reqParam[key] = paramArr[key];
        }

        reqParam['_UUID'] = config.getUUID();

        if (model === 'json') {
            layer.getSource().updateParams({
                PARAM: JSON.stringify(reqParam)
            });
        } else if (model === 'param') {
            layer.getSource().updateParams(reqParam);
        }

    },
    /**
     * 加载静态图片
     */
    loadImageStatic: function(imageParam, index, model = 'json', isSource = false) {
        let sextent = config.transform(imageParam.extent);
        let url = '';
        if (model === 'json') {
            url = imageParam.url + '?LAYERS=' + imageParam.name + '&PARAM=' + JSON.stringify(imageParam.params);
        } else if (model === 'param') {
            url = imageParam.url + '?LAYERS=' + imageParam.name;
            for (let [key, value] of Object.entries(imageParam.params)) {
                url += `&${key}=${value}`;
            }
        }
        let source = new ol.source.ImageStatic({
            url: url,
            projection: config.SYSTEM_PROJECTION,
            imageExtent: sextent,
        });
        if (isSource) {
            return source;
        }
        let image = new ol.layer.Image({
            opacity: imageParam.opacity,
            source: source
        });
        image.setZIndex(config.getIndex(index));
        return image;
    },
    updateImageStatic: function(imageLayer, imageParam, index, model = 'json') {
        let staticSource = this.loadImageStatic(imageParam, index, model, true);
        imageLayer.setSource(staticSource);
        return staticSource;
    }
};

module.exports = image;