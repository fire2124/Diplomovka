let presovStopsMHD = require("../../Data/static/mhd_Stops_PO");
const fs = require("fs");

presovStopsMHD = presovStopsMHD.data.stations
let presovStopsMHD2 = []

for (let i = 1; i <= 447; i++) {
    try {
        console.log(presovStopsMHD[i])
        let obj = {}
        obj.type = "Feature"
        let geometry = {};
        geometry.type = "Point"
        let coordinates = []
        let lng = presovStopsMHD[i].lng
        let lat = presovStopsMHD[i].lat
        coordinates.push(lng, lat)
        geometry.coordinates = coordinates
        obj.geometry = geometry;
        let properties = {}
        properties.name = presovStopsMHD[i].name
        obj.properties = properties
        presovStopsMHD2.push(obj)
        console.log(obj)
    } catch (error) {
        console.log(error)
    }

}
let obj2 = {};
obj2.type = "FeatureCollection";
obj2.name = "Stops_Mhd_Presov";
obj2.features = presovStopsMHD2;

fs.writeFileSync(`./Data/static/mhd_Stops.json`, JSON.stringify(obj2));