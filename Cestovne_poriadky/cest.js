const fs = require("fs");
object = {
  a: "1",
  b: "2",
  c: "4",
  d: "5",
  e: "7",
  f: "8",
  g: "10",
  h: "11",
  i: "12",
  j: "13",
  k: "14",
  l: "15",
  m: "17",
  n: "18",
  p: "19",
  q: "21",
  r: "22",
  s: "23",
  t: "24",
  u: "26",
  v: "27",
  w: "28",
  x: "29",
  y: "30",
  z: "32",
  A: "32A",
  B: "33",
  C: "34",
  D: "35",
  E: "36",
  F: "41",
  G: "42",
  H: "43",
  I: "44",
  J: "45",
  K: "46",
  L: "A",
  M: "C",
  N: "D",
  O: "E",
  Q: "F",
  P: "G",
  R: "H",
  S: "J",
  T: "K",
  U: "M",
  V: "N1",
  W: "N2",
  X: "P",
  Y: "S",
  Z: "T",
};

fs.readFile("./Cestovne_poriadky/cest.json", (err, data) => {
  if (err) console.log(err);
  data = JSON.parse(data);
  //console.log(data.links)

  i = data.length;
  // console.log(i)
  let array = [];

  for (const property in object) {
    let obj = {};

    //console.log(`${object[property]}`);
    obj.number = `${object[property]}`;
    if (data.links[`${object[property]}`].directions) {
      //console.log(data.links[`${object[property]}`].directions)
      let directions = [];

      if (data.links[`${object[property]}`].directions.length === 2) {
        // ak su dva smery

        let obj1 = {};
        let direction1 =
          data.links[`${object[property]}`].directions[0].direction;
        let station1 = data.links[`${object[property]}`].directions[0].stations;
        obj1.direction = direction1;
        obj1.stations = station1;
        for (const property in obj1.stations) {
            if(obj1.stations[`${property}`].prefixs)
            delete obj1.stations[`${property}`].prefixs;
            console.log(obj1.stations[`${property}`].name);
            console.log(obj1.stations[`${property}`].times);
        }
        directions.push(obj1);

        let obj2 = {};
        let direction2 =
          data.links[`${object[property]}`].directions[1].direction;
        let station2 = data.links[`${object[property]}`].directions[1].stations;
        obj2.direction = direction2;
        obj2.stations = station2;
        for (const property in obj2.stations) {
            try {
                
            } catch (error) {
                
            }
            if(obj2.stations[`${property}`].prefixs)
            delete obj2.stations[`${property}`].prefixs;
            console.log(obj2.stations[`${property}`].name);
            console.log(obj2.stations[`${property}`].times);
        }
        directions.push(obj2);
      } else {
        let obj1 = {};
        let direction1 =
          data.links[`${object[property]}`].directions[0].direction;
        let station1 = data.links[`${object[property]}`].directions[0].stations;
        obj1.direction = direction1;
        obj1.stations = station1;
        for (const property in obj1.stations) {
            if(obj1.stations[`${property}`].prefixs)
            delete obj1.stations[`${property}`].prefixs;
          console.log(obj1.stations[`${property}`].name);
          console.log(obj1.stations[`${property}`].times);
        }
        directions.push(obj1);
      }
      obj.directions = directions;
    }

    array.push(obj);
  }
  //console.log(array)
  fs.writeFileSync("./Cestovne_poriadky/cest_MHD_Final.json", JSON.stringify(array));
});
