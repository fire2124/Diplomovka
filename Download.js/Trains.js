const fs = require("fs");
const date = new Date();
const imageDate = Date.parse(date);


if (!fs.existsSync("./Data/Trains_json")) {
    fs.mkdirSync("./Data/Trains_json");
}

function download() {
    var request = require("request");
    var options = {
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

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var json = body;
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
                res= zaznam.Popis.split("->")
                zaznam.From = res[0].split(")")[1];
                zaznam.To = res[1].split("(")[0];
                zaznam.CurrentTime=currentTime;
                zaznam.Type="Train";
                zaznam.Id= count;
                console.log(zaznam);
                array.push(zaznam);               
            }
        }
        console.log(" ")
        console.log(JSON.stringify(array))
        fs.writeFileSync(`./Data/Trains_json/${imageDate}.json`, JSON.stringify(array));
        console.log(count)
    });
}
setInterval(download, 1000)

setTimeout(function () {
    download();
  }, 15000);

