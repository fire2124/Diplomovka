//const Fs = require("fs");
//const CsvReadableStream = require("csv-reader");
//const AutoDetectDecoderStream = require("autodetect-decoder-stream");
//const csvSAD = require("./ZastávkySAD.csv");

// let inputStream = Fs.createReadStream(csvSAD).pipe(
//   new AutoDetectDecoderStream({ defaultEncoding: '1255' })
// ); // If failed to guess encoding, default to 1255

// // The AutoDetectDecoderStream will know if the stream is UTF8, windows-1255, windows-1252 etc.
// // It will pass a properly decoded data to the CsvReader.
// console.log(InputStream);
// inputStream
//   .pipe(
//     new CsvReadableStream({
//       parseNumbers: true,
//       delimiter: ";",
//       skipHeader: true,
//       asObject: true,
//       multiline: true,
//       parseBooleans: true,
//       trim: true,
//     })
//   )
//   .on("data", function (row) {
//     console.log("A row arrived: ", row);
//   })
//   .on("end", function (data) {
//     console.log("No more rows!");
//   });
const fs = require("fs");
const jschardet = require("jschardet")

const csv = require("csvtojson");
fs.readFile("./Zastavky_SAD/ZastávkySAD.csv", async (err, data) => {
  //console.log(err)
  let encoding = jschardet.detect(data,{ minimumThreshold: 0 })
  console.log(encoding);
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
    });
});
