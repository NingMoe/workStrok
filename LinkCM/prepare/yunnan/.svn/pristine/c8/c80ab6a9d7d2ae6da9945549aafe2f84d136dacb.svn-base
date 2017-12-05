import geom from './geom';

export default function(map, lon, lat) {
	let params = [lon, lat];
	let feature = geom.drawGeom('point', params);
	let layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: [feature]
		})
	});
	return layer;
}