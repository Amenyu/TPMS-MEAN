const express = require('express');
const path = require('path');  
const cors = require('cors');
var bodyparser=require('body-parser');
const jwt = require('jsonwebtoken');

const PaymentConfigData = require('./src/model/paymentConfigData');

const PORT = process.env.PORT || 8080;

var app = new express();
app.use(express.static('./dist/frontend'));
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyparser.json());


function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }

  app.post('/api/insertPaymentConfig',function(req,res){
   
    var paymentConfigData = {       
        trainerType : req.body.pymtConfig.trainerType,
        trainingMode : req.body.pymtConfig.trainingMode,
        isExtraActivity : req.body.pymtConfig.isExtraActivity,
        noOfStudents : req.body.pymtConfig.noOfStudents,
        paymentAmt : req.body.pymtConfig.paymentAmt,
   }       
   var book = new PaymentConfigData(paymentConfigData);
   book.save();
});

app.get('/api/paymentConfigList',function(req,res){
    
  PaymentConfigData.find()
              .then(function(aymentConfigurations){
                  res.send(aymentConfigurations);
              });
});

app.get('/api/getPaymentConfig:id',  (req, res) => {
  
  const id = req.params.id;
  PaymentConfigData.findOne({"_id":id})
    .then((paymentConfig)=>{
        res.send(paymentConfig);
    });
})

app.put('/api/updatePaymentConfig',(req,res)=>{
  
   id=req.body._id,
   trainerType = req.body.trainerType,
   trainingMode = req.body.trainingMode,
   isExtraActivity = req.body.isExtraActivity,
   noOfStudents = req.body.noOfStudents,
   paymentAmt = req.body.paymentAmt,

   PaymentConfigData.findByIdAndUpdate({"_id":id},
                              {$set:{"trainerType": trainerType,
                              "trainingMode": trainingMode,
                              "isExtraActivity": isExtraActivity,
                              "noOfStudents": noOfStudents,
                              "paymentAmt": paymentAmt
                             }})
 .then(function(){
     res.send();
 })
})

app.delete('/api/removePaymentConfig/:id',(req,res)=>{
   
  id = req.params.id;
  PaymentConfigData.findByIdAndDelete({"_id":id})
  .then(()=>{
      console.log('success')
      res.send();
  })
})
      
   app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
   });

app.listen(PORT,()=>{
    console.log(`Server Ready on ${PORT}`);   
});

