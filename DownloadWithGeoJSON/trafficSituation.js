const fetch = require("node-fetch");
const axios = require("axios");
const request = require("request");
const _ = require("lodash");

const options = {
  method: "GET",
  url:
    "https://portal.minv.sk/wps/portal/domov/sluzby_pz/dopravne_krizove_situacie/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOJNDJxdPby8DbzcQ_2MDRwtzQJdQ4ItjCyCDYEKIoEKnN0dPUzMfQwMDEwsjAw8XZw8XMwtfQ0MPM2I02-AAzgaENIfrh-FV4m3KVQBPieCFeBxQ0FuaIRBpqciANyVKis!/dl5/d5/L2dBISEvZ0FBIS9nQSEh/pw/Z7_40CEHJK0JGUN30A96QETS828Q4/res/id=QCPgetSituations/c=cacheLevelPage/=/?regionId=0&categories=ZD6%3BZD7%3BZD8%3BZD1%3BZD2%3BZD3%3BZD5&showPlanned=false\n",
  headers: {
    Cookie: "DigestTracker=AAABcmANZNU",
  },
};
const firstJsonUrl = `http://localhost:9200/api/v1/currentTraffic/firstJSON/1`;
const currentTrafficUrl = "http://localhost:9200/api/v1/currentTraffic/";
const currentTrafficUrlElastic = `http://127.0.0.1:9200/traffic_situation/_doc/`;

async function downloadTrafficSituation() {
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
  let bodyFinal = JSON.parse(json);
  let time = new Date();
  let currentTime = time.getTime();
  bodyFinal = bodyFinal.situations;
  let count = 0;

  const zaznamy = bodyFinal
    .map((element) => {
      try {
        if (element.region.id === 7 || element.region.id === 8) {
          // console.log(element)
          let a = {};
          let properties = {};
          let geometry = {};
          let coordinates = [];
          let coordinatesMulti = [];
          let coordinatesPoly = [];

          properties.region_ID = element.region.id;
          properties.region_name = element.region.name;
          properties.Type = "Traffic";
          //properties.Current_Time = currentTime;
          properties.district_ID = element.district.id;
          properties.district_Name = element.district.name;
          properties.district_AreaLevel = element.district.areaLevel;
          properties.delaySeconds = element.delayMinutes * 60;

          if (element.district_Parent_ID) {
            properties.district_Parent_ID = element.district.parent.id;
            properties.district_Parent_Name = element.district.parent.name;
          }

          if(element.city)  properties.city = element.city;
          if(element.street)  properties.street = element.street;
          properties.category_Code = element.category.code;
          properties.category_Name = element.category.name;
          properties.status_Code = element.status.code;
          properties.status_Name = element.status.name;
          if (element.title) properties.title = element.title;
          properties.description = element.description;
          //Location -------------------------------------------------------------
          if (element.location) {
            //console.log(++count);
            let loc = JSON.parse(element.location);
            //console.log(loc)
            //points
            if (loc.points) {
              let iterator9 = loc.points.values();
              for (let value10 of iterator9) {
                //console.log(value10.geometry);
                coordinates[0] = value10.geometry.x;
                coordinates[1] = value10.geometry.y;
              }
              geometry.type = "Point";
              geometry.coordinates = coordinates;
              a.geometry = geometry;
            }
            //polygons -- bavi
            if (loc.polygons) {
              let iterator4 = loc.polygons.values();
              //console.log("polygon" + " " + iterator4);
              for (let value4 of iterator4) {
                // console.log(value4);
                let iterator5 = value4.geometry.rings.values();
                for (let value5 of iterator5) {
                  coordinatesPoly = value5;
                }
              }
              properties.coordinatesPoly = coordinatesPoly;
              properties.typePoly = "Polygon";
            }

            //lines "MultiPoint"
            if (loc.lines) {
              let iterator6 = loc.lines.values();
              for (let value7 of iterator6) {
                let iterator8 = value7.geometry.paths.values();
                for (let value8 of iterator8) {
                  coordinatesMulti = value8;
                }
              }
              properties.coordinatesMulti = coordinatesMulti;
              properties.typeMulti = "MultiPoint";
              //console.log("MultiPoint")
              //console.log(loc.lines)
            }
          }

          if (element.houseNo) {
            //console.log(element.houseNo);
            const split = element.houseNo.split("/");
            properties.houseNoFirst = parseInt(split[0]);
            if (split[1]) properties.houseNoSecond = parseInt(split[1]);
          }

          a.type = "Feature";
          a.properties = properties;

          //console.log(a)
          return a;
        }
        return;
      } catch (e) {}
    })
    .filter((v) => v != undefined);



  //Filter
  let filteredResult = zaznamy.reduce((acc, current) => {
    const x = acc.find(
      (item) =>
        item.properties.district_Name === current.properties.district_Name &&
        item.properties.status_Name === current.properties.status_Name &&
        item.properties.category_Code === current.properties.category_Code
    );
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  let count2 = 0;
  if (firstJson == undefined || firstJson.length < 1) {
    console.log("first json undefined");

    filteredResult.map((item) => {
      item.properties.Current_Time = currentTime;
    });

    axios.post(firstJsonUrl, filteredResult);
    return await Promise.all(
      filteredResult.map((element) => {
        axios.post(currentTrafficUrl, element);
        //axios.post(currentTrafficUrlElastic, element);
      })
    );
  } else {
    firstJson.map((item) => {
      delete item.properties.Current_Time;
    });
    console.log("----------")
    console.log(_.isEqual(filteredResult, firstJson));
    console.log("Traffic")
    if (_.isEqual(filteredResult, firstJson) === false) {
      
      filteredResult.map((item) => {
        item.properties.Current_Time = currentTime;
      });

      axios.post(firstJsonUrl, filteredResult);

      return await Promise.all(
        filteredResult.map((element) => {
          axios.post(currentTrafficUrl, element);
          //axios.post(currentTrafficUrlElastic, element);
        })
      );
    }
  }
}

setInterval(downloadTrafficSituation, 15000);
//downloadTrafficSituation();

module.exports = {
  downloadTrafficSituation,
};
