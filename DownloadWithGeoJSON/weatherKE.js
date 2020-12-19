const axios = require("axios");
const request = require("request");
const _ = require("lodash");
const options = {
  method: "GET",
  url:
    "https://openweathermap.org/data/2.5/weather?id=724443&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02\n",
  headers: {},
};
const currentWeatherKeUrl = "http://localhost:9200/api/v1/currentWeatherKe/";
const firstJsonUrl =
  "http://localhost:9200/api/v1/currentWeatherKe/firstJSON/1";
const currentWeatherKeUrlElastic = `http://127.0.0.1:9200/weather_ke/_doc/`;
// weather Kosice
async function downloadWeatherKE() {
  let firstJson;
  firstJson = await axios.get(firstJsonUrl);
  firstJson = firstJson.data;

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

  let sth = {};
  sth = globalObject.rain;

  //array.push(globalObject);
  //console.log(array);
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
  properties.Type = "WeatherKE";
  //properties.CurrentTime = currentTime;

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
  properties.Wind_Speed = globalObject.wind.deg;
  properties.Clouds_All = globalObject.clouds.all;
  properties.Sunrise = globalObject.sys.sunrise;
  properties.Sunset = globalObject.sys.sunset;
  properties.Visibility = globalObject.visibility;
  try {
    properties.Rain_1h = globalObject.rain["1h"];
  } catch (error) {}
  a.properties = properties;

  //console.log(a);
  if (firstJson == undefined || firstJson.length < 1) {
    //previosExcel
    d = a; //currentExcel
  } else {
    d = firstJson;
  }

  delete d.properties.Current_Time;
  //console.log(_.isEqual(a, d));

  if (firstJson == undefined || firstJson.length < 1) {
    //return new Promise(async (resolve, reject) => {
    a.properties.Current_Time = currentTime;

    console.log(a);
    console.log("here");
    try {
      await axios.post(firstJsonUrl, a);

      await axios.post(currentWeatherKeUrl, a);
    } catch (err) {
      console.log(err);
    }

    //resolve();
    //});
  } else if (_.isEqual(a, firstJson) === false) {
    //return new Promise(async (resolve, reject) => {
    a.properties.Current_Time = currentTime;
    console.log(a);
    try {
      await axios.post(firstJsonUrl, a);
      await axios.post(currentWeatherKeUrl, a);
    } catch (error) {
      console.log(error);
    }

    //axios.post(currentWeatherKeUrlElastic, globalObject);
    //resolve();
    //});
  }
}

//setInterval(downloadWeatherKE, 15000);
//downloadWeatherKE().then((v) => console.log(v));
downloadWeatherKE();
module.exports = {
  downloadWeatherKE,
};
