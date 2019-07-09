/**
 * Created by likai on 16/4/25.
 */
var monk = require('monk')
var db = monk('localhost:27017/final')

var serverAPI = {
    verifyUser:function(name,pass){
        var login = db.get('login')
        var promise = login.find({"name":name});
        return promise;
    },
    getWalletList:function(name) {
        var walletList = db.get('wallet');
        var promise = walletList.find({"name": name});
        return promise;
    },
    updateWallet:function(name,wallets){
        var walletList = db.get('wallet');
        console.log(wallets);
        var promise = walletList.update({"name": name}, {"name":name,"wallet":wallets});
        return promise;

    },
    getUserPass:function(name){
        var login = db.get('login');
        var promise = login.find({"name":name});
        return promise;
    },
    insertUser:function(email,pass){
        var login = db.get('login');
        var promise = login.insert({"name":email,"pass":pass})
        return promise;
    }

}



module.exports = serverAPI;
