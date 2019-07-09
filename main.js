// 'use strict';
//93af16e00902d2583a9d549196875bbabd54884de0032b123617e74b4c80acff
const electron = require('electron');
// Module to control application life.
const app = electron.app;
var token = require("./config.js").token;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

var sendMail = require("./js/sendMail.js")
var serverAPI = require("./server/app.js");

const ipcMain = require('electron').ipcMain;

var BitGoJS = require('bitgo');

var bitgo = new BitGoJS.BitGo({env: 'prod', accessToken: token});

var commonEvent;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({minWidth: 800, minHeight: 640});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index/index.html');


  // Open the DevTools.
 // mainWindow.webContents.openDevTools();


  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

function authentication(){
 // var accessToken = "93af16e00902d2583a9d549196875bbabd54884de0032b123617e74b4c80acff";
  //var bitgo = new BitGoJS.BitGo({env: 'prod', accessToken: token});
  console.log("BitGoJS haha library version: " + bitgo.version());
  bitgo.session({})
      .then(function(res) {
       // mainWindow.webContents.send('ping', JSON.stringify(res));
        console.log(res);
      })
      .catch(function(err) {
        console.log(err);
      });
}

function createWallet(event,obj){
  //var accessToken = "93af16e00902d2583a9d549196875bbabd54884de0032b123617e74b4c80acff";
  //var bitgo = new BitGoJS.BitGo({env: 'prod', accessToken: token});
  bitgo.wallets().createWalletWithKeychains({"passphrase": obj.pass, "label": obj.label}, function(err, result) {
    if (err) { console.dir(err); throw new Error("Error creating wallet!"); }
    console.log("Wallet Created: " + result.wallet.id());
    //console.dir(result.wallet.wallet);
    var message = {
      label:result.wallet.wallet.label,
      id:result.wallet.id()
    }
    console.log(message);

      mainWindow.webContents.session.cookies.get({ name : "email" }, function(error, cookies) {
          if (error) {
              throw error;
          }
          var email = cookies[0].value;
          var promise = serverAPI.getWalletList(email);
          promise.on("success",function(docs){
              var wallets =  docs[0].wallet;
              wallets.push(message.id);
              console.log("wallets list",wallets);
              event.sender.send("updateSelect",wallets);
              var promise2 = serverAPI.updateWallet(email,wallets)
              promise2.on("success",function(docs){
                  console.log("wallet create success");
                  event.sender.send('createResult', message);
              })

          })
      });

  });

}

function getBalance(event,address){
    bitgo.wallets().get({type: 'bitcoin', id: address}, function(err, wallet) {
        if (err) { console.log(err); }
        console.log('Wallet balance is: ');
        console.log(wallet.balance() + ' Satoshis');

        var obj ={
            address:address,
            value: wallet.balance()/100000000
        }
        event.sender.send('getBalanceCallback', obj);
    });

}

function sendCoin(event,src,pass,des,amount){
    console.log("src is ",src);
    console.log("pass is ",pass);
    console.log("des is ",des);
    console.log("amount is ",amount);

    console.log("Getting wallet..");
    // Now get the wallet
    var bitgo = new BitGoJS.BitGo({env: 'prod', accessToken: token});
    bitgo.wallets().get({id: src}, function(err, wallet) {
        if (err) { console.log("Error getting wallet!"); console.dir(err); return process.exit(-1); }
        console.log("Balance is: " + (wallet.balance() / 1e8).toFixed(4));

        wallet.sendCoins({ address: des, amount: amount*100000000, walletPassphrase: pass, minConfirms: 0 },
            function(err, result) {
                if (err) {
                    console.log("Error sending coins!");
                    console.dir(err);
                    event.sender.send("sendCoinCallback","fail")
                    return;
                }
                console.dir(result);
                event.sender.send("sendCoinCallback","success")
            }
        );
    });
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


ipcMain.on("getLoginStatus",function(event,arg){
  mainWindow.webContents.session.cookies.get({ url : "http://www.github.com" }, function(error, cookies) {
    if (error) {
      event.sender.send('getLoginStatusCallback', 'no');
    };
   // console.log(cookies);
    if(cookies[0] && cookies[0].value == "yes"){
      event.sender.send('getLoginStatusCallback', 'yes');
    }else{
      event.sender.send('getLoginStatusCallback', 'no');
    }
  });
})

ipcMain.on('createWallet', function(event, arg) {
  console.log(arg);  // prints "ping"
  createWallet(event,arg);
});

ipcMain.on('sendBTC', function(event, arg) {
  console.log(arg);  // prints "ping"
  event.returnValue = 'pong';
});


function getWalletList(event,email){
  var promise2 = serverAPI.getWalletList(email);
  promise2.on("success",function(docs){
    console.log(docs);
    if(docs[0] && docs[0].wallet){
      console.log(docs[0].wallet);
      event.sender.send("getWalletListCallback",docs[0].wallet);
    }else{
        event.sender.send("getWalletListCallback","empty");
    }
  })
}


ipcMain.on('getWalletList',function(event,arg){
    console.log("from wallet");
    //event.sender.send("list","test");
    mainWindow.webContents.session.cookies.get({ name : "email" }, function(error, cookies) {
        if (error) {
           throw error;
        };
        var email = cookies[0].value;

        getWalletList(event,email)

    });
})

ipcMain.on('login', function(event, arg) {
    commonEvent = event;
  var promise = serverAPI.verifyUser(arg.email,arg.pass);
  promise.on("success",function(docs){
    console.log(docs);
    if(docs[0] && docs[0].pass){
        if(docs[0].pass == arg.pass){
            console.log("login success");
            event.sender.send('login-reply', 'success');

            mainWindow.webContents.session.cookies.set(
                {url : "http://www.github.com",name : "login", value : "yes"},
                function(error, cookies) {
                    if (error) throw error;
                });
            mainWindow.webContents.session.cookies.set(
                {url : "http://www.github.com",name : "email", value : arg.email},
                function(error, cookies) {
                    if (error) throw error;
                });
            getWalletList(event,arg.email)
        }else{
            event.sender.send('login-reply', 'fail');
        }
    }else{
        event.sender.send('login-reply', 'fail');
    }

  })
});

ipcMain.on('getBalance', function(event, arg) {
    getBalance(event,arg);
})

ipcMain.on("sendCoin",function(event,arg){
   console.dir(arg);
    sendCoin(event,arg.src,arg.pass,arg.des,arg.amount);
})

ipcMain.on("forgetMail",function(event,arg){
    var email = arg;
    console.log("find ",email);
    var promise = serverAPI.getUserPass(email);
    promise.on("success",function(docs){
        if(docs[0] && docs[0].pass){
            sendMail(event,email,docs[0].pass);
        }else{
            event.sender.send("forgetPassCallback","fail")
        }
    })
})

ipcMain.on("register",function(event,arg){
    var promise = serverAPI.insertUser(arg.email,arg.pass);
    console.log("register user");
    promise.on("success",function(docs){
        event.sender.send("registerCallback","success");
    })
})

ipcMain.on("walletClosed",function(event,arg){
    console.log("wallet closed");
    commonEvent.sender.send("walletClosedCallback","closed");
})