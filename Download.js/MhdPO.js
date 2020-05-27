const fs = require("fs");
const fetch = require("node-fetch");

if (!fs.existsSync("./Data/MhdPO_json")) {
  fs.mkdirSync("./Data/MhdPO_json");
}

const currentDate = new Date();

// const CONTROL_OLD_DATA = () => {
//   fs.readdirSync("./Data/MhdPO_json").forEach(json => {
//     if (json.includes(".json")) {
//       json = json.replace(".json", "");
//       const ms = Math.abs(currentDate - json);
//       const different = Math.floor(ms / 1000 / 60 / 60 / 24);
//       // Delete jsons with unkown naming
//       if (isNaN(different)) {
//         fs.unlinkSync("./Data/MhdPO_json" + json + ".json");
//         return;
//       }
//       // Delete jsons that are older then 1 days
//       //   if (different > 1) fs.unlinkSync("./MhdPO_json" + json + ".json");
//     } else {
//       // Delete jsons with unkown format
//       fs.unlinkSync("./Data/MhdPO_json" + json);
//     }
//   });
// };

const GET_RESPONSE = url => {
  return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(r => r.json())
    .catch(err => console.log(err));
};

const COMPARE_DATA = (JSON1, JSON2) => {
  //   // logika
  //   fs.readFile('./Index.html', function read(err, data) {
  //     if (err) {
  //         throw err;
  //     }
  //     content = data;

  //     // Invoke the next step here however you like
  //     console.log(content);   // Put all of the code here (not the best solution)
  //     processFile();          // Or put the next step in a function and invoke it
  // });
  //   JSON1=json
  //   JSON2=das

  //   if (JSON1===JSON2){
  //     GET_RESPONSE()

  //   }
}

const SAVE_ACTUAL_DATA = () => {
  GET_RESPONSE("https://mhdpresov.sk/getGPSBusses").then(res => {
    //   console.log(JSON.stringify(res));
    const date = new Date();
    const imageDate = Date.parse(date);
    // const DOWNLOADED_DATA = cez node js naloadujes file s response_json foldra
    // const IS_COMPARE = COMPARE_DATA(res, DOWNLOADED_DATA)
    // if(IS_COMPARE) {
      console.log(" ")
      console.log(JSON.stringify(res))
    fs.writeFileSync(`./Data/MhdPO_json/${imageDate}.json`, JSON.stringify(res));
    // }
  });
};
//runable in java frekvencia 

function start() {
  setTimeout(function () {
    //CONTROL_OLD_DATA();
    SAVE_ACTUAL_DATA();
    //start();
  }, 15000);
}

start()

