'use strict';


const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'retobbva2k18@gmail.com',
        pass: 'ech04ut5h_!C1ri'
    }  
})
exports.sendmail = function(destEmail,sub,msgText,htmlText){
    var mailOpt = {
        from: 'retobbva2k18@gmail.com',
        to: destEmail,
        subject: sub,
        text: msgText,
        html: htmlText
    }

    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOpt,function(err,info){
            if(err)
                reject(err);
            else
                resolve(info);
        });
    })

}