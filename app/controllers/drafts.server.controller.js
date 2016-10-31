'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Draft = mongoose.model('Draft'),
    _ = require('lodash'),
    errorHandler = require('./errors.server.controller');

/**
 * Create a Draft
 */
exports.create = function(req, res) {
  var draft = new Draft(req.body);
  draft.save(function(err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    }else{
      res.status(201).json(draft);
    }
  })
};

/**
 * Show the current Draft
 */
exports.read = function(req, res) {
  Draft.findOne({userId: req.query.userId}).exec(function(err, draft){
    if(err){
      return res.status(400).send({
        messgae: errorHandler.getErrorMessage(err)
      });
    }else{
      if(draft){
        res.json(draft);
      }else{
        res.json({});
      };

    }
  })
};

/**
 * Update a Draft
 */
exports.update = function(req, res) {
  Draft.findOne({userId: req.query.userId}).exec(function(err, draft){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    }else{
      draft.modified = new Date();
      draft.content = req.query.content;
      draft.title = req.query.title;
      draft.save(function(err){
        if(err){
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          })
        }else{
          res.status(204).json(draft);
        }
      });
    }
  })
};

/**
 * Delete an Draft
 */
exports.delete = function(req, res) {

};

/**
 * List of Drafts
 */
exports.list = function(req, res) {

};
