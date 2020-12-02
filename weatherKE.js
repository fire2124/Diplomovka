const fs = require("fs");
const fetch = require("node-fetch");
const date = new Date();
const axios = require("axios");
const imageDate = Date.parse(date);
let request = require("request");

// weather Kosice
async function downloadWeatherKE() {
  let options = {
    method: "GET",
    url:
      "https://openweathermap.org/data/2.5/weather?id=724443&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02\n",
    headers: {},
  };
  
  if (!fs.existsSync("./Data/weather/KE_json")) {
    fs.mkdirSync("./Data/weather/KE_json");
  }
  let json = await new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) reject(error);
      else resolve(body);
    });
  });
  const date = new Date();
  const imageDate = Date.parse(date);
  let array = [];
  let globalObject = JSON.parse(json);
  let time = new Date();
  let currentTime = time.getTime();
  let count = 0;
  // console.log(globalObject);
  delete globalObject.id;
  globalObject.Id = ++count;
  globalObject.Type = "WeatherKE";
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
    // console.log(sth);
    globalObject.Rain_1h = globalObject.rain["1h"];
    delete globalObject.rain;
  } catch (error) {}
  //array.push(globalObject);
  //console.log(array);
  
  console.log(globalObject);

  return new Promise((resolve, reject) => {
    axios.post(`http://127.0.0.1:9200/weather_ke/_doc/`, globalObject)
    resolve();
  })
};
  //await axios.post("http://localhost:3000/api/v1/currentWeatherKe/", globalObject);

  // fs.writeFileSync(
  //   `./Data/weather/KE_json/${imageDate}.json`,
  //   JSON.stringify(array)
  // );
//setInterval(downloadWeatherKE, 15000);
//downloadWeatherKE().then((v) => console.log(v));

module.exports = {
  downloadWeatherKE,
};
