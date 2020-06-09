const MhdPO = require("./Download/MhdPO");
const SadPO = require("./Download/SadPO");
const Trains = require("./Download/Trains");
const TrafficSituation = require("./Download/trafficSituation");
const WeatherPO = require("./Download/weatherPO");
const WeatherKE = require("./Download/weatherKE");

async function downloadAll() {
    return new Promise(resolve => {
        setInterval(() =>{
            MhdPO.downloadMhdPO(),
            SadPO.downloadSadPO(),
            Trains.downloadTrains(),
            TrafficSituation.downloadTrafficSituation(),
            WeatherPO.downloadWeatherPO(),
            WeatherKE.downloadWeatherKE()
        },15000
    )})
}
downloadAll()
// setInterval(downloadAll(), 15000);
