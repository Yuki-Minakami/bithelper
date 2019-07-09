/**
 * Created by likai on 16/4/28.
 */
//node sendBitcoin.js <walletId> <walletPassphrase> <destinationAddress> <amountSatoshis>

var BitGoJS = require('bitgo');
var bitgo = new BitGoJS.BitGo({env: 'prod', accessToken: process.env.ACCESS_TOKEN});

if (process.argv.length < 6) {
    console.log("usage:\n\t" + process.argv[0] + " " + process.argv[1] + " <walletId> <walletPassphrase> <destinationAddress> <amountSatoshis>");
    process.exit(-1);


}

var walletId = process.argv[2];
var walletPassphrase = process.argv[3];
var destinationAddress = process.argv[4];
var amountSatoshis = parseInt(process.argv[5], 10);

var sendBitcoin = function() {
    console.log("Getting wallet..");

    // Now get the wallet
    bitgo.wallets().get({id: walletId}, function(err, wallet) {
        if (err) { console.log("Error getting wallet!"); console.dir(err); return process.exit(-1); }
        console.log("Balance is: " + (wallet.balance() / 1e8).toFixed(4));

        wallet.sendCoins({ address: destinationAddress, amount: amountSatoshis, walletPassphrase: walletPassphrase, minConfirms: 0 },
            function(err, result) {
                if (err) { console.log("Error sending coins!"); console.dir(err); return process.exit(-1); }

                console.dir(result);
                process.exit(0);
            }
        );
    });
};

sendBitcoin();
