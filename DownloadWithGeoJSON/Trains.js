const fs = require("fs");
const fetch = require("node-fetch");
const date = new Date();
const axios = require("axios");
const imageDate = Date.parse(date);
let request = require("request");

if (!fs.existsSync("./Data/Trains_json")) {
    fs.mkdirSync("./Data/Trains_json");
}

async function downloadTrains() {
    let options = {
        method: 'POST',
        url: 'http://mapa.zsr.sk/json.rpc',
        body: {
            jsonrpc: '2.0',
            method: 'GetTrainDelaySimple',
            params: [],
            id: 2
        },
        json: true
    };
   let json = await new Promise((resolve, reject )=>{
        request(options, function (error, response, body) {
            if (error) reject(error);
            else resolve(body)
       
        })
    })
  
    let count = 0;
    let globalObject = json.result;
    let time = new Date();
    let currentTime= time.getTime();
    //fs.writeFileSync(`./Data/Trains_json/${imageDate}.json`, JSON.stringify(body));
    const zaznamy = globalObject.map(zaznam => {
        let lon = zaznam.Position[1];
        if (lon >= 20.4595161) {
            count++
            delete zaznam.Trasa;
            let resC= zaznam.Cas.split(" ");         
            zaznam.CasDay =resC[0]
            zaznam.CasTime = resC[1]
            let resCp= zaznam.CasPlan.split(" ")
            zaznam.CasPlanDay = resCp[0]
            zaznam.CasPlanTime = resCp[1]
            zaznam.Lat = zaznam.Position[0]
            zaznam.Lng = zaznam.Position[1]
            delete zaznam.Position;
            delete zaznam.Cas;
            delete zaznam.CasPlan;
            delete zaznam.MeskaTextColor
            let res= zaznam.Popis.split("->")
            zaznam.From = res[0].split(")")[1].substring(1,res[0].split(")")[1].length-1);              
            zaznam.To = res[1].split("(")[0].substring(1,res[1].split("(")[0].length-1);
            zaznam.CurrentTime=currentTime;
            zaznam.Type="Train";
            zaznam.OrderInJsonId= count;
          
            delete zaznam.Popis;
            delete zaznam.MeskaColor;
            console.log(zaznam);
            return zaznam;
             
        }
        return 
    })
    .filter(v=>v!=undefined)
    //debugger
    return await Promise.all(zaznamy.map(zaznam=>
        axios.post(`http://127.0.0.1:9200/trains/_doc/`, zaznam)
    ))
    
    //await axios.post("http://localhost:3000/api/v1/currentTrains/", zaznam);
}
//setInterval(downloadTrains, 15000)
// downloadTrains().then(v=>
//     console.log(v))

module.exports = {
    downloadTrains
  }
