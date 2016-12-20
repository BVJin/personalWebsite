'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
     _ = require('lodash'),
     Article = mongoose.model('Article'),
     errorHandler = require('./errors.server.controller');

/**
 * Create a Article
 */
exports.create = function(req, res) {
  var article = new Article(req.body);
  article.save(function(err){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    }else{
      res.status(201).json(article);
    }
  })
};

/**
 * Show the current Article
 */
exports.read = function(req, res) {
  if(req.query.articleId){
    Article.findOne({
     articleId:req.query.articleId
   }).exec(function(err, article) {
     if (err){
       return res.status(400).send({
         message: errorHandler.getErrorMessage(err)
       })
     }else{
       res.json(article);
     }
   });
  }else{
    res.status(400).send("Article ID is required");
  };
};

/**
 * Update a Article
 */
exports.update = function(req, res) {

};

/**
 * Delete an Article
 */
exports.delete = function(req, res) {
  if(req.query.articleId){
    Article.remove({
     articleId:req.query.articleId
   }).exec(function(err) {
     if (err){
       return res.status(400).send({
         message: errorHandler.getErrorMessage(err)
       });
     }else{
       return res.status(200).send({
         message: "Successfully deleted"
       });
     }
   });
  }else{
    res.status(400).send({
      message: "Article ID is required"
    });
  };
};

/**
 * List  All Article
 */
exports.listAll = function(req, res){
  Article.find().exec(function(err, articles){
    if(err){
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    }else{
      res.json(articles);
    }
  })
};


/**
 * List of One Book's Articles
 */
 exports.listByBookId = function(req, res) {
   if(req.query.bookId){
     Article.find({
   		bookId:req.query.bookId
   	}).exec(function(err, articles) {
   		if (err){
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        })
      }else{
     		res.json(articles);
      }
   	});
   }else{
     res.status(400).send({
       message: "Book ID is required"
     });
   }
 };
