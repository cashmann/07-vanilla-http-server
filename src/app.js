'use strict';

const http = require('http');

const requestParser = require('./lib/request-parser');

const app = http.createServer(requestHandler);
module.exports = app;

app.start = (port) =>{
  return new Promise((resolve, reject)=>{
    app.listen(port,(err,result)=>{
      if(err){
        reject(err);
      } else{
        resolve(result);
      }
    });
  });
};

function requestHandler(req,res){

}