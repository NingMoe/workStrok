/**
 * 全局参数变量
 */
export default {
    data: {},
    /**
     * 增加参数
     */
    addParam: function(name, value) {
        if (!!this.data[name]) {
            console.log('param is exits!');
        } else {
            this.data[name] = value;
        }
    },
    /**
     * 获取参数值
     */
    getParam: function(name) {
        if (!!this.data[name]) {
            return this.data[name];
        } else {
            console.log('param is not exits!');
            return null;
        }
    },
    /**
     * 修改参数值
     */
    setParam: function(name, value) {
        if (!!this.data[name]) {
            this.data[name] = value;
        } else {
            console.log('param is not exits!');
        }
    },
    /**
     * 移除参数
     */
    removeParam: function(name) {
        if (!!this.data[name]) {
            delete this.data[name];
        } else {
            console.log('param is not exits!');
        }
    }
};