const fs = require("fs");
const fetch = require("node-fetch");
const date = new Date();
const axios = require("axios");
const imageDate = Date.parse(date);
let request = require("request");

if (!fs.existsSync("./Data/MhdPO_json")) {
  fs.mkdirSync("./Data/MhdPO_json");
}

if (!fs.existsSync("./Ulice_Presov")) {
  fs.mkdirSync("./Ulice_Presov");
}

async function downloadMhdPO() {
  fs.readFile(
    "../Ulice_Presov/uliceFinal.json",
    async (err, data) => {
      if (err) throw err;

      let d = JSON.parse(data);
      let options = {
        method: "GET",
        url: "https://mhdpresov.sk/getGPSBusses",
        headers: {},
      };
      let json = await new Promise((resolve, reject) => {
        request(options, function (error, response, body) {
          if (error) reject(error);
          else resolve(body);
        });
      });
      let globalObject = JSON.parse(json);
      globalObject = globalObject.busses;
      let time = new Date();
      let currentTime = time.getTime();
      let count = 0;
      let id = 0;
      //debugger;
      return await Promise.all(
        globalObject.map((zaznam) => {
          d.features.forEach((ul) => {
            ul.geometry.coordinates.forEach((u) => {
              u.map((x) => {
                  if (
                    x[0].toFixed(3) === zaznam.lat.toFixed(3) &&
                    x[1].toFixed(3) === zaznam.lng.toFixed(3)
                  ) {
                    //console.log("FIX "+ x[0].toFixed(4), x[1].toFixed(4));
                    //console.log("ltd "+ zaznam.lat.toFixed(4), zaznam.lng.toFixed(4));
                    zaznam.street = ul.properties.N_GM_U
                  }
              });
            });
          });
          zaznam.OrderInJsonId = ++count;
          zaznam.Type = "MHD";
          zaznam.CurrentTime = currentTime;
          console.log(zaznam);
          //id = ++id
          //console.log(id);
          //await axios.post("http://localhost:3000/api/v1/currentMhdPoBusses/", zaznam);
          //axios.post(`http://127.0.0.1:9200/mhdpo/_doc/`, zaznam);
        })
      );
    }
  );
  // await axios.put(`http://127.0.0.1:9200/mhdpo_currentindex/_doc/1`, {
  //   id: id,
  // });
  //console.log(array);
  // fs.writeFileSync(`./Data/MhdPO_json/${imageDate}.json`,JSON.stringify(array));
}

//setInterval(downloadMhdPO, 15000);
downloadMhdPO().then((v) => console.log(JSON.stringify(v)));
module.exports = {
  downloadMhdPO,
};
