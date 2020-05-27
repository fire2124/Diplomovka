const request=require('request')
const csv=require('csvtojson')
let onError
let onComplete
 const fs = require("fs")

        const date = new Date();
        const imageDate = Date.parse(date)

csv()
.fromStream(request.get('https://egov.presov.sk/geodatakatalog/dpmp.csv'))
.subscribe((json)=>{
    return new Promise((resolve,reject)=>{
            resolve
            reject
    
             console.log(json)
       fs.writeFileSync(`./Data/SadPO_json/${imageDate}.json`, JSON.stringify(json))
        //console.log(json)
        // long operation for each json e.g. transform / write into database.
    })
   
},onError,onComplete);


 

 