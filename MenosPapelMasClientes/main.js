var express = require('express'), 
app = express(), 
http = require('http'),
server = http.createServer(app),
 mongoose = require('mongoose'),
 methodOverride = require("method-override"),
 bodyParser = require('body-parser');


mongoose.connect('mongodb://localhost:27017/Paperless',function(err,result){
    if(err){
        console.log(err);
        throw err;
    }
    console.log("Connected successfully to the database");
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var transactionModel        = require('./Model/Transaction')(app,mongoose);
var transactionController   = require('./Controller/TransactionsController');

var router = express.Router();
var transactionRouter = express.Router();

transactionRouter.route('/Transaction/Save').post(transactionController.storeTransaction);
transactionRouter.route('/Transaction/GetById/:id').get(transactionController.findById);
transactionRouter.route('/Transaction/getComprobante/:id').get(transactionController.createTransactionPdf);

router.get('/',function(request,result){
    result.send("Hello World");
})

app.use(router);
app.use('/api',transactionRouter);


app.listen(3000,function(){
    console.log("Server running");
})