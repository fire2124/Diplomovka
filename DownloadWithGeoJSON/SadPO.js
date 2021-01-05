const axios = require("axios");
let request = require("request");
let options = {
  method: "POST",
  url: "https://www.dispecing.info/TDWebAPI/api/GetOnlineData",
  headers: {
    "content-type": "application/json",
  },
  body: {
    login: "1007",
    heslo: "heslo",
  },
  json: true,
};
const presovStreetsUrl = "http://localhost:9500/api/v1/PresovStreets";
const firstJsonUrl =
  "http://localhost:9500/api/v1/currentSadPoBusses/firstJSON/1";
const currentSadPoUrl = "http://localhost:9500/api/v1/currentBst";
const currentSadPoUrlElastic = `http://127.0.0.1:9200/bst/_doc/`;

async function downloadSadPO() {
  let firstJson;
  firstJson = await axios.get(firstJsonUrl);
  firstJson = firstJson.data;

  let json = await new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) reject(error);
      else resolve(body);
      //console.log(body);
    });
  });
  //console.log(json);
  const zaznamy = json
    .map((zaznam) => {
      //adding from via to
      switch (true) {
        case zaznam.Line == 701402:
          zaznam.From = "Bardejov";
          zaznam.Via = "Beloveža - Hažlín - Ortuťová";
          zaznam.To = "Lipová";
          return zaznam;

        case zaznam.Line == 701404:
          zaznam.From = "Bardejov";
          zaznam.Via = "Kožany";
          zaznam.To = "Giraltovce";
          return zaznam;

        case zaznam.Line == 701406:
          zaznam.From = "Bardejov";
          zaznam.Via = "Poliakovce - Porúbka - Marhaň";
          zaznam.To = "Giraltovce";
          return zaznam;

        case zaznam.Line == 701407:
          zaznam.From = "Bardejov";
          zaznam.Via = "Lukavica - Rešov - N.Voľa - Dubie - Hankovce - Marhaň";
          zaznam.To = "Giraltovce";
          return zaznam;

        case zaznam.Line == 701411:
          zaznam.From = "Bardejov";
          zaznam.Via = "Lopúchov - Koprivnica";
          zaznam.To = "Dubie";
          return zaznam;

        case zaznam.Line == 701412:
          zaznam.From = "Bardejov";
          zaznam.Via = "Prešov";
          zaznam.To = "Košice";
          return zaznam;

        case zaznam.Line == 701414:
          zaznam.From = "Bardejov";
          zaznam.Via = "Šiba - Bartošovce - Hertník - Raslavice";
          zaznam.To = "Vaniškovce";
          return zaznam;

        case zaznam.Line == 701417:
          zaznam.From = "Bardejov";
          zaznam.Via = "Hervartov";
          zaznam.To = "Richvald";
          return zaznam;

        case zaznam.Line == 701418:
          zaznam.From = "Bardejov";
          zaznam.Via = "Kurov - Kružľov - Krivé/Bogliarka";
          zaznam.To = "Kríže";
          return zaznam;

        case zaznam.Line == 701419:
          zaznam.From = "Bardejov";
          zaznam.Via = "Snakov - Hrabské - Livov";
          zaznam.To = "Livovská Huta";
          return zaznam;

        case zaznam.Line == 701420:
          zaznam.From = "Bardejov";
          zaznam.Via = "";
          zaznam.To = "Lenartov";
          return zaznam;

        case zaznam.Line == 701423:
          zaznam.From = "Bardejov";
          zaznam.Via = "Zlaté";
          zaznam.To = "Cigeľka/Frička";
          return zaznam;

        case zaznam.Line == 701424:
          zaznam.From = "Bardejov";
          zaznam.Via = "Zlaté";
          zaznam.To = "Vyšný Tvarožec";
          return zaznam;

        case zaznam.Line == 701427:
          zaznam.From = "Bardejov";
          zaznam.Via = "Zborov - Stebnická Huta";
          zaznam.To = "Regetovka/Becherov";
          return zaznam;

        case zaznam.Line == 701428:
          zaznam.From = "Bardejov";
          zaznam.Via = "Jedlinka - Mikulášová";
          zaznam.To = "Ondavka";
          return zaznam;

        case zaznam.Line == 701429:
          zaznam.From = "Bardejov";
          zaznam.Via = "Svidník";
          zaznam.To = "Stropkov";
          return zaznam;

        case zaznam.Line == 701432:
          zaznam.From = "Bardejov";
          zaznam.Via = "Šarišské Čierne - Cernina";
          zaznam.To = "Dubová";
          return zaznam;

        case zaznam.Line == 707401:
          zaznam.From = "Prešov";
          zaznam.Via = "Abranovce";
          zaznam.To = "Zlatá Baňa";
          return zaznam;

        case zaznam.Line == 707403:
          zaznam.From = "Prešov";
          zaznam.Via = "Abranovce - Lesíček - Tuhrina";
          zaznam.To = "Červenica";
          return zaznam;

        case zaznam.Line == 707405:
          zaznam.From = "Prešov";
          zaznam.Via = "Žehňa - Brestov";
          zaznam.To = "Varhaňovce";
          return zaznam;

        case zaznam.Line == 707407:
          zaznam.From = "Prešov";
          zaznam.Via = "Drienov - Šarišské Bohdanovce - Brestov";
          zaznam.To = "Varhaňovce";
          return zaznam;

        case zaznam.Line == 707408:
          zaznam.From = "Prešov";
          zaznam.Via = "Drienov - Lemešany";
          zaznam.To = "Košice";
          return zaznam;

        case zaznam.Line == 707410:
          zaznam.From = "Prešov";
          zaznam.Via = "Lemešany";
          zaznam.To = "Košice";
          return zaznam;

        case zaznam.Line == 707416:
          zaznam.From = "Prešov";
          zaznam.Via = "Sedlice - Klenov";
          zaznam.To = "Margecany";
          return zaznam;

        case zaznam.Line == 707417:
          zaznam.From = "Prešov";
          zaznam.Via = "Brežany - Kvačany";
          zaznam.To = "Žipov";
          return zaznam;

        case zaznam.Line == 707418:
          zaznam.From = "Prešov";
          zaznam.Via = "Župčany";
          zaznam.To = "Kojatice";
          return zaznam;

        case zaznam.Line == 707419:
          zaznam.From = "Prešov";
          zaznam.Via = "Križovany - Ovčie - Víťaz";
          zaznam.To = "Široké";
          return zaznam;

        case zaznam.Line == 707421:
          zaznam.From = "Prešov";
          zaznam.Via = "Lipovce - Široké";
          zaznam.To = "Víťaz";
          return zaznam;

        case zaznam.Line == 707424:
          zaznam.From = "Prešov";
          zaznam.Via =
            "Jarovnice - Chminianska Nová Ves - Hermanovce - Štefanovce";
          zaznam.To = "Renčišov";
          return zaznam;

        case zaznam.Line == 707430:
          zaznam.From = "Prešov";
          zaznam.Via = "Medzany - Ostrovany - Uzovský Šalgov/Sabinov";
          zaznam.To = "Lipany";
          return zaznam;

        case zaznam.Line == 707431:
          zaznam.From = "Prešov";
          zaznam.Via = "Šarišské Michaľany - Sabinov - Lipany";
          zaznam.To = "Tichý Potok";
          return zaznam;

        case zaznam.Line == 707432:
          zaznam.From = "Prešov";
          zaznam.Via = "Stará Ľubovňa";
          zaznam.To = "Spišská Stará Ves / Podolínec";
          return zaznam;

        case zaznam.Line == 707435:
          zaznam.From = "Prešov";
          zaznam.Via = "Ratvaj";
          zaznam.To = "Jakubovany";
          return zaznam;

        case zaznam.Line == 707436:
          zaznam.From = "Prešov";
          zaznam.Via = "Uzovce - Ratvaj";
          zaznam.To = "Hubošovce";
          return zaznam;

        case zaznam.Line == 707437:
          zaznam.From = "Prešov";
          zaznam.Via = "Ratvaj - Terňa, Babin Potok";
          zaznam.To = "Závadka";
          return zaznam;

        case zaznam.Line == 707438:
          zaznam.From = "Prešov";
          zaznam.Via = "Fintice";
          zaznam.To = "Terňa, Hradisko/Veľký Slivník";
          return zaznam;

        case zaznam.Line == 707442:
          zaznam.From = "Prešov";
          zaznam.Via = "Okružná - Šarišská Poruba - Nemcovce";
          zaznam.To = "Chmeľov";
          return zaznam;

        case zaznam.Line == 707444:
          zaznam.From = "Prešov";
          zaznam.Via = "Čeľovce / Chmeľov";
          zaznam.To = "Giraltovce";
          return zaznam;

        case zaznam.Line == 707445:
          zaznam.From = "Prešov";
          zaznam.Via = "Chmeľov - Giraltovce - Fijaš - Domaša";
          zaznam.To = "Stropkov";
          return zaznam;

        case zaznam.Line == 707446:
          zaznam.From = "Prešov";
          zaznam.Via = "Hanušovce nad Topľou - Babie - Giraltovce";
          zaznam.To = "Stropkov";
          return zaznam;

        case zaznam.Line == 707447:
          zaznam.From = "Prešov";
          zaznam.Via = "Giraltovce - Svidník";
          zaznam.To = "Vyšný Komárnik";
          return zaznam;

        case zaznam.Line == 707448:
          zaznam.From = "Prešov";
          zaznam.Via = "Radvanovce - Pavlovce - Hanušovce nad Toplou";
          zaznam.To = "Ruská Voľa";
          return zaznam;

        case zaznam.Line == 707449:
          zaznam.From = "Prešov";
          zaznam.Via = "Vranov nad Topľou - Strážske - Humenné";
          zaznam.To = "Snina / Michalovce";
          return zaznam;

        case zaznam.Line == 707452:
          zaznam.From = "Prešov";
          zaznam.Via = "Vyšná Šebastová,Severná";
          zaznam.To = "Podhradík";
          return zaznam;

        case zaznam.Line == 708401:
          zaznam.From = "Lipany";
          zaznam.Via = "Lúčka";
          zaznam.To = "Potoky";
          return zaznam;

        case zaznam.Line == 708402:
          zaznam.From = "Lipany";
          zaznam.Via = "Rožkovany";
          zaznam.To = "Miľpoš";
          return zaznam;

        case zaznam.Line == 708403:
          zaznam.From = "Vyšný Slavkov / T.Potok";
          zaznam.Via = "Brezovica - Lipany - Prešov";
          zaznam.To = "Košice, U.S.Steel";
          return zaznam;

        case zaznam.Line == 708404:
          zaznam.From = "Lipany";
          zaznam.Via = "Dubovica";
          zaznam.To = "Ďačov";
          return zaznam;

        case zaznam.Line == 708411:
          zaznam.From = "Prešov";
          zaznam.Via = "Sabinov - Lipany - Oľšov - Poloma";
          zaznam.To = "Bajerovce";
          return zaznam;

        case zaznam.Line == 708412:
          zaznam.From = "Lipany";
          zaznam.Via = "Kamenica - Šarišské Jastrabie - Vislanka";
          zaznam.To = "Čirč";
          return zaznam;

        case zaznam.Line == 708452:
          zaznam.From = "Hanigovce";
          zaznam.Via = "Jakubova Voľa - Sabinov";
          zaznam.To = "Jakubovany";
          return zaznam;

        case zaznam.Line == 708453:
          zaznam.From = "Sabinov";
          zaznam.Via = "Jakubovany - Terňa";
          zaznam.To = "Veľký Slivník";
          return zaznam;

        case zaznam.Line == 708455:
          zaznam.From = "Sabinov";
          zaznam.Via = "";
          zaznam.To = "Drienica";
          return zaznam;

        case zaznam.Line == 708459:
          zaznam.From = "Sabinov / Prešov";
          zaznam.Via = "Široké - Krompachy";
          zaznam.To = "Spišská Nová Ves";
          return zaznam;

        case zaznam.Line == 708461:
          zaznam.From = "Sabinov";
          zaznam.Via = "Uzovský Šalgov - Renčišov";
          zaznam.To = "Hermanovce";
          return zaznam;

        case zaznam.Line == 708465:
          zaznam.From = "Sabinov";
          zaznam.Via = "Hubošovce - Gregorovce";
          zaznam.To = "Prešov";
          return zaznam;

        case zaznam.Line == 708468:
          zaznam.From = "Sabinov";
          zaznam.Via = "Červená Voda - Jakovany / Peč. N. Ves - Ľutina";
          zaznam.To = "Olejníkov";
          return zaznam;

        case zaznam.Line == 709451:
          zaznam.From = "Snina";
          zaznam.Via = "Humenné - Havaj";
          zaznam.To = "Stropkov";
          return zaznam;

        case zaznam.Line == 712451:
          zaznam.From = "Giraltovce";
          zaznam.Via = "Hanušovce nad Topľou - Bystré - Vranov";
          zaznam.To = "Michalovce";
          return zaznam;

        case zaznam.Line == 712452:
          zaznam.From = "Kalnište";
          zaznam.Via = "Giraltovce - Štefurov";
          zaznam.To = "Okrúhle";
          return zaznam;

        case zaznam.Line == 712453:
          zaznam.From = "Giraltovce";
          zaznam.Via = "Železník";
          zaznam.To = "Dukovce";
          return zaznam;

        case zaznam.Line == 712455:
          zaznam.From = "Giraltovce";
          zaznam.Via = "Marhaň - Vyšný Kručov - Lopúchov";
          zaznam.To = "Raslavice";
          return zaznam;

        case zaznam.Line == 712459:
          zaznam.From = "Giraltovce";
          zaznam.Via = "Koprivnica";
          zaznam.To = "Prešov";
          return zaznam;
      }
      return;
    })
    .filter((v) => v != undefined);

  //debugger
  let downloadResult = [];
  let d;
  let time = new Date();
  let currentTime = time.getTime();
  let count = 0;
  //console.log(zaznamy);
  zaznamy.map((x) => {
    //to GeoJSON
    let a = {};
    let properties = {};
    let geometry = {};
    let coordinates = [];

    coordinates[0] = x.Lng;
    coordinates[1] = x.Lat;
    geometry.type = "Point";
    geometry.coordinates = coordinates;
    // type of Geometry

    properties.Line = x.Line;
    properties.Trip = x.Trip;
    properties.Delay = x.Delay;
    properties.Dir = x.Dir;
    properties.TripTime = x.TripTime;
    if (x.From) properties.From = x.From;
    if (x.Via) properties.Via = x.Via;
    if (x.To) properties.To = x.To;
    properties.Type = "SAD";
    properties.Current_Time = currentTime;
    properties.Order_In_Json_Id = ++count;

    a.type = "Feature"; // type of all
    a.geometry = geometry;
    a.properties = properties;
    downloadResult.push(a);
  });
  if (firstJson == undefined || firstJson.length < 1) {
    //previosSad
    firstJson = downloadResult; //currentSad
    d = downloadResult;
    // console.log(firstJson)
    // console.log(d)
  } else {
    d = firstJson;
  }
  let result = [];
  downloadResult.forEach((j) => {
    d.forEach((e) => {
      if (
        e.properties["Line"] === j.properties["Line"] &&
        e.properties["Trip"] === j.properties["Trip"] &&
        e.properties["From"] === j.properties["From"] &&
        e.properties["To"] === j.properties["To"]
      ) {
        j.properties["CHANGE_OF_Delay"] = Math.abs(
          e.properties["Delay"] - j.properties["Delay"]
        );

        //new                               //old
        if (
          j.properties["Delay"] < e.properties["Delay"] &&
          j.properties["CHANGE_OF_Delay"] > 0
        ) {
          j.properties["CHANGE_OF_Delay"] = -j.properties["CHANGE_OF_Delay"];

          //new                               //old
        } else if (
          j.properties["Delay"] > e.properties["Delay"] &&
          j.properties["CHANGE_OF_Delay"] > 0
        ) {
          j.properties["CHANGE_OF_Delay"] = j.properties["CHANGE_OF_Delay"];

          //new                               //old
        } else if (
          j.properties["Delay"] < e.properties["Delay"] &&
          j.properties["CHANGE_OF_Delay"] < 0
        ) {
          j.properties["CHANGE_OF_Delay"] = -j.properties["CHANGE_OF_Delay"];

          //new                               //old
        } else if (
          j.properties["Delay"] > e.properties["Delay"] &&
          j.properties["CHANGE_OF_Delay"] < 0
        ) {
          j.properties["CHANGE_OF_Delay"] = j.properties["CHANGE_OF_Delay"];
        }
        //console.log("----------------------------------");
        //console.log("oldExcel " + e.properties["Delay"]);
        //console.log("newExcel " + j.properties["Delay"]);
        //console.log(j.properties["CHANGE_OF_Delay"]);
        result.push(j);
      } else {
        result.push(j);
      }
    });
  });

  //Filter
  let filteredResult = result.reduce((acc, current) => {
    const x = acc.find(
      (item) =>
        item.properties.Line === current.properties.Line &&
        item.properties.Trip === current.properties.Trip &&
        item.properties.From === current.properties.From &&
        item.properties.To === current.properties.To
    );
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  //console.log(filteredResult);
  // adding Street
  let streets = await axios.get(presovStreetsUrl);
  filteredResult.map(async (zaznam) => {
    streets.data.features.forEach((ul) => {
      ul.geometry.coordinates.forEach((u) => {
        u.map((x) => {
          if (
            x[0].toFixed(3) === zaznam.geometry.coordinates[0].toFixed(3) &&
            x[1].toFixed(3) === zaznam.geometry.coordinates[1].toFixed(3)
          ) {
            //console.log(zaznam)
            let Street = ul.properties.N_GM_U;
            zaznam.properties.Street = Street;
          }
        });
      });
    });
    
  });
  
  await axios.post(firstJsonUrl, filteredResult);

  return await Promise.all(
    filteredResult.map((zaznam) => {
      console.log(zaznam);
      axios.post(currentSadPoUrl, zaznam);
      axios.post(currentSadPoUrlElastic, zaznam);
    })
  );
}

setInterval(downloadSadPO, 15000);
//downloadSadPO()

module.exports = {
  downloadSadPO,
};
