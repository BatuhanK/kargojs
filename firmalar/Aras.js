var Aras = {};
var request = require('request');
var async = require('async');

Aras._delete_null_properties = function(test, recurse) {
    for (var i in test) {
        if (test[i] === null) {
            delete test[i];
        } else if (recurse && typeof test[i] === 'object') {
            Aras._delete_null_properties(test[i], recurse);
        }
    }
}

Aras._stripTags = function(str){
    return str.replace(/<(?:.|\n)*?>/gm, '');
}
Aras._findAndGetRegex = function(regexPattern,subject){
    var findings = regexPattern.exec(subject);
    if(!findings)
        return null;
    else
        return Aras._stripTags(findings[1]);
}

Aras._getShipmentId = function(query,callback){
    request("http://kargotakip.araskargo.com.tr/CargoInfoV3.aspx?code=" + String(query) ,function(err,response,body){
        if(err){
            return callback(err);
        }
        var shipmentIdRegex = /shipmentid=(.*)&amp;/g;
        var shipmentId = Aras._findAndGetRegex(shipmentIdRegex,body);

        var barcodeRegex = /barcode=(.*)&amp;/g;
        var barcode = Aras._findAndGetRegex(barcodeRegex,body);

        if(shipmentId && barcode){
            var idsObject = {
                shipmentId: shipmentId,
                barcode: barcode
            }
            return callback(null,idsObject);
        } else {
            return callback(new Error('Hatalı kargo takip numarası'));
        }
    })
}

Aras._getCargoDetails = function(shipmentId,callback){
    request("http://kargotakip.araskargo.com.tr/CargoInfoWaybillAndDelivered.aspx?shipmentid=" + String(shipmentId), function(err,response,body){
        if(err){
            return callback(err);
        }
        var kayitKontrolRegex = /<font face=arial color=red size=2>(.*)<\/font>/g;
        var kayitKontrol = Aras._findAndGetRegex(kayitKontrolRegex,body);

        if(kayitKontrol != null)
            return callback(new Error('Kayıt bulunamadı'));


        var ilkCikisRegex = /<span id="LabelIlkCikis">(.*)<\/span>/g;
        var ilkCikis = Aras._findAndGetRegex(ilkCikisRegex,body);

        var cikisRegex = /<span id="cikis_subesi">(.*)<\/span>/g;
        var cikis = Aras._findAndGetRegex(cikisRegex,body);

        var varisRegex = /<span id="varis_subesi">(.*)<\/span>/g;
        var varis = Aras._findAndGetRegex(varisRegex,body);

        var odemeTuruRegex = /<span id="fatura_turu">(.*)<\/span>/g;
        var odemeTuru = Aras._findAndGetRegex(odemeTuruRegex,body);

        var aliciRegex = /<span id="alici_adi_soyadi">(.*)<\/span>/g;
        var alici = Aras._findAndGetRegex(aliciRegex,body);

        var kargoCinsRegex = /<span id="LabelCargoType">(.*)<\/span>/g;
        var kargoCins = Aras._findAndGetRegex(kargoCinsRegex,body);

        var paketSayiRegex = /<span id="LabelPackageCount">(.*)<\/span>/g;
        var paketSayi = Aras._findAndGetRegex(paketSayiRegex,body);

        var gonderiTipiRegex = /<span id="LabelGonTipi">(.*)<\/span>/g;
        var gonderiTipi = Aras._findAndGetRegex(gonderiTipiRegex,body);

        var cikisTarihiRegex = /<span id="cikis_tarihi">(.*)<\/span>/g;
        var cikisTarihi = Aras._findAndGetRegex(cikisTarihiRegex,body);

        var tasimaIrsaliyeRegex = /<span id="FatNo">(.*)<\/span>/g;
        var tasimaIrsaliye = Aras._findAndGetRegex(tasimaIrsaliyeRegex,body);

        var gonderiNoRegex = /<span id="labelShipmentCode">(.*)<\/span>/g;
        var gonderiNo = Aras._findAndGetRegex(gonderiNoRegex,body);

        var gondericiRegex = /<span id="gonderici_adi_soyadi">(.*)<\/span>/g;
        var gonderici = Aras._findAndGetRegex(gondericiRegex,body);

        var sevkIrsaliyeRegex = /<span id="labelTradingWaybillNumber">(.*)<\/span>/g;
        var sevkIrsaliye = Aras._findAndGetRegex(sevkIrsaliyeRegex,body);

        var durumRegex = /<span id="Son_Durum" class="(?:.*)">(.*)<\/span>/g;
        var durum = Aras._findAndGetRegex(durumRegex,body);

        var teslimAlanRegex = /<span id="Teslim_Alan">(.*)<\/span>/g;
        var teslimAlan = Aras._findAndGetRegex(teslimAlanRegex,body);

        var teslimTarihiRegex = /<span id="Teslim_Tarihi">(.*)<\/span>/g;
        var teslimTarihi = Aras._findAndGetRegex(teslimTarihiRegex,body);

        var arasObj = {
            bilgiler: {
                'ilk_cikis_sube': ilkCikis,
                'cikis_sube': cikis,
                'varis_sube': varis,
                'odeme_turu': odemeTuru,
                'alici': alici,
                'kargo_cinsi': kargoCins,
                'paket_sayi': paketSayi,
                'gonderi_tipi': gonderiTipi,
                'cikis_tarihi': cikisTarihi,
                'tasima_irsaliye_no': tasimaIrsaliye,
                'gonderi_no': gonderiNo,
                'gonderici': gonderici,
                'sevk_irsaliye_no': sevkIrsaliye,
            },
            durum: {
                'son_durum': durum,
                'teslim_alan': teslimAlan,
                'teslim_tarihi': teslimTarihi
            }
        }

        return callback(null,arasObj);

    })
}

Aras._getMovementDetails = function(barcode,callback){
    request("http://kargotakip.araskargo.com.tr/CargoInfoTransactionAndRedirection.aspx?barcode=" + String(barcode), function(err,response,body){
        if(err){
            return callback(err);
        }

        body = body.replace(/<b>/g, '');

        var tableRegex = /<td>(.{19})<\/td><td>(.*)<\/td><td>(.*)<\/td><td>(.*)<\/td>/g
        var tableResults = body.match(tableRegex);

        if(!tableResults){
            return new Error('Taşıma bilgisi bulunamadı');
        }
        var parseDetailsRegex = /<td>(.*)<\/td>/g;
        var movementDetails = [];
        for(var i=0; i<tableResults.length; i++){
            var detailsRaw = tableResults[i].match(/<td>(.*?)<\/td>/g).map(function(val){
                return val.replace(/<\/?td>/g,'');
            });
            var details = {
                'tarih': detailsRaw[0],
                'il': detailsRaw[1],
                'birim': detailsRaw[2],
                'islem': detailsRaw[3]
            }
            movementDetails.push(details);
        }
        return callback(null,movementDetails);
    });
}

Aras.query = function(query,callback){
    async.waterfall([
        function(cb){
            Aras._getShipmentId(query,cb);
        },
        function(idsObject,cb){
            Aras._getCargoDetails(idsObject.shipmentId,cb);
        }
    ], function(err,results){
        if(err){
            return callback(err);
        } else{
            return callback(null,results);
        }
    })
}

Aras.getMovements = function(query,callback){
    async.waterfall([
        function(cb){
            Aras._getShipmentId(query,cb);
        },
        function(idsObject,cb){
            Aras._getMovementDetails(idsObject.barcode,cb);
        }
    ], function(err,results){
        if(err){
            return callback(err);
        } else{
            return callback(null,results);
        }
    })
}
module.exports = Aras;