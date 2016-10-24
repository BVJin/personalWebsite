'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Draft = mongoose.model('Draft'),
    _ = require('lodash');

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

};

/**
 * Update a Draft
 */
exports.update = function(req, res) {

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
