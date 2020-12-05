const fs = require("fs");
const fetch = require("node-fetch");
const date = new Date();
const axios = require("axios");
const imageDate = Date.parse(date);
const request = require("request");
const _ = require("lodash");
const options = {
  method: "POST",
  url: "http://mapa.zsr.sk/json.rpc",
  body: {
    jsonrpc: "2.0",
    method: "GetTrainDelaySimple",
    params: [],
    id: 2,
  },
  json: true,
};

async function downloadTrains() {
  let firstJson;
  firstJson = await axios.get(
    "http://localhost:9200/api/v1/currentTrains/firstJSON/1"
  );
  firstJson = firstJson.data;

  let json = await new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) reject(error);
      else resolve(body);
    });
  });

  let count = 0;
  let globalObject = json.result;
  let time = new Date();
  let currentTime = time.getTime();
  //fs.writeFileSync(`./Data/Trains_json/${imageDate}.json`, JSON.stringify(body));
  const zaznamy = globalObject
    .map((zaznam) => {
      // stiahnutie -> filter na vychod -> GeoJSON
      let lon = zaznam.Position[1];
      if (lon >= 20.4595161) {
        let a = {};
        let properties = {};
        let geometry = {};
        let coordinates = [];
        a.type = "Feature";
        coordinates[0] = zaznam.Position[0];
        coordinates[1] = zaznam.Position[1];
        geometry.coordinates = coordinates;
        geometry.type = "Point";
        a.geometry = geometry;
        properties.Nazov = zaznam.Nazov;
        properties.Meska = zaznam.Meska * 60; // na sekundy;
        properties.MeskaText = zaznam.MeskaText;
        properties.Current_Stop = zaznam.InfoZoStanice;
        properties.Dopravca = zaznam.Dopravca;
        properties.Angle = zaznam.Angle;
        properties.Order_In_Station = zaznam.OrderInStation;
        properties.PotvrdenyOdj = zaznam.PotvrdenyOdj;
        let resC = zaznam.Cas.split(" ");
        properties.CasDay = resC[0];
        properties.CasTime = resC[1];
        let resCp = zaznam.CasPlan.split(" ");
        properties.CasPlanDay = resCp[0];
        properties.CasPlanTime = resCp[1];
        let res = zaznam.Popis.split("->");
        properties.From = res[0]
          .split(")")[1]
          .substring(1, res[0].split(")")[1].length - 1);
        properties.To = res[1]
          .split("(")[0]
          .substring(1, res[1].split("(")[0].length - 1);
        //properties.Current_Time = currentTime;
        properties.Type = "Train";
        properties.Order_In_JsonId = ++count;
        a.properties = properties;
        // if (.CHANGE_OF_Variation)
        //   properties.CHANGE_OF_Variation = x.CHANGE_OF_Variation;
        console.log(a);
        return a;
      }
      return;
    })
    .filter((v) => v != undefined);

  if (firstJson == undefined || firstJson.length < 1) {
    //previosExcel
    firstJson = zaznamy; //currentExcel
    d = zaznamy;
    // console.log(firstJson)
    // console.log(d)
  } else {
    d = firstJson;
  }

  let result = [];
  //adding Change of Variation
  zaznamy.forEach((j) => {
    //currentExcel
    d.forEach((e) => {
      // previosExcel
      if (
        e.properties["Nazov"] === j.properties["Nazov"] &&
        e.properties["From"] === j.properties["From"] &&
        e.properties["To"] === j.properties["To"]
      ) {
        j.properties["CHANGE_OF_Variation"] = Math.abs(
          e.properties["Meska"] - j.properties["Meska"]
        );

        //new                               //old
        if (
          j.properties["Meska"] < e.properties["Meska"] &&
          j.properties["CHANGE_OF_Variation"] > 0
        ) {
          j.properties["CHANGE_OF_Variation"] = -j.properties[
            "CHANGE_OF_Variation"
          ];

          //new                               //old
        } else if (
          j.properties["Meska"] > e.properties["Meska"] &&
          j.properties["CHANGE_OF_Variation"] > 0
        ) {
          j.properties["CHANGE_OF_Variation"] =
            j.properties["CHANGE_OF_Variation"];

          //new                               //old
        } else if (
          j.properties["Meska"] < e.properties["Meska"] &&
          j.properties["CHANGE_OF_Variation"] < 0
        ) {
          j.properties["CHANGE_OF_Variation"] = -j.properties[
            "CHANGE_OF_Variation"
          ];

          //new                               //old
        } else if (
          j.properties["Meska"] > e.properties["Meska"] &&
          j.properties["CHANGE_OF_Variation"] < 0
        ) {
          j.properties["CHANGE_OF_Variation"] =
            j.properties["CHANGE_OF_Variation"];
        }
        console.log("----------------------------------");
        console.log("oldExcel " + e.properties["Meska"]);
        console.log("newExcel " + j.properties["Meska"]);
        console.log(j.properties["CHANGE_OF_Variation"]);
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
        item.properties.Nazov === current.properties.Nazov &&
        item.properties.From === current.properties.From &&
        item.properties.To === current.properties.To &&
        item.properties.Dopravca === current.properties.Dopravca
    );
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  //debugger
  // return await Promise.all(zaznamy.map(zaznam=>
  //     axios.post(`http://127.0.0.1:9200/trains/_doc/`, zaznam)
  // ))

  if (firstJson == undefined || firstJson.length < 1) {
    filteredResult.forEach(async (item) => {
      item.properties.Current_Time = currentTime;
      await axios.post("http://localhost:9200/api/v1/currentTrains/", item);
    });
    await axios.post(
      "http://localhost:9200/api/v1/currentTrains/firstJSON/1",
      filteredResult
    );
  }
  // check if two array are eugle
  else {
    console.log(!_.isEqual(filteredResult, firstJson));

    firstJson.forEach(async (item) => {
      delete item.properties.Current_Time;
    });
    if (_.isEqual(filteredResult, firstJson)===false) {
      filteredResult.forEach(async (item) => {
        item.properties.Current_Time = currentTime;
        await axios.post("http://localhost:9200/api/v1/currentTrains/", item);
      });
      await axios.post(
        "http://localhost:9200/api/v1/currentTrains/firstJSON/1",
        filteredResult
      );
    }
  }
}
downloadTrains();
//setInterval(downloadTrains, 15000)
// downloadTrains().then(v=>
//     console.log(v))

module.exports = {
  downloadTrains,
};
