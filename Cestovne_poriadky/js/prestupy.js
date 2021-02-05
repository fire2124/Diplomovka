const fs = require("fs");
let cest_MHD_final = require("./newLinksFinal.json");
let objOdkialKam = { odkial: "Pod Kamennou baňou", kam: "Sibírska" };
let MhdZAS = require("../Zastavky_Presov/MhdZAS.json")

  let kam = objOdkialKam["kam"];
  let odkial = objOdkialKam["odkial"];

  let array1 = [];
  let array2 = [];


  cest_MHD_final.map((obj) => {
      let o = {};
      let o2 = {};
      let zoznamZastávokKam = [];

      let object = obj["directions"][0].stations;
      if (object === odkial) {
        // odkial
        let zoznamZastávokOdkial = [];
        for (const property in object) {
          let zastavka = {};
           if (`${object[property].name}` === odkial) {
          console.log("odkial " + obj.number);

          zastavka.name = `${object[property].name}`;
          MhdZAS.map((e) => {
            // pre kazdu zastavku s gps
            if (`${object[property].name}`.includes(e.properties.stopName)) {
              zastavka.coordinates = e.geometry.coordinates;
              zoznamZastávokOdkial.push(zastavka);
            } // za predpokladu ze sa cely nazov rovna
            // zastavka s GPS

           // if(zoznamZastávokOdkial[zoznamZastávokOdkial.length - 1 ].name ===odkial) zoznamZastávokOdkial = null // ak je posledna zastavka tak to vymaz

            if (
              zoznamZastávokOdkial !== null &&
              `${object[property].name}` === odkial
            ) {
              let odkialIndex = zoznamZastávokOdkial.indexOf(odkial)
              console.log(odkialIndex)
              o.number = obj.number;
              o.odkial = odkial;
              o.zoznamZastávokOdkial = zoznamZastávokOdkial;
            }
          });
        }
       
        }
        //console.log("odkial " + "nie je potrebny prestup " + obj.number);
      } else {
        let zoznamZastávokOdkial = [];
        for (const property in object) {
          let zastavka = {};
          zastavka.name = `${object[property].name}`;
          MhdZAS.map((e) => {
            // pre kazdu zastavku s gps
            if (zastavka.name.includes(e.properties.stopName)){
              console.log(zastavka.name)
              zastavka.coordinates = e.geometry.coordinates;
              zoznamZastávokOdkial.push(zastavka);
            }        
          });
         
          //if(zoznamZastávokOdkial[zoznamZastávokOdkial.length - 1 ].name ===odkial) zoznamZastávokOdkial = null // ak je posledna zastavka tak to vymaz

          if (zoznamZastávokOdkial && `${object[property].name}` === odkial) {
            let odkialIndex = zoznamZastávokOdkial.indexOf(odkial)
            console.log(zoznamZastávokOdkial)
            console.log(odkialIndex +" "+ obj.number)
            o.number = obj.number;
            o.odkial = odkial;
            o.zoznamZastávokOdkial = zoznamZastávokOdkial;
          }
        }
        //console.log("odkial " + "nie je potrebny prestup " + obj.number);
      }

      if (obj["directions"][0].direction === kam) {
        // kam
        for (const property in object) {
          if (`${object[property].name}` === kam) {
            //console.log("kam " + obj.number);
          }
          zoznamZastávokKam.push(`${object[property].name}`);
          if (zoznamZastávokKam && `${object[property].name}` === kam) {
            o2.number = obj.number;
            o2.kam = kam;
            o2.zoznamZastávokKam = zoznamZastávokKam;
          }
        }

        //console.log("kam " + "nie je potrebny prestup " + obj.number);
      } else {
        for (const property in object) {
          if (`${object[property].name}` === kam) {
            //console.log("kam " + obj.number);
          }
          zoznamZastávokKam.push(`${object[property].name}`);
          if (zoznamZastávokKam && `${object[property].name}` === kam) {
            o2.number = obj.number;
            o2.kam = kam;
            o2.zoznamZastávokKam = zoznamZastávokKam;
          }
        }
      }

      array1.push(o, o2);
    });

    let filtered = array1.filter((o) => JSON.stringify(o) !== "{}");

    //console.log(filtered)
    fs.writeFileSync(
      "./Cestovne_poriadky/prestupy.json",
      JSON.stringify(filtered)
    );

    // let prestup  = []
    // let prestupNumber = []
    // filtered.map((f1) => {

    //   filtered2.map((f2) => {

    //       f1.zoznamZastávokOdkial.forEach(stop1=>{
    //           f2.zoznamZastávokKam.forEach(stop2=>{

    //               if (stop1 === odkial){
    //                   prestup.push(stop1,f2.number)
    //                   prestupNumber.push(stop1)
    //               }
    //               else if (stop2 === kam){
    //                   prestup.push(f1.number,f2.number)
    //                   prestupNumber.push(stop2)
    //               }

    //           })
    //       })
    //   })
    // })
    // prestup  = prestup.filter((value,index) => prestup.indexOf(value) === index)
    // prestupNumber  = prestupNumber.filter((value,index) => prestupNumber.indexOf(value) === index)

    //console.log(prestup)
    //console.log(prestupNumber)

