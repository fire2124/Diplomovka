const fs = require("fs");
const fetch = require("node-fetch");
const date = new Date();
const axios = require("axios");
const imageDate = Date.parse(date);
var request = require("request");

if (!fs.existsSync("./Data/TrafficSituation")) {
  fs.mkdirSync("./Data/TrafficSituation");
}

async function downloadTrafficSituation() {
  var options = {
    method: "GET",
    url:
      "https://portal.minv.sk/wps/portal/domov/sluzby_pz/dopravne_krizove_situacie/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOJNDJxdPby8DbzcQ_2MDRwtzQJdQ4ItjCyCDYEKIoEKnN0dPUzMfQwMDEwsjAw8XZw8XMwtfQ0MPM2I02-AAzgaENIfrh-FV4m3KVQBPieCFeBxQ0FuaIRBpqciANyVKis!/dl5/d5/L2dBISEvZ0FBIS9nQSEh/pw/Z7_40CEHJK0JGUN30A96QETS828Q4/res/id=QCPgetSituations/c=cacheLevelPage/=/?regionId=0&categories=ZD6%3BZD7%3BZD8%3BZD1%3BZD2%3BZD3%3BZD5&showPlanned=false\n",
    headers: {
      Cookie: "DigestTracker=AAABcmANZNU",
    },
  };

  let json = await new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) reject(error);
      else resolve(body);
    });
  });
  const date = new Date();
  const imageDate = Date.parse(date);
  let bodyFinal = JSON.parse(json);
  let time = new Date();
  let currentTime = time.getTime();
  bodyFinal = bodyFinal.situations;

  const zaznamy = bodyFinal
    .map((element) => {
      try {
        if (element.region.id === 7 || element.region.id === 8) {
          element.region_ID = element.region.id;
          element.region_name = element.region.name;
          element.Type = "Traffic";
          element.Current_Time = currentTime;
          element.district_ID = element.district.id;
          element.district_Name = element.district.name;
          element.district_AreaLevel = element.district.areaLevel;
          if (element.district_Parent_ID) {
            element.district_Parent_ID = element.district.parent.id;
            element.district_Parent_Name = element.district.parent.name;
          }

          //district_Parent_Extent -------------------------------------------------------------
          if (element.district.parent.extent) {
            let parentExtent = JSON.parse(element.district.parent.extent);
            element.district_Parent_Extent_XMIN = parentExtent.XMIN;
            element.district_Parent_Extent_XMAX = parentExtent.XMAX;
            element.district_Parent_Extent_YMIN = parentExtent.YMIN;
            element.district_Parent_Extent_YMAX = parentExtent.YMAX;
            element.district_Parent_Extent_SpatialReference_Wkid =
              parentExtent.spatialReference.wkid;
          }

          element.category_Code = element.category.code;
          element.category_Name = element.category.name;
          element.status_Code = element.status.code;
          element.status_Name = element.status.name;

          //Location -------------------------------------------------------------
          if (element.location) {
            let loc = JSON.parse(element.location);

            //polygons
            if (loc.polygons) {
              const iterator4 = loc.polygons.values();
              //console.log("polygon" + " " + iterator4);
              for (const value4 of iterator4) {
                const iterator5 = value4.geometry.rings.values();
                for (const value5 of iterator5) {
                  element.Location_Polygons_Paths_Rings = value5;
                }
              }
            }

            //lines
            if (loc.lines) {
              const iterator6 = loc.lines.values();
              for (const value7 of iterator6) {
                const iterator8 = value7.geometry.paths.values();
                for (const value8 of iterator8) {
                  element.Location_Lines_Paths = value8;
                }
              }
            }

            //points
            if (loc.points) {
              const iterator9 = loc.points.values();
              for (const value10 of iterator9) {
                element.Location_Points_Geometry_X = value10.geometry.x;
                element.Location_Points_Geometry_Y = value10.geometry.y;
              }
            }
          }

          //AlternateRoute -------------------------------------------------------------
          if (element.alternateRoute) {
            let alt = JSON.parse(element.alternateRoute);

            //polygons
            if (alt.polygons) {
              const iterator10 = alt.polygons.values();
              for (const value11 of iterator10) {
                const iterator12 = value11.geometry.rings.values();
                for (const value12 of iterator12) {
                  element.AlternateRoute_Polygons_Geometry_Paths_Rings = value12;
                }
              }
            }

            //lines
            if (alt.lines) {
              const iterator13 = alt.lines.values();
              for (const value13 of iterator13) {
                const iterator14 = value13.geometry.paths.values();
                for (const value14 of iterator14) {
                  element.AlternateRoute_Lines_Geometry_Paths = value14;
                }
              }
            }

            //points
            if (alt.points) {
              const iterator15 = alt.points.values();
              for (const value15 of iterator15) {
                element.AlternateRoute_Points_Geometry_X = value15.geometry.x;
                element.AlternateRoute_Points_Geometry_Y = value15.geometry.y;
              }
            }
          }
          if (element.houseNo) {
            const split = element.houseNo.split("/");
            element.houseNoFirst = split[0];
            element.houseNoSecond = split[1];
          }
          //Delete unused -------------------------------------------------------------
          delete element.houseNo;
          delete element.alternateRoute;
          delete element.location;
          delete element.photosInfo;
          //delete element.id;
          //delete element.guid;
          delete element.region;
          delete element.district;
          delete element.category;
          delete element.status;
          //console.log(element);
          return element;
        }
        return;
      } catch (error) {}
    })
    .filter((v) => v != undefined);

  let count2 = 0;

  return await Promise.all(
    zaznamy.map((element) => {
      element.OrderInJsonId = ++count2;
      //console.log(count2);
      //console.log(element)
      //axios.post("http://localhost:3000/api/v1/currentTraffic/", element);
      axios.post(`http://127.0.0.1:9200/traffic_situation/_doc/`, element);

      //array2.push(zaznam);
    })
  );
  // fs.writeFileSync(
  //   `./Data/TrafficSituation/${imageDate}.json`,
  //   JSON.stringify(array2)
  // );
}

//setInterval(downloadTrafficSituation, 15000);
//downloadTrafficSituation().then(v => console.log(v));

module.exports = {
  downloadTrafficSituation,
};