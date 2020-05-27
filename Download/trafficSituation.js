const fs = require("fs");
const fetch = require("node-fetch");

if (!fs.existsSync("./Data/TrafficSituation")) {
    fs.mkdirSync("./Data/TrafficSituation");
}

function downloadTrafficSituation() {
    var request = require("request");

    var options = {
        method: 'GET',
        url: 'https://portal.minv.sk/wps/portal/domov/sluzby_pz/dopravne_krizove_situacie/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOJNDJxdPby8DbzcQ_2MDRwtzQJdQ4ItjCyCDYEKIoEKnN0dPUzMfQwMDEwsjAw8XZw8XMwtfQ0MPM2I02-AAzgaENIfrh-FV4m3KVQBPieCFeBxQ0FuaIRBpqciANyVKis!/dl5/d5/L2dBISEvZ0FBIS9nQSEh/pw/Z7_40CEHJK0JGUN30A96QETS828Q4/res/id=QCPgetSituations/c=cacheLevelPage/=/?regionId=0&categories=ZD6%3BZD7%3BZD8%3BZD1%3BZD2%3BZD3%3BZD5&showPlanned=false',
        qs: {
            regionId: '0',
            categories: 'ZD6;ZD7;ZD8;ZD1;ZD2;ZD3;ZD5',
            showPlanned: 'false',
            fbclid: 'IwAR3J1JZWD2eAWA--cwVMkiPzMvrrzJYQkP7F5ExcaT6whpedKi8NkCu0ATE'
        },
        json: true
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const date = new Date();
        const imageDate = Date.parse(date);

        Object.size = function (obj) {
            var size = 0,
                key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
        };

        // Get the size of an object
        var size = Object.size(body.situations);
        console.log(size)
        let numbers=0;
        let array = [];
        let globalObject = {};
        for (let i = 0; i < size; i++) {
    
           try {
                console.log(i)
                console.log(body.situations[i].district.parent.name)
                if ((body.situations[i].district.parent.name === "Košický kraj") ||
                (body.situations[i].district.parent.name === "Prešovský kraj")) {
                array.push(body.situations[i]);
                numbers++;
            }
           } catch (error) {  
           }     
        }
        console.log(array)
        fs.writeFileSync(`./Data/TrafficSituation/${imageDate}.json`, JSON.stringify(array));
        console.log(numbers)
    });
}


setInterval(downloadTrafficSituation, 10000)
