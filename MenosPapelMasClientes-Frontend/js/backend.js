'use strict';
const baseUri = 'http://localhost:8080/inventory';

function ajaxCall(complementUri,rType,dataBundle,sFunc, eFunc){
    $.ajax({
        url:baseUri+'/'+complementUri,
        crossDomain: true,
        type:rType,
        data:dataBundle
    }).done(function (data) {
        sFunc(data);
    }).fail(function (err) {
        eFunc(err);   
    })
}

function ajaxRequest(complementUri,rType,dataBundle,contenttype){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:baseUri+'/'+complementUri,
            crossDomain: true,
            type:rType,
            contentType:contenttype, 
            data:dataBundle
        }).done(function (data) {
            resolve(data);
        }).fail(function (err) {
            reject(err);   
        })
    });
}

function ajaxPOST(complementUri,dataBundle){
    return new Promise((resolve,reject)=>{
        $.ajax({
            url:baseUri+'/'+complementUri,
            crossDomain: true,
            type:'POST',
            contentType:'application/json',
            data:dataBundle,
        }).done(function (data) {
            resolve(data);
        }).fail(function (err) {
            reject(err);   
        })
    });
}


export {ajaxCall,ajaxRequest,ajaxPOST};