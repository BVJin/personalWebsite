'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    _ = require('lodash'),
    Book = mongoose.model('Book'),
    errorHandler = require('./errors.server.controller');

/**
 * Create a Book
 */
exports.create = function(req, res) {
  var book = new Book(req.body);
  book.save(function(err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    }else{
      res.status(201).json(book);
    }
  })
};

/**
 * Show the current Book
 */
exports.read = function(req, res) {

};

/**
 * Update a Book
 */
exports.update = function(req, res) {

};

/**
 * Delete an Book
 */
exports.delete = function(req, res) {

};

/**
 * List of Books
 */
exports.list = function(req, res) {
  //list all book
  if(!req.query.bookId){
    Book.find().exec(function(err, books){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        })
      }else{
        res.json(books);
      }
    })
  //list one book
  }else{
    Book.findOne({bookId: req.query.bookId}).exec(function(err, book){
      if(err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        })
      }else{
        res.json(book);
      }
    })
  }
};
