var Yurtici = require('./firmalar/Yurtici');
var Aras = require('./firmalar/Aras');

function KargoJS(settings){
    this.Yurtici = Yurtici;
    this.Aras = Aras;
}

module.exports = function(settings){
    return new KargoJS(settings);
}
