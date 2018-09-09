//+19893738873

var accountSid  = 'ACa84bcc68b12d3d18dfb38451315b5e7f';
var authToken   = 'e350166492814809e0d144fea8f3c1c2';

var twilio = require('twilio');
var twilioClient = new twilio(accountSid,authToken);

exports.sendSMS = function(msgBody, toNumber){
    return new Promise((resolve,reject)=>{
        twilioClient.messages.create({
            body: msgBody,
            to: toNumber,
            from:'+19893738873'
        }).then((message)=>{
            console.log(message.sid);
            resolve(message);
        }).catch(error =>{ 
            console.log(error);
            reject(error);
        });

    });
}