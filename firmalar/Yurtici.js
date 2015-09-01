var Yurtici = {};
var request = require('request');

Yurtici._queryFormatter = function(query){
    if(typeof query === "string"){
        var postingRefIds = query.split();
    } else if(typeof query === "number"){
        var postingRefIds = String(query).split();
    } else {
        for(var i=0;i<query.length;i++)
            query[i] = String(query[i]);
        var postingRefIds = query;
    }

    return postingRefIds;
}
Yurtici._prepareQuery = function(query){
    var postingRefIds = Yurtici._queryFormatter(query);
    var innerQuery = {
        "postingRefIds": postingRefIds,
        "ticketId": "8a81a3194f830a88014f88343d881642",
        "SERVICE_NAME": "getLastPostings"
    }
    var yurticiQuery = {
        "NO_ENC": true,
        "INPUT_BLOCK": JSON.stringify(innerQuery)
    };
    return yurticiQuery;
}
Yurtici.query = function(query,callback){
    request({
        uri: "http://mapp.yurticikargo.com/ListenerServlet",
        method: "POST",
        form: Yurtici._prepareQuery(query),
        json: false
    }, function(error,response,body){
        if(error){
            return callback(error);
        } else {
            var responseObj = JSON.parse(body);
            if(responseObj.message){
                return callback(new Error(responseObj.message));
            } else {
                return callback(null,responseObj.result);
            }
        }
    })
}
Yurtici._prepareMovementsQuery = function(singleId){
    var innerQuery = {
        "postingRefId": singleId,
        "ticketId": "8a81a3194f830a88014f88343d881642",
        "SERVICE_NAME": "getCargoMovements"
    }
    var yurticiQuery = {
        "NO_ENC": true,
        "INPUT_BLOCK": JSON.stringify(innerQuery)
    };
    return yurticiQuery;
}
Yurtici.getMovements = function(query,callback){
    request({
        uri: "http://mapp.yurticikargo.com/ListenerServlet",
        method: "POST",
        form: Yurtici._prepareMovementsQuery(query),
        json: false
    }, function(error,response,body){
        if(error){
            return callback(error);
        } else {
            var responseObj = JSON.parse(body);
            if(responseObj.message){
                return callback(new Error(responseObj.message));
            } else {
                return callback(null,responseObj.result);
            }
        }
    })
}

module.exports = Yurtici;