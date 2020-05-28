const fs = require("fs");
const date = new Date();


if (!fs.existsSync("./Data/Trains_json")) {
    fs.mkdirSync("./Data/Trains_json");
}

async function download() {
    let request = require("request");
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

  await request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let json = body;
        let array = [];
        let a = {};
        let count = 0;
        let globalObject = json.result;
        let time = new Date();
        let currentTime= time.getTime();

        for (let zaznam of globalObject) {
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
                delete zaznam.Cas;
                delete zaznam.CasPlan;
                delete zaznam.MeskaTextColor
                let res= zaznam.Popis.split("->")
                zaznam.From = res[0].split(")")[1].substring(1,res[0].split(")")[1].length-1);              
                zaznam.To = res[1].split("(")[0].substring(1,res[1].split("(")[0].length-1);
                zaznam.CurrentTime=currentTime;
                zaznam.Type="Train";
                zaznam.Id= count;
                delete zaznam.Popis;
                delete zaznam.MeskaColor;
                //console.log(zaznam);
                array.push(zaznam);               
            }
        }
        //console.log(" ")
        //console.log(JSON.stringify(array))
        fs.writeFileSync(`./Data/Trains_json/${imageDate}.json`, JSON.stringify(array));
        //console.log(count)
    });
}
setInterval(download, 15000)



