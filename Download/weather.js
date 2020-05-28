// weather Prešov
function downloadPO() {
  const fs = require("fs");
  const fetch = require("node-fetch");
  if (!fs.existsSync("./Data/weather/PO_json")) {
    fs.mkdirSync("./Data/weather/PO_json");
  }
  let request = require("request");
  let options = {
    method: "GET",
    url:
      "https://openweathermap.org/data/2.5/weather?id=723819&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02\n",
    headers: {},
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const date = new Date();
    const imageDate = Date.parse(date);
   // console.log(" ");
   // console.log(body);

     let array = [];   
     let globalObject= JSON.parse(body);
     //globalObject = globalObject.busses;
     let time = new Date();
     let currentTime= time.getTime();
     let count = 0;


      //console.log(globalObject);
       
        globalObject.Id = ++count;
        globalObject.Type="WeatherPO";
        globalObject.CurrentTime=currentTime;
        array.push(globalObject);               
     // console.log(array);
      
    fs.writeFileSync(
      `./Data/weather/PO_json/${imageDate}.json`,
      JSON.stringify(array)
    );
  });
}

setInterval(downloadPO, 15000);

// weather Kosice
function downloadKe() {
  const fs = require("fs");
  const fetch = require("node-fetch");
  if (!fs.existsSync("./Data/weather/KE_json")) {
    fs.mkdirSync("./Data/weather/KE_json");
  }
  let request = require("request");
  let options = {
    method: "GET",
    url:
      "https://openweathermap.org/data/2.5/weather?id=724443&units=metric&appid=439d4b804bc8187953eb36d2a8c26a02\n",
    headers: {},
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const date = new Date();
    const imageDate = Date.parse(date);
    //console.log(" ");
    //console.log(body);

     let array = [];   
     let globalObject= JSON.parse(body);
     //globalObject = globalObject.busses;
     let time = new Date();
     let currentTime= time.getTime();
     let count = 0;


     // console.log(globalObject);
     globalObject.Id = ++count;
     globalObject.Type="WeatherKE";
     globalObject.CurrentTime=currentTime;
     array.push(globalObject);                
      

    fs.writeFileSync(
      `./Data/weather/KE_json/${imageDate}.json`,
      JSON.stringify(array)
    );
  });
}
setInterval(downloadKe, 15000);
