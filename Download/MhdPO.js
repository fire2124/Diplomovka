const fs = require("fs");
const fetch = require("node-fetch");
const date = new Date();

const imageDate = Date.parse(date);

if (!fs.existsSync("./Data/MhdPO_json")) {
  fs.mkdirSync("./Data/MhdPO_json");
}

async function downloadMhdPO() {

  let request = require('request');
  let options = {
    'method': 'GET',
    'url': 'https://mhdpresov.sk/getGPSBusses',
    'headers': {
    }
  };
 await request(options, function (error, response, body) { 
    if (error) throw new Error(error);
      
     let array = [];   
     let globalObject= JSON.parse(body);
     globalObject = globalObject.busses;
     let time = new Date();
     let currentTime= time.getTime();
     let count = 0;


     // console.log(globalObject);
      for (let zaznam of globalObject) {
        zaznam.Id = ++count;
        zaznam.Type="MHD";
        zaznam.CurrentTime=currentTime;
        array.push(zaznam);               
      }
      //console.log(array);
      
    
      fs.writeFileSync(`./Data/MhdPO_json/${imageDate}.json`,JSON.stringify(array));
  });
  

  
}

setInterval(downloadMhdPO, 1000);
