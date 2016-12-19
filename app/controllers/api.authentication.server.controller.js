'use strict';

/**
 * Module dependencies.
 */
var  _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    config = require.main.require('./config/env/development');

exports.isAuthenticated = function(req, res, next){

  //Angular prevent CSRF
  req.headers['X-XSRF-TOKEN'] = req.cookies['XSRF-TOKEN'];
  req.headers['ACCESS-TOKEN'] = req.cookies['ACCESS-TOKEN'];
  // check header or url parameters or post parameters for token
  var xsrfToken = req.body.apiAuthToken || req.query.apiAuthToken || req.headers['X-XSRF-TOKEN'] || req.headers['x-xsrf-token']; //lower case for post man
  var accessToken = req.headers['ACCESS-TOKEN'] || req.headers['access-token'];
  // decode token
  if (xsrfToken && accessToken) {

    // verifies secret and checks exp
    jwt.verify(accessToken, config.constant.secretKey, function(err, decoded) {

      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        //verify xsrf token
        if(req.session.xsrfToken == xsrfToken){
          req.decoded = decoded;
          next();
        }else{
          return res.status(403).send({
              success: false,
              message: 'Failed to authenticate xsrf token.'
          });
        };

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
