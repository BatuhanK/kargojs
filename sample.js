var kargojs = require('./index');


kargojs.Yurtici.query("107683143283",function(err,data){
    console.log(err ? err : data);
})


kargojs.Yurtici.getMovements("107683143283",function(err,data){
    console.log(err ? err : data);
})


kargojs.Aras.query("5560228801279",function(err,data){
    console.log(err ? err : data);
})


kargojs.Aras.getMovements("5560228801279",function(err,data){
    console.log(err ? err : data);
})
