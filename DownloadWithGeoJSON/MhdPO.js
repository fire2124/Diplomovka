const axios = require("axios");
const csv = require("csvtojson");
const OPTIONS = {
  method: "GET",
  hostname: "egov.presov.sk",
  path: "/geodatakatalog/dpmp.csv",
  headers: {},
  maxRedirects: 0,
};
const RESPONSE_ENCODING = "CP1250";
const https = require("follow-redirects").https;
const IconvLite = require("iconv-lite");
const firstJsonUrl =
  "http://localhost:9500/api/v1/currentMhdPoBusses/firstJSON/1";
const presovStreetUrl = "http://localhost:9500/api/v1/PresovStreets";
const currentMhdPoBussesUrl =
  "http://localhost:9500/api/v1/currentBst/";
const currentMhdPoBussesUrlElastic = `http://127.0.0.1:9200/bst/_doc/`;

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
          reject(e);
        }
      });

      res.on("error", (error) => {
        reject(error);
      });
    });
    req.end();
  });
};

async function downloadExcel() {
  let firstJson; //downloadPreviousJson
  firstJson = await axios.get(firstJsonUrl);
  firstJson = firstJson.data;
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
            properties.BUS_STOP_NAME_1 = x.BUS_STOP_NAME_1;
            // kontrola ci sa nachadza " *"
            if (properties.BUS_STOP_NAME_1.includes(" *")) {
              properties.BUS_STOP_NAME_1 = properties.BUS_STOP_NAME_1.split(
                " *"
              )[0];
              //kontrola medzier " "
              if (properties.BUS_STOP_NAME_1.slice(-1) === " ") {
                //console.log("StopName1");
                properties.BUS_STOP_NAME_1 = properties.BUS_STOP_NAME_1.slice(
                  0,
                  -1
                );
              }
              //kontrola ak je properties.BUS_STOP_NAME_1 prazdne
              if (properties.BUS_STOP_NAME_1 === "") {
                properties.BUS_STOP_NAME_1 = x.BUS_STOP_NAME_1.split(" *")[0];
              }
            }

            properties.BUS_STOP_NUM_1 = x.BUS_STOP_NUM_1;
            properties.BUS_STOP_SUB_NUM_1 = x.BUS_STOP_SUB_NUM_1;
            properties.BUS_STOP_NAME_2 = x.BUS_STOP_NAME_2;
            properties.BUS_STOP_NUM_2 = x.BUS_STOP_NUM_2;
            if (properties.BUS_STOP_NAME_2.includes(" *")) {
              properties.BUS_STOP_NAME_2 = properties.BUS_STOP_NAME_2.split(
                " *"
              )[0];
              //kontrola medzier " "
              if (properties.BUS_STOP_NAME_2.slice(-1) === " ") {
                //console.log("StopName2");
                properties.BUS_STOP_NAME_2 = properties.BUS_STOP_NAME_2.slice(
                  0,
                  -1
                );
              }
              //kontrola ak je properties.BUS_STOP_NAME_2 prazdne
              if (properties.BUS_STOP_NAME_2 === "") {
                properties.BUS_STOP_NAME_2 = x.BUS_STOP_NAME_2.split(" *")[0];
              }
            }
            properties.BUS_STOP_SUB_NUM_2 = x.BUS_STOP_SUB_NUM_2;
            properties.PLANNED_ROAD = x.PLANNED_ROAD;
            properties.REAL_ROAD = x.REAL_ROAD;
            properties.VARIATION = x.VARIATION;
            properties.VEHICLE_NUMBER = x.VEHICLE_NUMBER;
            if (x.CHANGE_OF_Variation)
              properties.CHANGE_OF_Variation = x.CHANGE_OF_Variation;
            if (x.Street) properties.Street = x.Street;
            properties.Order_In_Json_Id = ++count;
            properties.Type = "MHD";
            properties.Current_Time = currentTime;
            coordinates[0] = x.LONGITUDE;
            coordinates[1] = x.LATITUDE;
            geometry.coordinates = coordinates;
            geometry.type = "Point";
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

          //adding Change of Variation
          downloadResult.forEach((j) => {
            //currentExcel
            d.forEach((e) => {
              // previosExcel
              if (
                e.properties["ROUTE_NUMBER"] === j.properties["ROUTE_NUMBER"] &&
                e.properties["DIRECTION"] === j.properties["DIRECTION"] &&
                e.properties["PLANNED_START"] === j.properties["PLANNED_START"]
              ) {
                j.properties["CHANGE_OF_Variation"] = Math.abs(
                  e.properties["VARIATION"] - j.properties["VARIATION"]
                );

                //new                               //old
                if (
                  j.properties["VARIATION"] < e.properties["VARIATION"] &&
                  j.properties["CHANGE_OF_Variation"] > 0
                ) {
                  j.properties["CHANGE_OF_Variation"] = -j.properties[
                    "CHANGE_OF_Variation"
                  ];

                  //new                               //old
                } else if (
                  j.properties["VARIATION"] > e.properties["VARIATION"] &&
                  j.properties["CHANGE_OF_Variation"] > 0
                ) {
                  j.properties["CHANGE_OF_Variation"] =
                    j.properties["CHANGE_OF_Variation"];

                  //new                               //old
                } else if (
                  j.properties["VARIATION"] < e.properties["VARIATION"] &&
                  j.properties["CHANGE_OF_Variation"] < 0
                ) {
                  j.properties["CHANGE_OF_Variation"] = -j.properties[
                    "CHANGE_OF_Variation"
                  ];

                  //new                               //old
                } else if (
                  j.properties["VARIATION"] > e.properties["VARIATION"] &&
                  j.properties["CHANGE_OF_Variation"] < 0
                ) {
                  j.properties["CHANGE_OF_Variation"] =
                    j.properties["CHANGE_OF_Variation"];
                }
                // console.log("----------------------------------")
                // console.log("oldExcel "  + e.properties["VARIATION"])
                // console.log("newExcel "  +j.properties["VARIATION"])
                // console.log(j.properties["CHANGE_OF_Variation"])
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
          let streets = await axios.get(presovStreetUrl);
          filteredResult.map(async (zaznam) => {
            streets.data.features.forEach((ul) => {
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
          });
          
            await axios.post(firstJsonUrl, filteredResult);

            return await Promise.all(
              filteredResult.map((zaznam) => {
                console.log(zaznam);
                axios.post(currentMhdPoBussesUrl, zaznam);
                axios.post(currentMhdPoBussesUrlElastic, zaznam);
              })
            );
          
        }
      });
  });
}

setInterval(downloadExcel, 15000);
//downloadExcel();

module.exports = {
  downloadExcel,
};
