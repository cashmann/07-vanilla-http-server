'use strict';

import express from 'express';
const app = express();

export default app;

import cowsay from 'cowsay';

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


app.use((req,res,next)=>{
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.post('/500', (req, res) => {
  throw new Error('Test Error');
});
app.get('/', (req, res) => {
  html(res, '<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><header><nav><ul><li><a href="/cowsay">cowsay</a></li></ul></nav><header><main><!-- project description --></main></body></html>');
});
app.get('/cowsay', (req, res) =>{
  html(res, `<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><h1> cowsay </h1><pre>${cowsay.say({text: req.query.text})}</pre></body></html>`);
});
app.get('/api/cowsay', (req, res) =>{
  res.json({
    content: cowsay.say(req.query),
  });
});


import router from './api/api';
app.use(router);

app.use((err, req, res, next) => {
  console.error(err);
  next(err);
});

function html(res, content, statusCode=200, statusMessage='OK'){
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}