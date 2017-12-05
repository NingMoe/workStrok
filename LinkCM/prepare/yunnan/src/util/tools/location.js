//地址栏相关工具集
export default {
    //获取浏览器访问地址？后的参数
    getLocationParam: function() {
        var location = window.location;
        var tempParam = location.href.toString().split("?")[1];
        if (!!tempParam) {
            var param = tempParam.split('&');
            var tempObj = new Object({});
            for (var key in param) {
                var keyStr = param[key];
                var tempParam = keyStr.split('=');
                tempObj[tempParam[0]] = tempParam[1];
            }
            return tempObj;
        }
        return null;
    }
}