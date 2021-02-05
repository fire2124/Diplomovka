const prestupy =require('./prestupy.json')
const fs = require("fs");
const _ = require('lodash');  

let odkial = []
let kam  = []
prestupy.map(e=>{
    if(e.zoznamZastávokKam) kam.push(e)
    else if (e.zoznamZastávokOdkial) odkial.push(e)
})


let x = kam[0].zoznamZastávokKam
let y = odkial[0].zoznamZastávokOdkial
console.log(x)
console.log(y)

let prestup = []

for(let a = 0;a<x.length; a++){
    for(let b = 0;b<y.length; b++){
        if(_.isEqual( x[a], y[b])){
            let obj = {}
            obj.name = x[a].name
            //obj.coordinates = x[a].coordinates
            prestup.push(obj)
        }
    } 
}
console.log(prestup)


// fs.writeFileSync(
//     "./Cestovne_poriadky/test.json",
//     mat
//   );