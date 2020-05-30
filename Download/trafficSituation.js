const fs = require("fs");
const fetch = require("node-fetch");

if (!fs.existsSync("./Data/TrafficSituation")) {
  fs.mkdirSync("./Data/TrafficSituation");
}

async function downloadTrafficSituation() {
  var request = require("request");
  var options = {
    method: "GET",
    url:
      "https://portal.minv.sk/wps/portal/domov/sluzby_pz/dopravne_krizove_situacie/!ut/p/a1/04_Sj9CPykssy0xPLMnMz0vMAfGjzOJNDJxdPby8DbzcQ_2MDRwtzQJdQ4ItjCyCDYEKIoEKnN0dPUzMfQwMDEwsjAw8XZw8XMwtfQ0MPM2I02-AAzgaENIfrh-FV4m3KVQBPieCFeBxQ0FuaIRBpqciANyVKis!/dl5/d5/L2dBISEvZ0FBIS9nQSEh/pw/Z7_40CEHJK0JGUN30A96QETS828Q4/res/id=QCPgetSituations/c=cacheLevelPage/=/?regionId=0&categories=ZD6%3BZD7%3BZD8%3BZD1%3BZD2%3BZD3%3BZD5&showPlanned=false\n",
    headers: {
      Cookie: "DigestTracker=AAABcmANZNU",
    },
  };

  await request(options, function (error, response, body) {
    if (error) throw new Error(error);
    const date = new Date();
    const imageDate = Date.parse(date);
    let bodyFinal = JSON.parse(body);

    let array = [];
    let arrayBefore = [];
    let count = 0;
    let time = new Date();
    let currentTime = time.getTime();
    bodyFinal = bodyFinal.situations;
    // fs.writeFileSync(
    //   `./Data/TrafficSituation/${imageDate}_before.json`,
    //   JSON.stringify(bodyFinal)
    // );
    let er = 0;

    bodyFinal.forEach((element) => {
      try {
        if (element.region.id === 7 || element.region.id === 8) {
          arrayBefore.push(element);
        }
      } catch (error) {}
    });

    fs.writeFileSync(
      `./Data/TrafficSituation/${imageDate}_before.json`,
      JSON.stringify(arrayBefore)
    );

    bodyFinal.forEach((element) => {
      try {
        if (
          element.region.id === 7 ||
          element.region.id === 8
          // element.region.name === "Košický kraj" ||
          // element.region.name === "Prešovský kraj"
        ) {
          element.Type = "Traffic";
          element.Current_Time = currentTime;
          element.district_ID = element.district.id;
          element.district_Name = element.district.name;
          element.district_AreaLevel = element.district.areaLevel;
          element.district_Parent_ID = element.district.parent.id;
          element.district_Parent_Name = element.district.parent.name;
          if (element.district.parent.extent) {
            let parentExtent = JSON.parse(element.district.parent.extent);
            element.district_Parent_Extent_XMIN = parentExtent.XMIN;
            element.district_Parent_Extent_XMAX = parentExtent.XMAX;
            element.district_Parent_Extent_YMIN = parentExtent.YMIN;
            element.district_Parent_Extent_YMAX = parentExtent.YMAX;
            element.district_Parent_Extent_SpatialReference_Wkid =
              parentExtent.spatialReference.wkid;
          }
          if (element.alternateRoute) {
            let alternate_route = JSON.parse(element.alternateRoute);
            const iterator = alternate_route.lines.values();

            for (const value of iterator) {
              const iterator2 = value.geometry.paths.values();
              for (const value2 of iterator2) {
                element.Alternate_Route_Lines_Geometry_paths = value2;
              }
            }
            const iterator3 = alternate_route.points.values();
            for (const value3 of iterator3) {
              element.Alternate_Route_Points_Geometry_X = value3.geometry.x;
              element.Alternate_Route_Points_Geometry_Y = value3.geometry.y;
            }
          }
          element.category_Code = element.category.code;
          element.category_Name = element.category.name;
          element.status_Code = element.status.code;
          element.status_Name = element.status.name;
          if (element.location) {
            let loc = JSON.parse(element.location);
            console.log(loc);

            //polygons
            if (loc.polygons) {
              const iterator6 = loc.poly.values();
              console.log(iterator6);              
              for (const value6 of iterator6) {
                element.Location_Polygons_Paths = value6.geometry;
              }
            }

            //lines
            if (loc.lines) {
              const iterator5 = loc.lines.values();
              console.log(iterator5);
              for (const value5 of iterator5) {
                element.Location_Lines_Paths = value5.geometry.paths;
              }
            }

            //points
            if (loc.points) {
              const iterator4 = loc.points.values();
              console.log(iterator4);             
              for (const value4 of iterator4) {
                element.Location_Poins_Geometry_X = value4.geometry.x;
                element.Location_Poins_Geometry_Y = value4.geometry.y;
              }
            }
          }

          delete element.alternateRoute;
          delete element.location;
          delete element.photosInfo;
          //delete element.id;
          //delete element.guid;
          delete element.region;
          delete element.district;
          delete element.category;
          delete element.status;
          array.push(element);
        }
      } catch (error) {
        // console.log(++er);
        // console.log(error)
      }
    });

    let count2 = 0;
    let array2 = [];
    for (let zaznam of array) {
      zaznam.OrderInJsonId = ++count2;
      //  console.log(count2);
      array2.push(zaznam);
    }
    fs.writeFileSync(
      `./Data/TrafficSituation/${imageDate}.json`,
      JSON.stringify(array2)
    );
  });
}

setInterval(downloadTrafficSituation, 15000);
