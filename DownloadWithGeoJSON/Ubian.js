const axios = require("axios");
const config = {
  method: "get",
  url:
    "https://www.ubian.sk/navigation/vehicles/nearby?lat=48.99835545200854&lng=21.238180698603646&radius=50&cityID=",
  headers: {},
};

async function downloadUbian() {
  let firstJson;
  firstJson = await axios.get(
    "http://localhost:9200/api/v1/currentUbianBackup/firstJSON/1"
  );
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
          //adding from via to
          switch (true) {
            case zaznam.timeTableTrip.timeTableLine.line == 701402:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Beloveža - Hažlín - Ortuťová";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701404:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Kožany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701406:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Poliakovce - Porúbka - Marhaň";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701407:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via =
                "Lukavica - Rešov - N.Voľa - Dubie - Hankovce - Marhaň";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701411:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Lopúchov - Koprivnica";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701412:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Prešov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701414:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via =
                "Šiba - Bartošovce - Hertník - Raslavice";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701417:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Hervartov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701418:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Kurov - Kružľov - Krivé/Bogliarka";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701419:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Snakov - Hrabské - Livov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701420:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701423:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Zlaté";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701424:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Zlaté";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701427:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Zborov - Stebnická Huta";

              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701428:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Jedlinka - Mikulášová";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701429:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Svidník";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 701432:
              zaznam.timeTableTrip.from = "Bardejov";
              zaznam.timeTableTrip.via = "Šarišské Čierne - Cernina";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707401:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Abranovce";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707403:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Abranovce - Lesíček - Tuhrina";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707405:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Žehňa - Brestov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707407:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via =
                "Drienov - Šarišské Bohdanovce - Brestov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707408:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Drienov - Lemešany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707410:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Lemešany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707416:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Sedlice - Klenov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707417:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Brežany - Kvačany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707418:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Župčany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707419:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Križovany - Ovčie - Víťaz";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707421:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Lipovce - Široké";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707424:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via =
                "Jarovnice - Chminianska Nová Ves - Hermanovce - Štefanovce";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707430:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via =
                "Medzany - Ostrovany - Uzovský Šalgov/Sabinov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707431:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via =
                "Šarišské Michaľany - Sabinov - Lipany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707432:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Stará Ľubovňa";

              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707435:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Ratvaj";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707436:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Uzovce - Ratvaj";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707437:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Ratvaj - Terňa, Babin Potok";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707438:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Fintice";

              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707442:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Okružná - Šarišská Poruba - Nemcovce";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707444:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Čeľovce / Chmeľov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707445:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via =
                "Chmeľov - Giraltovce - Fijaš - Domaša";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707446:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via =
                "Hanušovce nad topľou - Babie - Giraltovce";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707447:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Giraltovce - Svidník";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707448:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via =
                "Radvanovce - Pavlovce - Hanušovce nad toplou";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707449:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via =
                "Vranov nad topľou - Strážske - Humenné";

              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 707452:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Vyšná Šebastová,Severná";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708401:
              zaznam.timeTableTrip.from = "Lipany";
              zaznam.timeTableTrip.via = "Lúčka";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708402:
              zaznam.timeTableTrip.from = "Lipany";
              zaznam.timeTableTrip.via = "Rožkovany";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708403:
              zaznam.timeTableTrip.from = "Vyšný Slavkov / T.Potok";
              zaznam.timeTableTrip.via = "Brezovica - Lipany - Prešov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708404:
              zaznam.timeTableTrip.from = "Lipany";
              zaznam.timeTableTrip.via = "Dubovica";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708411:
              zaznam.timeTableTrip.from = "Prešov";
              zaznam.timeTableTrip.via = "Sabinov - Lipany - Oľšov - Poloma";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708412:
              zaznam.timeTableTrip.from = "Lipany";
              zaznam.timeTableTrip.via =
                "Kamenica - Šarišské Jastrabie - Vislanka";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708452:
              zaznam.timeTableTrip.from = "Hanigovce";
              zaznam.timeTableTrip.via = "Jakubova Voľa - Sabinov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708453:
              zaznam.timeTableTrip.from = "Sabinov";
              zaznam.timeTableTrip.via = "Jakubovany - Terňa";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708455:
              zaznam.timeTableTrip.from = "Sabinov";
              zaznam.timeTableTrip.via = "";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708459:
              zaznam.timeTableTrip.from = "Sabinov / Prešov";
              zaznam.timeTableTrip.via = "Široké - Krompachy";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708461:
              zaznam.timeTableTrip.from = "Sabinov";
              zaznam.timeTableTrip.via = "Uzovský Šalgov - Renčišov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708465:
              zaznam.timeTableTrip.from = "Sabinov";
              zaznam.timeTableTrip.via = "Hubošovce - Gregorovce";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 708468:
              zaznam.timeTableTrip.from = "Sabinov";
              zaznam.timeTableTrip.via =
                "Červená Voda - Jakovany / Peč. N. Ves - Ľutina";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 709451:
              zaznam.timeTableTrip.from = "Snina";
              zaznam.timeTableTrip.via = "Humenné - Havaj";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 712451:
              zaznam.timeTableTrip.from = "Giraltovce";
              zaznam.timeTableTrip.via =
                "Hanušovce nad topľou - Bystré - Vranov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 712452:
              zaznam.timeTableTrip.from = "Kalnište";
              zaznam.timeTableTrip.via = "Giraltovce - Štefurov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 712453:
              zaznam.timeTableTrip.from = "Giraltovce";
              zaznam.timeTableTrip.via = "Železník";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 712455:
              zaznam.timeTableTrip.from = "Giraltovce";
              zaznam.timeTableTrip.via = "Marhaň - Vyšný Kručov - Lopúchov";
              return zaznam;

            case zaznam.timeTableTrip.timeTableLine.line == 712459:
              zaznam.timeTableTrip.from = "Giraltovce";
              zaznam.timeTableTrip.via = "Koprivnica";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 1:
              zaznam.timeTableTrip.from = "Tačevská";
              zaznam.timeTableTrip.via = "Slovenská - Vinbarg - Ľ. Štúra";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 2:
              zaznam.timeTableTrip.from = "Družba";
              zaznam.timeTableTrip.via = "Komenského - Slovenská";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 3:
              zaznam.timeTableTrip.from = "Dlhá Lúka";
              zaznam.timeTableTrip.via = "Slovenská - Tačevská";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 4:
              zaznam.timeTableTrip.from = "Štefániková";
              zaznam.timeTableTrip.via = "Dlhý Rad - Slovenská";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 5:
              zaznam.timeTableTrip.from = "Mihaľov";
              zaznam.timeTableTrip.via = "Dlhý Rad - Slovenská - Duklianska";
              return zaznam;
            case zaznam.timeTableTrip.timeTableLine.line == 6:
              zaznam.timeTableTrip.from = "Poštárka";
              zaznam.timeTableTrip.via = "Tačevská - Slovenská";
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
      zaznamy.map(async (x) => {
        //to GeoJSON
        let a = {};
        let properties = {};
        let geometry = {};
        let coordinates = [];
        a.type = "Feature"; // type of all

        coordinates[0] = x.latitude;
        coordinates[1] = x.longitude;
        geometry.coordinates = coordinates;
        geometry.type = "Point"; // type of Geometry
        a.geometry = geometry;

        properties.vehicleID = x.vehicleID;
        properties.delay = (x.delayMinutes)*60 // na sekundy;
        properties.lastCommunication = x.lastCommunication;
        properties.lastStopOrder = x.lastStopOrder;
        properties.isOnStop = x.isOnStop;
        properties.tooltip = x.tooltip;

        properties.trip = x.timeTableTrip.trip;
        properties.destination = x.timeTableTrip.destination;
        properties.destinationStopName = x.timeTableTrip.destinationStopName;
        properties.destinationCityName = x.timeTableTrip.destinationCityName;
        properties.from = x.timeTableTrip.from;
        properties.via = x.timeTableTrip.via;

        //properties.to = x.timeTableTrip.to;
        properties.lineID = x.timeTableTrip.timeTableLine.lineID;
        properties.lineType = x.timeTableTrip.timeTableLine.lineType;
        properties.type = "SAD";
        properties.lineNumber = x.timeTableTrip.timeTableLine.lineNumber;
        if (x.CHANGE_OF_Variation)
          properties.CHANGE_OF_Variation = x.CHANGE_OF_Variation;
        if (x.Street) properties.Street = x.Street;
        properties.Current_Time = currentTime;
        properties.Order_In_Json_Id = ++count;
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
            e.properties["from"] === j.properties["from"] &&
            e.properties["via"] === j.properties["via"]
          ) {
            j.properties["CHANGE_OF_Variation"] = Math.abs(
              e.properties["delay"] - j.properties["delay"]
            );

            //new                               //old
            if (
              j.properties["delay"] < e.properties["delay"] &&
              j.properties["CHANGE_OF_Variation"] > 0
            ) {
              j.properties["CHANGE_OF_Variation"] =
                -j.properties["CHANGE_OF_Variation"] ;

              //new                               //old
            } else if (
              j.properties["delay"] > e.properties["delay"] &&
              j.properties["CHANGE_OF_Variation"] > 0
            ) {
              j.properties["CHANGE_OF_Variation"] =
                j.properties["CHANGE_OF_Variation"] ;

              //new                               //old
            } else if (
              j.properties["delay"] < e.properties["delay"] &&
              j.properties["CHANGE_OF_Variation"] < 0
            ) {
              j.properties["CHANGE_OF_Variation"] =
                -j.properties["CHANGE_OF_Variation"] ;

              //new                               //old
            } else if (
              j.properties["delay"] > e.properties["delay"] &&
              j.properties["CHANGE_OF_Variation"] < 0
            ) {
              j.properties["CHANGE_OF_Variation"] =
                j.properties["CHANGE_OF_Variation"] ;
            }
            //console.log("----------------------------------");
            //console.log("oldExcel " + e.properties["delay"]);
            //console.log("newExcel " + j.properties["delay"]);
            //console.log(j.properties["CHANGE_OF_Variation"]);
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
            item.properties.from === current.properties.from &&
            item.properties.via === current.properties.via
        );
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      //console.log(filteredResult);
      // adding Street
      let streets = await axios.get(
        "http://localhost:9200/api/v1/PresovStreets"
      );
      filteredResult.map(async (zaznam) => {
        streets.data.features.forEach((ul) => {
          ul.geometry.coordinates.forEach((u) => {
            u.map((x) => {
              if (
                x[0].toFixed(3) === zaznam.geometry.coordinates[0].toFixed(3) &&
                x[1].toFixed(3) === zaznam.geometry.coordinates[1].toFixed(3)
              ) {
                zaznam.properties.Street = ul.properties.N_GM_U;
              }
            });
          });
        });
        try {
          await axios.post(
            "http://localhost:9200/api/v1/currentUbianBackup",
            zaznam
          );
        } catch (e) {
          console.log(e);
        }
      });
      console.log(downloadResult);
      await axios.post(
        "http://localhost:9200/api/v1/currentUbianBackup/firstJSON/1",
        downloadResult
      );
    })
    .catch(function (error) {
      console.log(error);
    });
}

//setInterval(downloadUbian, 5000);
downloadUbian();
module.exports = {
  downloadUbian,
};
