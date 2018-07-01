function getPopularity(length, data) {
    // Takes in the intial result as data 
    // Check for popularity 
    // console.log("input id: ", data[i].apiId);
    if (length <= 1) {
        Datenow.findOne({
            where: {
                apiId: data[i].apiId
            },
        }).then(function (dbDateNow) {
            result[length].popularity = dbDateNow.popularity
            return console.log("done");
        });
    }
    return getPopularity(length-1, data);
    
}

let finalResults = getPopularity(initialResults)
    function getPopularity(data) {
      let updatedData = data;
      Datenow.findAll({ where: { apiId: [data[1].apiId, data[0].apiId, data[2].apiId, data[3].apiId, data[4].apiId, data[5].apiId] } }).then(function (dbDateNow) {
        // Perform a callback
        console.log(data.length, dbDateNow.length);
        for (i in data) {
          let idFound = dbDateNow.find(search => search.apiId === data[i].apiId);
          (idFound) ? data[i].popularity = idFound.popularity : data[i].popularity = 0;
          console.log("request", updatedData[i]);
        }
      });
      return updatedData
    }