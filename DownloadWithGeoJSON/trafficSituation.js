const fs = require("fs");
const fetch = require("node-fetch");
const date = new Date();
const axios = require("axios");
const imageDate = Date.parse(date);
const request = require("request");
const options = {
  method: "GET",
  url:
    "https://portal.minv.sk/wps/portal/domov/sluzby_pz/dopravne_krizove_situacie/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOJNDJxdPby8DbzcQ_2MDRwtzQJdQ4ItjCyCDYEKIoEKnN0dPUzMfQwMDEwsjAw8XZw8XMwtfQ0MPM2I02-AAzgaENIfrh-FV4m3KVQBPieCFeBxQ0FuaIRBpqciANyVKis!/dl5/d5/L2dBISEvZ0FBIS9nQSEh/pw/Z7_40CEHJK0JGUN30A96QETS828Q4/res/id=QCPgetSituations/c=cacheLevelPage/=/?regionId=0&categories=ZD6%3BZD7%3BZD8%3BZD1%3BZD2%3BZD3%3BZD5&showPlanned=false\n",
  headers: {
    Cookie: "DigestTracker=AAABcmANZNU",
  },
};

async function downloadTrafficSituation() {
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
    .map(async (element) => {
      try {
        if (element.region.id === 7 || element.region.id === 8) {
          //console.log(element)
          let a = {};
          let properties = {};
          let geometry = {};
          let coordinates = [];
          let coordinatesMulti = [];
          let coordinatesPoly = [];

          properties.region_ID = element.region.id;
          properties.region_name = element.region.name;
          properties.Type = "Traffic";
          properties.Current_Time = currentTime;
          properties.district_ID = element.district.id;
          properties.district_Name = element.district.name;
          properties.district_AreaLevel = element.district.areaLevel;

          if (element.district_Parent_ID) {
            properties.district_Parent_ID = element.district.parent.id;
            properties.district_Parent_Name = element.district.parent.name;
          }

          properties.category_Code = element.category.code;
          properties.category_Name = element.category.name;
          properties.status_Code = element.status.code;
          properties.status_Name = element.status.name;

          //Location -------------------------------------------------------------
          if (element.location) {
            //console.log(++count);
            let loc = JSON.parse(element.location);

            //points
            if (loc.points) {
              const iterator9 = loc.points.values();
              for (const value10 of iterator9) {
                coordinates[0] = value10.geometry.x;
                coordinates[1] = value10.geometry.y;
              }
              geometry.type = "Point";
              geometry.coordinates = coordinates;
            }
            //polygons
            if (loc.polygons) {
              const iterator4 = loc.polygons.values();
              //console.log("polygon" + " " + iterator4);
              for (const value4 of iterator4) {
                const iterator5 = value4.geometry.rings.values();
                for (const value5 of iterator5) {
                  coordinatesPoly = value5;
                }
              }
              properties.coordinatesPoly = coordinatesPoly;
              properties.typePoly = "Polygon";
              //console.log("polygon");
              //console.log(loc.polygons);
            }

            //lines
            if (loc.lines) {
              const iterator6 = loc.lines.values();
              for (const value7 of iterator6) {
                const iterator8 = value7.geometry.paths.values();
                for (const value8 of iterator8) {
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
            properties.houseNoFirst = split[0];
            properties.houseNoSecond = split[1];
          }

          a.type = "Feature";
          a.geometry = geometry;
          a.properties = properties;

          console.log(a)
          return a;
        }
        return;
      } catch (e) {}
    })
    .filter((v) => v != undefined);
  // console.log(zaznamy);
  // await axios.post(
  //   `http://localhost:9200/api/v1/currentTraffic/firstJSON/1`,
  //   zaznamy
  // )
  let count2 = 0;

  //return
  let result = [];
  // return await Promise.all(
  //   // zaznamy.map((element) => {
  //   //   if (element !== undefined)
  //   //     //element.OrderInJsonId = ++count2;
  //   //     //console.log(count2);
  //   //     //console.log(element)
  //   //     //axios.post("http://localhost:3000/api/v1/currentTraffic/", element);
  //   //     //axios.post(`http://127.0.0.1:9200/traffic_situation/_doc/`, element);

  //   //     //array2.push(zaznam);
  //   //     //result.push(element)
        
  //   // })
  //   axios.post(
  //     `http://localhost:9200/api/v1/currentTraffic/firstJSON/1`,
  //     zaznamy
  //   )
  // );

  // await axios.post(
  //   `http://localhost:9200/api/v1/currentTraffic/firstJSON/1`,
  //   zaznamy
  // );
  //   fs.writeFileSync(
  //     `./Data/TrafficSituation/${imageDate}.json`,
  //     json
  //   );
}

//setInterval(downloadTrafficSituation, 15000);
downloadTrafficSituation();

module.exports = {
  downloadTrafficSituation,
};
