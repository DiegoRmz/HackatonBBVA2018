'use strict';

var mongoose = require('mongoose');
var Transaction = mongoose.model('Transaction');
var ObjectId = require('mongoose').Types.ObjectId; 
var PDFPrinter = require('pdfmake/src/printer');
let date = require('date-and-time');

exports.storeTransaction = function(req,res){
    var transaction = new Transaction(req.body);
    
    transaction.save(function(err,transaction){
        if(err){
            console.log(err);
            res.status(500).send(err.message);
        }
        res.status(200).json(transaction);
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