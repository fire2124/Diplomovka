const fs = require("fs");
const axios = require("axios");
const csv = require("csvtojson");
const config = {
  method: "get",
  url: "https://egov.presov.sk/geodatakatalog/dpmp.csv",
  headers: {
    encoding: "utf-8",
  },
};

async function downloadExcel() {
  let firstJson;
  firstJson = await axios.get(
    "http://localhost:9200/api/v1/currentMhdPoBusses/firstJSON/1"
  );
  firstJson = firstJson.data;
  axios(config).then(async (response) => {
    array = response.data;
    csv({
      noheader: false,
      delimiter: ";",
      checkType: true,
      encoding: "utf-8",
      headers: [
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
        "VEHICLE_NUMBER",
        "DATE_TIME",
      ],
    })
      .fromString(array)
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
          properties.BUS_STOP_NUM_1 = x.BUS_STOP_NUM_1;
          properties.BUS_STOP_SUB_NUM_1 = x.BUS_STOP_SUB_NUM_1;
          properties.BUS_STOP_NAME_2 = x.BUS_STOP_NAME_2;
          properties.BUS_STOP_NUM_2 = x.BUS_STOP_NUM_2;
          properties.BUS_STOP_SUB_NUM_2 = x.BUS_STOP_SUB_NUM_2;
          properties.PLANNED_ROAD = x.PLANNED_ROAD;
          properties.REAL_ROAD = x.REAL_ROAD;
          properties.VARIATION = x.VARIATION;
          if (x.CHANGE_OF_Variation)
            properties.CHANGE_OF_Variation = x.CHANGE_OF_Variation;
          if (x.Street) properties.Street = x.Street;
          properties.Order_In_Json_Id = ++count;
          properties.Type = "MHD";
          properties.Current_Time = currentTime;
          a.properties = properties;
          coordinates[0] = x.LONGITUDE;
          coordinates[1] =  x.LATITUDE;
          geometry.coordinates = coordinates;
          geometry.type = "Point";
          a.geometry = geometry;
          a.type = "Feature";
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
              item.properties.PLANNED_START === current.properties.PLANNED_START
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        // adding Street
        let streets = await axios.get(
          "http://localhost:9200/api/v1/PresovStreets"
        );
        filteredResult.map(async (zaznam) => {
          streets.data.features.forEach((ul) => {
            ul.geometry.coordinates.forEach((u) => {
              u.map((x) => {
                if (
                  x[0].toFixed(3) ===
                    zaznam.geometry.coordinates[0].toFixed(3) &&
                  x[1].toFixed(3) === zaznam.geometry.coordinates[1].toFixed(3)
                ) {
                  zaznam.properties.Street = ul.properties.N_GM_U;
                }
              });
            });
          });
          try {
            await axios.post(
              "http://localhost:9200/api/v1/currentMhdPoBusses/",
              zaznam
            );
          } catch (e) {
            console.log(e);
          }
        });

        await axios.post(
          "http://localhost:9200/api/v1/currentMhdPoBusses/firstJSON/1",
          filteredResult
        );
      });
  });
}

//setInterval(downloadExcel, 15000);
downloadExcel();
module.exports = {
  downloadExcel,
};
