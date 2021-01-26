const axios = require("axios");
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
const firstJsonUrl = "http://localhost:9500/api/v1/currentTrains/firstJSON/1";
const currentTrainsUrl = "http://localhost:9500/api/v1/currentBst/";
const currentTrainsUrlElastic = `http://127.0.0.1:9200/bst/_doc/`;

async function downloadTrains() {
  let firstJson;
  firstJson = await axios.get(firstJsonUrl);
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
        coordinates[0] = zaznam.Position[1];
        coordinates[1] = zaznam.Position[0];
        geometry.coordinates = coordinates;
        geometry.type = "Point";
        a.geometry = geometry;
        properties.Nazov = zaznam.Nazov;
        properties.DELAY = zaznam.Meska * 60; // na sekundy;
        properties.MeskaText = zaznam.MeskaText;
        properties.Current_Stop = zaznam.InfoZoStanice;
        properties.Dopravca = zaznam.Dopravca;
        properties.Angle = zaznam.Angle;
        properties.Order_In_Station = zaznam.OrderInStation;
        if(zaznam.PotvrdenyOdj == true) { // odisiel zo zastavky
          properties.isOnStop = false;
        }
        else { // este je na zastavke
          properties.isOnStop = true;
        }
        
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
        properties.Type = "Train";
        a.properties = properties;

        return a;
      }
      return;
    })
    .filter((v) => v != undefined);

  if (firstJson == undefined || firstJson.length < 1) {
    //previosExcel
    d = zaznamy;
    // console.log(firstJson)
    // console.log(d)
  } else {
    d = firstJson;
  }

  let result = [];
  //adding Change of DELAY
  zaznamy.forEach((j) => {//currentExcel
    d.forEach((e) => {// previosExcel
      if (
        e.properties["Nazov"] === j.properties["Nazov"] &&
        e.properties["From"] === j.properties["From"] &&
        e.properties["To"] === j.properties["To"]
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
        //console.log("----------------------------------");
        //console.log("oldExcel " + e.properties["DELAY"]);
        //console.log("newExcel " + j.properties["DELAY"]);
        //console.log(j.properties["CHANGE_OF_DELAY"]);
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

  if (firstJson == undefined || firstJson.length < 1) {
    console.log("First");
    filteredResult.map((item) => {
      item.properties.Current_Time = currentTime;
    });

    await axios.post(firstJsonUrl, filteredResult);

    return await Promise.all(
      filteredResult.map((item) => {
        axios.post(currentTrainsUrl, item);
        //axios.post(currentTrainsUrlElastic, item);
        console.log(item);
      })
    );
  } else {
    // check if two array are egual
    firstJson.map((item) => {
      delete item.properties.Current_Time;     
    });
    console.log("----------")
    console.log(_.isEqual(filteredResult, firstJson));
    console.log("Trains")
    if (_.isEqual(filteredResult, firstJson) === false) {
      filteredResult.map((item) => {
        item.properties.Current_Time = currentTime;
      });

      await axios.post(firstJsonUrl, filteredResult);

      return await Promise.all(
        filteredResult.map((item) => {
          axios.post(currentTrainsUrl, item);
        // axios.post(currentTrainsUrlElastic, item);
          console.log(item);
        })
      );
    }
  }
}
//downloadTrains();
setInterval(downloadTrains, 15000);

module.exports = {
  downloadTrains,
};
