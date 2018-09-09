'use strict';

var mongoose = require('mongoose'),
Schema   = mongoose.Schema;

var TransactionSchema = new Schema({
    transactionType: {
        type: String
    },
    transactionDate: {
        type: Date    
    },
    folio: {
        type: Number
    },
    email:{
        type: String     
    },
    phone:{
        type: String
    },
    amount: {
        type: Number
    },
    atmType:{
        type: String
    }
});

module.exports = mongoose.model('Transaction',TransactionSchema);