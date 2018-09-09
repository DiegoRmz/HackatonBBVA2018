'use strict';

var mongoose = require('mongoose'),
Schema   = mongoose.Schema;

var TransactionSchema = new Schema({
    telef_usuario: {
        type: String
    },
    mail_usuario: {
        type: String    
    },
    fech_operac: {
        type: Date
    },
    sucursal:{
        type: Number     
    },
    id_de_dispositivo:{
        type: Number
    },
    estado_sucur: {
        type: String
    },
    munic_sucur:{
        type: String
    },
    col_sucur: {
        type: String
    },
    pais: {
        type: String
    },
    tipo_de_cliente: {
        type: String
    },
    Nom_clien: {
        type: String
    },
    Apel_pate_clien: {
        type: String
    },
    Apel_mat_clien: {
        type: String
    },
    num_clien: {
        type: Number
    },
    cuenta_clien: {
        type: Number
    },
    telef_clien: {
        type: String
    },
    Compa_telef: {
        type: String
    },
    telef_trans: {
        type: String
    },
    sexo: {
        type: String
    },
    monto_operacion: {
        type: Number
    },
    tipo_de_operacion: {
        type: String
    },
    convenio: {
        type: Number
    },
    referencia: {
        type: String
    },
    respuest: {
        type: String
    },
    tipo_compr: {
        type: String
    },
    tiemp_caja: {
        type: String
    }
});

module.exports = mongoose.model('Transaction',TransactionSchema);