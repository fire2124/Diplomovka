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
          .fromString(array.toString("utf8"))
          .then((json) => {
            let d = JSON.parse(data);
            let result = [];
            json.forEach((j) => {
              d.forEach((e) => {
                  if (
                    e["ROUTE_NUMBER"] === j["ROUTE_NUMBER"] &&
                    e["DIRECTION"] === j["DIRECTION"] &&
                    e["PLANNED_START"] === j["PLANNED_START"] 
                  ) {
                    e["ChangeOFVariation"] = e["VARIATION"] - j["VARIATION"];
                    if (e["ChangeOFVariation"] < 0) {
                      e["ChangeOFVariation"] = -e["ChangeOFVariation"];
                      result.push(e);
                    } else if (e["ChangeOFVariation"] > 0) {
                      e["ChangeOFVariation"] = -e["ChangeOFVariation"];
                      result.push(e);
                    }
                     console.log("---------------------")
                     console.log(e["VARIATION"])
                     console.log(j["VARIATION"])
                     console.log(e["ChangeOFVariation"]);
                }
              });
            });
            const filteredResult = result.reduce((acc, current) => {
              const x = acc.find(
                (item) =>
                  item.ROUTE_NUMBER === current.ROUTE_NUMBER &&
                  item.DIRECTION === current.DIRECTION
              );
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);

            console.log(filteredResult);
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
