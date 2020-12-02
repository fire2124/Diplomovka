const fs = require("fs");
const date = new Date();
const imageDate = Date.parse(date);
const Collect = require('@supercharge/collections')

if (!fs.existsSync("Zastavky_Presov")) {
  fs.mkdirSync("Zastavky_Presov");
}
const readFiles = require("read-files-promise");

readFiles(
  [
    "./Zastavky_Presov/nearby/nearby.json",
    "./Zastavky_Presov/nearby/nearbyUbian.json",
    "./Zastavky_Presov/nearby/nearby Sidl2.json",
    "./Zastavky_Presov/nearby/nearbyFintice.json",
    "./Zastavky_Presov/nearby/nearbyHaniska.json",
    "./Zastavky_Presov/nearby/nearbyLubotice.json",
    "./Zastavky_Presov/nearby/nearbyMalySaris.json",
    "./Zastavky_Presov/nearby/nearbyMesto.json",
    "./Zastavky_Presov/nearby/nearbySebastova.json",
    "./Zastavky_Presov/nearby/nearbySidl2.json",
    "./Zastavky_Presov/nearby/nearbySidl3.json",
    "./Zastavky_Presov/nearby/nearbySidlovec.json",
    "./Zastavky_Presov/nearby/nearbySolivar.json",
    "./Zastavky_Presov/nearby/nearbyStrojnicka.json",
    "./Zastavky_Presov/nearby/nearbyTeriakovce.json",
    "./Zastavky_Presov/nearby/nearbyVelkySaris.json",
    "./Zastavky_Presov/nearby/nearbyVysnaSebastova.json",
  ],
  { encoding: "utf8" }
).then(async (buffers) => {
  let array = [];
  buffers.forEach((e) => {
    let data = JSON.parse(e);
    array.push(data["stops"]);
  });
  // const unique = [...new Set(array)];
  fs.writeFileSync(
    `./Zastavky_Presov/VSETKOSPOLU.json`,
    JSON.stringify(array)
  );

  i=0
  a=[]

  array.forEach((e) =>{
    e.forEach((x) =>{
      i=i+1
      a.push(x)
    })
  })
  console.log(i)

  const unique = await Collect(a).unique().all()

  iArray = 0;
  iArray2 = 0;
  iArray3 = 0;
  let mhd = [];
  let train = [];
  let bus = [];

  for (let zaznam of unique) {
    delete zaznam.latitude;
    delete zaznam.longitude;
    delete zaznam.iconName;
    delete zaznam.POIData;
    delete zaznam.subRegion;
    delete zaznam.forUrbanPublicTransport;
    delete zaznam.forBusTransport;
    delete zaznam.forRail;
    delete zaznam.stopRawName;
    delete zaznam.passingLines;

    if (zaznam.ezStopTypeName === "Navigation.StopType.Urban") {
      iArray = iArray + 1;
      mhd.push(zaznam);

    } else if (zaznam.ezStopTypeName === "Navigation.StopType.Train") {
      iArray2 = iArray2 + 1;
      train.push(zaznam);

    } else if (zaznam.ezStopTypeName === "Navigation.StopType.Bus") {
      iArray3 = iArray3 + 1;
      bus.push(zaznam);
    }
    
  }
  console.log("----------");
  console.log(iArray);
  console.log(iArray2);
  console.log(iArray3);
  console.log("----------");

  const filteredMHD = mhd.reduce((acc, current) => {
    const x = acc.find(item => item.stopID === current.stopID);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const filteredTrain = train.reduce((acc, current) => {
    const x = acc.find(item => item.stopID === current.stopID);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const filteredSadBus = bus.reduce((acc, current) => {
    const x = acc.find(item => item.stopID === current.stopID);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  console.log("----------");
  let q=0

  filteredMHD.forEach(e=>{
      q=q+1
      e.stopID=q
  })
  console.log(q)
  
  let w=0
  filteredTrain.forEach(e=>{
      w=w+1
      e.stopID=w
  })
  console.log(w)

  let r=0
  filteredSadBus.forEach(e=>{
      r=r+1
      e.stopID=r
  })
  console.log(r)
  console.log("----------");
  fs.writeFileSync(`./Zastavky_Presov/MhdZAS.json`, JSON.stringify(filteredMHD));
  fs.writeFileSync(`./Zastavky_Presov/TrainZAS.json`, JSON.stringify(filteredTrain));
  fs.writeFileSync(`./Zastavky_Presov/BusZAS.json`, JSON.stringify(filteredSadBus));
});
