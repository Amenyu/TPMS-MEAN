const express = require('express');
const path = require('path');  
const cors = require('cors');
var bodyparser=require('body-parser');
const jwt = require('jsonwebtoken');

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

      
   app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/frontend/index.html'));
   });

app.listen(PORT,()=>{
    console.log(`Server Ready on ${PORT}`);   
});


