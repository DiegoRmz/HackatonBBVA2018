'use strict';

var mongoose = require('mongoose');
var Transaction = mongoose.model('Transaction');
var ObjectId = require('mongoose').Types.ObjectId; 
var PDFPrinter = require('pdfmake/src/printer');

var Mailer  = require('../util/Mailer');
var SMS     = require('../util/sms');
var qrcode     = require('qrcode');

exports.storeTransaction = function(req,res){
    var transaction = new Transaction(req.body);
    
    transaction.save(function(err,transaction){
        if(err){
            console.log(err);
            res.status(500).send(err.message);
        }
        
       if(transaction.tipo_compr == 'Email'){
            var messageHtml = "<h1>Comprobante de "+transaction.tipo_de_operacion+"</h1><br>"+
            "<p><b>Estimado Usuario: </b><br>Le informamos la realización de un"+
            transaction.tipo_de_operacion+" a su nombre, para acceder a su comprobante visite la siguiente liga: "+
            "<a href='localhost:3000/api/Transaction/getComprobante/"+transaction._id+"'>Comprobante digital</a>"+
            "<br>Atentamente: BBVA Bancomer</p>";

            var messageText = "Comprobante de "+transaction.tipo_de_operacion+"\nEstimado Usuario:\n"+
            "Le informamos la realización de un "
            +transaction.tipo_de_operacion+" a su nombre, para acceder a su comprobante visite la siguiente liga:"+
            "localhost:3000/api/Transaction/getComprobante/"+transaction._id+" "+
            ".\nAtentamente: BBVA Bancomer";

            Mailer.sendmail(transaction.mail_usuario,"Comprobante de "+transaction.tipo_de_operacion,messageText,messageHtml).then(
                success=>{
                    res.status(200).send('Revise su correo electrónico para encontrar su comprobante');
                },err=>{
                    console.log(err);
                    res.status(500).send('Disculpe, por el momento no podemos atenderle: '+err);
                }
            )
        }
        else if(transaction.tipo_compr == 'Mensaje'){
            var txtMsg = 'Puede consultar su comprobante en la siguiente liga: '+
                "localhost:3000/api/Transaction/getComprobante/"+transaction._id+" . Gracias";

            var toNumber = transaction.telef_usuario;
            SMS.sendSMS(txtMsg,toNumber).then(
                success=>{
                    res.status(200).send('Revise su móvil para encontrar su comprobante');
                },err=>{
                    console.log(err);
                    res.status(500).send('Disculpe, por el momento no podemos atenderle: '+err);
                }
            )
        }
        else if(transaction.tipo_compr == 'QR'){
            qrcode.toString("localhost:3000/api/Transaction/getComprobante/"+transaction._id,(err,string)=>{
                if(err){
                    res.status(500).send('Disculpe, por el momento no podemos atenderle: '+err);
                }else{
//                    res.setHeader('Content-type', 'image/png');
                    res.status(200).send(string);
                }
            });
        }
    });
}

exports.findById = function(req,res){
    Transaction.findById(new ObjectId(req.params.id), function(err,transactionData){
        if(err){
            console.log(err);
            res.status(500).send(err.message);
        }
        res.status(200).json(transactionData);
    }); 
}

//API/Transaction/getComprobante/iddetransaccion
//Will work if QR is implemented
exports.createTransactionPdf = function(req,res){
    var fnamePrefix = req.params.id;

   Transaction.findById(new ObjectId(req.params.id), function(err,transactionData){
        if(err){
            console.log(err);
            res.status(500).send(err.message);
        }
       
        var cnt = [];
        cnt.push('\n\n\n\n');

        switch (transactionData.tipo_de_operacion) {
            case "Deposito a cuenta":
                cnt.push('N.o de cuenta: '+transactionData.cuenta_clien+'\n');
                cnt.push('Cuentahabiente receptor:'+transactionData.Apel_pate_clien+'\n');
                cnt.push('Fecha de operación: '+transactionData.fech_operac+'\n');
                cnt.push('Importe de la operación: '+transactionData.monto_operacion+'\n');
                cnt.push('N.o de sucursal: '+transactionData.sucursal+'\n');
                cnt.push('N.o de cajero: '+transactionData.id_de_dispositivo+'\n');
                cnt.push('Folio de la operación: '+transactionData._id+'\n\n');

                break;
        
            default:
                cnt.push('N.o de cuenta: '+transactionData.cuenta_clien+'\n');
                cnt.push('Fecha de operación: '+transactionData.fech_operac+'\n');
                cnt.push('Importe de la operación: '+transactionData.monto_operacion+'\n');
                cnt.push('N.o de cajero: '+transactionData.id_de_dispositivo+'\n');
                cnt.push('Folio de la operación: '+transactionData._id+'\n\n');
                break;
        }
        
        var fonts = {
            Roboto: {
                normal: '../MenosPapelMasClientes/assets/fonts/Roboto-Regular.ttf',
                bold: '../MenosPapelMasClientes/assets/fonts/Roboto-Regular.ttf',
                italics: '../MenosPapelMasClientes/assets/fonts/Roboto-Regular.ttf',
                bolditalics: '../MenosPapelMasClientes/assets/fonts/Roboto-Regular.ttf'
            }
        };

        var docDefinition = {
            pageSize: { width: 470, height: 300 },
            pageOrientation: 'portrait',
            pageMargins: [ 20,30, 20, 60 ],
            header: { image: '../MenosPapelMasClientes/assets/bbvalogo.jpeg', width:300,height:80},
            content: cnt,
            footer: {text: 'Este comprobante constituye una notificación de los términos en que se realizó la transacción, el único comprobante oficial es el estado de cuenta emitido por BBVA Bancomer.'}
        };
        var filename = fnamePrefix+".pdf";
        
        var printer = new PDFPrinter(fonts);

        var pdfDoc = printer.createPdfKitDocument(docDefinition);

        res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        pdfDoc.pipe(res);
        pdfDoc.end();
    }); 
}