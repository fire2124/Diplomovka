const mhdPO = require('./Download.js/MhdPO.js');
const trafficSituation = require('./Download.js/trafficSituation.js')
const trains = require('./Download.js/trains.js')
const weatherKE = require('./Download.js/weather.js')
const weatherPO = require('./Download.js/weather.js')


setInterval(weatherPO.require, 15000);
// weatherKE.downloadKE()
// trains.download()
// mhdPO.start()
// trafficSituation.downloadTrafficSituation()
