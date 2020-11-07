 

 
// size of MHD PO 
 function sizeOfDataMHDPO(){
    let size = 11 //+ "kb"
    size=size*4// " do minuty"
    size=size *60 //" do hodiny"
    size=size * 24 // "do dna"
    size =size* 365 // "do roka"
    console.log("--------------------")
    console.log("sizeOfDataMHDPO")
    console.log("--------------------")
    console.log(size + " kB")
    console.log(size/1024 + " MB")
    console.log(size/1024/1024 + " GB")
    console.log("--------------------")
    return size;
   
  }

  // size of Trains 
 function sizeOfDataTrains(){
    let size = 17 //+ "kb"
    size=size*2// " do minuty"
    size=size *60 //" do hodiny"
    size=size * 24 // "do dna"
    size =size* 365 // "do roka"
    console.log("--------------------")
    console.log("sizeOfDataTrains")
    console.log("--------------------")
    console.log(size + " kB")
    console.log(size/1024 + " MB")
    console.log(size/1024/1024 + " GB")
    console.log("--------------------")
    return size;
  
  }
// size of SadPO 
 function sizeOfDataSadPO(){
    let size = 22 //+ "kb"
    size=size*4// " do minuty"
    size=size *60 //" do hodiny"
    size=size * 24 // "do dna"
    size =size* 365 // "do roka"
    console.log("--------------------")
    console.log("sizeOfDataSadPO")
    console.log("--------------------")
    console.log(size + " kB")
    console.log(size/1024 + " MB")
    console.log(size/1024/1024 + " GB")
    console.log("--------------------")
    return size;
   
  }
   // size of Traffic 
 function sizeOfDataTraffic(){
    let size = 100 //+ "kb"
    size=size *4 //" do minuty"
    size=size *60 //" do hodiny"
    size=size * 24 // "do dna"
    size =size* 365 // "do roka"
    console.log("--------------------")
    console.log("sizeOfDataTraffic")
    console.log("--------------------")
    console.log(size + " kB")
    console.log(size/1024 + " MB")
    console.log(size/1024/1024 + " GB")
    console.log("--------------------")
    return size;

  }

  function sizeOfDataWeatherKE(){
    let size = 1 //+ "kb"
    size=size *4 //" do minuty"
    size=size *60 //" do hodiny"
    size=size * 24 // "do dna"
    size =size* 365 // "do roka"
    console.log("--------------------")
    console.log("sizeOfDataWeatherKE")
    console.log("--------------------")
    console.log(size + " kB")
    console.log(size/1024 + " MB")
    console.log(size/1024/1024 + " GB")
    console.log("--------------------")
    return size;
   
  }

  function sizeOfDataWeatherPO(){
    let size = 1 //+ "kb"
    size=size *4 //" do minuty"
    size=size *60 //" do hodiny"
    size=size * 24 // "do dna"
    size =size* 365 // "do roka"
    console.log("--------------------")
    console.log("sizeOfDataWeatherPO")
    console.log("--------------------")
   console.log(size + " kB")
   console.log(size/1024 + " MB")
   console.log(size/1024/1024 + " GB")
   console.log("--------------------")
    
   //console.log(size)
   return size;
  
  }


  function sizeOfAllData(){

    sizeOfDataWeatherPO()
    console.log(" ")
    sizeOfDataWeatherKE()
    console.log(" ")
    sizeOfDataTraffic()
    console.log(" ")
    sizeOfDataMHDPO()
    console.log(" ")
    sizeOfDataTrains()
    console.log(" ")
    sizeOfDataTrains()

    let allSize = sizeOfDataWeatherPO() + sizeOfDataWeatherKE() + 
    sizeOfDataTraffic() + sizeOfDataMHDPO() + sizeOfDataTrains()+sizeOfDataSadPO()
    console.log("--------------------")
    console.log("sizeOfAllData")
    console.log("--------------------")
    console.log(allSize + " kB")
    console.log(allSize/1024 + " MB")
    console.log(allSize/1024/1024 + " GB")
    console.log("--------------------")
  }
  
    sizeOfAllData()