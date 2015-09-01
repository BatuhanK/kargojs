var Yurtici = {},
    request = require('request');



/**
 * @private
 */
Yurtici._queryFormatter = function(query){
    var postingRefIds;

    if (typeof query === "string") {
        postingRefIds = query.split();
    } else if (typeof query === "number") {
        postingRefIds = String(query).split();
    } else {
        query = query.map(function(item) {
            return String(item);
        });

        return query;
    }

    return postingRefIds;
}


/**
 * @private
 */
Yurtici._prepareQuery = function(query){
    var postingRefIds = Yurtici._queryFormatter(query),
        innerQuery = {
            "postingRefIds": postingRefIds,
            "ticketId": "8a81a3194f830a88014f88343d881642",
            "SERVICE_NAME": "getLastPostings"
        };

    return {
        "NO_ENC": true,
        "INPUT_BLOCK": JSON.stringify(innerQuery)
    };
}


Yurtici.query = function(query,callback){
    request({
        uri: "http://mapp.yurticikargo.com/ListenerServlet",
        method: "POST",
        form: Yurtici._prepareQuery(query),
        json: false
    }, function(error,response,body){
        if (error) return callback(error);

        var responseObj = JSON.parse(body);

        if (responseObj.message)
            return callback(new Error(responseObj.message));

        return callback(null,responseObj.result);
    })
}


/**
 * @private
 */
Yurtici._prepareMovementsQuery = function(singleId){
    var innerQuery = {
        "postingRefId": singleId,
        "ticketId": "8a81a3194f830a88014f88343d881642",
        "SERVICE_NAME": "getCargoMovements"
    };

    return {
        "NO_ENC": true,
        "INPUT_BLOCK": JSON.stringify(innerQuery)
    };
}


Yurtici.getMovements = function(query,callback){
    request({
        uri: "http://mapp.yurticikargo.com/ListenerServlet",
        method: "POST",
        form: Yurtici._prepareMovementsQuery(query),
        json: false
    }, function(error,response,body){
        if (error) return callback(error);

        var responseObj = JSON.parse(body);

        if (responseObj.message)
            return callback(new Error(responseObj.message));

        return callback(null,responseObj.result);
    })
}



module.exports = Yurtici;
