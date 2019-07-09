/**
 * Created by likai on 16/4/25.
 */


var walletListLoaded = false;


var ipcRenderer = require('electron').ipcRenderer;
$(document).ready(function(){
    $("li .myWallet").trigger("click");
});

function showQR(selector,addr){
    jQuery(selector).qrcode({
        text: addr,
        width:180,
        height:180
    });
}

ipcRenderer.on('createResult', function(event, arg) {
    // $("#createResult").css("display","block");
    //showQR("#createQR",arg);
    alert("Create Wallet Successfully");
    $("#createAddr").text(arg);
    var tr = $("<tr></tr>");
  // tr.append('<td>'+arg.label+'</td>')
    tr.append('<td>'+arg.id+'</td>');
    tr.append('<td>'+0+'</td>');
    $("#walletList").append(tr);
    $(".myWallet").click();
    $(".myWallet").removeClass("hide");
    $(".walletInput").val("");
});

ipcRenderer.on("updateSelect",function(event,arg){
    $(".walletListSelect").empty();
    $.each(arg,function(i,data) {
        var option = $("<option>" + data + "</option>");
        option.val(data);
        $(".walletListSelect").append(option);
    })
})

ipcRenderer.on("getWalletListCallback",function(event,arg){
    //alert(arg);
    walletListLoaded = true;

    $.each(arg,function(i,data){
        var tr = $("<tr></tr>")
        tr.addClass(data);
        tr.append('<td>'+data+'</td>');
        $("#walletList").append(tr);
        var option = $("<option>"+data+"</option>");
        option.val(data);
        $(".walletListSelect").append(option);
        ipcRenderer.send('getBalance',data);
    })
})



ipcRenderer.on("getBalanceCallback",function(event,arg){
    $("."+arg.address).append("<td>"+arg.value+"</td>");
});

$("li .receive").on("click",function(){
    if(true){
        $(".container > div").addClass("hide");
        $(".container > .receive").removeClass("hide");
        $("#qrcode").empty();
        showQR("#qrcode",$(".walletListSelect").val());
    }else{
        return;
    }
})

$("li .send").on("click",function(){
    if(true){
        $(".container > div").addClass("hide");
        $(".container > .send").removeClass("hide");
    }else{
        return;
    }
})

$("li .myWallet").on("click",function(){
    if(true){
        $(".loginErr").css("display","none");
        $(".container > div").addClass("hide");
        $(".container > .myWallet").removeClass("hide");
        if(!walletListLoaded){
            ipcRenderer.send('getWalletList',"test");
        }

    }else{
        $(".loginErr").css("display","block");
    }
})

$("li .create").on("click",function(){
    if (true) {
        $(".container > div").addClass("hide");
        $(".container > .create").removeClass("hide");
        $(".loginErr").css("display","none");
    } else {
        $(".container > .create").addClass("hide");
        $(".loginErr").css("display","block");

    }
})

$("#confirmSend").on("click",function(){
    if($("#amount").val()<0.0001){
        $("#amountErr").css("display","block");
    }else{
        $("#amountErr").css("display","none");
    }

    valueAddress($("#address").val());
})

$("#createWallet").on("click",function(){
    if( $("#pass1").val() && $("#pass1").val() == $("#pass2").val()){
        $("#passErr").css("display","none")
    }else{
        $("#passErr").css("display","block");
        return;
    }
    createWallet();
})

$(".walletListSelect").change(function(){
    $("#qrcode").empty();
    showQR("#qrcode",$(".walletListSelect").val());

})

function createWallet(obj){
    obj = {
        label:"test0425",
        pass:"123456"
    }
    ipcRenderer.send('createWallet',obj);
}

function valueAddress(address){
    $.ajax({
        type:"GET",
        url:"https://blockchain.info/address/"+address+"?format=json",
        success:function(data,textStatus){
            //TODO
            console.log("success");
            console.log(data);
            $("#addrErr").css("display","none");
        },
        error:function(data){
            console.log("failed");
            $("#addrErr").css("display","block");

        }
    })
}

$("#amount").on("input",function(){
    var amount = $("#amount").val();
    if(!isNaN(amount)){
        $("#dollar").val(amount * 450.4);
    }
})

$("#confirmSend").on("click",function(){

    var src = $(".send .walletListSelect option:selected").text();
    var des = $("#address").val();
    var amount = $("#amount").val();
    var pass = $("#password").val();

    var obj = {
        "src": src,
        "des":des,
        "amount":amount,
        "pass":pass
    }
    ipcRenderer.send('sendCoin',obj);

})

ipcRenderer.on("sendCoinCallback",function(event,arg){
    if(arg =="success"){
        alert("send coin successfully");
    }else{
        alert("send failed");
    }
    walletListLoaded = false;
    $(".walletListSelect").empty();
    $("#walletList").empty();
    $("#walletList").append(" <tr> <th>地址</th> <th>余额</th> </tr>")

    $("li .myWallet").trigger("click");
})

$(window).unload(function(){
    ipcRenderer.send("walletClosed","closed");
});


