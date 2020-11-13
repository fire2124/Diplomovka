const MhdPO = require("./Download/MhdPO");
const SadPO = require("./Download/SadPO");
const Trains = require("./Download/Trains");
const TrafficSituation = require("./Download/trafficSituation");
const WeatherPO = require("./Download/weatherPO");
const WeatherKE = require("./Download/weatherKE");

async function downloadAll() {
    return new Promise(resolve => {
        setInterval(() =>{
            MhdPO.downloadMhdPO().then(v=>
                console.log(v)),
            SadPO.downloadSadPO().then(v=>
                console.log(v)),
            Trains.downloadTrains().then(v=>
                console.log(v)),
            TrafficSituation.downloadTrafficSituation().then(v=>
                console.log(v)),
            WeatherPO.downloadWeatherPO().then(v=>
                console.log(v)),
            WeatherKE.downloadWeatherKE().then(v=>
                console.log(v))
        },15000
    )
    resolve()
})
}
downloadAll()
// setInterval(downloadAll(), 15000);
