const fs = require("fs");
const fetch = require("node-fetch");

if (!fs.existsSync("./Data/TrafficSituation")) {
  fs.mkdirSync("./Data/TrafficSituation");
}

function downloadTrafficSituation() {
  var request = require("request");
  var options = {
    method: "GET",
    url:
      "https://portal.minv.sk/wps/portal/domov/sluzby_pz/dopravne_krizove_situacie/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOJNDJxdPby8DbzcQ_2MDRwtzQJdQ4ItjCyCDYEKIoEKnN0dPUzMfQwMDEwsjAw8XZw8XMwtfQ0MPM2I02-AAzgaENIfrh-FV4m3KVQBPieCFeBxQ0FuaIRBpqciANyVKis!/dl5/d5/L2dBISEvZ0FBIS9nQSEh/pw/Z7_40CEHJK0JGUN30A96QETS828Q4/res/id=QCPgetSituations/c=cacheLevelPage/=/?regionId=0&categories=ZD6%3BZD7%3BZD8%3BZD1%3BZD2%3BZD3%3BZD5&showPlanned=false\n",
    headers: {
      Cookie: "DigestTracker=AAABcmANZNU",
    },
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const date = new Date();
    const imageDate = Date.parse(date);
    let bodyFinal = JSON.parse(body);
    fs.writeFileSync(
      `./Data/TrafficSituation/${imageDate}_before.json`,
      JSON.stringify(bodyFinal)
    );
    let array = [];
    let count = 0;
    let time = new Date();
    let currentTime = time.getTime();
 
    bodyFinal.situations.forEach((element) => {
      try {
        if (
          element.district.parent.name === "Košický kraj" ||
          element.district.parent.name === "Prešovský kraj"
        ) {
          element.Id = ++count;
          element.Type = "Traffic";
          element.Current_Time = currentTime;
          element.district_ID = element.district.id;
          element.district_Name = element.district.name;
          element.district_AreaLevel = element.district.areaLevel;
          element.district_Parent_ID = element.district.parent.id;
          element.district_Parent_Name = element.district.parent.name;
          element.district_Parent_Extent = element.district.parent.extent;
          element.category_Code = element.category.code;
          element.category_Name = element.category.name;
          element.status_Code = element.status.code;
          element.status_Name = element.status.name;
          delete element.photosInfo;
          delete element.id;
          delete element.guid;
          delete element.region;
          delete element.district;
          delete element.category;
          delete element.status;
          array.push(element);
        }
      } catch (error) {}
    });
    //console.log(array);

     fs.writeFileSync(
       `./Data/TrafficSituation/${imageDate}.json`,
       JSON.stringify(array)
     );
  });
}

setInterval(downloadTrafficSituation, 15000);
