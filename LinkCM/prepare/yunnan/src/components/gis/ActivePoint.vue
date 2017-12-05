<template>
    <div></div>
</template>

<script>

    import lmap from '../../util/lmap/lmap'
    import config from '../../config'
    import { updateParam } from '../../vuex/store'

    export default {
        data() {
            return {
                layer: null, // 图层
                name: '', // 图标名称
                map: config.getParam('map')
            }
        },
        vuex: {
            getters: {
                pTypes: state => state.poi.allTypes,
                stat: state => state.activePoint.stat,
                point: state => state.activePoint.point // name#lon#lat
                // name: state => state.activePoint.name,
                // lonlat: state => state.activePoint.lonlat
            },
            actions: {
                updateParam
            }
        },
        watch: {
            // 图标名称位置信息
            point: function() {
                this.clear();
                if (this.point != '') {
                    let arr = this.point.split('#');
                    this.name = arr[0];
                    this.activeIcon(arr);
                }
            },
            pTypes: function() {
                let name = this.name;
                let eType = ['agr', 'air', 'demage'];
                if (eType.indexOf(name) == -1) {
                    if (this.pTypes.indexOf('poi_' + name) == -1) this.clear();
                }
            }
        },
        methods: {
            // 高亮显示icon
            activeIcon: function(arr) {
                let size = [18, 18];
                let anchor = [9, 9];
                let name = arr[0];
                if (name == 'demage' || name == 'site') {
                    size = [13, 13]
                    anchor = [6.5, 6.5]
                } else if (name == 'waterLogging_select') {
                    size = [12, 12]
                    anchor = [6, 6]
                } else if (name == 'waterLogging' || name == 'fireDanger') {
                    size = [20, 20]
                    anchor = [10, 10]
                }
                let style = { anchor: anchor, iconUrl: 'http://10.148.16.56/topic/little/poi/' + arr[0] + '.png', iconSize: size, scale: 1 };
                let icon = lmap.icon.addIcon(this.layer, style, arr[1], arr[2], 'activePoint');
            },
            // 清除
            clear: function() {
                lmap.draw.clear(this.layer);
            }
        },
        ready: function() {
            this.layer = lmap.icon.initLayer(this.map, 'active');
        },
        detached: function() {
            this.map.removeLayer(this.layer);
        }
    }
</script>

<style></style>