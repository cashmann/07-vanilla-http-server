'use strict';

export default (err, req, res, next)=>{
  console.error(err);
  if(req.headers['accept'] !== 'application/json'){
    next();
    return;
  }
  res.statusCode = 500;
  res.json({
    error: err,
  });
};