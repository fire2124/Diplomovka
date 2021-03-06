const axios = require("axios");
const request = require("request");
const _ = require("lodash");
const { apiWeatherUrl } = require( "../config.json");

const options = {
  method: "GET",
  url:
    "https://openweathermap.org/data/2.5/weather?id=723819&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02\n",
  headers: {},
};
const firstJsonUrl =
  "http://localhost:9500/api/v1/currentWeatherPo/firstJSON/1";
const currentWeatherPoUrlElastic = apiWeatherUrl;


async function downloadWeatherPO() {
  let firstJson;
  firstJson = await axios.get(firstJsonUrl);
  firstJson = firstJson.data;

  let json = await new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) reject(error);
      else resolve(body);
    });
  });
 
  
  let globalObject = JSON.parse(json);
  let time = new Date();
  let currentTime = time.getTime();
  let count = 0;

  let sth = {};
  sth = globalObject.rain;

  let a = {};
  let properties = {};
  let geometry = {};
  let coordinates = [];
  a.type = "Feature";

  geometry.type = "Point";
  coordinates[0] = globalObject.coord.lon;
  coordinates[1] = globalObject.coord.lat;
  geometry.coordinates = coordinates;
  a.geometry = geometry;
  properties.Id = ++count;
  properties.Type = "WeatherPO";

  const iterator = globalObject.weather.values();
  for (const value of iterator) {
    properties.Weather_Id = value.id;
    properties.Weather_Main = value.main;
    properties.Weather_Description = value.description;
    properties.Weather_Icon = value.icon;
  }
  properties.Main_Temp = globalObject.main.temp;
  properties.Main_FeelsLike = globalObject.main.feels_like;
  properties.Main_TempMax = globalObject.main.temp_max;
  properties.Main_TempMin = globalObject.main.temp_min;
  properties.Main_Pressure = globalObject.main.pressure;
  properties.Main_Humidity = globalObject.main.humidity;
  properties.Wind_Speed = globalObject.wind.speed;
  properties.Wind_Deg = globalObject.wind.deg;
  properties.Clouds_All = globalObject.clouds.all;
  properties.Sunrise = globalObject.sys.sunrise;
  properties.Sunset = globalObject.sys.sunset;
  properties.Visibility = globalObject.visibility;
  try {
    properties.Rain_1h = globalObject.rain["1h"];
  } catch (error) {}
  a.properties = properties;

  if (firstJson == undefined || firstJson.length < 1) {
    console.log("first Weather");
    a.properties.Current_Time = currentTime;

    try {
      axios.post(firstJsonUrl, a);
      axios.post(currentWeatherPoUrlElastic, a);
    } catch (err) {
      console.log(err);
    }
  } else {
    delete firstJson.properties.Current_Time;
    console.log("----------");
    console.log(_.isEqual(a, firstJson));
    console.log("weatherPO");
    if (_.isEqual(a, firstJson) === false) {
      a.properties.Current_Time = currentTime;

      try {
        axios.post(firstJsonUrl, a);
        console.log(a)
        axios.post(currentWeatherPoUrlElastic, a)
        
      } catch (error) {
        console.log(error);
      }
    }
  }
}

setInterval(downloadWeatherPO, 15000);
//downloadWeatherPO();

module.exports = {
  downloadWeatherPO,
};