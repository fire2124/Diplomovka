const { Client } = require("@elastic/elasticsearch");
const ElasticsearchScrollStream = require("elasticsearch-scroll-stream");
const fs = require("fs");
const elasticsearch_client = new Client({ node: "http://localhost:9200" });
const axios = require("axios");
const firstJsonUrl =
  "http://localhost:9500/api/v1/Select/";
// get lenght of elastic index
//   let lenghtOfElastic = await client.search({
//     index: "bst",
//     scroll: "10m",
//     body: {
//       from: 0,
//       size: 1,
//       query: {
//         match_all: {},
//       },
//     },
//   });
// Create index and add documents here...
const pageSizeFrom = "0";
//from: pageSizeFrom,
const pageSize = "10000";
let stopCounterIndex = parseInt(pageSize) + 200000;
let counter = 0;
let current_doc;
let finalResult = [];

const es_stream = new ElasticsearchScrollStream(
  elasticsearch_client,
  {
    index: "bst",
    scroll: "10m",
    
    size: pageSize,
    body: {
      _source: [
        "type",
        "geometry",
        "properties.CHANGE_OF_DELAY",
      ],
      query: {
        match_all: {},
      },
    },
  }
  //["_id", "_score"]
);

es_stream.on("data", function (data) {
  current_doc = JSON.parse(data.toString());
  if (counter == stopCounterIndex) {
    es_stream.close();
  }
  counter++;
  finalResult.push(current_doc);
});

es_stream.on("end", async function () {
  let obj = {};
  obj.type = "FeatureCollection";
  obj.name = "Meskania";
  obj.features = finalResult;
  fs.writeFileSync(`./Data/MhdPO_json/Nice.json`, JSON.stringify(obj));
  console.log(counter);


});

es_stream.on("error", function (err) {
  console.log(err);
});
