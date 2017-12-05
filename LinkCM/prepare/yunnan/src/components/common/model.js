import TimeUtil from '../../util/tools/TimeUtil'

var model = {};

model.dropzone = {
    r24h_024: { dateTime: 24, type: 'fixed', num: [8, 20] },
    r24h_048: { dateTime: 48, type: 'fixed', num: [8, 20] },
    r24h_072: { dateTime: 72, type: 'fixed', num: [8, 20] },
    w10m_024: { dateTime: 24, type: 'fixed', num: [8, 20] },
    w10m_048: { dateTime: 48, type: 'fixed', num: [8, 20] },
    w10m_072: { dateTime: 72, type: 'fixed', num: [8, 20] },
    tmin_024: { dateTime: 24, type: 'fixed', num: [8, 20] },
    tmax_024: { dateTime: 24, type: 'fixed', num: [8, 20] },
    tmin_048: { dateTime: 48, type: 'fixed', num: [8, 20] },
    tmax_048: { dateTime: 48, type: 'fixed', num: [8, 20] },
    tmin_072: { dateTime: 72, type: 'fixed', num: [8, 20] },
    tmax_072: { dateTime: 72, type: 'fixed', num: [8, 20] }
};

model.data = {
    past24: { dateTime: -24 },
    past12: { dateTime: -12 },
    past6: { dateTime: -6 },
    past0: { dateTime: 0 },
    future1: { dateTime: 1 },
    future2: { dateTime: 2 },
    future3: { dateTime: 3 },
    heavyRainfall: { dateTime: -1, type: 'hours', num: 0 },
    heavyRainfall3: { dateTime: -3, type: 'hours', num: 0 },
    heavyRainfall24: { dateTime: -24, type: 'hours', num: 0 },
    heavyRainfall_qpf: { dateTime: 1, type: 'hours', num: 0 },
    heavyRainfall3_qpf: { dateTime: 3, type: 'hours', num: 0 },
    heavyRainfall6_2d: { dateTime: 6, type: 'fixed', num: [8, 20] },
    heavyRainfall12_2d: { dateTime: 12, type: 'fixed', num: [8, 20] },
    heavyRainfall24_2d: { dateTime: 24, type: 'fixed', num: [8, 20] },
    heavyRainfall48_2d: { dateTime: 48, type: 'fixed', num: [8, 20] },
    heavyRainfall48lj_2d: { dateTime: 48, type: 'fixed', num: [8, 20] },
    heavyRainfall72lj_2d: { dateTime: 72, type: 'fixed', num: [8, 20] },
    galeInstant24: { dateTime: -24, type: 'hours', num: 0 },
    galeInstant: { dateTime: -1, type: 'hours', num: 0 },
    futureGaleInstant24: { dateTime: 24, type: 'fixed', num: [8, 20] },
    futureGaleInstant48: { dateTime: 48, type: 'fixed', num: [8, 20] },
    galeAverage24: { dateTime: -24, type: 'hours', num: 0 },
    galeAverage: { dateTime: -1, type: 'hours', num: 0 },
    futureGaleAverage24: { dateTime: 24, type: 'fixed', num: [8, 20] },
    futureGaleAverage48: { dateTime: 48, type: 'fixed', num: [8, 20] },
    pastMaxTemperature24: { dateTime: -24, type: 'hours', num: 0 },
    futureMaxTemperature24: { dateTime: 24, type: 'fixed', num: [8, 20] },
    futureMaxTemperature48: { dateTime: 48, type: 'fixed', num: [8, 20] },
    futureMaxTemperature72: { dateTime: 72, type: 'fixed', num: [8, 20] },
    pastMinTemperature24: { dateTime: -24, type: 'hours', num: 0 },
    futureMinTemperature24: { dateTime: 24, type: 'fixed', num: [8, 20] },
    futureMinTemperature48: { dateTime: 48, type: 'fixed', num: [8, 20] },
    futureMinTemperature72: { dateTime: 72, type: 'fixed', num: [8, 20] },
    mtzj: { type: 'hours', num: 0 },
    mtzh: { type: 'hours', num: 0 },
    stormTide: { type: 'hours', num: 0 },
    waterLogging: { type: 'hours', num: 0 },
    fireDanger: { type: 'hours', num: 0 },
    mountainTorrents: { type: 'hours', num: 0 },
    mountainTorrents1: { type: 'hours', num: 0 },
    mountainTorrents2: { type: 'hours', num: 0 },
    mountainTorrents3: { type: 'hours', num: 0 },
    pollutantDispersion: { type: 'hours', num: 0 }
};

// 获取模型的正确时间
model.getModelTime = function(name, cType = '', sourceTime = '', ddatetime = '') {
    if (name === 'pollutantDispersion') {
        return sourceTime || ddatetime;
    } else if (name !== 'waterLogging' && name != 'fireDanger') {
        if (cType != '') name = cType;
        let timeRule = model.data;
        if (model.dropzone[cType]) {
            timeRule = model.dropzone;
        }
        let type = timeRule[name].type;
        let hours = timeRule[name].num;
        let dateTime = ddatetime;
        if (sourceTime == '') sourceTime = dateTime;
        else dateTime = sourceTime;
        if (dateTime != '') {
            var newData = '';
            if (type == 'hours') { // 加减时间
                newData = TimeUtil.addTime(dateTime, hours, "HH");
                newData = TimeUtil.convertToStr(newData);
            } else { // 获取上一时间[8,20]
                let date = TimeUtil.convertToDate(dateTime);
                let tempHour = date.getHours();
                if (tempHour >= 8 && tempHour < 20) {
                    newData = dateTime.substring(0, 8) + '08';
                } else if (tempHour >= 20) {
                    newData = dateTime.substring(0, 8) + '20';
                } else if (tempHour < 8) { // 读取前一天20点的数据
                    newData = TimeUtil.addTime(dateTime, -1, "dd");
                    newData = TimeUtil.convertToStr(newData);
                    newData = newData.substring(0, 8) + '20';
                }
            }
            return newData;
        }
    }
}

module.exports = model;
