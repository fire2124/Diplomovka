const fs = require("fs");
const date = new Date();
const imageDate = Date.parse(date);

if (!fs.existsSync("./Data/Zastavky")) {
  fs.mkdirSync("./Data/Zastavky");
}

fs.readFile('zastavky1.json', (err, data) => {
    if (err) throw err;

    let busstop = JSON.parse(data);
    //console.log(busstop);
    let array = [];
    let array2=[];
    let dir=[]
     

    for (let [key, value] of Object.entries(busstop)) {
      //  console.log(`${key}: ${value}`);
        //console.log(element);
        array.push(value)
       // console.log(""); 
    }
    //console.log(array);
    

    for (let zaznam of array) {
        //console.log(zaznam.directions);
        delete zaznam.dayTypeEmpty;
        delete zaznam.marks;
        delete zaznam.dayTypeRef;
        delete zaznam.isSchool;
        delete zaznam.isNight;
        delete zaznam.dayTypeName;
        array2.push(zaznam);    
        dir.push(zaznam.directions)           
      }
    console.log(array2);
    console.log(dir);
    
    
    //( zaznam of busstop) {
            
        
        //array.push(zaznam);               
    //  }
      fs.writeFileSync(`./Data/Zastavky/MhdZAS.json`,JSON.stringify(array));

});