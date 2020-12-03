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
  let firstJson = await axios.get("http://localhost:9200/api/v1/currentMhdPoBusses/firstJSON/1");
  firstJson = firstJson.data
  console.log(firstJson)

    axios(config).then((response) => {
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
        .then(async(json) => {
          // currentExcel
          console.log(firstJson.lenght)
          if(firstJson.lenght ===undefined) {firstJson = json}
          let d = firstJson; // previosExcel
          let result = [];
          let time = new Date();
          let currentTime = time.getTime();
          let i = 0;
          json.forEach(() => {
            i = ++i;
          });

          //adding Change of Variation
          json.forEach((j) => {
            // currentExcel
            d.forEach((e) => {
              // previosExcel
              if (
                e["ROUTE_NUMBER"] === j["ROUTE_NUMBER"] &&
                e["DIRECTION"] === j["DIRECTION"] &&
                e["PLANNED_START"] === j["PLANNED_START"]
              ) {
                j["CHANGE_OF_Variation"] = e["VARIATION"] - j["VARIATION"];
                if (j["CHANGE_OF_Variation"] < 0) {
                  j["CHANGE_OF_Variation"] = -j["CHANGE_OF_Variation"];
                } else if (j["CHANGE_OF_Variation"] > 0) {
                  j["CHANGE_OF_Variation"] = -j["CHANGE_OF_Variation"];
                }
                result.push(j);
              } else {
                result.push(j);
              }
              // console.log("---------------------");
              // console.log(e["VARIATION"]);
              // console.log(j["VARIATION"]);
              // console.log(e["CHANGE_OF_Variation"]);
            });
          });
          let filteredResult = result.reduce((acc, current) => {
            const x = acc.find(
              (item) =>
                item.ROUTE_NUMBER === current.ROUTE_NUMBER &&
                item.DIRECTION === current.DIRECTION &&
                item.PLANNED_START === current.PLANNED_START
            );
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          // adding Street
          let streets = await axios.get("http://localhost:9200/api/v1/PresovStreets")
          filteredResult.map((zaznam) => {
            streets.data.features.forEach((ul) => {
              ul.geometry.coordinates.forEach((u) => {
                u.map((x) => {
                  if (
                    x[0].toFixed(3) === zaznam.LATITUDE.toFixed(3) &&
                    x[1].toFixed(3) === zaznam.LONGITUDE.toFixed(3)
                  ) {zaznam.Street = ul.properties.N_GM_U;}
                });
              });
            });
          });

          // adding count, type, Current Time 
          // Change to GEO JSON- normal lat and lot
          let count = 0;
          let finalResult = []
          filteredResult.map(async (x) => {
            let a  = {}
            let properties = {}
            let geometry = {}
            let coordinates = []

            properties.ROUTE_NUMBER = x.ROUTE_NUMBER
            properties.PLANNED_START =x.PLANNED_START
            properties.DIRECTION =x.DIRECTION
            properties.BUS_STOP_ORDER_NUM =x.BUS_STOP_ORDER_NUM
            properties.BUS_STOP_NAME_1 =x.BUS_STOP_NAME_1
            properties.BUS_STOP_NUM_1 =x.BUS_STOP_NUM_1
            properties.BUS_STOP_SUB_NUM_1 =x.BUS_STOP_SUB_NUM_1
            properties.BUS_STOP_NAME_2 = x.BUS_STOP_NAME_2
            properties.BUS_STOP_NUM_2 =x.BUS_STOP_NUM_2
            properties.BUS_STOP_SUB_NUM_2 = x.BUS_STOP_SUB_NUM_2
            properties.PLANNED_ROAD =x.PLANNED_ROAD
            properties.REAL_ROAD =x.REAL_ROAD
            properties.VARIATION =x.VARIATION
            if(x.CHANGE_OF_Variation)properties.CHANGE_OF_Variation =x.CHANGE_OF_Variation
            if(x.Street) properties.Street =x.Street
            properties.Order_In_Json_Id =++count
            properties.Type = "MHD"
            properties.Current_Time =currentTime
            a.properties = properties

            coordinates[0]= x.LATITUDE
            coordinates[1]= x.LONGITUDE
            geometry.coordinates = coordinates
            geometry.type = "Point"

            a.geometry = geometry
            a.type = "Feature"

            //console.log(a)
            //await axios.post("http://localhost:9200/api/v1/currentMhdPoBusses/", a);
            finalResult.push(a)
          });
           console.log(finalResult);
          // console.log(i);
          // console.log(count);

          // filteredResult.forEach(async(zaznam) =>{
          //   await axios.post("http://localhost:9200/api/v1/currentMhdPoBusses/", zaznam);
          // })
          await axios.post("http://localhost:9200/api/v1/currentMhdPoBusses/firstJSON/1", finalResult);
          //fs.writeFileSync(`./excel.json`, JSON.stringify(finalResult));
        });
      })
  }
      
      

//setInterval(downloadExcel, 1000);
downloadExcel();
module.exports = {
  downloadExcel,
};
