const fs = require("fs");
const date = new Date();
const imageDate = Date.parse(date);
const Collect = require("@supercharge/collections");
const proj4 = require("proj4");
let firstProjection = `PROJCS["WGS 84 / Pseudo-Mercator",
GEOGCS["Popular Visualisation CRS",
    DATUM["Popular_Visualisation_Datum",
        SPHEROID["Popular Visualisation Sphere",6378137,0,
            AUTHORITY["EPSG","7059"]],
        TOWGS84[0,0,0,0,0,0,0],
        AUTHORITY["EPSG","6055"]],
    PRIMEM["Greenwich",0,
        AUTHORITY["EPSG","8901"]],
    UNIT["degree",0.01745329251994328,
        AUTHORITY["EPSG","9122"]],
    AUTHORITY["EPSG","4055"]],
UNIT["metre",1,
    AUTHORITY["EPSG","9001"]],
PROJECTION["Mercator_1SP"],
PARAMETER["central_meridian",0],
PARAMETER["scale_factor",1],
PARAMETER["false_easting",0],
PARAMETER["false_northing",0],
AUTHORITY["EPSG","3785"],
AXIS["X",EAST],
AXIS["Y",NORTH]]
`;
var secondProjection = "+proj=longlat +datum=WGS84 +no_defs ";

if (!fs.existsSync("Zastavky_Presov")) {
  fs.mkdirSync("Zastavky_Presov");
}
const readFiles = require("read-files-promise");

readFiles(["./zastavky_SAD.json"], { encoding: "utf8" }).then(
  async (buffers) => {
    let data;
    let array = [];
    buffers.forEach((e) => {
      data = JSON.parse(e);
      data = data.features;
      let i = 0;
      data.map((e) => {
        //transform GPS
        if(e.geometry){
          let coordinatesOld = e.geometry.coordinates;
          if(coordinatesOld != null){
            
            let array2 = [];
            let gps = proj4(firstProjection).inverse(coordinatesOld);
            array2.push(gps[0], gps[1]);
            
            let geometry = {};
            let coordinates = [];
            geometry.coordinates = array2;
            (geometry.type = `${e.geometry.type}`), (e.geometry = geometry);
            //delete
            delete e.id;
            delete e.geometry_name;
            delete e.properties.existing;
            delete e.properties.ad_table;
            delete e.properties.bike_rack;
            delete e.properties.bin;
            delete e.properties.lights;
            delete e.properties.bench;
            delete e.properties.image5;
            delete e.properties.image4;
            delete e.properties.image3;
            delete e.properties.image2;
            delete e.properties.image1;
            delete e.properties.note;
            delete e.properties.parking;
            delete e.properties.elevation;
            delete e.properties.extravilan;
            delete e.properties.beaten_path;
            delete e.properties.gravel_path;
            delete e.properties.paved_path;
            delete e.properties.cyclo_path;
            delete e.properties.dirt_road;
            delete e.properties.mhd_mode;
            delete e.properties.bus_stop_space;
            delete e.properties.bus_stop_edge;
            delete e.properties.hygienie;
            delete e.properties.technical_con;
            delete e.properties.hor_signs;
            delete e.properties.shelter;
            delete e.properties.paved_road;
            delete e.properties.equipment;
            delete e.properties.validate;
            delete e.properties.fid;
            delete e.properties.validate;
            delete e.properties.bus_schedule;
            delete e.properties.code;
            let id = ++i;
    
            e.properties.id = id;
            array.push(e);}
          else return
        }
        
        
      });
    });
    console.log(array);
    fs.writeFileSync(`./Zas_SAD.json`, JSON.stringify(array));
  }
);
// const unique = [...new Set(array)];

//   i = 0;
//   a = [];

//   array.forEach((e) => {
//     e.forEach((x) => {
//       i = i + 1;
//       a.push(x);
//     });
//   });
//   console.log(i);

//   const unique = await Collect(a).unique().all();

//   iArray = 0;
//   iArray2 = 0;
//   iArray3 = 0;
//   let mhd = [];
//   let train = [];
//   let bus = [];

//   for (let zaznam of unique) {
//     delete zaznam.latitude;
//     delete zaznam.longitude;
//     delete zaznam.iconName;
//     delete zaznam.POIData;
//     delete zaznam.subRegion;
//     delete zaznam.forUrbanPublicTransport;
//     delete zaznam.forBusTransport;
//     delete zaznam.forRail;
//     delete zaznam.stopRawName;
//     delete zaznam.passingLines;

//     if (zaznam.ezStopTypeName === "Navigation.StopType.Urban") {
//       iArray = iArray + 1;
//       mhd.push(zaznam);
//     } else if (zaznam.ezStopTypeName === "Navigation.StopType.Train") {
//       iArray2 = iArray2 + 1;
//       train.push(zaznam);
//     } else if (zaznam.ezStopTypeName === "Navigation.StopType.Bus") {
//       iArray3 = iArray3 + 1;
//       bus.push(zaznam);
//     }
//   }
//   console.log("----------");
//   console.log(iArray);
//   console.log(iArray2);
//   console.log(iArray3);
//   console.log("----------");

//   const filteredMHD = mhd.reduce((acc, current) => {
//     const x = acc.find((item) => item.stopID === current.stopID);
//     if (!x) {
//       return acc.concat([current]);
//     } else {
//       return acc;
//     }
//   }, []);

//   const filteredTrain = train.reduce((acc, current) => {
//     const x = acc.find((item) => item.stopID === current.stopID);
//     if (!x) {
//       return acc.concat([current]);
//     } else {
//       return acc;
//     }
//   }, []);

//   const filteredSadBus = bus.reduce((acc, current) => {
//     const x = acc.find((item) => item.stopID === current.stopID);
//     if (!x) {
//       return acc.concat([current]);
//     } else {
//       return acc;
//     }
//   }, []);

//   console.log("----------");
//   let q = 0;

//   filteredMHD.forEach((e) => {
//     q = q + 1;
//     e.stopID = q;
//   });
//   console.log(q);

//   let w = 0;
//   filteredTrain.forEach((e) => {
//     w = w + 1;
//     e.stopID = w;
//   });
//   console.log(w);

//   let r = 0;
//   filteredSadBus.forEach((e) => {
//     r = r + 1;
//     e.stopID = r;
//   });
//   console.log(r);
//   console.log("----------");

//   result = [];
//   filteredMHD.map((e) => {
//     //console.log(e)
//     let a = {};
//     let geometry = {};
//     let properties = {};

//     if (e.platforms[1]) {
//       //two platforms
//       let coordinates = [];
//       coordinates[0] = e.platforms[0].longitude;
//       coordinates[1] = e.platforms[1].latitude;
//       geometry.type = "Point";
//       geometry.coordinates = coordinates;
//     } else {
//       let coordinates = [];
//       coordinates[0] = e.platforms[0].longitude;
//       coordinates[1] = e.platforms[0].latitude;
//       geometry.type = "Point";
//       geometry.coordinates = coordinates;
//     }
//     properties.stopID = e.stopID;
//     properties.stopName = e.stopName;
//     properties.stopCity = e.stopCity;
//     properties.passingLines = e.ezLines;
//     properties.description = e.platforms[0].tooltip;

//     a.type = "Feature";
//     a.geometry = geometry;
//     a.properties = properties;
//     result.push(a);
//   });

//   resultTrain = [];

//   filteredTrain.map((e) => {
//     //console.log(e)
//     let a = {};
//     let geometry = {};
//     let properties = {};
//     let coordinates = [];
//     coordinates[0] = e.platforms[0].longitude;
//     coordinates[1] = e.platforms[0].latitude;
//     geometry.type = "Point";
//     geometry.coordinates = coordinates;

//     properties.stopID = e.stopID;
//     properties.stopName = e.stopName;
//     properties.stopCity = e.stopCity;
//     properties.passingLines = e.ezLines;
//     properties.description = e.platforms[0].tooltip;

//     a.type = "Feature";
//     a.geometry = geometry;
//     a.properties = properties;
//     resultTrain.push(a);
//   });

//   fs.writeFileSync(`./Zastavky_Presov/MhdZAS.json`, JSON.stringify(result));
//   fs.writeFileSync(
//     `./Zastavky_Presov/TrainZAS.json`,
//     JSON.stringify(resultTrain)
//   );
//   fs.writeFileSync(
//     `./Zastavky_Presov/BusZAS.json`,
//     JSON.stringify(filteredSadBus)
//   );
// });
