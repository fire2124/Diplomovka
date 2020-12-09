const MhdPO = require("./DownloadWithGeoJSON/MhdPO");
const SadPO = require("./DownloadWithGeoJSON/SadPO");
const Trains = require("./DownloadWithGeoJSON/Trains");
const TrafficSituation = require("./DownloadWithGeoJSON/trafficSituation");
const WeatherPO = require("./DownloadWithGeoJSON/weatherPO");
const WeatherKE = require("./DownloadWithGeoJSON/weatherKE");
const Ubian  = require("./DownloadWithGeoJSON/Ubian")

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
                WeatherKE.downloadWeatherKE().then(v=>
                    console.log(v))
            Ubian.downloadUbian().then(v=>
                console.log(v))
        },15000
    )
    resolve()
})
}
downloadAll()
// setInterval(downloadAll(), 15000);
