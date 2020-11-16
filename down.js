const MhdPO = require("./Download/MhdPO");
const SadPO = require("./Download/SadPO");
const Trains = require("./Download/Trains");
const TrafficSituation = require("./Download/trafficSituation");
const WeatherPO = require("./Download/weatherPO");
const WeatherKE = require("./Download/weatherKE");

const downloadAll = async () => {
    const promises = [
        MhdPO.downloadMhdPO,
        SadPO.downloadSadPO,
        Trains.downloadTrains,
        TrafficSituation.downloadTrafficSituation,
        WeatherPO.downloadWeatherPO,
        WeatherKE.downloadWeatherKE,
    ]
const values = await Promise.all(promises.map(p => p()))
console.log(values)
return values
}

setInterval(downloadAll(), 15000);
