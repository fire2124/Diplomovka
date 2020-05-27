// weather Prešov
function downloadPO() {
    const fs = require("fs");
    const fetch = require("node-fetch");
    if (!fs.existsSync("./Data/weather/PO_json")) {
        fs.mkdirSync("./Data/weather/PO_json");
    }
    var request = require("request");
    var options = {
        method: 'GET',
        url: 'https://openweathermap.org/data/2.5/weather/',
        qs: {
            appid: 'b6907d289e10d714a6e88b30761fae22',
            id: '865085',
            units: 'metric',
            fbclid: 'IwAR1i91OiHSIlyC2PE-cb0d3zjSjC1eWYoWnaicFio6iSBzXEoAzK8lCuwVk'
        },
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const date = new Date();
        const imageDate = Date.parse(date);
        console.log(" ");
        console.log(body);
        fs.writeFileSync(`./Data/weather/PO_json/${imageDate}.json`, JSON.parse(JSON.stringify(body)));
        //console.log(body);
    });
}
module.exports = setInterval(downloadPO, 15000)



// weather Kosice
function downloadKe() {
    const fs = require("fs");
    const fetch = require("node-fetch");
    if (!fs.existsSync("./Data/weather/KE_json")) {
        fs.mkdirSync("./Data/weather/KE_json");
    }
    var request = require("request");
    var options = {
        method: 'GET',
        url: 'https://openweathermap.org/data/2.5/weather/',
        qs: {
            appid: 'b6907d289e10d714a6e88b30761fae22',
            id: '865084',
            units: 'metric'
        },
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const date = new Date();
        const imageDate = Date.parse(date);
        console.log(" ");
        console.log(body);
        fs.writeFileSync(`./Data/weather/KE_json/${imageDate}.json`, JSON.parse(JSON.stringify(body)));
    });
}
module.exports = setInterval(downloadKe, 15000);