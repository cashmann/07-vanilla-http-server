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
app.get('/api/v1/notes', (req,res) =>{
  requestMessage(res, req.query.id);
});
app.post('/api/cowsay', (req, res) => {
  res.json({
    message: `Hello, ${req.body.name}!`,
  });
});
app.post('/api/v1/notes', (req, res) =>{
  json(res, req.body);
});
app.put('/api/v1/notes', (req,res)=>{
  json(res, req.query);
});
app.delete('/api/v1/notes', (req,res)=>{
  deleteMessage(res, req.query.id);
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

function requestMessage(res, object){
  if(object){
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({message: `ID ${object} was requested`}));
    res.end();
  } else{
    res.statusCode = 400;
    res.statusMessage = 'Invalid Request';
    res.write('{"error": "invalid request: text query required"}');
    res.end();
  }
}

function deleteMessage(res, object){
  if(object){
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');
    res.write({message: `ID ${object} was deleted`});
    res.end();
  } else{
    res.statusCode = 400;
    res.statusMessage = 'Invalid Request';
    res.write('{"error": "invalid request: text query required"}');
    res.end();
  }
}
  
function json(res, object){
  if(object){
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(object));
    res.end();
  } else{
    res.statusCode = 400;
    res.statusMessage = 'Invalid Request';
    res.write('{"error": "invalid request: text query required"}');
    res.end();
  }
}