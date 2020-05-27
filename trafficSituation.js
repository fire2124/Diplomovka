const fs = require("fs");
const fetch = require("node-fetch");

if (!fs.existsSync("./Data")) {
    fs.mkdirSync("./Data");
}

function downloadTrafficSituation() {
    var request = require("request");

    var options = {
        method: 'GET',
        url: 'https://mhdpresov.sk/#/vyhladavanie/vsetky-zastavky',
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const date = new Date();
        const imageDate = Date.parse(date);

        console.log(body)
    });
}


setInterval(downloadTrafficSituation, 10000)
