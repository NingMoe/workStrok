var config = {

    MERCATOR_PROJECTION: 'EPSG:3857',
    SYSTEM_PROJECTION: 'EPSG:3857',
    SOURCE_PROJECTION: 'EPSG:4326',

    getIndex: function(type = 'basic') {
        let indexData = { basic: 1, model: 2, impact: 3, draw: 4, drawImpact: 5, poi: 5, poitop: 6, point: 7, active: 8 };
        return indexData[type];
    },

    projection() {
        return ol.proj.get(this.SYSTEM_PROJECTION);
    },

    getUnit() {
        return this.is84() ? 'degrees' : 'm';
    },

    is84() {
        return this.SYSTEM_PROJECTION.indexOf('4326') !== -1;
    },

    transform(lonlat, reverse = false) {
        const SYSTEM_PROJECTION = reverse ? this.SOURCE_PROJECTION : this.SYSTEM_PROJECTION;
        const SOURCE_PROJECTION = reverse ? this.SYSTEM_PROJECTION : this.SOURCE_PROJECTION;
        lonlat = lonlat.map(function(data){
            return parseFloat((data + '').trim());
        });
        return ol.proj.getTransform(SOURCE_PROJECTION, SYSTEM_PROJECTION)(lonlat);
    },

    transform_meter(lonlat, reverse = false) {
        const RESULT_PROJECTION = reverse ? this.SOURCE_PROJECTION : this.MERCATOR_PROJECTION;
        const SOURCE_PROJECTION = reverse ? this.MERCATOR_PROJECTION : this.SOURCE_PROJECTION;
        lonlat = lonlat.map(function(data){
            return parseFloat((data + '').trim());
        });
        return ol.proj.getTransform(SOURCE_PROJECTION, RESULT_PROJECTION)(lonlat);
    },

    getUUID() {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
        }
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid.toUpperCase();
    }

}

module.exports = config;