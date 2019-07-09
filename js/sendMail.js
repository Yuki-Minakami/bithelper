var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'QQ',
    auth: {
        user: '1140398276@qq.com',
        pass: 'qaz123456'
    }
});


function sendMail(event,des,content){
    var mailOptions = {
        from: '1140398276@qq.com ', // sender address
        to: 'likaiboy_2012@126.com', // list of receivers
        subject: '密码找回--BitHelper', // Subject line
        text: '您的密码已经找回', // plaintext body
        html: '密码找回成功，密码为：'+'<b>'+content+'</b>' // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            event.sender.send("forgetPassCallback","fail")
        }else{
            console.log('Message sent: ' + info.response);
            event.sender.send("forgetPassCallback","success")
        }
    });
}



module.exports = sendMail;
