var TimeUtil = {
    format: function(timeStr, template) {
        if (!template) {
            template = 'yyyyMMddHHmmss';
        }
        if (!timeStr) {
            timeStr = this.convertToStr(new Date());
        }
        let timeArr = this.getTimeObj(timeStr, 'Array');
        let param = ['yyyy', 'MM', 'dd', 'HH', 'mm', 'ss'];
        timeStr = template.replace(param[0], timeArr[0]).replace(param[1], timeArr[1]).replace(param[2], timeArr[2]).replace(param[3], timeArr[3]).replace(param[4], timeArr[4]).replace(param[5], timeArr[5]);
        return timeStr;
    },
    convertToDate: function(timeStr) {
        let timeArr = this.getTimeObj(timeStr, 'Object');
        return new Date(timeArr.year, timeArr.month - 1, timeArr.date, timeArr.hour, timeArr.min, timeArr.second);
    },
    convertToStr: function(dateObj) {
        let year = dateObj.getFullYear();
        let month = Number(dateObj.getMonth()) + 1;
        month = month < 10 ? '0' + month : month;
        let date = dateObj.getDate();
        date = date < 10 ? '0' + date : date;
        let hour = dateObj.getHours();
        hour = hour < 10 ? '0' + hour : hour;
        let min = dateObj.getMinutes();
        min = min < 10 ? '0' + min : min;
        let second = dateObj.getSeconds();
        second = second < 10 ? '0' + second : second;
        return year + '' + month + '' + date + '' + hour + '' + min + '' + second;
    },
    getTimeObj: function(timeStr, timeType) {
        if (!timeStr) {
            console.error('[TimeUtil: error] getTimeObj, timeStr is undefined');
            return;
        }
        if (this.isDate(timeStr)) {
            timeStr = this.format(this.convertToStr(timeStr), 'yyyyMMddHHmmss');
        }

        let isNum = new RegExp('^[0-9]*$').test(timeStr);

        let year = '';
        let month = '';
        let date = '';
        let hour = '';
        let min = '';
        let second = '';

        if (isNum) {
            timeStr = timeStr.replace(new RegExp('[:;_-\\s+\/]', 'g'), '');
            year = timeStr.substring(0, 4), month = timeStr.substring(4, 6), date = timeStr.substring(6, 8), hour = timeStr.substring(8, 10);
            min = timeStr.length > 10 ? timeStr.substring(10, 12) : '00';
            second = timeStr.length > 12 ? timeStr.substring(12, 14) : '00';
        } else {
            [year, month, date, hour, min, second] = timeStr.replace(new RegExp('[:;_-\\s+\/]', 'g'), '#').match(/\d+/g);
            month = month.length === 1 ? `0${month}` : month;
            date = date.length === 1 ? `0${date}` : date;
            hour = hour.length === 1 ? `0${hour}` : hour;
            min = min ? min.length === 1 ? `0${min}` : min : '00';
            second = second ? second.length === 1 ? `0${second}` : second : '00';
        }

        if (timeType === 'Array' || !timeType) {
            return [year, month, date, hour, min, second];
        } else if (timeType === 'Object') {
            return {'year': year, 'month': month, 'date': date, 'hour': hour, 'min': min, 'second': second};
        } else {
            console.error('[TimeUtil: error] getTimeObj, timeType is undefined');
            return;
        }
    },
    addTime: function(timeStr, count, type) {
        count = Number(count);
        if (!type) {
            console.error('[TimeUtil: error] addTime, type is undefined');
            return;
        }
        let tempDate;
        if (this.isString(timeStr)) {
            timeStr = timeStr.replace(new RegExp('[:;_-\\s+\/]', 'g'), '');
            tempDate = this.convertToDate(timeStr);
        } else if (this.isDate(timeStr)) {
            tempDate = timeStr;
        }
        let date = this.clone(tempDate);
        switch (type) {
            case 'yyyy':
                date.setFullYear(tempDate.getFullYear() + count);
                break;
            case 'MM':
                date.setMonth(tempDate.getMonth() + count);
                break;
            case 'dd':
                date.setDate(tempDate.getDate() + count);
                break;
            case 'HH':
                date.setHours(tempDate.getHours() + count);
                break;
            case 'mm':
                date.setMinutes(tempDate.getMinutes() + count);
                break;
            case 'ss':
                date.setSeconds(tempDate.getSeconds() + count);
                break;
            default:
                break;
        }
        return date;
    },
    clone: function(tempDate){
        let date = new Date('2000-1-1');
        date.setFullYear(tempDate.getFullYear());
        date.setMonth(tempDate.getMonth());
        date.setDate(tempDate.getDate());
        date.setHours(tempDate.getHours());
        date.setMinutes(tempDate.getMinutes());
        date.setSeconds(tempDate.getSeconds());
        date.setMilliseconds(tempDate.getMilliseconds());
        return date;
    },
    dateBetween: function(startDate, endDate) {
        if (!this.isDate(startDate)) {
            startDate = this.convertToDate(startDate);
        }
        if (!this.isDate(endDate)) {
            endDate = this.convertToDate(endDate);
        }
        let time = Math.abs(startDate - endDate);
        let date = Math.floor(time / (1000 * 60 * 60 * 24));
        let tempHour = time % (1000 * 60 * 60 * 24);
        let hour = Math.floor(tempHour / (1000 * 60 * 60));
        let tempMin = tempHour % (1000 * 60 * 60);
        let min = Math.floor(tempMin / (1000 * 60));
        let tempSecond = tempMin % (1000 * 60);
        let second = Math.round(tempSecond / 1000);
        if (second === 60) {
            min += 1;
            second = 0;
        }
        if (min === 60) {
            hour += 1;
            min = 0;
        }
        if (hour === 24) {
            date += 1;
            hour = 0;
        }
        return {'date': date, 'hour': hour, 'min': min, 'second': second }; 
    },
    clearMMSS: function(dateObj, state){
        if (this.isString(dateObj)) {
            dateObj = this.convertToDate(dateObj);
        }
        let tempDate = this.clone(dateObj);
        if (!state) {
            tempDate.setMinutes(0);
        }
        tempDate.setSeconds(0);
        tempDate.setMilliseconds(0);
        return tempDate;
    },
    getMinByModel: function(timeObj, model) {
        let date = this.clone(timeObj);
        let sixMinArr = ['00', '06', '12', '18', '24', '30', '36', '42', '48', '54', '54', '54'];
        let fiveMinArr = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
        let min = date.getMinutes();
        if (model === 6) {
            min = sixMinArr[Number(min) / 5];
        } else if (model === 5){
            min = fiveMinArr[Number(min) / 6];
        }
        date.setMinutes(min);
        return date;
    },
    getNextTimeLong: function(min){
        min = Number(min);
        let mainDate = new Date();
        let tempMin = Number(mainDate.getMinutes());
        let nextDate = TimeUtil.clearMMSS(TimeUtil.clone(mainDate), true);
        for (let i = 1; i <= min; i++) {
            if ((tempMin + i) % min === 0) {
                nextDate.setMinutes(tempMin + i);
                break;
            }
        }
        let time = nextDate.getTime() - mainDate.getTime();
        return time;
    },
    isDate: function(date) {
        return Object.prototype.toString.call(date) === '[object Date]';
    },
    isString: function(str) {
        return Object.prototype.toString.call(str) === '[object String]';
    }
};

module.exports = TimeUtil;