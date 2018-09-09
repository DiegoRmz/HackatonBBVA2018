'use strict';

var mongoose = require('mongoose');
var Transaction = mongoose.model('Transaction');
var ObjectId = require('mongoose').Types.ObjectId; 

exports.storeTransaction = function(req,res){
    console.log(req.body.transactionType);

    var transaction = new Transaction({
        transactionType: req.body.transactionType,
        transactionDate: req.body.transactionDate,
        folio: req.body.folio,
        email: req.body.email,
        phone: req.body.phone,
        amount: req.body.amount,
        atmType: req.body.atmType
    });
    
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

