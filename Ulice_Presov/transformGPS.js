const proj4 = require("proj4");
var firstProjection =
  'PROJCS["S-JTSK_Krovak_East_North",GEOGCS["GCS_S_JTSK",DATUM["Jednotne_Trigonometricke_Site_Katastralni",SPHEROID["Bessel_1841",6377397.155,299.1528128]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Krovak"],PARAMETER["False_Easting",0],PARAMETER["False_Northing",0],PARAMETER["Pseudo_Standard_Parallel_1",78.5],PARAMETER["Scale_Factor",0.9999],PARAMETER["Azimuth",30.28813975277778],PARAMETER["Longitude_Of_Center",24.83333333333333],PARAMETER["Latitude_Of_Center",49.5],PARAMETER["X_Scale",-1],PARAMETER["Y_Scale",1],PARAMETER["XY_Plane_Rotation",90],UNIT["Meter",1],AUTHORITY["EPSG","102067"]]';
var secondProjection = "+proj=longlat +datum=WGS84 +no_defs ";
const axios = require("axios");

const fs = require("fs");
const date = new Date();
const imageDate = Date.parse(date);

if (!fs.existsSync("Ubian")) {
  fs.mkdirSync("Ubian");
}

fs.readFile("./Ulice_Presov/ulicePrešov-Long,Lat.json", (err, data) => {

  if (err) throw err;
  let d = JSON.parse(data);
  let newArray = [];
  d.features.forEach((ul) => {
    let newObj = {};
    newObj.type = ul.type;
    newObj.properties= ul.properties;
    let geometryNew = {};
    let array = [];
    ul.geometry.coordinates.forEach((u) => {
      //gps polia
      let gpsNew = [];
      u.forEach((v) => {
        let array = [];
        let gps = proj4(firstProjection).inverse(v);
        let lng = gps[0];
        let lat = gps[1];
        array.push(lng, lat);
        gpsNew.push(array);
         //GPS suradnice
      });
      array.push(gpsNew);
    });
    geometryNew.type = `${ul.geometry.type}`,
    geometryNew.coordinates = array;
    newObj.geometry = geometryNew;
    newArray.push(newObj)
  });
  //console.log(newArray)
  let a = {}
  console.log(d.type);
  a.type  = "FeatureCollection";
  a.name = "ulice";
  let crs ={}
  crs.type = "name";
  let properties = {}
  properties.name = "urn:ogc:def:crs:EPSG::102067"+` EPSG:INVERSE`
  crs.properties = properties
  a.crs = crs
  a.features = newArray;
  fs.writeFileSync(`./uliceFinal.json`, JSON.stringify(a));
  axios.post(`http://127.0.0.1:9200/presov_streets/_doc/1`,a)
});


