// weather Prešov
async function downloadWeatherPO() {
  const fs = require("fs");
  const fetch = require("node-fetch");
  const date = new Date();
  const axios = require("axios");
  const imageDate = Date.parse(date);

  if (!fs.existsSync("./Data/weather/PO_json")) {
    fs.mkdirSync("./Data/weather/PO_json");
  }
  let request = require("request");
  let options = {
    method: "GET",
    url:
      "https://openweathermap.org/data/2.5/weather?id=723819&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02\n",
    headers: {},
  };
  return new Promise( await request(options, async function (error, response, body) {
    if (error) throw new Error(error);
    const date = new Date();
    const imageDate = Date.parse(date);
    let array = [];
    let globalObject = JSON.parse(body);
    let time = new Date();
    let currentTime = time.getTime();
    let count = 0;

    //console.log(globalObject);
    delete globalObject.id;
    globalObject.Id = ++count;
    globalObject.Type = "WeatherPO";
    globalObject.CurrentTime = currentTime;
    globalObject.Lat = globalObject.coord.lat;
    globalObject.Lng = globalObject.coord.lon;
    delete globalObject.coord;
    const iterator = globalObject.weather.values();
    for (const value of iterator) {
      globalObject.Weather_Id = value.id;
      globalObject.Weather_Main = value.main;
      globalObject.Weather_Description = value.description;
      globalObject.Weather_Icon = value.icon;
    }
    delete globalObject.weather;
    globalObject.Main_Temp = globalObject.main.temp;
    globalObject.Main_FeelsLike = globalObject.main.feels_like;
    globalObject.Main_TempMax = globalObject.main.temp_max;
    globalObject.Main_TempMin = globalObject.main.temp_min;
    globalObject.Main_Pressure = globalObject.main.pressure;
    globalObject.Main_Humidity = globalObject.main.humidity;
    delete globalObject.main;
    globalObject.Wind_Speed = globalObject.wind.speed;
    globalObject.Wind_Speed = globalObject.wind.deg;
    delete globalObject.wind;
    globalObject.Clouds_All = globalObject.clouds.all;
    delete globalObject.clouds;
    globalObject.Sunrise = globalObject.sys.sunrise;
    globalObject.Sunset = globalObject.sys.sunset;
    delete globalObject.sys;
    let sth = {};
    sth = globalObject.rain;
    try {
      globalObject.Rain_1h = globalObject.rain["1h"];
      delete globalObject.rain;
    } catch (error) {}
    //array.push(globalObject);
    //console.log(array);
    await axios.post("http://localhost:3000/api/v1/currentWeatherPo/", globalObject);

    // fs.writeFileSync(
    //   `./Data/weather/PO_json/${imageDate}.json`,
    //   JSON.stringify(array)
    // );
  }));
}

//setInterval(downloadWeatherPO, 15000);

module.exports = {
  downloadWeatherPO
}