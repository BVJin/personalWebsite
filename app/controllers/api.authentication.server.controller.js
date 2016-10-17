'use strict';

/**
 * Module dependencies.
 */
var  _ = require('lodash'),
     config = require.main.require('./config/env/development');

exports.isAuthenticated = function(req, res, next){
  // check header or url parameters or post parameters for token
  var token = req.body.apiAuthToken || req.query.apiAuthToken || req.headers['x-auth-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.constant.secretKey, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }

}
