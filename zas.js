const fs = require("fs");
const date = new Date();
const imageDate = Date.parse(date);

if (!fs.existsSync("Ubian")) {
  fs.mkdirSync("Ubian");
}

fs.readFile("./Ubian/nearbyUbian.json", (err, data) => {
  if (err) throw err;

  let busstop = JSON.parse(data);
  let itearableBusstop = busstop.stops;
  iArray = 0;
  iArray2 = 0;
  iArray3 = 0;

  let array = [];
  let train = [];
  let bus = [];

  // let itearableBusstop2 = [];
  // itearableBusstop.forEach((c) => {
  //   if (!itearableBusstop.includes(c)) {
  //     itearableBusstop2.push(c);
  //   }
  // });


  for (let zaznam of itearableBusstop) {
    console.log(zaznam);

    delete zaznam.latitude;
    delete zaznam.longitude;
    delete zaznam.iconName;
    delete zaznam.POIData;
    delete zaznam.subRegion;
    if (zaznam.ezStopTypeName === "Navigation.StopType.Urban") {
      iArray = iArray + 1;

      array.push(zaznam);
    }

    if (zaznam.ezStopTypeName === "Navigation.StopType.Train") {
      iArray2 = iArray2 + 1;
      train.push(zaznam);
    }

    if (zaznam.ezStopTypeName === "Navigation.StopType.Bus") {
      iArray3 = iArray3 + 1;
      bus.push(zaznam);
    }
  }
  console.log(iArray);
  console.log(iArray2);
  console.log(iArray3);
  fs.writeFileSync(`./Ubian/MhdZAS.json`, JSON.stringify(array));
  fs.writeFileSync(`./Ubian/TrainZAS.json`, JSON.stringify(train));
  fs.writeFileSync(`./Ubian/BusZAS.json`, JSON.stringify(bus));
});
