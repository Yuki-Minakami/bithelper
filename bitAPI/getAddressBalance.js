var BitGoJS = require('bitgo');
var bitgo = new BitGoJS.BitGo({env: 'prod', accessToken: process.env.ACCESS_TOKEN});

if (process.argv.length < 2) {
  console.log("usage:\n\t" + process.argv[0] + " " + process.argv[1] + " <address>");
  process.exit(-1);
}

if (process.argv.length > 2) {
  address = process.argv[2];
}

bitgo.wallets().get({type: 'bitcoin', id: address}, function(err, wallet) {
  if (err) {
    console.log(err);
    process.exit(-1);
  }
  console.log('Wallet balance is: ');
  console.log(wallet.balance() + ' Satoshis');
});

