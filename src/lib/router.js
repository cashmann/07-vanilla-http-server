'use strict';

const requestParser = require('./request-parser');

const router = exports;

// Make me my router
const routes = exports.routes = {};

// List of supported methods
const methods = ['GET', 'POST', 'DELETE', 'PUT'];

methods.forEach(method => {
  // Initialize this method's route table
  routes[method] = {};

  router[method.toLowerCase()] = (path, callback) => {
    routes[method][path] = callback;
  };
});

router.route = (req, res) => {
  return requestParser(req)
    .then(() => {
      const methodRoutes = routes[req.method];
      const pathRoute = methodRoutes[req.parsedUrl.pathname];
      console.log({ methodRoutes, pathRoute });
      if (pathRoute) {
        pathRoute(req, res);
      } else {
        return Promise.reject(404);
      }
    });
};
//Set routes for each method to be a method
//Create a callback for each method