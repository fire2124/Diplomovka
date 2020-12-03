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
  fs.readFile("./excel.json", async (err, data) => {
    if (err) throw err;
    let array = [];
    return new Promise(
      (resolve, reject) => {},
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
            let d = JSON.parse(data); // previosExcel
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
            let count = 0;
            filteredResult.forEach((x) => {
              x.Order_In_Json_Id = ++count;
              x.Type = "MHD";
              x.Current_Time = currentTime;
            });
            console.log(filteredResult);
            console.log(i);
            console.log(count);

            // filteredResult.forEach(async(zaznam) =>{
            //   await axios.post("http://localhost:9200/api/v1/currentMhdPoBusses/", zaznam);
            // })
            fs.writeFileSync(`./excel.json`, JSON.stringify(filteredResult));
          });
      })
    );
  });
}
// oldJson = await axios.get()
// console.log(oldJson)

//setInterval(downloadExcel, 1000);
downloadExcel();
module.exports = {
  downloadExcel,
};
