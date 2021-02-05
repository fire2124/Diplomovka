const fs = require("fs");
let mhd_Poriadky = require("../json/newLinksFinal.json");
let road = { odkial: "Pod Kamennou baňou", kam: "Sibírska" };
let mhd_ZAS = require("../../Zastavky_Presov/MhdZAS.json")
const _ = require('lodash');

let kam = road.kam;
let odkial = road.odkial;

mhd_Poriadky.map(e => {// pre kazdy spoj
    let obj = {};
    let o2 = {};
    let zoznamZastávokKam = [];
    e.directions.map(i => { // pre kazdy smer
        let objectZas = i.stations;
        if (objectZas === odkial) {
            console.log("nasiel si 1. zastavku")
        } else {
            let zoznam_Zastavok_Odkial = [];
            for (const property in objectZas) {
                let zastavka = {};
                zastavka.name = `${objectZas[property].name}`;
                mhd_ZAS.map((e) => {
                    // pre kazdu zastavku s gps
                    if (zastavka.name.includes(e.properties.stopName)) {
                        let odkialIndex = zoznam_Zastavok_Odkial.indexOf(odkial)
                        zastavka.coordinates = e.geometry.coordinates;
                        zoznam_Zastavok_Odkial.push(zastavka);
                    }
                });

                if (zoznam_Zastavok_Odkial && zastavka.name === odkial) {

                    obj.number = e.number;
                    obj.odkial = odkial;
                    obj.zoznam_Zastavok_Odkial = zoznam_Zastavok_Odkial;
                    console.log(obj)
                }
            }
        }
    })




})