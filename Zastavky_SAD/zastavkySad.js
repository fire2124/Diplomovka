const fs = require("fs");
const jschardet = require("jschardet")
var iconv = require('iconv-lite');
// fs.createReadStream('./Zastavky_SAD/ZastávkySAD.csv')
// .pipe(iconv.decodeStream('UTF-8',{addBOM: true}))
// .pipe(iconv.encodeStream('ISO-8859-1'))
// .pipe(fs.createWriteStream('excel.csv'));

const csv = require("csvtojson");
fs.readFile("./Zastavky_SAD/ZastávkySAD.csv", async (err, data) => {
  //console.log(err)
 

  let encoding = jschardet.detect(data)

  // console.log(encoding);
  // let str = iconv.decode(data, encoding.encoding);
  // let str2 = iconv.decodeStream('win1251')

 
  // console.log(str);
  data = data.toString();
  csv({
    noheader: false,
    delimiter: ";",
    checkType: true,
    //encoding: "UTF-8",
    headers: [
      "Názov_zastávky",
      "Kód_zastávky",
      "Správca_zastávky",
      "Long",
      "Lat",
    ],
  })
    .fromString(data)
    .then((json) => {
      console.log(json);
      let a = []
      json.map(param =>{
        let object = {}
        let geometry = {}
        let properties = {}
        let coordinates = []

         geometry.type = "Point"
         coordinates[0] = param.Long
         coordinates[1] = param.Lat
         geometry.coordinates = coordinates
         
         properties.Názov_zastávky = param.Názov_zastávky;
         properties.Kód_zastávky = param.Kód_zastávky;
         properties.Správca_zastávky = param.Správca_zastávky;

         object.type = "Feature"
         object.geometry = geometry;
         object.properties = properties;
         a.push(object)
      })
      fs.writeFileSync(`./Zastavky_SAD/Zastavky_SAD.json`, JSON.stringify(a));
    });
});
