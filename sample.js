var kargojs = require('./index')();

kargojs.Yurtici.query("107683143283",function(err,data){
    if(err){
    console.log(err);
    } else{
    console.log(data);
    }
})
kargojs.Yurtici.getMovements("107683143283",function(err,data){
    if(err){
    console.log(err);
    } else{
    console.log(data);
    }
})
kargojs.Aras.query("5560228801279",function(err,data){
    if(err){
        console.log(err);
    } else{
        console.log(data);
    }
})

kargojs.Aras.getMovements("5560228801279",function(err,data){
    if(err){
        console.log(err);
    } else{
        console.log(data);
    }
})