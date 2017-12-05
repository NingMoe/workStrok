### 2016-12-06
1. lmap包更新
   1. 把生成全部 `wms` 和 `layer` 的方法改为手动加入 `map` ；
   2. 通过 `lmap.getLayerIndex()` 获取基本的层级，手动设置 `layer` 层级；
   3. `icon.initVector()` 改名为 `icon.initLayer()` ，`initVector` 仍兼容；
   4. `draw.initVector()` 改名为 `draw.initDrawParam()` ，`initVector` 仍兼容；
   5. `lmap` 提供两个变量 `SYSTEM_PROJECTION` 系统展示的坐标系， `SOURCE_PROJECTION` 数据来源的坐标系，统一全局的坐标系统，方便以后系统根据不同坐标系快速切换；
   6. `lmap`提供 `transfrom(lonlat, reverse = false)` 转换经纬度的方法，默认是 `SOURCE_PROJECTION` 转 `SYSTEM_PROJECTION`，当参数 `reverse` 为 `true` 时，则反转；
2. 把没用的 `map.js`、`image.js` 删除，`mapParam.js` 定义的参数移到各自组件里面；