const axios = require("axios");
const config = {
  method: "get",
  url:
    "https://www.ubian.sk/navigation/vehicles/nearby?lat=48.99835545200854&lng=21.238180698603646&radius=50&cityID=",
  headers: {},
};
const presovStreetsUrl = "http://localhost:9500/api/v1/PresovStreets";
const firstJsonUrl =
  "http://localhost:9500/api/v1/currentUbianBackup/firstJSON/1";
const currentUbianUrl = "http://localhost:9500/api/v1/currentBst";
const currentUbianUrlElastic = `http://127.0.0.1:9200/bst/_doc/`;

async function downloadUbian() {
  let firstJson;
  firstJson = await axios.get(firstJsonUrl);
  firstJson = firstJson.data;
  await axios(config)
    .then(async (response) => {
      let data = response.data.vehicles;
      let i = 0;
      let arraySadPO = [];
      let result = [];

      data.map(async (d) => {
        //filter SADPO
        if (d.timeTableTrip.timeTableLine.supervisorName === "SAD Prešov") {
          delete d.licenseNumber;
          delete d.timeTableTrip.bicycle;
          delete d.timeTableTrip.wifi;
          delete d.timeTableTrip.lowFloor;
          delete d.timeTableTrip.operatorID;
          delete d.timeTableTrip.messages;
          delete d.timeTableTrip.allowTicketPurchase;
          delete d.timeTableTrip.tripSigns;
          delete d.timeTableTrip.direction;
          delete d.timeTableTrip.tripDirectionHere;
          delete d.timeTableTrip.ezTripDirection;
          delete d.timeTableTrip.timeTableLine.ezIsTrain;
          delete d.timeTableTrip.timeTableLine.ezIsUrban;
          delete d.timeTableTrip.timeTableLine.ezIsBus;
          delete d.timeTableTrip.timeTableLine.firmaID;
          delete d.timeTableTrip.timeTableLine.ezTrainType;
          delete d.timeTableTrip.timeTableLine.ezTrainLabel;
          delete d.timeTableTrip.timeTableLine.lineName;
          arraySadPO.push(d);
          i = ++i;
        }
      });
      let count2 = 0;
      const zaznamy = arraySadPO
        .map((zaznam) => {
          count2 = ++count2;
          //adding From Via to
          switch (true) {
            case zaznam.timeTableTrip.timeTableLine.line == 701402:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Beloveža - Hažlín - Ortuťová";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701404:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Kožany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701406:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Poliakovce - Porúbka - Marhaň";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701407:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via =
                "Lukavica - Rešov - N.Voľa - Dubie - Hankovce - Marhaň";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701411:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Lopúchov - Koprivnica";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701412:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Prešov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701414:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via =
                "Šiba - Bartošovce - Hertník - Raslavice";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701417:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Hervartov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701418:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Kurov - Kružľov - Krivé/Bogliarka";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701419:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Snakov - Hrabské - Livov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701420:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701423:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Zlaté";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701424:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Zlaté";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701427:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Zborov - Stebnická Huta";

              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701428:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Jedlinka - Mikulášová";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701429:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Svidník";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701432:
              zaznam.timeTableTrip.From = "Bardejov";
              zaznam.timeTableTrip.Via = "Šarišské Čierne - Cernina";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707401:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Abranovce";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707403:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Abranovce - Lesíček - Tuhrina";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707405:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Žehňa - Brestov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707407:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via =
                "Drienov - Šarišské Bohdanovce - Brestov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707408:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Drienov - Lemešany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707410:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Lemešany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707416:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Sedlice - Klenov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707417:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Brežany - Kvačany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707418:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Župčany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707419:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Križovany - Ovčie - Víťaz";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707421:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Lipovce - Široké";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707424:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via =
                "Jarovnice - Chminianska Nová Ves - Hermanovce - Štefanovce";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707430:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via =
                "Medzany - Ostrovany - Uzovský Šalgov/Sabinov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707431:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via =
                "Šarišské Michaľany - Sabinov - Lipany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707432:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Stará Ľubovňa";

              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707435:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Ratvaj";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707436:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Uzovce - Ratvaj";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707437:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Ratvaj - Terňa, Babin Potok";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707438:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Fintice";

              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707442:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Okružná - Šarišská Poruba - Nemcovce";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707444:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Čeľovce / Chmeľov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707445:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via =
                "Chmeľov - Giraltovce - Fijaš - Domaša";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707446:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via =
                "Hanušovce nad topľou - Babie - Giraltovce";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707447:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Giraltovce - Svidník";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707448:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via =
                "Radvanovce - Pavlovce - Hanušovce nad toplou";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707449:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via =
                "Vranov nad topľou - Strážske - Humenné";

              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707452:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Vyšná Šebastová,Severná";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708401:
              zaznam.timeTableTrip.From = "Lipany";
              zaznam.timeTableTrip.Via = "Lúčka";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708402:
              zaznam.timeTableTrip.From = "Lipany";
              zaznam.timeTableTrip.Via = "Rožkovany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708403:
              zaznam.timeTableTrip.From = "Vyšný Slavkov / T.Potok";
              zaznam.timeTableTrip.Via = "Brezovica - Lipany - Prešov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708404:
              zaznam.timeTableTrip.From = "Lipany";
              zaznam.timeTableTrip.Via = "Dubovica";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708411:
              zaznam.timeTableTrip.From = "Prešov";
              zaznam.timeTableTrip.Via = "Sabinov - Lipany - Oľšov - Poloma";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708412:
              zaznam.timeTableTrip.From = "Lipany";
              zaznam.timeTableTrip.Via =
                "Kamenica - Šarišské Jastrabie - Vislanka";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708452:
              zaznam.timeTableTrip.From = "Hanigovce";
              zaznam.timeTableTrip.Via = "Jakubova Voľa - Sabinov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708453:
              zaznam.timeTableTrip.From = "Sabinov";
              zaznam.timeTableTrip.Via = "Jakubovany - Terňa";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708455:
              zaznam.timeTableTrip.From = "Sabinov";
              zaznam.timeTableTrip.Via = "";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708459:
              zaznam.timeTableTrip.From = "Sabinov / Prešov";
              zaznam.timeTableTrip.Via = "Široké - Krompachy";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708461:
              zaznam.timeTableTrip.From = "Sabinov";
              zaznam.timeTableTrip.Via = "Uzovský Šalgov - Renčišov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708465:
              zaznam.timeTableTrip.From = "Sabinov";
              zaznam.timeTableTrip.Via = "Hubošovce - Gregorovce";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708468:
              zaznam.timeTableTrip.From = "Sabinov";
              zaznam.timeTableTrip.Via =
                "Červená Voda - Jakovany / Peč. N. Ves - Ľutina";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 709451:
              zaznam.timeTableTrip.From = "Snina";
              zaznam.timeTableTrip.Via = "Humenné - Havaj";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 712451:
              zaznam.timeTableTrip.From = "Giraltovce";
              zaznam.timeTableTrip.Via =
                "Hanušovce nad topľou - Bystré - Vranov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 712452:
              zaznam.timeTableTrip.From = "Kalnište";
              zaznam.timeTableTrip.Via = "Giraltovce - Štefurov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 712453:
              zaznam.timeTableTrip.From = "Giraltovce";
              zaznam.timeTableTrip.Via = "Železník";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 712455:
              zaznam.timeTableTrip.From = "Giraltovce";
              zaznam.timeTableTrip.Via = "Marhaň - Vyšný Kručov - Lopúchov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 712459:
              zaznam.timeTableTrip.From = "Giraltovce";
              zaznam.timeTableTrip.Via = "Koprivnica";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 1:
              zaznam.timeTableTrip.From = "Tačevská";
              zaznam.timeTableTrip.Via = "Slovenská - Vinbarg - Ľ. Štúra";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 2:
              zaznam.timeTableTrip.From = "Družba";
              zaznam.timeTableTrip.Via = "Komenského - Slovenská";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 3:
              zaznam.timeTableTrip.From = "Dlhá Lúka";
              zaznam.timeTableTrip.Via = "Slovenská - Tačevská";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 4:
              zaznam.timeTableTrip.From = "Štefániková";
              zaznam.timeTableTrip.Via = "Dlhý Rad - Slovenská";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 5:
              zaznam.timeTableTrip.From = "Mihaľov";
              zaznam.timeTableTrip.Via = "Dlhý Rad - Slovenská - Duklianska";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 6:
              zaznam.timeTableTrip.From = "Poštárka";
              zaznam.timeTableTrip.Via = "Tačevská - Slovenská";
              return zaznam;
          }
          return;
        })
        .filter((v) => v != undefined);

      let d;
      let downloadResult = [];
      let time = new Date();
      let currentTime = time.getTime();
      let count = 0;
      zaznamy.map((x) => {
        //to GeoJSON
        let a = {};
        let properties = {};
        let geometry = {};
        let coordinates = [];
        a.type = "Feature"; // type of all

        coordinates[0] = x.longitude;
        coordinates[1] = x.latitude;
        geometry.coordinates = coordinates;
        geometry.type = "Point"; // type of Geometry
        a.geometry = geometry;

        properties.ROUTE_NUMBER = x.timeTableTrip.timeTableLine.lineNumber;
        properties.DELAY = x.delayMinutes * 60; // na sekundy;
        properties.Type = "UBIAN";
        properties.From = x.timeTableTrip.From;
        properties.Via = x.timeTableTrip.Via;
        //if (properties.Via === "") properties.Via = "-";
        properties.Order_In_Json_Id = ++count;
        properties.Current_Time = currentTime;
        properties.vehicleID = x.vehicleID;
        
        properties.lastCommunication = x.lastCommunication;
        properties.lastStopOrder = x.lastStopOrder;
        properties.isOnStop = x.isOnStop;
        properties.tooltip = x.tooltip;

        properties.trip = x.timeTableTrip.trip;
        properties.destination = x.timeTableTrip.destination;
        properties.destinationStopName = x.timeTableTrip.destinationStopName;
        properties.destinationCityName = x.timeTableTrip.destinationCityName;
        

        //properties.to = x.timeTableTrip.to;
        properties.lineID = x.timeTableTrip.timeTableLine.lineID;
        properties.lineType = x.timeTableTrip.timeTableLine.lineType;
        
        
        if (x.CHANGE_OF_DELAY)
          properties.CHANGE_OF_DELAY = x.CHANGE_OF_DELAY;
        if (x.Street) properties.Street = x.Street;
       
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
      //console.log(downloadResult);
      // console.log(count2);
      // console.log(i);
      downloadResult.forEach((j) => {
        d.forEach((e) => {
          if (
            e.properties["vehicleID"] === j.properties["vehicleID"] &&
            e.properties["destination"] === j.properties["destination"] &&
            e.properties["From"] === j.properties["From"] &&
            e.properties["Via"] === j.properties["Via"]
          ) {
            j.properties["CHANGE_OF_DELAY"] = Math.abs(
              e.properties["DELAY"] - j.properties["DELAY"]
            );

            //new                               //old
            if (
              j.properties["DELAY"] < e.properties["DELAY"] &&
              j.properties["CHANGE_OF_DELAY"] > 0
            ) {
              j.properties["CHANGE_OF_DELAY"] = -j.properties[
                "CHANGE_OF_DELAY"
              ];

              //new                               //old
            } else if (
              j.properties["DELAY"] > e.properties["DELAY"] &&
              j.properties["CHANGE_OF_DELAY"] > 0
            ) {
              j.properties["CHANGE_OF_DELAY"] =
                j.properties["CHANGE_OF_DELAY"];

              //new                               //old
            } else if (
              j.properties["DELAY"] < e.properties["DELAY"] &&
              j.properties["CHANGE_OF_DELAY"] < 0
            ) {
              j.properties["CHANGE_OF_DELAY"] = -j.properties[
                "CHANGE_OF_DELAY"
              ];

              //new                               //old
            } else if (
              j.properties["DELAY"] > e.properties["DELAY"] &&
              j.properties["CHANGE_OF_DELAY"] < 0
            ) {
              j.properties["CHANGE_OF_DELAY"] =
                j.properties["CHANGE_OF_DELAY"];
            }
            //console.log("----------------------------------");
            //console.log("oldExcel " + e.properties["DELAY"]);
            //console.log("newExcel " + j.properties["DELAY"]);
            //console.log(j.properties["CHANGE_OF_DELAY"]);
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
            item.properties.vehicleID === current.properties.vehicleID &&
            item.properties.destination === current.properties.destination &&
            item.properties.From === current.properties.From &&
            item.properties.Via === current.properties.Via
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
                let Street = ul.properties.N_GM_U;
                zaznam.properties.Street = Street;
              }
            });
          });
        });
      });
      try {
        await axios.post(firstJsonUrl, filteredResult);

        return await Promise.all(
          filteredResult.map((zaznam) => {
            axios.post(currentUbianUrl, zaznam);
            axios.post(currentUbianUrlElastic, zaznam);
            console.log(zaznam);
          })
        );
      } catch (error) {
        console.log(error);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

//setInterval(downloadUbian, 15000);
//downloadUbian();
module.exports = {
  downloadUbian,
};
