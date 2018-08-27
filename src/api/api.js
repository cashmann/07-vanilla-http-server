'use strict';
const router = require('../lib/router');
const cowsay = require('cowsay');
const Note = require('../lib/models/note');

router.post('/500', (req, res) => {
  throw new Error('Test Error');
});
router.get('/', (req, res) => {
  html(res, '<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><header><nav><ul><li><a href="/cowsay">cowsay</a></li></ul></nav><header><main><!-- project description --></main></body></html>');
});
router.get('/cowsay', (req, res) =>{
  html(res, `<!DOCTYPE html><html><head><title> cowsay </title>  </head><body><h1> cowsay </h1><pre>${cowsay.say({text: req.query.text})}</pre></body></html>`);
});
router.get('/api/cowsay', (req, res) =>{
  json(res, {
    content: cowsay.say(req.query),
  });
});
router.get('/api/v1/notes', (req,res) =>{
  if (req.query.id) {
    return Note.findById(req.query.id)
      .then(note => {
        json(res, note);
      });
  }
});
router.post('/api/cowsay', (req, res) => {
  json(res, {
    message: `Hello, ${req.body.name}!`,
  });
});
router.post('/api/v1/notes', (req, res) =>{
  var newNote = new Note(req.body);
  newNote.save()
    .then(saved=>{
      json(res, saved);
    });
});
router.put('/api/v1/notes', (req,res)=>{
  json(res, req.query);
});
router.delete('/api/v1/notes', (req,res)=>{
  deleteMessage(res, req.query.id);
});

function html(res, content, statusCode=200, statusMessage='OK'){
  res.statusCode = statusCode;
  res.statusMessage = statusMessage;
  res.setHeader('Content-Type', 'text/html');
  res.write(content);
  res.end();
}



function deleteMessage(res, object){
  if(object){
    res.statusCode = 204;
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