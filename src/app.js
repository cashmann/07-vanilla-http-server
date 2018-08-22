'use strict';

const http = require('http');

const router = require('./lib/router');
const cowsay = require('cowsay');

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

function requestHandler(req, res) {
  console.log(`${req.method} ${req.url}`);

  router.route(req, res)
    .catch(err => {
      if (err === 404) {
        notFound(res);
        return;
      }

      console.error(err);
      html(res, err.message, 500, 'Internal Server Error');
    });
}

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
  requestMessage(res, req.query.id);
});
router.post('/api/cowsay', (req, res) => {
  json(res, {
    message: `Hello, ${req.body.name}!`,
  });
});
router.post('/api/v1/notes', (req, res) =>{
  json(res, req.body);
});
router.put('/api/v1/notes', (req,res)=>{
  json(res, req.query);
});
router.delete('/api/v1/notes', (req,res)=>{
  deleteMessage(res, req.query.id);
});

require('./api/api');

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
  
function notFound(res){
  res.statusCode = 404;
  res.statusMessage = 'Not Found';
  res.setHeader('Content-Type', 'text/html');
  res.write('Resource Not Found');
  res.end();
}








/* Notes:
we want:
-router.get('/', (req, res)=>...)
  -router.routes.GET{
    '/': function
  }
-router.post('/api/notes',)
  -router.routes.POST{
    'api/notes': function
  }


*/