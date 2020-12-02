const fs = require("fs");
const fetch = require("node-fetch");
const date = new Date();
const axios = require("axios");
const imageDate = Date.parse(date);
let request = require("request");


if (!fs.existsSync("./Data/MhdPO_json")) {
  fs.mkdirSync("./Data/MhdPO_json");
}

async function downloadMhdPO() {
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
      zaznam.OrderInJsonId = ++count;
      zaznam.Type = "MHD";
      zaznam.CurrentTime = currentTime;
      console.log(zaznam);
      //id = ++id
      //console.log(id);
      //await axios.post("http://localhost:3000/api/v1/currentMhdPoBusses/", zaznam);
      axios.post(`http://127.0.0.1:9200/mhdpo/_doc/`, zaznam);
    })
  );

  // await axios.put(`http://127.0.0.1:9200/mhdpo_currentindex/_doc/1`, {
  //   id: id,
  // });
  //console.log(array);
  // fs.writeFileSync(`./Data/MhdPO_json/${imageDate}.json`,JSON.stringify(array));
}

//setInterval(downloadMhdPO, 15000);
//downloadMhdPO().then(v => console.log(JSON.stringify(v)));
module.exports = {
  downloadMhdPO,
};
