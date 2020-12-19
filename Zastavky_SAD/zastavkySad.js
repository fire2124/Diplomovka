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
      "Názov zastávky",
      "Kód zastávky",
      "Správca zastávky",
      "Long",
      "Lat",
    ],
  })
    .fromString(data)
    .then((json) => {
      console.log(json);
      fs.writeFileSync(`./excel.json`, JSON.stringify(json));
    });
});
