const axios = require("axios");
const csv = require("csvtojson");
const fs = require("fs");
const { getDistance } = require('geolib')
const OPTIONS = {
  method: "GET",
  hostname: "egov.presov.sk",
  path: "/geodatakatalog/dpmp.csv",
  headers: {},
  maxRedirects: 0,
  connection: 'keep-alive'
};
const RESPONSE_ENCODING = "CP1250";
const https = require("follow-redirects").https;
const IconvLite = require("iconv-lite");
const { apiBstUrl } = require( "../config.json");
//static
const presovStreets = require("../Data/static/uliceFinal");
const presovStopsMHD = require("../Data/static/mhd_Stops");
const zastavkyGPS = presovStopsMHD.features
const streets = JSON.parse(JSON.stringify(presovStreets));
//dynamic
const currentMhdPoBussesUrlElastic = apiBstUrl;

const firstJsonUrl =
  "http://localhost:9500/api/v1/currentMhdPoBusses/firstJSON/1";

const csvHeaders = [
  "ROUTE_NUMBER",
  "PLANNED_START",
  "DIRECTION",
  "BUS_STOP_ORDER_NUM",
  "BUS_STOP_NAME_1",
  "BUS_STOP_NUM_1",
  "BUS_STOP_SUB_NUM_1",
  "BUS_STOP_NAME_2",
  "BUS_STOP_NUM_2",
  "BUS_STOP_SUB_NUM_2",
  "PLANNED_ROAD",
  "REAL_ROAD",
  "LATITUDE",
  "LONGITUDE",
  "VARIATION",
  "VEHICLE_NUMBER",
  "DATE_TIME",
];
const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: "https://25cb4963ff9b4bc6bab0de0aa7abf202@o368587.ingest.sentry.io/5667034",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "test",
  name: "My First Test Transaction",
});



const getStops = async () => {
  return new Promise((resolve, reject) => {
    const req = https.request(OPTIONS, (res) => {
      let chunks = [];
      res.on("data", (chunk) => {
        chunks.push(chunk);
        //buffre
      });

      res.on("end", () => {
        try {
          const body = IconvLite.decode(
            Buffer.concat(chunks),
            RESPONSE_ENCODING
          );
          resolve(body.toString());
        } catch (e) {
          Sentry.captureException(e);
          reject(e);
        }
      });

      res.on("error", (error) => {
        reject(error);
        //hodenie chyby
        console.log("Error: Unable to get " + OPTIONS.hostname, "#ff0000");
        console.log(error, "#ff0000");
        callback(null);
      })
    });
    req.end();
  });

};




async function downloadMhdPO() {
  let firstJson; //downloadPreviousJson

  try {
    firstJson = await axios.get(firstJsonUrl);
    firstJson = firstJson.data;
    //console.log(firstJson);
  } catch (err) { }

  getStops().then(async (response) => {
    csv({
      noheader: false,
      delimiter: ";",
      checkType: true,
      headers: csvHeaders,
    })
      .fromString(response)
      .then(async (json) => {
        // currentExcel
        let d;
        let result = [];
        let time = new Date();
        let currentTime = time.getTime();
        // adding count, type, Current Time
        // Change to GEO JSON- normal lat and lot
        let count = 0;
        let downloadResult = [];
        if (json.length > 0) {
          json.map(async (x) => {
            // currentExcel
            let a = {};
            let properties = {};
            let geometry = {};
            let coordinates = [];
            properties.ROUTE_NUMBER = x.ROUTE_NUMBER;
            properties.PLANNED_START = x.PLANNED_START;
            properties.DIRECTION = x.DIRECTION;
            properties.BUS_STOP_ORDER_NUM = x.BUS_STOP_ORDER_NUM;
            properties.Current_Stop = x.BUS_STOP_NAME_1;
            // kontrola ci sa nachadza " *"
            if (properties.Current_Stop.includes(" *")) {
              properties.Current_Stop = properties.Current_Stop.split(" *")[0];
              //kontrola medzier " "
              if (properties.Current_Stop.slice(-1) === " ") {
                //console.log("StopName1");
                properties.Current_Stop = properties.Current_Stop.slice(0, -1);
              }
              //kontrola ak je properties.Current_Stop prazdne
              if (properties.Current_Stop === "") {
                properties.Current_Stop = x.Current_Stop.split(" *")[0];
              }
            }

            properties.BUS_STOP_NUM_1 = x.BUS_STOP_NUM_1;
            properties.BUS_STOP_SUB_NUM_1 = x.BUS_STOP_SUB_NUM_1;
            properties.Next_Stop = x.BUS_STOP_NAME_2;
            properties.BUS_STOP_NUM_2 = x.BUS_STOP_NUM_2;
            if (properties.Next_Stop.includes(" *")) {
              properties.Next_Stop = properties.Next_Stop.split(" *")[0];
              //kontrola medzier " "
              if (properties.Next_Stop.slice(-1) === " ") {
                //console.log("StopName2");
                properties.Next_Stop = properties.Next_Stop.slice(0, -1);
              }
              //kontrola ak je properties.Next_Stop prazdne
              if (properties.Next_Stop === "") {
                properties.Next_Stop = x.Next_Stop.split(" *")[0];
              }
            }
            properties.BUS_STOP_SUB_NUM_2 = x.BUS_STOP_SUB_NUM_2;
            properties.PLANNED_ROAD = x.PLANNED_ROAD;
            properties.REAL_ROAD = x.REAL_ROAD;
            properties.DELAY = x.VARIATION;
            properties.VEHICLE_NUMBER = x.VEHICLE_NUMBER;
            if (x.CHANGE_OF_DELAY)
              properties.CHANGE_OF_DELAY = x.CHANGE_OF_DELAY;
            if (x.Street) properties.Street = x.Street;
            properties.Order_In_Json_Id = ++count;
            properties.Type = "MHD";
            properties.Current_Time = currentTime;
            coordinates[0] = x.LONGITUDE;
            coordinates[1] = x.LATITUDE;
            geometry.type = "Point";
            geometry.coordinates = coordinates;
            a.type = "Feature";
            a.geometry = geometry;
            a.properties = properties;
            downloadResult.push(a);
          });
          if (firstJson == undefined || firstJson.length < 1) {
            //previosExcel
            firstJson = downloadResult; //currentExcel
            d = downloadResult;
            // console.log(firstJson)
            // console.log(d)
          } else {
            d = firstJson;
          }

          //adding Change of DELAY
          downloadResult.forEach((j) => {
            //currentExcel
            d.forEach((e) => {
              // previosExcel
              if (
                e.properties["ROUTE_NUMBER"] === j.properties["ROUTE_NUMBER"] &&
                e.properties["DIRECTION"] === j.properties["DIRECTION"] &&
                e.properties["PLANNED_START"] === j.properties["PLANNED_START"]
              ) {
                j.properties["CHANGE_OF_DELAY"] = Math.abs(
                  e.properties["DELAY"] - j.properties["DELAY"]
                );

                //new                               //old
                if (
                  j.properties["DELAY"] < e.properties["DELAY"] &&
                  j.properties["CHANGE_OF_DELAY"] > 0
                ) {
                  j.properties["CHANGE_OF_DELAY"] = -j.properties[
                    "CHANGE_OF_DELAY"
                  ];

                  //new                               //old
                } else if (
                  j.properties["DELAY"] > e.properties["DELAY"] &&
                  j.properties["CHANGE_OF_DELAY"] > 0
                ) {
                  j.properties["CHANGE_OF_DELAY"] =
                    j.properties["CHANGE_OF_DELAY"];

                  //new                               //old
                } else if (
                  j.properties["DELAY"] < e.properties["DELAY"] &&
                  j.properties["CHANGE_OF_DELAY"] < 0
                ) {
                  j.properties["CHANGE_OF_DELAY"] = -j.properties[
                    "CHANGE_OF_DELAY"
                  ];

                  //new                               //old
                } else if (
                  j.properties["DELAY"] > e.properties["DELAY"] &&
                  j.properties["CHANGE_OF_DELAY"] < 0
                ) {
                  j.properties["CHANGE_OF_DELAY"] =
                    j.properties["CHANGE_OF_DELAY"];
                }
                // console.log("----------------------------------")
                // console.log("oldExcel "  + e.properties["DELAY"])
                // console.log("newExcel "  +j.properties["DELAY"])
                // console.log(j.properties["CHANGE_OF_DELAY"])
                result.push(j);
              } else {
                result.push(j);
              }
            });
          });

          //Filter
          let filteredResult = result.reduce((acc, current) => {
            const x = acc.find(
              (item) =>
                item.properties.ROUTE_NUMBER ===
                current.properties.ROUTE_NUMBER &&
                item.properties.DIRECTION === current.properties.DIRECTION &&
                item.properties.PLANNED_START ===
                current.properties.PLANNED_START
            );
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);

          // adding Street
          filteredResult.map(async (zaznam) => { // autobus
            streets.features.forEach((ul) => {
              // pridavanie ulic
              ul.geometry.coordinates.forEach((u) => {
                u.map((x) => {
                  if (
                    x[0].toFixed(3) ===
                    zaznam.geometry.coordinates[0].toFixed(3) &&
                    x[1].toFixed(3) ===
                    zaznam.geometry.coordinates[1].toFixed(3)
                  ) {
                    zaznam.properties.Street = ul.properties.N_GM_U;
                  }
                });
              });
            });
            //adding isOnStop
            let distances = []
            let isOnStop
            zastavkyGPS.forEach((e) => {
              let distance = getDistance({ // vzdialenost zastavky od autobusu
                latitude: e.geometry.coordinates[1],
                longitude: e.geometry.coordinates[0]
              },
                {
                  latitude: zaznam.geometry.coordinates[1],
                  longitude: zaznam.geometry.coordinates[0]
                }, accuracy = 1) // v m
              if (distance < 10) {
                //console.log(distance)
                distances.push(distance)
              }
            });
            //console.log(distances.length)
            if (distances.length > 0)
              isOnStop = true;
            else
              isOnStop = false;

            zaznam.properties.isOnStop = isOnStop;
          });

          //console.log(filteredResult);

          // fs.writeFileSync(
          //   `./Data/MhdPO_json/MHD.json`,
          //   JSON.stringify(filteredResult)
          // );
          try {
            await axios.post(firstJsonUrl, filteredResult);
          } catch (error) {
            Sentry.captureException(error);
          }



          return await Promise.all(
            filteredResult.map((zaznam) => {
              console.log(zaznam);
              //axios.post(currentMhdPoBussesUrl, zaznam);
              try {
                axios.post(currentMhdPoBussesUrlElastic, zaznam);
              } catch (error) {
                Sentry.captureException(error);
              }
            })
          );
        }
      });
  }).catch(e => { Sentry.captureException(e); });
  transaction.finish();
}

setInterval(downloadMhdPO, 15000);
//downloadMhdPO();

module.exports = {
  downloadMhdPO,
};
